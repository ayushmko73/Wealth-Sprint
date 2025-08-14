import React from 'react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { useDecisionSystem } from '../../lib/stores/useDecisionSystem';
import { formatIndianCurrency } from '../../lib/utils';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { 
  DollarSign, 
  Heart, 
  AlertTriangle, 
  Brain, 
  Scale, 
  Star, 
  Battery,
  TrendingUp,
  TrendingDown,
  Target,
  PlayCircle
} from 'lucide-react';

const DashboardBar: React.FC = () => {
  const { playerStats, financialData, currentWeek, currentDay, gameState } = useWealthSprintGame();
  const { startDailyDecisions, hasCompletedToday } = useDecisionSystem();

  // Using the new Indian currency formatting function

  const getStatColor = (value: number, isStress = false) => {
    if (isStress) {
      // For stress, lower is better
      if (value <= 20) return 'text-green-600';
      if (value <= 40) return 'text-yellow-600';
      if (value <= 60) return 'text-orange-600';
      return 'text-red-600';
    } else {
      // For other stats, higher is better
      if (value >= 80) return 'text-green-600';
      if (value >= 60) return 'text-yellow-600';
      if (value >= 40) return 'text-orange-600';
      return 'text-red-600';
    }
  };

  const getStatBgColor = (value: number, isStress = false) => {
    if (isStress) {
      if (value <= 20) return 'bg-green-100';
      if (value <= 40) return 'bg-yellow-100';
      if (value <= 60) return 'bg-orange-100';
      return 'bg-red-100';
    } else {
      if (value >= 80) return 'bg-green-100';
      if (value >= 60) return 'bg-yellow-100';
      if (value >= 40) return 'bg-orange-100';
      return 'bg-red-100';
    }
  };

  const fiProgress = Math.min(100, (financialData.sideIncome / financialData.monthlyExpenses) * 100);

  const stats = [
    {
      icon: Heart,
      label: 'Emotion',
      value: playerStats.emotion,
      color: getStatColor(playerStats.emotion),
      bgColor: getStatBgColor(playerStats.emotion)
    },
    {
      icon: AlertTriangle,
      label: 'Stress',
      value: playerStats.stress,
      color: getStatColor(playerStats.stress, true),
      bgColor: getStatBgColor(playerStats.stress, true)
    },
    {
      icon: Brain,
      label: 'Logic',
      value: playerStats.logic,
      color: getStatColor(playerStats.logic),
      bgColor: getStatBgColor(playerStats.logic)
    },
    {
      icon: Scale,
      label: 'Karma',
      value: playerStats.karma,
      color: getStatColor(playerStats.karma),
      bgColor: getStatBgColor(playerStats.karma)
    },
    {
      icon: Star,
      label: 'Reputation',
      value: playerStats.reputation,
      color: getStatColor(playerStats.reputation),
      bgColor: getStatBgColor(playerStats.reputation)
    },
    {
      icon: Battery,
      label: 'Energy',
      value: playerStats.energy,
      color: getStatColor(playerStats.energy),
      bgColor: getStatBgColor(playerStats.energy)
    }
  ];

  return (
    <div className="space-y-4 max-w-md mx-auto p-4 bg-white rounded-2xl shadow-lg border border-gray-200 my-4">
      {/* Main Financial Card */}
      <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 text-white rounded-3xl overflow-hidden shadow-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} />
                <span className="text-sm opacity-90">Net Worth</span>
              </div>
              <div className="text-2xl font-bold">{formatIndianCurrency(financialData.netWorth)}</div>
              <div className="text-xs opacity-75">
                {financialData.netWorth >= 0 ? 'Positive Growth' : 'Recovery Mode'}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} />
                <span className="text-sm opacity-90">Monthly Income</span>
              </div>
              <div className="text-2xl font-bold">
                {formatIndianCurrency(financialData.mainIncome + financialData.sideIncome)}
              </div>
              <div className="text-xs opacity-75">Main + Side Income</div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">FI Progress</span>
              <span className="text-sm font-bold">{fiProgress.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs opacity-80 mb-3">
              <span>Week {currentWeek}, Day {currentDay}</span>
              <span>{formatIndianCurrency(financialData.sideIncome)} / {formatIndianCurrency(financialData.monthlyExpenses)}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, fiProgress)}%` }}
              />
            </div>
            <div className="text-center text-xs opacity-80">
              {Math.floor(((currentWeek - 1) * 7 + currentDay) / 7)} weeks played • {fiProgress >= 100 ? 'Financial Independence Achieved!' : 'Building Wealth...'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid - 2x3 Layout */}
      <div className="grid grid-cols-2 gap-3">
        {/* Emotion */}
        <Card className="bg-gradient-to-br from-pink-400 to-red-500 text-white rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={20} />
              <div>
                <div className="font-bold">Emotion</div>
                <div className="text-xs opacity-80">Feelings</div>
              </div>
            </div>
            <div className="text-2xl font-black mb-2">{playerStats.emotion}</div>
            <div className="w-full bg-white/30 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-500"
                style={{ width: `${playerStats.emotion}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stress */}
        <Card className="bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={20} />
              <div>
                <div className="font-bold">Stress</div>
                <div className="text-xs opacity-80">Pressure</div>
              </div>
            </div>
            <div className="text-2xl font-black mb-2">{playerStats.stress}</div>
            <div className="w-full bg-white/30 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-500"
                style={{ width: `${100 - playerStats.stress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Logic */}
        <Card className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={20} />
              <div>
                <div className="font-bold">Logic</div>
                <div className="text-xs opacity-80">Reasoning</div>
              </div>
            </div>
            <div className="text-2xl font-black mb-2">{playerStats.logic}</div>
            <div className="w-full bg-white/30 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-500"
                style={{ width: `${playerStats.logic}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Karma */}
        <Card className="bg-gradient-to-br from-purple-400 to-purple-700 text-white rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Scale size={20} />
              <div>
                <div className="font-bold">Karma</div>
                <div className="text-xs opacity-80">Balance</div>
              </div>
            </div>
            <div className="text-2xl font-black mb-2">{playerStats.karma}</div>
            <div className="w-full bg-white/30 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-500"
                style={{ width: `${playerStats.karma}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Reputation */}
        <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star size={20} />
              <div>
                <div className="font-bold">Reputation</div>
                <div className="text-xs opacity-80">Standing</div>
              </div>
            </div>
            <div className="text-2xl font-black mb-2">{playerStats.reputation}</div>
            <div className="w-full bg-white/30 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-500"
                style={{ width: `${playerStats.reputation}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Energy */}
        <Card className="bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Battery size={20} />
              <div>
                <div className="font-bold">Energy</div>
                <div className="text-xs opacity-80">Vitality</div>
              </div>
            </div>
            <div className="text-2xl font-black mb-2">{playerStats.energy}</div>
            <div className="w-full bg-white/30 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-500"
                style={{ width: `${playerStats.energy}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Insight Cards */}
      <div className="space-y-3">
        <Card className="bg-blue-50 border-l-4 border-blue-400 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Brain size={16} className="text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-blue-800 text-sm">Logic Level</div>
                <div className="text-xs text-blue-600">
                  {playerStats.logic >= 80 ? 'Excellent reasoning' :
                   playerStats.logic >= 60 ? 'Good analytical skills' :
                   playerStats.logic >= 40 ? 'Decent judgment' : 'Needs improvement'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-l-4 border-red-400 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <Heart size={16} className="text-red-600" />
              </div>
              <div>
                <div className="font-semibold text-red-800 text-sm">Emotional State</div>
                <div className="text-xs text-red-600">
                  {playerStats.emotion >= 80 ? 'Very positive outlook' :
                   playerStats.emotion >= 60 ? 'Generally optimistic' :
                   playerStats.emotion >= 40 ? 'Neutral mood' : 'Feeling challenged'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-l-4 border-green-400 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Scale size={16} className="text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-green-800 text-sm">Karma Balance</div>
                <div className="text-xs text-green-600">
                  {playerStats.karma >= 80 ? 'Highly ethical approach' :
                   playerStats.karma >= 60 ? 'Good moral compass' :
                   playerStats.karma >= 40 ? 'Balanced decisions' : 'Consider your choices'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decision Test Button (Development) */}
      <Card className="bg-purple-50 border border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-purple-800 text-sm">Daily Decisions</div>
              <div className="text-xs text-purple-600">
                {hasCompletedToday ? 'Completed for today' : 'Ready for today\'s decisions'}
              </div>
            </div>
            <Button
              onClick={() => startDailyDecisions(currentDay)}
              disabled={hasCompletedToday}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <PlayCircle size={16} className="mr-1" />
              Start Decisions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Special Status Alerts */}
      {(gameState.isHospitalized || gameState.isMentalBreakdown || gameState.isBlackoutMode) && (
        <div className="space-y-2">
          {gameState.isHospitalized && (
            <Card className="bg-red-100 border border-red-300">
              <CardContent className="p-3">
                <div className="text-red-700 text-sm font-medium">
                  🏥 Hospitalized ({gameState.hospitalizationTurnsLeft} turns left)
                </div>
              </CardContent>
            </Card>
          )}
          {gameState.isMentalBreakdown && (
            <Card className="bg-purple-100 border border-purple-300">
              <CardContent className="p-3">
                <div className="text-purple-700 text-sm font-medium">
                  💔 Mental Breakdown ({gameState.breakdownTurnsLeft} turns left)
                </div>
              </CardContent>
            </Card>
          )}
          {gameState.isBlackoutMode && (
            <Card className="bg-gray-100 border border-gray-300">
              <CardContent className="p-3">
                <div className="text-gray-700 text-sm font-medium">
                  😵 Blackout Mode ({gameState.blackoutTurnsLeft} turns left)
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardBar;