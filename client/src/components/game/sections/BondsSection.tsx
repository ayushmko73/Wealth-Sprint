import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Input } from '../../ui/input';
import { formatMoney } from '../../../lib/utils/formatMoney';
import { TrendingUp, Shield, AlertTriangle, Clock, DollarSign, Target } from 'lucide-react';
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
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-green-100 border-green-200',
      badgeColor: 'bg-green-500',
      interestRate: 4,
      maturityTurns: 12,
      risk: 'Low',
      description: 'Safest investment backed by government guarantee'
    },
    Corporate: {
      name: 'Corporate Bond',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-blue-100 border-blue-200',
      badgeColor: 'bg-blue-500',
      interestRate: 8,
      maturityTurns: 8,
      risk: 'Medium',
      description: 'Higher returns from established companies'
    },
    Junk: {
      name: 'Junk Bond',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'bg-red-100 border-red-200',
      badgeColor: 'bg-red-500',
      interestRate: 15,
      maturityTurns: 4,
      risk: 'High',
      description: 'High risk, high reward - 10% default chance'
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#3a3a3a]">Bond Investments</h1>
        <div className="flex items-center gap-4">
          <Badge className="bg-[#d4af37] text-white">
            {formatMoney(totalBondValue)} Invested
          </Badge>
          <Badge className="bg-green-600 text-white">
            {formatMoney(expectedReturns)} Expected
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Purchase Bonds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Purchase Bonds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Bank Balance: {formatMoney(financialData.bankBalance)}
              </div>
              
              {/* Bond Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Bond Type:</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(bondTypes).map(([type, info]) => (
                    <button
                      key={type}
                      onClick={() => setSelectedBondType(type as any)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        selectedBondType === type 
                          ? 'border-[#d4af37] bg-[#d4af37] bg-opacity-10' 
                          : info.color
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {info.icon}
                          <span className="font-medium">{info.name}</span>
                        </div>
                        <Badge className={`${info.badgeColor} text-white text-xs`}>
                          {info.risk} Risk
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{info.description}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Returns:</span>
                          <span className="font-medium ml-1">{info.interestRate}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Maturity:</span>
                          <span className="font-medium ml-1">{info.maturityTurns} turns</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Purchase Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Investment Amount:</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Purchase Button */}
              <Button
                onClick={handlePurchase}
                disabled={!purchaseAmount || parseInt(purchaseAmount) <= 0}
                className="w-full bg-[#d4af37] hover:bg-[#b8941f]"
              >
                Purchase {bondTypes[selectedBondType].name}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Portfolio Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600">Total Invested</div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatMoney(totalBondValue)}
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600">Expected Returns</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatMoney(expectedReturns)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-gray-600">Active</div>
                  <div className="font-bold">{activeBonds.length}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">Matured</div>
                  <div className="font-bold text-green-600">{maturedBonds.length}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">Defaulted</div>
                  <div className="font-bold text-red-600">{defaultedBonds.length}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Bonds */}
      {activeBonds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Active Bonds ({activeBonds.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeBonds.map((bond) => {
                const bondInfo = bondTypes[bond.type];
                const maturityProgress = ((bondInfo.maturityTurns - bond.turnsToMature) / bondInfo.maturityTurns) * 100;
                const expectedReturn = bond.investedAmount * (1 + bond.interestRate / 100);
                
                return (
                  <div key={bond.id} className={`p-4 rounded-lg border ${bondInfo.color}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {bondInfo.icon}
                        <span className="font-medium">{bondInfo.name}</span>
                        <Badge className={`${bondInfo.badgeColor} text-white text-xs`}>
                          {bond.interestRate}%
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {bond.turnsToMature} turns left
                        </div>
                        <div className="font-medium">
                          {formatMoney(bond.investedAmount)} → {formatMoney(expectedReturn)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Maturity Progress</span>
                        <span>{maturityProgress.toFixed(1)}%</span>
                      </div>
                      <Progress value={maturityProgress} className="h-2" />
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Purchased: {bond.purchaseDate instanceof Date ? bond.purchaseDate.toLocaleDateString() : new Date(bond.purchaseDate).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bond Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {financialData.transactionHistory
              .filter(tx => tx.type === 'bond_purchase' || tx.type === 'bond_maturity')
              .slice(0, 10)
              .map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-sm">{transaction.description}</div>
                    <div className="text-xs text-gray-500">
                      {transaction.timestamp instanceof Date ? transaction.timestamp.toLocaleDateString() : new Date(transaction.timestamp).toLocaleDateString()} {transaction.timestamp instanceof Date ? transaction.timestamp.toLocaleTimeString() : new Date(transaction.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className={`font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount >= 0 ? '+' : ''}{formatMoney(transaction.amount)}
                  </div>
                </div>
              ))}
            {financialData.transactionHistory.filter(tx => tx.type === 'bond_purchase' || tx.type === 'bond_maturity').length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No bond transactions yet. Purchase your first bond above!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BondsSection;