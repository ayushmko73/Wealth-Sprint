import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { useAudio } from '../../../lib/stores/useAudio';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { Slider } from '../../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { 
  Settings, 
  Palette, 
  Volume2, 
  VolumeX, 
  Clock, 
  Shield, 
  User, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2,
  Github,
} from 'lucide-react';
import { toast } from 'sonner';

// APK Download component removed

const SettingsSection: React.FC = () => {
  const { 
    playerStats, 
    financialData, 
    currentWeek, 
    timeEngine,
    resetGame,
  } = useWealthSprintGame();

  const { 
    toggleMute, 
    isMuted, 
    setVolume, 
    volume, 
    playBackgroundMusic, 
    stopBackgroundMusic, 
    isBackgroundPlaying
  } = useAudio();

  const [activeTab, setActiveTab] = useState('profile');
  const [localSettings, setLocalSettings] = useState({
    theme: 'light',
    soundEnabled: true, // Default ON
    musicEnabled: true, // Default ON
    gameSpeed: 'auto24x', // Default to 24x faster auto cycle
    notifications: true,
    autoSave: true,
    hapticFeedback: true,
  });

  const [playerProfile, setPlayerProfile] = useState({
    avatar: 'businessman',
    roleTitle: 'Founder',
    tagline: 'Everything begins with one decision.',
    displayName: 'Player',
  });

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [exportData, setExportData] = useState('');
  const [isGithubPushing, setIsGithubPushing] = useState(false);
  // Clean repository functionality removed as per user request
  // Password dialog removed as per user request



  // Check for unlockable features based on game progress
  const hasAdvancedFeatures = financialData.netWorth >= 10000000; // 1 Cr net worth
  const hasCustomThemes = financialData.netWorth >= 50000000; // 5 Cr net worth
  const hasControllerSupport = playerStats.logic >= 80;
  const hasScenarioTuner = currentWeek >= 52; // 1 year of gameplay

  const handleThemeChange = (theme: 'light' | 'dark' | 'cyber') => {
    setLocalSettings(prev => ({ ...prev, theme }));
  };

  const handleGameSpeedChange = (speed: string) => {
    setLocalSettings(prev => ({ ...prev, gameSpeed: speed }));
  };

  const handleVolumeChange = (newValue: number[]) => {
    setVolume(newValue[0]);
  };

  const handleExportSave = () => {
    const gameData = {
      playerStats,
      financialData,
      currentWeek,
      playerProfile,
      settings: localSettings,
      exportDate: new Date().toISOString(),
      version: '4.0'
    };

    const dataString = JSON.stringify(gameData, null, 2);
    setExportData(dataString);

    // Create download
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wealth-sprint-save-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetGame = () => {
    resetGame();
    setShowResetDialog(false);
  };

  const handleSaveGame = () => {
    // Auto-save functionality 
    console.log('Game saved');
  };

  const handleLoadGame = () => {
    // Auto-load functionality
    console.log('Game loaded');
  };

  const handleSoundToggle = () => {
    toggleMute();
    setLocalSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleMusicToggle = () => {
    toggleMute();
    setLocalSettings(prev => ({ ...prev, musicEnabled: !prev.musicEnabled }));
    if (localSettings.musicEnabled) {
      stopBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
  };

  const avatarOptions = [
    {
      id: 'businessman',
      src: '/avatars/Professional_businessman_avatar_65fb4ef4.png',
      alt: 'Business Leader'
    },
    {
      id: 'businesswoman', 
      src: '/avatars/Professional_businesswoman_avatar_530f5b0d.png',
      alt: 'Executive'
    },
    {
      id: 'entrepreneur',
      src: '/avatars/Entrepreneur_leader_avatar_a3992558.png',
      alt: 'Innovator'
    },
    {
      id: 'tech_dev',
      src: '/avatars/Tech_developer_avatar_4ce56c86.png', 
      alt: 'Tech Visionary'
    }
  ];
  const roleTitleOptions = ['Founder', 'Visionary', 'CXO', 'Capital Architect', 'Entrepreneur', 'Innovator'];

  const menuTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'gameplay', label: 'Gameplay', icon: Clock },
    { id: 'data', label: 'Data & Privacy', icon: Shield }
  ];

  // Time Engine Debug Console
  const handleTimeEngineDebug = () => {
    console.log("⏱️ Game Time Engine Active: 24× faster than real world time");
    console.log("🕰️ 1 real-world hour = 1 in-game day. 5 in-game years = ~75 real hours.");
    console.table({ 
      currentGameDay: timeEngine.currentGameDay,
      currentGameMonth: timeEngine.currentGameMonth, 
      currentGameYear: timeEngine.currentGameYear,
      daysSinceLastScenario: timeEngine.daysSinceLastScenario,
      isGameEnded: timeEngine.isGameEnded
    });
  };

  const handlePushToGithub = async () => {
    setIsGithubPushing(true);
    
    try {
      const response = await fetch('/api/github/push-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repository: 'Wealth-Sprint',
          username: 'ayushmko73',
          branch: 'main',
          commitMessage: '🚀 Complete Wealth Sprint project push from Replit'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const stats = result.stats;
        toast.success(`✅ Successfully pushed ${stats.totalFiles} files to GitHub!`);
      } else {
        toast.error(`❌ GitHub push failed: ${result.error}`);
      }
    } catch (error) {
      console.error('GitHub push error:', error);
      toast.error('❌ Failed to push to GitHub. Check your connection.');
    } finally {
      setIsGithubPushing(false);
    }
  };

  // Removed unused authentication and cleanup functions



  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="p-8 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 rounded-3xl shadow-xl shadow-blue-500/10 border border-gray-200/50 backdrop-blur-sm space-y-8">
            {/* Avatar Selection */}
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent mb-6">Choose Your Avatar</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {avatarOptions.map(avatar => (
                  <button
                    key={avatar.id}
                    onClick={() => setPlayerProfile(prev => ({ ...prev, avatar: avatar.id }))}
                    className={`relative group p-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      playerProfile.avatar === avatar.id 
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl shadow-blue-500/20' 
                        : 'border-gray-200/60 hover:border-blue-300 bg-white/80 backdrop-blur-sm hover:shadow-lg'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
                        <img 
                          src={avatar.src} 
                          alt={avatar.alt} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{avatar.alt}</span>
                    </div>
                    {playerProfile.avatar === avatar.id && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Title */}
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent mb-6">Professional Title</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {roleTitleOptions.map(role => (
                  <Button
                    key={role}
                    variant={playerProfile.roleTitle === role ? "default" : "outline"}
                    onClick={() => setPlayerProfile(prev => ({ ...prev, roleTitle: role }))}
                    className={`h-14 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${playerProfile.roleTitle === role 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25" 
                      : "hover:bg-white hover:shadow-md border-gray-200/60 bg-white/80 backdrop-blur-sm"
                    }`}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>

            {/* Signature Tagline */}
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent mb-6">Signature Tagline</h3>
              <div className="relative">
                <Input
                  value={playerProfile.tagline}
                  onChange={(e) => setPlayerProfile(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="Enter your personal motto"
                  maxLength={50}
                  className="pr-16 h-14 text-base rounded-2xl border-gray-300/60 bg-white/80 backdrop-blur-sm shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                  {playerProfile.tagline.length}/50
                </span>
              </div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="p-8 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 rounded-3xl shadow-xl shadow-blue-500/10 border border-gray-200/50 backdrop-blur-sm space-y-8">
            <div className="flex items-center justify-between p-6 bg-white/80 rounded-2xl border border-gray-200/60 backdrop-blur-sm">
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Master Volume</h4>
                <p className="text-sm text-gray-600 font-medium">Overall audio level</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMute}
                className="w-14 h-12 rounded-xl border-gray-300/60 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-300"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>
            </div>

            <div className="p-6 bg-white/80 rounded-2xl border border-gray-200/60 backdrop-blur-sm">
              <div className="flex justify-between mb-4">
                <span className="text-sm font-bold text-gray-700">Volume</span>
                <span className="text-sm text-gray-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">{volume}%</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-white/80 rounded-2xl border border-gray-200/60 backdrop-blur-sm">
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Background Music</h4>
                <p className="text-sm text-gray-600 font-medium">Ambient music during gameplay</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={isBackgroundPlaying ? stopBackgroundMusic : playBackgroundMusic}
                disabled={isMuted}
                className="rounded-xl border-gray-300/60 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-300 px-6 py-2"
              >
                {isBackgroundPlaying ? 'Stop' : 'Play'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-6 bg-white/80 rounded-2xl border border-gray-200/60 backdrop-blur-sm">
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Interface Click Sound</h4>
                <p className="text-sm text-gray-600 font-medium">Sound for button clicks and interactions</p>
              </div>
              <Select defaultValue="subtle">
                <SelectTrigger className="w-40 h-12 rounded-xl border-gray-300/60 bg-white/80 backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200/60 bg-white/95 backdrop-blur-md">
                  <SelectItem value="off">Off</SelectItem>
                  <SelectItem value="subtle">Subtle Beep</SelectItem>
                  <SelectItem value="typewriter">Typewriter</SelectItem>
                  <SelectItem value="futuristic">Futuristic Pulse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-6 bg-white/80 rounded-2xl border border-gray-200/60 backdrop-blur-sm">
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Background Music Style</h4>
                <p className="text-sm text-gray-600 font-medium">Calm, minimalist ambient music for focus</p>
              </div>
              <div className="text-sm text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-200/60 font-semibold">
                Calm Business Lo-Fi
              </div>
            </div>
          </div>
        );

      case 'gameplay':
        return (
          <div className="p-8 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 rounded-3xl shadow-xl shadow-blue-500/10 border border-gray-200/50 backdrop-blur-sm space-y-8">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 p-6 rounded-2xl border border-blue-200/60 shadow-inner">
              <h4 className="font-bold text-gray-800 mb-3 text-lg">Game Speed: 24× Faster</h4>
              <p className="text-sm text-gray-700 mb-2 font-medium">1 real hour = 1 in-game day</p>
              <p className="text-xs text-gray-600 font-medium bg-white/60 px-3 py-1 rounded-full inline-block">This setting cannot be changed</p>
            </div>

            <div className="space-y-6">
              {[
                { key: 'autoSave', label: 'Skip Animations', desc: 'Disable transition animations for faster gameplay' },
                { key: 'autoSave', label: 'Auto-Save', desc: 'Automatically save progress every 5 minutes' },
                { key: 'notifications', label: 'Notifications', desc: 'Show alerts for important events' }
              ].map(({ key, label, desc }, index) => (
                <div key={index} className="flex items-center justify-between p-6 bg-white/80 rounded-2xl border border-gray-200/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{label}</h4>
                    <p className="text-sm text-gray-600 font-medium">{desc}</p>
                  </div>
                  <Switch 
                    checked={localSettings[key as keyof typeof localSettings] as boolean}
                    onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, [key]: checked }))}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-indigo-600"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="p-8 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 rounded-3xl shadow-xl shadow-blue-500/10 border border-gray-200/50 backdrop-blur-sm space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-white/80 rounded-2xl border border-gray-200/60 backdrop-blur-sm">
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Cloud Save</h4>
                  <p className="text-sm text-gray-600 font-medium">Sync progress across devices</p>
                </div>
                <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/60 px-4 py-2 rounded-full font-semibold">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-6 bg-white/80 rounded-2xl border border-gray-200/60 backdrop-blur-sm">
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Local Encryption</h4>
                  <p className="text-sm text-gray-600 font-medium">Secure progress data locally</p>
                </div>
                <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/60 px-4 py-2 rounded-full font-semibold">ON</Badge>
              </div>
            </div>

            <div className="space-y-6">
              <Button 
                variant="outline"
                className="w-full h-14 text-yellow-700 border-yellow-300/60 hover:bg-yellow-50 bg-white/80 backdrop-blur-sm rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
                onClick={handlePushToGithub}
                disabled={isGithubPushing}
              >
                <Github size={18} className="mr-3" />
                {isGithubPushing ? 'Pushing...' : 'Push Full Project to GitHub'}
              </Button>

              <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-2xl border border-blue-200/60 shadow-inner">
                <p className="text-sm text-gray-700 text-center font-medium">
                  Game progress is automatically saved in browser storage. Your progress persists between sessions.
                </p>
              </div>

              <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="w-full h-14 text-red-600 border-red-300/60 hover:bg-red-50 bg-white/80 backdrop-blur-sm rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    <RotateCcw size={18} className="mr-3" />
                    Reset Game Progress
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl border border-gray-200/60 bg-white/95 backdrop-blur-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">Reset Game Progress</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 font-medium">
                      This will permanently delete all your progress, including financial data, team members, and achievements. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetGame} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl">
                      Reset Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button 
                variant="outline"
                className="w-full h-14 bg-white/80 backdrop-blur-sm rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 border-gray-300/60 hover:bg-white hover:shadow-md"
              >
                <Trash2 size={18} className="mr-3" />
                Clear Cache
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/30 border-b border-gray-200/50 backdrop-blur-sm px-6 py-6 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">Settings</h1>
              <p className="text-sm text-gray-600 mt-2 font-medium">Customize your Wealth Sprint experience</p>
            </div>
            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-xs font-semibold rounded-full shadow-lg">
              v4.0
            </Badge>
          </div>

          {/* Horizontal Scrollable Menu */}
          <div className="overflow-x-auto">
            <div className="flex space-x-3 min-w-max pb-3">
              {menuTabs.map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25'
                        : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-lg border border-gray-200/50 backdrop-blur-sm'
                    }`}
                  >
                    <IconComponent size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SettingsSection;
