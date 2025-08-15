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

  const handleClearCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      toast.success('Cache cleared successfully! Reload the page to see changes.');
    } catch (error) {
      toast.error('Failed to clear cache. Please try again.');
    }
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
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg border border-blue-100 space-y-6">
            {/* Avatar Selection */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Choose Your Avatar</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {avatarOptions.map(avatar => (
                  <button
                    key={avatar.id}
                    onClick={() => setPlayerProfile(prev => ({ ...prev, avatar: avatar.id }))}
                    className={`relative group p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                      playerProfile.avatar === avatar.id 
                        ? 'border-blue-500 bg-white shadow-lg shadow-blue-500/20' 
                        : 'border-gray-200 hover:border-gray-300 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
                        <img 
                          src={avatar.src} 
                          alt={avatar.alt} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{avatar.alt}</span>
                    </div>
                    {playerProfile.avatar === avatar.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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
              <h3 className="text-lg font-semibold text-black mb-4">Professional Title</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {roleTitleOptions.map(role => (
                  <Button
                    key={role}
                    variant={playerProfile.roleTitle === role ? "default" : "outline"}
                    onClick={() => setPlayerProfile(prev => ({ ...prev, roleTitle: role }))}
                    className={`h-12 rounded-2xl font-medium transition-all ${playerProfile.roleTitle === role 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 text-white" 
                      : "hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 border-2 border-gray-200"
                    }`}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>

            {/* Signature Tagline */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Signature Tagline</h3>
              <div className="relative">
                <Input
                  value={playerProfile.tagline}
                  onChange={(e) => setPlayerProfile(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="Enter your personal motto"
                  maxLength={50}
                  className="pr-16 h-12 text-base bg-white border-2 border-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {playerProfile.tagline.length}/50
                </span>
              </div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg border border-blue-100 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-black">Master Volume</h4>
                <p className="text-sm text-gray-500">Overall audio level</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMute}
                className="w-12 h-10 bg-white hover:bg-gray-50 border-2 border-white"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </Button>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Volume</span>
                <span className="text-sm text-gray-500">{volume}%</span>
              </div>
              <div className="relative">
                <div className="h-1 bg-gray-300 rounded-full relative">
                  {/* Track line with dashes */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-gray-400" style={{
                      backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 2px, #9ca3af 2px, #9ca3af 6px, transparent 6px, transparent 8px)',
                    }}></div>
                  </div>
                  {/* Progress line */}
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${volume}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange([parseInt(e.target.value)])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-black">Background Music</h4>
                <p className="text-sm text-gray-500">Ambient music during gameplay</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={isBackgroundPlaying ? stopBackgroundMusic : playBackgroundMusic}
                disabled={isMuted}
                className="bg-white hover:bg-gray-50 border-2 border-white"
              >
                {isBackgroundPlaying ? 'Stop' : 'Play'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-black">Interface Click Sound</h4>
                <p className="text-sm text-gray-600">Sound for button clicks and interactions</p>
              </div>
              <Select defaultValue="subtle">
                <SelectTrigger className="w-32 bg-white border-2 border-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200">
                  <SelectItem value="off">Off</SelectItem>
                  <SelectItem value="subtle">Subtle Beep</SelectItem>
                  <SelectItem value="typewriter">Typewriter</SelectItem>
                  <SelectItem value="futuristic">Futuristic Pulse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Background Music</h4>
                <p className="text-sm text-gray-600">Calm, minimalist ambient music for focus</p>
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded border border-gray-200">
                Calm Business Lo-Fi
              </div>
            </div>
          </div>
        );

      case 'gameplay':
        return (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg border border-blue-100 space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200 shadow-inner">
              <h4 className="font-semibold text-black mb-2">Game Speed: 24× Faster</h4>
              <p className="text-sm text-gray-600 mb-1">1 real hour = 1 in-game day</p>
              <p className="text-xs text-gray-500">This setting cannot be changed</p>
            </div>

            <div className="space-y-4">
              {[
                { key: 'autoSave', label: 'Skip Animations', desc: 'Disable transition animations for faster gameplay' },
                { key: 'autoSave', label: 'Auto-Save', desc: 'Automatically save progress every 5 minutes' },
                { key: 'notifications', label: 'Notifications', desc: 'Show alerts for important events' }
              ].map(({ key, label, desc }, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <h4 className="font-medium text-black">{label}</h4>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                  <Switch 
                    checked={localSettings[key as keyof typeof localSettings] as boolean}
                    onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, [key]: checked }))}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg border border-blue-100 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-black">Cloud Save</h4>
                  <p className="text-sm text-gray-500">Sync progress across devices</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border border-green-200">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-black">Local Encryption</h4>
                  <p className="text-sm text-gray-500">Secure progress data locally</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border border-green-200">ON</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="outline"
                className="w-full text-yellow-700 border-yellow-300 hover:bg-yellow-50 bg-white border-2"
                onClick={handlePushToGithub}
                disabled={isGithubPushing}
              >
                <Github size={16} className="mr-2" />
                {isGithubPushing ? 'Pushing...' : 'Push Full Project to GitHub'}
              </Button>

              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-inner">
                <p className="text-sm text-gray-600 text-center">
                  Game progress is automatically saved in browser storage. Your progress persists between sessions.
                </p>
              </div>

              <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="w-full text-red-600 border-red-300 hover:bg-red-50 bg-white border-2"
                  >
                    <RotateCcw size={16} className="mr-2" />
                    Reset Game Progress
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Game Progress</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your progress, including financial data, team members, and achievements. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetGame} className="bg-red-600 hover:bg-red-700">
                      Reset Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button 
                variant="outline"
                onClick={handleClearCache}
                className="w-full h-14 text-red-700 border-red-300/60 hover:bg-red-50 bg-white backdrop-blur-sm rounded-3xl font-semibold transition-all duration-300 transform hover:scale-105 border-2"
              >
                <Trash2 size={16} className="mr-2" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/20 border-b border-indigo-200/30 px-6 py-6 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-black">Settings</h1>
              <p className="text-sm text-gray-600 mt-1 font-medium">Customize your Wealth Sprint experience</p>
            </div>
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 text-sm font-semibold rounded-2xl shadow-lg">
              v4.0
            </Badge>
          </div>

          {/* Horizontal Scrollable Menu */}
          <div className="overflow-x-auto">
            <div className="flex space-x-3 min-w-max pb-2">
              {menuTabs.map(tab => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/30'
                        : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200/60 shadow-md'
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
