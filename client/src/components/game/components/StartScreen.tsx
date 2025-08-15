import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { useAudio } from '../../../lib/stores/useAudio';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Play, Target, TrendingUp, Users, Briefcase, Info } from 'lucide-react';
import { toast } from 'sonner';

const StartScreen: React.FC = () => {
  const { startGame, updatePlayerStats, playerStats } = useWealthSprintGame();
  const { playSuccess } = useAudio();
  const [playerName, setPlayerName] = useState('Player');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartGame = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name to start playing');
      return;
    }

    setIsStarting(true);
    playSuccess();
    
    // Update player name
    updatePlayerStats({ name: playerName.trim() });
    
    // Start the game immediately without onboarding delay
    startGame();
    setIsStarting(false);
  };

  const OnboardingDialog = () => (
    <Dialog open={showOnboarding} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Welcome to Wealth Sprint!</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4 py-4">
          <div className="text-6xl">💰</div>
          <h3 className="text-lg font-semibold">Get Ready, {playerName}!</h3>
          <p className="text-gray-600">
            Make wise financial choices to reach Financial Freedom. Every decision matters on your journey to wealth.
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-sm text-gray-500">Starting your journey...</p>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f0ff] via-[#e8f2ff] to-[#d6e8ff] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-[#3a3a3a] mb-2">
            Wealth Sprint
          </h1>
          <p className="text-xl text-[#5a5a5a]">
            Your Journey to Financial Freedom Starts Here
          </p>
          <Badge className="bg-[#d4af37] text-white px-4 py-1">
            Version 4.0 - Financial Simulation Game
          </Badge>
        </div>

        {/* Main Start Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#d4af37]/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Start Your Adventure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                What should we call you?
              </label>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="text-center text-lg"
                maxLength={20}
              />
            </div>

            <Button
              onClick={handleStartGame}
              disabled={isStarting}
              className="w-full h-12 text-lg font-semibold bg-[#d4af37] hover:bg-[#b8941f] transition-all duration-300 transform hover:scale-105"
            >
              {isStarting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Starting Game...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play size={20} />
                  Begin Wealth Sprint
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Feature Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Target, label: 'Set Goals', desc: 'Financial targets' },
            { icon: TrendingUp, label: 'Invest', desc: 'Stocks & bonds' },
            { icon: Users, label: 'Build Team', desc: 'Manage staff' },
            { icon: Briefcase, label: 'Make Deals', desc: 'Business opportunities' }
          ].map((feature, index) => (
            <Card key={index} className="bg-white/60 hover:bg-white/80 transition-all duration-300 cursor-pointer group">
              <CardContent className="pt-4 text-center">
                <feature.icon size={32} className="mx-auto mb-2 text-[#d4af37] group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-sm">{feature.label}</h3>
                <p className="text-xs text-gray-600">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info */}
        <div className="text-center">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
            <Info size={16} className="mr-1" />
            How to Play
          </Button>
        </div>
      </div>

      <OnboardingDialog />
    </div>
  );
};

export default StartScreen;