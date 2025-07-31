import { Express } from 'express';
import fs from 'fs';
import path from 'path';

interface GitHubFile {
  path: string;
  content: string;
  type: 'file' | 'dir';
}

interface GitHubFullPushRequest {
  repository: string;
  username: string;
  branch: string;
  commitMessage: string;
}

async function getAllProjectFiles(basePath: string = '.'): Promise<GitHubFile[]> {
  const files: GitHubFile[] = [];
  
  // Files and directories to exclude
  const excludePatterns = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.env',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local',
    '.vscode',
    '.idea',
    '*.log',
    'logs',
    '.DS_Store',
    'saved-chats',
    'database',
    '.expo',
    'attached_assets'
  ];

  function shouldExclude(filePath: string): boolean {
    return excludePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(filePath);
      }
      return filePath.includes(pattern);
    });
  }

  function readDirectory(dirPath: string, relativePath: string = '') {
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const itemRelativePath = relativePath ? path.join(relativePath, item) : item;
        
        if (shouldExclude(itemRelativePath) || shouldExclude(item)) {
          continue;
        }
        
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          readDirectory(fullPath, itemRelativePath);
        } else if (stats.isFile()) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            files.push({
              path: itemRelativePath.replace(/\\/g, '/'), // Ensure forward slashes
              content,
              type: 'file'
            });
          } catch (error) {
            console.log(`Skipping binary file: ${itemRelativePath}`);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
    }
  }

  readDirectory(basePath);
  return files;
}

async function createOrUpdateFile(
  username: string,
  repository: string,
  branch: string,
  filepath: string,
  content: string,
  githubToken: string,
  commitMessage: string
): Promise<boolean> {
  try {
    const fileUrl = `https://api.github.com/repos/${username}/${repository}/contents/${filepath}`;
    
    // Check if file exists
    let fileSha = null;
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
      // File doesn't exist, will create new
    }

    const payload: any = {
      message: commitMessage,
      content: Buffer.from(content).toString('base64'),
      branch: branch
    };

    if (fileSha) {
      payload.sha = fileSha;
    }

    const response = await fetch(fileUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Wealth-Sprint-Game'
      },
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (error) {
    console.error(`Error creating/updating file ${filepath}:`, error);
    return false;
  }
}

export function registerFullGitHubRoutes(app: Express) {
  // Push entire project to GitHub
  app.post('/api/github/push-full', async (req, res) => {
    try {
      const { repository, username, branch, commitMessage }: GitHubFullPushRequest = req.body;
      
      const githubToken = process.env.GITHUB_TOKEN;
      if (!githubToken) {
        return res.status(500).json({ error: 'GitHub token not configured' });
      }

      // Check if repository exists, create if not
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
        
        repoExists = repoResponse.ok;
      } catch (error) {
        // Repository doesn't exist
      }

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
            description: 'Wealth Sprint - Financial Simulation Game',
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

        // Wait for repository initialization
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Get all project files
      console.log('Collecting project files...');
      const projectFiles = await getAllProjectFiles();
      console.log(`Found ${projectFiles.length} files to upload`);

      // Create .gitignore for future reference
      const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

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

# Database
database/
saved-chats/

# Expo
.expo/
expo-env.d.ts

# Generated files
generated-icon.png
`;

      // Add .gitignore to files list
      projectFiles.unshift({
        path: '.gitignore',
        content: gitignoreContent,
        type: 'file'
      });

      // Upload files in batches to avoid rate limiting
      const batchSize = 10;
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < projectFiles.length; i += batchSize) {
        const batch = projectFiles.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (file) => {
          const success = await createOrUpdateFile(
            username,
            repository,
            branch,
            file.path,
            file.content,
            githubToken,
            `${commitMessage} - ${file.path}`
          );
          
          if (success) {
            successCount++;
            console.log(`✅ Uploaded: ${file.path}`);
          } else {
            failCount++;
            console.log(`❌ Failed: ${file.path}`);
          }
          
          return success;
        });

        await Promise.all(batchPromises);
        
        // Rate limiting delay
        if (i + batchSize < projectFiles.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      console.log(`Upload completed: ${successCount} successful, ${failCount} failed`);

      res.json({
        success: true,
        message: `Project uploaded to GitHub successfully!`,
        stats: {
          totalFiles: projectFiles.length,
          successful: successCount,
          failed: failCount
        },
        url: `https://github.com/${username}/${repository}`
      });

    } catch (error) {
      console.error('GitHub full push error:', error);
      res.status(500).json({ 
        error: 'Failed to push project to GitHub. Check your internet connection and GitHub token.' 
      });
    }
  });
}