# Vercel Deployment Guide for Wealth Sprint

## Overview
This guide will help you deploy Wealth Sprint to Vercel as a static website with serverless API functions.

## Prerequisites
1. Vercel account
2. GitHub account
3. GitHub token for the push functionality

## Step-by-Step Deployment Process

### 1. Push Code to GitHub
First, use the existing "Push to GitHub" functionality in your Replit to upload all your code to GitHub.

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it as a Vite project

### 3. Configure Build Settings
In Vercel project settings:
- **Framework Preset**: Vite
- **Root Directory**: `client` (important!)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Environment Variables
Add these environment variables in Vercel dashboard:
- `GITHUB_TOKEN`: Your GitHub personal access token
- `NODE_ENV`: `production`
- `DATABASE_URL`: Your database connection string (if using database features)

### 5. Domain Configuration
Your domain `wealth-sprint-3xxw.vercel.app` should automatically work once deployed.

## Key Changes Made for Vercel Compatibility

### 1. Serverless API Functions
- Moved API endpoints to `server/api/` directory
- Each endpoint is now a Vercel serverless function
- Removed Express.js server dependency for API routes

### 2. Static Build
- Frontend builds to static files
- No server-side rendering dependencies
- Optimized for CDN delivery

### 3. Database Considerations
- For full functionality, you'll need a hosted database (Supabase, PlanetScale, etc.)
- Current setup uses localStorage for game state
- Chat history and advanced features may need database integration

## File Structure Changes
```
├── client/                 # Frontend React app
│   ├── src/
│   ├── package.json       # Client-only dependencies
│   └── dist/              # Build output
├── server/
│   └── api/               # Vercel serverless functions
│       ├── github/
│       └── sage/
├── vercel.json            # Vercel configuration
├── .vercelignore          # Files to ignore during build
└── vite.config.vercel.ts  # Vercel-optimized Vite config
```

## Deployment Commands

### Local Development
```bash
cd client
npm install
npm run dev
```

### Build for Production
```bash
cd client
npm run build
```

### Deploy to Vercel
1. Push to GitHub
2. Vercel auto-deploys from main branch
3. Or use Vercel CLI: `vercel --prod`

## Features That Work on Vercel
✅ Full game functionality
✅ Settings and configuration
✅ Local game state persistence
✅ GitHub push functionality
✅ UI components and styling
✅ 3D graphics and animations

## Features That Need Database Integration
⚠️ Chat history persistence
⚠️ Multiplayer features
⚠️ Cross-device sync
⚠️ Advanced AI learning

## Troubleshooting

### Build Errors
- Ensure all imports use relative paths
- Check for Node.js-specific code in client
- Verify all dependencies are in client/package.json

### API Function Errors
- Check Vercel function logs
- Ensure environment variables are set
- Verify GitHub token permissions

### Performance Issues
- Enable Vercel Edge Functions for better performance
- Use Vercel's Image Optimization
- Implement proper caching headers

## Cost Considerations
- Vercel Hobby plan: Free tier with limitations
- Pro plan: $20/month for higher limits
- Function executions and bandwidth usage apply

## Security Notes
- Environment variables are secure in Vercel
- GitHub token should have minimal required permissions
- Consider implementing rate limiting for API functions

## Next Steps After Deployment
1. Test all functionality on the live site
2. Configure custom domain if needed
3. Set up analytics and monitoring
4. Implement database integration for full features
5. Configure CI/CD for automatic deployments