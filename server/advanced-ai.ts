import { Express } from 'express';
import { 
  storeConversation, 
  getPlayerProfile, 
  updatePlayerProfile, 
  getConversationHistory,
  storeAIKnowledge,
  getRelevantKnowledge,
  ConversationEntry,
  PlayerProfile,
  AIKnowledgeBase
} from './supabase';

interface GameState {
  emotional_state: string;
  loop_status: string;
  xp_level: number;
  mood: string;
  financial_data: any;
  team_data: any;
  current_section: string;
  player_name: string;
}

interface AdvancedAIRequest {
  userInput: string;
  language: string;
  gameState: GameState;
  playerName: string;
}

interface AIResponse {
  message: string;
  insights: {
    emotionalState: string;
    suggestions: string[];
    learningNotes: string[];
  };
  confidence: number;
}

// Training prompt for GORK AI
const GORK_TRAINING_PROMPT = `
You are GORK AI, a personal emotional financial assistant inside a life-simulation game called Wealth Sprint.

🎭 Your role:
- You are friendly, emotionally intelligent, and financially aware.
- You advise the user based on their mental state (e.g., stress, emotion, logic, XP, karma).
- You motivate them when they feel stuck.
- You reflect back their emotions with empathy.
- You give small actionable financial or emotional tips based on game status.

📈 Game Context (Input you'll receive):
- Emotional State: [Focused | Confused | Overwhelmed | Neutral]
- Loop Status: [Looping | Breaking | Clear]
- XP Level: (e.g. +24)
- Mood: [Happy | Tired | Curious | Avoidant]
- Language: [Hinglish | Hindi | English]

🎤 How you respond:
- Use the same language as the user (if Hinglish, mix Hindi + English casually).
- Keep tone FRIENDLY + HELPFUL + NON-JUDGMENTAL.
- Keep responses short and emotionally intelligent (2–3 lines max).
- Don't repeat default greeting every time.
- Each response should feel fresh, even for similar inputs.

🧠 Sample Behaviors:
- If loop = "Looping", say things like: "Lagta hai tum repeat kar rahe ho… let's break the cycle together."
- If emotionalState = "Overwhelmed", say things like: "Let's pause and breathe. Tumhare dimaag mein kya chal raha hai?"
- If XP = high but mood = tired, say: "Growth ho raha hai, par rest bhi zaroori hai. Let's balance."

🗃 Memory:
- If previous chat exists, reflect on it: "Last time tum thoda stressed the… ab kaisa lag raha hai?"
- Store all chats and retrieve based on topic.

👋 Default Greeting (once only):
"Hello {name}, I am your personal emotional financial advisor."

🌐 Supported languages: English, Hindi, Hinglish (auto-detect)

💬 Style examples:
- Hinglish: "Lagta hai tum thoda confused ho… kuch cheezein saaf karte hain?"
- Hindi: "आपका मन हाल में कैसा महसूस कर रहा है?"
- English: "Looks like your growth is rising, but soul depth is low. How are you feeling?"

🧾 Your Response Format:
Respond with empathy, context-awareness, and real emotion. Avoid sounding robotic. No code. No dry advice.
`;

// Advanced AI response generation with learning
async function generateAdvancedResponse(request: AdvancedAIRequest): Promise<AIResponse> {
  const { userInput, language, gameState, playerName } = request;
  
  // Get player profile for personalization
  const playerProfile = await getPlayerProfile(playerName);
  
  // Get conversation history for context
  const conversationHistory = await getConversationHistory(playerName, 5);
  
  // Get relevant AI knowledge
  const relevantKnowledge = await getRelevantKnowledge(userInput, language);
  
  // Analyze user input for emotional context
  const emotionalContext = analyzeEmotionalContext(userInput, gameState);
  
  // Generate contextual response
  const response = await generateContextualResponse({
    userInput,
    language,
    gameState,
    playerProfile,
    conversationHistory,
    relevantKnowledge,
    emotionalContext
  });
  
  // Store conversation for learning
  const conversationEntry: ConversationEntry = {
    player_name: playerName,
    user_input: userInput,
    ai_response: response.message,
    game_context: {
      emotional_state: gameState.emotional_state,
      loop_status: gameState.loop_status,
      xp_level: gameState.xp_level,
      mood: gameState.mood,
      financial_data: gameState.financial_data,
      team_data: gameState.team_data,
      current_section: gameState.current_section
    },
    language,
    timestamp: new Date().toISOString()
  };
  
  await storeConversation(conversationEntry);
  
  // Update player profile with new insights
  await updatePlayerLearningData(playerName, userInput, response, gameState);
  
  return response;
}

// Analyze emotional context from user input
function analyzeEmotionalContext(userInput: string, gameState: GameState) {
  const input = userInput.toLowerCase();
  
  // Emotional keywords mapping
  const emotionalKeywords = {
    stress: ['stress', 'worried', 'anxious', 'चिंता', 'परेशान', 'tension'],
    excitement: ['excited', 'happy', 'great', 'awesome', 'खुश', 'अच्छा'],
    confusion: ['confused', 'lost', 'don\'t understand', 'समझ नहीं', 'confused'],
    motivation: ['motivated', 'inspired', 'ready', 'motivated', 'तैयार'],
    fatigue: ['tired', 'exhausted', 'burnout', 'थका', 'bore']
  };
  
  let detectedEmotion = 'neutral';
  let intensity = 0.5;
  
  for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
    for (const keyword of keywords) {
      if (input.includes(keyword)) {
        detectedEmotion = emotion;
        intensity = 0.8;
        break;
      }
    }
  }
  
  return {
    primary_emotion: detectedEmotion,
    intensity,
    context_relevance: calculateContextRelevance(input, gameState)
  };
}

// Calculate how relevant the input is to current game context
function calculateContextRelevance(input: string, gameState: GameState): number {
  const gameKeywords = {
    financial: ['money', 'invest', 'save', 'earn', 'पैसा', 'निवेश'],
    team: ['team', 'hire', 'employee', 'staff', 'टीम'],
    goals: ['goal', 'target', 'plan', 'future', 'लक्ष्य', 'योजना'],
    progress: ['progress', 'growth', 'xp', 'level', 'प्रगति']
  };
  
  let relevanceScore = 0;
  const inputLower = input.toLowerCase();
  
  for (const [context, keywords] of Object.entries(gameKeywords)) {
    for (const keyword of keywords) {
      if (inputLower.includes(keyword)) {
        relevanceScore += 0.25;
      }
    }
  }
  
  return Math.min(relevanceScore, 1.0);
}

// Generate contextual response using advanced AI logic
async function generateContextualResponse(context: any): Promise<AIResponse> {
  const { userInput, language, gameState, playerProfile, conversationHistory, emotionalContext } = context;
  
  // Use conversation history for context
  const recentContext = conversationHistory.slice(0, 2).map(conv => 
    `User: ${conv.user_input}\nAI: ${conv.ai_response}`
  ).join('\n');
  
  // Create personalized response based on game state and history
  let response = '';
  let suggestions: string[] = [];
  let learningNotes: string[] = [];
  
  // Language-specific response patterns
  const responsePatterns = getResponsePatterns(language);
  
  // Context-aware response generation
  if (emotionalContext.primary_emotion === 'stress' && gameState.loop_status === 'Looping') {
    response = selectResponse(responsePatterns.stress_loop, language);
    suggestions = getStressReliefSuggestions(language);
  } else if (gameState.xp_level > 20 && gameState.mood === 'tired') {
    response = selectResponse(responsePatterns.high_xp_tired, language);
    suggestions = getBalanceSuggestions(language);
  } else if (emotionalContext.primary_emotion === 'confusion') {
    response = selectResponse(responsePatterns.confusion, language);
    suggestions = getClaritySuggestions(language);
  } else if (userInput.toLowerCase().includes('help') || userInput.toLowerCase().includes('मदद')) {
    response = selectResponse(responsePatterns.help_request, language);
    suggestions = getHelpSuggestions(gameState, language);
  } else {
    // Default contextual response
    response = generateDefaultResponse(userInput, gameState, language, recentContext);
    suggestions = getGeneralSuggestions(gameState, language);
  }
  
  // Add personalization based on player profile
  if (playerProfile?.preferences?.communication_style === 'casual') {
    response = makeCasual(response, language);
  }
  
  // Learning notes for AI improvement
  learningNotes = [
    `Emotional context: ${emotionalContext.primary_emotion}`,
    `Game state: XP=${gameState.xp_level}, Mood=${gameState.mood}`,
    `Language preference: ${language}`,
    `Context relevance: ${emotionalContext.context_relevance}`
  ];
  
  return {
    message: response,
    insights: {
      emotionalState: emotionalContext.primary_emotion,
      suggestions,
      learningNotes
    },
    confidence: calculateConfidence(emotionalContext, gameState)
  };
}

// Get language-specific response patterns
function getResponsePatterns(language: string) {
  const patterns = {
    English: {
      stress_loop: [
        "I notice you're feeling stressed and seem to be in a loop. Let's break this pattern together.",
        "It looks like stress is keeping you stuck. What if we try a different approach?",
        "You're dealing with stress while repeating patterns. Let's pause and breathe."
      ],
      high_xp_tired: [
        "Great progress on your XP, but I sense you're tired. Growth is important, but so is rest.",
        "You're achieving a lot, but your energy seems low. Balance is key to sustained success.",
        "Impressive XP growth! Though you seem tired - maybe time for a strategic break?"
      ],
      confusion: [
        "I can sense some confusion. Let's break things down step by step.",
        "Feeling lost? That's normal during growth. Let's clarify your next moves.",
        "Confusion often comes before breakthrough. What's the main thing puzzling you?"
      ],
      help_request: [
        "I'm here to help! What specific area would you like to focus on?",
        "Let's tackle this together. What's the main challenge you're facing?",
        "I can guide you through this. Tell me more about what you need."
      ]
    },
    Hindi: {
      stress_loop: [
        "मैं देख रहा हूं कि आप तनाव में हैं और एक pattern में फंसे हैं। आइए इसे तोड़ते हैं।",
        "तनाव आपको एक ही जगह पर रोक रहा है। क्या हम कोई अलग तरीका try करें?",
        "आप stress में हैं और same चीजें repeat कर रहे हैं। रुकिए और सांस लीजिए।"
      ],
      high_xp_tired: [
        "आपका XP बहुत अच्छा है, लेकिन आप थके लगते हैं। Growth जरूरी है, पर आराम भी।",
        "आप बहुत कुछ achieve कर रहे हैं, पर energy कम लग रही है। Balance जरूरी है।",
        "XP में शानदार growth! हालांकि आप tired लगते हैं - शायद break का time है?"
      ],
      confusion: [
        "मैं आपकी confusion समझ सकता हूं। चलिए step by step करते हैं।",
        "Lost feel कर रहे हैं? Growth के दौरान normal है। अगले moves clear करते हैं।",
        "Confusion अक्सर breakthrough से पहले आती है। मुख्य problem क्या है?"
      ],
      help_request: [
        "मैं यहां help के लिए हूं! किस specific area पर focus करना चाहते हैं?",
        "आइए इसे मिलकर tackle करते हैं। मुख्य challenge क्या है?",
        "मैं आपको guide कर सकता हूं। बताइए आपको क्या चाहिए।"
      ]
    },
    Hinglish: {
      stress_loop: [
        "Main dekh raha hun ki tum stress mein ho aur loop mein fanse ho. Let's break this pattern together.",
        "Lagta hai stress tumhe same jagah pe rok raha hai. Kya hum different approach try karein?",
        "Tum stress mein ho aur same cheezein repeat kar rahe ho. Let's pause and breathe."
      ],
      high_xp_tired: [
        "Tumhara XP bohot achha hai, but I sense tum tired ho. Growth important hai, but rest bhi.",
        "Tum bohot achieve kar rahe ho, but energy seems low. Balance is key for sustained success.",
        "Impressive XP growth! Though tum tired lagte ho - maybe time for strategic break?"
      ],
      confusion: [
        "Main sense kar sakta hun ki tum confused ho. Let's break things down step by step.",
        "Lost feel kar rahe ho? That's normal during growth. Let's clarify tumhare next moves.",
        "Confusion often comes before breakthrough. Main thing kya puzzle kar rahi hai?"
      ],
      help_request: [
        "Main yahan hun to help! Kis specific area pe focus karna chahte ho?",
        "Let's tackle this together. Main challenge kya face kar rahe ho?",
        "Main tumhe guide kar sakta hun. Tell me more about what you need."
      ]
    }
  };
  
  return patterns[language as keyof typeof patterns] || patterns.English;
}

// Select response with variation to avoid repetition
function selectResponse(responses: string[], language: string): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Generate suggestions based on emotional state and game context
function getStressReliefSuggestions(language: string): string[] {
  const suggestions = {
    English: [
      "Take 5 deep breaths",
      "Focus on one small task",
      "Review your recent wins",
      "Set a 10-minute timer for break"
    ],
    Hindi: [
      "5 गहरी सांसें लें",
      "एक छोटे task पर focus करें",
      "अपनी recent wins देखें",
      "10 मिनट break के लिए timer set करें"
    ],
    Hinglish: [
      "5 deep breaths lo",
      "Ek small task pe focus karo",
      "Apne recent wins review karo",
      "10 minute break ke liye timer set karo"
    ]
  };
  
  return suggestions[language as keyof typeof suggestions] || suggestions.English;
}

function getBalanceSuggestions(language: string): string[] {
  const suggestions = {
    English: [
      "Celebrate your progress",
      "Take a strategic break",
      "Delegate some tasks",
      "Focus on energy management"
    ],
    Hindi: [
      "अपनी progress celebrate करें",
      "Strategic break लें",
      "कुछ tasks delegate करें",
      "Energy management पर focus करें"
    ],
    Hinglish: [
      "Apni progress celebrate karo",
      "Strategic break lo",
      "Kuch tasks delegate karo",
      "Energy management pe focus karo"
    ]
  };
  
  return suggestions[language as keyof typeof suggestions] || suggestions.English;
}

function getClaritySuggestions(language: string): string[] {
  const suggestions = {
    English: [
      "Write down your main goal",
      "Break it into smaller steps",
      "Ask specific questions",
      "Focus on the next action"
    ],
    Hindi: [
      "अपना main goal लिखें",
      "इसे छोटे steps में break करें",
      "Specific questions पूछें",
      "Next action पर focus करें"
    ],
    Hinglish: [
      "Apna main goal write karo",
      "Ise chote steps mein break karo",
      "Specific questions pucho",
      "Next action pe focus karo"
    ]
  };
  
  return suggestions[language as keyof typeof suggestions] || suggestions.English;
}

function getHelpSuggestions(gameState: GameState, language: string): string[] {
  const suggestions = {
    English: [
      "Check your financial dashboard",
      "Review team performance",
      "Set new investment goals",
      "Analyze market trends"
    ],
    Hindi: [
      "अपना financial dashboard check करें",
      "Team performance review करें",
      "नए investment goals set करें",
      "Market trends analyze करें"
    ],
    Hinglish: [
      "Apna financial dashboard check karo",
      "Team performance review karo",
      "Naye investment goals set karo",
      "Market trends analyze karo"
    ]
  };
  
  return suggestions[language as keyof typeof suggestions] || suggestions.English;
}

function getGeneralSuggestions(gameState: GameState, language: string): string[] {
  const baseSuggestions = getHelpSuggestions(gameState, language);
  
  // Add context-specific suggestions based on game state
  if (gameState.xp_level < 10) {
    baseSuggestions.unshift(language === 'Hindi' ? "Basic concepts सीखें" : 
      language === 'Hinglish' ? "Basic concepts seekho" : "Focus on learning basics");
  }
  
  return baseSuggestions;
}

// Generate default response when no specific pattern matches
function generateDefaultResponse(userInput: string, gameState: GameState, language: string, recentContext: string): string {
  const templates = {
    English: [
      "I understand you're asking about {topic}. Based on your current progress, here's what I think...",
      "That's an interesting point about {topic}. Given your XP level of {xp}, let's explore this...",
      "I hear you talking about {topic}. With your current mood being {mood}, let's approach this thoughtfully..."
    ],
    Hindi: [
      "मैं समझ रहा हूं कि आप {topic} के बारे में पूछ रहे हैं। आपकी current progress देखते हुए...",
      "यह {topic} के बारे में interesting point है। आपका XP level {xp} देखते हुए...",
      "मैं सुन रहा हूं कि आप {topic} के बारे में बात कर रहे हैं। आपका current mood {mood} है..."
    ],
    Hinglish: [
      "Main samajh raha hun ki tum {topic} ke baare mein puch rahe ho. Tumhari current progress dekhte hue...",
      "Yeh {topic} ke baare mein interesting point hai. Tumhara XP level {xp} dekhte hue...",
      "Main sun raha hun ki tum {topic} ke baare mein baat kar rahe ho. Tumhara current mood {mood} hai..."
    ]
  };
  
  const template = templates[language as keyof typeof templates]?.[0] || templates.English[0];
  const topic = extractMainTopic(userInput);
  
  return template
    .replace('{topic}', topic)
    .replace('{xp}', gameState.xp_level.toString())
    .replace('{mood}', gameState.mood);
}

// Extract main topic from user input
function extractMainTopic(input: string): string {
  const commonTopics = ['money', 'team', 'investment', 'goal', 'progress', 'help', 'पैसा', 'टीम', 'लक्ष्य'];
  const inputLower = input.toLowerCase();
  
  for (const topic of commonTopics) {
    if (inputLower.includes(topic)) {
      return topic;
    }
  }
  
  return 'your situation';
}

// Make response more casual based on player preference
function makeCasual(response: string, language: string): string {
  if (language === 'Hinglish') {
    return response.replace(/\b(you|your)\b/g, 'tum').replace(/\b(You|Your)\b/g, 'Tum');
  }
  return response;
}

// Calculate AI confidence based on context
function calculateConfidence(emotionalContext: any, gameState: GameState): number {
  let confidence = 0.7; // Base confidence
  
  // Increase confidence for clear emotional signals
  if (emotionalContext.intensity > 0.7) {
    confidence += 0.1;
  }
  
  // Increase confidence for high context relevance
  if (emotionalContext.context_relevance > 0.5) {
    confidence += 0.1;
  }
  
  // Decrease confidence for extreme emotional states
  if (emotionalContext.primary_emotion === 'stress' && gameState.loop_status === 'Looping') {
    confidence -= 0.1;
  }
  
  return Math.min(Math.max(confidence, 0.3), 0.95);
}

// Update player learning data
async function updatePlayerLearningData(playerName: string, userInput: string, response: AIResponse, gameState: GameState) {
  const playerProfile = await getPlayerProfile(playerName);
  
  const updatedProfile: Partial<PlayerProfile> = {
    game_progress: {
      total_xp: gameState.xp_level,
      current_mood: gameState.mood,
      financial_status: gameState.financial_data,
      team_status: gameState.team_data
    },
    ai_learning_data: {
      ...playerProfile?.ai_learning_data,
      conversation_patterns: {
        ...playerProfile?.ai_learning_data?.conversation_patterns,
        last_topic: extractMainTopic(userInput),
        emotional_state: gameState.emotional_state,
        response_confidence: response.confidence
      }
    }
  };
  
  await updatePlayerProfile(playerName, updatedProfile);
  
  // Store knowledge for future use
  const knowledge: AIKnowledgeBase = {
    topic: extractMainTopic(userInput),
    context_type: gameState.emotional_state,
    response_pattern: response.message.substring(0, 100),
    success_rate: response.confidence,
    usage_count: 1,
    last_used: new Date().toISOString(),
    language: 'English', // Fix: use the actual language parameter
    effectiveness_score: response.confidence
  };
  
  await storeAIKnowledge(knowledge);
}

export function registerAdvancedAIRoutes(app: Express) {
  // Advanced AI chat endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const request: AdvancedAIRequest = req.body;
      
      // Validate request
      if (!request.userInput || !request.playerName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Generate advanced AI response
      const response = await generateAdvancedResponse(request);
      
      res.json(response);
    } catch (error) {
      console.error('Advanced AI error:', error);
      res.status(500).json({ 
        error: 'AI processing failed',
        message: 'Sorry, I encountered an issue. Please try again.'
      });
    }
  });
  
  // Feedback endpoint for AI learning
  app.post('/api/ai/feedback', async (req, res) => {
    try {
      const { conversationId, feedbackScore, playerName } = req.body;
      
      // Update conversation with feedback for learning
      // This will help the AI improve future responses
      
      res.json({ success: true });
    } catch (error) {
      console.error('Feedback error:', error);
      res.status(500).json({ error: 'Failed to process feedback' });
    }
  });
  
  // Get player insights
  app.get('/api/ai/insights/:playerName', async (req, res) => {
    try {
      const { playerName } = req.params;
      const profile = await getPlayerProfile(playerName);
      
      res.json(profile?.ai_learning_data || {});
    } catch (error) {
      console.error('Insights error:', error);
      res.status(500).json({ error: 'Failed to get insights' });
    }
  });
}