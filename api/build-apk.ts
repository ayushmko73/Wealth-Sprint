import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Simulate APK build process for Vercel deployment
    const buildSteps = [
      { step: 'prepare', status: 'running', message: 'Preparing mobile build environment...' },
      { step: 'prepare', status: 'completed', message: 'Environment prepared' },
      { step: 'build', status: 'running', message: 'Building APK (this may take several minutes)...' },
      { step: 'build', status: 'info', message: 'Note: APK building requires additional services not available in Vercel deployment' },
      { step: 'build', status: 'warning', message: 'For full APK functionality, please use the Replit environment' },
      { step: 'build', status: 'completed', message: 'APK build simulation completed' },
      { step: 'complete', status: 'completed', message: 'Build process finished', downloadUrl: 'https://example.com/wealth-sprint.apk' }
    ];

    // Send each step with a delay
    for (let i = 0; i < buildSteps.length; i++) {
      const step = buildSteps[i];
      res.write(`data: ${JSON.stringify(step)}\n\n`);
      
      // Add delay between steps (shorter for Vercel)
      if (i < buildSteps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    res.end();

  } catch (error) {
    console.error('APK build error:', error);
    const errorStep = {
      step: 'error',
      status: 'error',
      message: 'APK build failed in Vercel environment'
    };
    
    res.write(`data: ${JSON.stringify(errorStep)}\n\n`);
    res.end();
  }
}