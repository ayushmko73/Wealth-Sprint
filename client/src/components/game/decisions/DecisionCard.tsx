import React from 'react';
import { Decision, DecisionOption } from '../../../lib/data/decisionsData';
import { useDecisionSystem } from '../../../lib/stores/useDecisionSystem';

interface DecisionCardProps {
  decision: Decision;
  dayNumber: number;
}

const DecisionCard: React.FC<DecisionCardProps> = ({ decision, dayNumber }) => {
  const { selectedOption, selectDecisionOption, submitDecision } = useDecisionSystem();

  const handleOptionSelect = (option: DecisionOption) => {
    selectDecisionOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      submitDecision();
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      real_estate: 'bg-green-100 text-green-800',
      business: 'bg-blue-100 text-blue-800',
      transport: 'bg-yellow-100 text-yellow-800',
      technology: 'bg-purple-100 text-purple-800',
      lifestyle: 'bg-pink-100 text-pink-800',
      unexpected: 'bg-red-100 text-red-800',
      partnership: 'bg-indigo-100 text-indigo-800',
      investment: 'bg-teal-100 text-teal-800',
      relationships: 'bg-rose-100 text-rose-800',
      support: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header with day label */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="absolute top-4 right-4">
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
              About — Day {dayNumber}
            </span>
          </div>
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(decision.category)}`}>
              {decision.category.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Decision Question */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
            {decision.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {decision.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  selectedOption?.id === option.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 ${
                    selectedOption?.id === option.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedOption?.id === option.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="text-gray-800 font-medium leading-relaxed">
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                selectedOption
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedOption ? 'Confirm Decision' : 'Select an Option'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionCard;