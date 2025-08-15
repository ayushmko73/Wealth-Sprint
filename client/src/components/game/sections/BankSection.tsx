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
    <div className="space-y-4 p-4">
      {/* Compact Blue Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-xl text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Banking
            </h1>
            <p className="text-blue-100 text-sm">Professional Financial Services</p>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-90">Portfolio Value</div>
            <div className="text-xl font-bold">{formatMoney(financialData.netWorth)}</div>
          </div>
        </div>
      </div>

      {/* Compact Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Primary Balance Card */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0 shadow-md">
          <CardContent className="p-4">
            <div className="text-center">
              <Wallet className="w-6 h-6 mx-auto mb-1 text-blue-200" />
              <p className="text-blue-100 text-xs mb-1">Bank Balance</p>
              <p className="text-lg font-bold">{formatMoney(financialData.bankBalance)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Net Worth Card */}
        <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white border-0 shadow-md">
          <CardContent className="p-4">
            <div className="text-center">
              <Target className="w-6 h-6 mx-auto mb-1 text-blue-200" />
              <p className="text-blue-100 text-xs mb-1">Net Worth</p>
              <p className="text-lg font-bold">{formatMoney(financialData.netWorth)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Income Card */}
        <Card className="bg-gradient-to-br from-blue-300 to-blue-500 text-white border-0 shadow-md">
          <CardContent className="p-4">
            <div className="text-center">
              <Banknote className="w-6 h-6 mx-auto mb-1 text-blue-100" />
              <p className="text-blue-100 text-xs mb-1">Monthly Income</p>
              <p className="text-lg font-bold">{formatMoney(financialData.mainIncome + financialData.sideIncome)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Fixed Deposits Card */}
        <Card className="bg-gradient-to-br from-blue-200 to-blue-400 text-white border-0 shadow-md">
          <CardContent className="p-4">
            <div className="text-center">
              <PiggyBank className="w-6 h-6 mx-auto mb-1 text-blue-100" />
              <p className="text-blue-100 text-xs mb-1">Fixed Deposits</p>
              <p className="text-lg font-bold">{formatMoney(financialData.investments.fd)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compact Tab Navigation */}
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-blue-100 rounded-lg p-1">
          <TabsTrigger value="account" className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 font-medium">
            <Wallet className="w-4 h-4 mr-1" />
            Account
          </TabsTrigger>
          <TabsTrigger value="credit-card" className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 font-medium">
            <CreditCard className="w-4 h-4 mr-1" />
            Credit
          </TabsTrigger>
          <TabsTrigger value="fd" className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 font-medium">
            <PiggyBank className="w-4 h-4 mr-1" />
            Deposits
          </TabsTrigger>
          <TabsTrigger value="statement" className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 font-medium">
            <Receipt className="w-4 h-4 mr-1" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-3 mt-4">
          {/* Compact Account Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="bg-blue-50 border border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-blue-800">
                  <Activity className="w-4 h-4" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-sm text-gray-600">Available Balance</span>
                  <span className="font-bold text-blue-600">{formatMoney(financialData.bankBalance)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-sm text-gray-600">Monthly Inflow</span>
                  <span className="font-bold text-green-600">{formatMoney(financialData.mainIncome + financialData.sideIncome)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-blue-800">
                  <Target className="w-4 h-4" />
                  Investment Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-sm text-gray-600">Fixed Deposits</span>
                  <span className="font-bold text-blue-600">{formatMoney(financialData.investments.fd)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-sm text-gray-600">Total Investments</span>
                  <span className="font-bold text-green-600">{formatMoney(financialData.investments.stocks + financialData.investments.bonds + financialData.investments.fd)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="credit-card" className="space-y-3 mt-4">
          {/* Compact Credit Card */}
          <Card className="bg-gradient-to-br from-blue-800 to-blue-900 text-white border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">WEALTH SPRINT</h3>
                  <p className="text-xs opacity-80">PREMIUM ELITE</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-sm"></div>
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              
              <div className="font-mono text-base tracking-wider mb-4">
                •••• •••• •••• 1234
              </div>
              
              <div className="flex justify-between items-end text-xs">
                <div>
                  <p className="opacity-70">CARDHOLDER</p>
                  <p className="font-semibold">WEALTH PLAYER</p>
                </div>
                <div>
                  <p className="opacity-70">VALID THRU</p>
                  <p className="font-semibold">12/29</p>
                </div>
                <div className="text-right">
                  <p className="opacity-70">LIMIT</p>
                  <p className="font-bold text-yellow-400">{formatMoney(creditLimit)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compact Credit Analytics */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-md">
              <CardContent className="p-3 text-center">
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-blue-200" />
                <p className="text-xs text-blue-100 mb-1">Available</p>
                <p className="text-sm font-bold">{formatMoney(availableCredit)}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-md">
              <CardContent className="p-3 text-center">
                <ArrowDownRight className="w-5 h-5 mx-auto mb-1 text-red-200" />
                <p className="text-xs text-red-100 mb-1">Outstanding</p>
                <p className="text-sm font-bold">{formatMoney(outstandingCredit)}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-md">
              <CardContent className="p-3 text-center">
                <Activity className="w-5 h-5 mx-auto mb-1 text-amber-200" />
                <p className="text-xs text-amber-100 mb-1">Rate</p>
                <p className="text-sm font-bold">3.5%/mo</p>
              </CardContent>
            </Card>
          </div>

          {/* Compact Credit Utilization & Payment */}
          <Card className="bg-blue-50 border border-blue-200">
            <CardContent className="p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-blue-800 font-medium">Credit Utilization</span>
                <span className="text-sm font-bold text-blue-900">{utilizationPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full transition-all duration-700 ${
                    utilizationPercentage <= 30 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                    utilizationPercentage <= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                    'bg-gradient-to-r from-red-400 to-red-500'
                  }`}
                  style={{ width: `${Math.min(100, utilizationPercentage)}%` }}
                ></div>
              </div>
              
              {outstandingCredit > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const creditCard = financialData.liabilities.find(l => l.category === 'credit_card');
                      if (creditCard) {
                        const minimumPayment = Math.max(creditCard.outstandingAmount * 0.05, 5000);
                        useWealthSprintGame.getState().payCreditCardBill(minimumPayment);
                      }
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Pay Minimum
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const creditCard = financialData.liabilities.find(l => l.category === 'credit_card');
                      if (creditCard) {
                        useWealthSprintGame.getState().payCreditCardBill(creditCard.outstandingAmount);
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Pay Full
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fd" className="space-y-3 mt-4">
          {/* Compact FD Overview */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <PiggyBank className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                <p className="text-xs text-blue-100 mb-1">Total FD Amount</p>
                <p className="text-lg font-bold">{formatMoney(financialData.investments.fd)}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-200" />
                <p className="text-xs text-green-100 mb-1">Annual Interest</p>
                <p className="text-lg font-bold">{formatMoney(financialData.investments.fd * 0.07)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Compact FD Creation */}
          <Card className="bg-blue-50 border border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-blue-800">
                <Plus className="w-4 h-4" />
                Create Fixed Deposit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Enter amount to invest"
                    value={fdAmount}
                    onChange={(e) => setFdAmount(e.target.value)}
                    className="w-full"
                  />
                  <Button 
                    onClick={handleCreateFD} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                    disabled={!fdAmount || parseInt(fdAmount) > financialData.bankBalance}
                  >
                    <Lock className="w-3 h-3 mr-1" />
                    Create FD (7% APY)
                  </Button>
                </div>

                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-2">Calculator</p>
                  {fdAmount ? (
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Principal:</span>
                        <span className="font-medium">{formatMoney(parseInt(fdAmount) || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual Interest:</span>
                        <span className="text-green-600 font-medium">{formatMoney((parseInt(fdAmount) || 0) * 0.07)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="font-medium">Maturity (1Y):</span>
                        <span className="font-bold text-blue-600">{formatMoney((parseInt(fdAmount) || 0) * 1.07)}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Enter amount to calculate returns</p>
                  )}
                </div>
              </div>
              
              {/* Compact Benefits */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1 p-2 bg-white rounded text-center">
                  <Shield className="w-3 h-3 text-green-600" />
                  <span>Guaranteed 7%</span>
                </div>
                <div className="flex items-center gap-1 p-2 bg-white rounded text-center">
                  <Lock className="w-3 h-3 text-blue-600" />
                  <span>Zero Risk</span>
                </div>
                <div className="flex items-center gap-1 p-2 bg-white rounded text-center">
                  <Clock className="w-3 h-3 text-purple-600" />
                  <span>Flexible Terms</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statement" className="space-y-3 mt-4">
          <Card className="bg-blue-50 border border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-blue-800">
                <Receipt className="w-4 h-4" />
                Transaction History
                <Badge className="ml-auto bg-blue-200 text-blue-900 text-xs">
                  Last 15
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {financialData.transactionHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Receipt className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                    <p className="text-blue-600 text-sm">No transactions yet</p>
                    <p className="text-blue-500 text-xs">History will appear here</p>
                  </div>
                ) : (
                  financialData.transactionHistory
                    .slice()
                    .reverse()
                    .slice(0, 15)
                    .map((transaction, index) => (
                      <div
                        key={`${transaction.id}-${index}`}
                        className="flex items-center justify-between p-2 bg-white rounded-lg hover:bg-blue-25 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.amount > 0 ? (
                              <ArrowUpRight className="w-3 h-3 text-green-600" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900">{transaction.description}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-2 h-2" />
                              {new Date(transaction.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{formatMoney(transaction.amount)}
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