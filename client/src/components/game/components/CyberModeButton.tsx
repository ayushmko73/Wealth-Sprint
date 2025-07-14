import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { useAudio } from '../../../lib/stores/useAudio';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Badge } from '../../ui/badge';
import { Zap, Lock, Crown, Cpu, Shield } from 'lucide-react';

const CyberModeButton: React.FC = () => {
  const { financialData, playerStats } = useWealthSprintGame();
  const { playHit } = useAudio();
  const [showCyberDialog, setShowCyberDialog] = useState(false);

  const CYBER_UNLOCK_AMOUNT = 50000000; // 5 Crores
  const isUnlocked = financialData.netWorth >= CYBER_UNLOCK_AMOUNT;
  const remaining = CYBER_UNLOCK_AMOUNT - financialData.netWorth;

  const handleCyberModeClick = () => {
    playHit();
    setShowCyberDialog(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CyberModeContent = () => {
    if (!isUnlocked) {
      return (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Lock size={48} className="text-gray-400" />
              <div className="absolute -top-2 -right-2">
                <Crown size={20} className="text-yellow-500" />
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-700">Cyber Mode Locked</h3>
          <p className="text-gray-600">
            Achieve a net worth of <span className="font-bold text-green-600">{formatCurrency(CYBER_UNLOCK_AMOUNT)}</span> to unlock advanced financial instruments and AI-powered trading.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              <strong>Remaining:</strong> {formatCurrency(remaining)}
            </p>
            <div className="w-full bg-red-200 rounded-full h-3 mt-2">
              <div 
                className="bg-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, (financialData.netWorth / CYBER_UNLOCK_AMOUNT) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Zap size={48} className="text-blue-500" />
              <div className="absolute -top-2 -right-2">
                <Crown size={20} className="text-yellow-500" />
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-blue-700">Cyber Mode Unlocked!</h3>
          <p className="text-gray-600">Access advanced financial tools and AI-powered strategies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={20} className="text-blue-600" />
              <h4 className="font-semibold">AI Trading Bot</h4>
            </div>
            <p className="text-sm text-gray-700">Automated portfolio optimization</p>
            <Badge className="mt-2 bg-blue-100 text-blue-700">Coming Soon</Badge>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={20} className="text-green-600" />
              <h4 className="font-semibold">Risk Analytics</h4>
            </div>
            <p className="text-sm text-gray-700">Advanced risk assessment tools</p>
            <Badge className="mt-2 bg-green-100 text-green-700">Coming Soon</Badge>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-4">
          <h4 className="font-semibold mb-2">Cyber Mode Features</h4>
          <ul className="text-sm space-y-1">
            <li>• Real-time market analysis</li>
            <li>• Cryptocurrency trading</li>
            <li>• Advanced derivatives</li>
            <li>• International markets</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={showCyberDialog} onOpenChange={setShowCyberDialog}>
      <DialogTrigger asChild>
        <Button
          variant={isUnlocked ? "default" : "outline"}
          className={`flex items-center gap-2 transition-all duration-300 hover:scale-105 ${
            isUnlocked 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' 
              : 'opacity-60'
          }`}
          onClick={handleCyberModeClick}
        >
          {isUnlocked ? <Zap size={16} /> : <Lock size={16} />}
          Cyber Mode
          {!isUnlocked && <Badge variant="destructive" className="ml-1">₹5Cr</Badge>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap size={20} />
            Cyber Mode
          </DialogTitle>
        </DialogHeader>
        <CyberModeContent />
      </DialogContent>
    </Dialog>
  );
};

export default CyberModeButton;