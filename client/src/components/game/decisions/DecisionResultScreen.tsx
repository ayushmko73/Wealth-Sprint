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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy size={32} className="text-yellow-300" />
            <div>
              <h1 className="text-2xl font-bold">Decisions Complete!</h1>
              <p className="text-green-100">All Day {currentSession.day} strategic decisions processed</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              <span>{completedDecisions.length} decisions made</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy size={16} />
              <span>Blockchain secured</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          
          {/* Impact Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Total Impact Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(totalImpact).map(([key, value]) => {
                if (value === 0) return null;
                const Icon = getImpactIcon(key);
                return (
                  <Card key={key} className={`border-2 ${getImpactColor(value)}`}>
                    <CardContent className="p-4 text-center">
                      <Icon size={24} className="mx-auto mb-2" />
                      <div className="font-bold text-lg">
                        {key === 'financial' ? formatFinancialValue(value) : (value > 0 ? `+${value}` : value)}
                      </div>
                      <div className="text-xs font-medium capitalize">
                        {key}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Decision Details */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Decisions</h2>
            <div className="space-y-4">
              {completedDecisions.map(({ decision, selectedOption }, index) => (
                <Card key={decision.id} className="border border-gray-200">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                          Decision {index + 1}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium capitalize">
                          {decision.category.replace('_', ' ')}
                        </span>
                      </div>
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-800 mb-2 text-sm">Question:</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{decision.question}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                      <h4 className="font-semibold text-blue-800 text-sm mb-1">Your Choice:</h4>
                      <p className="text-blue-700 text-sm">{selectedOption?.text}</p>
                    </div>

                    {/* Individual Decision Impact */}
                    {selectedOption?.consequences && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(selectedOption.consequences).map(([key, value]) => {
                          if (key === 'description' || typeof value !== 'number') return null;
                          const Icon = getImpactIcon(key);
                          return (
                            <div key={key} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(value as number)}`}>
                              <Icon size={12} />
                              <span>
                                {key === 'financial' ? formatFinancialValue(value as number) : (value > 0 ? `+${value}` : value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t">
          <div className="text-center">
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                All decisions have been securely recorded on the blockchain
              </div>
              <div className="text-xs text-gray-500">
                Session completed on {new Date().toLocaleString()}
              </div>
            </div>
            
            <button
              onClick={handleContinue}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Continue Playing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionResultScreen;