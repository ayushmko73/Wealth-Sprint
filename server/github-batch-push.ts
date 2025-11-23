import { Express } from 'express';
import fs from 'fs';
import path from 'path';

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: string;
  content: string;
}

interface GitHubFile {
  path: string;
  content: string;
  encoding?: 'utf-8' | 'base64';
}

async function getProjectFiles(): Promise<GitHubFile[]> {
  const files: GitHubFile[] = [];
  
  // Essential directories to include
  const directories = ['client', 'server', 'shared', 'database'];
  
  // Essential root files to include
  const rootFiles = [
    'package.json',
    'package-lock.json',
    'tsconfig.json', 
    'replit.nix',
    '.replit',
    '.gitignore',
    'replit.md',
    'tailwind.config.ts',
    'postcss.config.js',
    'vite.config.ts',
    'drizzle.config.ts',
    'SETUP_SUPABASE.md'
  ];

  function readDirectory(dirPath: string, basePath: string = '') {
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const relativePath = basePath ? `${basePath}/${item}` : item;
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          // Skip certain directories
          if (['node_modules', '.git', 'dist', 'build', '.cache', '.local', 'attached_assets', 'saved-chats'].includes(item)) {
            continue;
          }
          readDirectory(fullPath, relativePath);
        } else {
          const ext = path.extname(item).toLowerCase();
          
          // Skip log files but keep important lock files
          if (item.endsWith('.log') || item === 'yarn.lock') {
            continue;
          }
          
          // Binary file extensions that should be base64 encoded
          const binaryExtensions = [
            '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.svg',
            '.woff', '.woff2', '.ttf', '.eot',
            '.mp3', '.wav', '.ogg',
            '.glb', '.gltf',
            '.zip', '.tar', '.gz'
          ];
          
          const isBinary = binaryExtensions.includes(ext);
          
          try {
            if (isBinary) {
              // Read binary files as base64
              const content = fs.readFileSync(fullPath, 'base64');
              files.push({
                path: relativePath,
                content,
                encoding: 'base64'
              });
            } else {
              // Read text files as UTF-8
              const content = fs.readFileSync(fullPath, 'utf8');
              files.push({
                path: relativePath,
                content,
                encoding: 'utf-8'
              });
            }
          } catch (error) {
            console.log(`Skipped file ${relativePath}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.log(`Error reading directory ${dirPath}:`, error.message);
    }
  }

  // Add root files
  for (const file of rootFiles) {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        files.push({
          path: file,
          content,
          encoding: 'utf-8'
        });
      } catch (error) {
        console.log(`Skipped ${file}:`, error.message);
      }
    }
  }

  // Add directories
  for (const dir of directories) {
    if (fs.existsSync(dir)) {
      readDirectory(dir, dir);
    }
  }

  return files;
}

async function createGitHubTree(
  username: string,
  repository: string,
  files: GitHubFile[],
  githubToken: string,
  baseSha?: string
): Promise<string> {
  const treeItems: GitHubTreeItem[] = files.map(file => {
    const item: any = {
      path: file.path,
      mode: '100644',
      type: 'blob',
      content: file.content
    };
    
    // Add encoding for base64 files
    if (file.encoding === 'base64') {
      item.encoding = 'base64';
    }
    
    return item;
  });

  const treePayload: any = {
    tree: treeItems
  };

  if (baseSha) {
    treePayload.base_tree = baseSha;
  }

  const treeResponse = await fetch(`https://api.github.com/repos/${username}/${repository}/git/trees`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Wealth-Sprint-Game'
    },
    body: JSON.stringify(treePayload)
  });

  if (!treeResponse.ok) {
    const errorData = await treeResponse.json();
    throw new Error(`Failed to create tree: ${errorData.message}`);
  }

  const treeData = await treeResponse.json();
  return treeData.sha;
}

async function createCommit(
  username: string,
  repository: string,
  treeSha: string,
  message: string,
  githubToken: string,
  parentSha?: string
): Promise<string> {
  const commitPayload: any = {
    message,
    tree: treeSha
  };

  if (parentSha) {
    commitPayload.parents = [parentSha];
  }

  const commitResponse = await fetch(`https://api.github.com/repos/${username}/${repository}/git/commits`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Wealth-Sprint-Game'
    },
    body: JSON.stringify(commitPayload)
  });

  if (!commitResponse.ok) {
    const errorData = await commitResponse.json();
    throw new Error(`Failed to create commit: ${errorData.message}`);
  }

  const commitData = await commitResponse.json();
  return commitData.sha;
}

async function updateBranch(
  username: string,
  repository: string,
  branch: string,
  commitSha: string,
  githubToken: string
): Promise<void> {
  const updateResponse = await fetch(`https://api.github.com/repos/${username}/${repository}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Wealth-Sprint-Game'
    },
    body: JSON.stringify({
      sha: commitSha
    })
  });

  if (!updateResponse.ok) {
    const errorData = await updateResponse.json();
    throw new Error(`Failed to update branch: ${errorData.message}`);
  }
}

export function registerBatchGitHubRoutes(app: Express) {
  app.post('/api/github/push-batch', async (req, res) => {
    try {
      const { repository, username, branch, commitMessage, password } = req.body;
      
      // Password check removed as per user request
      
      const githubToken = process.env.GITHUB_TOKEN;
      if (!githubToken) {
        return res.status(500).json({ error: 'GitHub token not configured' });
      }

      console.log('🚀 Starting batch GitHub push...');

      // Check if repository exists, create if not
      const repoUrl = `https://api.github.com/repos/${username}/${repository}`;
      let repositoryExists = false;
      
      try {
        const repoResponse = await fetch(repoUrl, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Wealth-Sprint-Game'
          }
        });
        
        if (repoResponse.ok) {
          repositoryExists = true;
        } else {
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

      // Get latest commit SHA if repository exists
      let latestCommitSha = null;
      if (repositoryExists) {
        try {
          const branchResponse = await fetch(`https://api.github.com/repos/${username}/${repository}/git/refs/heads/${branch}`, {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Wealth-Sprint-Game'
            }
          });
          
          if (branchResponse.ok) {
            const branchData = await branchResponse.json();
            latestCommitSha = branchData.object.sha;
          }
        } catch (error) {
          console.log('No existing branch found, creating new one');
        }
      }

      // Collect all project files
      console.log('📂 Collecting project files...');
      const projectFiles = await getProjectFiles();
      console.log(`📊 Found ${projectFiles.length} files to commit`);

      if (projectFiles.length === 0) {
        return res.status(400).json({ error: 'No project files found to upload' });
      }

      // Create tree with all files
      console.log('🌳 Creating Git tree...');
      const treeSha = await createGitHubTree(username, repository, projectFiles, githubToken);

      // Create single commit with all files
      console.log('💾 Creating commit...');
      const commitSha = await createCommit(username, repository, treeSha, commitMessage, githubToken, latestCommitSha);

      // Update branch to point to new commit
      console.log('🔄 Updating branch...');
      await updateBranch(username, repository, branch, commitSha, githubToken);

      console.log(`✅ Successfully pushed ${projectFiles.length} files in one commit!`);

      res.json({
        success: true,
        message: `Successfully pushed ${projectFiles.length} files to GitHub in one commit!`,
        stats: {
          totalFiles: projectFiles.length,
          commitSha,
          treeSha
        },
        url: `https://github.com/${username}/${repository}`
      });

    } catch (error) {
      console.error('❌ GitHub batch push error:', error);
      res.status(500).json({ 
        error: `Failed to push project to GitHub: ${error.message}` 
      });
    }
  });
}