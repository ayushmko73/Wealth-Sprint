import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { formatMoney } from '../../../lib/utils/formatMoney';
import { Building, DollarSign, TrendingUp, Calendar, PiggyBank, Receipt, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const BankSection: React.FC = () => {
  const { financialData, updateFinancialData, addTransaction } = useWealthSprintGame();
  const [fdAmount, setFdAmount] = useState('');

  const handleCreateFD = () => {
    const amount = parseInt(fdAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (amount > financialData.bankBalance) {
      toast.error('Insufficient bank balance');
      return;
    }
    
    updateFinancialData({
      bankBalance: financialData.bankBalance - amount,
      investments: {
        ...financialData.investments,
        fd: financialData.investments.fd + amount,
      },
    });
    
    addTransaction({
      type: 'investment',
      amount: -amount,
      description: `Created Fixed Deposit - 7% annual interest`,
      fromAccount: 'bank',
      toAccount: 'bank'
    });
    
    toast.success(`Successfully created FD of ${formatMoney(amount)} at 7% annual interest`);
    setFdAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#3a3a3a]">Banking</h1>
        <div className="flex items-center gap-4">
          <Badge className="bg-[#d4af37] text-white">
            Bank: {formatMoney(financialData.bankBalance)}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="credit-card">Credit card</TabsTrigger>
          <TabsTrigger value="fd">Fixed Deposits</TabsTrigger>
          <TabsTrigger value="statement">Statement</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Bank Balance</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatMoney(financialData.bankBalance)}
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Net Worth</span>
                  </div>
                  <div className="text-xl font-bold text-purple-600">
                    {formatMoney(financialData.netWorth)}
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Monthly Income</span>
                  </div>
                  <div className="text-xl font-bold text-orange-600">
                    {formatMoney(financialData.mainIncome + financialData.sideIncome)}
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <PiggyBank className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Fixed Deposits</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {formatMoney(financialData.investments.fd)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credit-card" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Credit Card Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Futuristic Credit Card Design */}
                <div className="relative">
                  <div 
                    className="relative w-full h-48 rounded-2xl p-6 text-white overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 25%, #3730a3 50%, #b45309 75%, #d97706 100%)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(217, 119, 6, 0.2)',
                      border: '1px solid rgba(217, 119, 6, 0.3)'
                    }}
                  >
                    {/* Holographic background pattern */}
                    <div 
                      className="absolute inset-0 opacity-10"
                      style={{
                        background: `
                          radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                          linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)
                        `
                      }}
                    />
                    
                    {/* Animated glow effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'linear-gradient(45deg, transparent, rgba(217, 119, 6, 0.1), transparent)',
                        animation: 'shimmer 3s ease-in-out infinite'
                      }}
                    />
                    
                    {/* Card content */}
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs opacity-80 uppercase tracking-wider font-medium">
                            Wealth Sprint
                          </div>
                          <div className="text-lg font-bold mt-1">PREMIUM ELITE</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-6 bg-white/20 rounded-sm flex items-center justify-center">
                            <div className="w-4 h-3 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-sm"></div>
                          </div>
                          <div className="text-xs">💎</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="font-mono text-xl tracking-wider">
                          •••• •••• •••• 1234
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-xs opacity-80">CARDHOLDER</div>
                            <div className="font-semibold">WEALTH PLAYER</div>
                          </div>
                          <div>
                            <div className="text-xs opacity-80">VALID THRU</div>
                            <div className="font-semibold">12/29</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs opacity-80">CREDIT LIMIT</div>
                            <div className="font-bold text-yellow-300">{formatMoney(500000)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Credit utilization bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Credit Utilization</span>
                      <span className="text-gray-800 font-medium">
                        {formatMoney(financialData.liabilities.find(l => l.category === 'credit_card')?.outstandingAmount || 0)} / {formatMoney(500000)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, ((financialData.liabilities.find(l => l.category === 'credit_card')?.outstandingAmount || 0) / 500000) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Credit Card Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium">Available Credit</div>
                    <div className="text-2xl font-bold text-blue-800">
                      {formatMoney(500000 - (financialData.liabilities.find(l => l.category === 'credit_card')?.outstandingAmount || 0))}
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                    <div className="text-sm text-red-600 font-medium">Outstanding</div>
                    <div className="text-2xl font-bold text-red-800">
                      {formatMoney(financialData.liabilities.find(l => l.category === 'credit_card')?.outstandingAmount || 0)}
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                    <div className="text-sm text-yellow-600 font-medium">Interest Rate</div>
                    <div className="text-2xl font-bold text-yellow-800">
                      3.5% /mo
                    </div>
                  </div>
                </div>

                {/* Credit Card Benefits */}
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-purple-800 mb-3">Premium Benefits</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Automatic payments for store purchases</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>No transaction fees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Instant approval for purchases</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>High credit limit</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Credit Card Payment Section */}
                {financialData.liabilities.find(l => l.category === 'credit_card') && (
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        💳 Pay Credit Card Bill
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Outstanding Balance:</span>
                          <span className="font-bold text-red-600">
                            {formatMoney(financialData.liabilities.find(l => l.category === 'credit_card')?.outstandingAmount || 0)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const creditCard = financialData.liabilities.find(l => l.category === 'credit_card');
                              if (creditCard) {
                                const minimumPayment = Math.max(creditCard.outstandingAmount * 0.05, 5000);
                                useWealthSprintGame.getState().payCreditCardBill(minimumPayment);
                              }
                            }}
                            className="flex-1 py-2 px-3 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                          >
                            Pay Minimum
                          </button>
                          <button
                            onClick={() => {
                              const creditCard = financialData.liabilities.find(l => l.category === 'credit_card');
                              if (creditCard) {
                                useWealthSprintGame.getState().payCreditCardBill(creditCard.outstandingAmount);
                              }
                            }}
                            className="flex-1 py-2 px-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            Pay Full
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="p-3 bg-amber-50 rounded-lg text-sm border border-amber-200">
                  <p className="text-amber-800">
                    <strong>Smart Payment:</strong> Credit card automatically covers purchases when bank balance is insufficient. 
                    Monthly interest applies to outstanding balance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fd" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5" />
                Fixed Deposits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">Total FD Amount</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatMoney(financialData.investments.fd)}
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600">Annual Interest</div>
                    <div className="text-xl font-bold text-green-600">
                      {formatMoney(financialData.investments.fd * 0.07)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">FD Amount:</label>
                    <Input
                      type="number"
                      placeholder="Enter FD amount"
                      value={fdAmount}
                      onChange={(e) => setFdAmount(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCreateFD} 
                    className="w-full bg-[#d4af37] hover:bg-[#b8941f]"
                    disabled={!fdAmount || parseInt(fdAmount) > financialData.bankBalance}
                  >
                    Create Fixed Deposit (7% Annual Interest)
                  </Button>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="text-blue-800">
                    <strong>Fixed Deposit Benefits:</strong> Guaranteed 7% annual returns, 
                    safe investment option with no market risk.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Transaction Statement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {financialData.transactionHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No transactions yet
                  </div>
                ) : (
                  financialData.transactionHistory
                    .slice()
                    .reverse()
                    .slice(0, 20)
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500">
                            {transaction.timestamp.toLocaleDateString()}
                          </div>
                        </div>
                        <div
                          className={`font-bold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.amount > 0 ? '+' : ''}{formatMoney(transaction.amount)}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BankSection;