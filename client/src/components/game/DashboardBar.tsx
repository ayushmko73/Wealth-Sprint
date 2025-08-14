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
    <div className="space-y-6 p-4">
      {/* Modern Financial Overview Card */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 rounded-3xl p-6 text-white shadow-2xl">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={24} className="text-blue-200" />
              <h2 className="text-xl font-bold">Net Worth</h2>
            </div>
            <div className="text-3xl font-black mb-2">{formatIndianCurrency(financialData.netWorth)}</div>
            <div className="text-blue-200 text-sm">
              {financialData.netWorth >= 0 ? '↗ Positive Growth' : '↘ Recovery Mode'}
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={24} className="text-green-300" />
              <h2 className="text-xl font-bold">Monthly Income</h2>
            </div>
            <div className="text-3xl font-black mb-2">
              {formatIndianCurrency(financialData.mainIncome + financialData.sideIncome)}
            </div>
            <div className="text-green-200 text-sm">Main + Side Income</div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold">FI Progress</span>
            <span className="text-white font-bold">{fiProgress.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm text-blue-200 mb-3">
            <span>Week {currentWeek}, Day {currentDay}</span>
            <span>{formatIndianCurrency(financialData.sideIncome)} / {formatIndianCurrency(financialData.monthlyExpenses)}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-500 h-4 rounded-full transition-all duration-1000 shadow-lg"
              style={{ width: `${Math.min(100, fiProgress)}%` }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-white/80">
            {Math.floor(((currentWeek - 1) * 7 + currentDay) / 7)} weeks played • {fiProgress >= 100 ? 'Financial Independence Achieved!' : 'Building Wealth...'}
          </div>
        </div>
      </div>

      {/* Colorful Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Emotion Card - Red Theme */}
        <div className="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <Heart size={28} className="text-red-100" />
            <div>
              <h3 className="font-bold text-lg">Emotion</h3>
              <div className="text-red-100 text-sm">Feelings</div>
            </div>
          </div>
          <div className="text-3xl font-black mb-2">{playerStats.emotion}</div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${playerStats.emotion}%` }}
            />
          </div>
        </div>

        {/* Stress Card - Orange Theme */}
        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle size={28} className="text-orange-100" />
            <div>
              <h3 className="font-bold text-lg">Stress</h3>
              <div className="text-orange-100 text-sm">Pressure</div>
            </div>
          </div>
          <div className="text-3xl font-black mb-2">{playerStats.stress}</div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${100 - playerStats.stress}%` }}
            />
          </div>
        </div>

        {/* Logic Card - Blue Theme */}
        <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <Brain size={28} className="text-blue-100" />
            <div>
              <h3 className="font-bold text-lg">Logic</h3>
              <div className="text-blue-100 text-sm">Reasoning</div>
            </div>
          </div>
          <div className="text-3xl font-black mb-2">{playerStats.logic}</div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${playerStats.logic}%` }}
            />
          </div>
        </div>

        {/* Karma Card - Purple Theme */}
        <div className="bg-gradient-to-br from-purple-400 to-purple-700 rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <Scale size={28} className="text-purple-100" />
            <div>
              <h3 className="font-bold text-lg">Karma</h3>
              <div className="text-purple-100 text-sm">Balance</div>
            </div>
          </div>
          <div className="text-3xl font-black mb-2">{playerStats.karma}</div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${playerStats.karma}%` }}
            />
          </div>
        </div>

        {/* Reputation Card - Yellow Theme */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <Star size={28} className="text-yellow-100" />
            <div>
              <h3 className="font-bold text-lg">Reputation</h3>
              <div className="text-yellow-100 text-sm">Standing</div>
            </div>
          </div>
          <div className="text-3xl font-black mb-2">{playerStats.reputation}</div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${playerStats.reputation}%` }}
            />
          </div>
        </div>

        {/* Energy Card - Green Theme */}
        <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <Battery size={28} className="text-green-100" />
            <div>
              <h3 className="font-bold text-lg">Energy</h3>
              <div className="text-green-100 text-sm">Vitality</div>
            </div>
          </div>
          <div className="text-3xl font-black mb-2">{playerStats.energy}</div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${playerStats.energy}%` }}
            />
          </div>
        </div>
      </div>

      {/* Status Alerts */}
      {(gameState.isHospitalized || gameState.isMentalBreakdown || gameState.isBlackoutMode) && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex gap-3 flex-wrap">
            {gameState.isHospitalized && (
              <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                🏥 Hospitalized ({gameState.hospitalizationTurnsLeft} turns left)
              </div>
            )}
            {gameState.isMentalBreakdown && (
              <div className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                💔 Mental Breakdown ({gameState.breakdownTurnsLeft} turns left)
              </div>
            )}
            {gameState.isBlackoutMode && (
              <div className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                😵 Blackout Mode ({gameState.blackoutTurnsLeft} turns left)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <Brain size={20} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-blue-800">Logic Level</h4>
              <p className="text-sm text-blue-600">
                {playerStats.logic >= 80 ? 'Excellent reasoning' :
                 playerStats.logic >= 60 ? 'Good analytical skills' :
                 playerStats.logic >= 40 ? 'Decent judgment' : 'Needs improvement'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-red-200 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 p-2 rounded-full">
              <Heart size={20} className="text-red-600" />
            </div>
            <div>
              <h4 className="font-bold text-red-800">Emotional State</h4>
              <p className="text-sm text-red-600">
                {playerStats.emotion >= 80 ? 'Very positive outlook' :
                 playerStats.emotion >= 60 ? 'Generally optimistic' :
                 playerStats.emotion >= 40 ? 'Neutral mood' : 'Feeling challenged'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-200 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-2 rounded-full">
              <Scale size={20} className="text-green-600" />
            </div>
            <div>
              <h4 className="font-bold text-green-800">Karma Balance</h4>
              <p className="text-sm text-green-600">
                {playerStats.karma >= 80 ? 'Highly ethical approach' :
                 playerStats.karma >= 60 ? 'Good moral compass' :
                 playerStats.karma >= 40 ? 'Balanced decisions' : 'Consider your choices'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBar;