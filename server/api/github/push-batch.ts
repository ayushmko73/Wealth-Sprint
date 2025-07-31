import type { VercelRequest, VercelResponse } from '@vercel/node';

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: string;
  content: string;
}

interface GitHubFile {
  path: string;
  content: string;
}

// Note: For Vercel deployment, file system access is limited
// This is a simplified version that would work with uploaded files
async function createGitHubTree(
  username: string,
  repository: string,
  files: GitHubFile[],
  githubToken: string,
  baseSha?: string
): Promise<string> {
  const treeItems: GitHubTreeItem[] = files.map(file => ({
    path: file.path,
    mode: '100644',
    type: 'blob',
    content: file.content
  }));

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { repository, username, branch, commitMessage, password, files } = req.body;
    
    // Check password
    if (password !== 'Ak@github123') {
      return res.status(401).json({ error: 'Invalid password' });
    }

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

    // Use provided files or return error
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No project files provided to upload' });
    }

    console.log(`📊 Found ${files.length} files to commit`);

    // Create tree with all files
    console.log('🌳 Creating Git tree...');
    const treeSha = await createGitHubTree(username, repository, files, githubToken);

    // Create single commit with all files
    console.log('💾 Creating commit...');
    const commitSha = await createCommit(username, repository, treeSha, commitMessage, githubToken, latestCommitSha);

    // Update branch to point to new commit
    console.log('🔄 Updating branch...');
    await updateBranch(username, repository, branch, commitSha, githubToken);

    console.log(`✅ Successfully pushed ${files.length} files in one commit!`);

    res.json({
      success: true,
      message: `Successfully pushed ${files.length} files to GitHub in one commit!`,
      stats: {
        totalFiles: files.length,
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
}