import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ChatSession {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    text: string;
    sender: 'user' | 'sage';
    timestamp: number;
  }>;
  language: string;
  createdAt: number;
}

// In-memory storage for Vercel deployment
let chatSessions: ChatSession[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session: ChatSession = req.body;

    if (!session || !session.id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid session data'
      });
    }

    // Find existing session or add new one
    const existingIndex = chatSessions.findIndex(s => s.id === session.id);
    if (existingIndex >= 0) {
      chatSessions[existingIndex] = session;
    } else {
      chatSessions.push(session);
    }

    // Keep only last 50 sessions to prevent memory issues
    if (chatSessions.length > 50) {
      chatSessions = chatSessions.slice(-50);
    }

    return res.status(200).json({
      success: true,
      message: 'Chat session saved successfully'
    });

  } catch (error) {
    console.error('Save chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to save chat session';
    
    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
}