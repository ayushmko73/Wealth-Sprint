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
  Lock
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
    avatar: '👨‍💼',
    roleTitle: 'Founder',
    tagline: 'Everything begins with one decision.',
    displayName: 'Player',
  });

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [exportData, setExportData] = useState('');
  const [isGithubPushing, setIsGithubPushing] = useState(false);
  const [isGithubCleaning, setIsGithubCleaning] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');



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

  const avatarOptions = ['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '🧑‍🚀', '👨‍🎓', '👩‍🎓', '🧑‍🔬'];
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

  const handlePushToGithub = () => {
    setShowPasswordDialog(true);
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      toast.error('Please enter password');
      return;
    }

    setIsGithubPushing(true);
    setShowPasswordDialog(false);
    
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
          commitMessage: '🚀 Complete Wealth Sprint project push from Replit',
          password
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
      setPassword('');
    }
  };

  const handleCleanupGithub = async () => {
    setIsGithubCleaning(true);
    
    try {
      const response = await fetch('/api/github/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repository: 'Wealth-Sprint',
          username: 'ayushmko73',
          branch: 'main'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Repository cleaned up successfully! Unwanted files removed.');
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('GitHub cleanup error:', error);
      alert('❌ Cleanup failed, check GitHub token or internet.');
    } finally {
      setIsGithubCleaning(false);
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#3a3a3a]">Settings</h1>
        <Badge className="bg-[#d4af37] text-white">
          Wealth Sprint v4.0
        </Badge>
      </div>

      <Tabs defaultValue="gameplay" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="audio" className="flex items-center gap-1">
            <Volume2 size={14} />
            Audio
          </TabsTrigger>
          <TabsTrigger value="gameplay" className="flex items-center gap-1">
            <Clock size={14} />
            Gameplay
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-1">
            <Shield size={14} />
            Data
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <User size={14} />
            Profile
          </TabsTrigger>
        </TabsList>



        {/* Audio Settings */}
        <TabsContent value="audio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 size={20} />
                Sound Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Master Volume</h3>
                  <p className="text-sm text-gray-600">Overall audio level</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Volume Level</span>
                    <span className="text-sm text-gray-600">{volume}%</span>
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
                    <h3 className="font-semibold">Background Music</h3>
                    <p className="text-sm text-gray-600">Ambient music during gameplay</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={isBackgroundPlaying ? stopBackgroundMusic : playBackgroundMusic}
                      disabled={isMuted}
                    >
                      {isBackgroundPlaying ? 'Stop' : 'Play'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Interface Click Sound</h4>
                    <p className="text-sm text-gray-600">Sound for button clicks and interactions</p>
                  </div>
                  <Select defaultValue="subtle">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="subtle">Subtle Beep</SelectItem>
                      <SelectItem value="typewriter">Typewriter</SelectItem>
                      <SelectItem value="futuristic">Futuristic Pulse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Background Music</h4>
                    <p className="text-sm text-gray-600">Calm, minimalist ambient music for focus</p>
                  </div>
                  <div className="text-sm text-gray-600 bg-[#f5f0e6] px-3 py-1 rounded">
                    Calm Business Lo-Fi
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gameplay Settings */}
        <TabsContent value="gameplay" className="space-y-4">

          {/* Original Gameplay Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={20} />
                Gameplay Speed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Auto Cycle Rate</h3>
                <Card className="ring-2 ring-[#d4af37] opacity-90">
                  <CardContent className="pt-4">
                    <h4 className="font-medium">24× Faster</h4>
                    <p className="text-sm text-gray-600">1 real hour = 1 in-game day (24x faster than real time)</p>
                    <p className="text-xs text-gray-500 mt-1">This setting cannot be changed</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Skip Animations</h4>
                    <p className="text-sm text-gray-600">Disable transition animations for faster gameplay</p>
                  </div>
                  <Switch 
                    checked={localSettings.autoSave}
                    onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, autoSave: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-Save</h4>
                    <p className="text-sm text-gray-600">Automatically save progress every 5 minutes</p>
                  </div>
                  <Switch 
                    checked={localSettings.autoSave}
                    onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, autoSave: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications</h4>
                    <p className="text-sm text-gray-600">Show alerts for important events</p>
                  </div>
                  <Switch 
                    checked={localSettings.notifications}
                    onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, notifications: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Privacy */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} />
                Data & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cloud Save</h4>
                    <p className="text-sm text-gray-600">Sync progress across devices</p>
                  </div>
                  <Badge className="bg-green-500 text-white">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Local Encryption</h4>
                    <p className="text-sm text-gray-600">Secure progress data locally</p>
                  </div>
                  <Badge className="bg-green-500 text-white">ON</Badge>
                </div>
              </div>

              <div className="space-y-3">
                {/* GitHub Push Button */}
                <div className="space-y-2">
                  <Button 
                    variant="outline"
                    className="w-full text-[#d4af37] hover:text-[#b8941f] border-[#d4af37] hover:border-[#b8941f]"
                    onClick={handlePushToGithub}
                    disabled={isGithubPushing || isGithubCleaning}
                  >
                    <Github size={16} className="mr-2" />
                    {isGithubPushing ? 'Pushing Project...' : 'Push Full Project to GitHub'}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full text-orange-600 hover:text-orange-700 border-orange-300 hover:border-orange-400"
                    onClick={handleCleanupGithub}
                    disabled={isGithubCleaning || isGithubPushing}
                    size="sm"
                  >
                    <Trash2 size={14} className="mr-2" />
                    {isGithubCleaning ? 'Cleaning Repository...' : 'Clean Repository'}
                  </Button>
                </div>
                
                {/* Save buttons removed as per user request */}
                <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                  Game progress is automatically saved in browser storage. Your progress persists between sessions.
                </div>

                <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700"
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Player Profile */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} />
                Player Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Avatar</h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {avatarOptions.map(avatar => (
                    <button
                      key={avatar}
                      onClick={() => setPlayerProfile(prev => ({ ...prev, avatar }))}
                      className={`text-3xl p-3 rounded-lg border-2 transition-all ${
                        playerProfile.avatar === avatar ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Role Title</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {roleTitleOptions.map(role => (
                    <Button
                      key={role}
                      variant={playerProfile.roleTitle === role ? "default" : "outline"}
                      onClick={() => setPlayerProfile(prev => ({ ...prev, roleTitle: role }))}
                      className={playerProfile.roleTitle === role ? "bg-[#d4af37] hover:bg-[#b8941f]" : ""}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Signature Tagline</h3>
                <Input
                  value={playerProfile.tagline}
                  onChange={(e) => setPlayerProfile(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="Enter your personal motto"
                  maxLength={50}
                />
                <p className="text-sm text-gray-500 mt-1">{playerProfile.tagline.length}/50 characters</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Gender Neutrality</h4>
                  <p className="text-sm text-gray-600">Use inclusive language throughout the game</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>

      {/* Footer Quote */}
      <Card className="bg-gradient-to-r from-[#f5f0e6] to-[#d4af37]/10 border-[#d4af37]/20">
        <CardContent className="pt-6 text-center">
          <p className="text-sm italic text-[#3a3a3a]">
            "A well-run empire begins with a well-set interface."
          </p>
          <p className="text-xs text-gray-500 mt-2">— Wealth Sprint v4.0</p>
        </CardContent>
      </Card>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock size={20} />
              Authentication Required
            </DialogTitle>
            <DialogDescription>
              Enter the admin password to push the project to GitHub.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPasswordDialog(false);
                setPassword('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePasswordSubmit}
              disabled={!password || isGithubPushing}
              className="bg-[#d4af37] hover:bg-[#b8941f]"
            >
              {isGithubPushing ? 'Pushing...' : 'Push to GitHub'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsSection;