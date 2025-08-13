import React, { useState } from 'react';
import { useWealthSprintGame, Asset, Liability } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Home, TrendingUp, Car, Briefcase, Minus, Plus, AlertTriangle } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'assets' | 'liabilities'>('assets');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedLiability, setSelectedLiability] = useState<string | null>(null);

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

  const getCategoryIcon = (category: string) => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#3a3a3a]">Assets & Liabilities</h1>
        <div className="flex items-center gap-6">
          <div className="text-sm">
            <span className="text-gray-600">Net Worth: </span>
            <span className={`font-semibold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{netWorth.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalAssetValue.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Monthly Income: ₹{monthlyAssetIncome.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalLiabilityValue.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Monthly EMI: ₹{monthlyLiabilityPayment.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{netWorth.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Assets - Liabilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Cashflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(monthlyAssetIncome - monthlyLiabilityPayment) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{(monthlyAssetIncome - monthlyLiabilityPayment).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Monthly Net Income</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'assets' | 'liabilities')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <TrendingUp size={16} />
            Assets ({assets.length})
          </TabsTrigger>
          <TabsTrigger value="liabilities" className="flex items-center gap-2">
            <Minus size={16} />
            Liabilities ({liabilities.length})
          </TabsTrigger>
        </TabsList>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-4">
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
        </TabsContent>

        {/* Liabilities Tab */}
        <TabsContent value="liabilities" className="space-y-4">
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
        </TabsContent>
      </Tabs>

      {/* Financial Health Alert */}
      {(totalLiabilityValue / totalAssetValue) > 0.7 && (
        <Card className="border-yellow-500 bg-yellow-50">
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
};

export default AssetsSection;
