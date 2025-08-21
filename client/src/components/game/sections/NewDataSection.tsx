import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Target, 
  ArrowUp,
  ArrowDown,
  Activity,
  Zap,
  Star,
  Building2,
  Users,
  Briefcase,
  ShoppingCart,
  CheckCircle,
  X
} from 'lucide-react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { formatMoney } from '../../../lib/utils/formatMoney';
import { toast } from 'sonner';

export default function NewDataSection() {
  const { financialData, playerStats, updateFinancialData, addTransaction } = useWealthSprintGame();
  const [activeCategory, setActiveCategory] = useState<string>('Analytics');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<string[]>([]);

  // Sample data for the new section
  const categories = [
    { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'Performance', label: 'Performance', icon: TrendingUp },
    { id: 'Insights', label: 'Insights', icon: Target },
    { id: 'Reports', label: 'Reports', icon: Activity }
  ];

  const analyticsData = [
    {
      id: 1,
      title: 'Revenue Growth',
      value: '23.5%',
      change: '+5.2%',
      trend: 'up',
      description: 'Monthly revenue increase over last quarter'
    },
    {
      id: 2,
      title: 'Investment Returns',
      value: formatMoney(125000),
      change: '+12.8%',
      trend: 'up',
      description: 'Portfolio performance this month'
    },
    {
      id: 3,
      title: 'Cost Efficiency',
      value: '18.2%',
      change: '-3.1%',
      trend: 'down',
      description: 'Operational cost reduction'
    },
    {
      id: 4,
      title: 'Market Position',
      value: '4th',
      change: '+2 ranks',
      trend: 'up',
      description: 'Industry ranking improvement'
    }
  ];

  const performanceMetrics = [
    {
      id: 1,
      title: 'Business Efficiency',
      value: '87%',
      change: '+8%',
      trend: 'up',
      description: 'Overall business process efficiency'
    },
    {
      id: 2,
      title: 'Team Productivity',
      value: '92%',
      change: '+15%',
      trend: 'up',
      description: 'Employee performance metrics'
    },
    {
      id: 3,
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.3',
      trend: 'up',
      description: 'Average customer rating'
    },
    {
      id: 4,
      title: 'Market Share',
      value: '12.4%',
      change: '+2.1%',
      trend: 'up',
      description: 'Industry market share'
    }
  ];

  const insightsData = [
    {
      id: 1,
      title: 'Strategic Opportunities',
      value: '7',
      change: '+3',
      trend: 'up',
      description: 'New business opportunities identified'
    },
    {
      id: 2,
      title: 'Risk Assessment',
      value: 'Low',
      change: 'Stable',
      trend: 'neutral',
      description: 'Current risk level analysis'
    },
    {
      id: 3,
      title: 'Innovation Index',
      value: '78%',
      change: '+12%',
      trend: 'up',
      description: 'Innovation and R&D progress'
    },
    {
      id: 4,
      title: 'Competitive Advantage',
      value: 'Strong',
      change: '+15%',
      trend: 'up',
      description: 'Market positioning strength'
    }
  ];

  const reportsData = [
    {
      id: 1,
      title: 'Financial Summary',
      value: formatMoney(2450000),
      change: '+18.5%',
      trend: 'up',
      description: 'Total assets under management'
    },
    {
      id: 2,
      title: 'Quarterly Earnings',
      value: formatMoney(385000),
      change: '+22.3%',
      trend: 'up',
      description: 'Net profit this quarter'
    },
    {
      id: 3,
      title: 'Investment Portfolio',
      value: formatMoney(1850000),
      change: '+14.7%',
      trend: 'up',
      description: 'Total investment value'
    },
    {
      id: 4,
      title: 'Cash Flow',
      value: formatMoney(450000),
      change: '+9.2%',
      trend: 'up',
      description: 'Monthly cash flow positive'
    }
  ];

  const getCurrentData = () => {
    switch (activeCategory) {
      case 'Performance':
        return performanceMetrics;
      case 'Insights':
        return insightsData;
      case 'Reports':
        return reportsData;
      default:
        return analyticsData;
    }
  };

  // Get upgrades based on selected item
  const getUpgradesForItem = (item: any) => {
    const itemId = item?.id;
    const baseUpgrades = {
      1: [ // Revenue Growth
        {
          id: 'sales_automation',
          title: 'Sales Automation System',
          price: 75000,
          monthlyBoost: 12000,
          description: 'Automate lead generation and sales processes to boost revenue by 20%',
          impact: '+20% Revenue Growth'
        },
        {
          id: 'market_expansion',
          title: 'Market Expansion',
          price: 100000,
          monthlyBoost: 18000,
          description: 'Enter new markets and demographics to increase revenue streams',
          impact: '+25% Market Reach'
        }
      ],
      2: [ // Investment Returns
        {
          id: 'portfolio_optimizer',
          title: 'Portfolio Optimization',
          price: 60000,
          monthlyBoost: 10000,
          description: 'AI-powered portfolio management for better investment returns',
          impact: '+15% Return Rate'
        },
        {
          id: 'diversification_fund',
          title: 'Diversification Fund',
          price: 150000,
          monthlyBoost: 22000,
          description: 'Diversify into high-yield investment opportunities',
          impact: '+30% Portfolio Balance'
        }
      ],
      3: [ // Cost Efficiency  
        {
          id: 'process_automation',
          title: 'Process Automation',
          price: 80000,
          monthlyBoost: 14000,
          description: 'Automate repetitive tasks to reduce operational costs',
          impact: '+25% Cost Reduction'
        },
        {
          id: 'supply_chain_optimization',
          title: 'Supply Chain Optimization',
          price: 90000,
          monthlyBoost: 16000,
          description: 'Optimize supply chain for maximum cost efficiency',
          impact: '+20% Operational Savings'
        }
      ],
      4: [ // Market Position
        {
          id: 'brand_building',
          title: 'Brand Building Campaign',
          price: 70000,
          monthlyBoost: 11000,
          description: 'Strengthen brand presence and market positioning',
          impact: '+3 Market Rank'
        },
        {
          id: 'competitive_analysis',
          title: 'Competitive Intelligence',
          price: 50000,
          monthlyBoost: 8000,
          description: 'Advanced market research and competitive analysis tools',
          impact: '+2 Market Position'
        }
      ]
    };
    
    return baseUpgrades[itemId as keyof typeof baseUpgrades] || [];
  };

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const handlePurchaseUpgrade = (upgrade: any) => {
    if (financialData.bankBalance >= upgrade.price) {
      // Deduct cost from bank balance
      updateFinancialData({
        bankBalance: financialData.bankBalance - upgrade.price,
        sideIncome: financialData.sideIncome + upgrade.monthlyBoost
      });

      // Add transaction record
      addTransaction({
        type: 'business',
        amount: -upgrade.price,
        description: `Business Growth: ${upgrade.title}`,
        fromAccount: 'bank',
        toAccount: 'business'
      });

      // Track purchase
      setPurchasedUpgrades([...purchasedUpgrades, upgrade.id]);
      
      toast.success(`${upgrade.title} purchased! +${formatMoney(upgrade.monthlyBoost)}/month income boost`);
      setShowDetailsModal(false);
    } else {
      toast.error('Insufficient funds for this upgrade');
    }
  };

  // Calculate total contribution from upgrades
  const totalUpgradeContribution = purchasedUpgrades.reduce((total, upgradeId) => {
    // Find upgrade across all categories
    let upgrade = null;
    for (let i = 1; i <= 4; i++) {
      const categoryUpgrades = getUpgradesForItem({ id: i });
      upgrade = categoryUpgrades.find((u: any) => u.id === upgradeId);
      if (upgrade) break;
    }
    return total + (upgrade?.monthlyBoost || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Blue Background with Maximum Width */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            {/* Title Section */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-15 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Business Intelligence Hub</h1>
                <p className="text-blue-200 text-sm">Advanced Analytics • Real-time Insights • Strategic Planning</p>
              </div>
            </div>
            
            {/* Status Info */}
            <div className="bg-white bg-opacity-15 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2 text-white text-sm">
                <Activity className="w-4 h-4" />
                <span>Live Data</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-blue-200 text-xs">Net Worth</div>
                <div className="text-white font-bold text-lg">{formatMoney(financialData.totalAssets)}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Growth Boost</div>
                <div className="text-green-300 font-bold text-lg">{formatMoney(totalUpgradeContribution)}/mo</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Upgrades</div>
                <div className="text-white font-bold text-lg">{purchasedUpgrades.length}/8</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Success Rate</div>
                <div className="text-yellow-300 font-bold text-lg">87.5%</div>
              </div>
            </div>
          </div>

          {/* Menu - Horizontal Categories with Blue Background */}
          <div className="bg-blue-600 rounded-lg p-1">
            <div className="flex gap-1 overflow-x-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-white text-blue-800 shadow-md' 
                        : 'bg-transparent text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Data Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getCurrentData().map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800">{item.title}</CardTitle>
                  <div className="flex items-center gap-1">
                    {item.trend === 'up' && <ArrowUp className="w-4 h-4 text-green-600" />}
                    {item.trend === 'down' && <ArrowDown className="w-4 h-4 text-red-600" />}
                    {item.trend === 'neutral' && <Activity className="w-4 h-4 text-blue-600" />}
                    <span className={`text-sm font-medium ${
                      item.trend === 'up' ? 'text-green-600' : 
                      item.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                <p className="text-sm text-gray-600">{item.description}</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {activeCategory}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => handleViewDetails(item)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                {selectedItem?.title} - Growth Opportunities
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDetailsModal(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6 pt-4">
              {/* Current Metrics */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                <h3 className="font-bold text-blue-800 mb-4 text-lg">Current Performance: {selectedItem.title}</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-sm text-blue-600 mb-1">Value</div>
                    <div className="text-2xl font-bold text-blue-800">{selectedItem.value}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-blue-600 mb-1">Change</div>
                    <div className={`text-xl font-bold flex items-center justify-center gap-1 ${
                      selectedItem.trend === 'up' ? 'text-green-600' : 
                      selectedItem.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {selectedItem.trend === 'up' && <ArrowUp className="w-5 h-5" />}
                      {selectedItem.trend === 'down' && <ArrowDown className="w-5 h-5" />}
                      {selectedItem.change}
                    </div>
                  </div>
                </div>
                <p className="text-blue-700 mt-4 text-center bg-white bg-opacity-50 rounded-lg p-3">{selectedItem.description}</p>
                
                {/* Detailed Analytics */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white bg-opacity-70 rounded-lg p-3">
                    <div className="text-xs text-blue-600">Last Month</div>
                    <div className="font-bold text-blue-800">
                      {selectedItem.id === 1 ? '18.3%' : 
                       selectedItem.id === 2 ? formatMoney(98000) :
                       selectedItem.id === 3 ? '21.3%' : '6th'}
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-70 rounded-lg p-3">
                    <div className="text-xs text-blue-600">6 Month Avg</div>
                    <div className="font-bold text-blue-800">
                      {selectedItem.id === 1 ? '20.1%' : 
                       selectedItem.id === 2 ? formatMoney(105000) :
                       selectedItem.id === 3 ? '19.8%' : '5th'}
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-70 rounded-lg p-3">
                    <div className="text-xs text-blue-600">Industry Avg</div>
                    <div className="font-bold text-blue-800">
                      {selectedItem.id === 1 ? '15.2%' : 
                       selectedItem.id === 2 ? formatMoney(82000) :
                       selectedItem.id === 3 ? '14.5%' : '8th'}
                    </div>
                  </div>
                </div>
                
                {/* Key Insights */}
                <div className="mt-4 bg-white bg-opacity-70 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Key Insights</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    {selectedItem.id === 1 && (
                      <>
                        <div>• Performance is 8.3% above industry average</div>
                        <div>• Q4 showing strong upward momentum</div>
                        <div>• New customer acquisition rate increased by 35%</div>
                      </>
                    )}
                    {selectedItem.id === 2 && (
                      <>
                        <div>• Portfolio outperforming market by 52%</div>
                        <div>• High-yield bonds contributing 45% of returns</div>
                        <div>• Risk-adjusted returns show excellent stability</div>
                      </>
                    )}
                    {selectedItem.id === 3 && (
                      <>
                        <div>• Cost reduction ahead of target by 3.7%</div>
                        <div>• Automation saving ₹45K monthly</div>
                        <div>• Supply chain optimization showing 12% efficiency gain</div>
                      </>
                    )}
                    {selectedItem.id === 4 && (
                      <>
                        <div>• Moved up 2 positions in industry ranking</div>
                        <div>• Brand recognition increased by 28%</div>
                        <div>• Customer satisfaction score at all-time high</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Available Upgrades */}
              <div>
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-lg">
                  <ShoppingCart className="w-5 h-5" />
                  Targeted Improvements for {selectedItem.title}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {getUpgradesForItem(selectedItem).map((upgrade: any) => {
                    const isPurchased = purchasedUpgrades.includes(upgrade.id);
                    const canAfford = financialData.bankBalance >= upgrade.price;
                    
                    return (
                      <div key={upgrade.id} className={`border-2 rounded-xl p-5 transition-all duration-200 hover:shadow-lg ${
                        isPurchased 
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                          : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-gray-800 text-lg">{upgrade.title}</h4>
                          <div className="flex items-center gap-2">
                            {isPurchased && <CheckCircle className="w-5 h-5 text-green-600" />}
                            <Badge className={`px-3 py-1 ${
                              isPurchased 
                                ? 'bg-green-200 text-green-800 border-green-300' 
                                : 'bg-blue-100 text-blue-800 border-blue-200'
                            }`}>
                              {isPurchased ? 'OWNED' : formatMoney(upgrade.price)}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">{upgrade.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-green-600 font-bold text-lg">+{formatMoney(upgrade.monthlyBoost)}/month</span>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-2 py-1">
                              {upgrade.impact}
                            </Badge>
                          </div>
                          
                          {!isPurchased && (
                            <Button 
                              className={`w-full py-3 font-semibold ${
                                canAfford 
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              }`}
                              onClick={() => handlePurchaseUpgrade(upgrade)}
                              disabled={!canAfford}
                            >
                              {canAfford ? '💳 Purchase Now' : '💰 Insufficient Funds'}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Investment Summary
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-gray-600 mb-1">Available Balance</div>
                    <div className="text-xl font-bold text-gray-800">{formatMoney(financialData.bankBalance)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 mb-1">Monthly Growth Boost</div>
                    <div className="text-xl font-bold text-green-600">+{formatMoney(totalUpgradeContribution)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}