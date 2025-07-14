import { Express } from 'express';

interface SageRequest {
  userInput: string;
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

export function registerSageRoutes(app: Express) {
  app.post('/api/sage/analyze', async (req, res) => {
    try {
      const { userInput, emotionalState, financialContext, recentDecisions }: SageRequest = req.body;
      
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

      // For now, provide intelligent responses based on context
      // In production, you would call your AI service here
      const responses = generateSageResponse(userInput, emotionalState, financialContext);
      
      res.json(responses);
    } catch (error) {
      console.error('Sage API error:', error);
      res.status(500).json({ 
        error: 'Sage analysis failed',
        message: 'Unable to process request at this time'
      });
    }
  });
}

function generateSageResponse(userInput: string, emotionalState?: string, financialContext?: any): SageResponse {
  const responses = [
    {
      message: "I notice you're moving quickly through decisions. Sometimes our best insights come when we pause. What's driving this urgency?",
      insights: {
        emotionalState: 'Rushed',
        financialLoop: 'Decision Acceleration',
        growthXP: 12,
        suggestions: ['Take a 2-minute breathing break', 'Review your last 3 decisions', 'Ask: What am I avoiding?']
      }
    },
    {
      message: "Your spending pattern shows a familiar loop. You're not alone in this - many successful people face similar cycles. Ready to try a different approach?",
      insights: {
        emotionalState: 'Reflective',
        financialLoop: 'Breaking Pattern',
        growthXP: 18,
        suggestions: ['Identify the trigger emotion', 'Set a 24-hour decision delay', 'Focus on one business layer']
      }
    },
    {
      message: "I see growth in your choices, but your emotional energy seems scattered. How are you feeling about your progress right now?",
      insights: {
        emotionalState: 'Mixed',
        financialLoop: 'Growth Phase',
        growthXP: 24,
        suggestions: ['Celebrate small wins', 'Reconnect with your why', 'Balance logic with intuition']
      }
    }
  ];

  // Select response based on context
  let selectedResponse = responses[0];
  
  if (userInput.toLowerCase().includes('stress') || userInput.toLowerCase().includes('worry')) {
    selectedResponse = responses[1];
  } else if (userInput.toLowerCase().includes('good') || userInput.toLowerCase().includes('progress')) {
    selectedResponse = responses[2];
  }

  return selectedResponse;
}