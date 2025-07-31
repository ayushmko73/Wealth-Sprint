import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { formatMoney } from '../../../lib/utils/formatMoney';
import { Building, DollarSign, PiggyBank, TrendingUp, Calendar, AlertCircle, ArrowRightLeft, Receipt } from 'lucide-react';
import { toast } from 'sonner';

const BankSection: React.FC = () => {
  const { financialData, updateFinancialData, transferToWallet, transferFromWallet, addTransaction } = useWealthSprintGame();
  const [fdAmount, setFdAmount] = useState('');
  const [walletTransferAmount, setWalletTransferAmount] = useState('');
  const [bankTransferAmount, setBankTransferAmount] = useState('');

  const handleTransferToWallet = () => {
    const amount = parseInt(walletTransferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (amount > financialData.bankBalance) {
      toast.error('Insufficient bank balance');
      return;
    }
    
    if (transferToWallet(amount)) {
      toast.success(`Successfully transferred ${formatMoney(amount)} to wallet`);
      setWalletTransferAmount('');
    } else {
      toast.error('Transfer failed');
    }
  };

  const handleTransferToBank = () => {
    const amount = parseInt(bankTransferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (amount > financialData.inHandCash) {
      toast.error('Insufficient wallet balance');
      return;
    }
    
    if (transferFromWallet(amount)) {
      toast.success(`Successfully transferred ${formatMoney(amount)} to bank`);
      setBankTransferAmount('');
    } else {
      toast.error('Transfer failed');
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#3a3a3a]">Banking</h1>
        <div className="flex items-center gap-4">
          <Badge className="bg-[#d4af37] text-white">
            Bank: {formatMoney(financialData.bankBalance)}
          </Badge>
          <Badge className="bg-green-600 text-white">
            Wallet: {formatMoney(financialData.inHandCash)}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
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
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <PiggyBank className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Wallet Cash</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {formatMoney(financialData.inHandCash)}
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Bank Balance</div>
              <div className="text-xl font-bold text-blue-600">
                {formatMoney(financialData.bankBalance)}
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Wallet Balance</div>
              <div className="text-xl font-bold text-green-600">
                {formatMoney(financialData.inHandCash)}
              </div>
            </div>
          </div>

          {/* Bank to Wallet Transfer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5" />
                Bank → Wallet Transfer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount to Transfer to Wallet:</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={walletTransferAmount}
                    onChange={(e) => setWalletTransferAmount(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setWalletTransferAmount('5000')} 
                    variant="outline"
                    size="sm"
                  >
                    ₹5,000
                  </Button>
                  <Button 
                    onClick={() => setWalletTransferAmount('10000')} 
                    variant="outline"
                    size="sm"
                  >
                    ₹10,000
                  </Button>
                  <Button 
                    onClick={() => setWalletTransferAmount('25000')} 
                    variant="outline"
                    size="sm"
                  >
                    ₹25,000
                  </Button>
                </div>
                
                <Button 
                  onClick={handleTransferToWallet} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!walletTransferAmount || parseInt(walletTransferAmount) > financialData.bankBalance}
                >
                  Transfer to Wallet
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Wallet to Bank Transfer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 rotate-180" />
                Wallet → Bank Transfer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount to Transfer to Bank:</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={bankTransferAmount}
                    onChange={(e) => setBankTransferAmount(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setBankTransferAmount('5000')} 
                    variant="outline"
                    size="sm"
                  >
                    ₹5,000
                  </Button>
                  <Button 
                    onClick={() => setBankTransferAmount('10000')} 
                    variant="outline"
                    size="sm"
                  >
                    ₹10,000
                  </Button>
                  <Button 
                    onClick={() => setBankTransferAmount('25000')} 
                    variant="outline"
                    size="sm"
                  >
                    ₹25,000
                  </Button>
                </div>
                
                <Button 
                  onClick={handleTransferToBank} 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!bankTransferAmount || parseInt(bankTransferAmount) > financialData.inHandCash}
                >
                  Transfer to Bank
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="p-3 bg-yellow-50 rounded-lg text-sm">
            <p className="text-yellow-800">
              <strong>Note:</strong> Use wallet cash for quick purchases, tips, and small expenses. 
              All major transactions (salaries, investments, loans) happen through your bank account.
            </p>
          </div>
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
                {financialData.transactionHistory.length > 0 ? (
                  financialData.transactionHistory.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{transaction.description}</div>
                        <div className="text-xs text-gray-500">
                          {transaction.timestamp instanceof Date ? transaction.timestamp.toLocaleDateString() : new Date(transaction.timestamp).toLocaleDateString()} {transaction.timestamp instanceof Date ? transaction.timestamp.toLocaleTimeString() : new Date(transaction.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {transaction.fromAccount} → {transaction.toAccount}
                        </div>
                      </div>
                      <div className={`font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount >= 0 ? '+' : ''}{formatMoney(transaction.amount)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No transactions yet. Your banking activity will appear here.
                  </div>
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