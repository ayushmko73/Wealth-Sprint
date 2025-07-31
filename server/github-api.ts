import { Express } from 'express';
import fs from 'fs';
import path from 'path';

interface GitHubPushRequest {
  repository: string;
  username: string;
  branch: string;
  filepath: string;
  content: string;
  commitMessage: string;
}

async function cleanupRepository(username: string, repository: string, branch: string, githubToken: string) {
  // Files that should be removed from the repository
  const filesToRemove = [
    'App.js',
    'babel.config.js',
    'eas.json', 
    'generated-icon.png',
    'metro.config.js',
    'package.json',
    'vite.config.ts',
    'yarn.lock'
  ];

  for (const filename of filesToRemove) {
    try {
      const fileUrl = `https://api.github.com/repos/${username}/${repository}/contents/${filename}`;
      const fileResponse = await fetch(fileUrl, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Wealth-Sprint-Game'
        }
      });
      
      if (fileResponse.ok) {
        const fileData = await fileResponse.json();
        
        // Delete the file
        await fetch(fileUrl, {
          method: 'DELETE',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Wealth-Sprint-Game'
          },
          body: JSON.stringify({
            message: `🧹 Remove ${filename} - cleanup repository`,
            sha: fileData.sha,
            branch: branch
          })
        });
        
        console.log(`Removed unwanted file: ${filename}`);
      }
    } catch (error) {
      console.log(`File ${filename} not found or already removed`);
    }
  }
}

export function registerGitHubRoutes(app: Express) {
  // Push game data to GitHub repository
  app.post('/api/github/push', async (req, res) => {
    try {
      const { repository, username, branch, filepath, content, commitMessage }: GitHubPushRequest = req.body;
      
      // Get GitHub token from environment
      const githubToken = process.env.GITHUB_TOKEN;
      if (!githubToken) {
        return res.status(500).json({ error: 'GitHub token not configured' });
      }

      // Step 1: Get repository info and check if it exists
      const repoUrl = `https://api.github.com/repos/${username}/${repository}`;
      let repoExists = false;
      
      try {
        const repoResponse = await fetch(repoUrl, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Wealth-Sprint-Game'
          }
        });
        
        if (repoResponse.ok) {
          repoExists = true;
        }
      } catch (error) {
        console.log('Repository does not exist or is not accessible');
      }

      // Step 2: Create repository if it doesn't exist
      if (!repoExists) {
        const createRepoResponse = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Wealth-Sprint-Game'
          },
          body: JSON.stringify({
            name: repository,
            description: 'Wealth Sprint Game Save Data',
            private: false,
            auto_init: true
          })
        });

        if (!createRepoResponse.ok) {
          const errorData = await createRepoResponse.json();
          return res.status(500).json({ 
            error: `Failed to create repository: ${errorData.message}` 
          });
        }

        // Wait a moment for repository to be initialized
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Step 3: Check if file exists to get its SHA (required for updates)
      let fileSha = null;
      const fileUrl = `https://api.github.com/repos/${username}/${repository}/contents/${filepath}`;
      
      try {
        const fileResponse = await fetch(fileUrl, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Wealth-Sprint-Game'
          }
        });
        
        if (fileResponse.ok) {
          const fileData = await fileResponse.json();
          fileSha = fileData.sha;
        }
      } catch (error) {
        console.log('File does not exist, will create new file');
      }

      // Step 4: Create .gitignore file first (if it doesn't exist)
      const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock

# Build outputs
dist/
build/
*.tgz
*.tar.gz

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE and editor files
.vscode/
.idea/
*.swp
.DS_Store

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Config files
babel.config.js
metro.config.js
vite.config.ts
tsconfig.json
tailwind.config.ts
postcss.config.js
drizzle.config.ts
eas.json

# Generated files
generated-icon.png

# Database
database/
saved-chats/

# Expo
.expo/
expo-env.d.ts

# Only keep essential game data
!data/
!README.md
`;

      // Create or update .gitignore
      const gitignoreUrl = `https://api.github.com/repos/${username}/${repository}/contents/.gitignore`;
      let gitignoreSha = null;

      try {
        const gitignoreResponse = await fetch(gitignoreUrl, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Wealth-Sprint-Game'
          }
        });
        
        if (gitignoreResponse.ok) {
          const gitignoreData = await gitignoreResponse.json();
          gitignoreSha = gitignoreData.sha;
        }
      } catch (error) {
        console.log('.gitignore does not exist, will create new file');
      }

      const gitignorePayload: any = {
        message: '📝 Add .gitignore for clean repository',
        content: Buffer.from(gitignoreContent).toString('base64'),
        branch: branch
      };

      if (gitignoreSha) {
        gitignorePayload.sha = gitignoreSha;
      }

      await fetch(gitignoreUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Wealth-Sprint-Game'
        },
        body: JSON.stringify(gitignorePayload)
      });

      // Step 5: Create README.md if it doesn't exist
      const readmeContent = `# Wealth Sprint Game Save Data

This repository contains save data from the Wealth Sprint financial simulation game.

## Contents

- \`data/save.json\` - Complete game save data including player stats, financial data, and progress

## About Wealth Sprint

Wealth Sprint is a sophisticated 2D financial simulation game that leverages AI-driven emotional intelligence to create immersive, interactive business strategy experiences.

Last updated: ${new Date().toLocaleDateString()}
`;

      const readmeUrl = `https://api.github.com/repos/${username}/${repository}/contents/README.md`;
      let readmeSha = null;

      try {
        const readmeResponse = await fetch(readmeUrl, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Wealth-Sprint-Game'
          }
        });
        
        if (readmeResponse.ok) {
          const readmeData = await readmeResponse.json();
          readmeSha = readmeData.sha;
        }
      } catch (error) {
        console.log('README.md does not exist, will create new file');
      }

      const readmePayload: any = {
        message: '📚 Add README for Wealth Sprint save data',
        content: Buffer.from(readmeContent).toString('base64'),
        branch: branch
      };

      if (readmeSha) {
        readmePayload.sha = readmeSha;
      }

      await fetch(readmeUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Wealth-Sprint-Game'
        },
        body: JSON.stringify(readmePayload)
      });

      // Step 6: Clean up unwanted files from repository
      await cleanupRepository(username, repository, branch, githubToken);

      // Step 7: Create or update the save data file
      const updateFilePayload: any = {
        message: commitMessage,
        content: Buffer.from(content).toString('base64'),
        branch: branch
      };

      if (fileSha) {
        updateFilePayload.sha = fileSha;
      }

      const updateResponse = await fetch(fileUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Wealth-Sprint-Game'
        },
        body: JSON.stringify(updateFilePayload)
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        return res.status(500).json({ 
          error: `Failed to push to GitHub: ${errorData.message}` 
        });
      }

      const result = await updateResponse.json();
      
      res.json({
        success: true,
        message: 'Game data successfully pushed to GitHub',
        url: result.content.html_url,
        commit: result.commit.sha
      });

    } catch (error) {
      console.error('GitHub push error:', error);
      res.status(500).json({ 
        error: 'Failed to push to GitHub. Check your internet connection and GitHub token.' 
      });
    }
  });

  // Clean up repository by removing unwanted files
  app.post('/api/github/cleanup', async (req, res) => {
    try {
      const { repository, username, branch } = req.body;
      
      const githubToken = process.env.GITHUB_TOKEN;
      if (!githubToken) {
        return res.status(500).json({ error: 'GitHub token not configured' });
      }

      // Clean up unwanted files
      await cleanupRepository(username, repository, branch, githubToken);

      res.json({
        success: true,
        message: 'Repository cleaned up successfully - removed unwanted files'
      });

    } catch (error) {
      console.error('GitHub cleanup error:', error);
      res.status(500).json({ 
        error: 'Failed to cleanup repository. Check your GitHub token or internet connection.' 
      });
    }
  });
}