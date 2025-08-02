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

// In-memory storage (shared with save-chat.ts in production you'd use a database)
let chatSessions: ChatSession[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    const session = chatSessions.find(s => s.id === sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    return res.status(200).json(session);

  } catch (error) {
    console.error('Load chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load chat session';
    
    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
}