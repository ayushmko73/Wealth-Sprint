import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { 
  Heart, 
  Brain, 
  Zap, 
  TrendingUp, 
  Activity, 
  Target,
  AlertTriangle,
  CheckCircle,
  Smile,
  Frown,
  Meh,
  User
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const EmotionHistorySection: React.FC = () => {
  const { playerStats, currentWeek, timeEngine } = useWealthSprintGame();
  const [selectedCategory, setSelectedCategory] = useState('Overview');

  // Categories for the horizontal menu
  const categories = ['Overview', 'Emotion', 'Logic', 'Karma'];

  // Category icons mapping
  const categoryIcons: Record<string, JSX.Element> = {
    'Overview': <Heart className="w-4 h-4" />,
    'Emotion': <Smile className="w-4 h-4" />,
    'Logic': <Brain className="w-4 h-4" />,
    'Karma': <Zap className="w-4 h-4" />
  };

  // Generate emotion history data based on current game state
  const generateEmotionData = () => {
    const data = [];
    const currentGameYear = timeEngine.currentGameYear;
    
    // Generate data for months (Jan to Jun for demonstration, matching the screenshot)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    for (let i = 0; i < months.length; i++) {
      const month = months[i];
      const monthNumber = i + 1;
      
      // Only show actual data for months the player has experienced
      if (monthNumber <= timeEngine.currentGameMonth && timeEngine.currentGameYear >= 1) {
        // Simulate emotion progression based on player stats and game events
        const baseEmotion = playerStats.emotion;
        const baseLogic = playerStats.logic;
        const baseKarma = playerStats.karma;
        
        // Add some variation to show progression over time
        const emotionVariation = Math.sin(i * 0.5) * 15;
        const logicVariation = Math.cos(i * 0.4) * 10;
        const karmaVariation = Math.sin(i * 0.3) * 12;
        
        data.push({
          month,
          emotion: Math.max(0, Math.min(100, baseEmotion + emotionVariation)),
          logic: Math.max(0, Math.min(100, baseLogic + logicVariation)),
          karma: Math.max(0, Math.min(100, baseKarma + karmaVariation))
        });
      } else {
        // Show current stats for future months or starting values
        data.push({
          month,
          emotion: monthNumber === 1 ? 50 : 0,
          logic: monthNumber === 1 ? 50 : 0,
          karma: monthNumber === 1 ? 50 : 0
        });
      }
    }
    
    return data;
  };

  const emotionData = generateEmotionData();

  // Get category colors for navigation - Blue and white theme
  const getCategoryColors = (category: string, isSelected: boolean) => {
    const baseColors: Record<string, string> = {
      'Overview': isSelected ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200',
      'Emotion': isSelected ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200',
      'Logic': isSelected ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200',
      'Karma': isSelected ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
    };
    return baseColors[category] || 'bg-white text-blue-600 border border-blue-200';
  };

  // Calculate current values
  const currentEmotion = playerStats.emotion;
  const currentLogic = playerStats.logic;
  const currentKarma = playerStats.karma;

  const getEmotionIcon = (emotion: number) => {
    if (emotion >= 70) return <Smile className="w-5 h-5 text-green-600" />;
    if (emotion >= 40) return <Meh className="w-5 h-5 text-yellow-600" />;
    return <Frown className="w-5 h-5 text-red-600" />;
  };

  const getStatColor = (value: number) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderOverviewContent = () => (
    <div className="space-y-6">
      {/* Current Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold text-red-800">Emotion</span>
          </div>
          <div className={`text-xl font-bold ${getStatColor(currentEmotion)}`}>{currentEmotion}</div>
          <div className="text-xs text-red-600">Current Level</div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Logic</span>
          </div>
          <div className={`text-xl font-bold ${getStatColor(currentLogic)}`}>{currentLogic}</div>
          <div className="text-xs text-blue-600">Current Level</div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-800">Karma</span>
          </div>
          <div className={`text-xl font-bold ${getStatColor(currentKarma)}`}>{currentKarma}</div>
          <div className="text-xs text-green-600">Current Level</div>
        </div>
      </div>

      {/* Emotion History Chart */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-600" />
          Emotional Stats History
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={emotionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="emotion" 
              stroke="#ef4444" 
              strokeWidth={3}
              name="Emotion"
            />
            <Line 
              type="monotone" 
              dataKey="logic" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="Logic"
            />
            <Line 
              type="monotone" 
              dataKey="karma" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Karma"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Bottom Summary Cards matching the screenshot */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Emotion</div>
          <div className={`text-2xl font-bold ${getStatColor(currentEmotion)}`}>{currentEmotion}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <Brain className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Logic</div>
          <div className={`text-2xl font-bold ${getStatColor(currentLogic)}`}>{currentLogic}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <Zap className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Karma</div>
          <div className={`text-2xl font-bold ${getStatColor(currentKarma)}`}>{currentKarma}</div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          How to Improve Your Emotional Stats
        </h4>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            Make balanced decisions that consider both logic and emotion
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            Practice kindness in business dealings to boost karma
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            Take time to reflect before making major financial decisions
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            Build relationships and maintain work-life balance
          </li>
        </ul>
      </div>
    </div>
  );

  const renderEmotionContent = () => (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Smile className="w-5 h-5 text-red-600" />
          Emotion Trend Analysis
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={emotionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="emotion" 
              stroke="#ef4444" 
              fill="#ef4444" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h4 className="font-semibold text-red-800 mb-3">Emotion Management Tips</h4>
        <ul className="space-y-2 text-sm text-red-700">
          <li>• Practice mindfulness and stress management techniques</li>
          <li>• Maintain healthy relationships and social connections</li>
          <li>• Take breaks and prioritize self-care</li>
          <li>• Celebrate small wins and achievements</li>
        </ul>
      </div>
    </div>
  );

  const renderLogicContent = () => (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          Logic Development Over Time
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={emotionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="logic" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-3">Logic Enhancement Tips</h4>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>• Study financial markets and investment strategies</li>
          <li>• Analyze data before making important decisions</li>
          <li>• Learn from mistakes and adapt strategies</li>
          <li>• Seek advice from mentors and experts</li>
        </ul>
      </div>
    </div>
  );

  const renderKarmaContent = () => (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-600" />
          Karma Progress Tracking
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={emotionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="karma" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-800 mb-3">Karma Building Tips</h4>
        <ul className="space-y-2 text-sm text-green-700">
          <li>• Help team members and support their growth</li>
          <li>• Make ethical business decisions</li>
          <li>• Give back to the community</li>
          <li>• Practice fairness in all dealings</li>
        </ul>
      </div>
    </div>
  );

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'Overview': return renderOverviewContent();
      case 'Emotion': return renderEmotionContent();
      case 'Logic': return renderLogicContent();
      case 'Karma': return renderKarmaContent();
      default: return renderOverviewContent();
    }
  };

  return (
    <div className="space-y-4">
      {/* Emotion Status History Header - Full Width Blue Design */}
      <div className="mx-2">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          {/* Main Header Row */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Emotional Stats History</h2>
                  <p className="text-blue-200 text-sm">Track your emotional journey and growth</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-200">Current Status</div>
                <div className="text-lg font-bold">Balanced</div>
              </div>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-4 px-4 pb-4">
            <div>
              <p className="text-blue-200 text-xs">Emotion</p>
              <p className="text-sm font-bold">{currentEmotion}</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Logic</p>
              <p className="text-sm font-bold">{currentLogic}</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Karma</p>
              <p className="text-sm font-bold">{currentKarma}</p>
            </div>
          </div>
          
          {/* Category Navigation - Attached to Header Background */}
          <div className="overflow-x-auto px-4 pb-4">
            <div className="flex gap-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shadow-md ${
                    getCategoryColors(category, selectedCategory === category)
                  }`}
                >
                  {categoryIcons[category]}
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content based on selected category */}
      <div className="px-4">
        {renderCategoryContent()}
      </div>
    </div>
  );
};

export default EmotionHistorySection;