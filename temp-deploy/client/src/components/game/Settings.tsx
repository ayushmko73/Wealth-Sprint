import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { 
  Settings as SettingsIcon, 
  Download, 
  Github, 
  Smartphone, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ExternalLink 
} from 'lucide-react';

interface BuildStatus {
  step: 'github_push' | 'expo_publish' | 'expo_build' | 'polling' | 'complete' | 'error';
  message: string;
  success: boolean;
  downloadUrl?: string;
  error?: string;
}

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [buildStatus, setBuildStatus] = useState<BuildStatus[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      case 'github_push':
        return <Github className="w-4 h-4" />;
      case 'expo_publish':
      case 'expo_build':
      case 'polling':
        return <Smartphone className="w-4 h-4" />;
      case 'complete':
        return <Download className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusMessage = (status: BuildStatus) => {
    switch (status.step) {
      case 'github_push':
        return status.success ? '✅ GitHub push complete' : '🔄 Pushing to GitHub...';
      case 'expo_publish':
        return status.success ? '✅ Project published to Expo' : '🔄 Publishing to Expo...';
      case 'expo_build':
        return status.success ? '🔄 Expo build started' : '🔄 Starting Expo build...';
      case 'polling':
        return '⏳ Building APK...';
      case 'complete':
        return `📦 APK Ready: ${status.downloadUrl}`;
      case 'error':
        return `❌ ${status.message}`;
      default:
        return status.message;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              <CardTitle>Settings</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          <CardDescription>
            Configure your Wealth Sprint game settings
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* General Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-3">General</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Audio</span>
                <Badge variant="secondary">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Auto-save</span>
                <Badge variant="secondary">Every 5 minutes</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Advanced Settings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Advanced</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            {showAdvanced && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Mobile APK Download
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Generate and download an Android APK file for your mobile device
                  </p>
                  
                  <Button 
                    onClick={handleDownloadAPK}
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
                      <div className="text-sm font-medium">Build Status:</div>
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
                      
                      {/* Success Message */}
                      {buildStatus.some(s => s.step === 'complete' && s.success && s.downloadUrl) && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded text-sm">
                          <div className="text-green-800 font-medium">
                            📦 APK Ready: 
                            <a 
                              href={buildStatus.find(s => s.step === 'complete')?.downloadUrl} 
                              className="text-blue-600 hover:text-blue-800 underline ml-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {buildStatus.find(s => s.step === 'complete')?.downloadUrl}
                            </a>
                          </div>
                        </div>
                      )}
                      
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
              </div>
            )}
          </div>

          <Separator />

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Version: 1.0.0</div>
              <div>Build: Development</div>
              <div>Last Updated: July 2025</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}