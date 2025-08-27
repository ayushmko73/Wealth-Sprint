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
  Wallet
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

        {selectedCategory === 'Financial Health' && (
          <div className="space-y-6">
            {/* Financial Fitness Level */}
            <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-20 h-20 border border-white/20 rounded-full"></div>
                <div className="absolute top-12 right-8 w-12 h-12 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-8 left-12 w-16 h-16 border border-white/20 rounded-full"></div>
              </div>
              
              {(() => {
                const savingsRate = totalIncome > 0 ? (Math.max(0, netCashflow) / totalIncome) * 100 : 0;
                const debtRatio = totalAssetValue > 0 ? (totalLiabilityValue / totalAssetValue) * 100 : 0;
                const fiProgress = financialData.monthlyExpenses > 0 ? (financialData.sideIncome / financialData.monthlyExpenses) * 100 : 0;
                const emergencyMonths = financialData.monthlyExpenses > 0 ? financialData.bankBalance / financialData.monthlyExpenses : 0;
                
                // Calculate fitness level
                let level = 1;
                let levelName = "Financial Rookie";
                let nextMilestone = "Save 10% of income";
                let progress = 0;
                
                if (savingsRate >= 5 && emergencyMonths >= 1) {
                  level = 2;
                  levelName = "Money Manager";
                  nextMilestone = "Build 3-month emergency fund";
                  progress = Math.min(100, (emergencyMonths / 3) * 100);
                }
                if (savingsRate >= 10 && emergencyMonths >= 3) {
                  level = 3;
                  levelName = "Wealth Builder";
                  nextMilestone = "Achieve 50% FI progress";
                  progress = Math.min(100, (fiProgress / 50) * 100);
                }
                if (savingsRate >= 15 && fiProgress >= 50) {
                  level = 4;
                  levelName = "Investment Pro";
                  nextMilestone = "Reach Financial Independence";
                  progress = Math.min(100, fiProgress);
                }
                if (fiProgress >= 100) {
                  level = 5;
                  levelName = "Financial Freedom";
                  nextMilestone = "Expand wealth empire";
                  progress = 100;
                }
                
                return (
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">Level {level}</h2>
                        <p className="text-xl text-purple-200">{levelName}</p>
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <span className="text-2xl font-bold">{level}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-purple-200">Next Milestone</span>
                        <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-purple-200 mt-2">{nextMilestone}</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Achievement Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="w-5 h-5" />
                  Financial Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const savingsRate = totalIncome > 0 ? (Math.max(0, netCashflow) / totalIncome) * 100 : 0;
                    const emergencyMonths = financialData.monthlyExpenses > 0 ? financialData.bankBalance / financialData.monthlyExpenses : 0;
                    const fiProgress = financialData.monthlyExpenses > 0 ? (financialData.sideIncome / financialData.monthlyExpenses) * 100 : 0;
                    
                    const achievements = [
                      {
                        name: "First Savings",
                        description: "Save money for the first time",
                        earned: savingsRate > 0,
                        icon: "💰",
                        color: "bg-green-100 text-green-800"
                      },
                      {
                        name: "Emergency Ready",
                        description: "Build 3-month emergency fund",
                        earned: emergencyMonths >= 3,
                        icon: "🛡️",
                        color: "bg-blue-100 text-blue-800"
                      },
                      {
                        name: "Income Diversifier",
                        description: "Earn passive income",
                        earned: financialData.sideIncome > 0,
                        icon: "📈",
                        color: "bg-purple-100 text-purple-800"
                      },
                      {
                        name: "Debt Free",
                        description: "Achieve zero debt",
                        earned: totalLiabilityValue === 0,
                        icon: "🎯",
                        color: "bg-orange-100 text-orange-800"
                      },
                      {
                        name: "Asset Builder",
                        description: "Own 5+ assets",
                        earned: assets.length >= 5,
                        icon: "🏠",
                        color: "bg-indigo-100 text-indigo-800"
                      },
                      {
                        name: "High Saver",
                        description: "Save 20%+ of income",
                        earned: savingsRate >= 20,
                        icon: "🎖️",
                        color: "bg-yellow-100 text-yellow-800"
                      },
                      {
                        name: "FI Achiever",
                        description: "Reach Financial Independence",
                        earned: fiProgress >= 100,
                        icon: "👑",
                        color: "bg-pink-100 text-pink-800"
                      },
                      {
                        name: "Wealth Master",
                        description: "Net worth > ₹10 lakh",
                        earned: netWorth >= 1000000,
                        icon: "💎",
                        color: "bg-cyan-100 text-cyan-800"
                      }
                    ];
                    
                    return achievements.map((achievement, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          achievement.earned 
                            ? `${achievement.color} border-current shadow-md` 
                            : 'bg-gray-50 text-gray-400 border-gray-200'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`text-2xl mb-2 ${achievement.earned ? '' : 'grayscale'}`}>
                            {achievement.icon}
                          </div>
                          <h4 className="font-semibold text-sm mb-1">{achievement.name}</h4>
                          <p className="text-xs leading-tight">{achievement.description}</p>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Financial Vitals Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Health Check */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Financial Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const savingsRate = totalIncome > 0 ? (Math.max(0, netCashflow) / totalIncome) * 100 : 0;
                      const debtRatio = totalAssetValue > 0 ? (totalLiabilityValue / totalAssetValue) * 100 : 0;
                      const emergencyMonths = financialData.monthlyExpenses > 0 ? financialData.bankBalance / financialData.monthlyExpenses : 0;
                      
                      const vitals = [
                        {
                          name: "Savings Rate",
                          value: savingsRate,
                          target: 20,
                          unit: "%",
                          icon: "🎯"
                        },
                        {
                          name: "Emergency Fund",
                          value: emergencyMonths,
                          target: 6,
                          unit: " months",
                          icon: "🛡️"
                        },
                        {
                          name: "Debt Level",
                          value: debtRatio,
                          target: 30,
                          unit: "%",
                          icon: "⚠️",
                          inverse: true
                        }
                      ];
                      
                      return vitals.map((vital, index) => {
                        const isHealthy = vital.inverse 
                          ? vital.value <= vital.target 
                          : vital.value >= vital.target;
                        const progressValue = vital.inverse 
                          ? Math.max(0, 100 - (vital.value / vital.target) * 100)
                          : Math.min(100, (vital.value / vital.target) * 100);
                        
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span>{vital.icon}</span>
                                <span className="text-sm font-medium">{vital.name}</span>
                              </div>
                              <span className={`text-sm font-bold ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                                {vital.value.toFixed(1)}{vital.unit}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-1000 ${
                                  isHealthy ? 'bg-green-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${progressValue}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500">
                              Target: {vital.target}{vital.unit}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Action Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Smart Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(() => {
                      const savingsRate = totalIncome > 0 ? (Math.max(0, netCashflow) / totalIncome) * 100 : 0;
                      const emergencyMonths = financialData.monthlyExpenses > 0 ? financialData.bankBalance / financialData.monthlyExpenses : 0;
                      const fiProgress = financialData.monthlyExpenses > 0 ? (financialData.sideIncome / financialData.monthlyExpenses) * 100 : 0;
                      
                      const recommendations = [];
                      
                      if (savingsRate < 10) {
                        recommendations.push({
                          type: "urgent",
                          icon: "🚨",
                          title: "Increase Savings Rate",
                          description: "Try to save at least 10% of income",
                          action: "Review expenses and cut unnecessary costs"
                        });
                      }
                      
                      if (emergencyMonths < 3) {
                        recommendations.push({
                          type: "important",
                          icon: "🛡️",
                          title: "Build Emergency Fund",
                          description: "Aim for 3-6 months of expenses",
                          action: "Set up automatic savings"
                        });
                      }
                      
                      if (totalLiabilityValue > totalAssetValue * 0.7) {
                        recommendations.push({
                          type: "warning",
                          icon: "⚖️",
                          title: "Reduce Debt Burden",
                          description: "High debt-to-asset ratio detected",
                          action: "Focus on paying down high-interest debt"
                        });
                      }
                      
                      if (fiProgress < 25 && savingsRate >= 10) {
                        recommendations.push({
                          type: "opportunity",
                          icon: "📈",
                          title: "Boost Passive Income",
                          description: "Start building side income streams",
                          action: "Explore investment opportunities"
                        });
                      }
                      
                      if (recommendations.length === 0) {
                        recommendations.push({
                          type: "success",
                          icon: "🎉",
                          title: "Great Financial Health!",
                          description: "Keep up the excellent work",
                          action: "Continue current strategy"
                        });
                      }
                      
                      return recommendations.slice(0, 3).map((rec, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg border-l-4 ${
                            rec.type === 'urgent' ? 'bg-red-50 border-red-500' :
                            rec.type === 'important' ? 'bg-orange-50 border-orange-500' :
                            rec.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                            rec.type === 'opportunity' ? 'bg-blue-50 border-blue-500' :
                            'bg-green-50 border-green-500'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-lg">{rec.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{rec.title}</h4>
                              <p className="text-xs text-gray-600 mb-1">{rec.description}</p>
                              <p className="text-xs font-medium text-gray-800">{rec.action}</p>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
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
                      <span className="text-sm">Debt-to-Asset Ratio</span>
                      <span className="font-semibold">{totalAssetValue > 0 ? ((totalLiabilityValue / totalAssetValue) * 100).toFixed(1) : '0.0'}%</span>
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

export default FinancialManagementSection;