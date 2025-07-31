import { Express } from 'express';
import fs from 'fs';
import path from 'path';

interface SageRequest {
  userInput: string;
  language?: string;
  emotionalState?: string;
  financialContext?: any;
  recentDecisions?: any[];
}

interface SageResponse {
  message: string;
  insights: {
    emotionalState: string;
    financialLoop: string;
    growthXP: number;
    suggestions: string[];
  };
}

interface Message {
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

interface ChatSession {
  user: string;
  language: string;
  mood: string;
  messages: Message[];
  timestamp: string;
  id: string;
}

// Ensure saved-chats directory exists
const CHATS_DIR = path.join(process.cwd(), 'saved-chats');
if (!fs.existsSync(CHATS_DIR)) {
  fs.mkdirSync(CHATS_DIR, { recursive: true });
}

// Track conversation context to avoid repetitive responses
const conversationMemory = new Map<string, string[]>();

export function registerSageRoutes(app: Express) {
  app.post('/api/sage/analyze', async (req, res) => {
    try {
      const { userInput, language, emotionalState, financialContext, recentDecisions }: SageRequest = req.body;
      
      // Validate Sage API key
      const sageApiKey = process.env.GORK_API;
      if (!sageApiKey) {
        return res.status(500).json({ 
          error: 'SAGE_API not configured',
          message: 'Please add your Sage API key to Replit secrets'
        });
      }

      // Create Sage prompt based on user context
      const prompt = `You are Sage AI, a calm and wise financial mentor. Analyze this user situation:

User Input: "${userInput}"
Current Emotional State: ${emotionalState || 'Unknown'}
Financial Context: ${JSON.stringify(financialContext || {})}
Recent Decisions: ${JSON.stringify(recentDecisions || [])}

Provide a brief, supportive response that:
1. Shows emotional awareness
2. Offers gentle financial guidance
3. Asks one insightful question
4. Stays under 100 words

Respond in a calm, mentor-like tone without being judgmental.`;

      // Generate response based on context and language with memory
      const userId = 'user_' + (req.ip || 'default'); // Simple user identification
      const responses = generateSageResponse(userInput, language, emotionalState, financialContext, userId);
      
      res.json(responses);
    } catch (error) {
      console.error('Sage API error:', error);
      res.status(500).json({ 
        error: 'Sage analysis failed',
        message: 'Unable to process request at this time'
      });
    }
  });

  // Save chat session
  app.post('/api/sage/save-chat', async (req, res) => {
    try {
      const session: ChatSession = req.body;
      const filename = `${session.id}.json`;
      const filepath = path.join(CHATS_DIR, filename);
      
      fs.writeFileSync(filepath, JSON.stringify(session, null, 2));
      
      // Keep only last 20 chats
      const files = fs.readdirSync(CHATS_DIR)
        .filter(file => file.endsWith('.json'))
        .map(file => ({
          name: file,
          time: fs.statSync(path.join(CHATS_DIR, file)).mtime
        }))
        .sort((a, b) => b.time.getTime() - a.time.getTime());

      if (files.length > 20) {
        files.slice(20).forEach(file => {
          fs.unlinkSync(path.join(CHATS_DIR, file.name));
        });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Failed to save chat:', error);
      res.status(500).json({ error: 'Failed to save chat' });
    }
  });

  // Load chat history
  app.get('/api/sage/chat-history', async (req, res) => {
    try {
      // Ensure directory exists
      if (!fs.existsSync(CHATS_DIR)) {
        fs.mkdirSync(CHATS_DIR, { recursive: true });
        res.json([]);
        return;
      }

      const files = fs.readdirSync(CHATS_DIR)
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const content = fs.readFileSync(path.join(CHATS_DIR, file), 'utf8');
          return JSON.parse(content);
        })
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      res.json(files);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      res.json([]);
    }
  });

  // Load specific chat session
  app.get('/api/sage/load-chat/:sessionId', async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const filepath = path.join(CHATS_DIR, `${sessionId}.json`);
      
      if (fs.existsSync(filepath)) {
        const content = fs.readFileSync(filepath, 'utf8');
        const session = JSON.parse(content);
        res.json(session);
      } else {
        res.status(404).json({ error: 'Chat session not found' });
      }
    } catch (error) {
      console.error('Failed to load chat session:', error);
      res.status(500).json({ error: 'Failed to load chat session' });
    }
  });
}

function generateSageResponse(userInput: string, language?: string, emotionalState?: string, financialContext?: any, userId?: string): SageResponse {
  // Language-specific responses with much more variety
  const responses: { [key: string]: any } = {
    English: [
      {
        message: "I can help you build better financial habits and make smarter decisions. What specific area would you like to focus on today?",
        insights: { emotionalState: 'Helpful', financialLoop: 'Getting Started', growthXP: 10, suggestions: ['Start with your biggest financial goal', 'Track your spending for a week', 'Learn about investment basics'] }
      },
      {
        message: "Great question! Financial growth happens step by step. Let me share some insights based on your current situation.",
        insights: { emotionalState: 'Encouraging', financialLoop: 'Learning Phase', growthXP: 15, suggestions: ['Focus on one area at a time', 'Build emergency savings first', 'Understand your risk tolerance'] }
      },
      {
        message: "I notice you're moving quickly through decisions. Sometimes our best insights come when we pause. Take a breath. What's driving this urgency?",
        insights: { emotionalState: 'Focused', financialLoop: 'Decision Acceleration', growthXP: 12, suggestions: ['Take a 2-minute breathing break', 'Review your last 3 decisions', 'Ask: What am I avoiding?'] }
      },
      {
        message: "You're doing well, let's reflect on this together. Your spending pattern shows growth potential. Ready to explore a different approach?",
        insights: { emotionalState: 'Reflective', financialLoop: 'Breaking Pattern', growthXP: 18, suggestions: ['Identify the trigger emotion', 'Set a 24-hour decision delay', 'Focus on one business layer'] }
      },
      {
        message: "I'm here to guide you. Your choices show wisdom, but your emotional energy could use attention. How are you feeling about your progress?",
        insights: { emotionalState: 'Balanced', financialLoop: 'Growth Phase', growthXP: 24, suggestions: ['Celebrate small wins', 'Reconnect with your why', 'Balance logic with intuition'] }
      },
      {
        message: "Money decisions can feel overwhelming sometimes. Let's break this down into smaller, manageable steps. What's your biggest concern right now?",
        insights: { emotionalState: 'Supportive', financialLoop: 'Problem Solving', growthXP: 14, suggestions: ['List your top 3 financial priorities', 'Start with the easiest win', 'Don\'t rush big decisions'] }
      },
      {
        message: "Every financial journey is unique. Tell me more about what success looks like for you?",
        insights: { emotionalState: 'Curious', financialLoop: 'Goal Setting', growthXP: 16, suggestions: ['Define your personal success', 'Set both short and long-term goals', 'Focus on what you can control'] }
      }
    ],
    Hindi: [
      {
        message: "मैं आपकी financial planning में मदद कर सकता हूं। आज आप किस चीज़ पर focus करना चाहते हैं?",
        insights: { emotionalState: 'सहायक', financialLoop: 'शुरुआत', growthXP: 10, suggestions: ['अपना सबसे बड़ा financial goal तय करें', 'एक हफ्ते तक खर्च track करें', 'investment की basics सीखें'] }
      },
      {
        message: "बहुत अच्छा सवाल! Financial growth धीरे-धीरे होती है। मैं आपकी current situation के आधार पर कुछ insights share करता हूं।",
        insights: { emotionalState: 'प्रोत्साहनकारी', financialLoop: 'सीखने का चरण', growthXP: 15, suggestions: ['एक समय में एक area पर focus करें', 'पहले emergency savings बनाएं', 'अपना risk tolerance समझें'] }
      },
      {
        message: "मैं देख रहा हूँ कि आप जल्दी-जल्दी निर्णय ले रहे हैं। कभी-कभी जब हम रुकते हैं तो बेहतर समझ मिलती है। गहरी सांस लें। इस जल्दबाजी की वजह क्या है?",
        insights: { emotionalState: 'केंद्रित', financialLoop: 'निर्णय तेज़ी', growthXP: 12, suggestions: ['2 मिनट का ब्रेक लें', 'अपने पिछले 3 निर्णयों की समीक्षा करें', 'पूछें: मैं किससे बच रहा हूँ?'] }
      },
      {
        message: "आप अच्छा कर रहे हैं, आइए इस पर एक साथ विचार करते हैं। आपका खर्च का पैटर्न विकास की संभावना दिखाता है। क्या आप एक अलग तरीका अपनाने को तैयार हैं?",
        insights: { emotionalState: 'चिंतनशील', financialLoop: 'पैटर्न तोड़ना', growthXP: 18, suggestions: ['ट्रिगर इमोशन की पहचान करें', '24 घंटे की देरी रखें', 'एक बिजनेस लेयर पर फोकस करें'] }
      }
    ],
    Hinglish: [
      {
        message: "Main aapki financial planning mein help kar sakta hun. Aaj aap kya focus karna chahte hain?",
        insights: { emotionalState: 'Helpful', financialLoop: 'Getting Started', growthXP: 10, suggestions: ['Apna biggest financial goal set karo', 'Ek week spending track karo', 'Investment basics seekho'] }
      },
      {
        message: "Bahut achha question! Financial growth slowly slowly hoti hai. Main aapki current situation ke basis pe kuch insights share karta hun.",
        insights: { emotionalState: 'Encouraging', financialLoop: 'Learning Phase', growthXP: 15, suggestions: ['Ek time pe ek area pe focus karo', 'Pehle emergency savings banao', 'Apna risk tolerance samjho'] }
      },
      {
        message: "Main notice kar raha hun ki aap bohot fast decisions le rahe hain. Sometimes jab hum pause karte hain toh better insights milte hain. Deep breath lo. Ye urgency kya drive kar rahi hai?",
        insights: { emotionalState: 'Focused', financialLoop: 'Decision Acceleration', growthXP: 12, suggestions: ['2 minute ka breathing break lo', 'Apne last 3 decisions review karo', 'Poocho: Main kya avoid kar raha hun?'] }
      },
      {
        message: "Aap achha kar rahe hain, let's reflect karte hain together. Aapka spending pattern growth potential dikhata hai. Ready hain different approach try karne ke liye?",
        insights: { emotionalState: 'Reflective', financialLoop: 'Breaking Pattern', growthXP: 18, suggestions: ['Trigger emotion identify karo', '24-hour decision delay rakho', 'Ek business layer pe focus karo'] }
      }
    ]
  };

  // Get responses for the selected language (fallback to English)
  const languageResponses = responses[language || 'English'] || responses['English'];
  
  // Track user's conversation history to avoid repetitive responses
  const userKey = userId || 'default';
  if (!conversationMemory.has(userKey)) {
    conversationMemory.set(userKey, []);
  }
  const userHistory = conversationMemory.get(userKey)!;
  
  // Much smarter response selection based on user input
  let selectedResponse = languageResponses[0]; // Default
  
  // Analyze user input for better response matching
  const input = userInput.toLowerCase();
  
  // Help/guidance related queries
  if (input.includes('help') || input.includes('guide') || input.includes('assist') || 
      input.includes('मदद') || input.includes('help kar') || input.includes('guide kar')) {
    selectedResponse = languageResponses[0];
  }
  // Questions about improvement/skills/learning
  else if (input.includes('improve') || input.includes('skill') || input.includes('learn') || 
           input.includes('better') || input.includes('grow') || input.includes('develop') ||
           input.includes('सुधार') || input.includes('skill') || input.includes('सीख')) {
    selectedResponse = languageResponses[1];
  }
  // Stress/worry/tension related
  else if (input.includes('stress') || input.includes('worry') || input.includes('tension') || 
           input.includes('anxious') || input.includes('चिंता') || input.includes('परेशान')) {
    selectedResponse = languageResponses[2] || languageResponses[0];
  }
  // Progress/good/positive related
  else if (input.includes('good') || input.includes('progress') || input.includes('success') ||
           input.includes('अच्छा') || input.includes('achha') || input.includes('progress') ||
           input.includes('सफल')) {
    selectedResponse = languageResponses[3] || languageResponses[1] || languageResponses[0];
  }
  // Money/financial concerns
  else if (input.includes('money') || input.includes('financial') || input.includes('invest') ||
           input.includes('save') || input.includes('earn') || input.includes('पैसा') ||
           input.includes('निवेश') || input.includes('बचत')) {
    selectedResponse = languageResponses[5] || languageResponses[0];
  }
  // Goal/future planning
  else if (input.includes('goal') || input.includes('plan') || input.includes('future') ||
           input.includes('target') || input.includes('लक्ष्य') || input.includes('योजना')) {
    selectedResponse = languageResponses[6] || languageResponses[1] || languageResponses[0];
  }
  // Random selection for generic inputs to add variety
  else {
    // Filter out recently used responses
    const availableResponses = languageResponses.filter((resp, index) => 
      !userHistory.includes(resp.message.substring(0, 30))
    );
    
    if (availableResponses.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableResponses.length);
      selectedResponse = availableResponses[randomIndex];
    } else {
      // If all responses were used, reset history and pick random
      userHistory.length = 0;
      const randomIndex = Math.floor(Math.random() * languageResponses.length);
      selectedResponse = languageResponses[randomIndex];
    }
  }

  // Remember this response to avoid repetition
  const responseKey = selectedResponse.message.substring(0, 30);
  userHistory.push(responseKey);
  
  // Keep only last 5 responses in memory
  if (userHistory.length > 5) {
    userHistory.shift();
  }

  return selectedResponse;
}