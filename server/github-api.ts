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

      // Step 4: Create or update the file
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
}