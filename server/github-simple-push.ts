import { Express } from 'express';
import fs from 'fs';
import path from 'path';

interface GitHubFile {
  path: string;
  content: string;
}

async function getEssentialProjectFiles(): Promise<GitHubFile[]> {
  const files: GitHubFile[] = [];
  
  // Essential project files and directories to include
  const essentialPaths = [
    // Root config files
    'package.json',
    'tsconfig.json', 
    'replit.nix',
    '.replit',
    'replit.md',
    'tailwind.config.ts',
    'postcss.config.js',
    'vite.config.ts',
    'drizzle.config.ts',
    'SETUP_SUPABASE.md',
    
    // Client directory
    'client',
    
    // Server directory  
    'server',
    
    // Shared directory
    'shared',
    
    // Database directory
    'database'
  ];

  function readFileOrDirectory(itemPath: string, relativePath: string = '') {
    try {
      const fullPath = path.resolve(itemPath);
      const stats = fs.statSync(fullPath);
      
      if (stats.isFile()) {
        // Skip binary files and certain file types
        const ext = path.extname(itemPath).toLowerCase();
        const skipExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
        
        if (skipExtensions.includes(ext)) {
          return;
        }
        
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          files.push({
            path: relativePath || itemPath,
            content
          });
          console.log(`✅ Added: ${relativePath || itemPath}`);
        } catch (error) {
          console.log(`⚠️ Skipped binary file: ${relativePath || itemPath}`);
        }
      } else if (stats.isDirectory()) {
        // Skip certain directories
        const dirName = path.basename(itemPath);
        if (['node_modules', '.git', 'dist', 'build', '.cache', '.local', 'attached_assets', 'saved-chats'].includes(dirName)) {
          return;
        }
        
        const items = fs.readdirSync(fullPath);
        for (const item of items) {
          const itemFullPath = path.join(fullPath, item);
          const itemRelativePath = relativePath ? `${relativePath}/${item}` : `${itemPath}/${item}`;
          readFileOrDirectory(itemFullPath, itemRelativePath);
        }
      }
    } catch (error) {
      console.log(`❌ Error reading ${itemPath}:`, error.message);
    }
  }

  // Process each essential path
  for (const essentialPath of essentialPaths) {
    if (fs.existsSync(essentialPath)) {
      readFileOrDirectory(essentialPath, essentialPath);
    }
  }

  return files;
}

async function uploadFileToGitHub(
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

    if (response.ok) {
      console.log(`✅ Uploaded: ${filepath}`);
      return true;
    } else {
      const errorData = await response.json();
      console.log(`❌ Failed to upload ${filepath}:`, errorData.message);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error uploading ${filepath}:`, error.message);
    return false;
  }
}

export function registerSimpleGitHubRoutes(app: Express) {
  app.post('/api/github/push-simple', async (req, res) => {
    try {
      const { repository, username, branch, commitMessage } = req.body;
      
      const githubToken = process.env.GITHUB_TOKEN;
      if (!githubToken) {
        return res.status(500).json({ error: 'GitHub token not configured' });
      }

      console.log('🚀 Starting simple GitHub push...');

      // Check if repository exists, create if not
      const repoUrl = `https://api.github.com/repos/${username}/${repository}`;
      try {
        const repoResponse = await fetch(repoUrl, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Wealth-Sprint-Game'
          }
        });
        
        if (!repoResponse.ok) {
          console.log('📁 Creating repository...');
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
      } catch (error) {
        return res.status(500).json({ error: 'Failed to check/create repository' });
      }

      // Get essential project files
      console.log('📂 Collecting essential project files...');
      const projectFiles = await getEssentialProjectFiles();
      console.log(`📊 Found ${projectFiles.length} files to upload`);

      if (projectFiles.length === 0) {
        return res.status(400).json({ error: 'No project files found to upload' });
      }

      // Upload files with proper delays
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < projectFiles.length; i++) {
        const file = projectFiles[i];
        
        const success = await uploadFileToGitHub(
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
        } else {
          failCount++;
        }
        
        // Rate limiting delay - GitHub allows 5000 requests per hour
        if (i < projectFiles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 750)); // ~0.75 second delay
        }
      }

      console.log(`🎯 Upload completed: ${successCount} successful, ${failCount} failed`);

      res.json({
        success: true,
        message: `Project uploaded successfully!`,
        stats: {
          totalFiles: projectFiles.length,
          successful: successCount,
          failed: failCount
        },
        url: `https://github.com/${username}/${repository}`
      });

    } catch (error) {
      console.error('❌ GitHub push error:', error);
      res.status(500).json({ 
        error: 'Failed to push project to GitHub. Check your internet connection and GitHub token.' 
      });
    }
  });
}