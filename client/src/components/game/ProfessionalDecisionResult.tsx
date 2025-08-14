import React from 'react';
import { useDecisionSystem } from '../../lib/stores/useDecisionSystem';
import { CheckCircle, TrendingUp, Heart, Brain, Scale, Zap, DollarSign, Trophy } from 'lucide-react';

const ProfessionalDecisionResult: React.FC = () => {
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
      reputation: Trophy,
      energy: TrendingUp
    };
    return icons[type as keyof typeof icons] || TrendingUp;
  };

  const getImpactColor = (value: number, type: string) => {
    const baseColors = {
      financial: value > 0 ? 'from-green-400 to-green-500' : 'from-red-400 to-red-500',
      emotion: 'from-pink-400 to-pink-500',
      stress: value < 0 ? 'from-green-400 to-green-500' : 'from-orange-400 to-orange-500',
      karma: 'from-purple-400 to-purple-500',
      logic: 'from-blue-400 to-blue-500',
      reputation: 'from-yellow-400 to-yellow-500',
      energy: 'from-emerald-400 to-emerald-500'
    };
    return baseColors[type as keyof typeof baseColors] || 'from-gray-400 to-gray-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-3 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Success Header with Curved Design */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 text-center relative overflow-hidden">
          <div className="relative z-10">
            <CheckCircle size={24} className="mx-auto mb-2" />
            <h1 className="text-lg font-bold mb-1">Day {currentSession.day} Complete!</h1>
            <p className="text-emerald-100 text-xs font-medium">{completedDecisions.length} decisions secured</p>
          </div>
        </div>

        {/* Content with curved sections */}
        <div className="flex-1 p-4 overflow-y-auto">
          
          {/* Impact Summary with curved cards */}
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-800 mb-3">Impact on Your Stats:</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(totalImpact).map(([key, value]) => {
                if (value === 0) return null;
                const Icon = getImpactIcon(key);
                return (
                  <div key={key} className={`bg-gradient-to-br ${getImpactColor(value, key)} text-white p-3 rounded-xl shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <Icon size={16} />
                      <div className="text-right">
                        <div className="text-sm font-bold">
                          {key === 'financial' ? formatFinancialValue(value) : (value > 0 ? `+${value}` : value)}
                        </div>
                        <div className="text-xs opacity-90 capitalize font-medium">
                          {key}
                        </div>
                      </div>
                    </div>
                    {/* Small progress bar */}
                    <div className="w-full bg-white bg-opacity-30 rounded-full h-1">
                      <div className="bg-white h-1 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Section */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              What Happened:
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              {completedDecisions.length === 1 
                ? `Made 1 strategic decision affecting multiple aspects of your business and personal life.`
                : `Made ${completedDecisions.length} strategic decisions affecting multiple aspects of your business and personal life.`
              }
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 text-center">
          <button
            onClick={handleContinue}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 w-full"
          >
            Continue Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDecisionResult;