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
  Gamepad2,
  Zap,
  Crown,
  Lock,
  Github,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';

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
    isMuted, 
    toggleMute, 
    backgroundMusic,
    hitSound,
    successSound 
  } = useAudio();
  
  const [localSettings, setLocalSettings] = useState({
    theme: 'light',
    soundEnabled: !isMuted,
    musicEnabled: !isMuted,
    gameSpeed: 'normal',
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
  
  const [volumeLevel, setVolumeLevel] = useState(50);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [exportData, setExportData] = useState('');
  
  // APK Build states
  const [buildStatus, setBuildStatus] = useState<Array<{
    step: 'github_push' | 'expo_build' | 'polling' | 'complete' | 'error';
    message: string;
    success: boolean;
    downloadUrl?: string;
    error?: string;
  }>>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  
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

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolumeLevel(value[0]);
    
    if (backgroundMusic) {
      backgroundMusic.volume = newVolume * 0.1; // Background music should be quieter
    }
    if (hitSound) {
      hitSound.volume = newVolume * 0.3;
    }
    if (successSound) {
      successSound.volume = newVolume * 0.5;
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
    if (backgroundMusic) {
      if (localSettings.musicEnabled) {
        backgroundMusic.pause();
      } else {
        backgroundMusic.play();
      }
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

  // APK Download Handler - functionality removed but placeholder for future implementation
  const handleAPKDownload = () => {
    console.log('APK download functionality has been disabled');
  };

  const getStatusIcon = (status: any) => {
    if (status.step === 'error') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    if (status.success) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'github_push':
        return <Github className="w-4 h-4" />;
      case 'expo_build':
      case 'polling':
        return <Smartphone className="w-4 h-4" />;
      case 'complete':
        return <Download className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
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
        <TabsList className="grid w-full grid-cols-5">
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
          <TabsTrigger value="advanced" className="flex items-center gap-1">
            <Settings size={14} />
            Advanced
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
                    <span className="text-sm text-gray-600">{volumeLevel}%</span>
                  </div>
                  <Slider
                    value={[volumeLevel]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={5}
                    className="w-full"
                  />
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
                    <p className="text-sm text-gray-600">Ambient audio during gameplay</p>
                  </div>
                  <Select defaultValue="none">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calm">Calm Business Lo-Fi</SelectItem>
                      <SelectItem value="focus">Focus Ambience</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="ceo">CEO Room Echo</SelectItem>
                    </SelectContent>
                  </Select>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'realtime', label: 'Real-time', desc: 'Ideal for immersion' },
                    { value: 'normal', label: 'Balanced', desc: '5 sec delay for decisions' },
                    { value: 'fast', label: 'Fast-Track Mode', desc: '2x for experienced users' },
                    { value: 'turbo', label: 'Turbo Test Mode', desc: 'For practice' },
                  ].map(option => (
                    <Card 
                      key={option.value}
                      className={`cursor-pointer transition-all ${localSettings.gameSpeed === option.value ? 'ring-2 ring-[#d4af37]' : ''}`}
                      onClick={() => handleGameSpeedChange(option.value)}
                    >
                      <CardContent className="pt-4">
                        <h4 className="font-medium">{option.label}</h4>
                        <p className="text-sm text-gray-600">{option.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} />
                Advanced Settings
                <Badge className="bg-purple-500 text-white">Unlockables</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* APK Download Section */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">Mobile APK Download</h4>
                    <p className="text-sm text-blue-700">Generate and download an Android APK file for your mobile device</p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleAPKDownload}
                  disabled={isBuilding}
                  className="w-full mb-3"
                >
                  {isBuilding ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Building APK...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download APK
                    </>
                  )}
                </Button>

                {/* Build Status Display */}
                {buildStatus.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-blue-900">Build Status:</div>
                    {buildStatus.map((status, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {getStatusIcon(status)}
                        {getStepIcon(status.step)}
                        <span className={
                          status.success 
                            ? 'text-green-700' 
                            : status.step === 'error' 
                              ? 'text-red-700' 
                              : 'text-blue-700'
                        }>
                          {status.message}
                        </span>
                        {status.downloadUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="ml-auto"
                          >
                            <a href={status.downloadUrl} download>
                              <Download className="w-3 h-3 mr-1" />
                              Download APK
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {buildStatus.some(s => s.step === 'error') && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                        <strong>Error Details:</strong>
                        <div className="mt-1 font-mono text-xs">
                          {buildStatus.find(s => s.step === 'error')?.error || 'Unknown error occurred'}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 rounded-lg border ${hasControllerSupport ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <Gamepad2 size={20} className={hasControllerSupport ? 'text-green-600' : 'text-gray-400'} />
                    <div>
                      <h4 className="font-medium">Controller Layout</h4>
                      <p className="text-sm text-gray-600">Gamepad support for mobile devices</p>
                    </div>
                  </div>
                  {hasControllerSupport ? (
                    <Badge className="bg-green-500 text-white">Unlocked</Badge>
                  ) : (
                    <Badge variant="outline">Logic 80+ required</Badge>
                  )}
                </div>
                
                <div className={`flex items-center justify-between p-4 rounded-lg border ${hasControllerSupport ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <Gamepad2 size={20} className={hasControllerSupport ? 'text-green-600' : 'text-gray-400'} />
                    <div>
                      <h4 className="font-medium">Controller Layout</h4>
                      <p className="text-sm text-gray-600">Gamepad support for mobile devices</p>
                    </div>
                  </div>
                  {hasControllerSupport ? (
                    <Badge className="bg-green-500 text-white">Unlocked</Badge>
                  ) : (
                    <Badge variant="outline">Logic 80+ required</Badge>
                  )}
                </div>
                
                <div className={`flex items-center justify-between p-4 rounded-lg border ${hasScenarioTuner ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <Zap size={20} className={hasScenarioTuner ? 'text-green-600' : 'text-gray-400'} />
                    <div>
                      <h4 className="font-medium">Scenario Randomizer Tuner</h4>
                      <p className="text-sm text-gray-600">Adjust balance of luck vs logic in scenarios</p>
                    </div>
                  </div>
                  {hasScenarioTuner ? (
                    <Badge className="bg-green-500 text-white">Unlocked</Badge>
                  ) : (
                    <Badge variant="outline">Play for 1 year</Badge>
                  )}
                </div>
                
                {/* Time Engine Debug Console */}
                <div className="flex items-center justify-between p-4 rounded-lg border bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-blue-600" />
                    <div>
                      <h4 className="font-medium">Time Engine Debug</h4>
                      <p className="text-sm text-gray-600">View background time engine status in console</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleTimeEngineDebug}
                    className="border-blue-300 hover:bg-blue-100"
                  >
                    Debug Console
                  </Button>
                </div>
              </div>
              
              {hasAdvancedFeatures && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown size={16} className="text-yellow-600" />
                    <h4 className="font-semibold text-yellow-800">Advanced Features Unlocked!</h4>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Congratulations! You've unlocked advanced customization options. 
                    Your financial success has earned you access to premium features.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-semibold mb-2">Achievement System</h3>
              <p className="text-sm text-gray-600 mb-4">
                Continue playing to unlock more features and customization options.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div className="p-2 bg-gray-50 rounded">
                  <div className="font-medium">Financial Milestones</div>
                  <div className="text-gray-600">Unlock themes & features</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="font-medium">Skill Mastery</div>
                  <div className="text-gray-600">Advanced controls</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="font-medium">Time Investment</div>
                  <div className="text-gray-600">Special customizations</div>
                </div>
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
    </div>
  );
};

export default SettingsSection;
