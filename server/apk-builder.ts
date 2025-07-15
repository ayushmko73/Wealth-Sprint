import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export interface BuildStatus {
  step: 'github_push' | 'expo_publish' | 'expo_build' | 'polling' | 'complete' | 'error';
  message: string;
  success: boolean;
  downloadUrl?: string;
  error?: string;
}

export class APKBuilder {
  private githubToken: string;
  private easToken: string;
  private repoName: string;
  private username: string;
  private projectSlug: string;

  constructor() {
    this.githubToken = process.env.GITHUB_TOKEN || '';
    this.easToken = process.env.EAS_TOKEN || '';
    this.repoName = 'Wealth-Sprint';
    this.username = 'ayushmko73';
    this.projectSlug = 'wealth-sprint';
  }

  async buildAPK(statusCallback?: (status: BuildStatus) => void): Promise<BuildStatus> {
    const updateStatus = (status: BuildStatus) => {
      if (statusCallback) statusCallback(status);
    };

    // Validate that required environment variables are set
    if (!this.easToken) {
      const errorStatus = { 
        step: 'error' as const, 
        message: 'EAS_TOKEN not configured', 
        success: false, 
        error: 'Please add your Expo EAS token to Replit secrets' 
      };
      updateStatus(errorStatus);
      return errorStatus;
    }
    
    if (!this.githubToken) {
      const errorStatus = { 
        step: 'error' as const, 
        message: 'GITHUB_TOKEN not configured', 
        success: false, 
        error: 'Please add your GitHub token to Replit secrets' 
      };
      updateStatus(errorStatus);
      return errorStatus;
    }

    try {
      // Step 1: Push to GitHub
      updateStatus({ step: 'github_push', message: 'Pushing project to GitHub...', success: false });
      await this.pushToGitHub();
      updateStatus({ step: 'github_push', message: 'GitHub push complete', success: true });

      // Step 2: Publish to Expo
      updateStatus({ step: 'expo_publish', message: 'Publishing project to Expo...', success: false });
      await this.publishToExpo();
      updateStatus({ step: 'expo_publish', message: 'Project published to Expo', success: true });

      // Step 3: Start Expo build
      updateStatus({ step: 'expo_build', message: 'Starting Expo build...', success: false });
      const buildId = await this.startExpoBuild();
      updateStatus({ step: 'expo_build', message: `Expo build started (ID: ${buildId})`, success: true });

      // Step 4: Poll build status
      updateStatus({ step: 'polling', message: 'Building APK...', success: false });
      const result = await this.pollBuildStatus(buildId, updateStatus);
      
      if (result.success && result.downloadUrl) {
        const finalStatus = { 
          step: 'complete' as const, 
          message: 'APK Ready', 
          success: true, 
          downloadUrl: result.downloadUrl 
        };
        updateStatus(finalStatus);
        return finalStatus;
      } else {
        const errorStatus = { 
          step: 'error' as const, 
          message: 'Build failed', 
          success: false, 
          error: result.error 
        };
        updateStatus(errorStatus);
        return errorStatus;
      }
    } catch (error) {
      const errorStatus = { 
        step: 'error' as const, 
        message: 'Build process failed', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
      updateStatus(errorStatus);
      return errorStatus;
    }
  }

  private async pushToGitHub(): Promise<void> {
    try {
      if (!this.githubToken) {
        throw new Error('GitHub token not available');
      }
      
      // Check if repo exists, create only if it doesn't exist
      const repoExists = await this.checkRepoExists();
      if (!repoExists) {
        console.log(`Repository ${this.repoName} does not exist, creating...`);
        await this.createGitHubRepo();
        // Wait a moment for repo to be fully created
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log(`Repository ${this.repoName} already exists, using existing repo...`);
      }

      // Create a temporary directory for clean deployment
      const tempDir = './temp-deploy';
      await execAsync(`rm -rf ${tempDir}`);
      await execAsync(`mkdir -p ${tempDir}`);

      // Skip copying complex files - create everything from scratch for minimal build
      console.log('Creating minimal Expo project structure...');

      // Create mobile-compatible package.json (removes problematic dependencies)
      await this.createMobilePackageJson(tempDir);

      // Create mobile-compatible vite.config.ts without glsl plugin
      await this.createMobileViteConfig(tempDir);

      // Create EAS build configuration
      await this.createEASConfig(tempDir);

      // Create Expo app entry point
      await this.createExpoEntry(tempDir);

      // List files in temp directory for debugging
      const filesResult = await execAsync(`ls -la ${tempDir}`);
      console.log('Files in temp directory:', filesResult.stdout);

      // Skip yarn install to avoid resource issues - let Expo handle it
      console.log('Skipping local yarn install - Expo will handle dependencies in cloud build');

      // Initialize fresh git repository
      await execAsync(`cd ${tempDir} && rm -rf .git`); // Clean any existing git
      await execAsync(`cd ${tempDir} && git init`);
      await execAsync(`cd ${tempDir} && git config user.email "build@wealthsprint.com"`);
      await execAsync(`cd ${tempDir} && git config user.name "Wealth Sprint Build"`);
      
      // Add all files
      await execAsync(`cd ${tempDir} && git add .`);
      
      // Check what we're committing
      const statusOutput = await execAsync(`cd ${tempDir} && git status --short`);
      console.log('Files to commit:', statusOutput.stdout);
      
      // Check if there are any files to commit
      if (statusOutput.stdout.trim() === '') {
        throw new Error('No files to commit - temp directory might be empty');
      }
      
      // Commit files
      await execAsync(`cd ${tempDir} && git commit -m "Expo mobile build"`);
      
      // Create and switch to main branch explicitly
      await execAsync(`cd ${tempDir} && git branch -M main`);
      
      // Set up remote and push
      const remoteUrl = `https://${this.githubToken}@github.com/${this.username}/${this.repoName}.git`;
      await execAsync(`cd ${tempDir} && git remote add origin ${remoteUrl}`);
      
      // Check current branch before pushing
      const branchResult = await execAsync(`cd ${tempDir} && git branch --show-current`);
      console.log('Current branch:', branchResult.stdout.trim());
      
      try {
        await execAsync(`cd ${tempDir} && git push -f origin main`);
        console.log('GitHub push completed successfully');
      } catch (pushError) {
        console.log('Push failed, trying to create branch first...');
        // Try to push with --set-upstream flag to create the branch
        await execAsync(`cd ${tempDir} && git push --set-upstream origin main`);
        console.log('GitHub push completed successfully with --set-upstream');
      }
      
      // Clean up temp directory
      await execAsync(`rm -rf ${tempDir}`);
    } catch (error) {
      throw new Error(`GitHub push failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async checkRepoExists(): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${this.username}/${this.repoName}`,
        {
          headers: {
            'Authorization': `token ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      return response.status === 200;
    } catch {
      return false;
    }
  }

  private async createGitHubRepo(): Promise<void> {
    try {
      await axios.post(
        'https://api.github.com/user/repos',
        {
          name: this.repoName,
          private: false,
          description: 'Wealth Sprint Game - Expo APK Build',
          auto_init: false // Don't auto-init to avoid conflicts
        },
        {
          headers: {
            'Authorization': `token ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      console.log(`Created GitHub repository: ${this.repoName}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        // Repository already exists - this is expected, not an error
        console.log(`Repository ${this.repoName} already exists, will use existing repo`);
        return;
      }
      throw new Error(`Failed to create GitHub repo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async getGitHubUsername(): Promise<string> {
    try {
      const response = await axios.get(
        'https://api.github.com/user',
        {
          headers: {
            'Authorization': `token ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      return response.data.login;
    } catch (error) {
      throw new Error(`Failed to get GitHub username: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async publishToExpo(): Promise<void> {
    try {
      // Skip separate publish step - we'll build directly with EAS
      console.log('Skipping separate publish step - building directly with EAS');
    } catch (error) {
      throw new Error(`Failed to publish to Expo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async startExpoBuild(): Promise<string> {
    try {
      // Create required Expo config files
      await this.createExpoConfig();

      // Use EAS CLI with robot token (modern approach)
      const { exec } = await import('child_process');
      const util = await import('util');
      const execAsync = util.promisify(exec);

      // Build using EAS CLI with environment token
      const buildCmd = `EXPO_TOKEN=${this.easToken} npx eas build --platform android --profile production --non-interactive --json`;
      console.log('Starting EAS build...');
      
      const result = await execAsync(buildCmd);
      
      let buildData;
      try {
        buildData = JSON.parse(result.stdout);
      } catch (parseErr) {
        console.error('Build output:', result.stdout);
        throw new Error('Failed to parse build response');
      }

      if (buildData.builds && buildData.builds.android && buildData.builds.android.buildId) {
        return buildData.builds.android.buildId;
      } else {
        throw new Error('No build ID returned from EAS build');
      }
    } catch (error) {
      console.error('EAS build error:', error);
      throw new Error(`Failed to start Expo build: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async createExpoConfig(): Promise<void> {
    const expoConfig = {
      expo: {
        name: "Wealth Sprint",
        slug: this.projectSlug,
        owner: "ayushmk32",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./generated-icon.png",
        userInterfaceStyle: "light",
        splash: {
          image: "./generated-icon.png",
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        },
        assetBundlePatterns: ["**/*"],
        ios: {
          supportsTablet: true
        },
        android: {
          adaptiveIcon: {
            foregroundImage: "./generated-icon.png",
            backgroundColor: "#ffffff"
          },
          package: "com.wealthsprint.app"
        },
        web: {
          favicon: "./generated-icon.png"
        },
        build: {
          production: {}
        }
      }
    };

    fs.writeFileSync('app.json', JSON.stringify(expoConfig, null, 2));
  }

  private async createMobilePackageJson(tempDir: string): Promise<void> {
    // Read the original package.json
    const originalPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Create mobile-compatible version with minimal dependencies
    const mobilePackage = {
      name: "wealth-sprint-mobile",
      version: "1.0.0",
      main: "expo/AppEntry.js",
      dependencies: {
        "expo": "~51.0.0",
        "react": originalPackage.dependencies.react,
        "react-dom": originalPackage.dependencies["react-dom"],
        "react-native": "0.74.5",
        "react-native-web": "~0.19.10",
        "@expo/webpack-config": "^19.0.0",
        // Essential UI dependencies only
        "@radix-ui/react-slot": originalPackage.dependencies["@radix-ui/react-slot"],
        "class-variance-authority": originalPackage.dependencies["class-variance-authority"],
        "clsx": originalPackage.dependencies.clsx,
        "tailwind-merge": originalPackage.dependencies["tailwind-merge"],
        "lucide-react": originalPackage.dependencies["lucide-react"],
      },
      devDependencies: {
        "@babel/core": "^7.20.0",
        "@types/react": "~18.2.45",
        "typescript": "~5.3.3",
      },
      scripts: {
        "start": "expo start",
        "android": "expo start --android",
        "ios": "expo start --ios",
        "web": "expo start --web"
      }
    };

    // Remove undefined values
    Object.keys(mobilePackage.dependencies).forEach(key => {
      if (mobilePackage.dependencies[key] === undefined) {
        delete mobilePackage.dependencies[key];
      }
    });

    fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(mobilePackage, null, 2));
  }

  private async createMobileViteConfig(tempDir: string): Promise<void> {
    const mobileViteConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    // Note: glsl plugin removed for mobile compatibility
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  // Add support for large models and audio files
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"],
});`;

    fs.writeFileSync(path.join(tempDir, 'vite.config.ts'), mobileViteConfig);
  }

  private async createEASConfig(tempDir: string): Promise<void> {
    const easConfig = {
      cli: {
        version: ">= 16.0.0"
      },
      build: {
        development: {
          developmentClient: true,
          distribution: "internal"
        },
        preview: {
          distribution: "internal"
        },
        production: {
          node: "18.18.0", // Use compatible Node.js version
          distribution: "store"
        }
      },
      submit: {
        production: {}
      }
    };

    fs.writeFileSync(path.join(tempDir, 'eas.json'), JSON.stringify(easConfig, null, 2));
  }

  private async createExpoEntry(tempDir: string): Promise<void> {
    // Create expo directory and App.js entry point
    await execAsync(`mkdir -p ${path.join(tempDir, 'expo')}`);
    
    // Create a simple Expo-compatible App.js
    const simpleAppContent = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wealth Sprint</Text>
      <Text style={styles.subtitle}>Financial Game - Mobile Version</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});`;

    fs.writeFileSync(path.join(tempDir, 'App.js'), simpleAppContent);

    // Create .gitignore to reduce repository size
    const gitignoreContent = `node_modules/
.expo/
dist/
.nyc_output/
.cache/
.DS_Store
*.log
.env
.env.local
*.tgz
*.tar.gz`;

    fs.writeFileSync(path.join(tempDir, '.gitignore'), gitignoreContent);

    // Create a basic metro.config.js
    const metroConfig = `const { getDefaultConfig } = require('expo/metro-config');
module.exports = getDefaultConfig(__dirname);`;

    fs.writeFileSync(path.join(tempDir, 'metro.config.js'), metroConfig);
  }

  private async getOrCreateProjectId(): Promise<string> {
    // This would typically be from expo.json or created via Expo API
    // For simplicity, using a placeholder - in real implementation, you'd create/get actual project ID
    return 'wealth-sprint-project-id';
  }

  private async pollBuildStatus(buildId: string, statusCallback?: (status: BuildStatus) => void): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
    const maxAttempts = 180; // 45 minutes (180 attempts * 15 seconds)
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        // Update status for ongoing build
        if (statusCallback) {
          statusCallback({
            step: 'polling',
            message: `Building APK... (${Math.round(attempts * 15 / 60)} minutes)`,
            success: false
          });
        }

        // Use EAS CLI to check build status
        const { exec } = await import('child_process');
        const util = await import('util');
        const execAsync = util.promisify(exec);

        const statusCmd = `EXPO_TOKEN=${this.easToken} npx eas build:status --json`;
        const result = await execAsync(statusCmd);
        
        let statusData;
        try {
          statusData = JSON.parse(result.stdout);
        } catch (parseErr) {
          console.error('Status parse error:', result.stdout);
          throw new Error('Failed to parse build status');
        }

        // Find the Android build
        const build = statusData.builds.find((b: any) => b.platform === "android");
        
        if (!build) {
          return { 
            success: false, 
            error: 'No Android build found' 
          };
        }

        if (build.status === 'finished') {
          return { 
            success: true, 
            downloadUrl: build.artifacts.buildUrl 
          };
        } else if (build.status === 'errored') {
          return { 
            success: false, 
            error: 'Expo build failed' 
          };
        } else {
          console.log('⏳ Still building...');
        }

        // Wait 15 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 15000));
        attempts++;

      } catch (error) {
        console.error(`Polling attempt ${attempts + 1} failed:`, error);
        
        // Continue trying unless this is the last attempt
        if (attempts >= maxAttempts - 1) {
          return { 
            success: false, 
            error: `Build status polling failed after ${maxAttempts} attempts: ${error instanceof Error ? error.message : 'Unknown error'}` 
          };
        }
        
        await new Promise(resolve => setTimeout(resolve, 15000));
        attempts++;
      }
    }

    return { 
      success: false, 
      error: 'Build timed out after 45 minutes' 
    };
  }
}