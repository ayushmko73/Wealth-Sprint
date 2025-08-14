import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Input } from '../../ui/input';
import { formatMoney } from '../../../lib/utils/formatMoney';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  PiggyBank,
  CreditCard,
  Banknote,
  Wallet,
  ArrowDownUp,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const BondsSection: React.FC = () => {
  const { 
    financialData, 
    playerStats, 
    purchaseBond, 
    addTransaction 
  } = useWealthSprintGame();
  
  const [selectedBond, setSelectedBond] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  // Bond data with enhanced banking integration
  const bondProducts = [
    {
      id: 'gov-bond-1',
      name: 'Government Savings Bond',
      issuer: 'Reserve Bank of India',
      type: 'Government',
      interestRate: 4.5,
      maturity: 12,
      minAmount: 10000,
      maxAmount: 500000,
      risk: 'Low Risk',
      riskLevel: 1,
      features: ['Tax Free', 'Government Backed', 'Early Exit Option'],
      description: 'Sovereign guaranteed bond with tax benefits',
      color: 'emerald'
    },
    {
      id: 'corp-bond-1', 
      name: 'Corporate Fixed Deposit Bond',
      issuer: 'HDFC Bank Limited',
      type: 'Corporate',
      interestRate: 8.2,
      maturity: 8,
      minAmount: 25000,
      maxAmount: 1000000,
      risk: 'Medium Risk',
      riskLevel: 2,
      features: ['Higher Returns', 'AAA Rating', 'Quarterly Interest'],
      description: 'Premium corporate bond from leading bank',
      color: 'blue'
    },
    {
      id: 'high-yield-1',
      name: 'High Yield Corporate Bond',
      issuer: 'Emerging Finance Corp',
      type: 'High Yield',
      interestRate: 14.5,
      maturity: 4,
      minAmount: 50000,
      maxAmount: 2000000,
      risk: 'High Risk', 
      riskLevel: 3,
      features: ['Premium Returns', 'Short Term', 'High Liquidity'],
      description: 'High yield bond for aggressive investors',
      color: 'red'
    }
  ];

  // Banking Integration Functions
  const handleBondPurchase = (bondId: string) => {
    const bond = bondProducts.find(b => b.id === bondId);
    if (!bond) return;

    const amount = parseInt(investmentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid investment amount');
      return;
    }

    if (amount < bond.minAmount) {
      toast.error(`Minimum investment required: ${formatMoney(bond.minAmount)}`);
      return;
    }

    if (amount > bond.maxAmount) {
      toast.error(`Maximum investment limit: ${formatMoney(bond.maxAmount)}`);
      return;
    }

    // Check available balance (Bank only for bonds)
    const availableBalance = financialData.bankBalance;
    
    if (amount > availableBalance) {
      toast.error('Insufficient funds in bank account and credit card');
      return;
    }

    // Determine payment method (only bank for bonds)
    let paymentMethod = 'Bank Account';

    // Convert to old format for existing purchaseBond function
    let bondType: 'Government' | 'Corporate' | 'Junk';
    if (bond.type === 'Government') bondType = 'Government';
    else if (bond.type === 'Corporate') bondType = 'Corporate';
    else bondType = 'Junk';

    if (purchaseBond(bondType, amount)) {
      toast.success(`Bond purchased via ${paymentMethod} for ${formatMoney(amount)}`);
      setInvestmentAmount('');
      setSelectedBond(null);
      
      // Add transaction record
      addTransaction({
        type: 'bond_purchase',
        description: `${bond.name} - ${paymentMethod}`,
        amount: -amount,
        fromAccount: 'bank',
        toAccount: 'business'
      });
    } else {
      toast.error('Bond purchase failed');
    }
  };

  const activeBonds = financialData.bondPortfolio.filter(bond => bond.status === 'active');
  const totalInvested = activeBonds.reduce((sum, bond) => sum + bond.investedAmount, 0);
  const expectedReturns = activeBonds.reduce((sum, bond) => 
    sum + (bond.investedAmount * (1 + bond.interestRate / 100)), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Professional Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg border-b border-blue-500">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Bond Portfolio</h1>
                <p className="text-blue-100 text-sm">Fixed Income • Secure Returns • Diversified Holdings</p>
              </div>
            </div>
            
            {/* Compact Balance Summary */}
            <div className="bg-white bg-opacity-15 rounded-lg px-4 py-2">
              <div className="flex items-center gap-4 text-white text-sm">
                <div className="flex items-center gap-1">
                  <Banknote className="w-4 h-4 text-blue-200" />
                  <span className="text-blue-200">Bank:</span>
                  <span className="font-bold">{formatMoney(financialData.bankBalance)}</span>
                </div>
                <div className="w-px h-4 bg-blue-300"></div>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4 text-blue-200" />
                  <span className="text-blue-200">Liabilities:</span>
                  <span className="font-bold">{formatMoney(financialData.totalLiabilities)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Portfolio Overview with Compact Cards */}
      <div className="p-4 space-y-4">
        {/* Portfolio Performance Summary */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center">
                <div className="text-blue-600 text-sm font-medium">Total Invested</div>
                <div className="text-lg font-bold text-blue-800">{formatMoney(totalInvested)}</div>
              </div>
              <div className="text-center">
                <div className="text-green-600 text-sm font-medium">Expected Returns</div>
                <div className="text-lg font-bold text-green-800">{formatMoney(expectedReturns)}</div>
              </div>
              <div className="text-center">
                <div className="text-purple-600 text-sm font-medium">Active Bonds</div>
                <div className="text-lg font-bold text-purple-800">{activeBonds.length}</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-600 text-sm font-medium">Avg. Yield</div>
                <div className="text-lg font-bold text-yellow-800">
                  {activeBonds.length > 0 
                    ? (activeBonds.reduce((sum, bond) => sum + bond.interestRate, 0) / activeBonds.length).toFixed(1)
                    : '0'
                  }%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact Bond Products */}
        <div className="space-y-3">
          {bondProducts.map((bond) => {
            const isSelected = selectedBond === bond.id;
            const colorClasses = {
              emerald: {
                bg: 'from-emerald-50 to-teal-50',
                border: 'border-emerald-300',
                accent: 'bg-emerald-600',
                text: 'text-emerald-800',
                badge: 'bg-emerald-100 text-emerald-800'
              },
              blue: {
                bg: 'from-blue-50 to-cyan-50', 
                border: 'border-blue-300',
                accent: 'bg-blue-600',
                text: 'text-blue-800',
                badge: 'bg-blue-100 text-blue-800'
              },
              red: {
                bg: 'from-red-50 to-pink-50',
                border: 'border-red-300', 
                accent: 'bg-red-600',
                text: 'text-red-800',
                badge: 'bg-red-100 text-red-800'
              }
            };
            
            const colors = colorClasses[bond.color as keyof typeof colorClasses];
            const IconComponent = bond.type === 'Government' ? Shield : bond.type === 'Corporate' ? TrendingUp : AlertTriangle;
            
            return (
              <Card 
                key={bond.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected 
                    ? `bg-gradient-to-r ${colors.bg} ${colors.border} border-2 shadow-lg` 
                    : 'bg-white border border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedBond(isSelected ? null : bond.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    {/* Left Side - Bond Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                        <IconComponent className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800">{bond.type.toUpperCase()}</h3>
                          <Badge className={`${colors.badge} text-xs px-2 py-0.5 border-0`}>
                            {bond.risk.split(' ')[0]}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{bond.name}</p>
                        <div className="flex flex-wrap gap-1">
                          {bond.features.slice(0, 3).map((feature, idx) => (
                            <span 
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Side - Key Metrics */}
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Annual Yield</div>
                        <div className={`text-xl font-bold ${colors.text}`}>{bond.interestRate}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Maturity</div>
                        <div className={`text-xl font-bold ${colors.text}`}>{bond.maturity}T</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Min Amount</div>
                        <div className="text-sm font-semibold text-gray-700">{formatMoney(bond.minAmount)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Streamlined Investment Panel */}
      {selectedBond && (
        <div className="px-4">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="w-5 h-5" />
                Quick Investment - {bondProducts.find(b => b.id === selectedBond)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              {(() => {
                const bond = bondProducts.find(b => b.id === selectedBond);
                if (!bond) return null;
                
                const amount = parseInt(investmentAmount) || 0;
                const paymentMethod = 'Bank Account';
                
                return (
                  <div className="space-y-4">
                    {/* Compact Bond Info */}
                    <div className="bg-white bg-opacity-10 rounded-lg p-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-blue-100">
                        <div>
                          <div className="text-blue-200">Issuer</div>
                          <div className="font-medium text-white">{bond.issuer}</div>
                        </div>
                        <div>
                          <div className="text-blue-200">Risk</div>
                          <div className="font-medium text-white">{bond.risk}</div>
                        </div>
                        <div>
                          <div className="text-blue-200">Rate</div>
                          <div className="font-medium text-white">{bond.interestRate}% p.a.</div>
                        </div>
                        <div>
                          <div className="text-blue-200">Maturity</div>
                          <div className="font-medium text-white">{bond.maturity} Turns</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Investment Input & Summary Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-blue-200 text-sm block mb-2">Investment Amount</label>
                        <Input
                          type="number"
                          placeholder={`Min ${formatMoney(bond.minAmount)}`}
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(e.target.value)}
                          className="bg-white bg-opacity-20 border-blue-400 text-white placeholder-blue-200 focus:border-white"
                          min={bond.minAmount}
                          max={bond.maxAmount}
                        />
                        <div className="text-xs text-blue-200 mt-1">
                          Range: {formatMoney(bond.minAmount)} - {formatMoney(bond.maxAmount)}
                        </div>
                      </div>

                      {/* Quick Summary */}
                      <div className="bg-white bg-opacity-10 rounded-lg p-3">
                        <div className="text-xs text-blue-200 mb-2">Investment Preview</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between text-blue-100">
                            <span>Principal:</span>
                            <span className="font-semibold text-white">{formatMoney(amount)}</span>
                          </div>
                          <div className="flex justify-between text-blue-100">
                            <span>Returns:</span>
                            <span className="font-semibold text-green-300">
                              {formatMoney(amount * (bond.interestRate / 100))}
                            </span>
                          </div>
                          <div className="flex justify-between text-blue-100 border-t border-blue-400 pt-1">
                            <span>Total Value:</span>
                            <span className="font-bold text-green-300">
                              {formatMoney(amount * (1 + bond.interestRate / 100))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-blue-200">
                        <Banknote className="w-4 h-4" />
                        <span>Bank Account ({formatMoney(financialData.bankBalance)})</span>
                      </div>
                      
                      <Button
                        onClick={() => handleBondPurchase(selectedBond)}
                        disabled={!investmentAmount || amount < bond.minAmount || amount > bond.maxAmount}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 border-0"
                      >
                        <ArrowDownUp className="w-4 h-4 mr-2" />
                        Invest Now
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Holdings Section */}
      {activeBonds.length > 0 && (
        <div className="px-4 pb-4">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Active Holdings ({activeBonds.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {activeBonds.map((bond) => {
                  const progress = ((8 - bond.turnsToMature) / 8) * 100;
                  const maturityValue = bond.investedAmount * (1 + bond.interestRate / 100);
                  
                  return (
                    <div key={bond.id} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <PiggyBank className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">{bond.type} Bond</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5">
                                {bond.interestRate}% APR
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {bond.turnsToMature} turns remaining
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Investment Value</div>
                          <div className="font-bold text-lg text-gray-800">
                            {formatMoney(bond.investedAmount)} → <span className="text-green-600">{formatMoney(maturityValue)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Progress to Maturity</span>
                          <span className="font-medium">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-gray-200" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BondsSection;