import React from 'react';
import { useDecisionSystem } from '../../../lib/stores/useDecisionSystem';
import { Card, CardContent } from '../../ui/card';
import { CheckCircle, TrendingUp, TrendingDown, Trophy, Heart, Brain, Scale, Star, Battery, Zap, DollarSign } from 'lucide-react';

const DecisionResultScreen: React.FC = () => {
  const { currentSession, finishDailyDecisions, selectedOptions } = useDecisionSystem();
  
  if (!currentSession) return null;

  const handleContinue = () => {
    finishDailyDecisions();
  };

  // Calculate total impact from all decisions
  const totalImpact = {
    financial: 0,
    emotion: 0,
    stress: 0,
    karma: 0,
    logic: 0,
    reputation: 0,
    energy: 0
  };

  const completedDecisions = currentSession.decisions.map(decision => {
    const selectedOption = selectedOptions[decision.id];
    return {
      decision,
      selectedOption,
      category: decision.category
    };
  }).filter(item => item.selectedOption);

  // Calculate totals
  completedDecisions.forEach(({ selectedOption }) => {
    if (selectedOption?.consequences) {
      Object.entries(selectedOption.consequences).forEach(([key, value]) => {
        if (typeof value === 'number' && key in totalImpact) {
          totalImpact[key as keyof typeof totalImpact] += value;
        }
      });
    }
  });

  const formatFinancialValue = (value: number) => {
    if (Math.abs(value) >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else if (Math.abs(value) >= 1000) {
      return `₹${(value / 1000).toFixed(0)}K`;
    }
    return `₹${value}`;
  };

  const getImpactIcon = (type: string) => {
    const icons = {
      financial: DollarSign,
      emotion: Heart,
      stress: Zap,
      karma: Scale,
      logic: Brain,
      reputation: Star,
      energy: Battery
    };
    return icons[type as keyof typeof icons] || TrendingUp;
  };

  const getImpactColor = (value: number) => {
    if (value > 0) return 'text-green-600 bg-green-100 border-green-200';
    if (value < 0) return 'text-red-600 bg-red-100 border-red-200';
    return 'text-gray-600 bg-gray-100 border-gray-200';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-3 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden">
        
        {/* Compact Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-lg text-center">
          <CheckCircle size={24} className="mx-auto mb-2" />
          <h1 className="text-lg font-bold">Day {currentSession.day} Complete!</h1>
          <p className="text-green-100 text-sm">{completedDecisions.length} decisions secured</p>
        </div>

        {/* Compact Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          
          {/* Impact Summary */}
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-800 mb-3">Impact on Your Stats:</h2>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(totalImpact).map(([key, value]) => {
                if (value === 0) return null;
                const Icon = getImpactIcon(key);
                return (
                  <div key={key} className={`p-2 rounded border ${getImpactColor(value)}`}>
                    <Icon size={16} className="mx-auto mb-1" />
                    <div className="text-xs font-bold text-center">
                      {key === 'financial' ? formatFinancialValue(value) : (value > 0 ? `+${value}` : value)}
                    </div>
                    <div className="text-xs text-center capitalize">
                      {key}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What Happened Summary */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-800 mb-2">What Happened:</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              {completedDecisions.length === 1 
                ? `Made 1 strategic decision with immediate impact on your wealth journey.`
                : `Made ${completedDecisions.length} strategic decisions affecting multiple aspects of your business and personal life.`
              }
            </p>
          </div>


        </div>

        {/* Compact Footer */}
        <div className="bg-gray-50 p-3 border-t text-center">
          <button
            onClick={handleContinue}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-all duration-200"
          >
            Next Decision
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecisionResultScreen;