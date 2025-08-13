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



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      {/* Modern Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-sm text-gray-500 mt-1">Customize your Wealth Sprint experience</p>
          </div>
          <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 text-xs font-medium">
            v4.0
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Modern Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <User size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Player Profile</h2>
                    <p className="text-white/80">Personalize your avatar and identity</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 space-y-6">
                {/* Avatar Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Your Avatar</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {avatarOptions.map(avatar => (
                      <button
                        key={avatar.id}
                        onClick={() => setPlayerProfile(prev => ({ ...prev, avatar: avatar.id }))}
                        className={`relative group p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                          playerProfile.avatar === avatar.id 
                            ? 'border-indigo-500 bg-indigo-50 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            <img 
                              src={avatar.src} 
                              alt={avatar.alt} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">{avatar.alt}</span>
                        </div>
                        {playerProfile.avatar === avatar.id && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Title</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {roleTitleOptions.map(role => (
                      <Button
                        key={role}
                        variant={playerProfile.roleTitle === role ? "default" : "outline"}
                        onClick={() => setPlayerProfile(prev => ({ ...prev, roleTitle: role }))}
                        className={`h-12 ${playerProfile.roleTitle === role 
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                          : "hover:bg-gray-50"
                        }`}
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Signature Tagline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Motto</h3>
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
              </CardContent>
            </Card>
          </div>

          {/* Audio Settings Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Volume2 size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Audio</h2>
              </div>
            </div>
            
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Master Volume</h4>
                  <p className="text-sm text-gray-500">Overall audio level</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMute}
                  className="w-12 h-10"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Volume</span>
                  <span className="text-sm text-gray-500">{volume}%</span>
                </div>
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Background Music</h4>
                  <p className="text-sm text-gray-500">Ambient music during gameplay</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isBackgroundPlaying ? stopBackgroundMusic : playBackgroundMusic}
                  disabled={isMuted}
                >
                  {isBackgroundPlaying ? 'Stop' : 'Play'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Gameplay Settings Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Clock size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Gameplay</h2>
              </div>
            </div>
            
            <CardContent className="p-6 space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-2">Game Speed: 24× Faster</h4>
                <p className="text-sm text-gray-600 mb-1">1 real hour = 1 in-game day</p>
                <p className="text-xs text-gray-500">This setting cannot be changed</p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'autoSave', label: 'Auto-Save', desc: 'Automatically save progress every 5 minutes' },
                  { key: 'notifications', label: 'Notifications', desc: 'Show alerts for important events' }
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="font-medium text-gray-800">{label}</h4>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                    <Switch 
                      checked={localSettings[key as keyof typeof localSettings] as boolean}
                      onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, [key]: checked }))}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy Card */}
          <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Shield size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Data & Privacy</h2>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Cloud Save</h4>
                      <p className="text-sm text-gray-500">Sync progress across devices</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border border-green-200">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Local Encryption</h4>
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
                    {isGithubPushing ? 'Pushing...' : 'Push to GitHub'}
                  </Button>

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
                    className="w-full"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Clear Cache
                  </Button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-600 text-center">
                  Game progress is automatically saved in browser storage. Your progress persists between sessions.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Footer */}
        <Card className="mt-8 bg-gradient-to-r from-gray-50 to-slate-100 border-gray-200 shadow-lg rounded-2xl">
          <CardContent className="pt-6 text-center">
            <p className="text-sm italic text-gray-700">
              "A well-run empire begins with a well-set interface."
            </p>
            <p className="text-xs text-gray-500 mt-2">— Wealth Sprint v4.0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsSection;

