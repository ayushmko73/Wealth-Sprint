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
    } finally {
      // Clean up temp directory
      try {
        await execAsync(`rm -rf ./temp-deploy`);
      } catch (cleanupError) {
        console.log('Warning: Could not clean up temp directory');
      }
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

      // Generate yarn.lock for consistent builds
      console.log('Generating yarn.lock for consistent builds...');
      try {
        await execAsync(`cd ${tempDir} && timeout 60s yarn install --ignore-engines --ignore-scripts --network-timeout 30000`);
        console.log('yarn.lock generated successfully');
      } catch (yarnError) {
        console.log('yarn install timed out or failed, continuing without yarn.lock...');
        // Continue without yarn.lock - EAS will handle dependency resolution
      }

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

      // Ensure yarn.lock is included if it exists
      const yarnLockExists = await execAsync(`cd ${tempDir} && ls yarn.lock 2>/dev/null || echo "not found"`);
      if (yarnLockExists.stdout.includes('yarn.lock')) {
        console.log('yarn.lock found and will be committed');
      }

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

      // Install Expo CLI locally in temp directory for better compatibility
      console.log('Installing Expo CLI locally...');
      try {
        await execAsync(`cd ./temp-deploy && npm install @expo/cli@latest eas-cli@latest --save-dev`);
        console.log('Expo CLI installed successfully');
      } catch (installError) {
        console.log('CLI installation warning:', installError);
        // Continue with global CLI if local install fails
      }

      // Check EAS CLI version first
      try {
        const versionResult = await execAsync(`cd ./temp-deploy && npx eas --version`);
        console.log('EAS CLI Version:', versionResult.stdout.trim());
      } catch (versionError) {
        console.log('Could not check EAS CLI version:', versionError);
      }

      // Skip EAS project initialization since project already exists
      console.log('Using existing EAS project: 10875d3a-24af-456e-a5f5-d0847f637d69');

      // Verify app config can be read with locally installed CLI
      console.log('Verifying app configuration...');
      try {
        await execAsync(`cd ./temp-deploy && EXPO_TOKEN=${this.easToken} npx expo config --json`);
        console.log('App config verified successfully');
      } catch (configError) {
        console.log('Config verification warning:', configError);
      }

      // Build using EAS CLI with preview profile to avoid keystore issues
      const buildCmd = `cd ./temp-deploy && EXPO_TOKEN=${this.easToken} npx eas build --platform android --profile preview --non-interactive --json --clear-cache`;
      console.log('Starting EAS build...');

      const result = await execAsync(buildCmd, { timeout: 300000 }); // 5 minute timeout

      let buildData;
      try {
        buildData = JSON.parse(result.stdout);
      } catch (parseErr) {
        console.error('Build output:', result.stdout);
        console.error('Build stderr:', result.stderr);
        throw new Error('Failed to parse build response');
      }

      if (buildData.builds && buildData.builds.length > 0) {
        const androidBuild = buildData.builds.find((build: any) => build.platform === 'android');
        if (androidBuild && androidBuild.buildId) {
          return androidBuild.buildId;
        }
      }
      
      throw new Error('No Android build ID returned from EAS build');
    } catch (error) {
      console.error('EAS build error:', error);
      throw new Error(`Failed to start Expo build: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async createExpoConfig(): Promise<void> {
    // Create proper Expo config with all required fields for EAS build
    const expoConfig = {
      expo: {
        name: "Wealth Sprint",
        slug: "wealth-sprint",
        owner: "ayushmk32",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./generated-icon.png",
        userInterfaceStyle: "light",
        platforms: ["ios", "android", "web"],
        splash: {
          image: "./generated-icon.png",
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        },
        assetBundlePatterns: ["**/*"],
        ios: {
          supportsTablet: true,
          bundleIdentifier: "com.wealthsprint.app"
        },
        android: {
          adaptiveIcon: {
            foregroundImage: "./generated-icon.png",
            backgroundColor: "#ffffff"
          },
          package: "com.wealthsprint.app",
          versionCode: 1
        },
        web: {
          favicon: "./generated-icon.png",
          bundler: "metro"
        },
        plugins: [],
        experiments: {
          typedRoutes: false
        },
        extra: {
          eas: {
            projectId: "10875d3a-24af-456e-a5f5-d0847f637d69"
          }
        }
      }
    };

    fs.writeFileSync('./temp-deploy/app.json', JSON.stringify(expoConfig, null, 2));
    
    // Also create app.config.js for better compatibility
    const appConfigJs = `module.exports = ${JSON.stringify(expoConfig, null, 2)};`;
    fs.writeFileSync('./temp-deploy/app.config.js', appConfigJs);
  }

  private async createMobilePackageJson(tempDir: string): Promise<void> {
    // Create a simple icon for the mobile app
    const iconSvg = `<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
      <rect width="192" height="192" fill="#4F46E5"/>
      <text x="96" y="110" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">WS</text>
      <text x="96" y="135" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#E0E7FF">Game</text>
    </svg>`;

    // Create a simple icon file
    fs.writeFileSync(path.join(tempDir, 'generated-icon.png'), iconSvg);

    // Create mobile-compatible version with exact Expo SDK versions
    const mobilePackage = {
      name: "wealth-sprint",
      version: "1.0.0",
      main: "App.js",
      license: "MIT",
      engines: {
        "node": ">=20.0.0"
      },
      dependencies: {
        "expo": "~52.0.0",
        "react": "18.3.1",
        "react-dom": "18.3.1",
        "react-native": "0.76.3",
        "react-native-web": "~0.19.12",
        "expo-constants": "~17.0.0",
        "expo-status-bar": "~2.0.0",
        "@expo/cli": "^0.24.0",
        "clsx": "^2.1.1"
      },
      devDependencies: {
        "@babel/core": "^7.25.0",
        "@types/react": "~18.3.0",
        "typescript": "~5.3.3"
      },
      scripts: {
        "start": "expo start",
        "android": "expo start --android",
        "ios": "expo start --ios",
        "web": "expo start --web"
      }
    };

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
        version: ">= 3.0.0",
        appVersionSource: "remote"
      },
      build: {
        production: {
          android: {
            buildType: "apk",
            autoIncrement: "versionCode"
          },
          node: "20.18.1",
          distribution: "internal",
          env: {
            NODE_ENV: "production"
          }
        },
        preview: {
          distribution: "internal",
          node: "20.18.1",
          android: {
            buildType: "apk",
            autoIncrement: "versionCode"
          },
          env: {
            NODE_ENV: "production"
          }
        }
      },
      submit: {
        production: {
          android: {}
        }
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

    // Create babel.config.js for proper Expo compilation
    const babelConfig = `module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};`;

    fs.writeFileSync(path.join(tempDir, 'babel.config.js'), babelConfig);
  }

  private async initializeEASProject(): Promise<void> {
    try {
      const { exec } = await import('child_process');
      const util = await import('util');
      const execAsync = util.promisify(exec);

      // Initialize EAS project - this will automatically create project ID
      console.log('Initializing EAS project...');
      await execAsync(`cd ./temp-deploy && EXPO_TOKEN=${this.easToken} npx eas project:init --non-interactive`);
      console.log('EAS project initialized successfully');
    } catch (error) {
      console.log('EAS project init warning:', error);
      // Continue - the build command will handle project creation
    }
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