import React from 'react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { formatIndianCurrency } from '../../lib/utils';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
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
  Target
} from 'lucide-react';

const DashboardBar: React.FC = () => {
  const { playerStats, financialData, currentWeek, currentDay, gameState } = useWealthSprintGame();

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
      icon: DollarSign,
      label: 'Cash',
      value: formatIndianCurrency(financialData.inHandCash),
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
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
    <div className="space-y-4">
      {/* Financial Overview */}
      <Card className="bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp size={16} />
                <span className="text-sm opacity-90">Net Worth</span>
              </div>
              <div className="text-lg font-bold">{formatIndianCurrency(financialData.netWorth)}</div>
              <div className="text-xs opacity-75">
                {financialData.netWorth >= 0 ? '↗ Positive' : '↘ Negative'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign size={16} />
                <span className="text-sm opacity-90">Monthly Income</span>
              </div>
              <div className="text-lg font-bold">
                {formatIndianCurrency(financialData.mainIncome + financialData.sideIncome)}
              </div>
              <div className="text-xs opacity-75">Main + Side</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target size={16} />
                <span className="text-sm opacity-90">FI Progress</span>
              </div>
              <div className="text-lg font-bold">{fiProgress.toFixed(1)}%</div>
              <div className="text-xs opacity-75">
                {fiProgress >= 100 ? 'Achieved!' : 'In Progress'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-sm opacity-90">Week {currentWeek}, Day {currentDay}</span>
              </div>
              <div className="text-lg font-bold">Game Time</div>
              <div className="text-xs opacity-75">
                {Math.floor(((currentWeek - 1) * 7 + currentDay) / 7)} weeks played
              </div>
            </div>
          </div>
          
          {/* FI Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Financial Independence Progress</span>
              <span>{formatIndianCurrency(financialData.sideIncome)} / {formatIndianCurrency(financialData.monthlyExpenses)}</span>
            </div>
            <Progress 
              value={fiProgress} 
              className="h-3 bg-white bg-opacity-20" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Player Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`${stat.bgColor} p-3 rounded-lg text-center transition-all hover:scale-105`}>
                  <Icon size={20} className={`${stat.color} mx-auto mb-1`} />
                  <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
                  <div className={`font-bold ${stat.color}`}>
                    {typeof stat.value === 'number' ? stat.value : stat.value}
                  </div>
                  {typeof stat.value === 'number' && stat.label !== 'Money' && (
                    <div className="mt-1">
                      <Progress 
                        value={stat.value} 
                        className="h-1" 
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Special Status Indicators */}
          {(gameState.isHospitalized || gameState.isMentalBreakdown || gameState.isBlackoutMode) && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {gameState.isHospitalized && (
                <Badge variant="destructive" className="bg-red-600">
                  🏥 Hospitalized ({gameState.hospitalizationTurnsLeft} turns left)
                </Badge>
              )}
              {gameState.isMentalBreakdown && (
                <Badge variant="destructive" className="bg-purple-600">
                  💔 Mental Breakdown ({gameState.breakdownTurnsLeft} turns left)
                </Badge>
              )}
              {gameState.isBlackoutMode && (
                <Badge variant="destructive" className="bg-gray-600">
                  😵 Blackout Mode ({gameState.blackoutTurnsLeft} turns left)
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-blue-600" />
              <div>
                <div className="text-sm font-medium text-blue-800">Logic Level</div>
                <div className="text-xs text-blue-600">
                  {playerStats.logic >= 80 ? 'Excellent decision making' :
                   playerStats.logic >= 60 ? 'Good analytical skills' :
                   playerStats.logic >= 40 ? 'Decent reasoning' : 'Needs improvement'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-red-600" />
              <div>
                <div className="text-sm font-medium text-red-800">Emotional State</div>
                <div className="text-xs text-red-600">
                  {playerStats.emotion >= 80 ? 'Very positive mood' :
                   playerStats.emotion >= 60 ? 'Generally happy' :
                   playerStats.emotion >= 40 ? 'Neutral feelings' : 'Feeling down'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Scale size={16} className="text-purple-600" />
              <div>
                <div className="text-sm font-medium text-purple-800">Karma Balance</div>
                <div className="text-xs text-purple-600">
                  {playerStats.karma >= 80 ? 'Highly ethical choices' :
                   playerStats.karma >= 60 ? 'Good moral compass' :
                   playerStats.karma >= 40 ? 'Balanced approach' : 'Question your choices'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardBar;