import React from 'react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Chart } from '../ui/chart';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Heart,
  Brain,
  Scale,
  AlertTriangle,
  Star,
  Battery
} from 'lucide-react';

const RevenueOverview: React.FC = () => {
  const { playerStats, financialData, currentWeek } = useWealthSprintGame();

  // Generate 5-year historical data (simulated based on current state)
  const generateHistoricalData = () => {
    const years = 5;
    const currentYear = new Date().getFullYear();
    const data = [];

    for (let i = years - 1; i >= 0; i--) {
      const year = currentYear - i;
      const baseIncome = financialData.mainIncome * 12;
      const growthFactor = Math.pow(1.1, years - 1 - i); // 10% annual growth assumption
      
      data.push({
        year: year.toString(),
        totalIncome: Math.round(baseIncome * growthFactor),
        investments: Math.round(baseIncome * growthFactor * 0.3),
        expenses: Math.round(financialData.monthlyExpenses * 12 * growthFactor * 0.9),
        netWorth: Math.round(financialData.netWorth * growthFactor),
      });
    }

    return data;
  };

  const historicalData = generateHistoricalData();

  // Calculate portfolio performance
  const portfolioValue = 0; // Simplified for now

  const bondValue = financialData.investments.bonds;

  // Chart data for revenue trends
  const revenueChartData = {
    labels: historicalData.map(d => d.year),
    datasets: [
      {
        label: 'Total Income',
        data: historicalData.map(d => d.totalIncome),
        borderColor: '#d4af37',
        backgroundColor: '#d4af37',
        tension: 0.4,
      },
      {
        label: 'Investment Returns',
        data: historicalData.map(d => d.investments),
        borderColor: '#10b981',
        backgroundColor: '#10b981',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: historicalData.map(d => d.expenses),
        borderColor: '#ef4444',
        backgroundColor: '#ef4444',
        tension: 0.4,
      }
    ]
  };

  // Asset allocation pie chart
  const assetAllocationData = {
    labels: ['Stocks', 'Bonds', 'Cash', 'Other Assets'],
    datasets: [
      {
        data: [
          financialData.investments.stocks,
          financialData.investments.bonds,
          financialData.bankBalance,
          financialData.investments.realEstate + financialData.investments.fd
        ],
        backgroundColor: ['#d4af37', '#10b981', '#3b82f6', '#8b5cf6'],
        borderWidth: 0,
      }
    ]
  };

  // Emotional stats history (simulated)
  const emotionalHistoryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Emotion',
        data: [45, 52, 48, 61, 58, playerStats.emotion],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Logic',
        data: [40, 45, 55, 62, 65, playerStats.logic],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Karma',
        data: [50, 48, 55, 58, 60, playerStats.karma],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return `₹${amount.toLocaleString()}`;
  };

  const currentYearProjection = {
    income: financialData.mainIncome * 12 + financialData.sideIncome * 12,
    expenses: financialData.monthlyExpenses * 12,
    savings: (financialData.mainIncome + financialData.sideIncome - financialData.monthlyExpenses) * 12,
    investmentReturns: portfolioValue * 0.12 + bondValue * 0.08, // Assumed annual returns
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#3a3a3a]">5-Year Revenue Overview</h1>
        <Badge className="bg-[#d4af37] text-white">
          Week {currentWeek} Analysis
        </Badge>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <div className="text-sm text-green-600">Current Year Income</div>
                <div className="text-xl font-bold text-green-800">
                  {formatCurrency(currentYearProjection.income)}
                </div>
                <div className="text-xs text-green-600">Projected Annual</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <PieChart className="text-blue-600" size={24} />
              </div>
              <div>
                <div className="text-sm text-blue-600">Investment Returns</div>
                <div className="text-xl font-bold text-blue-800">
                  {formatCurrency(currentYearProjection.investmentReturns)}
                </div>
                <div className="text-xs text-blue-600">Expected This Year</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="text-purple-600" size={24} />
              </div>
              <div>
                <div className="text-sm text-purple-600">Net Savings</div>
                <div className="text-xl font-bold text-purple-800">
                  {formatCurrency(currentYearProjection.savings)}
                </div>
                <div className="text-xs text-purple-600">Annual Projection</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <DollarSign className="text-yellow-600" size={24} />
              </div>
              <div>
                <div className="text-sm text-yellow-600">Net Worth</div>
                <div className="text-xl font-bold text-yellow-800">
                  {formatCurrency(financialData.netWorth)}
                </div>
                <div className="text-xs text-yellow-600">Current Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} />
            5-Year Financial Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Chart type="line" data={revenueChartData} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart size={20} />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Chart type="doughnut" data={assetAllocationData} />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stocks Portfolio:</span>
                <span className="font-semibold">{formatCurrency(portfolioValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bonds Investment:</span>
                <span className="font-semibold">{formatCurrency(bondValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Cash Balance:</span>
                <span className="font-semibold">{formatCurrency(financialData.bankBalance)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emotional Intelligence History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart size={20} />
              Emotional Stats History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Chart type="line" data={emotionalHistoryData} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="text-center">
                <Heart size={16} className="mx-auto text-red-500 mb-1" />
                <div className="text-xs text-gray-600">Emotion</div>
                <div className="font-semibold">{playerStats.emotion}</div>
              </div>
              <div className="text-center">
                <Brain size={16} className="mx-auto text-blue-500 mb-1" />
                <div className="text-xs text-gray-600">Logic</div>
                <div className="font-semibold">{playerStats.logic}</div>
              </div>
              <div className="text-center">
                <Scale size={16} className="mx-auto text-green-500 mb-1" />
                <div className="text-xs text-gray-600">Karma</div>
                <div className="font-semibold">{playerStats.karma}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={20} />
            Financial Independence Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Monthly Passive Income Goal</span>
                <span className="text-sm">
                  {formatCurrency(financialData.sideIncome)} / {formatCurrency(financialData.monthlyExpenses)}
                </span>
              </div>
              <Progress value={Math.min(100, (financialData.sideIncome / financialData.monthlyExpenses) * 100)} />
              <div className="text-xs text-gray-500 mt-1">
                {financialData.sideIncome >= financialData.monthlyExpenses 
                  ? '🎉 Congratulations! You have achieved Financial Independence!' 
                  : `Need ₹${(financialData.monthlyExpenses - financialData.sideIncome).toLocaleString()} more in passive income`}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 mb-2">Emergency Fund</div>
                <div className="text-lg font-bold text-blue-800">
                  {formatCurrency(Math.min(financialData.bankBalance, financialData.monthlyExpenses * 6))}
                </div>
                <div className="text-xs text-blue-600">
                  Goal: {formatCurrency(financialData.monthlyExpenses * 6)} (6 months)
                </div>
                <Progress 
                  value={Math.min(100, (financialData.bankBalance / (financialData.monthlyExpenses * 6)) * 100)} 
                  className="mt-2"
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 mb-2">Investment Portfolio</div>
                <div className="text-lg font-bold text-green-800">
                  {formatCurrency(portfolioValue + bondValue)}
                </div>
                <div className="text-xs text-green-600">
                  Target: {formatCurrency(financialData.netWorth * 0.6)} (60% of net worth)
                </div>
                <Progress 
                  value={Math.min(100, ((portfolioValue + bondValue) / (financialData.netWorth * 0.6)) * 100)} 
                  className="mt-2"
                />
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 mb-2">Wealth Milestone</div>
                <div className="text-lg font-bold text-purple-800">
                  {formatCurrency(financialData.netWorth)}
                </div>
                <div className="text-xs text-purple-600">
                  Next: {formatCurrency(10000000)} (₹1 Crore)
                </div>
                <Progress 
                  value={Math.min(100, (financialData.netWorth / 10000000) * 100)} 
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueOverview;