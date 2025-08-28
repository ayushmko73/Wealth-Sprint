import React, { useState, useEffect, useRef } from 'react';
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
  Laptop,
  GamepadIcon,
  Landmark,
  Rocket,
  GraduationCap,
  Smartphone,
  Package
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Sector } from 'recharts';

// Custom active shape for pie chart interactions with subtle professional animation
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="none"
        strokeWidth={0}
        opacity={1}
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
    </g>
  );
};

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
    removeLiability,
    updateLiability,
    addTransaction
  } = useWealthSprintGame();
  
  const selectedCategory = uiState.financialManagementCategory || 'Cashflow Overview';
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedLiability, setSelectedLiability] = useState<string | null>(null);
  const [activeCashflowIndex, setActiveCashflowIndex] = useState<number | null>(null);
  const [activeIncomeIndex, setActiveIncomeIndex] = useState<number | null>(null);
  const [activeExpenseIndex, setActiveExpenseIndex] = useState<number | null>(null);
  
  // Refs for pie chart containers
  const cashflowChartRef = useRef<HTMLDivElement>(null);
  const incomeChartRef = useRef<HTMLDivElement>(null);
  const expenseChartRef = useRef<HTMLDivElement>(null);
  
  // Handle pie chart click interactions
  const handlePieClick = (index: number, type: 'cashflow' | 'income' | 'expense') => {
    switch (type) {
      case 'cashflow':
        setActiveCashflowIndex(activeCashflowIndex === index ? null : index);
        break;
      case 'income':
        setActiveIncomeIndex(activeIncomeIndex === index ? null : index);
        break;
      case 'expense':
        setActiveExpenseIndex(activeExpenseIndex === index ? null : index);
        break;
    }
  };

  // Handle pie chart double-click to reset to previous position
  const handlePieDoubleClick = (type: 'cashflow' | 'income' | 'expense') => {
    switch (type) {
      case 'cashflow':
        setActiveCashflowIndex(null);
        break;
      case 'income':
        setActiveIncomeIndex(null);
        break;
      case 'expense':
        setActiveExpenseIndex(null);
        break;
    }
  };

  // Handle clicks outside pie charts to reset to previous position
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Check if click is outside any chart and reset accordingly
      const isInsideCashflow = cashflowChartRef.current?.contains(target);
      const isInsideIncome = incomeChartRef.current?.contains(target);
      const isInsideExpense = expenseChartRef.current?.contains(target);
      
      if (!isInsideCashflow && activeCashflowIndex !== null) {
        setActiveCashflowIndex(null);
      }
      
      if (!isInsideIncome && activeIncomeIndex !== null) {
        setActiveIncomeIndex(null);
      }
      
      if (!isInsideExpense && activeExpenseIndex !== null) {
        setActiveExpenseIndex(null);
      }
    };

    // Use both mousedown and click events for better reliability
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('mousedown', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [activeCashflowIndex, activeIncomeIndex, activeExpenseIndex]);

  // Categories for the horizontal menu - Combined from both sections
  const categories = [
    'Cashflow Overview', 
    'Income Sources', 
    'Expense Breakdown', 
    'Assets Management',
    'Liabilities'
  ];

  // Category icons mapping
  const categoryIcons: Record<string, JSX.Element> = {
    'Cashflow Overview': <BarChart3 className="w-4 h-4" />,
    'Income Sources': <TrendingUp className="w-4 h-4" />,
    'Expense Breakdown': <PieChart className="w-4 h-4" />,
    'Assets Management': <Home className="w-4 h-4" />,
    'Liabilities': <CreditCard className="w-4 h-4" />
  };

  // Calculate cashflow data
  const totalIncome = financialData.mainIncome + financialData.sideIncome;
  const netCashflow = totalIncome - financialData.monthlyExpenses;

  // Assets and liabilities data
  const assets = getAssets() || [];
  const liabilities = (getLiabilities() || []).filter(liability => liability.outstandingAmount > 0);
  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilityValue = liabilities.reduce((sum, liability) => sum + liability.outstandingAmount, 0);
  const netWorth = totalAssetValue - totalLiabilityValue;
  const monthlyAssetIncome = assets.reduce((sum, asset) => sum + asset.monthlyIncome, 0);
  const monthlyLiabilityPayment = liabilities.reduce((sum, liability) => sum + liability.emi, 0);
  const monthlyLiabilityCashflow = -monthlyLiabilityPayment; // Negative cashflow impact

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
      
      if (newOutstanding === 0) {
        // Liability is fully paid - remove it completely
        removeLiability(liabilityId);
        
        // Add achievement notification for full payoff
        addTransaction({
          type: 'loan_deducted',
          amount: -amount,
          description: `Fully paid off ${liability.name} - Congratulations!`,
          fromAccount: 'bank',
          toAccount: 'business',
        });
        
        // Bigger karma boost for full payoff
        updatePlayerStats({
          karma: Math.min(100, playerStats.karma + 10),
          stress: Math.max(0, playerStats.stress - 15),
          logic: playerStats.logic + 3,
        });
      } else {
        // Partial payment - update the liability
        const newEmi = Math.ceil((newOutstanding * (liability.interestRate / 100 / 12)) / (1 - Math.pow(1 + (liability.interestRate / 100 / 12), -Math.ceil(newOutstanding / (liability.emi || 1000)))));
        
        updateLiability(liabilityId, {
          outstandingAmount: newOutstanding,
          emi: newEmi
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
      
      updateFinancialData({
        bankBalance: financialData.bankBalance - amount,
      });
    }
  };

  const getAssetCategoryIcon = (category: string, className: string = "w-6 h-6") => {
    const iconProps = { className };
    switch (category) {
      case 'real_estate': return <Home {...iconProps} />;
      case 'stocks': return <TrendingUp {...iconProps} />;
      case 'bonds': return <Landmark {...iconProps} />;
      case 'business': return <Rocket {...iconProps} />;
      case 'gadget': return <Laptop {...iconProps} />;
      case 'vehicles': return <Car {...iconProps} />;
      case 'investment': return <PiggyBank {...iconProps} />;
      case 'entertainment': return <GamepadIcon {...iconProps} />;
      case 'home_loan': return <Home {...iconProps} />;
      case 'car_loan': return <Car {...iconProps} />;
      case 'education_loan': return <GraduationCap {...iconProps} />;
      case 'credit_card': return <CreditCard {...iconProps} />;
      case 'business_debt': return <Building2 {...iconProps} />;
      case 'personal_loan': return <Wallet {...iconProps} />;
      default: return <Package {...iconProps} />;
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
      <style>
        {`
          .pie-chart-container * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-tap-highlight-color: transparent !important;
            -webkit-touch-callout: none !important;
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
          }
          .pie-chart-container svg,
          .pie-chart-container g,
          .pie-chart-container path,
          .pie-chart-container circle {
            outline: none !important;
            border: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
          }
          .pie-chart-container:focus,
          .pie-chart-container *:focus {
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
          }
        `}
      </style>
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
                <div 
                  ref={cashflowChartRef}
                  className="h-64 select-none pie-chart-container" 
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePieDoubleClick('cashflow');
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart style={{ outline: 'none' }}>
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
                        paddingAngle={2}
                        dataKey="value"
                        activeIndex={activeCashflowIndex ?? undefined}
                        activeShape={renderActiveShape}
                        onClick={(_, index) => handlePieClick(index, 'cashflow')}
                        onMouseEnter={(_, index) => {
                          if (activeCashflowIndex === null) {
                            setActiveCashflowIndex(index);
                          }
                        }}
                        onMouseLeave={() => {
                          // Only reset on mouse leave if it was set by hover (not by click)
                          if (activeCashflowIndex !== null) {
                            // Check if we should keep it active (it was clicked)
                            // We'll let the click outside handler manage this
                          }
                        }}
                        style={{ 
                          cursor: 'pointer', 
                          outline: 'none',
                          WebkitTapHighlightColor: 'transparent',
                          WebkitUserSelect: 'none',
                          userSelect: 'none'
                        }}
                      >
                        {[
                          { name: 'Income', value: totalIncome, color: '#10b981' },
                          { name: 'Expenses', value: financialData.monthlyExpenses, color: '#ef4444' },
                          { name: 'Savings', value: Math.max(0, netCashflow), color: '#3b82f6' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Income</span>
                    </div>
                    <span className="text-sm font-medium">₹{totalIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Expenses</span>
                    </div>
                    <span className="text-sm font-medium">₹{financialData.monthlyExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Savings</span>
                    </div>
                    <span className="text-sm font-medium">₹{Math.max(0, netCashflow).toLocaleString()}</span>
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
                <div 
                  ref={incomeChartRef}
                  className="h-64 select-none pie-chart-container" 
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePieDoubleClick('income');
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart style={{ outline: 'none' }}>
                      <Pie
                        data={[
                          { name: 'Main Income', value: financialData.mainIncome, color: '#3b82f6' },
                          { name: 'Side Income', value: financialData.sideIncome, color: '#10b981' },
                          { name: 'Asset Income', value: monthlyAssetIncome, color: '#f59e0b' }
                        ].filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        activeIndex={activeIncomeIndex ?? undefined}
                        activeShape={renderActiveShape}
                        onClick={(_, index) => handlePieClick(index, 'income')}
                        onMouseEnter={(_, index) => {
                          if (activeIncomeIndex === null) {
                            setActiveIncomeIndex(index);
                          }
                        }}
                        onMouseLeave={() => {
                          // Only reset on mouse leave if it was set by hover (not by click)
                          if (activeIncomeIndex !== null) {
                            // Check if we should keep it active (it was clicked)
                            // We'll let the click outside handler manage this
                          }
                        }}
                        style={{ 
                          cursor: 'pointer', 
                          outline: 'none',
                          WebkitTapHighlightColor: 'transparent',
                          WebkitUserSelect: 'none',
                          userSelect: 'none'
                        }}
                      >
                        {[
                          { name: 'Main Income', value: financialData.mainIncome, color: '#3b82f6' },
                          { name: 'Side Income', value: financialData.sideIncome, color: '#10b981' },
                          { name: 'Asset Income', value: monthlyAssetIncome, color: '#f59e0b' }
                        ].filter(item => item.value > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {financialData.mainIncome > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Main Income</span>
                      </div>
                      <span className="text-sm font-medium">₹{financialData.mainIncome.toLocaleString()}</span>
                    </div>
                  )}
                  {financialData.sideIncome > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Side Income</span>
                      </div>
                      <span className="text-sm font-medium">₹{financialData.sideIncome.toLocaleString()}</span>
                    </div>
                  )}
                  {monthlyAssetIncome > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Asset Income</span>
                      </div>
                      <span className="text-sm font-medium">₹{monthlyAssetIncome.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedCategory === 'Expense Breakdown' && (
          <div className="space-y-4">
            {/* Expense Categories Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-800">Living Expenses</p>
                      <p className="text-2xl font-bold text-red-600">₹{(financialData.monthlyExpenses * 0.4).toLocaleString()}</p>
                      <p className="text-xs text-red-600">Daily necessities</p>
                    </div>
                    <ArrowDownCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-800">Business Costs</p>
                      <p className="text-2xl font-bold text-orange-600">₹{(financialData.monthlyExpenses * 0.25).toLocaleString()}</p>
                      <p className="text-xs text-orange-600">Operations & growth</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-800">Total Expenses</p>
                      <p className="text-2xl font-bold text-purple-600">₹{financialData.monthlyExpenses.toLocaleString()}</p>
                      <p className="text-xs text-purple-600">Monthly recurring</p>
                    </div>
                    <Calculator className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Breakdown</h3>
                <div 
                  ref={expenseChartRef}
                  className="h-64 mb-4 select-none pie-chart-container" 
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePieDoubleClick('expense');
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart style={{ outline: 'none' }}>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        activeIndex={activeExpenseIndex ?? undefined}
                        activeShape={renderActiveShape}
                        onClick={(_, index) => handlePieClick(index, 'expense')}
                        onMouseEnter={(_, index) => {
                          if (activeExpenseIndex === null) {
                            setActiveExpenseIndex(index);
                          }
                        }}
                        onMouseLeave={() => {
                          // Only reset on mouse leave if it was set by hover (not by click)
                          if (activeExpenseIndex !== null) {
                            // Check if we should keep it active (it was clicked)
                            // We'll let the click outside handler manage this
                          }
                        }}
                        style={{ 
                          cursor: 'pointer', 
                          outline: 'none',
                          WebkitTapHighlightColor: 'transparent',
                          WebkitUserSelect: 'none',
                          userSelect: 'none'
                        }}
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`]} />
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
                  <div className="space-y-3">
                    {assets.map((asset) => (
                      <div key={asset.id} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-3 rounded-xl">
                              {getAssetCategoryIcon(asset.category, "w-6 h-6 text-blue-600")}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 text-lg">{asset.name}</h3>
                              <p className="text-sm text-gray-600 capitalize font-medium">{asset.category.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">₹{asset.value.toLocaleString()}</p>
                            <p className="text-sm font-semibold text-green-600 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              +₹{asset.monthlyIncome.toLocaleString()}/mo
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant="outline" 
                              className={`${getAppreciationColor(asset.appreciationRate || 0)} border-current bg-white/70 font-semibold`}
                            >
                              {(asset.appreciationRate || 0) > 0 ? '+' : ''}{asset.appreciationRate || 0}% growth
                            </Badge>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" />
                              ROI: {asset.monthlyIncome > 0 ? ((asset.monthlyIncome / asset.value) * 100 * 12).toFixed(1) : '0.0'}%
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleSellAsset(asset.id)}
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 font-medium"
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
                      <p className="text-sm font-medium text-orange-800">Monthly Cashflow</p>
                      <p className="text-2xl font-bold text-red-600">-₹{monthlyLiabilityPayment.toLocaleString()}</p>
                      <p className="text-xs text-orange-600">Maintenance costs</p>
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
                  <div className="space-y-3">
                    {liabilities.map((liability) => {
                      const risk = getDebtRisk(liability);
                      return (
                        <div key={liability.id} className="bg-gradient-to-r from-white to-red-50 border border-red-200 rounded-xl p-4 hover:shadow-lg hover:border-red-300 transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="bg-gradient-to-br from-red-50 to-orange-100 p-3 rounded-xl">
                                {getAssetCategoryIcon(liability.category, "w-6 h-6 text-red-600")}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg">{liability.name}</h3>
                                <p className="text-sm text-gray-600 capitalize font-medium">{liability.category.replace('_', ' ')}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-red-600">₹{liability.outstandingAmount.toLocaleString()}</p>
                              <p className="text-sm font-semibold text-red-600 flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" />
                                -₹{liability.emi.toLocaleString()}/mo
                              </p>
                              <p className="text-xs text-gray-500">Maintenance cost</p>
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-red-100">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Badge 
                                  variant="outline" 
                                  className={`${risk.color} border-current bg-white/70 font-semibold`}
                                >
                                  {liability.interestRate}% interest • {risk.level} risk
                                </Badge>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  {Math.ceil(liability.outstandingAmount / liability.emi)} months left
                                </div>
                              </div>
                              <Button 
                                onClick={() => handlePrepayLiability(liability.id, Math.min(liability.outstandingAmount, financialData.bankBalance))}
                                variant="outline" 
                                size="sm"
                                disabled={financialData.bankBalance < 1000}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 font-medium"
                              >
                                Prepay
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <Progress 
                                value={100 - ((liability.outstandingAmount / liability.originalAmount) * 100)} 
                                className="h-3 bg-red-100"
                              />
                              <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-600 font-medium">
                                  {(100 - ((liability.outstandingAmount / liability.originalAmount) * 100)).toFixed(1)}% paid off
                                </p>
                                <p className="text-xs text-gray-500">
                                  ₹{(liability.originalAmount - liability.outstandingAmount).toLocaleString()} / ₹{liability.originalAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>
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