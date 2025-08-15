import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { formatMoney } from '../../../lib/utils/formatMoney';
import { 
  Building2, 
  Wallet, 
  TrendingUp, 
  Calendar, 
  PiggyBank, 
  Receipt, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Shield,
  Lock,
  Banknote,
  Target,
  Activity,
  Clock,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
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

  const outstandingCredit = financialData.liabilities.find(l => l.category === 'credit_card')?.outstandingAmount || 0;
  const creditLimit = 500000;
  const availableCredit = creditLimit - outstandingCredit;
  const utilizationPercentage = (outstandingCredit / creditLimit) * 100;

  return (
    <div className="space-y-6 p-6">
      {/* Professional Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Building2 className="w-8 h-8" />
              Private Banking
            </h1>
            <p className="text-blue-100 mt-1">Executive Financial Services</p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Total Portfolio Value</div>
            <div className="text-2xl font-bold">{formatMoney(financialData.netWorth)}</div>
          </div>
        </div>
      </div>

      {/* Enhanced Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Primary Balance Card */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Primary Account</p>
                <p className="text-2xl font-bold">{formatMoney(financialData.bankBalance)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-xs">Available</span>
                </div>
              </div>
              <Wallet className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        {/* Net Worth Card */}
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Net Worth</p>
                <p className="text-2xl font-bold">{formatMoney(financialData.netWorth)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs">Growth</span>
                </div>
              </div>
              <Target className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        {/* Income Card */}
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Monthly Income</p>
                <p className="text-2xl font-bold">{formatMoney(financialData.mainIncome + financialData.sideIncome)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Regular</span>
                </div>
              </div>
              <Banknote className="w-8 h-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        {/* Fixed Deposits Card */}
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Fixed Deposits</p>
                <p className="text-2xl font-bold">{formatMoney(financialData.investments.fd)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs">7% APY</span>
                </div>
              </div>
              <PiggyBank className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-xl p-1">
          <TabsTrigger value="account" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Wallet className="w-4 h-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="credit-card" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <CreditCard className="w-4 h-4 mr-2" />
            Credit Card
          </TabsTrigger>
          <TabsTrigger value="fd" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <PiggyBank className="w-4 h-4 mr-2" />
            Deposits
          </TabsTrigger>
          <TabsTrigger value="statement" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Receipt className="w-4 h-4 mr-2" />
            Statement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6 mt-6">
          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Available Balance</span>
                  <span className="font-bold text-xl">{formatMoney(financialData.bankBalance)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Total Assets</span>
                  <span className="font-bold text-xl text-green-600">{formatMoney(financialData.netWorth)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Monthly Inflow</span>
                  <span className="font-bold text-xl text-blue-600">{formatMoney(financialData.mainIncome + financialData.sideIncome)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Investment Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-600">Fixed Deposits</span>
                  <span className="font-bold text-xl text-purple-600">{formatMoney(financialData.investments.fd)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600">Stock Investments</span>
                  <span className="font-bold text-xl text-blue-600">{formatMoney(financialData.investments.stocks)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-600">Bonds</span>
                  <span className="font-bold text-xl text-green-600">{formatMoney(financialData.investments.bonds)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="credit-card" className="space-y-6 mt-6">
          {/* Premium Credit Card */}
          <Card className="bg-gradient-to-br from-gray-900 to-blue-900 text-white border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold">WEALTH SPRINT</h3>
                  <p className="text-sm opacity-80">PREMIUM ELITE</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded"></div>
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
              
              <div className="font-mono text-xl tracking-wider mb-6">
                •••• •••• •••• 1234
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-70">CARDHOLDER</p>
                  <p className="font-semibold">WEALTH PLAYER</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">VALID THRU</p>
                  <p className="font-semibold">12/29</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70">CREDIT LIMIT</p>
                  <p className="font-bold text-yellow-400">{formatMoney(creditLimit)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Card Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm">Available Credit</p>
                    <p className="text-2xl font-bold">{formatMoney(availableCredit)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-emerald-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Outstanding</p>
                    <p className="text-2xl font-bold">{formatMoney(outstandingCredit)}</p>
                  </div>
                  <ArrowDownRight className="w-8 h-8 text-red-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm">Interest Rate</p>
                    <p className="text-2xl font-bold">3.5%</p>
                    <p className="text-xs text-amber-200">per month</p>
                  </div>
                  <Activity className="w-8 h-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Credit Utilization Chart */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Credit Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Usage</span>
                  <span className="font-bold text-lg">{utilizationPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-700 ${
                      utilizationPercentage <= 30 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                      utilizationPercentage <= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                      'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${Math.min(100, utilizationPercentage)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  Recommended: Keep utilization below 30% for optimal credit health
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Actions */}
          {outstandingCredit > 0 && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-green-600" />
                  Credit Card Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => {
                      const creditCard = financialData.liabilities.find(l => l.category === 'credit_card');
                      if (creditCard) {
                        const minimumPayment = Math.max(creditCard.outstandingAmount * 0.05, 5000);
                        useWealthSprintGame.getState().payCreditCardBill(minimumPayment);
                      }
                    }}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                  >
                    <Minus className="w-4 h-4 mr-2" />
                    Pay Minimum
                  </Button>
                  <Button
                    onClick={() => {
                      const creditCard = financialData.liabilities.find(l => l.category === 'credit_card');
                      if (creditCard) {
                        useWealthSprintGame.getState().payCreditCardBill(creditCard.outstandingAmount);
                      }
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Pay Full Amount
                  </Button>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <Shield className="w-4 h-4 inline mr-2" />
                    <strong>Smart Payment:</strong> Automatic coverage for purchases when bank balance is insufficient. 
                    Monthly interest applies to outstanding balance.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Premium Benefits */}
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Lock className="w-5 h-5" />
                Premium Elite Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Automatic store payments</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Zero transaction fees</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Instant purchase approval</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Premium credit limit</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fd" className="space-y-6 mt-6">
          {/* Fixed Deposit Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total FD Amount</p>
                    <p className="text-3xl font-bold">{formatMoney(financialData.investments.fd)}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <PiggyBank className="w-4 h-4" />
                      <span className="text-xs">Principal Amount</span>
                    </div>
                  </div>
                  <Shield className="w-10 h-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Annual Interest</p>
                    <p className="text-3xl font-bold">{formatMoney(financialData.investments.fd * 0.07)}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs">7% APY Guaranteed</span>
                    </div>
                  </div>
                  <Target className="w-10 h-10 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create New FD */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Create Fixed Deposit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Investment Amount</label>
                    <Input
                      type="number"
                      placeholder="Enter amount to invest"
                      value={fdAmount}
                      onChange={(e) => setFdAmount(e.target.value)}
                      className="w-full text-lg"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCreateFD} 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
                    disabled={!fdAmount || parseInt(fdAmount) > financialData.bankBalance}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Create Fixed Deposit (7% Annual Interest)
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4">Investment Calculator</h4>
                  {fdAmount && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Principal:</span>
                        <span className="font-medium">{formatMoney(parseInt(fdAmount) || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Annual Interest (7%):</span>
                        <span className="font-medium text-green-600">{formatMoney((parseInt(fdAmount) || 0) * 0.07)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-medium text-gray-800">Maturity Value (1 Year):</span>
                        <span className="font-bold text-blue-600">{formatMoney((parseInt(fdAmount) || 0) * 1.07)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FD Benefits */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Shield className="w-5 h-5" />
                Fixed Deposit Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Guaranteed Returns</p>
                    <p className="text-xs text-gray-600">7% annual interest</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                  <Lock className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Capital Protection</p>
                    <p className="text-xs text-gray-600">Zero market risk</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">Flexible Terms</p>
                    <p className="text-xs text-gray-600">Multiple tenure options</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statement" className="space-y-6 mt-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-gray-700" />
                Transaction Statement
                <Badge className="ml-auto bg-blue-100 text-blue-800">
                  Last 20 Transactions
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {financialData.transactionHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No transactions yet</p>
                    <p className="text-gray-400 text-sm">Your transaction history will appear here</p>
                  </div>
                ) : (
                  financialData.transactionHistory
                    .slice()
                    .reverse()
                    .slice(0, 20)
                    .map((transaction, index) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.amount > 0 ? (
                              <ArrowUpRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {new Date(transaction.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{formatMoney(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-400">
                            #{String(index + 1).padStart(3, '0')}
                          </p>
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