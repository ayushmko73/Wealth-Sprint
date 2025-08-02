import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'sage';
  timestamp: number;
  language?: string;
}

// For Vercel deployment, we'll use in-memory storage
// In production, you'd want to use a proper database
let chatHistory: ChatMessage[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for frontend requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Return chat history
    return res.status(200).json({
      success: true,
      messages: chatHistory
    });
  }

  if (req.method === 'POST') {
    try {
      const { message, sender, language } = req.body;

      if (!message || !sender) {
        return res.status(400).json({
          success: false,
          message: 'Message and sender are required'
        });
      }

      const chatMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message,
        sender,
        timestamp: Date.now(),
        language: language || 'en'
      };

      chatHistory.push(chatMessage);

      // Keep only last 100 messages to prevent memory issues
      if (chatHistory.length > 100) {
        chatHistory = chatHistory.slice(-100);
      }

      return res.status(200).json({
        success: true,
        message: 'Message saved',
        messageId: chatMessage.id
      });

    } catch (error) {
      console.error('Chat history error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save message';
      const errorString = error instanceof Error ? error.toString() : String(error);
      
      return res.status(500).json({
        success: false,
        message: errorMessage,
        error: errorString
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}