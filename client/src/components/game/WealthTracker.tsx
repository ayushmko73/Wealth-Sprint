import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { formatIndianCurrency } from '../../lib/utils';
import { Progress } from '../ui/progress';

const WealthTracker: React.FC = () => {
  const { financialData } = useWealthSprintGame();
  
  const progressToFI = Math.min(100, (financialData.sideIncome / financialData.monthlyExpenses) * 100);
  const isFinanciallyIndependent = financialData.sideIncome >= financialData.monthlyExpenses;

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#3a3a3a]">Wealth Sprint Tracker</h3>
        <div className="flex items-center gap-2">
          <Target size={16} className="text-[#d4af37]" />
          <span className="text-sm font-medium text-[#3a3a3a]">
            Financial Independence: {progressToFI.toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-green-600" />
          <div>
            <p className="text-xs text-gray-500">Net Worth</p>
            <p className="text-sm font-semibold text-[#3a3a3a]">
{formatIndianCurrency(financialData.netWorth)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-600" />
          <div>
            <p className="text-xs text-gray-500">Side Income</p>
            <p className="text-sm font-semibold text-[#3a3a3a]">
{formatIndianCurrency(financialData.sideIncome)}/month
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingDown size={16} className="text-red-600" />
          <div>
            <p className="text-xs text-gray-500">Monthly Expenses</p>
            <p className="text-sm font-semibold text-[#3a3a3a]">
{formatIndianCurrency(financialData.monthlyExpenses)}/month
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-purple-600" />
          <div>
            <p className="text-xs text-gray-500">Monthly Cashflow</p>
            <p className={`text-sm font-semibold ${financialData.cashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
{formatIndianCurrency(financialData.cashflow)}/month
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Progress to Financial Independence</span>
          <span className={`font-medium ${isFinanciallyIndependent ? 'text-green-600' : 'text-gray-700'}`}>
            {isFinanciallyIndependent ? 'Achieved!' : `${progressToFI.toFixed(1)}%`}
          </span>
        </div>
        <Progress 
          value={progressToFI} 
          className="h-2"
        />
        <p className="text-xs text-gray-500 text-center">
          {isFinanciallyIndependent 
            ? '🎉 Congratulations! You have achieved Financial Independence!' 
            : `You need ${formatIndianCurrency(financialData.monthlyExpenses - financialData.sideIncome)} more in side income`
          }
        </p>
      </div>
    </div>
  );
};

export default WealthTracker;
