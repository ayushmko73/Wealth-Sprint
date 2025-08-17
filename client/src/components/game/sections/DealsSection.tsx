import React, { useState, useMemo } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  Handshake, 
  TrendingUp, 
  Building2, 
  Globe, 
  Calculator, 
  DollarSign, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Zap,
  Target,
  Shield,
  Lightbulb,
  PieChart,
  LineChart,
  Activity,
  Brain,
  CreditCard,
  Coins,
  Droplets,
  Eye,
  X
} from 'lucide-react';

interface Deal {
  id: string;
  type: 'sector' | 'stock' | 'acquisition' | 'joint_venture' | 'banking' | 'crypto';
  sector?: 'fast_food' | 'tech' | 'healthcare' | 'ecommerce' | 'real_estate' | 'renewable_energy';
  title: string;
  description: string;
  company: string;
  investmentRequired: number;
  expectedROI: number;
  riskLevel: 'low' | 'medium' | 'high';
  liquidity: 'high' | 'medium' | 'low';
  timeHorizon: number; // months
  cashflowMonthly: number;
  status: 'available' | 'active' | 'completed' | 'pending';
  requirements: {
    minSectors: number;
    specificSectors?: string[];
    minNetWorth?: number;
    minReputation?: number;
  };
  benefits: string[];
  risks: string[];
  keyFactors: { [key: string]: string };
}

const DealsSection: React.FC = () => {
  const { playerStats, financialData } = useWealthSprintGame();
  const [selectedCategory, setSelectedCategory] = useState('Overview');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState<Deal | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'credit'>('bank');
  const [paymentType, setPaymentType] = useState<'full' | 'emi'>('full');
  const [emiDuration, setEmiDuration] = useState<number>(3);

  // Categories for navigation
  const categories = ['Overview', 'Opportunities', 'Global Business', 'Financials'];

  // Category icons
  const categoryIcons: Record<string, JSX.Element> = {
    'Overview': <BarChart3 className="w-4 h-4" />,
    'Opportunities': <Target className="w-4 h-4" />,
    'Global Business': <Globe className="w-4 h-4" />,
    'Financials': <Calculator className="w-4 h-4" />
  };

  // Mock deals data with portfolio-based logic
  const allDeals: Deal[] = useMemo(() => {
    // Mock owned sectors for demo - in real implementation, get from game state
    const ownedSectors = ['fast_food']; // Example: player owns fast food sector
    const sectorCount = ownedSectors.length;

    // Base deals available based on portfolio logic
    const deals: Deal[] = [];

    // Entry-level deals (0 sectors)
    if (sectorCount === 0) {
      deals.push(
        {
          id: 'fast_food_entry',
          type: 'sector',
          sector: 'fast_food',
          title: 'Quick Bite Franchise',
          description: 'Entry-level fast food franchise opportunity with proven business model',
          company: 'Quick Bite Chain',
          investmentRequired: 250000,
          expectedROI: 18,
          riskLevel: 'medium',
          liquidity: 'medium',
          timeHorizon: 24,
          cashflowMonthly: 15000,
          status: 'available',
          requirements: { minSectors: 0, minNetWorth: 200000 },
          benefits: ['Proven business model', 'Training provided', 'Brand recognition'],
          risks: ['Market competition', 'Location dependency'],
          keyFactors: { 'Liquidity': 'Medium', 'Volatility': 'Low', 'Growth': 'Steady' }
        },
        {
          id: 'tech_entry',
          type: 'sector',
          sector: 'tech',
          title: 'SaaS Startup Investment',
          description: 'Early-stage SaaS platform targeting small businesses',
          company: 'CloudSync Solutions',
          investmentRequired: 500000,
          expectedROI: 35,
          riskLevel: 'high',
          liquidity: 'low',
          timeHorizon: 36,
          cashflowMonthly: 8000,
          status: 'available',
          requirements: { minSectors: 0, minNetWorth: 400000 },
          benefits: ['High growth potential', 'Scalable technology', 'Recurring revenue'],
          risks: ['Technology risk', 'Market adoption uncertainty'],
          keyFactors: { 'Liquidity': 'Low', 'Volatility': 'High', 'Growth': 'Exponential' }
        }
      );
    }

    // Expansion deals (1 sector)
    if (sectorCount === 1) {
      if (ownedSectors.includes('fast_food')) {
        deals.push({
          id: 'fast_food_expansion',
          type: 'sector',
          sector: 'fast_food',
          title: 'Premium Restaurant Chain',
          description: 'Expand into premium dining with established fast food experience',
          company: 'Gourmet Express',
          investmentRequired: 750000,
          expectedROI: 22,
          riskLevel: 'medium',
          liquidity: 'medium',
          timeHorizon: 18,
          cashflowMonthly: 25000,
          status: 'available',
          requirements: { minSectors: 1, specificSectors: ['fast_food'] },
          benefits: ['Higher margins', 'Premium positioning', 'Existing supply chain'],
          risks: ['Higher operational costs', 'Market positioning'],
          keyFactors: { 'Liquidity': 'Medium', 'Volatility': 'Medium', 'Growth': 'Strong' }
        });
      }
    }

    // Synergy deals (2+ sectors)
    if (sectorCount >= 2) {
      deals.push({
        id: 'multi_sector_synergy',
        type: 'sector',
        title: 'Cross-Industry Platform',
        description: 'Leverage multiple sector experience for integrated platform',
        company: 'Synergy Ventures',
        investmentRequired: 1200000,
        expectedROI: 45,
        riskLevel: 'medium',
        liquidity: 'low',
        timeHorizon: 42,
        cashflowMonthly: 35000,
        status: 'available',
        requirements: { minSectors: 2 },
        benefits: ['Cross-sector synergies', 'Diversified revenue', 'Market leadership'],
        risks: ['Complex operations', 'Integration challenges'],
        keyFactors: { 'Liquidity': 'Low', 'Volatility': 'Medium', 'Growth': 'Compound' }
      });
    }

    // Global Business deals (always available)
    deals.push(
      {
        id: 'stock_market_entry',
        type: 'stock',
        title: 'Blue Chip Portfolio',
        description: 'Diversified portfolio of established companies',
        company: 'Premium Equities',
        investmentRequired: 100000,
        expectedROI: 12,
        riskLevel: 'low',
        liquidity: 'high',
        timeHorizon: 12,
        cashflowMonthly: 1200,
        status: 'available',
        requirements: { minSectors: 0, minNetWorth: 80000 },
        benefits: ['High liquidity', 'Diversified risk', 'Dividend income'],
        risks: ['Market volatility', 'Economic cycles'],
        keyFactors: { 'Liquidity': 'High', 'Volatility': 'Low', 'Growth': 'Conservative' }
      },
      {
        id: 'acquisition_target',
        type: 'acquisition',
        title: '50% Acquisition Deal',
        description: 'Acquire controlling stake in profitable logistics company',
        company: 'Swift Logistics',
        investmentRequired: 2000000,
        expectedROI: 28,
        riskLevel: 'medium',
        liquidity: 'low',
        timeHorizon: 60,
        cashflowMonthly: 45000,
        status: 'available',
        requirements: { minSectors: 1, minNetWorth: 1500000 },
        benefits: ['Controlling stake', 'Proven profitability', 'Market position'],
        risks: ['Integration complexity', 'Management challenges'],
        keyFactors: { 'Liquidity': 'Low', 'Volatility': 'Medium', 'Growth': 'Controlled' }
      }
    );

    return deals;
  }, []);

  // Filter deals based on player's qualifications
  const qualifiedDeals = allDeals.filter(deal => {
    if (deal.requirements.minNetWorth && financialData.bankBalance < deal.requirements.minNetWorth) {
      return false;
    }
    if (deal.requirements.minReputation && playerStats.reputation < deal.requirements.minReputation) {
      return false;
    }
    // Mock owned sectors for qualification check
    const ownedSectors = ['fast_food']; // Example: player owns fast food sector
    if (deal.requirements.minSectors > ownedSectors.length) {
      return false;
    }
    if (deal.requirements.specificSectors) {
      return deal.requirements.specificSectors.some(sector => ownedSectors.includes(sector));
    }
    return true;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  // Get category colors for navigation
  const getCategoryColors = (category: string, isSelected: boolean) => {
    return isSelected 
      ? 'bg-white text-blue-600 border border-blue-600' 
      : 'bg-blue-600 text-white hover:bg-blue-700';
  };

  // Get risk color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const renderOverviewContent = () => {
    const activeDeals = qualifiedDeals.filter(deal => deal.status === 'active');
    const completedDeals = qualifiedDeals.filter(deal => deal.status === 'completed');
    const pendingDeals = qualifiedDeals.filter(deal => deal.status === 'pending');

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Active Deals</span>
            </div>
            <div className="text-xl font-bold text-blue-700">{activeDeals.length}</div>
            <div className="text-xs text-blue-600">Currently Running</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Completed</span>
            </div>
            <div className="text-xl font-bold text-green-700">{completedDeals.length}</div>
            <div className="text-xs text-green-600">Successfully Closed</div>
          </div>
        </div>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Portfolio Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Investment</span>
              <span className="font-semibold">{formatCurrency(1500000)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expected ROI</span>
              <span className="font-semibold text-green-600">24.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Monthly Cashflow</span>
              <span className="font-semibold text-blue-600">{formatCurrency(35000)}</span>
            </div>
          </div>
        </Card>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Deal Insights
          </h4>
          <ul className="space-y-2 text-sm text-amber-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              Your portfolio shows strong diversification across sectors
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              Consider higher-yield opportunities as your reputation grows
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              Balance high-risk, high-reward deals with stable investments
            </li>
          </ul>
        </div>
      </div>
    );
  };

  // Get deal type icon
  const getDealIcon = (deal: Deal) => {
    const iconMap: Record<string, JSX.Element> = {
      'sector': <Building2 className="w-6 h-6" />,
      'stock': <TrendingUp className="w-6 h-6" />,
      'acquisition': <Handshake className="w-6 h-6" />,
      'joint_venture': <Users className="w-6 h-6" />,
      'banking': <CreditCard className="w-6 h-6" />,
      'crypto': <Coins className="w-6 h-6" />
    };
    return iconMap[deal.type] || <Target className="w-6 h-6" />;
  };

  // Get sector color scheme - all blue now as requested
  const getSectorColors = (sector: string | undefined) => {
    // All cards use blue background as requested
    return { 
      bg: 'from-blue-50 to-blue-100', 
      border: 'border-blue-200', 
      text: 'text-blue-600', 
      icon: 'bg-blue-100' 
    };
  };

  // Get rarity color for deals based on investment size
  const getDealRarity = (investmentRequired: number) => {
    if (investmentRequired >= 2000000) return { rarity: 'epic', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    if (investmentRequired >= 1000000) return { rarity: 'rare', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    if (investmentRequired >= 500000) return { rarity: 'uncommon', color: 'bg-green-100 text-green-800 border-green-200' };
    return { rarity: 'common', color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  const renderOpportunitiesContent = () => {
    const availableDeals = qualifiedDeals.filter(deal => deal.status === 'available');
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableDeals.map(deal => {
          const colors = getSectorColors(deal.sector);
          const rarity = getDealRarity(deal.investmentRequired);
          const canAfford = financialData.bankBalance >= deal.investmentRequired;
          const monthlyReturn = (deal.investmentRequired * deal.expectedROI / 100) / 12;
          
          return (
            <Card 
              key={deal.id} 
              className={`overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-br ${colors.bg} ${colors.border} hover:border-blue-300`}
            >
              <CardContent className="p-4">
                {/* Deal Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.icon} ${colors.text}`}>
                      {getDealIcon(deal)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{deal.title}</h3>
                      <Badge className={`text-xs ${colors.text.replace('text-', 'bg-').replace('600', '100')} ${colors.text} ${colors.border}`}>
                        {deal.sector?.replace('_', ' ') || deal.type}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Investment Amount and ROI */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-left">
                    <div className="text-xl font-bold text-slate-800">
                      {formatCurrency(deal.investmentRequired)}
                    </div>
                    <div className={`text-sm ${colors.text} font-semibold`}>
                      {deal.expectedROI}% Annual ROI
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 rounded-full">
                    <Coins className="w-3 h-3 text-amber-600" />
                    <span className="text-xs font-semibold text-amber-700">
                      {formatCurrency(deal.cashflowMonthly)}/mo
                    </span>
                  </div>
                </div>

                {/* Company and Description */}
                <div className="mb-3">
                  <p className={`text-sm font-medium ${colors.text} mb-1`}>{deal.company}</p>
                  <p className="text-sm text-slate-600">{deal.description}</p>
                </div>

                {/* Deal Rarity and Type */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`text-xs px-2 py-1 ${rarity.color}`}>
                      <span className="capitalize">{rarity.rarity} Deal</span>
                    </Badge>
                    <Badge className={`text-xs px-2 py-1 ${getRiskColor(deal.riskLevel)}`}>
                      {deal.riskLevel} risk
                    </Badge>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-500" />
                    <span className="text-slate-600">{deal.timeHorizon}m horizon</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-green-500" />
                    <span className="text-slate-600 capitalize">{deal.liquidity} liquidity</span>
                  </div>
                </div>

                {/* Benefits and Risks Preview */}
                {(deal.benefits.length > 0 || deal.risks.length > 0) && (
                  <div className="mb-4 space-y-2">
                    {deal.benefits.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-xs font-semibold text-green-700">Key Benefits:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {deal.benefits.slice(0, 2).map((benefit, idx) => (
                            <Badge key={idx} className="text-[10px] bg-green-100 text-green-800 border-green-200">
                              {benefit}
                            </Badge>
                          ))}
                          {deal.benefits.length > 2 && (
                            <Badge className="text-[10px] bg-green-100 text-green-600 border-green-200">
                              +{deal.benefits.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {deal.risks.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          <span className="text-xs font-semibold text-red-700">Key Risks:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {deal.risks.slice(0, 2).map((risk, idx) => (
                            <Badge key={idx} className="text-[10px] bg-red-100 text-red-800 border-red-200">
                              {risk}
                            </Badge>
                          ))}
                          {deal.risks.length > 2 && (
                            <Badge className="text-[10px] bg-red-100 text-red-600 border-red-200">
                              +{deal.risks.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                    onClick={() => setExpandedDeal(expandedDeal === deal.id ? null : deal.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  <Button 
                    size="sm" 
                    className={`flex-1 ${
                      canAfford 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                    onClick={() => setShowPurchaseModal(deal)}
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {canAfford ? 'Invest' : 'Insufficient'}
                  </Button>
                </div>

                {/* Expanded Details */}
                {expandedDeal === deal.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    {/* Full Benefits List */}
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        All Benefits
                      </h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        {deal.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Full Risks List */}
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        All Risks
                      </h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {deal.risks.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Factors */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Key Investment Factors
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(deal.keyFactors).map(([key, value]) => (
                          <div key={key} className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-xs text-gray-600">{key}</div>
                            <div className="text-sm font-semibold text-gray-800">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Projections */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Financial Projections
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-blue-600">Monthly Return:</span>
                          <div className="font-semibold text-blue-800">{formatCurrency(monthlyReturn)}</div>
                        </div>
                        <div>
                          <span className="text-blue-600">Break-even:</span>
                          <div className="font-semibold text-blue-800">{Math.round(12/deal.expectedROI*100)} months</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderGlobalBusinessContent = () => {
    const globalDeals = qualifiedDeals.filter(deal => 
      ['stock', 'acquisition', 'joint_venture', 'banking', 'crypto'].includes(deal.type)
    );

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Global Business Opportunities
          </h3>
          <p className="text-sm text-purple-700">
            Non-sector specific deals including stocks, acquisitions, joint ventures, and financial instruments.
          </p>
        </div>

        {globalDeals.map(deal => (
          <Card key={deal.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{deal.title}</h3>
                <p className="text-gray-600 text-sm">{deal.description}</p>
                <p className="text-purple-600 text-sm font-medium">{deal.company}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{formatCurrency(deal.investmentRequired)}</div>
                <div className="text-sm text-gray-500">Required</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <div className="text-sm font-bold text-green-600">{deal.expectedROI}%</div>
                <div className="text-xs text-gray-500">Expected ROI</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-blue-600">{deal.liquidity}</div>
                <div className="text-xs text-gray-500">Liquidity</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-purple-600">{deal.timeHorizon}m</div>
                <div className="text-xs text-gray-500">Time Horizon</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Badge className={`text-xs px-2 py-1 ${getRiskColor(deal.riskLevel)}`}>
                {deal.riskLevel} risk
              </Badge>
              <Button size="sm">Deep Dive</Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderFinancialsContent = () => {
    return (
      <div className="space-y-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-600" />
            Portfolio Performance Analysis
          </h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Analysis
              </h4>
              <p className="text-sm text-blue-700">
                "Your current portfolio shows a 24.5% weighted average ROI, which is excellent. However, 
                70% of your investments have low liquidity, meaning you'll need to plan carefully if you 
                need quick access to cash. Consider balancing with more liquid assets for flexibility."
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-sm text-green-600">Portfolio ROI</div>
                <div className="text-xl font-bold text-green-700">24.5%</div>
                <div className="text-xs text-green-600">Weighted Average</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="text-sm text-yellow-600">Risk Score</div>
                <div className="text-xl font-bold text-yellow-700">6.2/10</div>
                <div className="text-xs text-yellow-600">Moderate Risk</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Cashflow Timeline
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm">Next 6 Months</span>
              <span className="font-semibold text-green-600">{formatCurrency(210000)}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm">Next 12 Months</span>
              <span className="font-semibold text-green-600">{formatCurrency(420000)}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm">Next 24 Months</span>
              <span className="font-semibold text-green-600">{formatCurrency(840000)}</span>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'Overview': return renderOverviewContent();
      case 'Opportunities': return renderOpportunitiesContent();
      case 'Global Business': return renderGlobalBusinessContent();
      case 'Financials': return renderFinancialsContent();
      default: return renderOverviewContent();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header - Full Width Blue Design */}
      <div className="mx-2">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          {/* Main Header Row */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Handshake className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Business Deals</h2>
                  <p className="text-blue-200 text-sm">Comprehensive deal management & portfolio optimization</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-200">Portfolio Value</div>
                <div className="text-lg font-bold">{formatCurrency(1500000)}</div>
              </div>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-4 gap-4 px-4 pb-4">
            <div>
              <p className="text-blue-200 text-xs">Active Deals</p>
              <p className="text-sm font-bold">3</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Avg ROI</p>
              <p className="text-sm font-bold">24.5%</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Monthly Flow</p>
              <p className="text-sm font-bold">{formatCurrency(35000)}</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Risk Level</p>
              <p className="text-sm font-bold">Medium</p>
            </div>
          </div>
          
          {/* Category Navigation */}
          <div className="overflow-x-auto px-4 pb-4">
            <div className="flex gap-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shadow-md ${
                    getCategoryColors(category, selectedCategory === category)
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
      <div className="px-4">
        {renderCategoryContent()}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full bg-white shadow-2xl border-0">
            <CardContent className="p-6 bg-white rounded-lg">
              {/* Header with Close Button */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Investment Purchase</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowPurchaseModal(null);
                    setPaymentMethod('bank');
                    setPaymentType('full');
                    setEmiDuration(3);
                  }}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Deal Info */}
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-2xl">
                  {getDealIcon(showPurchaseModal)}
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-2">
                  {showPurchaseModal.title}
                </h4>
                <p className="text-blue-600 text-sm font-medium mb-2">
                  {showPurchaseModal.company}
                </p>
              </div>

              {/* Key Investment Information */}
              <div className="space-y-3 mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Key Investment Information
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-blue-600">Investment Amount:</span>
                      <div className="font-bold text-blue-800">{formatCurrency(showPurchaseModal.investmentRequired)}</div>
                    </div>
                    <div>
                      <span className="text-blue-600">Expected ROI:</span>
                      <div className="font-bold text-green-800">{showPurchaseModal.expectedROI}%</div>
                    </div>
                    <div>
                      <span className="text-blue-600">Monthly Earnings:</span>
                      <div className="font-bold text-green-800">{formatCurrency(showPurchaseModal.cashflowMonthly)}</div>
                    </div>
                    <div>
                      <span className="text-blue-600">Time Horizon:</span>
                      <div className="font-bold text-blue-800">{showPurchaseModal.timeHorizon} months</div>
                    </div>
                    <div>
                      <span className="text-blue-600">Risk Level:</span>
                      <div className={`font-bold capitalize ${
                        showPurchaseModal.riskLevel === 'low' ? 'text-green-600' :
                        showPurchaseModal.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>{showPurchaseModal.riskLevel}</div>
                    </div>
                    <div>
                      <span className="text-blue-600">Liquidity:</span>
                      <div className="font-bold text-blue-800 capitalize">{showPurchaseModal.liquidity}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-4">
                <h5 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Method
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setPaymentMethod('bank');
                      setPaymentType('full');
                    }}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      paymentMethod === 'bank'
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <Building2 className="w-4 h-4" />
                      Banking
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('credit')}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      paymentMethod === 'credit'
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <CreditCard className="w-4 h-4" />
                      Credit Card
                    </div>
                  </button>
                </div>
              </div>

              {/* Credit Card Options */}
              {paymentMethod === 'credit' && (
                <div className="mb-4 relative">
                  <h5 className="font-semibold text-slate-800 mb-2">Payment Options</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentType('full')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        paymentType === 'full'
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Full Payment
                    </button>
                    <button
                      onClick={() => setPaymentType('emi')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        paymentType === 'emi'
                          ? 'bg-orange-100 border-orange-300 text-orange-800'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      EMI
                    </button>
                  </div>

                  {/* EMI Duration Selection - Overlay Menu */}
                  {paymentType === 'emi' && (
                    <div className="absolute top-16 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-3">
                      <h6 className="font-semibold text-slate-700 mb-2 text-sm">Choose Duration</h6>
                      <div className="grid grid-cols-2 gap-2">
                        {[3, 6, 12, 24, 36, 60].map((months) => (
                          <button
                            key={months}
                            onClick={() => setEmiDuration(months)}
                            className={`p-2 rounded text-xs font-medium transition-all ${
                              emiDuration === months
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {months < 12 ? `${months} months` : `${months/12} year${months/12 > 1 ? 's' : ''}`}
                          </button>
                        ))}
                      </div>
                      {paymentType === 'emi' && (
                        <div className="mt-2 p-2 bg-orange-50 rounded text-xs text-orange-700">
                          EMI: {formatCurrency(Math.ceil(showPurchaseModal.investmentRequired / emiDuration))}/month
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white border-red-500"
                  onClick={() => {
                    setShowPurchaseModal(null);
                    setPaymentMethod('bank');
                    setPaymentType('full');
                    setEmiDuration(3);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  onClick={() => {
                    // Handle purchase logic here
                    console.log('Purchase:', {
                      deal: showPurchaseModal.title,
                      amount: showPurchaseModal.investmentRequired,
                      paymentMethod,
                      paymentType,
                      emiDuration: paymentType === 'emi' ? emiDuration : null
                    });
                    setShowPurchaseModal(null);
                    setPaymentMethod('bank');
                    setPaymentType('full');
                    setEmiDuration(3);
                  }}
                >
                  Purchase
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DealsSection;