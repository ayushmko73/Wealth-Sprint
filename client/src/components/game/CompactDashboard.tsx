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

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Professional Curved Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Curved Header with Gradient */}
        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white p-6 text-center relative overflow-hidden">
          {/* Background decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full mb-3">
              <Target size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold mb-1">Wealth Sprint</h1>
            <div className="text-sm opacity-90 font-medium">Week {currentWeek} • Day {currentDay}</div>
          </div>
          
          {/* Bottom curve */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-[50px]"></div>
        </div>

        {/* Main Content with curved sections */}
        <div className="p-6 space-y-6">
          
          {/* Financial Overview with curves */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-5 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-white bg-opacity-20 rounded-full">
                      <TrendingUp size={16} />
                    </div>
                    <span className="text-sm font-medium">Net Worth</span>
                  </div>
                  <div className="text-xl font-bold">{formatIndianCurrency(financialData.netWorth)}</div>
                  <div className="text-xs opacity-80">Positive Growth</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-white bg-opacity-20 rounded-full">
                      <DollarSign size={16} />
                    </div>
                    <span className="text-sm font-medium">Monthly Income</span>
                  </div>
                  <div className="text-xl font-bold">{formatIndianCurrency(financialData.sideIncome)}</div>
                  <div className="text-xs opacity-80">Main + Side Income</div>
                </div>
              </div>
              
              {/* FI Progress with curved progress bar */}
              <div className="bg-white bg-opacity-10 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">FI Progress</span>
                  <span className="text-sm font-bold">{progressToFI.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center text-xs mb-3">
                  <span>Week {currentWeek}, Day {currentDay}</span>
                  <span>{formatIndianCurrency(financialData.sideIncome)}/{formatIndianCurrency(financialData.monthlyExpenses)}</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-yellow-300 to-green-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressToFI, 100)}%` }}
                  />
                </div>
                <div className="text-xs mt-2 opacity-80 text-center">
                  0 weeks played • Building Wealth...
                </div>
              </div>
            </div>
          </div>

          {/* Professional Stats Grid with curved cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  <Heart size={18} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{playerStats.emotion}</div>
                  <div className="text-xs opacity-90">Emotion</div>
                </div>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-1">
                <div className="bg-white h-1 rounded-full" style={{ width: `${playerStats.emotion}%` }}></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  <Zap size={18} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{playerStats.stress || 60}</div>
                  <div className="text-xs opacity-90">Stress</div>
                </div>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-1">
                <div className="bg-white h-1 rounded-full" style={{ width: `${playerStats.stress || 60}%` }}></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  <Brain size={18} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{playerStats.logic}</div>
                  <div className="text-xs opacity-90">Logic</div>
                </div>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-1">
                <div className="bg-white h-1 rounded-full" style={{ width: `${playerStats.logic}%` }}></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 text-white p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  <Scale size={18} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{playerStats.karma}</div>
                  <div className="text-xs opacity-90">Karma</div>
                </div>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-1">
                <div className="bg-white h-1 rounded-full" style={{ width: `${playerStats.karma}%` }}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Curved Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 relative">
          {/* Top curve */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-white rounded-b-[50px]"></div>
          <div className="pt-4 text-center">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full">
              Continue Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactDashboard;