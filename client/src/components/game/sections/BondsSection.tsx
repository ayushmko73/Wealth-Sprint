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

  // Dynamic bond calculator function
  const calculateBondReturns = (principalAmount: number, bondType: 'government' | 'corporate' | 'high_yield') => {
    // Set interest rate and maturity ranges based on bond type
    const bondRanges = {
      government: { 
        interestMin: 7, interestMax: 18, 
        maturityMin: 12, maturityMax: 36 
      },
      corporate: { 
        interestMin: 9, interestMax: 20, 
        maturityMin: 12, maturityMax: 36 
      },
      high_yield: { 
        interestMin: 12, interestMax: 25, 
        maturityMin: 12, maturityMax: 36 
      }
    };

    const range = bondRanges[bondType];
    
    // Randomly select interest rate and maturity within ranges
    const interestRate = Math.random() * (range.interestMax - range.interestMin) + range.interestMin;
    const maturityMonths = Math.floor(Math.random() * (range.maturityMax - range.maturityMin + 1)) + range.maturityMin;
    
    let totalReturn;
    
    if (bondType === 'high_yield') {
      // Apply risk factor for high yield bonds
      const riskFactor = Math.random() * 0.5 + 0.5; // Between 0.5 and 1.0
      totalReturn = principalAmount * (1 + (interestRate * maturityMonths / 12) / 100) * riskFactor;
    } else {
      totalReturn = principalAmount * (1 + (interestRate * maturityMonths / 12) / 100);
    }

    return {
      interestRate: parseFloat(interestRate.toFixed(1)),
      maturityMonths,
      totalReturn: parseFloat(totalReturn.toFixed(2))
    };
  };

  // Generate dynamic bond products with realistic calculator
  const generateBondProduct = (id: string, type: 'government' | 'corporate' | 'high_yield') => {
    const sample = calculateBondReturns(100000, type); // Sample calculation for display
    
    const bondDetails = {
      government: {
        name: 'Government Savings Bond',
        issuer: 'Reserve Bank of India',
        minAmount: 10000,
        maxAmount: 500000,
        risk: 'Low Risk',
        riskLevel: 1,
        features: ['Tax Free', 'Government Backed', 'Early Exit Option'],
        description: 'Sovereign guaranteed bond with tax benefits',
        color: 'emerald'
      },
      corporate: {
        name: 'Corporate Fixed Deposit Bond',
        issuer: 'HDFC Bank Limited',
        minAmount: 25000,
        maxAmount: 1000000,
        risk: 'Medium Risk',
        riskLevel: 2,
        features: ['Higher Returns', 'AAA Rating', 'Quarterly Interest'],
        description: 'Premium corporate bond from leading bank',
        color: 'blue'
      },
      high_yield: {
        name: 'High Yield Corporate Bond',
        issuer: 'Emerging Finance Corp',
        minAmount: 50000,
        maxAmount: 2000000,
        risk: 'High Risk',
        riskLevel: 3,
        features: ['Premium Returns', 'Short Term', 'High Liquidity'],
        description: 'High yield bond for aggressive investors',
        color: 'red'
      }
    };

    const details = bondDetails[type];
    
    return {
      id,
      type: type === 'government' ? 'Government' : type === 'corporate' ? 'Corporate' : 'High Yield',
      ...details,
      interestRate: sample.interestRate,
      maturity: sample.maturityMonths
    };
  };

  // Bond products with dynamic generation
  const bondProducts = [
    generateBondProduct('gov-bond-1', 'government'),
    generateBondProduct('corp-bond-1', 'corporate'),
    generateBondProduct('high-yield-1', 'high_yield')
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
    <div className="min-h-screen bg-white">
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
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-blue-600 text-xs font-medium">Total Invested</div>
                <div className="text-base font-bold text-blue-800 sm:text-lg">{formatMoney(totalInvested)}</div>
              </div>
              <div className="text-center">
                <div className="text-green-600 text-xs font-medium">Expected Returns</div>
                <div className="text-base font-bold text-green-800 sm:text-lg">{formatMoney(expectedReturns)}</div>
              </div>
              <div className="text-center">
                <div className="text-purple-600 text-xs font-medium">Active Bonds</div>
                <div className="text-base font-bold text-purple-800 sm:text-lg">{activeBonds.length}</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-600 text-xs font-medium">Avg. Yield</div>
                <div className="text-base font-bold text-yellow-800 sm:text-lg">
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
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-3">
                    {/* Top Row - Bond Type and Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                          <IconComponent className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-sm">{bond.type.toUpperCase()}</h3>
                          <p className="text-xs text-gray-600">{bond.name}</p>
                        </div>
                      </div>
                      <Badge className={`${colors.badge} text-xs px-2 py-0.5 border-0`}>
                        {bond.risk.split(' ')[0]}
                      </Badge>
                    </div>
                    
                    {/* Middle Row - Key Metrics */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Annual Yield</div>
                        <div className={`text-lg font-bold ${colors.text}`}>{bond.interestRate}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Maturity</div>
                        <div className={`text-lg font-bold ${colors.text}`}>{bond.maturity}M</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Min Amount</div>
                        <div className="text-sm font-semibold text-gray-700">{formatMoney(bond.minAmount)}</div>
                      </div>
                    </div>
                    
                    {/* Bottom Row - Features */}
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
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <DollarSign className="w-5 h-5" />
                Quick Investment - {bondProducts.find(b => b.id === selectedBond)?.type} Fixed Deposit Bond
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              {(() => {
                const bond = bondProducts.find(b => b.id === selectedBond);
                if (!bond) return null;
                
                const amount = parseInt(investmentAmount) || 0;
                
                return (
                  <div className="space-y-3">
                    {/* Compact Bond Info Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-blue-200 text-xs">Issuer</div>
                        <div className="font-medium text-white">{bond.issuer}</div>
                      </div>
                      <div>
                        <div className="text-blue-200 text-xs">Risk</div>
                        <div className="font-medium text-white">{bond.risk}</div>
                      </div>
                      <div>
                        <div className="text-blue-200 text-xs">Rate</div>
                        <div className="font-medium text-white">{bond.interestRate}% p.a.</div>
                      </div>
                      <div>
                        <div className="text-blue-200 text-xs">Maturity</div>
                        <div className="font-medium text-white">{bond.maturity} Months</div>
                      </div>
                    </div>
                    
                    {/* Investment Amount Input */}
                    <div>
                      <label className="text-blue-200 text-sm block mb-1">Investment Amount</label>
                      <Input
                        type="number"
                        placeholder={`Min ${formatMoney(bond.minAmount)}`}
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        className="bg-white bg-opacity-20 border-blue-400 text-white placeholder-blue-200 focus:border-white w-full text-lg font-bold"
                        min={bond.minAmount}
                        max={bond.maxAmount}
                      />
                      <div className="text-xs text-blue-200 mt-1">
                        Range: {formatMoney(bond.minAmount)} - {formatMoney(bond.maxAmount)}
                      </div>
                    </div>

                    {/* Investment Preview */}
                    <div className="text-sm">
                      <div className="text-blue-200 text-xs mb-2">Investment Preview</div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-blue-200 text-xs">Principal</div>
                          <div className="font-bold text-white">{formatMoney(amount)}</div>
                        </div>
                        <div>
                          <div className="text-blue-200 text-xs">Returns</div>
                          <div className="font-bold text-green-300">{formatMoney(amount * (bond.interestRate / 100))}</div>
                        </div>
                        <div>
                          <div className="text-blue-200 text-xs">Total Value</div>
                          <div className="font-bold text-green-300">{formatMoney(amount * (1 + bond.interestRate / 100))}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Row */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-sm text-blue-200">
                        <Banknote className="w-4 h-4" />
                        <span>Bank Account ({formatMoney(financialData.bankBalance)})</span>
                      </div>
                      
                      <Button
                        onClick={() => handleBondPurchase(selectedBond)}
                        disabled={!investmentAmount || amount < bond.minAmount || amount > bond.maxAmount}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 border-0"
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
                    <div key={bond.id} className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg border border-gray-100">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 rounded-lg">
                              <PiggyBank className="w-3 h-3 text-blue-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-800 text-sm">{bond.type} Bond</span>
                              <div className="flex items-center gap-1 mt-1">
                                <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5">
                                  {bond.interestRate}% APR
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {bond.turnsToMature} months left
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-xs text-gray-600 mb-1">Investment Value</div>
                          <div className="font-bold text-base text-gray-800">
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