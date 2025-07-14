import React from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  BarChart3,
  PieChart,
  Activity,
  Calendar
} from 'lucide-react';

const RevenueSection: React.FC = () => {
  const { playerStats, financialData, currentWeek, currentDay } = useWealthSprintGame();

  // Calculate mock 5-year data based on current stats
  const calculateYearlyData = () => {
    const years = [];
    const baseNetWorth = financialData.netWorth || 500000;
    const baseIncome = financialData.mainIncome || 80000;
    
    for (let year = 1; year <= 5; year++) {
      const growthRate = (playerStats.logic + playerStats.reputation) / 200; // 0-1 based on stats
      const yearlyGrowth = 0.1 + (growthRate * 0.15); // 10-25% growth based on stats
      const emotionalImpact = (playerStats.emotion - 50) / 100; // -0.5 to 0.5
      const stressImpact = (50 - playerStats.stress) / 100; // -0.5 to 0.5
      
      const adjustedGrowth = yearlyGrowth + emotionalImpact * 0.05 + stressImpact * 0.03;
      
      const revenue = baseIncome * Math.pow(1 + adjustedGrowth, year);
      const expenses = revenue * (0.6 - (playerStats.logic / 1000)); // Lower expenses with higher logic
      const profit = revenue - expenses;
      const netWorth = baseNetWorth * Math.pow(1 + adjustedGrowth, year);
      
      years.push({
        year: new Date().getFullYear() + year - 1,
        revenue: Math.round(revenue),
        expenses: Math.round(expenses),
        profit: Math.round(profit),
        netWorth: Math.round(netWorth),
        roi: Math.round(((profit / expenses) * 100) * 10) / 10
      });
    }
    
    return years;
  };

  const yearlyData = calculateYearlyData();
  const totalInvestment = yearlyData.reduce((sum, year) => sum + year.expenses, 0);
  const totalProfit = yearlyData.reduce((sum, year) => sum + year.profit, 0);
  const totalROI = ((totalProfit / totalInvestment) * 100);
  const averageROI = yearlyData.reduce((sum, year) => sum + year.roi, 0) / yearlyData.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 20) return 'text-green-600';
    if (value >= 10) return 'text-yellow-600';
    if (value >= 0) return 'text-blue-600';
    return 'text-red-600';
  };

  const getEmotionalTrend = () => {
    const trend = playerStats.emotion - 50;
    if (trend > 10) return { icon: TrendingUp, color: 'text-green-600', text: 'Positive' };
    if (trend < -10) return { icon: TrendingDown, color: 'text-red-600', text: 'Negative' };
    return { icon: Activity, color: 'text-blue-600', text: 'Stable' };
  };

  const emotionalTrend = getEmotionalTrend();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">5-Year Revenue & Profit Details</h1>
          <p className="text-gray-600">Financial projections based on your current performance</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Week {currentWeek}, Day {currentDay}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Total Investment</p>
                <p className="text-xl font-bold text-green-900">
                  {formatCurrency(totalInvestment)}
                </p>
              </div>
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Profit</p>
                <p className="text-xl font-bold text-blue-900">
                  {formatCurrency(totalProfit)}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Average ROI</p>
                <p className={`text-xl font-bold ${getPerformanceColor(averageROI)}`}>
                  {averageROI.toFixed(1)}%
                </p>
              </div>
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Emotional Trend</p>
                <p className={`text-xl font-bold ${emotionalTrend.color}`}>
                  {emotionalTrend.text}
                </p>
              </div>
              <emotionalTrend.icon className={`w-6 h-6 ${emotionalTrend.color}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yearly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Yearly Financial Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Year</th>
                  <th className="text-right py-2">Revenue</th>
                  <th className="text-right py-2">Expenses</th>
                  <th className="text-right py-2">Profit</th>
                  <th className="text-right py-2">Net Worth</th>
                  <th className="text-right py-2">ROI</th>
                </tr>
              </thead>
              <tbody>
                {yearlyData.map((year, index) => (
                  <tr key={year.year} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{year.year}</td>
                    <td className="text-right py-3">{formatCurrency(year.revenue)}</td>
                    <td className="text-right py-3">{formatCurrency(year.expenses)}</td>
                    <td className={`text-right py-3 font-medium ${getPerformanceColor(year.profit)}`}>
                      {formatCurrency(year.profit)}
                    </td>
                    <td className="text-right py-3">{formatCurrency(year.netWorth)}</td>
                    <td className={`text-right py-3 font-medium ${getPerformanceColor(year.roi)}`}>
                      {year.roi}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Visual Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Emotional Balance Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{playerStats.emotion}</div>
                <div className="text-sm text-gray-600">Emotion</div>
                <Progress value={playerStats.emotion} className="h-2 mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{playerStats.logic}</div>
                <div className="text-sm text-gray-600">Logic</div>
                <Progress value={playerStats.logic} className="h-2 mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{playerStats.karma}</div>
                <div className="text-sm text-gray-600">Karma</div>
                <Progress value={playerStats.karma} className="h-2 mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{100 - playerStats.stress}</div>
                <div className="text-sm text-gray-600">Calm</div>
                <Progress value={100 - playerStats.stress} className="h-2 mt-2" />
              </div>
            </div>
            
            <div className="text-center py-4">
              <div className="text-sm text-gray-600 mb-2">Overall Performance Score</div>
              <div className="text-3xl font-bold text-green-600">
                {Math.round((playerStats.emotion + playerStats.logic + playerStats.karma + (100 - playerStats.stress)) / 4)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueSection;