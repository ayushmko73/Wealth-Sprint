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
      1: [ // Revenue Growth (8 upgrades)
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
        },
        {
          id: 'digital_marketing',
          title: 'Digital Marketing Suite',
          price: 85000,
          monthlyBoost: 15000,
          description: 'Advanced online marketing tools and campaigns',
          impact: '+30% Online Visibility'
        },
        {
          id: 'customer_loyalty',
          title: 'Customer Loyalty Program',
          price: 65000,
          monthlyBoost: 11000,
          description: 'Retain customers with rewards and loyalty benefits',
          impact: '+18% Customer Retention'
        },
        {
          id: 'pricing_optimization',
          title: 'Dynamic Pricing Engine',
          price: 95000,
          monthlyBoost: 16500,
          description: 'AI-driven pricing strategies for maximum revenue',
          impact: '+22% Pricing Efficiency'
        },
        {
          id: 'partnership_network',
          title: 'Strategic Partnerships',
          price: 110000,
          monthlyBoost: 19000,
          description: 'Build valuable business partnerships for growth',
          impact: '+28% Network Value'
        },
        {
          id: 'sales_training',
          title: 'Sales Team Training',
          price: 70000,
          monthlyBoost: 13000,
          description: 'Professional development for sales performance',
          impact: '+24% Sales Skills'
        },
        {
          id: 'revenue_analytics',
          title: 'Revenue Analytics Platform',
          price: 80000,
          monthlyBoost: 14500,
          description: 'Advanced revenue tracking and forecasting tools',
          impact: '+26% Revenue Insights'
        }
      ],
      2: [ // Investment Returns (8 upgrades)
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
        },
        {
          id: 'crypto_portfolio',
          title: 'Cryptocurrency Portfolio',
          price: 120000,
          monthlyBoost: 18000,
          description: 'Strategic crypto investments for high returns',
          impact: '+35% Crypto Gains'
        },
        {
          id: 'real_estate_reit',
          title: 'Real Estate REIT',
          price: 200000,
          monthlyBoost: 28000,
          description: 'Real estate investment trusts for stable income',
          impact: '+20% Property Returns'
        },
        {
          id: 'hedge_fund',
          title: 'Hedge Fund Access',
          price: 300000,
          monthlyBoost: 35000,
          description: 'Exclusive hedge fund investment opportunities',
          impact: '+40% Premium Returns'
        },
        {
          id: 'bond_ladder',
          title: 'Bond Ladder Strategy',
          price: 90000,
          monthlyBoost: 15000,
          description: 'Systematic bond investment for steady income',
          impact: '+18% Fixed Income'
        },
        {
          id: 'dividend_stocks',
          title: 'Dividend Growth Stocks',
          price: 140000,
          monthlyBoost: 20000,
          description: 'High-dividend paying stocks for regular income',
          impact: '+25% Dividend Yield'
        },
        {
          id: 'investment_advisor',
          title: 'Personal Investment Advisor',
          price: 180000,
          monthlyBoost: 25000,
          description: 'Professional investment guidance and strategy',
          impact: '+32% Advisory Value'
        }
      ],
      3: [ // Cost Efficiency (8 upgrades)
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
        },
        {
          id: 'energy_efficiency',
          title: 'Energy Management System',
          price: 85000,
          monthlyBoost: 15000,
          description: 'Smart energy solutions to reduce utility costs',
          impact: '+30% Energy Savings'
        },
        {
          id: 'vendor_negotiation',
          title: 'Vendor Contract Optimization',
          price: 75000,
          monthlyBoost: 13000,
          description: 'Renegotiate supplier contracts for better rates',
          impact: '+22% Vendor Savings'
        },
        {
          id: 'lean_methodology',
          title: 'Lean Operations Program',
          price: 95000,
          monthlyBoost: 17000,
          description: 'Implement lean principles to eliminate waste',
          impact: '+28% Efficiency Gain'
        },
        {
          id: 'cloud_migration',
          title: 'Cloud Infrastructure',
          price: 100000,
          monthlyBoost: 18000,
          description: 'Migrate to cloud for reduced IT infrastructure costs',
          impact: '+35% IT Savings'
        },
        {
          id: 'remote_work',
          title: 'Remote Work Program',
          price: 70000,
          monthlyBoost: 12000,
          description: 'Reduce office costs with remote work policies',
          impact: '+24% Office Savings'
        },
        {
          id: 'maintenance_optimization',
          title: 'Predictive Maintenance',
          price: 110000,
          monthlyBoost: 19000,
          description: 'AI-powered maintenance to prevent costly breakdowns',
          impact: '+26% Maintenance Savings'
        }
      ],
      4: [ // Market Position (8 upgrades)
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
        },
        {
          id: 'thought_leadership',
          title: 'Thought Leadership Program',
          price: 85000,
          monthlyBoost: 14000,
          description: 'Establish industry expertise and thought leadership',
          impact: '+4 Industry Authority'
        },
        {
          id: 'innovation_lab',
          title: 'Innovation Laboratory',
          price: 120000,
          monthlyBoost: 18000,
          description: 'R&D facility for breakthrough innovations',
          impact: '+5 Innovation Score'
        },
        {
          id: 'awards_recognition',
          title: 'Industry Awards Campaign',
          price: 60000,
          monthlyBoost: 10000,
          description: 'Strategic pursuit of industry recognition and awards',
          impact: '+3 Recognition Value'
        },
        {
          id: 'media_relations',
          title: 'Media Relations Program',
          price: 75000,
          monthlyBoost: 12000,
          description: 'Professional media outreach and PR campaigns',
          impact: '+4 Media Presence'
        },
        {
          id: 'industry_partnerships',
          title: 'Industry Alliance Network',
          price: 95000,
          monthlyBoost: 16000,
          description: 'Strategic alliances with industry leaders',
          impact: '+6 Network Strength'
        },
        {
          id: 'market_research',
          title: 'Advanced Market Research',
          price: 80000,
          monthlyBoost: 13000,
          description: 'Deep market insights and consumer behavior analysis',
          impact: '+5 Market Intelligence'
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
                <div className="text-white font-bold text-lg">{purchasedUpgrades.length}/{getUpgradesForItem({ id: 1 }).length + getUpgradesForItem({ id: 2 }).length + getUpgradesForItem({ id: 3 }).length + getUpgradesForItem({ id: 4 }).length}</div>
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
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black bg-opacity-20" 
            onClick={() => setShowDetailsModal(false)}
          />
          <div className="relative max-w-xs w-full max-h-[75vh] overflow-y-auto bg-white rounded-2xl shadow-lg">
            <div className="px-4 py-3 border-b bg-white flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-base font-semibold">{selectedItem?.title} - Growth Opportunities</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDetailsModal(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          
            {selectedItem && (
              <div className="p-3 space-y-3">
                {/* Current Metrics */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-3">
                  <h3 className="font-bold text-blue-800 mb-2 text-sm">Current Performance: {selectedItem.title}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-xs text-blue-600 mb-1">Value</div>
                    <div className="text-lg font-bold text-blue-800">{selectedItem.value}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-blue-600 mb-1">Change</div>
                    <div className={`text-base font-bold flex items-center justify-center gap-1 ${
                      selectedItem.trend === 'up' ? 'text-green-600' : 
                      selectedItem.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {selectedItem.trend === 'up' && <ArrowUp className="w-4 h-4" />}
                      {selectedItem.trend === 'down' && <ArrowDown className="w-4 h-4" />}
                      {selectedItem.change}
                    </div>
                  </div>
                </div>
                <p className="text-blue-700 mt-2 text-center bg-white bg-opacity-50 rounded-xl p-2 text-sm">{selectedItem.description}</p>
                
                {/* Detailed Analytics */}
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white bg-opacity-70 rounded-xl p-2">
                    <div className="text-xs text-blue-600">Last Month</div>
                    <div className="font-bold text-blue-800">
                      {selectedItem.id === 1 ? '18.3%' : 
                       selectedItem.id === 2 ? formatMoney(98000) :
                       selectedItem.id === 3 ? '21.3%' : '6th'}
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-70 rounded-xl p-2">
                    <div className="text-xs text-blue-600">6 Month Avg</div>
                    <div className="font-bold text-blue-800">
                      {selectedItem.id === 1 ? '20.1%' : 
                       selectedItem.id === 2 ? formatMoney(105000) :
                       selectedItem.id === 3 ? '19.8%' : '5th'}
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-70 rounded-xl p-2">
                    <div className="text-xs text-blue-600">Industry Avg</div>
                    <div className="font-bold text-blue-800">
                      {selectedItem.id === 1 ? '15.2%' : 
                       selectedItem.id === 2 ? formatMoney(82000) :
                       selectedItem.id === 3 ? '14.5%' : '8th'}
                    </div>
                  </div>
                </div>
                
                {/* Key Insights */}
                <div className="mt-2 bg-white bg-opacity-70 rounded-xl p-3">
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm">Key Insights</h4>
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
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-base">
                  <ShoppingCart className="w-5 h-5" />
                  Targeted Improvements for {selectedItem.title}
                </h3>
                <div className="grid gap-3">
                  {getUpgradesForItem(selectedItem).map((upgrade: any) => {
                    const isPurchased = purchasedUpgrades.includes(upgrade.id);
                    const canAfford = financialData.bankBalance >= upgrade.price;
                    
                    return (
                      <div key={upgrade.id} className={`border rounded-2xl p-3 transition-all duration-200 hover:shadow-md ${
                        isPurchased 
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                          : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-gray-800 text-sm">{upgrade.title}</h4>
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
                        
                        <p className="text-gray-600 mb-2 leading-relaxed text-xs">{upgrade.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-green-600 font-bold text-sm">+{formatMoney(upgrade.monthlyBoost)}/month</span>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-2 py-1">
                              {upgrade.impact}
                            </Badge>
                          </div>
                          
                          {!isPurchased && (
                            <Button 
                              className={`w-full py-2 text-xs font-semibold ${
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
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-3 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                  <DollarSign className="w-5 h-5" />
                  Investment Summary
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-gray-600 mb-1 text-xs">Available Balance</div>
                    <div className="text-base font-bold text-gray-800">{formatMoney(financialData.bankBalance)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 mb-1 text-xs">Monthly Growth Boost</div>
                    <div className="text-base font-bold text-green-600">+{formatMoney(totalUpgradeContribution)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}