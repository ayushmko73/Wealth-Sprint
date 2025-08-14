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

    // Check available balance (Bank + Credit Card)
    const availableBalance = financialData.bankBalance + (financialData.creditCardLimit - financialData.liabilities);
    
    if (amount > availableBalance) {
      toast.error('Insufficient funds in bank account and credit card');
      return;
    }

    // Determine payment method
    let paymentMethod = 'Bank Account';
    if (amount > financialData.bankBalance) {
      paymentMethod = 'Credit Card';
    }

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
        id: `bond_${Date.now()}`,
        type: 'bond_purchase',
        description: `${bond.name} - ${paymentMethod}`,
        amount: -amount,
        category: 'Investment',
        timestamp: new Date(),
        paymentMethod: paymentMethod
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
    <div className="p-4 space-y-6 bg-[#faf8f3] min-h-screen">
      {/* Bond Investment Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <PiggyBank className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#3a3a3a]">Bond Investments</h1>
            <p className="text-gray-600 text-sm">Fixed income • Secure returns • Banking integration</p>
          </div>
        </div>
        
        {/* Available Balance Display */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-green-600" />
            <div className="text-sm">
              <div className="text-gray-500">Bank Balance</div>
              <div className="font-semibold text-green-700">{formatMoney(financialData.bankBalance)}</div>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <div className="text-sm">
              <div className="text-gray-500">Available Credit</div>
              <div className="font-semibold text-blue-700">{formatMoney(financialData.creditCardLimit - financialData.liabilities)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bond Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bondProducts.map((bond) => {
          const isSelected = selectedBond === bond.id;
          const colorClasses = {
            emerald: {
              bg: 'bg-emerald-50',
              border: 'border-emerald-200',
              text: 'text-emerald-800',
              accent: 'bg-emerald-600',
              icon: 'text-emerald-700'
            },
            blue: {
              bg: 'bg-blue-50', 
              border: 'border-blue-200',
              text: 'text-blue-800',
              accent: 'bg-blue-600',
              icon: 'text-blue-700'
            },
            red: {
              bg: 'bg-red-50',
              border: 'border-red-200', 
              text: 'text-red-800',
              accent: 'bg-red-600',
              icon: 'text-red-700'
            }
          };
          
          const colors = colorClasses[bond.color as keyof typeof colorClasses];
          const IconComponent = bond.type === 'Government' ? Shield : bond.type === 'Corporate' ? TrendingUp : AlertTriangle;
          
          return (
            <Card 
              key={bond.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? `${colors.bg} ${colors.border} border-2 shadow-lg` 
                  : 'bg-white border border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedBond(isSelected ? null : bond.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded ${isSelected ? 'bg-white' : colors.bg}`}>
                      <IconComponent className={`w-4 h-4 ${colors.icon}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-[#3a3a3a]">{bond.type.toUpperCase()}</h3>
                      <p className="text-xs text-gray-600">{bond.name}</p>
                    </div>
                  </div>
                  <Badge 
                    className={`${colors.accent} text-white text-xs px-2 py-0.5`}
                  >
                    {bond.risk.split(' ')[0]}
                  </Badge>
                </div>
                
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-white' : 'bg-gray-50'}`}>
                    <div className="text-xs text-gray-500">Annual Yield</div>
                    <div className={`text-lg font-bold ${colors.text}`}>{bond.interestRate}%</div>
                  </div>
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-white' : 'bg-gray-50'}`}>
                    <div className="text-xs text-gray-500">Maturity</div>
                    <div className={`text-lg font-bold ${colors.text}`}>{bond.maturity}T</div>
                  </div>
                </div>
                
                {/* Features */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700">Key Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {bond.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isSelected 
                            ? 'bg-white text-gray-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Investment Range */}
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Min: <span className="font-medium">{formatMoney(bond.minAmount)}</span> • 
                    Max: <span className="font-medium">{formatMoney(bond.maxAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Investment Panel - Only shows when bond is selected */}
      {selectedBond && (
        <Card className="shadow-lg bg-white border border-gray-200">
          <CardHeader className="border-b bg-gradient-to-r from-[#e8dcc6] to-[#FAF4E6]">
            <CardTitle className="flex items-center gap-2 text-[#3a3a3a]">
              <DollarSign className="w-5 h-5" />
              Investment Order - {bondProducts.find(b => b.id === selectedBond)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {(() => {
              const bond = bondProducts.find(b => b.id === selectedBond);
              if (!bond) return null;
              
              const amount = parseInt(investmentAmount) || 0;
              const paymentMethod = amount > financialData.bankBalance ? 'Credit Card' : 'Bank Account';
              
              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bond Details */}
                  <div className="space-y-4">
                    <div className="bg-[#faf8f3] p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Issuer:</span>
                          <div className="font-medium text-[#3a3a3a]">{bond.issuer}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Risk Level:</span>
                          <div className="font-medium text-[#3a3a3a]">{bond.risk}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Interest Rate:</span>
                          <div className="font-medium text-[#3a3a3a]">{bond.interestRate}% p.a.</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Maturity:</span>
                          <div className="font-medium text-[#3a3a3a]">{bond.maturity} Turns</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-[#3a3a3a] block mb-2">
                        Investment Amount
                      </label>
                      <Input
                        type="number"
                        placeholder={`Minimum ${formatMoney(bond.minAmount)}`}
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        className="w-full"
                        min={bond.minAmount}
                        max={bond.maxAmount}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Range: {formatMoney(bond.minAmount)} - {formatMoney(bond.maxAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Investment Summary & Payment */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-800 mb-3">Investment Summary</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Principal Amount:</span>
                          <span className="font-semibold">{formatMoney(amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Annual Interest:</span>
                          <span className="font-semibold">{formatMoney(amount * bond.interestRate / 100)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Maturity Value:</span>
                          <span className="font-semibold text-green-700">
                            {formatMoney(amount * (1 + bond.interestRate / 100))}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment Method Indicator */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">Payment Method</div>
                      <div className="flex items-center gap-2">
                        {paymentMethod === 'Bank Account' ? (
                          <>
                            <Banknote className="w-4 h-4 text-green-600" />
                            <span className="text-green-700 font-medium">Bank Account</span>
                            <span className="text-xs text-gray-500">
                              (Available: {formatMoney(financialData.bankBalance)})
                            </span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-700 font-medium">Credit Card</span>
                            <span className="text-xs text-gray-500">
                              (Available: {formatMoney(financialData.creditCardLimit - financialData.liabilities)})
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleBondPurchase(selectedBond)}
                      disabled={!investmentAmount || amount < bond.minAmount || amount > bond.maxAmount}
                      className="w-full bg-[#d4af37] hover:bg-[#b8941f] text-white font-semibold py-3"
                    >
                      <ArrowDownUp className="w-4 h-4 mr-2" />
                      Invest {formatMoney(amount)} via {paymentMethod}
                    </Button>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Portfolio Overview */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b bg-gradient-to-r from-[#e8dcc6] to-[#FAF4E6]">
          <CardTitle className="flex items-center gap-2 text-[#3a3a3a]">
            <Wallet className="w-5 h-5" />
            Bond Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-600 text-sm font-medium">Total Invested</div>
              <div className="text-xl font-bold text-blue-800">{formatMoney(totalInvested)}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-green-600 text-sm font-medium">Expected Returns</div>
              <div className="text-xl font-bold text-green-800">{formatMoney(expectedReturns)}</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-purple-600 text-sm font-medium">Active Bonds</div>
              <div className="text-xl font-bold text-purple-800">{activeBonds.length}</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-yellow-600 text-sm font-medium">Avg. Yield</div>
              <div className="text-xl font-bold text-yellow-800">
                {activeBonds.length > 0 
                  ? (activeBonds.reduce((sum, bond) => sum + bond.interestRate, 0) / activeBonds.length).toFixed(1)
                  : '0'
                }%
              </div>
            </div>
          </div>

          {/* Active Bonds List */}
          {activeBonds.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-semibold text-[#3a3a3a] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Active Holdings ({activeBonds.length})
              </h4>
              <div className="space-y-2">
                {activeBonds.map((bond) => {
                  const progress = ((bond.maturityTurns - bond.turnsToMature) / bond.maturityTurns) * 100;
                  const maturityValue = bond.investedAmount * (1 + bond.interestRate / 100);
                  
                  return (
                    <div key={bond.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 rounded">
                            <PiggyBank className="w-3 h-3 text-blue-600" />
                          </div>
                          <div>
                            <span className="font-medium text-sm text-[#3a3a3a]">{bond.type} Bond</span>
                            <Badge className="ml-2 bg-blue-600 text-white text-xs">
                              {bond.interestRate}%
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-gray-600">{bond.turnsToMature} turns left</div>
                          <div className="font-semibold text-[#3a3a3a]">
                            {formatMoney(bond.investedAmount)} → {formatMoney(maturityValue)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Progress to Maturity</span>
                          <span>{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <PiggyBank className="w-16 h-16 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No active bond investments</p>
              <p className="text-sm">Select a bond above to start building your fixed income portfolio</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BondsSection;