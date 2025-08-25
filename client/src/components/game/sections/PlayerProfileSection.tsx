import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { useTeamManagement } from '../../../lib/stores/useTeamManagement';
import { useAudio } from '../../../lib/stores/useAudio';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { Slider } from '../../ui/slider';
import { Progress } from '../../ui/progress';
import { 
  User, 
  Settings, 
  Volume2, 
  VolumeX, 
  Clock, 
  Shield, 
  UserCog,
  Trophy,
  Target,
  Heart,
  Brain,
  Scale,
  Zap,
  Star,
  Award,
  Crown,
  Briefcase,
  Calendar,
  TrendingUp,
  DollarSign,
  Users
} from 'lucide-react';
import { formatMoney } from '../../../lib/utils/formatMoney';

const PlayerProfileSection: React.FC = () => {
  const { 
    playerStats, 
    financialData, 
    currentWeek, 
    currentDay, 
    timeEngine 
  } = useWealthSprintGame();
  
  const { teamMembers } = useTeamManagement();
  const { 
    toggleMute, 
    isMuted, 
    setVolume, 
    volume, 
    playBackgroundMusic, 
    stopBackgroundMusic, 
    isBackgroundPlaying
  } = useAudio();

  const [selectedCategory, setSelectedCategory] = useState('Profile');
  const [localSettings, setLocalSettings] = useState({
    soundEnabled: true,
    musicEnabled: true,
    gameSpeed: 'auto24x',
    notifications: true,
    autoSave: true
  });

  const [playerProfile, setPlayerProfile] = useState({
    avatar: 'business_leader',
    roleTitle: 'Founder',
    displayName: 'Wealth Builder',
    tagline: 'Building wealth one decision at a time'
  });

  // Categories for the horizontal menu
  const categories = ['Profile', 'Audio', 'Gameplay', 'Achievements', 'Statistics'];

  // Category icons mapping
  const categoryIcons: Record<string, JSX.Element> = {
    'Profile': <User className="w-4 h-4" />,
    'Audio': <Volume2 className="w-4 h-4" />,
    'Gameplay': <Clock className="w-4 h-4" />,
    'Achievements': <Trophy className="w-4 h-4" />,
    'Statistics': <TrendingUp className="w-4 h-4" />
  };

  // Get category colors for blue theme - matching other sections
  const getCategoryColors = (category: string, isSelected: boolean) => {
    return {
      bg: isSelected 
        ? 'bg-white text-blue-800 shadow-md border-blue-200' 
        : 'bg-blue-600/10 text-white hover:bg-blue-600/20 border-blue-400/30',
      border: isSelected ? 'border-blue-200' : 'border-blue-400/30'
    };
  };

  // Avatar options
  const avatarOptions = [
    { id: 'business_leader', name: 'Business Leader', emoji: '👨‍💼' },
    { id: 'executive', name: 'Executive', emoji: '👩‍💼' },
    { id: 'innovator', name: 'Innovator', emoji: '👨‍💻' },
    { id: 'tech_visionary', name: 'Tech Visionary', emoji: '👨‍🔬' }
  ];

  const titleOptions = [
    'Founder', 'Visionary', 'Entrepreneur', 'CEO', 'Investor', 'Builder'
  ];

  // Key achievements based on game progress
  const getAchievements = () => {
    const achievements = [];
    
    if (financialData.netWorth >= 1000000) {
      achievements.push({ name: 'Millionaire', icon: '💰', description: 'Reached ₹10L+ net worth' });
    }
    if (teamMembers.length >= 5) {
      achievements.push({ name: 'Team Builder', icon: '👥', description: 'Built a team of 5+ members' });
    }
    if (playerStats.logic >= 80) {
      achievements.push({ name: 'Strategic Thinker', icon: '🧠', description: 'Logic skill at 80%+' });
    }
    if (currentWeek >= 12) {
      achievements.push({ name: 'Persistent Player', icon: '📅', description: 'Played for 12+ weeks' });
    }
    if (financialData.investments.stocks >= 500000) {
      achievements.push({ name: 'Stock Investor', icon: '📈', description: 'Invested ₹5L+ in stocks' });
    }
    
    return achievements;
  };

  const achievements = getAchievements();

  const renderContent = () => {
    switch (selectedCategory) {
      case 'Profile':
        return (
          <div className="space-y-6">
            {/* Player Profile Card */}
            <Card className="bg-white border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Player Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Avatar Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Your Avatar</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {avatarOptions.map((avatar) => (
                        <div
                          key={avatar.id}
                          onClick={() => setPlayerProfile(prev => ({ ...prev, avatar: avatar.id }))}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            playerProfile.avatar === avatar.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{avatar.emoji}</div>
                            <div className="text-sm font-medium text-gray-700">{avatar.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Profile Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                        <Input
                          value={playerProfile.displayName}
                          onChange={(e) => setPlayerProfile(prev => ({ ...prev, displayName: e.target.value }))}
                          placeholder="Your display name"
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                        <div className="grid grid-cols-2 gap-2">
                          {titleOptions.map((title) => (
                            <Button
                              key={title}
                              variant={playerProfile.roleTitle === title ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPlayerProfile(prev => ({ ...prev, roleTitle: title }))}
                              className={playerProfile.roleTitle === title ? "bg-blue-600 hover:bg-blue-700" : "border-blue-200 hover:bg-blue-50"}
                            >
                              {title}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Personal Tagline</label>
                        <Input
                          value={playerProfile.tagline}
                          onChange={(e) => setPlayerProfile(prev => ({ ...prev, tagline: e.target.value }))}
                          placeholder="Your personal motto"
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'Audio':
        return (
          <div className="space-y-6">
            <Card className="bg-white border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Audio Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Master Volume */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Master Volume</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="p-2 text-gray-600"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <span className="text-sm font-semibold text-blue-600">{volume}%</span>
                    </div>
                  </div>
                  <Slider
                    value={[volume]}
                    onValueChange={(value) => setVolume(value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Background Music */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Background Music</h4>
                    <p className="text-sm text-gray-600">Ambient music during gameplay</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isBackgroundPlaying ? "destructive" : "default"}
                      size="sm"
                      onClick={isBackgroundPlaying ? stopBackgroundMusic : playBackgroundMusic}
                      className={isBackgroundPlaying ? "" : "bg-blue-600 hover:bg-blue-700"}
                    >
                      {isBackgroundPlaying ? 'Stop' : 'Play'}
                    </Button>
                  </div>
                </div>

                {/* Sound Effects */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Sound Effects</h4>
                    <p className="text-sm text-gray-600">Button clicks and interface sounds</p>
                  </div>
                  <Switch
                    checked={localSettings.soundEnabled}
                    onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, soundEnabled: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'Gameplay':
        return (
          <div className="space-y-6">
            <Card className="bg-white border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Gameplay Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Game Speed */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Game Speed: 24x Faster</h4>
                  <p className="text-sm text-gray-600 mb-1">1 real hour = 1 in-game day</p>
                  <p className="text-xs text-gray-500">This setting cannot be changed</p>
                </div>

                {/* Auto-Save */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Auto-Save</h4>
                    <p className="text-sm text-gray-600">Automatically save progress every 5 minutes</p>
                  </div>
                  <Switch
                    checked={localSettings.autoSave}
                    onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, autoSave: checked }))}
                  />
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Notifications</h4>
                    <p className="text-sm text-gray-600">Show alerts for important events</p>
                  </div>
                  <Switch
                    checked={localSettings.notifications}
                    onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, notifications: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'Achievements':
        return (
          <div className="space-y-6">
            <Card className="bg-white border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievements & Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Achievements Yet</h3>
                    <p className="text-gray-500">Keep playing to unlock achievements!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'Statistics':
        return (
          <div className="space-y-6">
            {/* Player Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Net Worth</p>
                      <p className="text-xl font-bold text-blue-900">{formatMoney(financialData.netWorth)}</p>
                    </div>
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Team Size</p>
                      <p className="text-xl font-bold text-green-900">{teamMembers.length}</p>
                    </div>
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Game Week</p>
                      <p className="text-xl font-bold text-purple-900">W{currentWeek}</p>
                    </div>
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">Year</p>
                      <p className="text-xl font-bold text-orange-900">{timeEngine.currentGameYear}</p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skills Breakdown */}
            <Card className="bg-white border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Skills Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="mb-3">
                      <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800">Emotion</h4>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-2">{playerStats.emotion}%</div>
                    <Progress value={playerStats.emotion} className="w-full" />
                  </div>
                  
                  <div className="text-center">
                    <div className="mb-3">
                      <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800">Logic</h4>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">{playerStats.logic}%</div>
                    <Progress value={playerStats.logic} className="w-full" />
                  </div>
                  
                  <div className="text-center">
                    <div className="mb-3">
                      <Scale className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800">Karma</h4>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-2">{playerStats.karma}%</div>
                    <Progress value={playerStats.karma} className="w-full" />
                  </div>
                  
                  <div className="text-center">
                    <div className="mb-3">
                      <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800">Reputation</h4>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mb-2">{playerStats.reputation}%</div>
                    <Progress value={playerStats.reputation} className="w-full" />
                  </div>
                  
                  <div className="text-center">
                    <div className="mb-3">
                      <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800">Energy</h4>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600 mb-2">{playerStats.energy}%</div>
                    <Progress value={playerStats.energy} className="w-full" />
                  </div>
                  
                  <div className="text-center">
                    <div className="mb-3">
                      <Target className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800">Stress</h4>
                    </div>
                    <div className="text-2xl font-bold text-cyan-600 mb-2">{100 - playerStats.stress}%</div>
                    <Progress value={100 - playerStats.stress} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">Select a category</h3>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      {/* Header - matching Banking/Stock Market sections */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Player Settings</h1>
            <p className="text-blue-100 text-sm lg:text-base opacity-90">
              Customize your Wealth Sprint experience
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">Week {currentWeek}, Day {currentDay}</div>
            <div className="text-sm text-blue-200">v4.0</div>
          </div>
        </div>
      </div>

      {/* Horizontal Menu - matching other sections */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mb-6 p-2 shadow-lg">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const colors = getCategoryColors(category, selectedCategory === category);
            return (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant="ghost"
                className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all duration-200 ${colors.bg} ${colors.border}`}
              >
                {categoryIcons[category]}
                <span className="text-sm font-medium">{category}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default PlayerProfileSection;