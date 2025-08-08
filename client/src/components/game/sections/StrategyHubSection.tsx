import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { useTeamManagement } from '../../../lib/stores/useTeamManagement';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Target, Users, Brain, TrendingUp, AlertCircle, CheckCircle, XCircle, User } from 'lucide-react';
import { getTeamScenarios, TeamScenario } from '../../../lib/data/teamScenarios';
import { formatIndianCurrency } from '../../../lib/utils';

const StrategyHubSection: React.FC = () => {
  const { playerStats, financialData, updatePlayerStats, updateFinancialData, addGameEvent } = useWealthSprintGame();
  const { teamMembers, removeTeamMember } = useTeamManagement();
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [fireModalOpen, setFireModalOpen] = useState(false);
  const [memberToFire, setMemberToFire] = useState<any>(null);
  
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

  const handleFireConfirm = () => {
    if (memberToFire) {
      removeTeamMember(memberToFire.id);
      addGameEvent(`${memberToFire.name} has been removed from the team`, 'team');
      setFireModalOpen(false);
      setMemberToFire(null);
    }
  };

  return (
    <div className="relative space-y-6">
      {/* Fire Confirmation Modal */}
      {fireModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => {
            setFireModalOpen(false);
            setMemberToFire(null);
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'fadeInScale 0.3s ease-out',
            }}
          >
            <h3 className="text-lg font-bold text-[#222222] mb-2">Remove Team Member</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <strong>{memberToFire?.name}</strong> from your team?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setFireModalOpen(false);
                  setMemberToFire(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFireConfirm}
                className="px-4 py-2 bg-[#F44336] text-white rounded-md hover:bg-[#d32f2f] transition-colors"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
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
            Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teamMembers.length > 0 ? (
            <div className="space-y-3">
              {teamMembers.map(member => {
                const impact = member.stats?.impact === 3 ? 'High' : member.stats?.impact === 2 ? 'Medium' : 'Low';
                const loyalty = member.stats?.loyalty || 75;
                const impactColor = impact === 'High' ? '#4CAF50' : impact === 'Medium' ? '#FFC107' : '#F44336';
                const performanceColor = loyalty >= 80 ? '#2E7D32' : loyalty >= 50 ? '#5E35B1' : '#C62828';
                
                return (
                  <div 
                    key={member.id} 
                    className="relative group cursor-pointer transition-all duration-200 hover:shadow-md"
                    style={{
                      background: 'linear-gradient(to right, #fdfaf3, #f6f1e7)',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    {/* Left Impact Indicator Strip */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg"
                      style={{ backgroundColor: impactColor }}
                    ></div>
                    
                    {/* Fire Button */}
                    <button 
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 hover:text-red-700 transition-colors duration-200 group/fire"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMemberToFire(member);
                        setFireModalOpen(true);
                      }}
                      title="Remove team member"
                    >
                      🔥
                    </button>
                    
                    <div className="p-4 pl-6">
                      {/* Header Section */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User size={16} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base text-[#222222] leading-tight mb-1">
                            {member.name}
                          </h3>
                          <p className="text-sm text-[#3E4A89] mb-1">
                            {member.role}
                          </p>
                          <p className="text-xs text-[#568C84] uppercase tracking-wide">
                            Department
                          </p>
                        </div>
                      </div>
                      
                      {/* Performance Only */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Performance:</span>
                        <div className="flex items-center gap-2">
                          <div className="relative w-5 h-5">
                            <svg className="w-5 h-5 transform -rotate-90" viewBox="0 0 24 24">
                              <circle 
                                cx="12" cy="12" r="10" 
                                stroke="#E5E7EB" strokeWidth="3" 
                                fill="none"
                              />
                              <circle 
                                cx="12" cy="12" r="10" 
                                stroke={performanceColor} strokeWidth="3" 
                                fill="none"
                                strokeDasharray={`${loyalty * 0.628} 62.8`}
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                          </div>
                          <span 
                            className="text-sm font-bold"
                            style={{ color: performanceColor }}
                          >
                            {loyalty}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <Users size={48} className="mx-auto mb-3" />
              </div>
              <p className="text-gray-500 font-medium mb-2">No team members hired yet</p>
              <p className="text-sm text-gray-400">Visit the Hire Team section to hire your first employees</p>
            </div>
          )}
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
                const requiredMember = teamMembers.find(m => m.role === decision.requiredRole);
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