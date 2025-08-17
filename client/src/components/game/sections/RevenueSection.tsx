import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity, 
  Target,
  Calendar,
  DollarSign,
  Briefcase,
  Home,
  CreditCard,
  Zap,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Heart,
  Brain,
  Scale
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const RevenueSection: React.FC = () => {
  const { playerStats, financialData, currentWeek } = useWealthSprintGame();
  const [selectedCategory, setSelectedCategory] = useState('Overview');

  // Categories for the horizontal menu
  const categories = ['Overview', 'Income Streams', 'Investments', 'Expenses', 'Growth Trends', 'Emotions'];

  // Category icons mapping
  const categoryIcons: Record<string, JSX.Element> = {
    'Overview': <BarChart3 className="w-4 h-4" />,
    'Income Streams': <DollarSign className="w-4 h-4" />,
    'Investments': <TrendingUp className="w-4 h-4" />,
    'Expenses': <CreditCard className="w-4 h-4" />,
    'Growth Trends': <Activity className="w-4 h-4" />,
    'Emotions': <Heart className="w-4 h-4" />
  };

  // Generate 5-year revenue data based on current game state
  const generate5YearData = () => {
    const data = [];
    const { timeEngine } = useWealthSprintGame.getState();
    const currentGameYear = timeEngine.currentGameYear;
    
    for (let i = 0; i < 5; i++) {
      const yearNumber = i + 1;
      const yearLabel = `${yearNumber} year${yearNumber > 1 ? 's' : ''}`;
      
      // Only show actual data for years the player has reached
      if (yearNumber <= currentGameYear) {
        const baseIncome = financialData.mainIncome * 12;
        const growth = Math.pow(1.12, i); // 12% annual growth
        const logicBonus = (playerStats.logic / 100) * 0.05; // Logic impacts growth
        const reputationBonus = (playerStats.reputation / 100) * 0.03; // Reputation impacts income
        
        const totalIncome = Math.round(baseIncome * growth * (1 + logicBonus + reputationBonus));
        const passiveIncome = 0 * 12 * growth; // Simplified for now
        const businessIncome = Math.round(totalIncome * 0.3 * growth);
        const investmentReturns = Math.round(financialData.investments.stocks * 0.08 * growth);
        const totalExpenses = Math.round(financialData.monthlyExpenses * 12 * Math.pow(1.06, i)); // 6% expense growth
        
        data.push({
          year: yearLabel,
          totalIncome,
          salaryIncome: Math.round(totalIncome * 0.6),
          passiveIncome: Math.round(passiveIncome),
          businessIncome,
          investmentReturns,
          totalExpenses,
          netProfit: totalIncome + passiveIncome + businessIncome + investmentReturns - totalExpenses,
          expenses: {
            living: Math.round(totalExpenses * 0.4),
            entertainment: Math.round(totalExpenses * 0.2),
            taxes: Math.round(totalExpenses * 0.25),
            investments: Math.round(totalExpenses * 0.15)
          }
        });
      } else {
        // Show 0 data for future years
        data.push({
          year: yearLabel,
          totalIncome: 0,
          salaryIncome: 0,
          passiveIncome: 0,
          businessIncome: 0,
          investmentReturns: 0,
          totalExpenses: 0,
          netProfit: 0,
          expenses: {
            living: 0,
            entertainment: 0,
            taxes: 0,
            investments: 0
          }
        });
      }
    }
    
    return data;
  };

  const fiveYearData = generate5YearData();

  // Generate 5-year emotion data based on current game state
  const generate5YearEmotionData = () => {
    const data = [];
    const { timeEngine } = useWealthSprintGame.getState();
    const currentGameYear = timeEngine.currentGameYear;
    
    for (let i = 0; i < 5; i++) {
      const yearNumber = i + 1;
      const yearLabel = `${yearNumber} year${yearNumber > 1 ? 's' : ''}`;
      
      // Only show actual data for years the player has reached
      if (yearNumber <= currentGameYear) {
        // Base progression with some fluctuation
        const emotionTrend = Math.max(0, Math.min(100, playerStats.emotion + (i * 2) + Math.random() * 10 - 5));
        const logicTrend = Math.max(0, Math.min(100, playerStats.logic + (i * 3) + Math.random() * 8 - 4));
        const karmaTrend = Math.max(0, Math.min(100, playerStats.karma + (i * 1.5) + Math.random() * 6 - 3));
        
        data.push({
          year: yearLabel,
          emotion: Math.round(emotionTrend),
          logic: Math.round(logicTrend),
          karma: Math.round(karmaTrend)
        });
      } else {
        // Show 0 data for future years
        data.push({
          year: yearLabel,
          emotion: 0,
          logic: 0,
          karma: 0
        });
      }
    }
    
    return data;
  };

  const fiveYearEmotionData = generate5YearEmotionData();

  // Color scheme inspired by banking, store, and stock market sections
  const colors = {
    primary: '#3b82f6', // Blue from banking
    secondary: '#10b981', // Green for growth
    accent: '#f59e0b', // Gold/amber
    danger: '#ef4444', // Red for expenses
    purple: '#8b5cf6', // Purple for investments
    teal: '#14b8a6' // Teal for passive income
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  // Get category colors for navigation - Updated to blue and white theme
  const getCategoryColors = (category: string, isSelected: boolean) => {
    const baseColors: Record<string, string> = {
      'Overview': isSelected ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700',
      'Income Streams': isSelected ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700',
      'Investments': isSelected ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700',
      'Expenses': isSelected ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700',
      'Growth Trends': isSelected ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700',
      'Emotions': isSelected ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
    };
    return baseColors[category] || 'bg-blue-600 text-white';
  };

  // Calculate key metrics
  const totalProjectedIncome = fiveYearData.reduce((sum, year) => sum + year.totalIncome, 0);
  const totalProjectedProfit = fiveYearData.reduce((sum, year) => sum + year.netProfit, 0);
  const averageGrowthRate = ((fiveYearData[4].totalIncome / fiveYearData[0].totalIncome) ** (1/4) - 1) * 100;

  const renderOverviewContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-800">5-Year Revenue</span>
          </div>
          <div className="text-xl font-bold text-green-700">{formatCurrency(totalProjectedIncome)}</div>
          <div className="text-xs text-green-600">Total Projected</div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Net Profit</span>
          </div>
          <div className="text-xl font-bold text-blue-700">{formatCurrency(totalProjectedProfit)}</div>
          <div className="text-xs text-blue-600">After Expenses</div>
        </div>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          5-Year Financial Performance
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={fiveYearData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Area type="monotone" dataKey="totalIncome" stackId="1" stroke={colors.primary} fill={colors.primary} fillOpacity={0.6} />
            <Area type="monotone" dataKey="passiveIncome" stackId="1" stroke={colors.teal} fill={colors.teal} fillOpacity={0.6} />
            <Area type="monotone" dataKey="businessIncome" stackId="1" stroke={colors.secondary} fill={colors.secondary} fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <h4 className="font-semibold text-amber-800 mb-2">Growth Analytics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-amber-600">Average Growth Rate</div>
            <div className="text-lg font-bold text-amber-700">{averageGrowthRate.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-amber-600">Break-even Year</div>
            <div className="text-lg font-bold text-amber-700">Year 2</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          How to Improve Revenue
        </h4>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            Increase Logic stat to boost income growth potential by up to 5%
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            Build Reputation to attract better business opportunities
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            Purchase passive income assets from the Store section
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            Invest in stocks and bonds for compound growth
          </li>
        </ul>
      </div>
    </div>
  );

  const renderIncomeStreamsContent = () => {
    const incomeData = fiveYearData.map(year => ({
      year: year.year,
      salary: year.salaryIncome,
      passive: year.passiveIncome,
      business: year.businessIncome,
      investments: year.investmentReturns
    }));

    return (
      <div className="space-y-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Income Stream Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="salary" stackId="a" fill={colors.primary} />
              <Bar dataKey="passive" stackId="a" fill={colors.teal} />
              <Bar dataKey="business" stackId="a" fill={colors.secondary} />
              <Bar dataKey="investments" stackId="a" fill={colors.purple} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-3 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600">Primary Salary</div>
            <div className="text-lg font-bold text-blue-700">{formatCurrency(fiveYearData[0].salaryIncome)}</div>
            <div className="text-xs text-blue-600">Current Year</div>
          </div>
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-lg border border-teal-200">
            <div className="text-sm text-teal-600">Passive Income</div>
            <div className="text-lg font-bold text-teal-700">{formatCurrency(fiveYearData[0].passiveIncome)}</div>
            <div className="text-xs text-teal-600">From Assets</div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Income Optimization Tips
          </h4>
          <ul className="space-y-2 text-sm text-green-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              Focus on building passive income streams for financial independence
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              Diversify income sources to reduce dependency on salary
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              Invest in business sectors to generate recurring revenue
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              Reinvest profits to accelerate income growth
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const renderInvestmentsContent = () => {
    const investmentData = [
      { name: 'Stocks', value: financialData.investments.stocks, color: colors.secondary },
      { name: 'Bonds', value: financialData.investments.bonds, color: colors.purple },
      { name: 'Real Estate', value: 250000, color: colors.accent },
      { name: 'Business', value: 150000, color: colors.primary }
    ];

    return (
      <div className="space-y-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Investment Portfolio Allocation
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={investmentData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {investmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {investmentData.map((item, index) => (
            <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">{item.name}</div>
              <div className="text-lg font-bold" style={{ color: item.color }}>
                {formatCurrency(item.value)}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Investment Strategy Tips
          </h4>
          <ul className="space-y-2 text-sm text-purple-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              Maintain a balanced portfolio with 60% stocks, 30% bonds, 10% alternatives
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              Rebalance portfolio quarterly to maintain target allocation
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              Consider real estate investments for inflation protection
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              Dollar-cost average into markets during volatility
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const renderExpensesContent = () => {
    const expenseData = fiveYearData.map(year => ({
      year: year.year,
      living: year.expenses.living,
      entertainment: year.expenses.entertainment,
      taxes: year.expenses.taxes,
      investments: year.expenses.investments
    }));

    return (
      <div className="space-y-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-red-600" />
            Expense Breakdown Over 5 Years
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Area type="monotone" dataKey="living" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              <Area type="monotone" dataKey="entertainment" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              <Area type="monotone" dataKey="taxes" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="investments" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-red-50 to-rose-50 p-3 rounded-lg border border-red-200">
            <div className="text-sm text-red-600">Living Expenses</div>
            <div className="text-lg font-bold text-red-700">{formatCurrency(fiveYearData[0].expenses.living)}</div>
            <div className="text-xs text-red-600">40% of total</div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-lg border border-amber-200">
            <div className="text-sm text-amber-600">Entertainment</div>
            <div className="text-lg font-bold text-amber-700">{formatCurrency(fiveYearData[0].expenses.entertainment)}</div>
            <div className="text-xs text-amber-600">20% of total</div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Expense Optimization Strategies
          </h4>
          <ul className="space-y-2 text-sm text-red-700">
            <li className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              Track all expenses using the 50/30/20 rule (needs/wants/savings)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              Reduce lifestyle inflation as income grows
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              Negotiate better rates for recurring services annually
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              Use tax-advantaged accounts to reduce tax burden
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const renderGrowthTrendsContent = () => {
    const growthData = fiveYearData.map((year, index) => ({
      year: year.year,
      incomeGrowth: index === 0 ? 0 : ((year.totalIncome - fiveYearData[0].totalIncome) / fiveYearData[0].totalIncome) * 100,
      netWorthGrowth: index === 0 ? 0 : ((year.netProfit - fiveYearData[0].netProfit) / Math.abs(fiveYearData[0].netProfit || 1)) * 100,
      expenseGrowth: index === 0 ? 0 : ((year.totalExpenses - fiveYearData[0].totalExpenses) / fiveYearData[0].totalExpenses) * 100
    }));

    return (
      <div className="space-y-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-600" />
            Growth Rate Trends (%)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              <Line type="monotone" dataKey="incomeGrowth" stroke={colors.secondary} strokeWidth={3} />
              <Line type="monotone" dataKey="netWorthGrowth" stroke={colors.primary} strokeWidth={3} />
              <Line type="monotone" dataKey="expenseGrowth" stroke={colors.danger} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
            <div className="text-sm text-green-600">Target Growth Rate</div>
            <div className="text-lg font-bold text-green-700">12.0%</div>
            <div className="text-xs text-green-600">Annual Target</div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-3 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600">Current Rate</div>
            <div className="text-lg font-bold text-blue-700">{averageGrowthRate.toFixed(1)}%</div>
            <div className="text-xs text-blue-600">5-Year Average</div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Growth Acceleration Tips
          </h4>
          <ul className="space-y-2 text-sm text-amber-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              Focus on high-growth assets and income streams
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              Reinvest profits rather than increasing lifestyle expenses
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              Develop skills that directly impact income potential
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              Review and optimize strategy quarterly based on performance
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const renderEmotionsContent = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-lg border border-pink-200">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <span className="text-sm font-semibold text-pink-800">Emotion</span>
            </div>
            <div className="text-xl font-bold text-pink-700">{playerStats.emotion}</div>
            <div className="text-xs text-pink-600">Current Level</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Logic</span>
            </div>
            <div className="text-xl font-bold text-blue-700">{playerStats.logic}</div>
            <div className="text-xs text-blue-600">Current Level</div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Karma</span>
            </div>
            <div className="text-xl font-bold text-green-700">{playerStats.karma}</div>
            <div className="text-xs text-green-600">Current Level</div>
          </div>
        </div>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-600" />
            Emotional Stats History
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={fiveYearEmotionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="emotion" stroke="#ec4899" strokeWidth={3} name="Emotion" />
              <Line type="monotone" dataKey="logic" stroke="#3b82f6" strokeWidth={3} name="Logic" />
              <Line type="monotone" dataKey="karma" stroke="#10b981" strokeWidth={3} name="Karma" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
          <h4 className="font-semibold text-pink-800 mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Emotional Balance Tips
          </h4>
          <ul className="space-y-2 text-sm text-pink-700">
            <li className="flex items-start gap-2">
              <span className="text-pink-500">•</span>
              Maintain work-life balance to improve emotional stability
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-500">•</span>
              Make logical decisions during high-stress periods
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-500">•</span>
              Build karma through positive business relationships
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-500">•</span>
              Track emotional patterns to identify improvement areas
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'Overview': return renderOverviewContent();
      case 'Income Streams': return renderIncomeStreamsContent();
      case 'Investments': return renderInvestmentsContent();
      case 'Expenses': return renderExpensesContent();
      case 'Growth Trends': return renderGrowthTrendsContent();
      case 'Emotions': return renderEmotionsContent();
      default: return renderOverviewContent();
    }
  };

  return (
    <div className="space-y-4">
      {/* 5-Year Revenue Header - Full Width Blue Design */}
      <div className="mx-2">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          {/* Main Header Row */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">5-Year Revenue Analytics</h2>
                  <p className="text-blue-200 text-sm">Comprehensive financial performance projection</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-200">Total Projection</div>
                <div className="text-lg font-bold">{formatCurrency(totalProjectedIncome)}</div>
              </div>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-4 gap-4 px-4 pb-4">
            <div>
              <p className="text-blue-200 text-xs">Avg Growth</p>
              <p className="text-sm font-bold">{averageGrowthRate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Net Profit</p>
              <p className="text-sm font-bold">{formatCurrency(totalProjectedProfit)}</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">ROI Potential</p>
              <p className="text-sm font-bold">385%</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Years Tracked</p>
              <p className="text-sm font-bold">5</p>
            </div>
          </div>
          
          {/* Category Navigation - Attached to Header Background */}
          <div className="overflow-x-auto px-4 pb-4">
            <div className="flex gap-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shadow-md ${
                    getCategoryColors(category, selectedCategory === category)
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
      <div className="px-4">
        {renderCategoryContent()}
      </div>
    </div>
  );
};

export default RevenueSection;