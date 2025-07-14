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

      // Generate response based on context and language
      const responses = generateSageResponse(userInput, language, emotionalState, financialContext);
      
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

function generateSageResponse(userInput: string, language?: string, emotionalState?: string, financialContext?: any): SageResponse {
  // Language-specific responses
  const responses: { [key: string]: any } = {
    English: [
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
      }
    ],
    Hindi: [
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
        message: "Main notice kar raha hun ki aap bohot fast decisions le rahe hain. Sometimes jab hum pause karte hain toh better insights milte hain. Deep breath lo. Ye urgency kya drive kar rahi hai?",
        insights: { emotionalState: 'Focused', financialLoop: 'Decision Acceleration', growthXP: 12, suggestions: ['2 minute ka breathing break lo', 'Apne last 3 decisions review karo', 'Poocho: Main kya avoid kar raha hun?'] }
      },
      {
        message: "Aap achha kar rahe hain, let's reflect karte hain together. Aapka spending pattern growth potential dikhata hai. Ready hain different approach try karne ke liye?",
        insights: { emotionalState: 'Reflective', financialLoop: 'Breaking Pattern', growthXP: 18, suggestions: ['Trigger emotion identify karo', '24-hour decision delay rakho', 'Ek business layer pe focus karo'] }
      }
    ],
    French: [
      {
        message: "Je remarque que vous prenez des décisions rapidement. Parfois nos meilleures intuitions viennent quand on fait une pause. Respirez profondément. Qu'est-ce qui motive cette urgence?",
        insights: { emotionalState: 'Concentré', financialLoop: 'Accélération des décisions', growthXP: 12, suggestions: ['Prenez une pause de 2 minutes', 'Révisez vos 3 dernières décisions', 'Demandez-vous: Qu\'est-ce que j\'évite?'] }
      }
    ],
    Spanish: [
      {
        message: "Noto que estás tomando decisiones rápidamente. A veces nuestras mejores ideas llegan cuando hacemos una pausa. Respira profundo. ¿Qué impulsa esta urgencia?",
        insights: { emotionalState: 'Enfocado', financialLoop: 'Aceleración de decisiones', growthXP: 12, suggestions: ['Toma un descanso de 2 minutos', 'Revisa tus últimas 3 decisiones', 'Pregúntate: ¿Qué estoy evitando?'] }
      }
    ]
  };

  // Get responses for the selected language (fallback to English)
  const languageResponses = responses[language || 'English'] || responses['English'];
  
  // Select response based on context
  let selectedResponse = languageResponses[0];
  
  if (userInput.toLowerCase().includes('stress') || userInput.toLowerCase().includes('worry') || 
      userInput.toLowerCase().includes('चिंता') || userInput.toLowerCase().includes('tension')) {
    selectedResponse = languageResponses[1] || languageResponses[0];
  } else if (userInput.toLowerCase().includes('good') || userInput.toLowerCase().includes('progress') ||
             userInput.toLowerCase().includes('अच्छा') || userInput.toLowerCase().includes('achha') ||
             userInput.toLowerCase().includes('bien') || userInput.toLowerCase().includes('bueno')) {
    selectedResponse = languageResponses[2] || languageResponses[1] || languageResponses[0];
  }

  return selectedResponse;
}