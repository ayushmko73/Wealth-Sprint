import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Target, Users, Brain, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { getTeamScenarios, TeamScenario } from '../../../lib/data/teamScenarios';
import { formatIndianCurrency } from '../../../lib/utils';

const StrategyHubSection: React.FC = () => {
  const { playerStats, financialData, updatePlayerStats, updateFinancialData, teamMembers, addGameEvent } = useWealthSprintGame();
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  
  const availableScenarios = getTeamScenarios(teamMembers);
  const [pendingDecisions, setPendingDecisions] = useState<TeamScenario[]>(availableScenarios.slice(0, 3));

  const selectedDecisionData = selectedDecision ? pendingDecisions.find(d => d.id.toString() === selectedDecision) : null;

  const handleDecision = (decisionId: string, optionId: string) => {
    const decision = pendingDecisions.find(d => d.id.toString() === decisionId);
    const option = decision?.options.find(o => o.id === optionId);
    
    if (decision && option) {
      // Apply stat and financial changes
      if (option.effects) {
        const updates: any = {};
        const financialUpdates: any = {};
        
        Object.entries(option.effects).forEach(([key, value]) => {
          if (typeof value === 'number') {
            if (key === 'bankBalance') {
              financialUpdates.bankBalance = financialData.bankBalance + value;
            } else if (key === 'mainIncome') {
              financialUpdates.mainIncome = financialData.mainIncome + value;
            } else if (key === 'sideIncome') {
              financialUpdates.sideIncome = financialData.sideIncome + value;
            } else if (key === 'monthlyExpenses') {
              financialUpdates.monthlyExpenses = financialData.monthlyExpenses + value;
            } else {
              updates[key] = Math.max(0, Math.min(100, (playerStats as any)[key] + value));
            }
          }
        });
        
        if (Object.keys(updates).length > 0) {
          updatePlayerStats(updates);
        }
        
        if (Object.keys(financialUpdates).length > 0) {
          updateFinancialData(financialUpdates);
        }
      }
      
      // Apply team impacts
      if (decision.teamImpact) {
        decision.teamImpact.forEach(impact => {
          // Apply team member effects here if needed
        });
      }
      
      // Add event log
      addGameEvent({
        id: `decision_${Date.now()}`,
        type: 'info',
        title: 'Strategic Decision Made',
        description: `${decision.title}: ${option.text}`,
        timestamp: new Date()
      });
      
      // Remove completed decision
      setPendingDecisions(pendingDecisions.filter(d => d.id.toString() !== decisionId));
      setSelectedDecision(null);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#3a3a3a]">Strategy Hub</h1>
        <div className="flex items-center gap-4">
          <Badge className="bg-[#d4af37] text-white">
            {pendingDecisions.length} Pending Decisions
          </Badge>
        </div>
      </div>

      {/* Team Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Executive Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map(member => (
              <div key={member.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{member.emoji}</span>
                  <div>
                    <div className="font-semibold text-sm">{member.name}</div>
                    <div className="text-xs text-gray-600">{member.role}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  Performance: {member.performance}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Decisions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} />
              Pending Decisions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingDecisions.map(decision => {
                const requiredMember = teamMembers.find(m => m.roleId === decision.requiredRole);
                return (
                  <button
                    key={decision.id}
                    onClick={() => setSelectedDecision(decision.id.toString())}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      selectedDecision === decision.id.toString() 
                        ? 'bg-[#d4af37] text-white' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎯</span>
                        <span className="font-semibold text-sm">{decision.title}</span>
                      </div>
                      <Badge className={`${getUrgencyColor(decision.urgency)} text-white text-xs`}>
                        {decision.urgency.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm opacity-70 mb-2">
                      Team: {requiredMember?.name || 'Executive Team'}
                    </div>
                    <div className="text-sm opacity-80">
                      {decision.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Decision Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain size={20} />
              {selectedDecisionData ? selectedDecisionData.title : 'Select a decision'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDecisionData ? (
              <div className="space-y-6">
                {/* Decision Context */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">🎯</div>
                    <div>
                      <div className="font-semibold">{selectedDecisionData.title}</div>
                      <div className="text-sm text-gray-600">{selectedDecisionData.section}</div>
                      <div className="text-sm text-gray-600">
                        Team Role: {selectedDecisionData.requiredRole || 'Executive'}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{selectedDecisionData.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getUrgencyColor(selectedDecisionData.urgency)} text-white`}>
                      {selectedDecisionData.urgency.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  {selectedDecisionData.options.map(option => (
                    <Card key={option.id} className="border-2 hover:border-[#d4af37] transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl">⚡</div>
                          <div>
                            <div className="font-semibold text-sm">{option.text}</div>
                          </div>
                        </div>
                        
                        {/* Stats Preview */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {Object.entries(option.effects || {}).map(([key, value]) => (
                            <Badge key={key} variant="outline" className={value > 0 ? 'text-green-600' : 'text-red-600'}>
                              {key}: {value > 0 ? '+' : ''}{typeof value === 'number' && key.includes('Balance') ? formatIndianCurrency(value) : value}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Outcome Preview */}
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle size={14} className="text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Expected Outcome</span>
                          </div>
                          <p className="text-sm text-blue-700">{option.description}</p>
                        </div>
                        
                        <Button 
                          onClick={() => handleDecision(selectedDecisionData.id.toString(), option.id)}
                          className="w-full bg-[#d4af37] hover:bg-[#b8941f]"
                        >
                          Choose This Option
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Select a decision from the board to review and make your choice</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StrategyHubSection;