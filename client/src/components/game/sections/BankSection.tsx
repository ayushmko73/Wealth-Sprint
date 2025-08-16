import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';

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
  const { financialData, playerStats, updateFinancialData, addTransaction, applyForLoan, disburseLoan, payLoanEMI, customLoanPayment } = useWealthSprintGame();
  const [fdAmount, setFdAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [customPaymentAmount, setCustomPaymentAmount] = useState('');
  const [showCustomPayment, setShowCustomPayment] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Account');

  const categories = ['Account', 'Credit', 'Loan', 'Deposits', 'History'];
  
  const categoryIcons: Record<string, React.ReactNode> = {
    'Account': <Wallet className="w-4 h-4" />,
    'Credit': <CreditCard className="w-4 h-4" />,
    'Loan': <Banknote className="w-4 h-4" />,
    'Deposits': <PiggyBank className="w-4 h-4" />,
    'History': <Receipt className="w-4 h-4" />
  };

  const getCategoryColors = (category: string, isSelected: boolean) => {
    return {
      bg: isSelected ? 'bg-white text-blue-800 shadow-md' : 'bg-white/10 text-white hover:bg-white/20',
      text: 'text-blue-800',
      badge: 'bg-blue-500'
    };
  };

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
    
    // Check for existing active loans first
    const hasActiveLoan = financialData.liabilities.some(l => l.category === 'personal_loan' && l.status === 'active');
    if (hasActiveLoan) {
      toast.error('You cannot take a new loan while you have an active loan. Please repay your current loan first.');
      return;
    }
    
    const loanId = applyForLoan(amount, 'Personal Loan');
    if (loanId) {
      toast.success(`Loan instantly approved and disbursed! Amount: ₹${amount.toLocaleString()}`);
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
      {/* Expanded Banking Header - Stock Market Style */}
      <div className="mx-2">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg">
        {/* Header Content */}
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            <div>
              <h1 className="text-lg font-bold">Banking Services</h1>
              <p className="text-blue-100 text-xs">Real-time account management • Banking hours: 24/7</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-200">Account Status</p>
            <p className="text-sm font-bold text-green-400">ACTIVE</p>
          </div>
        </div>
        
        {/* Financial Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-3 px-4">
          <div>
            <p className="text-blue-200 text-xs">NET WORTH: <span className="text-white font-bold">{formatMoney(financialData.netWorth)}</span> <span className="text-green-400">+2.3%</span></p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">CREDIT SCORE: <span className="text-white font-bold">{creditScore}</span></p>
          </div>
        </div>
        
        {/* Bottom Metrics */}
        <div className="grid grid-cols-4 gap-2 text-center px-4 pb-3">
          <div>
            <p className="text-blue-200 text-xs">Cash</p>
            <p className="text-sm font-bold">{formatMoney(financialData.bankBalance)}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">Monthly In</p>
            <p className="text-sm font-bold text-green-400">+{formatMoney(monthlyIncome)}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">Monthly Expense</p>
            <p className="text-sm font-bold text-red-400">-{formatMoney(monthlyExpenses)}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">Risk</p>
            <p className="text-sm font-bold">{riskProfile}</p>
          </div>
        </div>
        
        {/* Category Navigation - Merged with Header */}
        <div className="overflow-x-auto px-4 pb-4">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shadow-md ${
                  getCategoryColors(category, selectedCategory === category).bg
                }`}
              >
                {categoryIcons[category]}
                {category}
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Content based on selected category */}
      <div className="mt-3">
        {selectedCategory === 'Account' && (
          <div className="space-y-3">
            {/* Primary Metrics Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">Net Worth</span>
                </div>
                <span className="text-sm font-bold text-green-700">{formatMoney(financialData.netWorth)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-800">Total Debt</span>
                </div>
                <span className="text-sm font-bold text-red-700">{formatMoney(totalDebt)}</span>
              </div>
            </div>

            {/* Secondary Metrics Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">Credit Score</span>
                </div>
                <span className="text-sm font-bold text-blue-700">{creditScore}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-semibold text-teal-800">Cash Reserves</span>
                </div>
                <span className="text-sm font-bold text-teal-700">{formatMoney(financialData.bankBalance)}</span>
              </div>
            </div>

            {/* Income & Expenses Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-800">Monthly Income</span>
                </div>
                <span className="text-sm font-bold text-emerald-700">{formatMoney(monthlyIncome)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-800">Monthly Expenses</span>
                </div>
                <span className="text-sm font-bold text-orange-700">{formatMoney(monthlyExpenses)}</span>
              </div>
            </div>

            {/* Profile Metrics Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-800">Risk Profile</span>
                </div>
                <span className="text-sm font-bold text-yellow-700">{riskProfile}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-800">Reputation</span>
                </div>
                <span className="text-sm font-bold text-purple-700">{playerStats.reputation}/100</span>
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'Credit' && (
          <div className="space-y-3">
            {/* Enhanced Premium Credit Card */}
          <Card className="bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 text-white border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12"></div>
            <CardContent className="p-4 relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold tracking-wide">WEALTH SPRINT</h3>
                  <p className="text-xs opacity-90 tracking-wider">PREMIUM ELITE</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-sm shadow-md"></div>
                  <div className="w-6 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-sm opacity-80"></div>
                </div>
              </div>
              
              <div className="font-mono text-lg tracking-[0.3em] mb-4 text-center py-2">
                •••• •••• •••• 1234
              </div>
              
              <div className="flex justify-between items-end text-xs">
                <div>
                  <p className="opacity-70 text-[10px] tracking-wider">CARDHOLDER</p>
                  <p className="font-bold text-sm">WEALTH PLAYER</p>
                </div>
                <div>
                  <p className="opacity-70 text-[10px] tracking-wider">VALID THRU</p>
                  <p className="font-bold text-sm">12/29</p>
                </div>
                <div className="text-right">
                  <p className="opacity-70 text-[10px] tracking-wider">CREDIT LIMIT</p>
                  <p className="font-bold text-yellow-400 text-sm">{formatMoney(creditLimit)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compact Credit Dashboard */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg">
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <DollarSign className="w-4 h-4 text-emerald-200" />
                </div>
                <p className="text-[10px] text-emerald-100 mb-1 tracking-wide">AVAILABLE</p>
                <p className="text-sm font-bold">{formatMoney(availableCredit)}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-500 to-red-600 text-white border-0 shadow-lg">
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <ArrowDownRight className="w-4 h-4 text-rose-200" />
                </div>
                <p className="text-[10px] text-rose-100 mb-1 tracking-wide">OUTSTANDING</p>
                <p className="text-sm font-bold">{formatMoney(outstandingCredit)}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-lg">
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Activity className="w-4 h-4 text-amber-200" />
                </div>
                <p className="text-[10px] text-amber-100 mb-1 tracking-wide">APR RATE</p>
                <p className="text-sm font-bold">3.5%/mo</p>
              </CardContent>
            </Card>
          </div>

          {/* Premium Credit Management */}
          <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-700 font-semibold">Credit Utilization</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">{utilizationPercentage.toFixed(1)}%</span>
                  <div className={`w-2 h-2 rounded-full ${
                    utilizationPercentage <= 30 ? 'bg-green-500' :
                    utilizationPercentage <= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                </div>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 shadow-sm ${
                    utilizationPercentage <= 30 ? 'bg-gradient-to-r from-emerald-400 to-green-500' :
                    utilizationPercentage <= 60 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                    'bg-gradient-to-r from-red-400 to-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, utilizationPercentage)}%` }}
                ></div>
              </div>
              
              {outstandingCredit > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    size="sm"
                    onClick={() => {
                      const creditCard = financialData.liabilities.find(l => l.category === 'credit_card');
                      if (creditCard) {
                        const minimumPayment = Math.max(creditCard.outstandingAmount * 0.05, 5000);
                        useWealthSprintGame.getState().payCreditCardBill(minimumPayment);
                      }
                    }}
                    className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-md font-semibold"
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
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md font-semibold"
                  >
                    Pay Full
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* EMI Status Section */}
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-purple-800">
                <Calendar className="w-4 h-4" />
                EMI Status & Management
              </CardTitle>
              <p className="text-xs text-purple-700">Auto-deducted every 4 weeks • Manage your installments</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Sample EMI entries - would be populated from actual EMI data */}
              <div className="text-sm text-purple-600">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-purple-800">No Active EMIs</p>
                      <p className="text-xs text-purple-600">Purchase items with EMI to see them here</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* EMI Summary */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-2 rounded border border-purple-200 text-center">
                  <p className="text-xs text-purple-600">Total EMIs</p>
                  <p className="font-bold text-purple-800">0</p>
                </div>
                <div className="bg-white p-2 rounded border border-purple-200 text-center">
                  <p className="text-xs text-purple-600">Monthly Total</p>
                  <p className="font-bold text-purple-800">{formatMoney(0)}</p>
                </div>
                <div className="bg-white p-2 rounded border border-purple-200 text-center">
                  <p className="text-xs text-purple-600">Next Payment</p>
                  <p className="font-bold text-purple-800">-</p>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">EMI Payment Schedule</span>
                </div>
                <p className="text-xs text-amber-700">
                  EMI payments are automatically deducted from your account every 4 weeks. 
                  Ensure sufficient balance to avoid late fees.
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {selectedCategory === 'Loan' && (
          <div className="space-y-3">
            {/* Loan Application */}
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-green-800">
                <Plus className="w-4 h-4" />
                Apply for Personal Loan
              </CardTitle>
              <p className="text-xs text-green-700">28% Annual Interest • Instant Approval</p>
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
                          <p className="text-xs text-yellow-700">Applied on {loan.applicationDate ? new Date(loan.applicationDate).toLocaleDateString() : 'N/A'}</p>
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
                  
                  {/* Active Loans with Repayment Options */}
                  {activeLoans.map((loan) => {
                    // Calculate 9% interest for full payment
                    const ninePercentAmount = Math.floor(loan.outstandingAmount * 1.09); // 9% interest on outstanding amount
                    
                    return (
                      <div key={loan.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium text-red-800">{loan.name}</p>
                            <p className="text-xs text-red-700">{loan.description}</p>
                            <Badge variant="secondary" className="mt-1 bg-red-200 text-red-800">Active</Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-900">{formatMoney(loan.outstandingAmount)}</p>
                            <p className="text-xs text-red-700">EMI: {formatMoney(loan.emi)}/month (Auto-deducted)</p>
                            <p className="text-xs text-red-600">{loan.remainingMonths} months remaining</p>
                          </div>
                        </div>
                        
                        {/* Repayment Options */}
                        <div className="space-y-2">
                          {/* Full Payment with 9% Interest */}
                          <Button
                            size="sm"
                            onClick={() => {
                              if (customLoanPayment(loan.id, ninePercentAmount)) {
                                toast.success(`Loan fully repaid with 9% interest! Total paid: ${formatMoney(ninePercentAmount)}`);
                              } else {
                                toast.error('Insufficient balance for full repayment');
                              }
                            }}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm"
                            disabled={financialData.bankBalance < ninePercentAmount}
                          >
                            Pay Full (9% Interest) - {formatMoney(ninePercentAmount)}
                          </Button>
                          
                          {/* Custom Repayment */}
                          {showCustomPayment === loan.id ? (
                            <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                              <div className="space-y-2">
                                <Input
                                  type="number"
                                  placeholder="Enter custom amount"
                                  value={customPaymentAmount}
                                  onChange={(e) => setCustomPaymentAmount(e.target.value)}
                                  className="w-full text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const amount = parseInt(customPaymentAmount);
                                      if (amount && amount >= loan.emi) {
                                        if (customLoanPayment(loan.id, amount)) {
                                          toast.success(`Custom payment of ${formatMoney(amount)} completed`);
                                          setCustomPaymentAmount('');
                                          setShowCustomPayment(null);
                                        } else {
                                          toast.error('Payment failed or insufficient balance');
                                        }
                                      } else {
                                        toast.error(`Minimum payment amount is ${formatMoney(loan.emi)} (monthly EMI)`);
                                      }
                                    }}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                    disabled={!customPaymentAmount || parseInt(customPaymentAmount) > financialData.bankBalance}
                                  >
                                    Pay
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setShowCustomPayment(null);
                                      setCustomPaymentAmount('');
                                    }}
                                    className="text-xs"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowCustomPayment(loan.id)}
                              className="w-full text-sm flex items-center justify-between"
                            >
                              Custom Repayment
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        )}

        {selectedCategory === 'Deposits' && (
          <div className="space-y-3">
            {/* Merged Compact FD Section */}
          <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border border-blue-200 shadow-md">
            <CardContent className="p-4">
              {/* FD Overview Header */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-lg text-center">
                  <PiggyBank className="w-5 h-5 mx-auto mb-1 text-blue-200" />
                  <p className="text-xs text-blue-100 mb-1">Total FD Amount</p>
                  <p className="text-lg font-bold">{formatMoney(financialData.investments.fd)}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-3 rounded-lg text-center">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-200" />
                  <p className="text-xs text-green-100 mb-1">Annual Interest</p>
                  <p className="text-lg font-bold">{formatMoney(financialData.investments.fd * 0.07)}</p>
                </div>
              </div>
              
              {/* Create FD Section */}
              <div className="flex items-center gap-2 mb-3">
                <Plus className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-blue-800">Create Fixed Deposit</h3>
                <div className="ml-auto text-right">
                  <p className="text-xs text-blue-600">Interest Rate</p>
                  <p className="text-sm font-bold text-green-600">7% APY</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Input
                  type="number"
                  placeholder="Enter amount to invest"
                  value={fdAmount}
                  onChange={(e) => setFdAmount(e.target.value)}
                  className="w-full text-center text-lg font-semibold"
                />
                
                <Button 
                  onClick={handleCreateFD} 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md"
                  size="sm"
                  disabled={!fdAmount || parseInt(fdAmount) > financialData.bankBalance}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Create FD (7% APY)
                </Button>
                
                {/* Calculator */}
                {fdAmount && (
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <p className="text-sm font-semibold text-blue-800 mb-2">Calculator</p>
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div>
                        <p className="text-gray-600">Principal</p>
                        <p className="font-bold text-blue-800">{formatMoney(parseInt(fdAmount) || 0)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Annual Interest</p>
                        <p className="font-bold text-green-600">{formatMoney((parseInt(fdAmount) || 0) * 0.07)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Maturity (1Y)</p>
                        <p className="font-bold text-blue-800">{formatMoney((parseInt(fdAmount) || 0) * 1.07)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Compact Benefits */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1 p-2 bg-green-50 rounded border border-green-200 text-center">
                    <Shield className="w-3 h-3 text-green-600" />
                    <span className="text-green-700 font-medium">Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-1 p-2 bg-blue-50 rounded border border-blue-200 text-center">
                    <Lock className="w-3 h-3 text-blue-600" />
                    <span className="text-blue-700 font-medium">Zero Risk</span>
                  </div>
                  <div className="flex items-center gap-1 p-2 bg-purple-50 rounded border border-purple-200 text-center">
                    <Clock className="w-3 h-3 text-purple-600" />
                    <span className="text-purple-700 font-medium">Flexible</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {selectedCategory === 'History' && (
          <div className="space-y-3">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default BankSection;