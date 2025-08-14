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
      financial: value > 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600',
      emotion: 'from-pink-500 to-pink-600',
      stress: value < 0 ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600',
      karma: 'from-purple-500 to-purple-600',
      logic: 'from-blue-500 to-blue-600'
    };
    return baseColors[type as keyof typeof baseColors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Success Header with Curved Design */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white bg-opacity-10 rounded-full scale-150 -translate-y-20"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-3">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h1 className="text-xl font-bold mb-1">Day {currentSession.day} Complete!</h1>
            <p className="text-emerald-100 text-sm font-medium">{completedDecisions.length} strategic decisions made</p>
          </div>
          {/* Bottom curve */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-[40px]"></div>
        </div>

        {/* Content with curved sections */}
        <div className="flex-1 p-6 overflow-y-auto">
          
          {/* Impact Summary with curved cards */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Impact on Your Stats</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(totalImpact).map(([key, value]) => {
                if (value === 0) return null;
                const Icon = getImpactIcon(key);
                return (
                  <div key={key} className={`bg-gradient-to-br ${getImpactColor(value, key)} text-white p-4 rounded-2xl shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <Icon size={20} />
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {key === 'financial' ? formatFinancialValue(value) : (value > 0 ? `+${value}` : value)}
                        </div>
                        <div className="text-xs opacity-90 capitalize font-medium">
                          {key}
                        </div>
                      </div>
                    </div>
                    {/* Small curved indicator */}
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-1">
                      <div className="bg-white h-1 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Section with curved background */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl mb-6">
            <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              What Happened
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {completedDecisions.length === 1 
                ? `Made 1 strategic decision affecting multiple aspects of your wealth journey.`
                : `Made ${completedDecisions.length} strategic decisions impacting your business and personal growth.`
              }
            </p>
          </div>

        </div>

        {/* Curved Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 relative">
          {/* Top curve */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-white rounded-b-[40px]"></div>
          <div className="pt-4 text-center">
            <button
              onClick={handleContinue}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full"
            >
              Continue Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDecisionResult;