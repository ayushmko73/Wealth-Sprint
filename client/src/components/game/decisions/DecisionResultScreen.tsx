import React from 'react';
import { PlayerDecision } from '../../../lib/stores/useDecisionSystem';
import { useDecisionSystem } from '../../../lib/stores/useDecisionSystem';
import { TrendingUp, TrendingDown, Minus, Heart, Brain, Zap, Scale, Star, Battery } from 'lucide-react';

interface DecisionResultScreenProps {
  playerDecision: PlayerDecision;
  isLastDecision: boolean;
}

const DecisionResultScreen: React.FC<DecisionResultScreenProps> = ({ 
  playerDecision, 
  isLastDecision 
}) => {
  const { nextDecision, finishDailyDecisions } = useDecisionSystem();

  const handleContinue = () => {
    if (isLastDecision) {
      finishDailyDecisions();
    } else {
      nextDecision();
    }
  };

  const getConsequenceIcon = (type: string) => {
    const icons = {
      financial: TrendingUp,
      emotion: Heart,
      stress: Zap,
      karma: Scale,
      logic: Brain,
      reputation: Star,
      energy: Battery
    };
    return icons[type as keyof typeof icons] || Minus;
  };

  const getConsequenceColor = (value: number) => {
    if (value > 0) return 'text-green-600 bg-green-100';
    if (value < 0) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const formatFinancialValue = (value: number) => {
    if (Math.abs(value) >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else if (Math.abs(value) >= 1000) {
      return `₹${(value / 1000).toFixed(0)}K`;
    }
    return `₹${value}`;
  };

  const formatConsequenceValue = (type: string, value: number) => {
    if (type === 'financial') {
      return formatFinancialValue(value);
    }
    return value > 0 ? `+${value}` : `${value}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-xl">
          <h2 className="text-2xl font-bold">Decision Outcome</h2>
          <p className="text-green-100 mt-2">Your choice has been recorded</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Selected Choice */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-800 mb-2">You Chose:</h3>
            <p className="text-gray-700">{playerDecision.selectedOptionText}</p>
          </div>

          {/* Consequences */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Impact on Your Stats:</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(playerDecision.consequences).map(([key, value]) => {
                if (key === 'description') return null;
                
                const Icon = getConsequenceIcon(key);
                const numValue = Number(value);
                
                if (numValue === 0) return null;

                return (
                  <div 
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-lg ${getConsequenceColor(numValue)}`}
                  >
                    <Icon size={20} />
                    <div className="flex-1">
                      <span className="font-medium capitalize">
                        {key.replace('_', ' ')}
                      </span>
                      <div className="font-bold">
                        {formatConsequenceValue(key, numValue)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          {playerDecision.consequences.description && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">What Happened:</h3>
              <p className="text-gray-700 leading-relaxed">
                {playerDecision.consequences.description}
              </p>
            </div>
          )}

          {/* Blockchain Info */}
          {playerDecision.blockchainHash && (
            <div className="mb-6 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 text-purple-700 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="font-medium">Secured on Blockchain</span>
              </div>
              <p className="text-purple-600 text-xs mt-1 font-mono">
                Hash: {playerDecision.blockchainHash}
              </p>
            </div>
          )}

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              {isLastDecision ? 'Finish Day' : 'Next Decision'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionResultScreen;