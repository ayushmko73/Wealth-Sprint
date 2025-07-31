import React, { useState, useEffect } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { useAudio } from '../../../lib/stores/useAudio';
import { getRandomScenarios } from '../../../lib/data/scenarios';
import type { GameScenario } from '../../../lib/data/scenarios';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Zap, 
  Heart, 
  Brain, 
  Star,
  Briefcase,
  Users,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const GameplayContent: React.FC = () => {
  const { 
    playerStats, 
    financialData, 
    currentWeek, 
    currentDay,
    updatePlayerStats,
    updateFinancialData 
  } = useWealthSprintGame();
  
  const { playSuccess, playHit } = useAudio();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<GameScenario[]>([]);

  // Load scenarios on component mount
  useEffect(() => {
    const loadedScenarios = getRandomScenarios(5);
    setScenarios(loadedScenarios);
  }, []);

  const handleScenarioChoice = (scenarioId: string, choiceId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    const choice = scenario?.choices.find(c => c.id === choiceId);
    
    if (choice && choice.consequences) {
      // Apply consequences to player stats
      const statsUpdate: any = {};
      const financialUpdate: any = {};
      
      Object.entries(choice.consequences).forEach(([key, value]) => {
        if (key === 'bankBalance') {
          financialUpdate.bankBalance = (financialData.bankBalance || 0) + (value || 0);
          financialUpdate.netWorth = (financialData.netWorth || 0) + (value || 0);
        } else {
          statsUpdate[key] = Math.max(0, Math.min(100, (playerStats[key as keyof typeof playerStats] || 0) + (value || 0)));
        }
      });
      
      updatePlayerStats(statsUpdate);
      updateFinancialData(financialUpdate);
      
      // Play sound effect
      if (choice.consequences.bankBalance && choice.consequences.bankBalance > 0) {
        playSuccess();
      } else {
        playHit();
      }
      
      // Show toast notification
      toast.success(`${choice.description}`, {
        description: `Choice: ${choice.text}`,
        duration: 3000,
      });
      
      // Remove completed scenario
      setScenarios(prev => prev.filter(s => s.id !== scenarioId));
      setSelectedScenario(null);
    }
  };

  const loadMoreScenarios = () => {
    const newScenarios = getRandomScenarios(3);
    setScenarios(prev => [...prev, ...newScenarios]);
    toast.info('New scenarios loaded!', {
      description: 'Fresh challenges await you',
      duration: 2000,
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'family': return <Heart className="w-4 h-4" />;
      case 'business': return <Briefcase className="w-4 h-4" />;
      case 'investment': return <TrendingUp className="w-4 h-4" />;
      case 'career': return <Target className="w-4 h-4" />;
      case 'crisis': return <AlertTriangle className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Net Worth</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(financialData.netWorth || 0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Bank Balance</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(financialData.bankBalance || 0)}
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Game Progress</p>
                <p className="text-2xl font-bold text-purple-900">
                  Week {currentWeek}, Day {currentDay}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Player Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Player Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(playerStats).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium capitalize">{key}</span>
                  <span className="text-sm text-gray-600">{value}/100</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenarios Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Active Scenarios</h2>
          <Button onClick={loadMoreScenarios} variant="outline" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Load More
          </Button>
        </div>

        {scenarios.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">No scenarios available</p>
              <Button onClick={loadMoreScenarios}>
                <Sparkles className="w-4 h-4 mr-2" />
                Load Scenarios
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(scenario.category)}
                      <Badge variant="outline" className="text-xs capitalize">
                        {scenario.category}
                      </Badge>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${getUrgencyColor(scenario.urgency)}`} />
                  </div>
                  <CardTitle className="text-lg">{scenario.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>
                  
                  {selectedScenario === scenario.id ? (
                    <div className="space-y-2">
                      {scenario.choices.map((choice) => (
                        <Button
                          key={choice.id}
                          onClick={() => handleScenarioChoice(scenario.id, choice.id)}
                          variant="outline"
                          size="sm"
                          className="w-full text-left h-auto py-2 px-3 hover:bg-blue-50"
                        >
                          <div className="w-full">
                            <div className="font-medium text-sm">{choice.text}</div>
                            <div className="text-xs text-gray-500 mt-1">{choice.description}</div>
                          </div>
                        </Button>
                      ))}
                      <Button 
                        onClick={() => setSelectedScenario(null)}
                        variant="ghost" 
                        size="sm"
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setSelectedScenario(scenario.id)}
                      className="w-full"
                      size="sm"
                    >
                      Make Decision
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameplayContent;