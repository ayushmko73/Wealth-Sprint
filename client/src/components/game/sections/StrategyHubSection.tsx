import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { useTeamManagement } from '../../../lib/stores/useTeamManagement';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Target, Users, Brain, TrendingUp, AlertCircle, CheckCircle, XCircle, User, Trash2, X, BarChart3, Trophy, Zap, Shield, DollarSign, Activity } from 'lucide-react';
import { getTeamScenarios, TeamScenario } from '../../../lib/data/teamScenarios';
import { formatIndianCurrency } from '../../../lib/utils';
import MeetingRoomView from '../MeetingRoomView';

// Smart Team Suggestions Component
const TeamSuggestionsView: React.FC = () => {
  const { playerStats, financialData, purchasedSectors, uiState } = useWealthSprintGame();
  const { teamMembers } = useTeamManagement();

  // Get user's assets from game state (store items)
  const userAssets = financialData.assets || [];
  
  // Generate smart suggestions based on context
  const generateSuggestions = () => {
    const suggestions = {
      immediate: [] as any[],
      strategic: [] as any[],
      sectorBased: [] as any[],
      assetBased: [] as any[]
    };

    // Analyze current team composition
    const currentRoles = teamMembers.map(member => member.role.toLowerCase());
    const hasManager = currentRoles.some(role => role.includes('manager') || role.includes('lead'));
    const hasMarketing = currentRoles.some(role => role.includes('marketing') || role.includes('sales'));
    const hasTech = currentRoles.some(role => role.includes('developer') || role.includes('tech'));
    const hasFinance = currentRoles.some(role => role.includes('finance') || role.includes('accountant'));
    const hasOperations = currentRoles.some(role => role.includes('operations') || role.includes('logistics'));

    // IMMEDIATE SUGGESTIONS based on critical gaps
    if (teamMembers.length === 0) {
      suggestions.immediate.push({
        id: 'first_hire',
        priority: 'CRITICAL',
        title: 'Hire Your First Team Member',
        description: 'Start with a versatile manager or assistant to help delegate tasks.',
        actions: ['Visit Team Management', 'Look for Manager or Assistant roles'],
        impact: 'Reduces your stress by 15-20 points monthly',
        cost: '₹25K - ₹40K monthly',
        reasoning: 'Solo operations unsustainable beyond early stage'
      });
    }

    if (!hasFinance && financialData.bankBalance > 100000) {
      suggestions.immediate.push({
        id: 'finance_hire',
        priority: 'HIGH',
        title: 'Hire Finance Manager',
        description: 'With ₹1L+ balance, you need financial oversight and planning.',
        actions: ['Hire Accountant or Finance Manager', 'Set up financial reporting systems'],
        impact: 'Better financial decisions, tax optimization',
        cost: '₹35K - ₹50K monthly',
        reasoning: 'Growing finances need professional management'
      });
    }

    if (playerStats.stress > 70) {
      suggestions.immediate.push({
        id: 'stress_relief_hire',
        priority: 'URGENT',
        title: 'Delegate to Reduce Stress',
        description: `Your stress (${playerStats.stress}) is dangerously high. Hire support staff.`,
        actions: ['Hire Operations Manager', 'Hire Executive Assistant'],
        impact: 'Stress reduction: 20-30 points',
        cost: '₹30K - ₹45K monthly',
        reasoning: 'High stress leads to poor decisions and burnout'
      });
    }

    // SECTOR-SPECIFIC SUGGESTIONS
    purchasedSectors.forEach(sectorId => {
      switch(sectorId) {
        case 'fast_food':
          if (!hasOperations) {
            suggestions.sectorBased.push({
              id: 'ff_operations',
              sector: 'Fast Food',
              title: 'Hire Restaurant Operations Manager',
              description: 'Fast food requires tight operational control for quality and efficiency.',
              actions: ['Hire Operations Manager', 'Focus on food service experience'],
              impact: '15-25% efficiency boost, better customer satisfaction',
              cost: '₹40K - ₹60K monthly',
              reasoning: 'Fast food success depends on operational excellence'
            });
          }
          if (!hasMarketing) {
            suggestions.sectorBased.push({
              id: 'ff_marketing',
              sector: 'Fast Food',
              title: 'Hire Marketing Specialist',
              description: 'Drive customer acquisition and brand building.',
              actions: ['Hire Marketing Manager', 'Focus on local marketing experience'],
              impact: '20-30% revenue boost through better marketing',
              cost: '₹35K - ₹50K monthly',
              reasoning: 'Food industry needs strong local marketing'
            });
          }
          break;

        case 'tech_startups':
          if (!hasTech) {
            suggestions.sectorBased.push({
              id: 'tech_developer',
              sector: 'Tech Startup',
              title: 'Hire Lead Developer',
              description: 'Tech startups need strong technical leadership for product development.',
              actions: ['Hire Senior Developer', 'Look for startup experience'],
              impact: 'Faster product development, technical debt management',
              cost: '₹60K - ₹80K monthly',
              reasoning: 'Technical expertise crucial for startup success'
            });
          }
          if (teamMembers.length > 2 && !currentRoles.includes('cto')) {
            suggestions.sectorBased.push({
              id: 'tech_cto',
              sector: 'Tech Startup',
              title: 'Promote/Hire CTO',
              description: 'Scale requires dedicated technical leadership.',
              actions: ['Promote senior developer', 'Hire external CTO'],
              impact: 'Better technical strategy, team scaling',
              cost: '₹80K - ₹120K monthly',
              reasoning: 'Growing tech team needs dedicated leadership'
            });
          }
          break;

        case 'ecommerce':
          if (!hasMarketing) {
            suggestions.sectorBased.push({
              id: 'ecom_marketing',
              sector: 'E-commerce',
              title: 'Hire Digital Marketing Manager',
              description: 'E-commerce success depends heavily on digital marketing.',
              actions: ['Hire Digital Marketing specialist', 'Focus on performance marketing'],
              impact: '25-40% increase in online sales',
              cost: '₹45K - ₹65K monthly',
              reasoning: 'E-commerce is marketing-driven business'
            });
          }
          if (!hasOperations) {
            suggestions.sectorBased.push({
              id: 'ecom_logistics',
              sector: 'E-commerce',
              title: 'Hire Logistics Manager',
              description: 'Manage inventory, shipping, and customer service.',
              actions: ['Hire Operations/Logistics Manager', 'Focus on supply chain experience'],
              impact: 'Better delivery times, reduced operational costs',
              cost: '₹40K - ₹55K monthly',
              reasoning: 'E-commerce operations are complex and critical'
            });
          }
          break;

        case 'healthcare':
          suggestions.sectorBased.push({
            id: 'health_compliance',
            sector: 'Healthcare',
            title: 'Hire Compliance Manager',
            description: 'Healthcare has strict regulatory requirements.',
            actions: ['Hire Regulatory/Compliance specialist', 'Look for healthcare experience'],
            impact: 'Regulatory compliance, risk mitigation',
            cost: '₹50K - ₹70K monthly',
            reasoning: 'Healthcare sector requires specialized compliance expertise'
          });
          break;
      }
    });

    // ASSET-BASED SUGGESTIONS (based on store purchases)
    // This would analyze owned assets from the store and suggest relevant team members
    if (userAssets.length > 0) {
      const hasProperty = userAssets.some((asset: any) => asset.category === 'property');
      const hasVehicles = userAssets.some((asset: any) => asset.category === 'vehicle');
      
      if (hasProperty && !currentRoles.includes('property manager')) {
        suggestions.assetBased.push({
          id: 'property_management',
          asset: 'Real Estate',
          title: 'Hire Property Manager',
          description: 'Your property investments need professional management.',
          actions: ['Hire Property Manager', 'Focus on real estate experience'],
          impact: 'Better rental yields, property maintenance',
          cost: '₹30K - ₹45K monthly',
          reasoning: 'Property portfolio requires dedicated management'
        });
      }
    }

    // STRATEGIC SUGGESTIONS (future planning)
    if (financialData.bankBalance > 500000) {
      suggestions.strategic.push({
        id: 'exec_assistant',
        title: 'Plan Executive Team',
        description: 'With strong finances, consider building executive leadership.',
        actions: ['Plan C-level hires', 'Consider equity compensation'],
        impact: 'Strategic leadership, better decision making',
        cost: '₹80K - ₹150K monthly per executive',
        timeline: '3-6 months',
        reasoning: 'Scaling requires professional management layer'
      });
    }

    if (purchasedSectors.length >= 2) {
      suggestions.strategic.push({
        id: 'multi_sector_management',
        title: 'Multi-Sector Management Structure',
        description: 'Multiple sectors need specialized management.',
        actions: ['Hire sector-specific managers', 'Create management hierarchy'],
        impact: 'Better sector performance, focused expertise',
        cost: '₹100K - ₹200K monthly for full structure',
        timeline: '6-12 months',
        reasoning: 'Diversified portfolio needs specialized management'
      });
    }

    return suggestions;
  };

  const suggestions = generateSuggestions();
  const totalSuggestions = suggestions.immediate.length + suggestions.strategic.length + 
                          suggestions.sectorBased.length + suggestions.assetBased.length;

  return (
    <div className="space-y-4">

      {/* Immediate Actions */}
      {suggestions.immediate.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Immediate Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.immediate.map((suggestion, index) => (
              <div key={suggestion.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-red-800">{suggestion.title}</h4>
                </div>
                <p className="text-sm text-red-700 mb-3">{suggestion.description}</p>
                <div className="space-y-2 text-sm">
                  <div><strong>Actions:</strong> {suggestion.actions.join(', ')}</div>
                  <div><strong>Impact:</strong> {suggestion.impact}</div>
                  <div><strong>Cost:</strong> {suggestion.cost}</div>
                  <div className="text-xs italic text-red-600">{suggestion.reasoning}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Sector-Based Suggestions */}
      {suggestions.sectorBased.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Target className="w-5 h-5" />
              Sector-Specific Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.sectorBased.map((suggestion, index) => {
              const getBadgeColor = (sector: string) => {
                switch(sector) {
                  case 'Fast Food': return 'bg-orange-500 text-white';
                  case 'Tech Startup': return 'bg-blue-500 text-white';
                  case 'E-commerce': return 'bg-purple-500 text-white';
                  case 'Healthcare': return 'bg-green-500 text-white';
                  default: return 'bg-gray-500 text-white';
                }
              };
              
              return (
                <div key={suggestion.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-blue-800">{suggestion.title}</h4>
                    <Badge className={`text-xs ${getBadgeColor(suggestion.sector)}`}>{suggestion.sector}</Badge>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">{suggestion.description}</p>
                  <div className="space-y-2 text-sm">
                    <div><strong>Actions:</strong> {suggestion.actions.join(', ')}</div>
                    <div><strong>Impact:</strong> {suggestion.impact}</div>
                    <div><strong>Cost:</strong> {suggestion.cost}</div>
                    <div className="text-xs italic text-blue-600">{suggestion.reasoning}</div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Asset-Based Suggestions */}
      {suggestions.assetBased.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <DollarSign className="w-5 h-5" />
              Asset Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.assetBased.map((suggestion, index) => (
              <div key={suggestion.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-green-800">{suggestion.title}</h4>
                  <Badge className="text-xs bg-green-500">{suggestion.asset}</Badge>
                </div>
                <p className="text-sm text-green-700 mb-3">{suggestion.description}</p>
                <div className="space-y-2 text-sm">
                  <div><strong>Actions:</strong> {suggestion.actions.join(', ')}</div>
                  <div><strong>Impact:</strong> {suggestion.impact}</div>
                  <div><strong>Cost:</strong> {suggestion.cost}</div>
                  <div className="text-xs italic text-green-600">{suggestion.reasoning}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Strategic Planning */}
      {suggestions.strategic.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <TrendingUp className="w-5 h-5" />
              Strategic Planning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.strategic.map((suggestion, index) => (
              <div key={suggestion.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <h4 className="font-semibold text-purple-800 mb-2">{suggestion.title}</h4>
                <p className="text-sm text-purple-700 mb-3">{suggestion.description}</p>
                <div className="space-y-2 text-sm">
                  <div><strong>Actions:</strong> {suggestion.actions.join(', ')}</div>
                  <div><strong>Impact:</strong> {suggestion.impact}</div>
                  <div><strong>Cost:</strong> {suggestion.cost}</div>
                  {suggestion.timeline && <div><strong>Timeline:</strong> {suggestion.timeline}</div>}
                  <div className="text-xs italic text-purple-600">{suggestion.reasoning}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No suggestions fallback */}
      {totalSuggestions === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
            <p className="text-green-600 font-medium mb-2">Team Strategy Optimized!</p>
            <p className="text-sm text-gray-600">Your team composition looks good for your current business setup.</p>
            <p className="text-xs text-gray-500 mt-2">Suggestions will appear as you expand into new sectors or face operational challenges.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const StrategyHubSection: React.FC = () => {
  const { playerStats, financialData, updatePlayerStats, updateFinancialData, addGameEvent, currentWeek } = useWealthSprintGame();
  const { teamMembers, removeTeamMember } = useTeamManagement();
  const [selectedCategory, setSelectedCategory] = useState<string>('Team Suggestions');
  
  const availableScenarios = getTeamScenarios(teamMembers);
  const [pendingDecisions, setPendingDecisions] = useState<TeamScenario[]>(availableScenarios.slice(0, 3));

  // Strategy categories for horizontal navigation
  const categories = ['Team Suggestions', 'Meeting Room', 'Risk Analysis'];
  
  const categoryIcons: Record<string, React.ReactNode> = {
    'Team Suggestions': <Users className="w-4 h-4" />,
    'Meeting Room': <Target className="w-4 h-4" />,
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
        {selectedCategory === 'Team Suggestions' && (
          <div className="space-y-4">
            <TeamSuggestionsView />
          </div>
        )}

        {selectedCategory === 'Meeting Room' && (
          <div className="space-y-4">
            <MeetingRoomView />
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