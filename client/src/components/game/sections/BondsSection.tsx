import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Input } from '../../ui/input';
import { formatMoney } from '../../../lib/utils/formatMoney';
import { 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Target, 
  PiggyBank,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

const BondsSection: React.FC = () => {
  const { 
    financialData, 
    playerStats, 
    purchaseBond, 
    addTransaction 
  } = useWealthSprintGame();
  
  const [selectedBondType, setSelectedBondType] = useState<'Government' | 'Corporate' | 'Junk'>('Government');
  const [purchaseAmount, setPurchaseAmount] = useState('');

  const bondTypes = {
    Government: {
      name: 'Government Bond',
      shortName: 'GOV',
      icon: Shield,
      gradient: 'from-green-600 to-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      badgeColor: 'bg-green-500',
      interestRate: 4,
      maturityTurns: 12,
      risk: 'Low',
      riskScore: 1,
      minInvestment: 10000,
      issuer: 'Government of India',
      description: 'Safest investment backed by sovereign guarantee',
      features: ['Tax Benefits', 'Capital Protection', 'Sovereign Backed']
    },
    Corporate: {
      name: 'Corporate Bond',
      shortName: 'CORP',
      icon: TrendingUp,
      gradient: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      badgeColor: 'bg-blue-500',
      interestRate: 8,
      maturityTurns: 8,
      risk: 'Medium',
      riskScore: 2,
      minInvestment: 25000,
      issuer: 'AAA Rated Companies',
      description: 'Higher returns from established corporates',
      features: ['Regular Income', 'Credit Rating AAA', 'Liquid Market']
    },
    Junk: {
      name: 'High Yield Bond',
      shortName: 'HY',
      icon: AlertTriangle,
      gradient: 'from-orange-600 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      badgeColor: 'bg-red-500',
      interestRate: 15,
      maturityTurns: 4,
      risk: 'High',
      riskScore: 3,
      minInvestment: 50000,
      issuer: 'Emerging Companies',
      description: 'Premium returns with higher credit risk',
      features: ['High Yield', 'Short Tenure', '10% Default Risk']
    }
  };

  const handlePurchase = () => {
    const amount = parseInt(purchaseAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (amount > financialData.bankBalance) {
      toast.error('Insufficient bank balance');
      return;
    }
    
    if (purchaseBond(selectedBondType, amount)) {
      toast.success(`Successfully purchased ${bondTypes[selectedBondType].name} for ${formatMoney(amount)}`);
      setPurchaseAmount('');
    } else {
      toast.error('Failed to purchase bond');
    }
  };

  const activeBonds = financialData.bondPortfolio.filter(bond => bond.status === 'active');
  const maturedBonds = financialData.bondPortfolio.filter(bond => bond.status === 'matured');
  const defaultedBonds = financialData.bondPortfolio.filter(bond => bond.status === 'defaulted');

  const totalBondValue = activeBonds.reduce((sum, bond) => sum + bond.investedAmount, 0);
  const expectedReturns = activeBonds.reduce((sum, bond) => 
    sum + (bond.investedAmount * (1 + bond.interestRate / 100)), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Professional Bond Market Header */}
      <div className="w-full bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 shadow-xl border-b border-slate-500">
        <div className="px-4 py-3">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-white bg-opacity-20 p-1.5 rounded">
                <PiggyBank className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Professional Bond Market</h2>
                <p className="text-slate-100 text-xs">Fixed income investments • Secure returns</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500 text-white px-2 py-1 text-xs font-semibold">
                OPEN
              </Badge>
              <div className="text-right text-white text-xs">
                <div className="text-slate-200">Portfolio</div>
                <div className="font-semibold">{formatMoney(totalBondValue)}</div>
              </div>
            </div>
          </div>
          
          {/* Market Summary */}
          <div className="flex items-center justify-between bg-white bg-opacity-15 rounded-lg px-3 py-1.5">
            <div className="flex items-center gap-4 text-white text-sm">
              <div className="flex items-center gap-1">
                <span className="text-slate-200">10Y Yield:</span>
                <span className="font-bold">7.24%</span>
                <span className="text-green-300 text-xs">+0.02%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-200">Credit Spread:</span>
                <span className="font-bold">1.85%</span>
                <span className="text-red-300 text-xs">-0.05%</span>
              </div>
            </div>
            <div className="text-white text-xs">
              <span className="text-slate-200">Available:</span>
              <span className="ml-1 font-medium">{formatMoney(financialData.bankBalance)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Professional Bond Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Object.entries(bondTypes).map(([type, info]) => {
            const Icon = info.icon;
            const isSelected = selectedBondType === type;
            
            return (
              <Card 
                key={type}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  isSelected 
                    ? `bg-gradient-to-br ${info.gradient} text-white border-white shadow-xl` 
                    : `${info.bgColor} ${info.borderColor} hover:shadow-md`
                }`}
                onClick={() => setSelectedBondType(type as any)}
              >
                <CardContent className="p-4">
                  {/* Bond Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-white bg-opacity-20' : 'bg-white'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : info.textColor}`} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {info.shortName}
                        </h3>
                        <p className={`text-xs ${isSelected ? 'text-white text-opacity-80' : 'text-slate-600'}`}>
                          {info.name}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className={`${
                        isSelected 
                          ? 'bg-white bg-opacity-20 text-white' 
                          : `${info.badgeColor} text-white`
                      } text-xs font-semibold`}
                    >
                      {info.risk}
                    </Badge>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className={`p-2 rounded ${isSelected ? 'bg-white bg-opacity-10' : 'bg-white'}`}>
                      <div className={`text-xs ${isSelected ? 'text-white text-opacity-80' : 'text-slate-600'}`}>
                        Annual Yield
                      </div>
                      <div className={`text-lg font-bold ${isSelected ? 'text-white' : info.textColor}`}>
                        {info.interestRate}%
                      </div>
                    </div>
                    <div className={`p-2 rounded ${isSelected ? 'bg-white bg-opacity-10' : 'bg-white'}`}>
                      <div className={`text-xs ${isSelected ? 'text-white text-opacity-80' : 'text-slate-600'}`}>
                        Maturity
                      </div>
                      <div className={`text-lg font-bold ${isSelected ? 'text-white' : info.textColor}`}>
                        {info.maturityTurns}T
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-1">
                    <div className={`text-xs font-medium ${isSelected ? 'text-white text-opacity-90' : 'text-slate-700'}`}>
                      Key Features:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {info.features.map((feature, index) => (
                        <span 
                          key={index}
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isSelected 
                              ? 'bg-white bg-opacity-20 text-white' 
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Min Investment */}
                  <div className="mt-3 pt-2 border-t border-white border-opacity-20">
                    <div className={`text-xs ${isSelected ? 'text-white text-opacity-80' : 'text-slate-600'}`}>
                      Min. Investment: <span className="font-semibold">{formatMoney(info.minInvestment)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Investment Panel */}
        <Card className="shadow-lg border border-slate-200">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <DollarSign className="w-5 h-5" />
              Investment Order - {bondTypes[selectedBondType].name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Investment Details */}
              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-600">Issuer:</span>
                      <div className="font-semibold">{bondTypes[selectedBondType].issuer}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Rating:</span>
                      <div className="font-semibold">AAA</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Coupon:</span>
                      <div className="font-semibold">{bondTypes[selectedBondType].interestRate}% p.a.</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Tenure:</span>
                      <div className="font-semibold">{bondTypes[selectedBondType].maturityTurns} Turns</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Investment Amount
                  </label>
                  <Input
                    type="number"
                    placeholder={`Min. ${formatMoney(bondTypes[selectedBondType].minInvestment)}`}
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-800 mb-2">Order Summary</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Investment:</span>
                      <span className="font-semibold">{formatMoney(parseInt(purchaseAmount) || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Annual Returns:</span>
                      <span className="font-semibold">{formatMoney((parseInt(purchaseAmount) || 0) * bondTypes[selectedBondType].interestRate / 100)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Maturity Value:</span>
                      <span className="font-semibold text-green-700">{formatMoney((parseInt(purchaseAmount) || 0) * (1 + bondTypes[selectedBondType].interestRate / 100))}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePurchase}
                  disabled={!purchaseAmount || parseInt(purchaseAmount) < bondTypes[selectedBondType].minInvestment}
                  className={`w-full bg-gradient-to-r ${bondTypes[selectedBondType].gradient} hover:shadow-lg text-white font-semibold py-2.5`}
                >
                  Purchase Bond - {formatMoney(parseInt(purchaseAmount) || 0)}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Overview */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <BarChart3 className="w-5 h-5" />
              Bond Portfolio Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <div className="text-blue-600 text-sm font-medium">Total Invested</div>
                <div className="text-xl font-bold text-blue-800">{formatMoney(totalBondValue)}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                <div className="text-green-600 text-sm font-medium">Expected Returns</div>
                <div className="text-xl font-bold text-green-800">{formatMoney(expectedReturns)}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                <div className="text-slate-600 text-sm font-medium">Active Bonds</div>
                <div className="text-xl font-bold text-slate-800">{activeBonds.length}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                <div className="text-purple-600 text-sm font-medium">Avg. Yield</div>
                <div className="text-xl font-bold text-purple-800">
                  {activeBonds.length > 0 
                    ? (activeBonds.reduce((sum, bond) => sum + bond.interestRate, 0) / activeBonds.length).toFixed(1)
                    : '0'
                  }%
                </div>
              </div>
            </div>

            {/* Active Bonds List */}
            {activeBonds.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Active Holdings ({activeBonds.length})
                </h4>
                <div className="space-y-2">
                  {activeBonds.map((bond) => {
                    const bondInfo = bondTypes[bond.type];
                    const Icon = bondInfo.icon;
                    const maturityProgress = ((bondInfo.maturityTurns - bond.turnsToMature) / bondInfo.maturityTurns) * 100;
                    const expectedReturn = bond.investedAmount * (1 + bond.interestRate / 100);
                    
                    return (
                      <div key={bond.id} className={`p-3 rounded-lg border ${bondInfo.borderColor} ${bondInfo.bgColor}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${bondInfo.textColor}`} />
                            <span className="font-medium text-sm">{bondInfo.shortName}</span>
                            <Badge className={`${bondInfo.badgeColor} text-white text-xs`}>
                              {bond.interestRate}%
                            </Badge>
                          </div>
                          <div className="text-right text-sm">
                            <div className="text-slate-600">{bond.turnsToMature}T left</div>
                            <div className="font-semibold text-slate-900">
                              {formatMoney(bond.investedAmount)} → {formatMoney(expectedReturn)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-600">
                            <span>Maturity Progress</span>
                            <span>{maturityProgress.toFixed(1)}%</span>
                          </div>
                          <Progress value={maturityProgress} className="h-1.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeBonds.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <PiggyBank className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No active bonds in your portfolio</p>
                <p className="text-sm">Purchase your first bond to start earning fixed returns</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BondsSection;