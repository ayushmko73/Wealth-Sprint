# GORK AI Supabase Setup Instructions

## Step 1: Access Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Navigate to your project: `gfwslipveswvfjzopcea`
3. Click on the "SQL Editor" tab in the left sidebar

## Step 2: Run Database Setup
Copy and paste the following SQL script in the SQL Editor and click "Run":

```sql
-- GORK AI Learning Database Schema

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
```

## Step 3: Verify Setup
After running the script, you should see:
- ✅ conversations table created
- ✅ player_profiles table created  
- ✅ ai_knowledge_base table created
- ✅ All indexes and policies applied

## Step 4: Test the System
Once tables are created, the GORK AI will automatically:
- 💾 Store all conversations for learning
- 🧠 Build player profiles and preferences
- 📈 Improve responses based on past interactions
- 🌍 Support English, Hindi, and Hinglish languages
- 🎮 Access real-time game data for contextual responses

## Current Features (Already Working)
- ✅ Advanced emotional intelligence
- ✅ Contextual responses based on game state
- ✅ Multilingual support (English/Hindi/Hinglish)
- ✅ Real-time game data access
- ✅ Stress detection and emotional support
- ✅ Financial guidance based on player progress
- ✅ Draggable AI chat interface
- ✅ Dark theme integration

Once you complete the database setup, the AI will gain full learning capabilities and conversation memory!