import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    const { userInput, language, gameState, playerName } = req.body;

    if (!userInput) {
      return res.status(400).json({
        success: false,
        message: 'User input is required'
      });
    }

    // For Vercel deployment without OpenAI API key, provide helpful response
    const responses = {
      en: `Hello ${playerName || 'there'}! I understand you said: "${userInput}". While I'd love to provide AI-powered financial guidance, the OpenAI integration isn't configured for this Vercel deployment. However, I can see you're doing great in the game! Keep making smart financial decisions!`,
      es: `¡Hola ${playerName || 'allí'}! Entiendo que dijiste: "${userInput}". Aunque me encantaría brindar orientación financiera impulsada por IA, la integración de OpenAI no está configurada para esta implementación de Vercel. ¡Sin embargo, puedo ver que lo estás haciendo genial en el juego! ¡Sigue tomando decisiones financieras inteligentes!`,
      hi: `नमस्ते ${playerName || 'वहाँ'}! मैं समझता हूं कि आपने कहा: "${userInput}"। जबकि मैं AI-संचालित वित्तीय मार्गदर्शन प्रदान करना चाहूंगा, OpenAI एकीकरण इस Vercel परिनियोजन के लिए कॉन्फ़िगर नहीं है। हालांकि, मैं देख सकता हूं कि आप गेम में बहुत अच्छा कर रहे हैं! स्मार्ट वित्तीय निर्णय लेते रहें!`
    };

    const response = responses[language as keyof typeof responses] || responses.en;

    return res.status(200).json({
      success: true,
      response,
      emotion: 'supportive',
      context: 'deployment_limitation'
    });

  } catch (error) {
    console.error('AI chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'AI chat service unavailable';
    
    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
}