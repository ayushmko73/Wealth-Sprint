import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Handshake, Clock, DollarSign, TrendingUp, AlertTriangle, Users, Building } from 'lucide-react';

interface BusinessDeal {
  id: string;
  type: 'vc_funding' | 'acquisition' | 'partnership' | 'license' | 'exit' | 'merger';
  title: string;
  description: string;
  dealerName: string;
  dealerAvatar: string;
  dealerCompany: string;
  value: number;
  timeLimit: number; // hours
  urgency: 'low' | 'medium' | 'high' | 'critical';
  options: {
    id: string;
    text: string;
    consequences: {
      cashflow: number;
      equity: number;
      reputation: number;
      stress: number;
      karma: number;
      hidden?: string;
    };
  }[];
  hiddenClauses?: string[];
  requirements?: {
    minReputation?: number;
    minNetWorth?: number;
    minLogic?: number;
  };
}

const BusinessDealsSection: React.FC = () => {
  const { playerStats, financialData, updatePlayerStats, updateFinancialData, checkReputationAccess } = useWealthSprintGame();
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);

  // Mock business deals data
  const [businessDeals, setBusinessDeals] = useState<BusinessDeal[]>([
    {
      id: 'deal_1',
      type: 'vc_funding',
      title: 'Series A Funding Round',
      description: 'TechVenture Capital is interested in leading your Series A round',
      dealerName: 'Rajesh Khanna',
      dealerAvatar: '👨‍💼',
      dealerCompany: 'TechVenture Capital',
      value: 50000000,
      timeLimit: 72,
      urgency: 'high',
      options: [
        {
          id: 'accept',
          text: 'Accept ₹5 Cr for 25% equity + board seat',
          consequences: {
            cashflow: 50000000,
            equity: -25,
            reputation: 15,
            stress: 10,
            karma: 5,
          },
        },
        {
          id: 'negotiate',
          text: 'Negotiate for 20% equity, no board seat',
          consequences: {
            cashflow: 45000000,
            equity: -20,
            reputation: 10,
            stress: 20,
            karma: 10,
          },
        },
        {
          id: 'counter',
          text: 'Counter with ₹6 Cr for 25% equity',
          consequences: {
            cashflow: 35000000,
            equity: -25,
            reputation: 5,
            stress: 25,
            karma: 0,
          },
        },
        {
          id: 'decline',
          text: 'Decline and seek alternative funding',
          consequences: {
            cashflow: 0,
            equity: 0,
            reputation: -5,
            stress: 15,
            karma: 15,
          },
        },
      ],
      hiddenClauses: ['Liquidation preference', 'Anti-dilution protection'],
      requirements: {
        minReputation: 60,
        minNetWorth: 1000000,
      },
    },
    {
      id: 'deal_2',
      type: 'acquisition',
      title: 'Competitor Acquisition',
      description: 'Opportunity to acquire a struggling competitor at a discount',
      dealerName: 'Priya Sharma',
      dealerAvatar: '👩‍💼',
      dealerCompany: 'BusinessBrokers Inc.',
      value: 15000000,
      timeLimit: 48,
      urgency: 'medium',
      options: [
        {
          id: 'buy_full',
          text: 'Acquire 100% for ₹1.5 Cr',
          consequences: {
            cashflow: -15000000,
            equity: 0,
            reputation: 20,
            stress: 30,
            karma: 5,
          },
        },
        {
          id: 'buy_partial',
          text: 'Acquire 60% for ₹1 Cr',
          consequences: {
            cashflow: -10000000,
            equity: 0,
            reputation: 15,
            stress: 20,
            karma: 10,
          },
        },
        {
          id: 'asset_only',
          text: 'Buy only assets for ₹80L',
          consequences: {
            cashflow: -8000000,
            equity: 0,
            reputation: 10,
            stress: 15,
            karma: 0,
          },
        },
        {
          id: 'pass',
          text: 'Pass on this opportunity',
          consequences: {
            cashflow: 0,
            equity: 0,
            reputation: 0,
            stress: 0,
            karma: 0,
          },
        },
      ],
      hiddenClauses: ['Pending litigation', 'Employee retention issues'],
      requirements: {
        minNetWorth: 20000000,
        minLogic: 70,
      },
    },
    {
      id: 'deal_3',
      type: 'partnership',
      title: 'Strategic Partnership',
      description: 'Major corporation wants to partner for market expansion',
      dealerName: 'Amit Kumar',
      dealerAvatar: '👨‍💻',
      dealerCompany: 'MegaCorp Industries',
      value: 25000000,
      timeLimit: 96,
      urgency: 'low',
      options: [
        {
          id: 'equal_partnership',
          text: 'Equal partnership - 50/50 revenue split',
          consequences: {
            cashflow: 5000000,
            equity: 0,
            reputation: 25,
            stress: 10,
            karma: 15,
          },
        },
        {
          id: 'majority_partner',
          text: 'Become majority partner - 70/30 split',
          consequences: {
            cashflow: 2000000,
            equity: 0,
            reputation: 15,
            stress: 20,
            karma: 5,
          },
        },
        {
          id: 'licensing_only',
          text: 'License technology only - fixed fee',
          consequences: {
            cashflow: 10000000,
            equity: 0,
            reputation: 10,
            stress: 5,
            karma: 10,
          },
        },
        {
          id: 'decline_partnership',
          text: 'Decline partnership offer',
          consequences: {
            cashflow: 0,
            equity: 0,
            reputation: -5,
            stress: 5,
            karma: 5,
          },
        },
      ],
      requirements: {
        minReputation: 50,
      },
    },
  ]);

  const selectedDealData = selectedDeal ? businessDeals.find(d => d.id === selectedDeal) : null;

  const handleDealDecision = (dealId: string, optionId: string) => {
    const deal = businessDeals.find(d => d.id === dealId);
    const option = deal?.options.find(o => o.id === optionId);
    
    if (deal && option) {
      // Apply consequences
      updateFinancialData({
        bankBalance: financialData.bankBalance + option.consequences.cashflow,
        netWorth: financialData.netWorth + option.consequences.cashflow,
      });
      
      updatePlayerStats({
        reputation: Math.max(0, Math.min(100, playerStats.reputation + option.consequences.reputation)),
        stress: Math.max(0, Math.min(100, playerStats.stress + option.consequences.stress)),
        karma: Math.max(0, Math.min(100, playerStats.karma + option.consequences.karma)),
      });
      
      // Remove completed deal
      setBusinessDeals(businessDeals.filter(d => d.id !== dealId));
      setSelectedDeal(null);
    }
  };

  const getDealTypeIcon = (type: string) => {
    switch (type) {
      case 'vc_funding': return <DollarSign size={16} className="text-green-600" />;
      case 'acquisition': return <Building size={16} className="text-blue-600" />;
      case 'partnership': return <Handshake size={16} className="text-purple-600" />;
      case 'license': return <TrendingUp size={16} className="text-orange-600" />;
      case 'exit': return <AlertTriangle size={16} className="text-red-600" />;
      case 'merger': return <Users size={16} className="text-indigo-600" />;
      default: return <Handshake size={16} className="text-gray-600" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const canAccessDeal = (deal: BusinessDeal) => {
    if (!deal.requirements) return true;
    
    const { minReputation, minNetWorth, minLogic } = deal.requirements;
    
    return (
      (!minReputation || playerStats.reputation >= minReputation) &&
      (!minNetWorth || financialData.netWorth >= minNetWorth) &&
      (!minLogic || playerStats.logic >= minLogic)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#3a3a3a]">Business Deals</h1>
        <div className="flex items-center gap-4">
          <Badge className="bg-[#d4af37] text-white">
            {businessDeals.length} Active Deals
          </Badge>
        </div>
      </div>

      {!checkReputationAccess() && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">
            🚫 <strong>Limited Access:</strong> Your reputation ({playerStats.reputation}) is too low for premium business deals. 
            Focus on building your reputation to unlock high-value opportunities.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Deals List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Handshake size={20} />
              Available Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {businessDeals.map(deal => (
                <button
                  key={deal.id}
                  onClick={() => setSelectedDeal(deal.id)}
                  disabled={!canAccessDeal(deal)}
                  className={`w-full p-4 rounded-lg text-left transition-colors ${
                    selectedDeal === deal.id 
                      ? 'bg-[#d4af37] text-white' 
                      : canAccessDeal(deal)
                        ? 'bg-gray-50 hover:bg-gray-100'
                        : 'bg-gray-100 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getDealTypeIcon(deal.type)}
                      <span className="font-semibold text-sm">{deal.title}</span>
                    </div>
                    <Badge className={`${getUrgencyColor(deal.urgency)} text-white text-xs`}>
                      {deal.urgency.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm opacity-70 mb-2">
                    {deal.dealerName} • {deal.dealerCompany}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">₹{(deal.value / 10000000).toFixed(1)}Cr</span>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span className="text-xs">{deal.timeLimit}h</span>
                    </div>
                  </div>
                  {!canAccessDeal(deal) && (
                    <div className="mt-2 text-xs text-red-600">
                      Requirements not met
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Deal Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building size={20} />
              {selectedDealData ? selectedDealData.title : 'Select a deal'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDealData ? (
              <div className="space-y-6">
                {/* Deal Header */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{selectedDealData.dealerAvatar}</div>
                    <div>
                      <div className="font-semibold">{selectedDealData.dealerName}</div>
                      <div className="text-sm text-gray-600">{selectedDealData.dealerCompany}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{selectedDealData.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Deal Value</span>
                      <div className="font-semibold">₹{(selectedDealData.value / 10000000).toFixed(1)} Cr</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Time Left</span>
                      <div className="font-semibold">{selectedDealData.timeLimit} hours</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Urgency</span>
                      <Badge className={`${getUrgencyColor(selectedDealData.urgency)} text-white`}>
                        {selectedDealData.urgency.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Time Pressure */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Time Pressure</span>
                  </div>
                  <Progress value={(selectedDealData.timeLimit / 120) * 100} className="h-2 mb-2" />
                  <p className="text-sm text-yellow-700">
                    This deal expires in {selectedDealData.timeLimit} hours. Quick decision required!
                  </p>
                </div>

                {/* Hidden Clauses */}
                {selectedDealData.hiddenClauses && selectedDealData.hiddenClauses.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={16} className="text-blue-600" />
                      <span className="font-semibold text-blue-800">
                        {playerStats.logic >= 80 ? 'Hidden Clauses Detected' : 'Fine Print'}
                      </span>
                    </div>
                    {playerStats.logic >= 80 ? (
                      <div className="space-y-1">
                        {selectedDealData.hiddenClauses.map((clause, index) => (
                          <div key={index} className="text-sm text-blue-700">
                            • {clause}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-blue-700">
                        Your logic stat is too low to detect potential hidden clauses.
                      </p>
                    )}
                  </div>
                )}

                {/* Deal Options */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Your Options:</h3>
                  {selectedDealData.options.map(option => (
                    <Card key={option.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-3">
                          <p className="font-medium">{option.text}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                          {option.consequences.cashflow !== 0 && (
                            <Badge variant="outline" className={option.consequences.cashflow > 0 ? 'text-green-600' : 'text-red-600'}>
                              Cash: {option.consequences.cashflow > 0 ? '+' : ''}₹{(option.consequences.cashflow / 10000000).toFixed(1)}Cr
                            </Badge>
                          )}
                          {option.consequences.reputation !== 0 && (
                            <Badge variant="outline" className={option.consequences.reputation > 0 ? 'text-green-600' : 'text-red-600'}>
                              Rep: {option.consequences.reputation > 0 ? '+' : ''}{option.consequences.reputation}
                            </Badge>
                          )}
                          {option.consequences.stress !== 0 && (
                            <Badge variant="outline" className={option.consequences.stress > 0 ? 'text-red-600' : 'text-green-600'}>
                              Stress: {option.consequences.stress > 0 ? '+' : ''}{option.consequences.stress}
                            </Badge>
                          )}
                          {option.consequences.karma !== 0 && (
                            <Badge variant="outline" className={option.consequences.karma > 0 ? 'text-green-600' : 'text-red-600'}>
                              Karma: {option.consequences.karma > 0 ? '+' : ''}{option.consequences.karma}
                            </Badge>
                          )}
                          {option.consequences.equity !== 0 && (
                            <Badge variant="outline" className="text-purple-600">
                              Equity: {option.consequences.equity}%
                            </Badge>
                          )}
                        </div>
                        
                        <Button 
                          onClick={() => handleDealDecision(selectedDealData.id, option.id)}
                          className="w-full bg-[#d4af37] hover:bg-[#b8941f]"
                        >
                          Choose This Option
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Select a deal to view details and make your decision</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessDealsSection;
