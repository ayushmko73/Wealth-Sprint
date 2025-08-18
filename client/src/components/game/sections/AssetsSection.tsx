import React, { useState } from 'react';
import { useWealthSprintGame, Asset, Liability } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Home, TrendingUp, Car, Briefcase, Minus, Plus, AlertTriangle, Building2, CreditCard, PiggyBank, Wallet } from 'lucide-react';

const AssetsSection: React.FC = () => {
  const { 
    financialData, 
    updateFinancialData, 
    playerStats, 
    updatePlayerStats,
    getAssets,
    getLiabilities,
    removeAsset,
    updateLiability,
    addTransaction
  } = useWealthSprintGame();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('Overview');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedLiability, setSelectedLiability] = useState<string | null>(null);

  const categories = ['Overview', 'Assets', 'Liabilities', 'Analysis'];

  // Get assets and liabilities from the global game state
  const assets = getAssets() || [];
  const liabilities = getLiabilities() || [];

  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilityValue = liabilities.reduce((sum, liability) => sum + liability.outstandingAmount, 0);
  const netWorth = totalAssetValue - totalLiabilityValue;
  const monthlyAssetIncome = assets.reduce((sum, asset) => sum + asset.monthlyIncome, 0);
  const monthlyLiabilityPayment = liabilities.reduce((sum, liability) => sum + liability.emi, 0);

  const handleSellAsset = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      const saleValue = asset.value * 0.95; // 5% transaction cost
      updateFinancialData({
        bankBalance: financialData.bankBalance + saleValue,
      });
      
      // Add transaction record
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
      
      // Add transaction record
      addTransaction({
        type: 'loan_deducted',
        amount: -amount,
        description: `Prepaid ${liability.name}`,
        fromAccount: 'bank',
        toAccount: 'business',
      });
      
      // Improve karma and reduce stress for debt reduction
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Overview': return <PiggyBank className="w-4 h-4" />;
      case 'Assets': return <TrendingUp className="w-4 h-4" />;
      case 'Liabilities': return <CreditCard className="w-4 h-4" />;
      case 'Analysis': return <Briefcase className="w-4 h-4" />;
      default: return <Wallet className="w-4 h-4" />;
    }
  };

  const filterAssetsByCategory = (category: string) => {
    if (category === 'Real Estate') return assets.filter(asset => asset.category === 'real_estate');
    if (category === 'Investments') return assets.filter(asset => asset.category === 'investment' || asset.category === 'business');
    if (category === 'Vehicles') return assets.filter(asset => asset.category === 'vehicles');
    return assets;
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case 'Overview':
        return (
          <div className="space-y-4">
            {/* New Overview UI - 3 Main Cards */}
            <div className="space-y-4">
              {/* Total Assets Card */}
              <Card className="border border-gray-200 rounded-xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Total Assets</h3>
                  <div className="text-3xl font-bold text-green-600">₹{totalAssetValue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 mt-1">Monthly Income: ₹{monthlyAssetIncome.toLocaleString()}</div>
                </CardContent>
              </Card>

              {/* Total Liabilities Card */}
              <Card className="border border-gray-200 rounded-xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Total Liabilities</h3>
                  <div className="text-3xl font-bold text-red-600">₹{totalLiabilityValue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 mt-1">Monthly EMI: ₹{monthlyLiabilityPayment.toLocaleString()}</div>
                </CardContent>
              </Card>

              {/* Net Worth Card with Visual Indicator */}
              <Card className="border border-gray-200 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Net Worth</h3>
                      <div className={`text-3xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{netWorth.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Assets - Liabilities</div>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-blue-200 flex items-center justify-center">
                      <div className="text-2xl">🏛️</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'Assets':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map(asset => (
              <Card key={asset.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">{asset.icon}</span>
                    {asset.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current Value</span>
                      <div className="font-semibold">₹{asset.value.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Purchase Price</span>
                      <div className="font-semibold">₹{asset.purchasePrice.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Monthly Income</span>
                      <div className="font-semibold text-green-600">₹{asset.monthlyIncome.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Appreciation</span>
                      <div className={`font-semibold ${getAppreciationColor(asset.appreciationRate || 0)}`}>
                        {(asset.appreciationRate || 0) > 0 ? '+' : ''}{(asset.appreciationRate || 0)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 border-t pt-2">
                    {asset.description}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-gray-600">P&L: </span>
                      <span className={`font-semibold ${asset.value >= asset.purchasePrice ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{(asset.value - asset.purchasePrice).toLocaleString()}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSellAsset(asset.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Sell Asset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'Liabilities':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liabilities.map(liability => {
              const progress = ((liability.tenure - liability.remainingMonths) / liability.tenure) * 100;
              const debtRisk = getDebtRisk(liability);
              
              return (
                <Card key={liability.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="text-2xl">{liability.icon}</span>
                      {liability.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Outstanding</span>
                        <div className="font-semibold text-red-600">₹{liability.outstandingAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly EMI</span>
                        <div className="font-semibold">₹{liability.emi.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Interest Rate</span>
                        <div className={`font-semibold ${debtRisk.color}`}>
                          {liability.interestRate}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Remaining</span>
                        <div className="font-semibold">{liability.remainingMonths} months</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`${debtRisk.color} bg-transparent border`}>
                        {debtRisk.level} Risk
                      </Badge>
                      {liability.interestRate > 20 && (
                        <Badge className="bg-red-100 text-red-800">
                          High Interest
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 border-t pt-2">
                      {liability.description}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => handlePrepayLiability(liability.id, 50000)}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={financialData.bankBalance < 50000}
                      >
                        Prepay ₹50K
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handlePrepayLiability(liability.id, liability.outstandingAmount)}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={financialData.bankBalance < liability.outstandingAmount}
                      >
                        Pay Full
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );

      case 'Analysis':
        const assetAllocation = {
          'Real Estate': assets.filter(a => a.category === 'real_estate').reduce((sum, a) => sum + a.value, 0),
          'Investments': assets.filter(a => a.category === 'investment' || a.category === 'business').reduce((sum, a) => sum + a.value, 0),
          'Vehicles': assets.filter(a => a.category === 'vehicles').reduce((sum, a) => sum + a.value, 0),
          'Other': assets.filter(a => !['real_estate', 'investment', 'business', 'vehicles'].includes(a.category)).reduce((sum, a) => sum + a.value, 0)
        };

        return (
          <div className="space-y-6">
            {/* Asset Allocation Chart Placeholder */}
            <Card className="border border-gray-200 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Simple Visual Chart */}
                <div className="space-y-4">
                  {Object.entries(assetAllocation).map(([category, value]) => {
                    const percentage = totalAssetValue > 0 ? (value / totalAssetValue) * 100 : 0;
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category}</span>
                          <div className="text-right">
                            <div className="font-semibold">₹{value.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Financial Health Card */}
            <Card className="border border-gray-200 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Financial Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Debt-to-Asset Ratio</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${(totalLiabilityValue / totalAssetValue) > 0.5 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className={`font-semibold ${(totalLiabilityValue / totalAssetValue) > 0.5 ? 'text-red-600' : 'text-green-600'}`}>
                      {totalAssetValue > 0 ? ((totalLiabilityValue / totalAssetValue) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Monthly Cashflow Coverage</span>
                  <span className={`font-semibold ${monthlyAssetIncome >= monthlyLiabilityPayment ? 'text-green-600' : 'text-red-600'}`}>
                    {monthlyLiabilityPayment > 0 ? ((monthlyAssetIncome / monthlyLiabilityPayment) * 100).toFixed(1) : 100}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Asset Quality</span>
                  <span className="font-semibold text-blue-600">
                    {assets.filter(a => a.monthlyIncome > 0).length}/{assets.length} Income Generating
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Key Financial Terms */}
            <Card className="border border-gray-200 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Key Financial Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-600">Net Worth</h4>
                    <p className="text-xs text-gray-600">Total assets minus total liabilities. Measures your overall financial position.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-blue-600">Debt-to-Asset Ratio</h4>
                    <p className="text-xs text-gray-600">Percentage of your assets financed by debt. Lower is generally better.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-blue-600">Cashflow Coverage</h4>
                    <p className="text-xs text-gray-600">How well your asset income covers your debt payments. Above 100% is ideal.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-blue-600">Asset Quality</h4>
                    <p className="text-xs text-gray-600">The proportion of your assets that generate regular income.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Health Alert */}
            {(totalLiabilityValue / totalAssetValue) > 0.7 && (
              <Card className="border-yellow-500 bg-yellow-50 rounded-xl">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={20} className="text-yellow-600" />
                    <h3 className="font-semibold text-yellow-800">High Debt-to-Asset Ratio</h3>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Your debt-to-asset ratio is {((totalLiabilityValue / totalAssetValue) * 100).toFixed(1)}%. 
                    Consider reducing liabilities or increasing assets to improve financial health.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return <div>Select a category to view details</div>;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Blue background with professional styling */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            {/* Title Section */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-15 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Assets & Liabilities</h1>
                <p className="text-blue-100 text-sm">Portfolio Management & Financial Overview</p>
              </div>
            </div>
            
            {/* Net Worth Display */}
            <div className="text-right text-white">
              <div className="text-sm text-blue-200">Net Worth</div>
              <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                ₹{netWorth.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Menu */}
      <div className="w-full bg-blue-600 border-t border-blue-500">
        <div className="px-4 py-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'bg-transparent text-white hover:bg-blue-500'
                }`}
              >
                {getCategoryIcon(category)}
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AssetsSection;
