import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database schemas for AI learning
export interface ConversationEntry {
  id?: string;
  player_name: string;
  user_input: string;
  ai_response: string;
  game_context: {
    emotional_state?: string;
    loop_status?: string;
    xp_level?: number;
    mood?: string;
    financial_data?: any;
    team_data?: any;
    current_section?: string;
  };
  language: string;
  timestamp: string;
  feedback_score?: number;
  learning_tags?: string[];
}

export interface PlayerProfile {
  id?: string;
  player_name: string;
  preferences: {
    communication_style?: string;
    preferred_language?: string;
    response_length?: string;
    topics_of_interest?: string[];
  };
  game_progress: {
    total_xp?: number;
    current_mood?: string;
    financial_status?: any;
    team_status?: any;
  };
  ai_learning_data: {
    successful_responses?: string[];
    unsuccessful_responses?: string[];
    preferred_response_types?: string[];
    conversation_patterns?: any;
  };
  created_at?: string;
  updated_at?: string;
}

export interface AIKnowledgeBase {
  id?: string;
  topic: string;
  context_type: string;
  response_pattern: string;
  success_rate: number;
  usage_count: number;
  last_used: string;
  language: string;
  effectiveness_score: number;
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    console.log('Initializing Supabase database for GORK AI...');
    
    // Test connection first
    const { data, error } = await supabase
      .from('conversations')
      .select('count', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') {
      console.log('Tables do not exist. Please run the SQL setup script in Supabase dashboard.');
      console.log('Navigate to: https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql');
      console.log('Run the SQL script from database/setup.sql file');
    } else {
      console.log('✅ Database tables are ready for GORK AI learning system');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    console.log('Please ensure Supabase credentials are correct and tables exist');
  }
}

// Store conversation for learning
export async function storeConversation(entry: ConversationEntry) {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert([entry])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error storing conversation:', error);
    return null;
  }
}

// Get player profile
export async function getPlayerProfile(playerName: string): Promise<PlayerProfile | null> {
  try {
    const { data, error } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('player_name', playerName)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error getting player profile:', error);
    return null;
  }
}

// Update player profile
export async function updatePlayerProfile(playerName: string, updates: Partial<PlayerProfile>) {
  try {
    const { data, error } = await supabase
      .from('player_profiles')
      .upsert([{
        player_name: playerName,
        ...updates,
        updated_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating player profile:', error);
    return null;
  }
}

// Get conversation history for learning
export async function getConversationHistory(playerName: string, limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('player_name', playerName)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting conversation history:', error);
    return [];
  }
}

// Store AI knowledge for learning
export async function storeAIKnowledge(knowledge: AIKnowledgeBase) {
  try {
    const { data, error } = await supabase
      .from('ai_knowledge_base')
      .upsert([knowledge])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error storing AI knowledge:', error);
    return null;
  }
}

// Get relevant AI knowledge
export async function getRelevantKnowledge(topic: string, language: string, limit: number = 5) {
  try {
    const { data, error } = await supabase
      .from('ai_knowledge_base')
      .select('*')
      .eq('language', language)
      .or(`topic.ilike.%${topic}%,context_type.ilike.%${topic}%`)
      .order('effectiveness_score', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting AI knowledge:', error);
    return [];
  }
}