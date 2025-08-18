import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { useTeamManagement } from '../../../lib/stores/useTeamManagement';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  Activity, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Target, 
  Users, 
  DollarSign, 
  Brain,
  Heart,
  Scale,
  Zap,
  Trophy,
  Calendar,
  Star,
  Briefcase,
  PieChart,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Area, AreaChart } from 'recharts';
import { formatMoney } from '../../../lib/utils/formatMoney';

const PerformanceAnalyticsSection: React.FC = () => {
  const { 
    playerStats, 
    financialData, 
    currentWeek, 
    currentDay, 
    timeEngine 
  } = useWealthSprintGame();
  
  const { teamMembers } = useTeamManagement();
  const [selectedCategory, setSelectedCategory] = useState('Overall');

  // Horizontal menu categories
  const categories = [
    'Overall', 
    'Financial', 
    'Team', 
    'Skills', 
    'Performance', 
    'Goals'
  ];

  // Category icons mapping
  const categoryIcons: Record<string, JSX.Element> = {
    'Overall': <BarChart3 className="w-4 h-4" />,
    'Financial': <DollarSign className="w-4 h-4" />,
    'Team': <Users className="w-4 h-4" />,
    'Skills': <Brain className="w-4 h-4" />,
    'Performance': <Activity className="w-4 h-4" />,
    'Goals': <Target className="w-4 h-4" />
  };

  // Get category colors for blue theme
  const getCategoryColors = (category: string, isSelected: boolean) => {
    return {
      bg: isSelected 
        ? 'bg-white text-blue-800 shadow-md border-blue-200' 
        : 'bg-blue-600/10 text-white hover:bg-blue-600/20 border-blue-400/30',
      border: isSelected ? 'border-blue-200' : 'border-blue-400/30'
    };
  };

  // Generate performance data
  const generatePerformanceData = () => {
    const weeks = [];
    for (let i = Math.max(1, currentWeek - 11); i <= currentWeek; i++) {
      weeks.push({
        week: `W${i}`,
        netWorth: financialData.netWorth * (0.8 + Math.random() * 0.4) * (i / currentWeek),
        income: (financialData.mainIncome + financialData.sideIncome) * (0.9 + Math.random() * 0.2),
        expenses: financialData.monthlyExpenses * (0.8 + Math.random() * 0.4),
        logic: Math.max(0, Math.min(100, playerStats.logic + (Math.random() - 0.5) * 10)),
        emotion: Math.max(0, Math.min(100, playerStats.emotion + (Math.random() - 0.5) * 10)),
        karma: Math.max(0, Math.min(100, playerStats.karma + (Math.random() - 0.5) * 10))
      });
    }
    return weeks;
  };

  const performanceData = generatePerformanceData();

  // Skills breakdown data
  const skillsData = [
    { name: 'Logic', value: playerStats.logic, color: '#3B82F6' },
    { name: 'Emotion', value: playerStats.emotion, color: '#EF4444' },
    { name: 'Karma', value: playerStats.karma, color: '#10B981' },
    { name: 'Reputation', value: playerStats.reputation, color: '#8B5CF6' },
    { name: 'Energy', value: playerStats.energy, color: '#F59E0B' },
    { name: 'Stress', value: 100 - playerStats.stress, color: '#06B6D4' }
  ];

  // Financial breakdown data
  const financialBreakdownData = [
    { name: 'Bank Balance', value: financialData.bankBalance, color: '#3B82F6' },
    { name: 'Stocks', value: financialData.investments.stocks, color: '#10B981' },
    { name: 'Bonds', value: financialData.investments.bonds, color: '#8B5CF6' },
    { name: 'FD', value: financialData.investments.fd, color: '#F59E0B' },
    { name: 'Real Estate', value: financialData.investments.realEstate, color: '#EF4444' }
  ];

  // Team performance data
  const teamPerformanceData = teamMembers.map((member: any) => ({
    name: member.name,
    performance: member.performance || 85,
    satisfaction: member.loyalty || 80,
    contribution: member.experience || 50
  }));

  // Key metrics calculations
  const monthlyIncome = financialData.mainIncome + financialData.sideIncome;
  const monthlyExpenses = financialData.monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
  const investmentRatio = financialData.netWorth > 0 ? 
    ((financialData.investments.stocks + financialData.investments.bonds + financialData.investments.fd) / financialData.netWorth) * 100 : 0;
  
  const avgTeamPerformance = teamMembers.length > 0 ? 
    teamMembers.reduce((sum: number, member: any) => sum + (member.performance || 85), 0) / teamMembers.length : 0;
  
  const skillsAverage = (playerStats.logic + playerStats.emotion + playerStats.karma + playerStats.reputation) / 4;

  const renderContent = () => {
    switch (selectedCategory) {
      case 'Overall':
        return (
          <div className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Net Worth</p>
                      <p className="text-2xl font-bold text-blue-900">{formatMoney(financialData.netWorth)}</p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-full">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Monthly Income</p>
                      <p className="text-2xl font-bold text-emerald-900">{formatMoney(monthlyIncome)}</p>
                    </div>
                    <div className="p-3 bg-emerald-500 rounded-full">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Team Size</p>
                      <p className="text-2xl font-bold text-purple-900">{teamMembers.length}</p>
                    </div>
                    <div className="p-3 bg-purple-500 rounded-full">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">Game Week</p>
                      <p className="text-2xl font-bold text-orange-900">W{currentWeek}</p>
                    </div>
                    <div className="p-3 bg-orange-500 rounded-full">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Trends */}
            <Card className="bg-white border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Trends (Last 12 Weeks)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="week" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Line type="monotone" dataKey="netWorth" stroke="#3B82F6" strokeWidth={3} name="Net Worth" />
                    <Line type="monotone" dataKey="logic" stroke="#10B981" strokeWidth={2} name="Logic" />
                    <Line type="monotone" dataKey="emotion" stroke="#EF4444" strokeWidth={2} name="Emotion" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Key Ratios
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Savings Rate</span>
                    <div className="flex items-center gap-2">
                      <Progress value={Math.max(0, savingsRate)} className="w-24" />
                      <span className="text-sm font-semibold text-blue-600">{savingsRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Investment Ratio</span>
                    <div className="flex items-center gap-2">
                      <Progress value={investmentRatio} className="w-24" />
                      <span className="text-sm font-semibold text-blue-600">{investmentRatio.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Skills Average</span>
                    <div className="flex items-center gap-2">
                      <Progress value={skillsAverage} className="w-24" />
                      <span className="text-sm font-semibold text-blue-600">{skillsAverage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Team Performance</span>
                    <div className="flex items-center gap-2">
                      <Progress value={avgTeamPerformance} className="w-24" />
                      <span className="text-sm font-semibold text-blue-600">{avgTeamPerformance.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Wealth Builder</p>
                      <p className="text-xs text-gray-500">Reached ₹{Math.floor(financialData.netWorth / 100000)}L+ net worth</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Team Leader</p>
                      <p className="text-xs text-gray-500">Managing {teamMembers.length} team members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Star className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Strategic Thinker</p>
                      <p className="text-xs text-gray-500">Logic skill at {playerStats.logic}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Calendar className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Experienced Player</p>
                      <p className="text-xs text-gray-500">Week {currentWeek} of your journey</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'Financial':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Asset Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={financialBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {financialBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatMoney(value)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {financialBreakdownData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold">{formatMoney(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Income vs Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      { name: 'Main Income', value: financialData.mainIncome, color: '#10B981' },
                      { name: 'Side Income', value: financialData.sideIncome, color: '#3B82F6' },
                      { name: 'Expenses', value: -financialData.monthlyExpenses, color: '#EF4444' }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip formatter={(value: number) => formatMoney(Math.abs(value))} />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'Skills':
        return (
          <div className="space-y-6">
            <Card className="bg-white border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Skills Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={skillsData}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="#3B82F6" />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {skillsData.map((skill, index) => (
                    <div key={index} className="text-center">
                      <div className="mb-2">
                        <div className="text-2xl font-bold" style={{ color: skill.color }}>
                          {skill.value}%
                        </div>
                        <div className="text-sm text-gray-600">{skill.name}</div>
                      </div>
                      <Progress value={skill.value} className="w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'Team':
        return (
          <div className="space-y-6">
            <Card className="bg-white border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {teamMembers.length > 0 ? (
                  <div className="space-y-4">
                    {teamPerformanceData.map((member, index) => (
                      <div key={index} className="p-4 border border-blue-100 rounded-lg bg-blue-50/30">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-gray-800">{member.name}</h4>
                          <Badge className="bg-blue-100 text-blue-800">
                            {member.performance.toFixed(1)}% Performance
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Performance</p>
                            <Progress value={member.performance} className="w-full" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Satisfaction</p>
                            <Progress value={member.satisfaction} className="w-full" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Contribution</p>
                            <Progress value={member.contribution} className="w-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No team members yet. Start building your team!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Select a category to view analytics</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Performance Analytics</h1>
            <p className="text-blue-100 text-sm lg:text-base opacity-90">
              Comprehensive insights into your wealth sprint journey
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">Week {currentWeek}, Day {currentDay}</div>
            <div className="text-sm text-blue-200">Game Year {timeEngine.currentGameYear}</div>
          </div>
        </div>
      </div>

      {/* Horizontal Menu */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mb-6 p-2 shadow-lg">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const colors = getCategoryColors(category, selectedCategory === category);
            return (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant="ghost"
                className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all duration-200 ${colors.bg} ${colors.border}`}
              >
                {categoryIcons[category]}
                <span className="text-sm font-medium">{category}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default PerformanceAnalyticsSection;