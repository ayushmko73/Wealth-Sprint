import React from 'react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { formatIndianCurrency } from '../../lib/utils';
import { 
  DollarSign, 
  TrendingUp, 
  Heart, 
  Brain, 
  Scale, 
  Zap,
  Target
} from 'lucide-react';

const CompactDashboard: React.FC = () => {
  const { financialData, playerStats, currentWeek, currentDay } = useWealthSprintGame();
  
  const progressToFI = Math.min(100, (financialData.sideIncome / financialData.monthlyExpenses) * 100);
  
  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    if (value >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Single Compact Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 text-white p-3 text-center">
          <h1 className="text-lg font-bold">Wealth Sprint</h1>
          <div className="text-sm opacity-90">Week {currentWeek}, Day {currentDay}</div>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-4">
          
          {/* Financial Overview */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-3">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp size={14} />
                  <span className="text-xs">Net Worth</span>
                </div>
                <div className="text-lg font-bold">{formatIndianCurrency(financialData.netWorth)}</div>
                <div className="text-xs opacity-80">Positive Growth</div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign size={14} />
                  <span className="text-xs">Monthly Income</span>
                </div>
                <div className="text-lg font-bold">{formatIndianCurrency(financialData.sideIncome)}</div>
                <div className="text-xs opacity-80">Main + Side Income</div>
              </div>
            </div>
            
            {/* FI Progress */}
            <div className="border-t border-white border-opacity-20 pt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">FI Progress</span>
                <span className="text-xs font-bold">{progressToFI.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Week 1, Day 1</span>
                <span>{formatIndianCurrency(financialData.sideIncome)}/{formatIndianCurrency(financialData.monthlyExpenses)}</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressToFI, 100)}%` }}
                />
              </div>
              <div className="text-xs mt-1 opacity-80">
                0 weeks played • Building Wealth...
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-pink-500 text-white p-2 rounded text-center">
              <Heart size={16} className="mx-auto mb-1" />
              <div className="text-sm font-bold">{playerStats.emotion}</div>
              <div className="text-xs">Emotion</div>
            </div>
            <div className="bg-orange-500 text-white p-2 rounded text-center">
              <Zap size={16} className="mx-auto mb-1" />
              <div className="text-sm font-bold">{playerStats.stress || 60}</div>
              <div className="text-xs">Stress</div>
            </div>
            <div className="bg-blue-500 text-white p-2 rounded text-center">
              <Brain size={16} className="mx-auto mb-1" />
              <div className="text-sm font-bold">{playerStats.logic}</div>
              <div className="text-xs">Logic</div>
            </div>
            <div className="bg-purple-500 text-white p-2 rounded text-center">
              <Scale size={16} className="mx-auto mb-1" />
              <div className="text-sm font-bold">{playerStats.karma}</div>
              <div className="text-xs">Karma</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 text-center">
          <button className="bg-blue-600 text-white px-6 py-2 rounded font-medium text-sm hover:bg-blue-700 transition-colors w-full">
            Next Decision
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompactDashboard;