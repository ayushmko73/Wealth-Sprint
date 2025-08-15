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
  TrendingDown,
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
  Minus,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const BankSection: React.FC = () => {
  const { financialData, playerStats, updateFinancialData, addTransaction, applyForLoan, disburseLoan } = useWealthSprintGame();
  const [fdAmount, setFdAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('Business Expansion');

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
  
  // Loan calculations
  const creditScore = Math.min(900, Math.max(300, 720 + Math.floor((financialData.netWorth - 500000) / 10000)));
  const totalDebt = financialData.liabilities.reduce((sum, liability) => sum + liability.outstandingAmount, 0);
  const monthlyIncome = financialData.mainIncome + financialData.sideIncome;
  const monthlyExpenses = Math.floor(monthlyIncome * 0.6);
  const loans = financialData.liabilities.filter(l => l.category === 'personal_loan');
  const pendingLoans = loans.filter(l => l.status === 'pending');
  const approvedLoans = loans.filter(l => l.status === 'approved');
  const activeLoans = loans.filter(l => l.status === 'active');
  
  // Financial Independence Progress
  const fiProgress = Math.min(100, (financialData.sideIncome / monthlyExpenses) * 100);
  
  // Risk Profile calculation
  const riskProfile = financialData.investments.stocks > financialData.bankBalance ? 'High' : 
                     financialData.investments.stocks > financialData.bankBalance * 0.3 ? 'Medium' : 'Low';
                     
  const handleApplyLoan = () => {
    const amount = parseInt(loanAmount);
    if (isNaN(amount) || amount < 50000 || amount > 2000000) {
      toast.error('Loan amount must be between ₹50,000 and ₹20,00,000');
      return;
    }
    
    const loanId = applyForLoan(amount, loanPurpose);
    if (loanId) {
      toast.success(`Loan application submitted! Application ID: ${loanId.slice(-8)}`);
      setLoanAmount('');
    } else {
      toast.error('Loan application failed. Check your credit score and eligibility.');
    }
  };
  
  const handleDisburseLoan = (loanId: string) => {
    if (disburseLoan(loanId)) {
      toast.success('Loan amount disbursed to your account!');
    } else {
      toast.error('Failed to disburse loan.');
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Simple Banking Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-xl text-white shadow-lg">
        {/* Main Header */}
        <div className="flex items-center mb-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Banking
            </h1>
            <p className="text-blue-100 text-xs">Professional Financial Services</p>
          </div>
        </div>

        {/* Simple Financial Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Monthly Income */}
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <ArrowUpRight className="w-5 h-5 mx-auto mb-1 text-blue-200" />
            <p className="text-blue-100 text-xs mb-1">Monthly Income</p>
            <p className="text-sm font-bold">{formatMoney(monthlyIncome)}</p>
          </div>

          {/* Monthly Expenses */}
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <ArrowDownRight className="w-5 h-5 mx-auto mb-1 text-blue-200" />
            <p className="text-blue-100 text-xs mb-1">Monthly Expenses</p>
            <p className="text-sm font-bold">{formatMoney(monthlyExpenses)}</p>
          </div>

          {/* Cash Reserves */}
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <Banknote className="w-5 h-5 mx-auto mb-1 text-blue-200" />
            <p className="text-blue-100 text-xs mb-1">Cash Reserves</p>
            <p className="text-sm font-bold">{formatMoney(financialData.bankBalance)}</p>
          </div>

          {/* Risk Profile */}
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-blue-200" />
            <p className="text-blue-100 text-xs mb-1">Risk Profile</p>
            <p className="text-sm font-bold">{riskProfile}</p>
          </div>

          {/* Reputation */}
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <Activity className="w-5 h-5 mx-auto mb-1 text-blue-200" />
            <p className="text-blue-100 text-xs mb-1">Reputation</p>
            <p className="text-sm font-bold">{playerStats.reputation}/100</p>
          </div>

          {/* FI Progress */}
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <Target className="w-5 h-5 mx-auto mb-1 text-blue-200" />
            <p className="text-blue-100 text-xs mb-1">FI Progress</p>
            <p className="text-sm font-bold">{fiProgress.toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Tab Navigation */}
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="flex w-full bg-blue-100 rounded-lg p-1 overflow-x-auto">
          <TabsTrigger value="account" className="flex-shrink-0 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 font-medium">
            <Wallet className="w-4 h-4 mr-1" />
            Account
          </TabsTrigger>
          <TabsTrigger value="credit-card" className="flex-shrink-0 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 font-medium">
            <CreditCard className="w-4 h-4 mr-1" />
            Credit
          </TabsTrigger>
          <TabsTrigger value="loan" className="flex-shrink-0 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 font-medium">
            <Banknote className="w-4 h-4 mr-1" />
            Loan
          </TabsTrigger>
          <TabsTrigger value="fd" className="flex-shrink-0 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 font-medium">
            <PiggyBank className="w-4 h-4 mr-1" />
            Deposits
          </TabsTrigger>
          <TabsTrigger value="statement" className="flex-shrink-0 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 font-medium">
            <Receipt className="w-4 h-4 mr-1" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-3 mt-4">
          {/* Comprehensive Account Details */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
                <Wallet className="w-5 h-5" />
                Complete Account Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Account Holder */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Account Holder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-purple-700">{playerStats.name || 'Wealth Player'}</span>
                  </div>
                </div>

                {/* Net Worth */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg border border-green-200 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Net Worth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-green-700">{formatMoney(financialData.netWorth)}</span>
                  </div>
                </div>

                {/* Total Debt */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Total Debt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-red-700">{formatMoney(totalDebt)}</span>
                  </div>
                </div>

                {/* Credit Score */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg border border-blue-200 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Credit Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-700">{creditScore}</span>
                  </div>
                </div>

                {/* Monthly Income */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Monthly Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-cyan-700">{formatMoney(monthlyIncome)}</span>
                  </div>
                </div>

                {/* Monthly Expenses */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <ArrowDownRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Monthly Expenses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-orange-700">{formatMoney(monthlyExpenses)}</span>
                  </div>
                </div>

                {/* Cash Reserves */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg border border-teal-200 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                      <Banknote className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Cash Reserves</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-teal-700">{formatMoney(financialData.bankBalance)}</span>
                  </div>
                </div>

                {/* Risk Profile */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-100 rounded-lg border border-amber-200 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Risk Profile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-700">{riskProfile}</span>
                  </div>
                </div>

                {/* Reputation */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Reputation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-indigo-700">{playerStats.reputation}/100</span>
                  </div>
                </div>

                {/* Financial Independence Progress */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Financial Independence Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-700">{fiProgress.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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

        <TabsContent value="loan" className="space-y-3 mt-4">
          {/* Loan Application */}
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-green-800">
                <Plus className="w-4 h-4" />
                Apply for Personal Loan
              </CardTitle>
              <p className="text-xs text-green-700">28% Annual Interest • 12 Game Days Approval Time</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-green-800 mb-1 block">Loan Amount</label>
                    <Input
                      type="number"
                      placeholder="₹50,000 - ₹20,00,000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-green-800 mb-1 block">Purpose</label>
                    <select 
                      value={loanPurpose} 
                      onChange={(e) => setLoanPurpose(e.target.value)}
                      className="w-full p-2 border border-green-300 rounded-md bg-white text-sm"
                    >
                      <option value="Business Expansion">Business Expansion</option>
                      <option value="Investment">Investment</option>
                      <option value="Debt Consolidation">Debt Consolidation</option>
                      <option value="Emergency Fund">Emergency Fund</option>
                      <option value="Education">Education</option>
                    </select>
                  </div>
                  <Button 
                    onClick={handleApplyLoan}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={!loanAmount || creditScore < 600 || pendingLoans.length >= 3}
                  >
                    <Banknote className="w-4 h-4 mr-2" />
                    Apply for Loan
                  </Button>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-2">Loan Calculator</p>
                  {loanAmount ? (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Loan Amount:</span>
                        <span className="font-medium">{formatMoney(parseInt(loanAmount) || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span className="text-red-600 font-medium">28% Annual</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tenure:</span>
                        <span className="font-medium">24 Months</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Monthly EMI:</span>
                        <span className="font-bold text-green-600">
                          {formatMoney(Math.floor(((parseInt(loanAmount) || 0) * (28/100/12)) / (1 - Math.pow(1 + (28/100/12), -24))))}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Enter amount to calculate EMI</p>
                  )}
                  
                  <div className="mt-3 pt-2 border-t">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Your Credit Score:</span>
                      <span className={`font-bold ${
                        creditScore >= 750 ? 'text-green-600' : 
                        creditScore >= 650 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{creditScore}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Eligibility:</span>
                      <span className={`font-bold ${
                        creditScore >= 600 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {creditScore >= 600 ? 'Eligible' : 'Not Eligible'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Active Loans */}
          {(pendingLoans.length > 0 || approvedLoans.length > 0 || activeLoans.length > 0) && (
            <Card className="bg-blue-50 border border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-blue-800">
                  <Receipt className="w-4 h-4" />
                  My Loans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Pending Loans */}
                  {pendingLoans.map((loan) => (
                    <div key={loan.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-yellow-800">{loan.name}</p>
                          <p className="text-xs text-yellow-700">{loan.description}</p>
                          <Badge variant="secondary" className="mt-1 bg-yellow-200 text-yellow-800">Pending Approval</Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-yellow-900">{formatMoney(loan.originalAmount)}</p>
                          <p className="text-xs text-yellow-700">Applied on {loan.applicationDate?.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Approved Loans */}
                  {approvedLoans.map((loan) => (
                    <div key={loan.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-green-800">{loan.name}</p>
                          <p className="text-xs text-green-700">{loan.description}</p>
                          <Badge variant="secondary" className="mt-1 bg-green-200 text-green-800">Approved - Ready to Disburse</Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-900">{formatMoney(loan.originalAmount)}</p>
                          <p className="text-xs text-green-700">EMI: {formatMoney(loan.emi)}/month</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleDisburseLoan(loan.id)}
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        Disburse to Account
                      </Button>
                    </div>
                  ))}
                  
                  {/* Active Loans */}
                  {activeLoans.map((loan) => (
                    <div key={loan.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-red-800">{loan.name}</p>
                          <p className="text-xs text-red-700">{loan.description}</p>
                          <Badge variant="secondary" className="mt-1 bg-red-200 text-red-800">Active</Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-900">{formatMoney(loan.outstandingAmount)}</p>
                          <p className="text-xs text-red-700">EMI: {formatMoney(loan.emi)}/month</p>
                          <p className="text-xs text-red-600">{loan.remainingMonths} months left</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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