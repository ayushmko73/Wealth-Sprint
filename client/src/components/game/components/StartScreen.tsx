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
    <div className="min-h-screen bg-gradient-to-br from-[#e6f0ff] via-[#e8f2ff] to-[#d6e8ff] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Professional Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-blue-300/50 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-light text-slate-800 mb-3 tracking-tight">
            Wealth Sprint
          </h1>
          <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto mb-4">
            Your Journey to Financial Freedom Starts Here
          </p>
          <Badge className="bg-blue-600/90 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium rounded-full">
            Version 4.0 - Financial Simulation Game
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Start Section */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-md border-0 shadow-2xl shadow-blue-200/40">
              <CardHeader className="pb-4">
                <CardTitle className="text-center text-2xl font-semibold text-slate-800">
                  Start Your Adventure
                </CardTitle>
                <p className="text-center text-slate-600 text-sm">
                  Begin your path to financial freedom
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 block">
                    What should we call you?
                  </label>
                  <Input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="h-12 text-center text-lg border-2 border-slate-200 focus:border-blue-500 rounded-lg"
                    maxLength={20}
                  />
                </div>

                <Button
                  onClick={handleStartGame}
                  disabled={isStarting}
                  className="w-full h-14 text-lg font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isStarting ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Starting Game...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Play size={22} />
                      Begin Wealth Sprint
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Core Features</h2>
              <p className="text-slate-600">Master these key areas to build wealth</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Target, label: 'Set Goals', desc: 'Define clear financial targets and milestones', color: 'bg-blue-50 text-blue-700' },
                { icon: TrendingUp, label: 'Invest', desc: 'Build portfolio with stocks & bonds', color: 'bg-green-50 text-green-700' },
                { icon: Users, label: 'Build Team', desc: 'Recruit and manage talented staff', color: 'bg-purple-50 text-purple-700' },
                { icon: Briefcase, label: 'Make Deals', desc: 'Explore profitable business opportunities', color: 'bg-orange-50 text-orange-700' }
              ].map((feature, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <feature.icon size={24} />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800 mb-2">{feature.label}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bottom Action */}
            <div className="text-center mt-8">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-white/50 backdrop-blur-sm rounded-lg px-6 py-3">
                <Info size={18} className="mr-2" />
                How to Play
              </Button>
            </div>
          </div>
        </div>
      </div>

      <OnboardingDialog />
    </div>
  );
};

export default StartScreen;