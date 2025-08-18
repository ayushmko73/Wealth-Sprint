import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { 
  Settings as SettingsIcon, 
  Download, 
  Smartphone, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Volume2,
  Bell,
  Save,
  User,
  Gamepad2,
  Shield,
  Info
} from 'lucide-react';

interface BuildStatus {
  step: 'github_push' | 'expo_publish' | 'expo_build' | 'polling' | 'complete' | 'error';
  message: string;
  success: boolean;
  downloadUrl?: string;
  error?: string;
}

interface NewSettingsProps {
  onClose: () => void;
}

type SettingsCategory = 'Profile' | 'Audio' | 'Gameplay' | 'Data & Privacy';

export default function NewSettings({ onClose }: NewSettingsProps) {
  const [buildStatus, setBuildStatus] = useState<BuildStatus[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('Profile');

  const handleDownloadAPK = async () => {
    setIsBuilding(true);
    setBuildStatus([]);

    try {
      const response = await fetch('/api/build-apk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const status: BuildStatus = JSON.parse(line.slice(6));
              setBuildStatus(prev => {
                const existingIndex = prev.findIndex(s => s.step === status.step);
                if (existingIndex >= 0) {
                  const newStatus = [...prev];
                  newStatus[existingIndex] = status;
                  return newStatus;
                } else {
                  return [...prev, status];
                }
              });
            } catch (e) {
              console.error('Error parsing build status:', e);
            }
          }
        }
      }
    } catch (error) {
      setBuildStatus(prev => [...prev, {
        step: 'error',
        message: 'Build process failed',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }]);
    } finally {
      setIsBuilding(false);
    }
  };

  const getStatusIcon = (status: BuildStatus) => {
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
      case 'github_push': return <ExternalLink className="w-4 h-4" />;
      case 'expo_publish': return <Smartphone className="w-4 h-4" />;
      case 'expo_build': return <Download className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusMessage = (status: BuildStatus) => {
    if (status.step === 'error') {
      return status.error || status.message;
    }
    return status.message;
  };

  const categories: { key: SettingsCategory; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'Profile', icon: User },
    { key: 'Audio', icon: Volume2 },
    { key: 'Gameplay', icon: Gamepad2 },
    { key: 'Data & Privacy', icon: Shield }
  ];

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'Profile':
        return (
          <div className="space-y-6 p-6">
            {/* Choose Your Avatar */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Choose Your Avatar
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border-2 border-blue-500 relative">
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-center text-sm font-medium text-gray-800">Business Leader</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-center text-sm font-medium text-gray-800">Executive</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-center text-sm font-medium text-gray-800">Innovator</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-center text-sm font-medium text-gray-800">Tech Visionary</p>
                </div>
              </div>
            </div>

            {/* Professional Title */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Professional Title</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Founder
                </button>
                <button className="bg-white text-blue-600 px-4 py-3 rounded-lg font-medium border border-blue-300 hover:bg-blue-50 transition-colors">
                  Visionary
                </button>
              </div>
            </div>
          </div>
        );

      case 'Audio':
        return (
          <div className="space-y-6 p-6">
            {/* Master Volume */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">Master Volume</h3>
                </div>
                <Volume2 className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-blue-600 mb-4">Overall audio level</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-blue-700 mb-2">
                    <span>Volume</span>
                    <span>95%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Music */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Background Music</h4>
              <p className="text-sm text-blue-600 mb-4">Ambient music during gameplay</p>
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Status</span>
                <Badge className="bg-red-500 text-white">Stop</Badge>
              </div>
            </div>

            {/* Interface Click Sound */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Interface Click Sound</h4>
              <p className="text-sm text-blue-600 mb-4">Sound for button clicks and interactions</p>
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Sound Type</span>
                <select className="bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded">
                  <option>Subtle Beep</option>
                  <option>Click</option>
                  <option>Pop</option>
                </select>
              </div>
            </div>

            {/* Background Music Settings */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Background Music</h4>
              <p className="text-sm text-blue-600 mb-4">Calm, minimalist ambient music for focus</p>
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Style</span>
                <Badge className="bg-blue-500 text-white">Calm Business Lo-Fi</Badge>
              </div>
            </div>
          </div>
        );

      case 'Gameplay':
        return (
          <div className="space-y-6 p-6">
            {/* Game Speed */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Gamepad2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">Game Speed: 24x Faster</h3>
              </div>
              <p className="text-sm text-blue-600 mb-2">1 real hour = 1 in-game day</p>
              <p className="text-xs text-blue-500">This setting cannot be changed</p>
            </div>

            {/* Skip Animations */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Skip Animations</h4>
              <p className="text-sm text-blue-600 mb-4">Disable transition animations for faster gameplay</p>
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Status</span>
                <Badge className="bg-green-500 text-white">Enabled</Badge>
              </div>
            </div>

            {/* Auto-Save */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Auto-Save</h4>
              <p className="text-sm text-blue-600 mb-4">Automatically save progress every 5 minutes</p>
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Interval</span>
                <Badge className="bg-blue-500 text-white">5 minutes</Badge>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Notifications</h4>
              <p className="text-sm text-blue-600 mb-4">Show alerts for important events</p>
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Status</span>
                <Badge className="bg-green-500 text-white">Enabled</Badge>
              </div>
            </div>
          </div>
        );

      case 'Data & Privacy':
        return (
          <div className="space-y-6 p-6">
            {/* Cloud Save */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Cloud Save</h4>
              <p className="text-sm text-blue-600 mb-4">Sync progress across devices</p>
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Status</span>
                <Badge className="bg-green-500 text-white">Enabled</Badge>
              </div>
            </div>

            {/* Local Encryption */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Local Encryption</h4>
              <p className="text-sm text-blue-600 mb-4">Secure progress data locally</p>
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Status</span>
                <Badge className="bg-green-500 text-white">ON</Badge>
              </div>
            </div>

            {/* GitHub Integration */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-6 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <ExternalLink className="w-5 h-5 text-amber-600" />
                <h4 className="font-semibold text-amber-800">Push Full Project to GitHub</h4>
              </div>
              <button className="w-full bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors">
                Push to GitHub
              </button>
            </div>

            {/* Data Management */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200 space-y-4">
              <p className="text-sm text-blue-600">
                Game progress is automatically saved in browser storage. Your progress persists between sessions.
              </p>
              
              {/* Reset Game Progress */}
              <button className="w-full bg-red-50 text-red-700 px-4 py-3 rounded-lg font-medium border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Reset Game Progress
              </button>
              
              {/* Clear Cache */}
              <button className="w-full bg-red-50 text-red-700 px-4 py-3 rounded-lg font-medium border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Clear Cache
              </button>
            </div>

            {/* Mobile APK Download */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Mobile APK Download
              </h4>
              <p className="text-sm text-blue-600 mb-3">
                Generate and download an Android APK file for your mobile device
              </p>
              
              <Button 
                onClick={handleDownloadAPK}
                disabled={isBuilding}
                className="w-full mb-3 bg-blue-600 hover:bg-blue-700 text-white"
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
                  <div className="text-sm font-medium text-blue-800">Build Status:</div>
                  {buildStatus.map((status, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {getStatusIcon(status)}
                      {getStepIcon(status.step)}
                      <span className={status.success ? 'text-green-700' : status.step === 'error' ? 'text-red-700' : 'text-blue-700'}>
                        {getStatusMessage(status)}
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
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Header - Inspired by Stock Market/Banking sections */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          {/* Header Content */}
          <div className="flex items-center justify-between p-4 pb-3">
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              <div>
                <h1 className="text-lg font-bold">Settings</h1>
                <p className="text-blue-100 text-xs">Customize your Wealth Sprint experience</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-blue-200">Version</p>
                <p className="text-sm font-bold text-white">v4.0</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                ✕
              </Button>
            </div>
          </div>
          
          {/* Category Navigation - Blue background with white text */}
          <div className="overflow-x-auto px-4 pb-4">
            <div className="flex gap-2 min-w-max">
              {categories.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                    activeCategory === key
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:bg-opacity-80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-h-[calc(95vh-140px)] overflow-y-auto bg-white">
          {renderCategoryContent()}
        </div>
      </Card>
    </div>
  );
}