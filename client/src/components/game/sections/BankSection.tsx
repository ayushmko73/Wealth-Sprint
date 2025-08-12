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
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm opacity-90">Available Credit</div>
                      <div className="text-2xl font-bold">{formatMoney(200000)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-90">Credit Used</div>
                      <div className="text-xl font-bold">
                        {formatMoney(financialData.liabilities.find(l => l.category === 'credit_card')?.outstandingAmount || 0)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm opacity-90">WEALTH SPRINT PREMIUM</div>
                    <div className="text-lg font-mono">**** **** **** 1234</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Monthly Limit</div>
                    <div className="text-xl font-bold text-gray-800">
                      {formatMoney(200000)}
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-sm text-gray-600">Interest Rate</div>
                    <div className="text-xl font-bold text-red-600">
                      42% p.a.
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg text-sm">
                  <p className="text-yellow-800">
                    <strong>Note:</strong> Credit card is automatically used for store purchases when bank balance is insufficient. 
                    High interest rates apply - use wisely!
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