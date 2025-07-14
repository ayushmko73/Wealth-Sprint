import React, { useState, useEffect } from 'react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { CheckCircle, XCircle, TrendingUp, Brain, Heart, Zap, Scale, Star, AlertTriangle } from 'lucide-react';
import { getRandomScenarios, getContextualScenarios, GameScenario } from '../../lib/data/scenarios';
import { checkSpecialScenarioTriggers } from '../../lib/data/specialScenarios';
import { toast } from 'sonner';

interface ScenarioEngineProps {
  onScenarioComplete?: () => void;
}

const ScenarioEngine: React.FC<ScenarioEngineProps> = ({ onScenarioComplete }) => {
  const { 
    playerStats, 
    financialData, 
    timeEngine, 
    gameState, 
    updatePlayerStats, 
    updateFinancialData, 
    addGameEvent,
    processTurn,
    checkReputationAccess
  } = useWealthSprintGame();
  
  const [currentScenario, setCurrentScenario] = useState<GameScenario | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [resultEffects, setResultEffects] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomScenario = (): GameScenario => {
    // Check for special scenario triggers first
    const specialScenario = checkSpecialScenarioTriggers(playerStats, financialData, gameState);
    if (specialScenario) {
      return specialScenario;
    }
    
    // Try to get contextual scenarios
    const contextualScenarios = getContextualScenarios(playerStats, financialData);
    if (contextualScenarios.length > 0) {
      const randomIndex = Math.floor(Math.random() * contextualScenarios.length);
      return contextualScenarios[randomIndex];
    }
    
    // Fall back to random scenarios
    const randomScenarios = getRandomScenarios(1);
    return randomScenarios[0];
  };

  const loadNextScenario = () => {
    const nextScenario = getRandomScenario();
    setCurrentScenario(nextScenario);
    setSelectedChoice(null);
    setShowResult(false);
    setResultEffects(null);
    setIsAnimating(true);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  useEffect(() => {
    if (!currentScenario) {
      loadNextScenario();
    }
  }, []);

  const handleChoiceSelect = (choiceIndex: number) => {
    if (showResult) return;
    setSelectedChoice(choiceIndex);
  };

  const handleScenarioComplete = () => {
    if (selectedChoice === null || !currentScenario) return;

    const choice = currentScenario.options[selectedChoice];
    const effects = choice.effects;
    
    // Apply effects to player stats
    const statUpdates: any = {};
    const financialUpdates: any = {};

    if (effects.karma !== undefined) statUpdates.karma = Math.max(0, Math.min(100, playerStats.karma + effects.karma));
    if (effects.logic !== undefined) statUpdates.logic = Math.max(0, Math.min(100, playerStats.logic + effects.logic));
    if (effects.emotion !== undefined) statUpdates.emotion = Math.max(0, Math.min(100, playerStats.emotion + effects.emotion));
    if (effects.stress !== undefined) statUpdates.stress = Math.max(0, Math.min(100, playerStats.stress + effects.stress));
    if (effects.reputation !== undefined) statUpdates.reputation = Math.max(0, Math.min(100, playerStats.reputation + effects.reputation));
    if (effects.energy !== undefined) statUpdates.energy = Math.max(0, Math.min(100, playerStats.energy + effects.energy));

    // Handle financial effects - strict wallet vs bank separation
    if (effects.bankBalance !== undefined) {
      financialUpdates.bankBalance = Math.max(0, financialData.bankBalance + effects.bankBalance);
    }
    if (effects.inHandCash !== undefined) {
      financialUpdates.inHandCash = Math.max(0, financialData.inHandCash + effects.inHandCash);
    }
    if (effects.mainIncome !== undefined) {
      financialUpdates.mainIncome = Math.max(0, financialData.mainIncome + effects.mainIncome);
    }
    if (effects.sideIncome !== undefined) {
      financialUpdates.sideIncome = Math.max(0, financialData.sideIncome + effects.sideIncome);
    }
    if (effects.monthlyExpenses !== undefined) {
      financialUpdates.monthlyExpenses = Math.max(0, financialData.monthlyExpenses + effects.monthlyExpenses);
    }

    // Update the stores
    if (Object.keys(statUpdates).length > 0) {
      updatePlayerStats(statUpdates);
    }
    if (Object.keys(financialUpdates).length > 0) {
      updateFinancialData(financialUpdates);
    }

    // Show result screen
    setResultEffects(effects);
    setShowResult(true);

    // Add animated decision feedback with icons
    const effectsText = Object.entries(effects)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => {
        const icon = key === 'karma' ? '🌱' : 
                    key === 'stress' ? '⚠️' : 
                    key === 'energy' ? '🔋' : 
                    key === 'reputation' ? '⭐' : 
                    key === 'emotion' ? '❤️' : 
                    key === 'logic' ? '🧠' : 
                    key === 'bankBalance' ? '🏦' : 
                    key === 'inHandCash' ? '💰' : 
                    key === 'mainIncome' ? '💼' : 
                    key === 'sideIncome' ? '📊' : 
                    key === 'monthlyExpenses' ? '💸' : '📈';
        return `${icon} ${key}: ${value > 0 ? '+' : ''}${value}`;
      })
      .join(', ');

    addGameEvent({
      id: `scenario_${currentScenario.id}_${Date.now()}`,
      type: 'achievement',
      title: `✅ Decision Made: ${currentScenario.title}`,
      description: `You chose: ${choice.text}. Effects: ${effectsText}`,
      impact: { duration: 1, effects: effects }
    });

    // Process turn and check all critical systems
    processTurn();
    
    // Auto-advance after 3 seconds
    setTimeout(() => {
      loadNextScenario();
      onScenarioComplete?.();
    }, 3000);
  };

  const getCategoryColor = (section: string) => {
    switch (section.toLowerCase()) {
      case 'finance': return 'bg-green-500';
      case 'emotion': return 'bg-pink-500';
      case 'business': return 'bg-blue-500';
      case 'personal': return 'bg-purple-500';
      case 'investment': return 'bg-yellow-500';
      case 'hr/team': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getEffectIcon = (effect: string) => {
    switch (effect) {
      case 'bankBalance': return TrendingUp;
      case 'inHandCash': return TrendingUp;
      case 'mainIncome': return TrendingUp;
      case 'sideIncome': return TrendingUp;
      case 'monthlyExpenses': return TrendingUp;
      case 'karma': return Scale;
      case 'logic': return Brain;
      case 'emotion': return Heart;
      case 'stress': return AlertTriangle;
      case 'reputation': return Star;
      case 'energy': return Zap;
      default: return TrendingUp;
    }
  };

  const getEffectColor = (effect: string, value: number) => {
    if (effect === 'stress' || effect === 'monthlyExpenses') {
      return value > 0 ? 'text-red-500' : 'text-green-500';
    }
    return value > 0 ? 'text-green-500' : 'text-red-500';
  };

  if (!currentScenario) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-500">Loading scenario...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResult && resultEffects) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-green-600" size={24} />
            Decision Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800">
                Choice Made: {currentScenario.options[selectedChoice!].text}
              </h3>
              <p className="text-sm text-green-600 mt-2">Effects Applied</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(resultEffects).map(([effect, value]) => {
                if (value === 0) return null;
                const Icon = getEffectIcon(effect);
                return (
                  <div key={effect} className="bg-white p-3 rounded-lg text-center">
                    <Icon size={20} className={`mx-auto mb-1 ${getEffectColor(effect, value as number)}`} />
                    <div className="text-xs text-gray-600 capitalize">{effect}</div>
                    <div className={`font-semibold ${getEffectColor(effect, value as number)}`}>
                      {value as number > 0 ? '+' : ''}{value as number}
                      {effect === 'money' ? '' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <div className="animate-pulse text-sm text-gray-500">
                Loading next scenario...
              </div>
              <Progress value={100} className="w-full mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`transition-all duration-300 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            {currentScenario.title}
          </CardTitle>
          <Badge className={`${getCategoryColor(currentScenario.section)} text-white`}>
            {currentScenario.section}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            {currentScenario.description}
          </p>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">What will you do?</h3>
            {currentScenario.options.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoiceSelect(index)}
                className={`w-full p-4 rounded-lg text-left transition-all duration-200 border-2 ${
                  selectedChoice === index 
                    ? 'border-[#d4af37] bg-[#d4af37] text-white shadow-lg scale-[1.02]' 
                    : 'border-gray-200 bg-white hover:border-[#d4af37] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedChoice === index 
                      ? 'border-white bg-white' 
                      : 'border-gray-300'
                  }`}>
                    {selectedChoice === index && (
                      <CheckCircle size={16} className="text-[#d4af37]" />
                    )}
                  </div>
                  <span className="font-medium">{choice.text}</span>
                </div>
                
                {/* Show preview of effects */}
                <div className="mt-2 ml-9 flex flex-wrap gap-2">
                  {Object.entries(choice.effects).map(([effect, value]) => {
                    if (value === 0) return null;
                    const Icon = getEffectIcon(effect);
                    return (
                      <div key={effect} className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                        selectedChoice === index ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                      }`}>
                        <Icon size={12} />
                        <span className="capitalize">{effect}</span>
                        <span className={selectedChoice === index ? 'text-white' : getEffectColor(effect, value as number)}>
                          {value as number > 0 ? '+' : ''}{value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleScenarioComplete}
              disabled={selectedChoice === null}
              className="bg-[#d4af37] hover:bg-[#b8941f] text-white px-8 py-2 font-semibold"
            >
              {selectedChoice !== null ? 'Confirm Decision' : 'Select a Choice'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioEngine;