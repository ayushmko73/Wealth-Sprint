import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Lock, 
  Unlock, 
  TrendingUp, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Star,
  Briefcase,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { industrySectors, getUnlockedSectors } from '@/lib/data/industrySectors';

export default function IndustrySectorsSection() {
  const { 
    playerStats, 
    financialData,
    addGameEvent,
    gainClarityXP,
    increaseLoopScore,
    addRecentAction,
    updateFinancialData
  } = useWealthSprintGame();

  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [showSectorDetails, setShowSectorDetails] = useState(false);

  // Calculate unlocked sectors based on player progress
  const unlockedSectors = getUnlockedSectors(
    playerStats.clarityXP, 
    0, // You can track completed sectors in player stats
    playerStats.loopScore
  );

  const getSectorProgress = (sectorId: string) => {
    // Simulate sector progress based on player actions
    const baseProgress = Math.min(100, (playerStats.clarityXP / 10) + Math.random() * 20);
    return Math.floor(baseProgress);
  };

  const getSectorRevenue = (sectorId: string) => {
    // Calculate potential revenue based on sector and player stats
    const baseRevenue = {
      'fast_food': 500000,
      'logistics': 750000,
      'tech_startups': 2000000,
      'ai_saas': 5000000,
      'ecommerce': 1500000,
      'crypto_web3': 10000000,
      'media_empire': 3000000,
      'healthcare': 8000000,
      'edtech': 2500000
    };
    
    return baseRevenue[sectorId as keyof typeof baseRevenue] || 500000;
  };

  const getLoopChallenge = (sectorId: string) => {
    const challenges = {
      'fast_food': 'Speed vs Quality Loop - Racing to scale compromises food quality',
      'logistics': 'Burnout Loop - Expanding too fast leads to operational chaos',
      'tech_startups': 'Shiny Object Syndrome - Losing focus chasing new features',
      'ai_saas': 'Ethics vs Profit - Choosing revenue over user privacy',
      'ecommerce': 'Fake Growth Loop - Inflated metrics hide real problems',
      'crypto_web3': 'Greed Overload - Bull market mentality leads to over-risking',
      'media_empire': 'Fame Addiction - Chasing virality over meaningful content',
      'healthcare': 'Guilt Loop - Balancing patient care with business viability',
      'edtech': 'Self-Worth Loop - Taking student failures personally'
    };
    
    return challenges[sectorId as keyof typeof challenges] || 'Unknown challenge';
  };

  const handleSectorInvestment = (sectorId: string) => {
    const sector = industrySectors.find(s => s.id === sectorId);
    if (!sector) return;

    const isUnlocked = unlockedSectors.some(s => s.id === sectorId);
    if (!isUnlocked) {
      addGameEvent({
        id: `sector_locked_${sectorId}_${Date.now()}`,
        type: 'warning',
        title: 'Sector Locked',
        description: `You need ${sector.unlockRequirements.clarityXP} Clarity XP and max ${sector.unlockRequirements.maxLoopScore} Loop Score to unlock ${sector.name}.`,
        timestamp: new Date()
      });
      return;
    }

    const investmentAmount = 200000; // Base investment
    if (financialData.bankBalance < investmentAmount) {
      addGameEvent({
        id: `insufficient_funds_${sectorId}_${Date.now()}`,
        type: 'warning',
        title: '🚨 Insufficient Balance',
        description: `You need ₹${investmentAmount.toLocaleString()} to invest in ${sector.name}. Current balance: ₹${financialData.bankBalance.toLocaleString()}`,
        timestamp: new Date()
      });
      return;
    }

    // Add confirmation dialog
    const confirmed = window.confirm(
      `Confirm Investment\n\nSector: ${sector.name}\nAmount: ₹${investmentAmount.toLocaleString()}\nExpected Revenue: ₹${getSectorRevenue(sectorId).toLocaleString()}/year\n\nProceed with investment?`
    );

    if (!confirmed) return;

    // Deduct from bank balance
    updateFinancialData({
      bankBalance: financialData.bankBalance - investmentAmount
    });

    // Track this as a business action
    addRecentAction(`invest_${sectorId}`);
    
    // Gain clarity XP for smart business decisions
    if (playerStats.loopScore < 50) {
      gainClarityXP(30, `Strategic investment in ${sector.name}`);
    } else {
      increaseLoopScore(10, `Risky expansion while in emotional loops`);
    }

    addGameEvent({
      id: `sector_investment_${sectorId}_${Date.now()}`,
      type: 'achievement',
      title: '🎯 New Sector Entered',
      description: `Invested ₹${investmentAmount.toLocaleString()} in ${sector.name}. Bank balance: ₹${(financialData.bankBalance - investmentAmount).toLocaleString()}`,
      timestamp: new Date()
    });
  };

  const getUnlockRequirementsText = (sector: any) => {
    const missing = [];
    if (playerStats.clarityXP < sector.unlockRequirements.clarityXP) {
      missing.push(`${sector.unlockRequirements.clarityXP - playerStats.clarityXP} more Clarity XP`);
    }
    if (playerStats.loopScore > sector.unlockRequirements.maxLoopScore) {
      missing.push(`Reduce Loop Score to ${sector.unlockRequirements.maxLoopScore}`);
    }
    return missing.join(', ');
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Industry Sectors</h1>
        <p className="text-gray-600 mb-4">
          Build your empire across multiple sectors. Each sector mirrors a cognitive challenge.
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Clarity XP: {playerStats.clarityXP}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span>Loop Score: {playerStats.loopScore}</span>
          </div>
        </div>
      </div>

      {/* Spiral Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industrySectors.map((sector, index) => {
          const isUnlocked = unlockedSectors.some(s => s.id === sector.id);
          const progress = getSectorProgress(sector.id);
          const revenue = getSectorRevenue(sector.id);
          const challenge = getLoopChallenge(sector.id);

          return (
            <Card 
              key={sector.id}
              className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
                isUnlocked 
                  ? 'hover:shadow-xl hover:scale-105 border-green-200 bg-gradient-to-br from-white to-green-50' 
                  : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 opacity-75'
              }`}
              onClick={() => {
                setSelectedSector(sector.id);
                setShowSectorDetails(true);
              }}
            >
              {/* Unlock Status Badge */}
              <div className="absolute top-2 right-2">
                {isUnlocked ? (
                  <Badge className="bg-green-100 text-green-800">
                    <Unlock className="h-3 w-3 mr-1" />
                    Unlocked
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">{sector.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{sector.name}</CardTitle>
                    <p className="text-xs text-gray-500">Sector {index + 1}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {sector.description}
                </p>

                {/* Progress Bar */}
                {isUnlocked && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {/* Revenue Potential */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Revenue Potential:</span>
                  <span className="font-semibold text-green-600">
                    ₹{(revenue / 100000).toFixed(1)}L
                  </span>
                </div>

                {/* Loop Challenge Preview */}
                <div className="p-2 bg-orange-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-orange-700 line-clamp-2">
                      {challenge}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {isUnlocked ? (
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSectorInvestment(sector.id);
                      }}
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Invest ₹2L
                    </Button>
                  ) : (
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-2">
                        Requires: {getUnlockRequirementsText(sector)}
                      </p>
                      <Button variant="outline" size="sm" disabled className="w-full">
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sector Details Modal */}
      <Dialog open={showSectorDetails} onOpenChange={setShowSectorDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedSector && (
                <>
                  <span className="text-2xl">
                    {industrySectors.find(s => s.id === selectedSector)?.icon}
                  </span>
                  {industrySectors.find(s => s.id === selectedSector)?.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedSector && (
            <div className="space-y-4">
              <p className="text-gray-600">
                {industrySectors.find(s => s.id === selectedSector)?.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Business Mechanics</h4>
                  <p className="text-sm text-blue-700">
                    Each sector has unique operational challenges that test different aspects of business leadership.
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Emotional Challenge</h4>
                  <p className="text-sm text-red-700">
                    {getLoopChallenge(selectedSector)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Success Strategy</h4>
                <p className="text-sm text-yellow-700">
                  Master this sector by maintaining high Clarity XP and low Loop Score. 
                  Each sector unlocks new strategic insights and team dynamics.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSectorDetails(false)}>
                  Close
                </Button>
                {unlockedSectors.some(s => s.id === selectedSector) && (
                  <Button onClick={() => {
                    handleSectorInvestment(selectedSector);
                    setShowSectorDetails(false);
                  }}>
                    Invest ₹2L
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Progress Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Empire Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {unlockedSectors.length}/{industrySectors.length}
              </p>
              <p className="text-sm text-gray-600">Sectors Unlocked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {playerStats.clarityXP}
              </p>
              <p className="text-sm text-gray-600">Clarity XP</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {100 - playerStats.loopScore}%
              </p>
              <p className="text-sm text-gray-600">Emotional Stability</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}