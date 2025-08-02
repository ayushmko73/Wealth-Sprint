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

async function updateReference(
  username: string,
  repository: string,
  commitSha: string,
  githubToken: string
): Promise<void> {
  const refResponse = await fetch(`https://api.github.com/repos/${username}/${repository}/git/refs/heads/main`, {
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

  if (!refResponse.ok) {
    const errorData = await refResponse.json();
    throw new Error(`Failed to update reference: ${errorData.message}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, repository, files, commitMessage, githubToken } = req.body;

    if (!username || !repository || !files || !githubToken) {
      return res.status(400).json({ 
        message: 'Missing required fields: username, repository, files, githubToken' 
      });
    }

    // Get current commit SHA (optional for initial push)
    let currentCommitSha: string | undefined;
    try {
      const refResponse = await fetch(`https://api.github.com/repos/${username}/${repository}/git/refs/heads/main`, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Wealth-Sprint-Game'
        }
      });
      
      if (refResponse.ok) {
        const refData = await refResponse.json();
        currentCommitSha = refData.object.sha;
      }
    } catch (error) {
      // Repository might not exist or no main branch yet
      console.log('No existing main branch found, creating initial commit');
    }

    // Create tree
    const treeSha = await createGitHubTree(username, repository, files, githubToken);

    // Create commit
    const commitSha = await createCommit(
      username, 
      repository, 
      treeSha, 
      commitMessage || 'Deploy Wealth Sprint Game', 
      githubToken,
      currentCommitSha
    );

    // Update reference
    await updateReference(username, repository, commitSha, githubToken);

    res.status(200).json({
      success: true,
      message: 'Files successfully pushed to GitHub',
      commitSha,
      filesCount: files.length,
      repositoryUrl: `https://github.com/${username}/${repository}`
    });

  } catch (error) {
    console.error('GitHub push error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to push to GitHub';
    const errorString = error instanceof Error ? error.toString() : String(error);
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: errorString
    });
  }
}