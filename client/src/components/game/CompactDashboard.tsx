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
  Star,
  Battery
} from 'lucide-react';

const CompactDashboard: React.FC = () => {
  const { financialData, playerStats, currentWeek, currentDay, getAssets } = useWealthSprintGame();
  
  // Calculate actual side income from assets
  const assets = getAssets() || [];
  const actualSideIncome = assets.reduce((sum, asset) => sum + asset.monthlyIncome, 0);
  const progressToFI = Math.min(100, (actualSideIncome / financialData.monthlyExpenses) * 100);

  return (
    <div className="p-3 max-w-sm mx-auto">
      {/* Compact Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 text-center">
          <h1 className="text-base font-bold">Wealth Sprint</h1>
          <div className="text-xs opacity-90">Week {currentWeek} • Day {currentDay}</div>
        </div>

        {/* Financial Progress Bar */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3">
          <div className="flex justify-between items-center text-xs mb-1">
            <span>FI Progress</span>
            <span>{progressToFI.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center text-xs mb-2">
            <span>0 weeks played • Building Wealth...</span>
            <span>{formatIndianCurrency(actualSideIncome)}/{formatIndianCurrency(financialData.monthlyExpenses)}</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressToFI, 100)}%` }}
            />
          </div>
        </div>

        {/* Compact Stats Grid - All 6 items */}
        <div className="p-3">
          <div className="space-y-2">
            {/* Row 1 - 2 columns */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-pink-400 text-white p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <Heart size={16} />
                  <div className="text-right">
                    <div className="text-lg font-bold">{playerStats.emotion}</div>
                    <div className="text-xs">Emotion</div>
                    <div className="text-xs opacity-80">Feelings</div>
                  </div>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-1 mt-2">
                  <div className="bg-white h-1 rounded-full" style={{ width: `${playerStats.emotion}%` }}></div>
                </div>
              </div>
              
              <div className="bg-orange-400 text-white p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <Zap size={16} />
                  <div className="text-right">
                    <div className="text-lg font-bold">{playerStats.stress || 20}</div>
                    <div className="text-xs">Stress</div>
                    <div className="text-xs opacity-80">Pressure</div>
                  </div>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-1 mt-2">
                  <div className="bg-white h-1 rounded-full" style={{ width: `${playerStats.stress || 20}%` }}></div>
                </div>
              </div>
            </div>

            {/* Row 2 - 2 columns */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-400 text-white p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <Brain size={16} />
                  <div className="text-right">
                    <div className="text-lg font-bold">{playerStats.logic}</div>
                    <div className="text-xs">Logic</div>
                    <div className="text-xs opacity-80">Reasoning</div>
                  </div>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-1 mt-2">
                  <div className="bg-white h-1 rounded-full" style={{ width: `${playerStats.logic}%` }}></div>
                </div>
              </div>
              
              <div className="bg-purple-400 text-white p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <Scale size={16} />
                  <div className="text-right">
                    <div className="text-lg font-bold">{playerStats.karma}</div>
                    <div className="text-xs">Karma</div>
                    <div className="text-xs opacity-80">Balance</div>
                  </div>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-1 mt-2">
                  <div className="bg-white h-1 rounded-full" style={{ width: `${playerStats.karma}%` }}></div>
                </div>
              </div>
            </div>

            {/* Row 3 - 2 columns */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-yellow-400 text-white p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <Star size={16} />
                  <div className="text-right">
                    <div className="text-lg font-bold">{playerStats.reputation || 40}</div>
                    <div className="text-xs">Reputation</div>
                    <div className="text-xs opacity-80">Standing</div>
                  </div>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-1 mt-2">
                  <div className="bg-white h-1 rounded-full" style={{ width: `${playerStats.reputation || 40}%` }}></div>
                </div>
              </div>
              
              <div className="bg-emerald-400 text-white p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <Battery size={16} />
                  <div className="text-right">
                    <div className="text-lg font-bold">{playerStats.energy || 95}</div>
                    <div className="text-xs">Energy</div>
                    <div className="text-xs opacity-80">Vitality</div>
                  </div>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-1 mt-2">
                  <div className="bg-white h-1 rounded-full" style={{ width: `${playerStats.energy || 95}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompactDashboard;