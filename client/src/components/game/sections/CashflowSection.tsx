import React from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Chart } from '../../ui/chart';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

const CashflowSection: React.FC = () => {
  const { financialData } = useWealthSprintGame();

  const cashflowData = {
    labels: ['Income', 'Expenses', 'Net Cashflow'],
    datasets: [
      {
        label: 'Monthly Cashflow',
        data: [
          financialData.mainIncome + financialData.sideIncome,
          financialData.monthlyExpenses,
          financialData.cashflow || 0,
        ],
        backgroundColor: ['#10b981', '#ef4444', '#d4af37'],
        borderColor: ['#059669', '#dc2626', '#b8941f'],
        borderWidth: 1,
      },
    ],
  };

  const expenseBreakdown = {
    labels: ['Living Expenses', 'Business Costs', 'Investments', 'Taxes', 'Others'],
    datasets: [
      {
        data: [
          financialData.monthlyExpenses * 0.4,
          financialData.monthlyExpenses * 0.25,
          financialData.monthlyExpenses * 0.15,
          financialData.monthlyExpenses * 0.15,
          financialData.monthlyExpenses * 0.05,
        ],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold text-[#3a3a3a]">Cashflow Statement</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{(financialData.mainIncome + financialData.sideIncome).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              Main: ₹{financialData.mainIncome.toLocaleString()} | Side: ₹{financialData.sideIncome.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₹{financialData.monthlyExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              Monthly recurring expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cashflow</CardTitle>
            <DollarSign className={`h-4 w-4 ${(financialData.cashflow || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(financialData.cashflow || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{(financialData.cashflow || 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              {(financialData.cashflow || 0) >= 0 ? 'Positive cashflow' : 'Negative cashflow'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Monthly Cashflow Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Chart type="bar" data={cashflowData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart size={20} />
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Chart type="doughnut" data={expenseBreakdown} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Main Income (Job/Business)</span>
                <span className="font-semibold">₹{financialData.mainIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Side Income (Investments)</span>
                <span className="font-semibold">₹{financialData.sideIncome.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Monthly Income</span>
                  <span>₹{(financialData.mainIncome + financialData.sideIncome).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Health Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expense Ratio</span>
                <span className="font-semibold">
                  {((financialData.monthlyExpenses / (financialData.mainIncome + financialData.sideIncome)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Savings Rate</span>
                <span className="font-semibold">
                  {(((financialData.cashflow || 0) / (financialData.mainIncome + financialData.sideIncome)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">FI Progress</span>
                <span className="font-semibold">
                  {((financialData.sideIncome / financialData.monthlyExpenses) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CashflowSection;
