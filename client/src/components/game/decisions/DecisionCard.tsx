import React, { useState } from 'react';
import { useDecisionSystem, Decision, DecisionOption } from '../../../lib/stores/useDecisionSystem';

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

  const handleSubmitAll = async () => {
    await submitAllDecisions();
  };

  const allAnswered = decisions.every(d => selectedOptions[d.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Compact Header */}
        <div className="bg-blue-600 text-white p-3 rounded-t-2xl">
          <div className="text-center">
            <h1 className="text-base font-bold">Question {currentDecisionIndex + 1} of {decisions.length}</h1>
          </div>
          
          {/* Mini Progress Bar */}
          <div className="mt-2">
            <div className="flex gap-1">
              {decisions.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full ${
                    selectedOptions[decisions[index].id] 
                      ? 'bg-green-400' 
                      : index === currentDecisionIndex
                      ? 'bg-white'
                      : 'bg-blue-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Compact Content */}
        <div className="flex-1 p-3 overflow-y-auto">
          {/* Question */}
          <div className="mb-3">
            <p className="text-sm text-gray-800 leading-snug">
              {currentDecision.question}
            </p>
          </div>

          {/* Compact Options */}
          <div className="space-y-2">
            {currentDecision.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-3 text-left rounded-xl border transition-all duration-200 ${
                  selectedOption?.id === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                    selectedOption?.id === option.id 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedOption?.id === option.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-600 mb-1">
                      Option {String.fromCharCode(65 + index)}
                    </div>
                    <p className="text-sm text-gray-800">{option.text}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Compact Navigation */}
        <div className="bg-gray-50 p-3 rounded-b-2xl border-t flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentDecisionIndex === 0}
            className="text-sm px-3 py-1.5 text-gray-600 hover:text-gray-800 disabled:opacity-30"
          >
            ← Prev
          </button>
          
          <div className="text-xs text-gray-500">
            {selectedOption ? '✓' : '○'}
          </div>
          
          {currentDecisionIndex === decisions.length - 1 ? (
            <button
              onClick={handleSubmitAll}
              disabled={!allAnswered}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300"
            >
              Submit All
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="text-sm px-3 py-1.5 text-gray-600 hover:text-gray-800"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecisionCard;