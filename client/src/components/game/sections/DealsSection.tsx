import React, { useState, useMemo } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import SimpleOpportunitiesSection from './SimpleOpportunitiesSection';
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
  Home,
  Laptop,
  Heart,
  ShoppingCart,
  MapPin,
  Leaf,
  Bookmark,
  Share2,
  Download,
  Calendar,
  TrendingDown,
  Star,
  ArrowRight
} from 'lucide-react';

interface Deal {
  id: string;
  type: 'sector' | 'stock' | 'acquisition' | 'joint_venture' | 'banking' | 'crypto';
  sector?: 'fast_food' | 'tech' | 'healthcare' | 'ecommerce' | 'real_estate' | 'renewable_energy';
  title: string;
  tagline: string;
  description: string;
  company: string;
  investmentRequired: number;
  expectedROI: number;
  riskLevel: 'low' | 'medium' | 'high';
  liquidity: 'high' | 'medium' | 'low';
  timeHorizon: number; // months
  cashflowMonthly: number;
  status: 'available' | 'active' | 'completed' | 'pending';
  timelineStage: 'initiation' | 'growth' | 'maturity' | 'exit';
  timeline: string;
  requirements: {
    minSectors: number;
    specificSectors?: string[];
    minNetWorth?: number;
    minReputation?: number;
  };
  benefits: string[];
  risks: string[];
  keyFactors: { [key: string]: string };
  termsConditions: string[];
  financials: {
    projections: { month: number; revenue: number; profit: number }[];
    breakEvenMonths: number;
  };
}

const DealsSection: React.FC = () => {
  const { playerStats, financialData } = useWealthSprintGame();
  const [selectedCategory, setSelectedCategory] = useState('Overview');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeepDive, setShowDeepDive] = useState(false);

  // Categories for navigation
  const categories = ['Overview', 'Opportunities', 'Global Business', 'Financials'];

  // Category icons
  const categoryIcons: Record<string, JSX.Element> = {
    'Overview': <BarChart3 className="w-4 h-4" />,
    'Opportunities': <Target className="w-4 h-4" />,
    'Global Business': <Globe className="w-4 h-4" />,
    'Financials': <Calculator className="w-4 h-4" />
  };

  // Sector icons and colors
  const sectorConfig = {
    'fast_food': { icon: <Home className="w-5 h-5" />, color: 'from-orange-400 to-yellow-500', bgColor: 'bg-orange-50', textColor: 'text-orange-800', borderColor: 'border-orange-200' },
    'tech': { icon: <Laptop className="w-5 h-5" />, color: 'from-blue-400 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-800', borderColor: 'border-blue-200' },
    'healthcare': { icon: <Heart className="w-5 h-5" />, color: 'from-green-400 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-800', borderColor: 'border-green-200' },
    'ecommerce': { icon: <ShoppingCart className="w-5 h-5" />, color: 'from-purple-400 to-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-800', borderColor: 'border-purple-200' },
    'real_estate': { icon: <MapPin className="w-5 h-5" />, color: 'from-slate-400 to-slate-600', bgColor: 'bg-slate-50', textColor: 'text-slate-800', borderColor: 'border-slate-200' },
    'renewable_energy': { icon: <Leaf className="w-5 h-5" />, color: 'from-teal-400 to-lime-500', bgColor: 'bg-teal-50', textColor: 'text-teal-800', borderColor: 'border-teal-200' }
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
          tagline: 'Proven franchise model with training',
          description: 'Entry-level fast food franchise opportunity with proven business model',
          company: 'Quick Bite Chain',
          investmentRequired: 250000,
          expectedROI: 18,
          riskLevel: 'medium',
          liquidity: 'medium',
          timeHorizon: 24,
          cashflowMonthly: 15000,
          status: 'available',
          timelineStage: 'initiation',
          timeline: 'Q1 FY25',
          requirements: { minSectors: 0, minNetWorth: 200000 },
          benefits: ['Proven business model', 'Training provided', 'Brand recognition'],
          risks: ['Market competition', 'Location dependency'],
          keyFactors: { 'Liquidity': 'Medium', 'Volatility': 'Low', 'Growth': 'Steady' },
          termsConditions: [
            'Initial franchise fee: ₹50,000',
            'Royalty: 6% of monthly revenue',
            'Marketing fee: 2% of monthly revenue',
            'Minimum 3-year commitment'
          ],
          financials: {
            projections: [
              { month: 6, revenue: 180000, profit: 45000 },
              { month: 12, revenue: 240000, profit: 72000 },
              { month: 24, revenue: 300000, profit: 105000 }
            ],
            breakEvenMonths: 8
          }
        },
        {
          id: 'tech_entry',
          type: 'sector',
          sector: 'tech',
          title: 'SaaS Startup Investment',
          tagline: 'High-growth cloud platform opportunity',
          description: 'Early-stage SaaS platform targeting small businesses',
          company: 'CloudSync Solutions',
          investmentRequired: 500000,
          expectedROI: 35,
          riskLevel: 'high',
          liquidity: 'low',
          timeHorizon: 36,
          cashflowMonthly: 8000,
          status: 'available',
          timelineStage: 'initiation',
          timeline: 'Q2 FY25',
          requirements: { minSectors: 0, minNetWorth: 400000 },
          benefits: ['High growth potential', 'Scalable technology', 'Recurring revenue'],
          risks: ['Technology risk', 'Market adoption uncertainty'],
          keyFactors: { 'Liquidity': 'Low', 'Volatility': 'High', 'Growth': 'Exponential' },
          termsConditions: [
            'Equity stake: 15% for investment',
            'Board seat included',
            'Anti-dilution protection',
            'Tag-along rights'
          ],
          financials: {
            projections: [
              { month: 6, revenue: 60000, profit: -20000 },
              { month: 12, revenue: 150000, profit: 15000 },
              { month: 36, revenue: 500000, profit: 175000 }
            ],
            breakEvenMonths: 14
          }
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
          tagline: 'Upscale dining expansion opportunity',
          description: 'Expand into premium dining with established fast food experience',
          company: 'Gourmet Express',
          investmentRequired: 750000,
          expectedROI: 22,
          riskLevel: 'medium',
          liquidity: 'medium',
          timeHorizon: 18,
          cashflowMonthly: 25000,
          status: 'available',
          timelineStage: 'growth',
          timeline: 'Q3 FY25',
          requirements: { minSectors: 1, specificSectors: ['fast_food'] },
          benefits: ['Higher margins', 'Premium positioning', 'Existing supply chain'],
          risks: ['Higher operational costs', 'Market positioning'],
          keyFactors: { 'Liquidity': 'Medium', 'Volatility': 'Medium', 'Growth': 'Strong' },
          termsConditions: [
            'Partnership agreement: 60-40 split',
            'Management control retained',
            'Quarterly profit sharing',
            'Exit clause after 2 years'
          ],
          financials: {
            projections: [
              { month: 6, revenue: 300000, profit: 75000 },
              { month: 12, revenue: 450000, profit: 135000 },
              { month: 18, revenue: 600000, profit: 180000 }
            ],
            breakEvenMonths: 6
          }
        });
      }
    }

    // Synergy deals (2+ sectors)
    if (sectorCount >= 2) {
      deals.push({
        id: 'multi_sector_synergy',
        type: 'sector',
        title: 'Cross-Industry Platform',
        tagline: 'Multi-sector integration platform',
        description: 'Leverage multiple sector experience for integrated platform',
        company: 'Synergy Ventures',
        investmentRequired: 1200000,
        expectedROI: 45,
        riskLevel: 'medium',
        liquidity: 'low',
        timeHorizon: 42,
        cashflowMonthly: 35000,
        status: 'available',
        timelineStage: 'maturity',
        timeline: 'Q4 FY25',
        requirements: { minSectors: 2 },
        benefits: ['Cross-sector synergies', 'Diversified revenue', 'Market leadership'],
        risks: ['Complex operations', 'Integration challenges'],
        keyFactors: { 'Liquidity': 'Low', 'Volatility': 'Medium', 'Growth': 'Compound' },
        termsConditions: [
          'Multi-sector partnership required',
          'Joint venture structure 70-30',
          'Shared governance model',
          'Performance-based milestone gates'
        ],
        financials: {
          projections: [
            { month: 6, revenue: 450000, profit: 135000 },
            { month: 12, revenue: 900000, profit: 315000 },
            { month: 42, revenue: 3150000, profit: 1417500 }
          ],
          breakEvenMonths: 4
        }
      });
    }

    // Global Business deals (always available)
    deals.push(
      {
        id: 'stock_market_entry',
        type: 'stock',
        title: 'Blue Chip Portfolio',
        tagline: 'Diversified equity investment',
        description: 'Diversified portfolio of established companies',
        company: 'Premium Equities',
        investmentRequired: 100000,
        expectedROI: 12,
        riskLevel: 'low',
        liquidity: 'high',
        timeHorizon: 12,
        cashflowMonthly: 1200,
        status: 'available',
        timelineStage: 'growth',
        timeline: 'Q1 FY25',
        requirements: { minSectors: 0, minNetWorth: 80000 },
        benefits: ['High liquidity', 'Diversified risk', 'Dividend income'],
        risks: ['Market volatility', 'Economic cycles'],
        keyFactors: { 'Liquidity': 'High', 'Volatility': 'Low', 'Growth': 'Conservative' },
        termsConditions: [
          'Portfolio diversification across 50+ stocks',
          'Quarterly dividend distribution',
          'Exit flexibility with 24-hour notice',
          'Professional fund management included'
        ],
        financials: {
          projections: [
            { month: 3, revenue: 3000, profit: 3000 },
            { month: 6, revenue: 7200, profit: 7200 },
            { month: 12, revenue: 14400, profit: 14400 }
          ],
          breakEvenMonths: 1
        }
      },
      {
        id: 'acquisition_target',
        type: 'acquisition',
        title: '50% Acquisition Deal',
        tagline: 'Controlling stake acquisition',
        description: 'Acquire controlling stake in profitable logistics company',
        company: 'Swift Logistics',
        investmentRequired: 2000000,
        expectedROI: 28,
        riskLevel: 'medium',
        liquidity: 'low',
        timeHorizon: 60,
        cashflowMonthly: 45000,
        status: 'available',
        timelineStage: 'growth',
        timeline: 'Q2 FY26',
        requirements: { minSectors: 1, minNetWorth: 1500000 },
        benefits: ['Controlling stake', 'Proven profitability', 'Market position'],
        risks: ['Integration complexity', 'Management challenges'],
        keyFactors: { 'Liquidity': 'Low', 'Volatility': 'Medium', 'Growth': 'Controlled' },
        termsConditions: [
          '50% equity acquisition',
          'Board control with 3/5 seats',
          'Management oversight rights',
          'Performance guarantees for 24 months'
        ],
        financials: {
          projections: [
            { month: 12, revenue: 540000, profit: 162000 },
            { month: 24, revenue: 1080000, profit: 378000 },
            { month: 60, revenue: 2700000, profit: 1215000 }
          ],
          breakEvenMonths: 6
        }
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

  // Enhanced deal card component
  const DealCard = ({ deal }: { deal: Deal }) => {
    const sectorInfo = deal.sector ? sectorConfig[deal.sector] : null;
    
    return (
      <div 
        className={`relative rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
          sectorInfo ? `bg-gradient-to-br ${sectorInfo.color} ${sectorInfo.bgColor}` : 'bg-gradient-to-br from-gray-100 to-white'
        } ${sectorInfo ? sectorInfo.borderColor : 'border-gray-200'} border-2 p-5`}
        onClick={() => {
          setSelectedDeal(deal);
          setShowModal(true);
        }}
      >
        {/* Timeline Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
            {deal.timeline}
          </div>
        </div>

        {/* Header - Sector Icon + Title */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg ${sectorInfo ? sectorInfo.bgColor : 'bg-gray-100'} flex items-center justify-center shadow-md`}>
            {sectorInfo ? sectorInfo.icon : <Building2 className="w-5 h-5 text-gray-600" />}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg leading-tight mb-1" style={{ fontFamily: 'serif' }}>
              {deal.title}
            </h3>
            <p className="text-sm uppercase tracking-wide opacity-75 font-medium">
              {deal.tagline}
            </p>
          </div>
        </div>

        {/* Investment Required */}
        <div className="text-right mb-4">
          <div className="text-2xl font-bold">{formatCurrency(deal.investmentRequired)}</div>
          <div className="text-xs opacity-70">Investment Required</div>
        </div>

        {/* Mini Stats Row */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Badge className={`text-xs px-2 py-1 font-semibold ${getRiskColor(deal.riskLevel)}`}>
              {deal.riskLevel}
            </Badge>
            <Badge className="text-xs px-2 py-1 bg-green-100 text-green-800 border border-green-300 font-bold">
              {deal.expectedROI}% ROI
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold">{formatCurrency(deal.cashflowMonthly)}/mo</div>
            <div className="text-xs opacity-70">Cashflow</div>
          </div>
        </div>

        {/* Timeline Progress Dots */}
        <div className="flex justify-center mt-4 gap-2">
          {['initiation', 'growth', 'maturity', 'exit'].map((stage, index) => (
            <div 
              key={stage}
              className={`w-2 h-2 rounded-full ${
                stage === deal.timelineStage ? 'bg-blue-600 shadow-lg' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderOpportunitiesContent = () => {
    return (
      <div className="grid gap-4">
        {qualifiedDeals.filter(deal => deal.status === 'available').map(deal => (
          <DealCard key={deal.id} deal={deal} />
        ))}
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

  // Deal Modal Component
  const DealModal = ({ deal, onClose }: { deal: Deal; onClose: () => void }) => {
    if (!deal) return null;

    const sectorInfo = deal.sector ? sectorConfig[deal.sector] : null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={onClose}>
        <div 
          className="bg-white rounded-t-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            {sectorInfo && (
              <div className={`w-12 h-12 rounded-xl ${sectorInfo.bgColor} flex items-center justify-center`}>
                {sectorInfo.icon}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold" style={{ fontFamily: 'serif' }}>{deal.title}</h2>
              <p className="text-gray-600">{deal.company}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <div className="w-6 h-6 flex items-center justify-center">×</div>
            </button>
          </div>

          {/* Timeline Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              {['Initiation', 'Growth', 'Maturity', 'Exit'].map((stage, index) => (
                <div key={stage} className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mb-1 ${
                    stage.toLowerCase() === deal.timelineStage ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                  <span className="text-xs text-gray-600">{stage}</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-600 h-1 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(['initiation', 'growth', 'maturity', 'exit'].indexOf(deal.timelineStage) + 1) * 25}%` 
                }}
              />
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Terms & Conditions
            </h3>
            <ul className="space-y-2">
              {deal.termsConditions.map((term, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  {term}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-800">
              <Star className="w-4 h-4 text-green-600" />
              Benefits
            </h3>
            <div className="flex flex-wrap gap-2">
              {deal.benefits.map((benefit, index) => (
                <Badge key={index} className="bg-green-100 text-green-800 border-green-300 text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Risks
            </h3>
            <div className="flex flex-wrap gap-2">
              {deal.risks.map((risk, index) => (
                <Badge key={index} className="bg-red-100 text-red-800 border-red-300 text-xs">
                  {risk}
                </Badge>
              ))}
            </div>
          </div>

          {/* Important Factors */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              Important Factors
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(deal.keyFactors).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-2 rounded-lg border">
                  <div className="text-xs text-gray-600">{key}</div>
                  <div className="font-semibold">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg"
              onClick={() => {
                // Handle investment
                alert(`Invested ${formatCurrency(deal.investmentRequired)} in ${deal.title}`);
                onClose();
              }}
            >
              Invest Now
            </Button>
            <Button 
              variant="outline" 
              className="px-4 py-3 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => {
                setShowDeepDive(true);
              }}
            >
              <Calculator className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              className="px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Deep Dive Modal Component
  const DeepDiveModal = ({ deal, onClose }: { deal: Deal; onClose: () => void }) => {
    if (!deal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div 
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Financial Analysis - {deal.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <div className="w-6 h-6 flex items-center justify-center">×</div>
            </button>
          </div>

          {/* AI Analysis */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Analysis
            </h3>
            <p className="text-sm text-blue-700">
              "{deal.expectedROI}% ROI looks promising for a {deal.timeHorizon}-month investment. However, 
              with {deal.liquidity} liquidity, you'll need to plan carefully if you need quick access to cash. 
              The {deal.riskLevel} risk level means {
                deal.riskLevel === 'low' ? 'stable returns but limited upside' :
                deal.riskLevel === 'medium' ? 'balanced risk-reward ratio' :
                'high potential returns but significant volatility'
              }."
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="text-sm text-green-600">Expected ROI</div>
              <div className="text-2xl font-bold text-green-700">{deal.expectedROI}%</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <div className="text-sm text-yellow-600">Break Even</div>
              <div className="text-2xl font-bold text-yellow-700">{deal.financials.breakEvenMonths}m</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="text-sm text-purple-600">Time Horizon</div>
              <div className="text-2xl font-bold text-purple-700">{deal.timeHorizon}m</div>
            </div>
          </div>

          {/* Projections Table */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Financial Projections</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 p-2 text-left">Month</th>
                    <th className="border border-gray-200 p-2 text-left">Revenue</th>
                    <th className="border border-gray-200 p-2 text-left">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {deal.financials.projections.map((proj, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-2">{proj.month}</td>
                      <td className="border border-gray-200 p-2">{formatCurrency(proj.revenue)}</td>
                      <td className="border border-gray-200 p-2 font-semibold">
                        <span className={proj.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(proj.profit)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
              onClick={() => {
                alert(`Invested ${formatCurrency(deal.investmentRequired)} in ${deal.title}`);
                onClose();
              }}
            >
              Confirm Investment
            </Button>
            <Button variant="outline" className="px-4 py-3 rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'Overview': return renderOverviewContent();
      case 'Opportunities': return <SimpleOpportunitiesSection />;
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

      {/* Modals */}
      {showModal && selectedDeal && (
        <DealModal 
          deal={selectedDeal} 
          onClose={() => {
            setShowModal(false);
            setSelectedDeal(null);
            setShowDeepDive(false);
          }} 
        />
      )}

      {showDeepDive && selectedDeal && (
        <DeepDiveModal 
          deal={selectedDeal} 
          onClose={() => {
            setShowDeepDive(false);
            setShowModal(false);
            setSelectedDeal(null);
          }} 
        />
      )}
    </div>
  );
};

export default DealsSection;