import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { useTeamManagement } from '../../../lib/stores/useTeamManagement';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Target, Users, Brain, TrendingUp, AlertCircle, CheckCircle, XCircle, User, Trash2, X, BarChart3, Trophy, Zap, Shield, DollarSign, Activity } from 'lucide-react';
import { getTeamScenarios, TeamScenario } from '../../../lib/data/teamScenarios';
import { formatIndianCurrency } from '../../../lib/utils';

const StrategyHubSection: React.FC = () => {
  const { playerStats, financialData, updatePlayerStats, updateFinancialData, addGameEvent, currentWeek } = useWealthSprintGame();
  const { teamMembers, removeTeamMember } = useTeamManagement();
  const [selectedCategory, setSelectedCategory] = useState<string>('Performance');
  
  const availableScenarios = getTeamScenarios(teamMembers);
  const [pendingDecisions, setPendingDecisions] = useState<TeamScenario[]>(availableScenarios.slice(0, 3));

  // Strategy categories for horizontal navigation
  const categories = ['Performance', 'Team Suggestions', 'Meeting Room', 'Financial Health', 'Risk Analysis'];
  
  const categoryIcons: Record<string, React.ReactNode> = {
    'Performance': <BarChart3 className="w-4 h-4" />,
    'Team Suggestions': <Users className="w-4 h-4" />,
    'Meeting Room': <Target className="w-4 h-4" />,
    'Financial Health': <DollarSign className="w-4 h-4" />,
    'Risk Analysis': <Shield className="w-4 h-4" />
  };

  const getCategoryColors = (category: string, isSelected: boolean) => {
    return {
      bg: isSelected ? 'bg-white text-blue-800 shadow-md' : 'bg-white/10 text-white hover:bg-white/20',
      text: 'text-blue-800',
      badge: 'bg-blue-500'
    };
  };

  // Calculate strategy metrics based on current game state
  const calculatePerformanceMetrics = () => {
    const efficiency = Math.round(((playerStats.logic + playerStats.energy) / 2));
    const teamEffectiveness = teamMembers.length > 0 ? 
      Math.round(teamMembers.reduce((sum, member) => sum + (member.stats?.loyalty || 70), 0) / teamMembers.length) : 0;
    const financialStability = Math.min(100, Math.round((financialData.bankBalance / financialData.monthlyExpenses) * 10));
    const marketPosition = Math.round(((playerStats.reputation + playerStats.logic) / 2));
    
    return { efficiency, teamEffectiveness, financialStability, marketPosition };
  };

  const calculateRiskFactors = () => {
    const cashflowRisk = financialData.bankBalance < (financialData.monthlyExpenses * 3) ? 'High' : 
                        financialData.bankBalance < (financialData.monthlyExpenses * 6) ? 'Medium' : 'Low';
    const teamRisk = teamMembers.length === 0 ? 'High' : teamMembers.length < 3 ? 'Medium' : 'Low';
    const stressRisk = playerStats.stress > 80 ? 'High' : playerStats.stress > 50 ? 'Medium' : 'Low';
    
    return { cashflowRisk, teamRisk, stressRisk };
  };

  const metrics = calculatePerformanceMetrics();
  const risks = calculateRiskFactors();


  return (
    <div className="space-y-4">
      {/* Blue Header Section - Inspired by Banking/Stock Market/Bonds sections */}
      <div className="mx-2">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          {/* Header Content */}
          <div className="flex items-center justify-between p-4 pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <div>
                <h1 className="text-lg font-bold">Strategy Hub</h1>
                <p className="text-blue-100 text-xs">Strategic planning & performance analytics • Week {currentWeek}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-200">Status</p>
              <p className="text-sm font-bold text-green-400">ACTIVE</p>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-3 px-4">
            <div>
              <p className="text-blue-200 text-xs">EFFICIENCY: <span className="text-white font-bold">{metrics.efficiency}%</span> 
                <span className={metrics.efficiency >= 70 ? "text-green-400" : metrics.efficiency >= 50 ? "text-yellow-400" : "text-red-400"}>
                  {metrics.efficiency >= 70 ? " ↗" : metrics.efficiency >= 50 ? " →" : " ↘"}
                </span>
              </p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">MARKET POSITION: <span className="text-white font-bold">{metrics.marketPosition}%</span></p>
            </div>
          </div>
          
          {/* Bottom Metrics */}
          <div className="grid grid-cols-4 gap-2 text-center px-4 pb-3">
            <div>
              <p className="text-blue-200 text-xs">Team Size</p>
              <p className="text-sm font-bold">{teamMembers.length}</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Team Score</p>
              <p className="text-sm font-bold text-green-400">{metrics.teamEffectiveness}%</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Financial</p>
              <p className="text-sm font-bold text-blue-400">{metrics.financialStability}%</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Decisions</p>
              <p className="text-sm font-bold text-yellow-400">{pendingDecisions.length}</p>
            </div>
          </div>
          
          {/* Category Navigation */}
          <div className="overflow-x-auto px-4 pb-4">
            <div className="flex gap-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shadow-md ${
                    getCategoryColors(category, selectedCategory === category).bg
                  }`}
                >
                  {categoryIcons[category]}
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content based on selected category */}
      <div className="mt-3 px-4">
        {selectedCategory === 'Performance' && (
          <div className="space-y-4">
            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Efficiency Score</p>
                      <p className="text-2xl font-bold text-green-800">{metrics.efficiency}%</p>
                      <p className="text-xs text-green-600">Logic + Energy Average</p>
                    </div>
                    <Activity className="text-green-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">Market Position</p>
                      <p className="text-2xl font-bold text-purple-800">{metrics.marketPosition}%</p>
                      <p className="text-xs text-purple-600">Reputation + Logic</p>
                    </div>
                    <Target className="text-purple-600" size={24} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} />
                  Performance Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Logic</span>
                    <span className="font-bold">{playerStats.logic}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Energy</span>
                    <span className="font-bold">{playerStats.energy}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reputation</span>
                    <span className="font-bold">{playerStats.reputation}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stress Level</span>
                    <span className={`font-bold ${playerStats.stress > 70 ? 'text-red-600' : playerStats.stress > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {playerStats.stress}/100
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedCategory === 'Team Suggestions' && (
          <div className="space-y-4">
            {teamMembers.length > 0 ? (
              <>
                {/* Team Effectiveness Card */}
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Team Effectiveness</p>
                        <p className="text-2xl font-bold text-blue-800">{metrics.teamEffectiveness}%</p>
                        <p className="text-xs text-blue-600">Average Team Performance</p>
                      </div>
                      <Users className="text-blue-600" size={24} />
                    </div>
                  </CardContent>
                </Card>

                {/* Team Members List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users size={20} />
                      Team Members ({teamMembers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamMembers.map(member => {
                        const loyalty = member.stats?.loyalty || 75;
                        return (
                          <div 
                            key={member.id} 
                            className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                  <User size={16} className="text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800">{member.name}</h3>
                                  <p className="text-sm text-gray-600">{member.role}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-700">Performance</p>
                                <p className={`text-lg font-bold ${
                                  loyalty >= 80 ? 'text-green-600' : 
                                  loyalty >= 60 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {loyalty}%
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Users size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 font-medium mb-2">No team members hired yet</p>
                  <p className="text-sm text-gray-400">Visit the Team Management section to hire your first employees</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {selectedCategory === 'Meeting Room' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="text-center py-12">
                <Target size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 font-medium mb-2">Meeting Room Coming Soon</p>
                <p className="text-sm text-gray-400">This feature is under development</p>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedCategory === 'Financial Health' && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Financial Stability</p>
                    <p className="text-2xl font-bold text-green-800">{metrics.financialStability}%</p>
                    <p className="text-xs text-green-600">Cash runway vs expenses</p>
                  </div>
                  <DollarSign className="text-green-600" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Bank Balance</span>
                    <span className="font-bold">{formatIndianCurrency(financialData.bankBalance)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Income</span>
                    <span className="font-bold text-green-600">+{formatIndianCurrency(financialData.mainIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Expenses</span>
                    <span className="font-bold text-red-600">-{formatIndianCurrency(financialData.monthlyExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="font-medium">Net Monthly</span>
                    <span className={`font-bold ${
                      (financialData.mainIncome - financialData.monthlyExpenses) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatIndianCurrency(financialData.mainIncome - financialData.monthlyExpenses)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedCategory === 'Risk Analysis' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={`${risks.cashflowRisk === 'High' ? 'bg-red-50 border-red-200' : 
                                risks.cashflowRisk === 'Medium' ? 'bg-yellow-50 border-yellow-200' : 
                                'bg-green-50 border-green-200'}`}>
                <CardContent className="p-4 text-center">
                  <Shield className={`mx-auto mb-2 ${
                    risks.cashflowRisk === 'High' ? 'text-red-600' : 
                    risks.cashflowRisk === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                  }`} size={24} />
                  <p className="text-sm font-medium">Cashflow Risk</p>
                  <p className={`text-lg font-bold ${
                    risks.cashflowRisk === 'High' ? 'text-red-700' : 
                    risks.cashflowRisk === 'Medium' ? 'text-yellow-700' : 'text-green-700'
                  }`}>
                    {risks.cashflowRisk}
                  </p>
                </CardContent>
              </Card>

              <Card className={`${risks.teamRisk === 'High' ? 'bg-red-50 border-red-200' : 
                                risks.teamRisk === 'Medium' ? 'bg-yellow-50 border-yellow-200' : 
                                'bg-green-50 border-green-200'}`}>
                <CardContent className="p-4 text-center">
                  <Users className={`mx-auto mb-2 ${
                    risks.teamRisk === 'High' ? 'text-red-600' : 
                    risks.teamRisk === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                  }`} size={24} />
                  <p className="text-sm font-medium">Team Risk</p>
                  <p className={`text-lg font-bold ${
                    risks.teamRisk === 'High' ? 'text-red-700' : 
                    risks.teamRisk === 'Medium' ? 'text-yellow-700' : 'text-green-700'
                  }`}>
                    {risks.teamRisk}
                  </p>
                </CardContent>
              </Card>

              <Card className={`${risks.stressRisk === 'High' ? 'bg-red-50 border-red-200' : 
                                risks.stressRisk === 'Medium' ? 'bg-yellow-50 border-yellow-200' : 
                                'bg-green-50 border-green-200'}`}>
                <CardContent className="p-4 text-center">
                  <Brain className={`mx-auto mb-2 ${
                    risks.stressRisk === 'High' ? 'text-red-600' : 
                    risks.stressRisk === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                  }`} size={24} />
                  <p className="text-sm font-medium">Stress Risk</p>
                  <p className={`text-lg font-bold ${
                    risks.stressRisk === 'High' ? 'text-red-700' : 
                    risks.stressRisk === 'Medium' ? 'text-yellow-700' : 'text-green-700'
                  }`}>
                    {risks.stressRisk}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Risk Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {risks.cashflowRisk === 'High' && (
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle size={16} />
                      <span className="text-sm">Build emergency fund (3-6 months expenses)</span>
                    </div>
                  )}
                  {risks.teamRisk === 'High' && (
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle size={16} />
                      <span className="text-sm">Consider hiring team members to reduce dependency</span>
                    </div>
                  )}
                  {risks.stressRisk === 'High' && (
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle size={16} />
                      <span className="text-sm">Focus on stress management and work-life balance</span>
                    </div>
                  )}
                  {risks.cashflowRisk === 'Low' && risks.teamRisk === 'Low' && risks.stressRisk === 'Low' && (
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle size={16} />
                      <span className="text-sm">All risk factors are well managed. Great job!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyHubSection;