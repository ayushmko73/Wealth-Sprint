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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../ui/alert-dialog';
import { Label } from '../../ui/label';
import { 
  Settings, 
  User, 
  Volume2, 
  Clock, 
  Shield, 
  VolumeX,
  RotateCcw, 
  Trash2,
  Github,
  Download,
  Briefcase,
  Users,
  Lightbulb,
  Monitor,
  TrendingUp,
  Crown,
} from 'lucide-react';
import { toast } from 'sonner';

const NewSettingsSection: React.FC = () => {
  const { 
    playerStats, 
    financialData, 
    currentWeek, 
    timeEngine,
    resetGame,
    uiState,
    updateUIState
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

  const activeTab = uiState.settingsActiveTab;
  const [localSettings, setLocalSettings] = useState({
    theme: 'light',
    soundEnabled: true,
    musicEnabled: true,
    gameSpeed: 'auto24x',
    notifications: true,
    autoSave: true,
    hapticFeedback: true,
  });

  const [playerProfile, setPlayerProfile] = useState({
    avatar: 'innovator', // Default to innovator
    roleTitle: 'Founder',
    tagline: 'Everything begins with one decision.',
    displayName: 'Player',
  });

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isGithubPushing, setIsGithubPushing] = useState(false);

  // Avatar options with icons
  const avatarOptions = [
    {
      id: 'innovator',
      src: '/avatars/innovator.webp',
      alt: 'Innovator',
      icon: Lightbulb,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'tech_visionary',
      src: '/avatars/tech-visionary.jpg',
      alt: 'Tech Visionary',
      icon: Monitor,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const roleTitleOptions = ['Founder', 'Visionary', 'CXO', 'Capital Architect', 'Entrepreneur', 'Innovator'];

  const menuTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'gameplay', label: 'Gameplay', icon: Clock },
    { id: 'data', label: 'Data & Privacy', icon: Shield }
  ];

  const handleThemeChange = (theme: 'light' | 'dark' | 'cyber') => {
    setLocalSettings(prev => ({ ...prev, theme }));
  };

  const handleGameSpeedChange = (speed: string) => {
    setLocalSettings(prev => ({ ...prev, gameSpeed: speed }));
  };

  const handleVolumeChange = (newValue: number[]) => {
    setVolume(newValue[0]);
    console.log('Volume changed to:', newValue[0]);
  };

  const handlePlayBackgroundMusic = () => {
    console.log('Play background music clicked');
    playBackgroundMusic();
  };

  const handleStopBackgroundMusic = () => {
    console.log('Stop background music clicked');
    stopBackgroundMusic();
  };

  const handleToggleBackgroundMusic = () => {
    console.log('Toggle background music clicked, currently playing:', isBackgroundPlaying);
    if (isBackgroundPlaying) {
      stopBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
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

  const handleClearCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName);
          });
        });
      }
      toast.success('Cache cleared successfully!');
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('Failed to clear cache');
    }
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="p-6 bg-gradient-to-br from-blue-50/30 to-indigo-50/50 rounded-lg space-y-6">
            {/* Avatar Selection */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Choose Your Avatar</h3>
              <div className="grid grid-cols-2 gap-4">
                {avatarOptions.map(avatar => {
                  const IconComponent = avatar.icon;
                  const isSelected = playerProfile.avatar === avatar.id;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => setPlayerProfile(prev => ({ ...prev, avatar: avatar.id }))}
                      className={`relative group p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                        isSelected 
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg shadow-blue-500/20' 
                          : 'border-gray-200 hover:border-gray-300 bg-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          <img 
                            src={avatar.src} 
                            alt={avatar.alt} 
                            className="w-full h-full object-cover"
                          />
                          {/* Icon overlay for selected avatar */}
                          {isSelected && (
                            <div className={`absolute -bottom-0.5 -right-0.5 w-8 h-8 bg-gradient-to-r ${avatar.color} rounded-full flex items-center justify-center shadow-xl border-3 border-white`}>
                              <IconComponent className="w-5 h-5 text-white font-bold" strokeWidth={2.5} />
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-medium text-gray-600">{avatar.alt}</span>
                          {isSelected && (
                            <div className="text-xs text-blue-600 font-semibold mt-1">Selected</div>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
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
                    className={`h-12 rounded-xl font-medium transition-all ${playerProfile.roleTitle === role 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "hover:bg-gray-50 border-gray-200"
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
                  className="pr-16 h-12 text-base"
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
          <div className="p-6 bg-gradient-to-br from-blue-50/30 to-indigo-50/50 rounded-lg space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-black">Master Volume</h4>
                <p className="text-sm text-gray-500">Overall audio level</p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="p-2"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <div className="w-32">
                  <Slider
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    disabled={isMuted}
                    className="[&>span:first-child]:h-2 [&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-gray-200 [&>span:first-child]:to-gray-300 [&>span:first-child]:rounded-full [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg"
                  />
                </div>
                <span className="text-sm text-gray-500 w-12">{Math.round(volume)}%</span>
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
                onClick={handleToggleBackgroundMusic}
                disabled={isMuted}
              >
                {isBackgroundPlaying ? 'Stop' : 'Play'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-black">Interface Click Sound</h4>
                <p className="text-sm text-gray-600">Sound for button clicks and interactions</p>
              </div>
              <Select defaultValue="futuristic">
                <SelectTrigger className="w-48 h-10 bg-white border-2 border-blue-200 rounded-lg shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                  <SelectValue className="text-blue-700 font-medium" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-blue-200 rounded-lg shadow-lg">
                  <SelectItem value="off" className="hover:bg-blue-50 focus:bg-blue-100 rounded-md">Off</SelectItem>
                  <SelectItem value="subtle" className="hover:bg-blue-50 focus:bg-blue-100 rounded-md">Subtle Beep</SelectItem>
                  <SelectItem value="typewriter" className="hover:bg-blue-50 focus:bg-blue-100 rounded-md">Typewriter</SelectItem>
                  <SelectItem value="futuristic" className="hover:bg-blue-50 focus:bg-blue-100 rounded-md text-blue-700 font-medium">Futuristic Pulse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Background Music</h4>
                <p className="text-sm text-gray-600">Calm, minimalist ambient music for focus</p>
              </div>
              <Select defaultValue="calm-lofi">
                <SelectTrigger className="w-48 h-10 bg-white border-2 border-blue-200 rounded-lg shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                  <SelectValue className="text-blue-700 font-medium" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-blue-200 rounded-lg shadow-lg">
                  <SelectItem value="off" className="hover:bg-blue-50 focus:bg-blue-100 rounded-md">Off</SelectItem>
                  <SelectItem value="calm-lofi" className="hover:bg-blue-50 focus:bg-blue-100 rounded-md text-blue-700 font-medium">Calm Business Lo-Fi</SelectItem>
                  <SelectItem value="ambient" className="hover:bg-blue-50 focus:bg-blue-100 rounded-md">Ambient Focus</SelectItem>
                  <SelectItem value="minimal" className="hover:bg-blue-50 focus:bg-blue-100 rounded-md">Minimal Beats</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'gameplay':
        return (
          <div className="p-6 bg-gradient-to-br from-blue-50/30 to-indigo-50/50 rounded-lg space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
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
          <div className="p-6 bg-gradient-to-br from-purple-50/30 to-violet-50/50 rounded-lg space-y-6">
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
                className="w-full text-yellow-700 border-yellow-300 hover:bg-yellow-50"
                onClick={handlePushToGithub}
                disabled={isGithubPushing}
              >
                <Github size={16} className="mr-2" />
                {isGithubPushing ? 'Pushing...' : 'Push Full Project to GitHub'}
              </Button>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-600 text-center">
                  Game progress is automatically saved in browser storage. Your progress persists between sessions.
                </p>
              </div>

              <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="w-full text-red-600 border-red-300 hover:bg-red-50"
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
                className="w-full text-red-700 border-red-300 hover:bg-red-50"
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
    <div className="space-y-0">
      {/* Header - Blue background inspired by Banking/Bonds/Stocks sections */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        {/* Header Content */}
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <div>
              <h1 className="text-lg font-bold">Settings</h1>
              <p className="text-blue-100 text-xs">Customize your Wealth Sprint experience</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-200">Version</p>
            <p className="text-sm font-bold text-white">v4.0</p>
          </div>
        </div>
        
        {/* Menu Navigation - Horizontal categories with blue background */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto">
            {menuTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => updateUIState({ settingsActiveTab: tab.id })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'bg-blue-700 text-white hover:bg-blue-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default NewSettingsSection;