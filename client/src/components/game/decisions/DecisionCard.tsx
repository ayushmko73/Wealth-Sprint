import React, { useState } from 'react';
import { Decision, DecisionOption } from '../../../lib/data/decisionsData';
import { useDecisionSystem } from '../../../lib/stores/useDecisionSystem';

interface DecisionCardProps {
  decisions: Decision[];
  dayNumber: number;
}

const DecisionCard: React.FC<DecisionCardProps> = ({ decisions, dayNumber }) => {
  const { selectedOptions, selectDecisionOption, submitAllDecisions } = useDecisionSystem();
  const [currentDecisionIndex, setCurrentDecisionIndex] = useState(0);

  // Safety checks
  if (!decisions || decisions.length === 0) {
    return null;
  }

  const currentDecision = decisions[currentDecisionIndex];
  if (!currentDecision) {
    return null;
  }

  const selectedOption = selectedOptions[currentDecision.id];
  
  const handleOptionSelect = (option: DecisionOption) => {
    selectDecisionOption(currentDecision.id, option);
  };

  const handleNext = () => {
    if (currentDecisionIndex < decisions.length - 1) {
      setCurrentDecisionIndex(currentDecisionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentDecisionIndex > 0) {
      setCurrentDecisionIndex(currentDecisionIndex - 1);
    }
  };

  const handleSubmitAll = () => {
    const allAnswered = decisions.every(d => selectedOptions[d.id]);
    if (allAnswered) {
      submitAllDecisions();
    }
  };

  const getProgressPercentage = () => {
    const answeredCount = decisions.filter(d => selectedOptions[d.id]).length;
    return (answeredCount / decisions.length) * 100;
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

  const allAnswered = decisions.every(d => selectedOptions[d.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        
        {/* Professional Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Daily Business Decisions</h1>
              <p className="text-blue-100 text-sm">Strategic choices that shape your wealth journey</p>
            </div>
            <div className="text-right">
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-semibold">
                About — Day {dayNumber}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-100">Progress ({Math.round(getProgressPercentage())}%)</span>
              <span className="text-sm text-blue-100">{Object.keys(selectedOptions).length} of {decisions.length} completed</span>
            </div>
            <div className="w-full bg-blue-800 bg-opacity-50 rounded-full h-2">
              <div 
                className="bg-white bg-opacity-90 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          {/* Decision Navigation */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {decisions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDecisionIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentDecisionIndex 
                      ? 'bg-white' 
                      : selectedOptions[decisions[index].id] 
                        ? 'bg-green-400' 
                        : 'bg-white bg-opacity-30'
                  }`}
                />
              ))}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(currentDecision?.category || '')}`}>
              {currentDecision?.category?.replace('_', ' ')?.toUpperCase() || 'GENERAL'}
            </span>
          </div>
        </div>

        {/* Decision Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Question */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Question {currentDecisionIndex + 1} of {decisions.length}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
                {currentDecision.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {currentDecision.options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-300 ${
                    selectedOption?.id === option.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedOption?.id === option.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {selectedOption?.id === option.id && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                          Option {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                      <span className="text-gray-800 font-medium leading-relaxed text-lg">
                        {option.text}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-gray-50 p-6 border-t">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentDecisionIndex === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                currentDecisionIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              Previous
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">
                {selectedOption ? '✓ Decision made' : 'Please select an option'}
              </div>
            </div>

            {currentDecisionIndex < decisions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedOption
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next Decision
              </button>
            ) : (
              <button
                onClick={handleSubmitAll}
                disabled={!allAnswered}
                className={`px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 ${
                  allAnswered
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Complete All Decisions
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionCard;