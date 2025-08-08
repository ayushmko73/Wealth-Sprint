import React from 'react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { useAudio } from '../../lib/stores/useAudio';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const TaskPanel: React.FC = () => {
  const { activeScenarios, completeScenario, generateNewScenarios } = useWealthSprintGame();
  const { playHit } = useAudio();

  const handleOptionClick = (scenarioId: string, optionId: string) => {
    playHit();
    completeScenario(scenarioId, optionId);
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[#3a3a3a]">Active Scenarios</h1>
        <Button 
          onClick={generateNewScenarios}
          className="bg-[#d4af37] hover:bg-[#b8941f] text-white w-full sm:w-auto"
        >
          Generate New Scenarios
        </Button>
      </div>

      {activeScenarios.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No active scenarios available</p>
              <Button 
                onClick={generateNewScenarios}
                className="bg-[#d4af37] hover:bg-[#b8941f] text-white"
              >
                Generate Scenarios
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {activeScenarios.map((scenario) => (
            <Card key={scenario.id} className="shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className={`${getCategoryColor(scenario.category)} text-white text-xs`}>
                    {scenario.category.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge className={`${getRarityColor(scenario.rarity)} text-white text-xs`}>
                    {scenario.rarity.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-[#3a3a3a] text-lg">{scenario.title}</CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  {scenario.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-700">{scenario.context}</p>
                </div>
                
                <div className="space-y-2">
                  {scenario.options.map((option) => (
                    <Button
                      key={option.id}
                      onClick={() => handleOptionClick(scenario.id, option.id)}
                      className="w-full text-left justify-start h-auto p-3 bg-[#7e7d77] border border-[#6b6a64] hover:bg-[#878681] text-[#2c2a27]"
                      variant="outline"
                    >
                      <div className="flex flex-col w-full">
                        <span className="font-medium text-sm">{option.text}</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {option.consequences.stats && Object.entries(option.consequences.stats).map(([key, value]) => (
                            value !== 0 && (
                              <Badge 
                                key={key} 
                                variant="secondary"
                                className={`text-xs px-2 py-1 ${value > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                              >
                                {key}: {value > 0 ? '+' : ''}{value}
                              </Badge>
                            )
                          ))}
                          {option.consequences.financial && Object.entries(option.consequences.financial).map(([key, value]) => (
                            value !== 0 && (
                              <Badge 
                                key={key} 
                                variant="secondary"
                                className={`text-xs px-2 py-1 ${value > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                              >
                                {key}: ₹{value > 0 ? '+' : ''}{Math.abs(value).toLocaleString()}
                              </Badge>
                            )
                          ))}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskPanel;
