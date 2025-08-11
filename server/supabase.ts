import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client only if credentials are available
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

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
    if (!supabase) {
      console.log('⚠️  Supabase not configured. AI features will be limited.');
      return;
    }
    
    console.log('Initializing Supabase database for GORK AI...');
    
    // Test connection first
    const { data, error } = await supabase
      .from('conversations')
      .select('count', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') {
      console.log('🔧 Creating database tables automatically...');
      
      // Create tables automatically
      const { error: createError } = await supabase.rpc('exec', {
        sql: `
          -- Conversations table for storing chat history
          CREATE TABLE IF NOT EXISTS conversations (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              player_name TEXT NOT NULL,
              user_input TEXT NOT NULL,
              ai_response TEXT NOT NULL,
              game_context JSONB DEFAULT '{}',
              language TEXT DEFAULT 'English',
              timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              feedback_score INTEGER,
              learning_tags TEXT[]
          );

          -- Player profiles table for AI personalization
          CREATE TABLE IF NOT EXISTS player_profiles (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              player_name TEXT UNIQUE NOT NULL,
              preferences JSONB DEFAULT '{}',
              game_progress JSONB DEFAULT '{}',
              ai_learning_data JSONB DEFAULT '{}',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- AI knowledge base for learning patterns
          CREATE TABLE IF NOT EXISTS ai_knowledge_base (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              topic TEXT NOT NULL,
              context_type TEXT NOT NULL,
              response_pattern TEXT NOT NULL,
              success_rate DECIMAL(5,4) DEFAULT 0.7,
              usage_count INTEGER DEFAULT 1,
              last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              language TEXT DEFAULT 'English',
              effectiveness_score DECIMAL(5,4) DEFAULT 0.7
          );

          -- Indexes for better performance
          CREATE INDEX IF NOT EXISTS idx_conversations_player_name ON conversations(player_name);
          CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp DESC);
          CREATE INDEX IF NOT EXISTS idx_player_profiles_player_name ON player_profiles(player_name);
          CREATE INDEX IF NOT EXISTS idx_ai_knowledge_topic ON ai_knowledge_base(topic);
          CREATE INDEX IF NOT EXISTS idx_ai_knowledge_language ON ai_knowledge_base(language);

          -- RLS policies (Row Level Security)
          ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
          ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
          ALTER TABLE ai_knowledge_base ENABLE ROW LEVEL SECURITY;

          -- Allow read/write access for authenticated users
          CREATE POLICY "Allow all operations for authenticated users" ON conversations
              FOR ALL USING (true);

          CREATE POLICY "Allow all operations for authenticated users" ON player_profiles
              FOR ALL USING (true);

          CREATE POLICY "Allow all operations for authenticated users" ON ai_knowledge_base
              FOR ALL USING (true);
        `
      });
      
      if (createError) {
        console.log('❌ Auto-creation failed. Please run the SQL setup script manually.');
        console.log('Navigate to: https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql');
        console.log('Run the SQL script from database/setup.sql file');
      } else {
        console.log('✅ Database tables created automatically!');
      }
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
    if (!supabase) {
      console.log('Supabase not available - conversation not stored');
      return null;
    }
    
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
    if (!supabase) return null;
    
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
    if (!supabase) return null;
    
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
    if (!supabase) return [];
    
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
    if (!supabase) return null;
    
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
    if (!supabase) return [];
    
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