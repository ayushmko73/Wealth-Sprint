import React, { useState } from 'react';
import { useWealthSprintGame, Asset, Liability } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Calculator,
  Activity,
  ArrowUpCircle,
  ArrowDownCircle,
  Home,
  Car,
  Briefcase,
  Minus,
  Plus,
  AlertTriangle,
  Building2,
  CreditCard,
  PiggyBank,
  Wallet,
  Target
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const FinancialManagementSection: React.FC = () => {
  const { 
    financialData, 
    uiState, 
    updateUIState,
    updateFinancialData, 
    playerStats, 
    updatePlayerStats,
    getAssets,
    getLiabilities,
    removeAsset,
    updateLiability,
    addTransaction
  } = useWealthSprintGame();
  
  const selectedCategory = uiState.financialManagementCategory || 'Cashflow Overview';
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedLiability, setSelectedLiability] = useState<string | null>(null);

  // Categories for the horizontal menu - Combined from both sections
  const categories = [
    'Cashflow Overview', 
    'Income Sources', 
    'Expense Breakdown', 
    'Assets Management',
    'Liabilities', 
    'Financial Health'
  ];

  // Category icons mapping
  const categoryIcons: Record<string, JSX.Element> = {
    'Cashflow Overview': <BarChart3 className="w-4 h-4" />,
    'Income Sources': <TrendingUp className="w-4 h-4" />,
    'Expense Breakdown': <PieChart className="w-4 h-4" />,
    'Assets Management': <Home className="w-4 h-4" />,
    'Liabilities': <CreditCard className="w-4 h-4" />,
    'Financial Health': <Activity className="w-4 h-4" />
  };

  // Calculate cashflow data
  const totalIncome = financialData.mainIncome + financialData.sideIncome;
  const netCashflow = totalIncome - financialData.monthlyExpenses;

  // Assets and liabilities data
  const assets = getAssets() || [];
  const liabilities = getLiabilities() || [];
  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilityValue = liabilities.reduce((sum, liability) => sum + liability.outstandingAmount, 0);
  const netWorth = totalAssetValue - totalLiabilityValue;
  const monthlyAssetIncome = assets.reduce((sum, asset) => sum + asset.monthlyIncome, 0);
  const monthlyLiabilityPayment = liabilities.reduce((sum, liability) => sum + liability.emi, 0);

  // Prepare circular chart data for expense breakdown
  const expenseData = [
    { name: 'Living Expenses', value: financialData.monthlyExpenses * 0.4, color: '#ef4444' },
    { name: 'Business Costs', value: financialData.monthlyExpenses * 0.25, color: '#f59e0b' },
    { name: 'Investments', value: financialData.monthlyExpenses * 0.15, color: '#10b981' },
    { name: 'Taxes', value: financialData.monthlyExpenses * 0.15, color: '#3b82f6' },
    { name: 'Others', value: financialData.monthlyExpenses * 0.05, color: '#8b5cf6' }
  ];

  const handleSellAsset = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      const saleValue = asset.value * 0.95; // 5% transaction cost
      updateFinancialData({
        bankBalance: financialData.bankBalance + saleValue,
      });
      
      addTransaction({
        type: 'investment',
        amount: saleValue,
        description: `Sold ${asset.name}`,
        fromAccount: 'business',
        toAccount: 'bank',
      });
      
      removeAsset(assetId);
      setSelectedAsset(null);
    }
  };

  const handlePrepayLiability = (liabilityId: string, amount: number) => {
    const liability = liabilities.find(l => l.id === liabilityId);
    if (liability && financialData.bankBalance >= amount) {
      const newOutstanding = Math.max(0, liability.outstandingAmount - amount);
      const newEmi = newOutstanding > 0 ? liability.emi : 0;
      
      updateLiability(liabilityId, {
        outstandingAmount: newOutstanding,
        emi: newEmi
      });
      
      updateFinancialData({
        bankBalance: financialData.bankBalance - amount,
      });
      
      addTransaction({
        type: 'loan_deducted',
        amount: -amount,
        description: `Prepaid ${liability.name}`,
        fromAccount: 'bank',
        toAccount: 'business',
      });
      
      updatePlayerStats({
        karma: playerStats.karma + 5,
        stress: Math.max(0, playerStats.stress - 10),
        logic: playerStats.logic + 2,
      });
    }
  };

  const getAssetCategoryIcon = (category: string) => {
    switch (category) {
      case 'real_estate': return '🏠';
      case 'stocks': return '📈';
      case 'bonds': return '🏛️';
      case 'business': return '🚀';
      case 'gadget': return '💻';
      case 'vehicles': return '🚗';
      case 'investment': return '🪙';
      case 'entertainment': return '🎮';
      case 'home_loan': return '🏠';
      case 'car_loan': return '🚗';
      case 'education_loan': return '🎓';
      case 'credit_card': return '💳';
      case 'business_debt': return '🏢';
      case 'personal_loan': return '💰';
      default: return '📦';
    }
  };

  const getAppreciationColor = (rate: number) => {
    if (rate > 0) return 'text-green-600';
    if (rate < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getDebtRisk = (liability: Liability) => {
    if (liability.interestRate > 20) return { level: 'High', color: 'text-red-600' };
    if (liability.interestRate > 12) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-green-600' };
  };

  return (
    <div className="space-y-0">
      {/* Blue Header Section with Banking/Stock Market Style */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-lg">
        {/* Top Header */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-white" />
              <h1 className="text-xl font-bold text-white">Financial Management</h1>
            </div>
            <div className="text-right text-white">
              <p className="text-sm opacity-90">Net Worth</p>
              <p className={`text-lg font-bold ${netWorth >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                ₹{netWorth.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Metrics */}
        <div className="grid grid-cols-4 gap-2 text-center px-4 pb-3">
          <div>
            <p className="text-blue-200 text-xs">Total Assets</p>
            <p className="text-sm font-bold text-green-300">₹{totalAssetValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">Total Liabilities</p>
            <p className="text-sm font-bold text-red-300">₹{totalLiabilityValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">Monthly Flow</p>
            <p className="text-sm font-bold text-yellow-300">₹{netCashflow.toLocaleString()}</p>
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
                onClick={() => updateUIState({ financialManagementCategory: category })}
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
        {selectedCategory === 'Cashflow Overview' && (
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

            {/* Cashflow Visual Chart */}
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
            {/* Income Sources Cards - Same style as Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Main Income</p>
                      <p className="text-2xl font-bold text-green-600">₹{financialData.mainIncome.toLocaleString()}</p>
                      <p className="text-xs text-green-600">Job/Business income</p>
                    </div>
                    <ArrowUpCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-800">Side Income</p>
                      <p className="text-2xl font-bold text-orange-600">₹{financialData.sideIncome.toLocaleString()}</p>
                      <p className="text-xs text-orange-600">Investment returns</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Total Income</p>
                      <p className="text-2xl font-bold text-blue-600">₹{totalIncome.toLocaleString()}</p>
                      <p className="text-xs text-blue-600">Main: ₹{financialData.mainIncome.toLocaleString()} | Side: ₹{financialData.sideIncome.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Income Sources Pie Chart */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Income Sources Breakdown</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Main Income', value: financialData.mainIncome, color: '#10b981' },
                          { name: 'Side Income', value: financialData.sideIncome, color: '#f59e0b' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { name: 'Main Income', value: financialData.mainIncome, color: '#10b981' },
                          { name: 'Side Income', value: financialData.sideIncome, color: '#f59e0b' }
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
                    <span className="text-sm">Main Income</span>
                    <span className="text-sm font-medium">₹{financialData.mainIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-sm">Side Income</span>
                    <span className="text-sm font-medium">₹{financialData.sideIncome.toLocaleString()}</span>
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

        {selectedCategory === 'Assets Management' && (
          <div className="space-y-4">
            {/* Assets Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Total Assets</p>
                      <p className="text-2xl font-bold text-green-600">₹{totalAssetValue.toLocaleString()}</p>
                      <p className="text-xs text-green-600">{assets.length} assets owned</p>
                    </div>
                    <Home className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Monthly Income</p>
                      <p className="text-2xl font-bold text-blue-600">₹{monthlyAssetIncome.toLocaleString()}</p>
                      <p className="text-xs text-blue-600">From assets</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-800">ROI Potential</p>
                      <p className="text-2xl font-bold text-purple-600">{monthlyAssetIncome > 0 ? ((monthlyAssetIncome / totalAssetValue) * 100 * 12).toFixed(1) : '0.0'}%</p>
                      <p className="text-xs text-purple-600">Annual return</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assets List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Your Assets Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Home className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No assets yet. Visit the Store to purchase your first asset!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assets.map((asset) => (
                      <div key={asset.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getAssetCategoryIcon(asset.category)}</span>
                            <div>
                              <h3 className="font-semibold">{asset.name}</h3>
                              <p className="text-sm text-gray-500">{asset.category.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{asset.value.toLocaleString()}</p>
                            <p className="text-sm text-green-600">+₹{asset.monthlyIncome.toLocaleString()}/mo</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className={getAppreciationColor(asset.appreciationRate || 0)}>
                              {(asset.appreciationRate || 0) > 0 ? '+' : ''}{asset.appreciationRate || 0}% growth
                            </Badge>
                          </div>
                          <Button 
                            onClick={() => handleSellAsset(asset.id)}
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            Sell Asset
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {selectedCategory === 'Liabilities' && (
          <div className="space-y-4">
            {/* Liabilities Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-800">Total Debt</p>
                      <p className="text-2xl font-bold text-red-600">₹{totalLiabilityValue.toLocaleString()}</p>
                      <p className="text-xs text-red-600">{liabilities.length} active debts</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-800">Monthly EMI</p>
                      <p className="text-2xl font-bold text-orange-600">₹{monthlyLiabilityPayment.toLocaleString()}</p>
                      <p className="text-xs text-orange-600">Total payments</p>
                    </div>
                    <Calculator className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Net Worth</p>
                      <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{netWorth.toLocaleString()}</p>
                      <p className="text-xs text-green-600">Assets - Liabilities</p>
                    </div>
                    <PiggyBank className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liabilities List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Active Liabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                {liabilities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No active liabilities. Great financial health!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {liabilities.map((liability) => {
                      const risk = getDebtRisk(liability);
                      return (
                        <div key={liability.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getAssetCategoryIcon(liability.category)}</span>
                              <div>
                                <h3 className="font-semibold">{liability.name}</h3>
                                <p className="text-sm text-gray-500">{liability.category.replace('_', ' ')}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-red-600">₹{liability.outstandingAmount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">₹{liability.emi.toLocaleString()}/mo EMI</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Badge variant="outline" className={risk.color}>
                                {liability.interestRate}% interest • {risk.level} risk
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handlePrepayLiability(liability.id, Math.min(liability.outstandingAmount, financialData.bankBalance))}
                                variant="outline" 
                                size="sm"
                                disabled={financialData.bankBalance < 1000}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Prepay
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Progress 
                              value={100 - ((liability.outstandingAmount / liability.originalAmount) * 100)} 
                              className="h-2"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(100 - ((liability.outstandingAmount / liability.originalAmount) * 100)).toFixed(1)}% paid off
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {selectedCategory === 'Financial Health' && (
          <div className="space-y-4">
            {/* Financial Independence Journey */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-800">Financial Independence Journey</h3>
                  </div>
                  <Badge className={`${((financialData.sideIncome / financialData.monthlyExpenses) * 100) >= 100 ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                    {((financialData.sideIncome / financialData.monthlyExpenses) * 100) >= 100 ? 'FI Achieved!' : 'In Progress'}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-purple-700">FI Progress</span>
                    <span className="text-sm font-bold text-purple-800">{((financialData.sideIncome / financialData.monthlyExpenses) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(100, (financialData.sideIncome / financialData.monthlyExpenses) * 100)} className="h-3 mb-2" />
                  <div className="flex justify-between text-xs text-purple-600">
                    <span>Passive Income: ₹{financialData.sideIncome.toLocaleString()}/mo</span>
                    <span>Target: ₹{financialData.monthlyExpenses.toLocaleString()}/mo</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <p className="text-sm text-purple-600 mb-1">Years to FI</p>
                    <p className="text-lg font-bold text-purple-800">
                      {netCashflow > 0 ? Math.ceil((financialData.monthlyExpenses * 12 * 25 - totalAssetValue) / (netCashflow * 12)) : '∞'}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <p className="text-sm text-purple-600 mb-1">FI Number</p>
                    <p className="text-lg font-bold text-purple-800">₹{(financialData.monthlyExpenses * 12 * 25).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Health Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Financial Health Score</h3>
                  </div>
                  
                  {(() => {
                    const expenseRatio = (financialData.monthlyExpenses / totalIncome) * 100;
                    const savingsRate = (netCashflow / totalIncome) * 100;
                    const debtRatio = totalAssetValue > 0 ? (totalLiabilityValue / totalAssetValue) * 100 : 0;
                    const fiProgress = (financialData.sideIncome / financialData.monthlyExpenses) * 100;
                    
                    // Calculate health score (0-100)
                    let healthScore = 0;
                    healthScore += Math.max(0, 25 - (expenseRatio > 70 ? 25 : (expenseRatio - 70) / 2)); // Expense ratio
                    healthScore += Math.min(25, savingsRate > 0 ? savingsRate / 2 : 0); // Savings rate
                    healthScore += Math.max(0, 25 - (debtRatio / 4)); // Debt ratio
                    healthScore += Math.min(25, fiProgress / 4); // FI progress
                    
                    const getScoreColor = (score: number) => {
                      if (score >= 80) return 'text-green-600';
                      if (score >= 60) return 'text-yellow-600';
                      if (score >= 40) return 'text-orange-600';
                      return 'text-red-600';
                    };
                    
                    const getScoreLabel = (score: number) => {
                      if (score >= 80) return 'Excellent';
                      if (score >= 60) return 'Good';
                      if (score >= 40) return 'Fair';
                      return 'Needs Improvement';
                    };

                    return (
                      <>
                        <div className="text-center mb-6">
                          <div className={`text-4xl font-bold ${getScoreColor(healthScore)} mb-2`}>
                            {Math.round(healthScore)}/100
                          </div>
                          <Badge className={healthScore >= 60 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {getScoreLabel(healthScore)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Expense Control</span>
                            <div className="flex items-center gap-2">
                              <Progress value={Math.max(0, 100 - expenseRatio)} className="w-20 h-2" />
                              <span className="text-sm font-medium">{expenseRatio.toFixed(1)}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Savings Rate</span>
                            <div className="flex items-center gap-2">
                              <Progress value={Math.min(100, savingsRate)} className="w-20 h-2" />
                              <span className="text-sm font-medium">{savingsRate.toFixed(1)}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Debt Management</span>
                            <div className="flex items-center gap-2">
                              <Progress value={Math.max(0, 100 - debtRatio)} className="w-20 h-2" />
                              <span className="text-sm font-medium">{debtRatio.toFixed(1)}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">FI Progress</span>
                            <div className="flex items-center gap-2">
                              <Progress value={Math.min(100, fiProgress)} className="w-20 h-2" />
                              <span className="text-sm font-medium">{fiProgress.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Wealth Building Goals</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Emergency Fund Goal */}
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-blue-800">Emergency Fund</span>
                        <Badge variant="outline" className={financialData.bankBalance >= (financialData.monthlyExpenses * 6) ? 'text-green-600' : 'text-orange-600'}>
                          {financialData.bankBalance >= (financialData.monthlyExpenses * 6) ? 'Complete' : 'In Progress'}
                        </Badge>
                      </div>
                      <Progress value={Math.min(100, (financialData.bankBalance / (financialData.monthlyExpenses * 6)) * 100)} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs text-blue-600">
                        <span>Current: ₹{financialData.bankBalance.toLocaleString()}</span>
                        <span>Target: ₹{(financialData.monthlyExpenses * 6).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Investment Goal */}
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-green-800">Investment Portfolio</span>
                        <Badge variant="outline" className={totalAssetValue >= 1000000 ? 'text-green-600' : 'text-orange-600'}>
                          {totalAssetValue >= 1000000 ? 'Milestone Reached' : 'Building'}
                        </Badge>
                      </div>
                      <Progress value={Math.min(100, (totalAssetValue / 1000000) * 100)} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs text-green-600">
                        <span>Assets: ₹{totalAssetValue.toLocaleString()}</span>
                        <span>Target: ₹10,00,000</span>
                      </div>
                    </div>

                    {/* Debt Freedom Goal */}
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-red-800">Debt Freedom</span>
                        <Badge variant="outline" className={totalLiabilityValue === 0 ? 'text-green-600' : 'text-red-600'}>
                          {totalLiabilityValue === 0 ? 'Debt Free!' : `₹${totalLiabilityValue.toLocaleString()} left`}
                        </Badge>
                      </div>
                      <Progress value={totalLiabilityValue === 0 ? 100 : Math.max(0, 100 - (totalLiabilityValue / 5000000) * 100)} className="h-2 mb-2" />
                      <div className="text-xs text-red-600 text-center">
                        {totalLiabilityValue === 0 ? 'No outstanding debt' : `Monthly EMI: ₹${monthlyLiabilityPayment.toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Recommendations */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Personalized Recommendations</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(() => {
                    const recommendations = [];
                    
                    // Emergency fund recommendation
                    if (financialData.bankBalance < financialData.monthlyExpenses * 3) {
                      recommendations.push({
                        title: 'Build Emergency Fund',
                        description: 'Focus on saving 6 months of expenses before investing',
                        priority: 'High',
                        color: 'red'
                      });
                    }
                    
                    // Debt recommendation
                    if (totalLiabilityValue > totalAssetValue * 0.3) {
                      recommendations.push({
                        title: 'Reduce Debt Burden',
                        description: 'Consider debt consolidation or aggressive repayment',
                        priority: 'High',
                        color: 'red'
                      });
                    }
                    
                    // Savings rate recommendation
                    if ((netCashflow / totalIncome) * 100 < 20) {
                      recommendations.push({
                        title: 'Increase Savings Rate',
                        description: 'Aim for at least 20% savings rate for wealth building',
                        priority: 'Medium',
                        color: 'yellow'
                      });
                    }
                    
                    // FI recommendation
                    if (financialData.sideIncome < financialData.monthlyExpenses * 0.25) {
                      recommendations.push({
                        title: 'Build Passive Income',
                        description: 'Focus on investments that generate regular income',
                        priority: 'Medium',
                        color: 'blue'
                      });
                    }
                    
                    // Success message if doing well
                    if (recommendations.length === 0) {
                      recommendations.push({
                        title: 'Excellent Progress!',
                        description: 'Your financial health is on track. Keep it up!',
                        priority: 'Success',
                        color: 'green'
                      });
                    }
                    
                    return recommendations.map((rec, index) => (
                      <div key={index} className={`p-4 rounded-lg border-l-4 border-${rec.color}-500 bg-${rec.color}-50`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-semibold text-${rec.color}-800`}>{rec.title}</h4>
                          <Badge className={`bg-${rec.color}-100 text-${rec.color}-800`}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className={`text-sm text-${rec.color}-700`}>{rec.description}</p>
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialManagementSection;