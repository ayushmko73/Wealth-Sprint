import React, { useState } from 'react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { useAudio } from '../../lib/stores/useAudio';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ScenarioOption {
  id: string;
  text: string;
  consequences: {
    stats?: { [key: string]: number };
    financial?: { [key: string]: number };
  };
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  context: string;
  category: string;
  rarity: string;
  options: ScenarioOption[];
}

const TaskPanel: React.FC = () => {
  const { updateFinancialData, updateStats, addGameEvent } = useWealthSprintGame();
  const { playHit } = useAudio();
  
  // Mock scenario for UI demonstration
  const [activeScenarios] = useState<Scenario[]>([
    {
      id: 'demo-scenario',
      title: 'Major Deal Opportunity',
      description: 'A potential client offers ₹50 lakh contract but demands 90-day payment terms.',
      context: 'Your business has been gaining traction in the market. This could be a breakthrough opportunity, but the payment terms present cash flow challenges.',
      category: 'business',
      rarity: 'rare',
      options: [
        {
          id: 'accept',
          text: 'Accept the deal with payment terms',
          consequences: {
            financial: { income: 500000 },
            stats: { stress: 20, reputation: 15 }
          }
        },
        {
          id: 'negotiate',
          text: 'Negotiate for 30-day payment terms',
          consequences: {
            financial: { income: 350000 },
            stats: { stress: 10, logic: 10 }
          }
        },
        {
          id: 'reject',
          text: 'Reject due to payment terms',
          consequences: {
            stats: { emotion: -10, logic: 15 }
          }
        }
      ]
    }
  ]);

  const handleOptionClick = (scenarioId: string, optionId: string) => {
    playHit();
    const scenario = activeScenarios.find(s => s.id === scenarioId);
    const option = scenario?.options.find(o => o.id === optionId);
    
    if (option) {
      // Apply consequences
      if (option.consequences.financial) {
        Object.entries(option.consequences.financial).forEach(([key, value]) => {
          if (key === 'income') {
            updateFinancialData({ bankBalance: value as number });
          }
        });
      }
      
      if (option.consequences.stats) {
        updateStats(option.consequences.stats as any);
      }
      
      addGameEvent({
        id: Date.now().toString(),
        type: 'decision',
        description: `Made decision: ${option.text}`,
        timestamp: Date.now(),
        amount: option.consequences.financial?.income || 0
      });
    }
  };

  const generateNewScenarios = () => {
    // Placeholder for scenario generation
    console.log('Generating new scenarios...');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'legendary': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business': return 'bg-[#d4af37]';
      case 'stocks': return 'bg-green-600';
      case 'real_estate': return 'bg-blue-600';
      case 'emotion': return 'bg-pink-600';
      case 'logic': return 'bg-purple-600';
      case 'health': return 'bg-red-600';
      case 'risk': return 'bg-orange-600';
      case 'ethics': return 'bg-indigo-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-2xl shadow-lg border border-gray-200 my-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold text-gray-800">Active Scenarios</h1>
        <Button 
          onClick={generateNewScenarios}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
          size="sm"
        >
          New Scenarios
        </Button>
      </div>

      {activeScenarios.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No scenarios available</p>
          <Button 
            onClick={generateNewScenarios}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Generate Scenarios
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeScenarios.map((scenario) => (
            <div key={scenario.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-5 border border-gray-200 shadow-sm">
              {/* Header with badges */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <Badge className={`${getCategoryColor(scenario.category)} text-white text-xs px-2 py-1 rounded-full`}>
                  {scenario.category.replace('_', ' ')}
                </Badge>
                <Badge className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {scenario.rarity}
                </Badge>
              </div>

              {/* Title and description */}
              <h3 className="font-bold text-gray-800 text-lg mb-2">{scenario.title}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{scenario.description}</p>
              
              {/* Context box */}
              <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                <p className="text-gray-700 text-sm leading-relaxed">{scenario.context}</p>
              </div>

              {/* Decision question */}
              <div className="text-center mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">What will you do?</h4>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
              </div>
              
              {/* Options */}
              <div className="space-y-3">
                {scenario.options.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(scenario.id, option.id)}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-blue-400 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-blue-500 flex items-center justify-center transition-colors mt-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-blue-500 transition-colors"></div>
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-3 text-sm leading-relaxed">
                          {option.text}
                        </p>
                        
                        {/* Consequences */}
                        <div className="flex flex-wrap gap-2">
                          {option.consequences.stats && Object.entries(option.consequences.stats).map(([key, value]) => (
                            value !== 0 && (
                              <div
                                key={key}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  value > 0 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {key.charAt(0).toUpperCase() + key.slice(1)} {value > 0 ? '+' : ''}{value}
                              </div>
                            )
                          ))}
                          {option.consequences.financial && Object.entries(option.consequences.financial).map(([key, value]) => (
                            value !== 0 && (
                              <div
                                key={key}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  value > 0 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'bg-orange-100 text-orange-700'
                                }`}
                              >
                                {key.charAt(0).toUpperCase() + key.slice(1)} ₹{value > 0 ? '+' : ''}{Math.abs(value).toLocaleString()}
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskPanel;
