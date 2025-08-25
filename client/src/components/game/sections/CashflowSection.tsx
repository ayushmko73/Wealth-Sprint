import React from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent } from '../../ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Calculator,
  Activity,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const CashflowSection: React.FC = () => {
  const { financialData, uiState, updateUIState } = useWealthSprintGame();
  const selectedCategory = uiState.cashflowSelectedCategory;

  // Categories for the horizontal menu
  const categories = ['Overview', 'Income Sources', 'Expense Breakdown', 'Financial Health'];

  // Category icons mapping
  const categoryIcons: Record<string, JSX.Element> = {
    'Overview': <BarChart3 className="w-4 h-4" />,
    'Income Sources': <TrendingUp className="w-4 h-4" />,
    'Expense Breakdown': <PieChart className="w-4 h-4" />,
    'Financial Health': <Activity className="w-4 h-4" />
  };

  // Calculate cashflow data
  const totalIncome = financialData.mainIncome + financialData.sideIncome;
  const netCashflow = totalIncome - financialData.monthlyExpenses;

  // Prepare circular chart data for expense breakdown
  const expenseData = [
    { name: 'Living Expenses', value: financialData.monthlyExpenses * 0.4, color: '#ef4444' },
    { name: 'Business Costs', value: financialData.monthlyExpenses * 0.25, color: '#f59e0b' },
    { name: 'Investments', value: financialData.monthlyExpenses * 0.15, color: '#10b981' },
    { name: 'Taxes', value: financialData.monthlyExpenses * 0.15, color: '#3b82f6' },
    { name: 'Others', value: financialData.monthlyExpenses * 0.05, color: '#8b5cf6' }
  ];

  // Income sources data
  const incomeData = [
    { name: 'Main Income', value: financialData.mainIncome, color: '#10b981' },
    { name: 'Side Income', value: financialData.sideIncome, color: '#f59e0b' }
  ];

  // Progress data based on screenshots
  const progressData = [
    { category: 'Income', current: totalIncome, target: totalIncome * 1.5, color: '#10b981' },
    { category: 'Savings', current: netCashflow, target: totalIncome * 0.3, color: '#3b82f6' },
    { category: 'Investments', current: financialData.monthlyExpenses * 0.15, target: totalIncome * 0.2, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-0">
      {/* Blue Header Section with Banking/Stock Market Style */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-lg">
        {/* Top Header */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-white" />
              <h1 className="text-xl font-bold text-white">Cashflow Management</h1>
            </div>
            <div className="text-right text-white">
              <p className="text-sm opacity-90">Net Monthly Flow</p>
              <p className={`text-lg font-bold ${netCashflow >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                ₹{netCashflow.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Metrics */}
        <div className="grid grid-cols-4 gap-2 text-center px-4 pb-3">
          <div>
            <p className="text-blue-200 text-xs">Total Income</p>
            <p className="text-sm font-bold text-green-300">₹{totalIncome.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">Total Expenses</p>
            <p className="text-sm font-bold text-red-300">₹{financialData.monthlyExpenses.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">Savings Rate</p>
            <p className="text-sm font-bold text-yellow-300">{((netCashflow / totalIncome) * 100 || 0).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">FI Progress</p>
            <p className="text-sm font-bold text-purple-300">{((financialData.sideIncome / financialData.monthlyExpenses) * 100).toFixed(1)}%</p>
          </div>
        </div>
        
        {/* Category Navigation - Merged with Header */}
        <div className="overflow-x-auto px-4 pb-4">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => updateUIState({ cashflowSelectedCategory: category })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shadow-md ${
                  selectedCategory === category 
                    ? 'bg-white text-blue-800 shadow-md' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {categoryIcons[category]}
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content based on selected category */}
      <div className="mt-3 px-4">
        {selectedCategory === 'Overview' && (
          <div className="space-y-4">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Total Income</p>
                      <p className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
                      <p className="text-xs text-green-600">Main: ₹{financialData.mainIncome.toLocaleString()} | Side: ₹{financialData.sideIncome.toLocaleString()}</p>
                    </div>
                    <ArrowUpCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-800">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-600">₹{financialData.monthlyExpenses.toLocaleString()}</p>
                      <p className="text-xs text-red-600">Monthly recurring expenses</p>
                    </div>
                    <ArrowDownCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br ${netCashflow >= 0 ? 'from-blue-50 to-sky-50 border-blue-200' : 'from-orange-50 to-red-50 border-orange-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${netCashflow >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>Net Cashflow</p>
                      <p className={`text-2xl font-bold ${netCashflow >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>₹{netCashflow.toLocaleString()}</p>
                      <p className={`text-xs ${netCashflow >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                        {netCashflow >= 0 ? 'Positive cashflow' : 'Negative cashflow'}
                      </p>
                    </div>
                    <DollarSign className={`w-8 h-8 ${netCashflow >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Circular Progress Chart - Similar to Screenshots */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Cashflow Visual</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Income', value: totalIncome, color: '#10b981' },
                          { name: 'Expenses', value: financialData.monthlyExpenses, color: '#ef4444' },
                          { name: 'Savings', value: Math.max(0, netCashflow), color: '#3b82f6' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { name: 'Income', value: totalIncome, color: '#10b981' },
                          { name: 'Expenses', value: financialData.monthlyExpenses, color: '#ef4444' },
                          { name: 'Savings', value: Math.max(0, netCashflow), color: '#3b82f6' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Expenses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Savings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedCategory === 'Income Sources' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Income Sources</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">Main Income (Job/Business)</span>
                    </div>
                    <span className="text-sm font-bold text-green-700">₹{financialData.mainIncome.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-semibold text-orange-800">Side Income (Investments)</span>
                    </div>
                    <span className="text-sm font-bold text-orange-700">₹{financialData.sideIncome.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-800">Total Monthly Income</span>
                    </div>
                    <span className="text-lg font-bold text-blue-700">₹{totalIncome.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedCategory === 'Expense Breakdown' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Breakdown</h3>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {expenseData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-medium ml-auto">₹{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedCategory === 'Financial Health' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Financial Health Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Expense Ratio</span>
                      <span className="font-semibold">{((financialData.monthlyExpenses / totalIncome) * 100 || 0).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Savings Rate</span>
                      <span className="font-semibold">{((netCashflow / totalIncome) * 100 || 0).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">FI Progress</span>
                      <span className="font-semibold">{((financialData.sideIncome / financialData.monthlyExpenses) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Income Distribution</h3>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Main', value: financialData.mainIncome },
                        { name: 'Side', value: financialData.sideIncome }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Income']} />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CashflowSection;