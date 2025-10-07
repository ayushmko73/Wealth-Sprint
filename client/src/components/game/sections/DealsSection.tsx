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
  X,
  Briefcase,
  ChevronDown,
  ShoppingBag,
  Home,
  Utensils
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
  const { playerStats, financialData, purchaseDeal } = useWealthSprintGame();
  const [selectedCategory, setSelectedCategory] = useState('Overview');

  // Get asset icon for investment portfolio
  const getAssetIcon = (asset: any) => {
    const name = asset.name?.toLowerCase() || '';
    
    // Enhanced name-based matching for investment assets
    if (name.includes('renewable') || name.includes('solar') || name.includes('wind') || name.includes('energy')) return <Zap className="w-4 h-4 text-white" />;
    if (name.includes('tech') || name.includes('software') || name.includes('app') || name.includes('digital')) return <Brain className="w-4 h-4 text-white" />;
    if (name.includes('healthcare') || name.includes('medical') || name.includes('pharma')) return <Shield className="w-4 h-4 text-white" />;
    if (name.includes('real estate') || name.includes('property') || name.includes('housing')) return <Home className="w-4 h-4 text-white" />;
    if (name.includes('crypto') || name.includes('bitcoin') || name.includes('blockchain')) return <Coins className="w-4 h-4 text-white" />;
    if (name.includes('stock') || name.includes('equity') || name.includes('share')) return <TrendingUp className="w-4 h-4 text-white" />;
    if (name.includes('bond') || name.includes('government') || name.includes('municipal')) return <Building2 className="w-4 h-4 text-white" />;
    
    // Category-based fallback
    if (asset.category === 'investment') return <Briefcase className="w-4 h-4 text-white" />;
    
    // Default fallback
    return <Target className="w-4 h-4 text-white" />;
  };
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState<Deal | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'credit'>('bank');
  const [paymentType, setPaymentType] = useState<'full' | 'emi' | null>(null); // Default unselected
  const [emiDuration, setEmiDuration] = useState<number>(3);
  const [showEmiDropdown, setShowEmiDropdown] = useState(false);

  // Credit limit calculation helper
  const getCreditInfo = () => {
    const creditCardLiabilities = financialData.liabilities.filter(l => l.category === 'credit_card');
    const totalCreditUsed = creditCardLiabilities.reduce((sum, liability) => sum + liability.outstandingAmount, 0);
    const totalMonthlyEmi = creditCardLiabilities.reduce((sum, liability) => sum + liability.emi, 0);
    const creditLimit = 500000; // ₹5 lakh credit limit
    const availableCredit = creditLimit - totalCreditUsed;
    const canPayFull = showPurchaseModal && showPurchaseModal.investmentRequired <= availableCredit;
    return { totalCreditUsed, totalMonthlyEmi, creditLimit, availableCredit, canPayFull };
  };

  // Categories for navigation
  const categories = ['Overview', 'Opportunities', 'Financials'];

  // Category icons
  const categoryIcons: Record<string, JSX.Element> = {
    'Overview': <BarChart3 className="w-4 h-4" />,
    'Opportunities': <Target className="w-4 h-4" />,
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
        type: 'joint_venture',
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

    // Global Business deals - Progressive high-value investments
    const globalBusinessDeals: Deal[] = [
      // Level 1: 50L - 1Cr deals (entry level)
      {
        id: 'global_manufacturing_1',
        type: 'acquisition',
        title: 'Industrial Manufacturing Plant',
        description: 'Acquire majority stake in established steel manufacturing facility',
        company: 'Steel Tech Industries',
        investmentRequired: 7500000, // 75L
        expectedROI: 18,
        riskLevel: 'medium',
        liquidity: 'low',
        timeHorizon: 48,
        cashflowMonthly: 125000,
        status: 'available',
        requirements: { minSectors: 0, minNetWorth: 5000000 },
        benefits: ['Established market presence', 'Steady industrial demand', 'Asset-backed value'],
        risks: ['Capital intensive operations', 'Environmental regulations', 'Commodity price volatility'],
        keyFactors: { 'Liquidity': 'Low', 'Volatility': 'Medium', 'Growth': 'Industrial' }
      },
      {
        id: 'global_telecom_1',
        type: 'joint_venture',
        title: 'Telecom Infrastructure JV',
        description: 'Joint venture in 5G tower installation across tier-2 cities',
        company: 'Connect India Networks',
        investmentRequired: 8500000, // 85L
        expectedROI: 22,
        riskLevel: 'medium',
        liquidity: 'medium',
        timeHorizon: 36,
        cashflowMonthly: 180000,
        status: 'available',
        requirements: { minSectors: 0, minNetWorth: 6000000 },
        benefits: ['Government backing', 'Future-ready technology', 'Recurring revenue model'],
        risks: ['Technology obsolescence', 'Regulatory changes', 'High competition'],
        keyFactors: { 'Liquidity': 'Medium', 'Volatility': 'Medium', 'Growth': 'Technology' }
      },
      
      // Level 2: 1Cr - 10Cr deals
      {
        id: 'global_pharma_2',
        type: 'acquisition',
        title: 'Pharmaceutical Distribution Network',
        description: 'Complete acquisition of regional pharmaceutical distribution company',
        company: 'MediCare Distribution Ltd',
        investmentRequired: 35000000, // 3.5Cr
        expectedROI: 25,
        riskLevel: 'low',
        liquidity: 'medium',
        timeHorizon: 60,
        cashflowMonthly: 750000,
        status: 'available',
        requirements: { minSectors: 1, minNetWorth: 25000000 },
        benefits: ['Essential service sector', 'Stable demand', 'Government contracts'],
        risks: ['Regulatory compliance', 'Supply chain disruptions', 'Price controls'],
        keyFactors: { 'Liquidity': 'Medium', 'Volatility': 'Low', 'Growth': 'Healthcare' }
      },
      {
        id: 'global_energy_2',
        type: 'acquisition',
        title: 'Renewable Energy Portfolio',
        description: 'Acquire wind and solar farm portfolio across multiple states',
        company: 'GreenPower Solutions',
        investmentRequired: 65000000, // 6.5Cr
        expectedROI: 28,
        riskLevel: 'medium',
        liquidity: 'low',
        timeHorizon: 84,
        cashflowMonthly: 1450000,
        status: 'available',
        requirements: { minSectors: 1, minNetWorth: 45000000 },
        benefits: ['Government incentives', 'Long-term contracts', 'ESG compliance'],
        risks: ['Weather dependency', 'Technology changes', 'Grid stability issues'],
        keyFactors: { 'Liquidity': 'Low', 'Volatility': 'Medium', 'Growth': 'Sustainable' }
      },
      
      // Level 3: 10Cr - 100Cr deals
      {
        id: 'global_banking_3',
        type: 'acquisition',
        title: 'Regional Banking Institution',
        description: 'Majority stake acquisition in profitable regional bank',
        company: 'Capital Trust Bank',
        investmentRequired: 250000000, // 25Cr
        expectedROI: 20,
        riskLevel: 'medium',
        liquidity: 'medium',
        timeHorizon: 72,
        cashflowMonthly: 4200000,
        status: 'available',
        requirements: { minSectors: 2, minNetWorth: 180000000 },
        benefits: ['Financial sector expertise', 'Regulatory moat', 'Diversified income'],
        risks: ['Regulatory scrutiny', 'Credit risk exposure', 'Economic cycles'],
        keyFactors: { 'Liquidity': 'Medium', 'Volatility': 'Medium', 'Growth': 'Financial' }
      },
      {
        id: 'global_ports_3',
        type: 'acquisition',
        title: 'Maritime Port Operations',
        description: 'Strategic acquisition of container port terminal operations',
        company: 'Ocean Gateway Terminals',
        investmentRequired: 450000000, // 45Cr
        expectedROI: 24,
        riskLevel: 'medium',
        liquidity: 'low',
        timeHorizon: 120,
        cashflowMonthly: 8750000,
        status: 'available',
        requirements: { minSectors: 2, minNetWorth: 320000000 },
        benefits: ['Strategic infrastructure', 'Trade growth exposure', 'High barriers to entry'],
        risks: ['Capital intensive', 'Global trade volatility', 'Environmental concerns'],
        keyFactors: { 'Liquidity': 'Low', 'Volatility': 'High', 'Growth': 'Infrastructure' }
      },
      
      // Level 4: 100Cr - 500Cr deals (ultra high-value)
      {
        id: 'global_airline_4',
        type: 'acquisition',
        title: 'National Airline Acquisition',
        description: 'Complete acquisition of established domestic airline with international routes',
        company: 'Skyways International',
        investmentRequired: 1500000000, // 150Cr
        expectedROI: 22,
        riskLevel: 'high',
        liquidity: 'medium',
        timeHorizon: 96,
        cashflowMonthly: 28000000,
        status: 'available',
        requirements: { minSectors: 3, minNetWorth: 1000000000 },
        benefits: ['Market leadership', 'International exposure', 'Brand recognition'],
        risks: ['Fuel price volatility', 'Economic sensitivity', 'Regulatory complexity'],
        keyFactors: { 'Liquidity': 'Medium', 'Volatility': 'High', 'Growth': 'Aviation' }
      },
      {
        id: 'global_mining_4',
        type: 'acquisition',
        title: 'Mineral Extraction Conglomerate',
        description: 'Acquisition of diversified mining operations across iron ore, coal, and rare metals',
        company: 'Bharat Mining Corporation',
        investmentRequired: 2800000000, // 280Cr
        expectedROI: 26,
        riskLevel: 'high',
        liquidity: 'low',
        timeHorizon: 144,
        cashflowMonthly: 65000000,
        status: 'available',
        requirements: { minSectors: 3, minNetWorth: 2000000000 },
        benefits: ['Resource control', 'Global demand exposure', 'Strategic materials'],
        risks: ['Commodity cycles', 'Environmental regulations', 'Geopolitical risks'],
        keyFactors: { 'Liquidity': 'Low', 'Volatility': 'Very High', 'Growth': 'Commodities' }
      },
      {
        id: 'global_media_4',
        type: 'acquisition',
        title: 'Media & Entertainment Empire',
        description: 'Complete acquisition of integrated media conglomerate with TV, film, and digital assets',
        company: 'Universal Entertainment Group',
        investmentRequired: 4200000000, // 420Cr
        expectedROI: 30,
        riskLevel: 'high',
        liquidity: 'medium',
        timeHorizon: 108,
        cashflowMonthly: 95000000,
        status: 'available',
        requirements: { minSectors: 4, minNetWorth: 3000000000 },
        benefits: ['Brand portfolio', 'Content creation capabilities', 'Digital transformation'],
        risks: ['Changing consumer preferences', 'Technology disruption', 'Content creation risks'],
        keyFactors: { 'Liquidity': 'Medium', 'Volatility': 'High', 'Growth': 'Entertainment' }
      }
    ];

    // Add Global Business deals based on player's progression level
    const playerLevel = Math.min(Math.floor(sectorCount / 1) + Math.floor(financialData.bankBalance / 50000000), 4);
    
    globalBusinessDeals.forEach(deal => {
      const dealLevel = deal.investmentRequired <= 10000000 ? 1 : 
                        deal.investmentRequired <= 100000000 ? 2 : 
                        deal.investmentRequired <= 1000000000 ? 3 : 4;
      
      if (dealLevel <= playerLevel + 1) { // Show current level + 1 level ahead
        deals.push(deal);
      }
    });

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
    // Get actual investment data from game store
    const investmentAssets = financialData.assets.filter(asset => asset.category === 'investment');
    const portfolioValue = investmentAssets.reduce((total, asset) => total + asset.value, 0);
    const monthlyIncome = investmentAssets.reduce((total, asset) => total + (asset.monthlyIncome || 0), 0);
    const activeDealCount = investmentAssets.length;
    const averageROI = activeDealCount > 0 
      ? investmentAssets.reduce((total, asset) => total + ((asset.appreciationRate || 0) * 12 * 100), 0) / activeDealCount 
      : 0;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Active Investments</span>
            </div>
            <div className="text-xl font-bold text-blue-700">{activeDealCount}</div>
            <div className="text-xs text-blue-600">Currently Running</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Monthly Income</span>
            </div>
            <div className="text-xl font-bold text-green-700">{formatCurrency(monthlyIncome)}</div>
            <div className="text-xs text-green-600">From Investments</div>
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
              <span className="font-semibold">{formatCurrency(financialData.investments.stocks)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Portfolio Value</span>
              <span className="font-semibold">{formatCurrency(portfolioValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average ROI</span>
              <span className="font-semibold text-green-600">{averageROI.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Monthly Cashflow</span>
              <span className="font-semibold text-blue-600">{formatCurrency(monthlyIncome)}</span>
            </div>
          </div>
        </Card>

        {/* Investment Portfolio */}
        {investmentAssets.length > 0 ? (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Your Investment Portfolio
            </h3>
            <div className="space-y-3">
              {investmentAssets.map((asset) => (
                <div key={asset.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    {getAssetIcon(asset)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{asset.name}</div>
                    <div className="text-xs text-gray-500">
                      Invested {formatCurrency(asset.purchasePrice)} • {
                        Math.floor((new Date().getTime() - new Date(asset.purchaseDate).getTime()) / (1000 * 60 * 60 * 24))
                      } days ago
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800">
                      {formatCurrency(asset.value)}
                    </div>
                    <div className="text-xs text-green-600">
                      +{((asset.appreciationRate || 0) * 12 * 100).toFixed(1)}% ROI
                    </div>
                    <div className="text-xs text-blue-600">
                      {formatCurrency(asset.monthlyIncome || 0)}/month
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">No Investments Yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Start building your investment portfolio by exploring opportunities in the other categories.
            </p>
            <Button 
              size="sm" 
              onClick={() => setSelectedCategory('Opportunities')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Explore Opportunities
            </Button>
          </div>
        )}

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Investment Insights
          </h4>
          <ul className="space-y-2 text-sm text-amber-700">
            {activeDealCount === 0 ? (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  Start with sector-specific opportunities to unlock higher-tier deals
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  Diversify across different investment types for better risk management
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  Consider both bank and credit card payment methods based on cash flow
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  Your portfolio shows {activeDealCount > 3 ? 'good' : 'growing'} diversification
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  Consider reinvesting monthly returns for compound growth
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  Balance high-yield opportunities with stable long-term investments
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  };

  // Get deal type icon with enhanced matching
  const getDealIcon = (deal: Deal) => {
    const title = deal.title?.toLowerCase() || '';
    const sector = deal.sector?.toLowerCase() || '';
    
    // Specific name/sector based matching first
    if (title.includes('renewable') || title.includes('energy') || title.includes('solar') || title.includes('wind') || sector.includes('renewable')) return <Zap className="w-6 h-6" />;
    if (title.includes('telecom') || title.includes('infrastructure') || title.includes('network')) return <Activity className="w-6 h-6" />;
    if (title.includes('restaurant') || title.includes('food') || sector.includes('fast_food')) return <Utensils className="w-6 h-6" />;
    if (title.includes('tech') || title.includes('software') || title.includes('app') || sector.includes('tech')) return <Brain className="w-6 h-6" />;
    if (title.includes('healthcare') || title.includes('medical') || sector.includes('healthcare')) return <Shield className="w-6 h-6" />;
    if (title.includes('ecommerce') || title.includes('retail') || sector.includes('ecommerce')) return <ShoppingBag className="w-6 h-6" />;
    if (title.includes('real estate') || title.includes('property') || sector.includes('real_estate')) return <Home className="w-6 h-6" />;
    
    // Deal type fallback
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

      {/* Compact Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-xs w-full bg-white shadow-2xl border-0">
            <CardContent className="p-3 bg-white rounded-lg">
              {/* Compact Header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-800">Investment Purchase</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowPurchaseModal(null);
                    setPaymentMethod('bank');
                    setPaymentType(null);
                    setEmiDuration(3);
                    setShowEmiDropdown(false);
                  }}
                  className="h-4 w-4 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              {/* Compact Deal Info */}
              <div className="text-center mb-2">
                <div className="w-10 h-10 mx-auto mb-1 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  {getDealIcon(showPurchaseModal)}
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">
                  {showPurchaseModal.title}
                </h4>
                <p className="text-blue-600 text-xs font-medium">
                  {showPurchaseModal.company}
                </p>
              </div>

              {/* Compact Investment Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <Calculator className="w-3 h-3 text-blue-600" />
                  <h5 className="font-semibold text-blue-800 text-xs">Key Investment Information</h5>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
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
                    <div className={`font-bold capitalize text-xs ${
                      showPurchaseModal.riskLevel === 'low' ? 'text-green-600' :
                      showPurchaseModal.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>{showPurchaseModal.riskLevel}</div>
                  </div>
                  <div>
                    <span className="text-blue-600">Liquidity:</span>
                    <div className="font-bold text-blue-800 capitalize text-xs">{showPurchaseModal.liquidity}</div>
                  </div>
                </div>
              </div>

              {/* Compact Payment Method */}
              <div className="mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <CreditCard className="w-3 h-3 text-slate-600" />
                  <h5 className="font-semibold text-slate-800 text-xs">Payment Method</h5>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => {
                      setPaymentMethod('bank');
                      setPaymentType('full');
                    }}
                    className={`p-1.5 rounded text-xs font-medium transition-all ${
                      paymentMethod === 'bank'
                        ? 'bg-blue-100 border border-blue-300 text-blue-800'
                        : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-1 justify-center">
                      <Building2 className="w-3 h-3" />
                      Banking
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setPaymentMethod('credit');
                      setPaymentType(null); // Reset to unselected when switching to credit card
                    }}
                    className={`p-1.5 rounded text-xs font-medium transition-all ${
                      paymentMethod === 'credit'
                        ? 'bg-blue-100 border border-blue-300 text-blue-800'
                        : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-1 justify-center">
                      <CreditCard className="w-3 h-3" />
                      Credit Card
                    </div>
                  </button>
                </div>
              </div>

              {/* Credit Card Payment Options */}
              {paymentMethod === 'credit' && (
                <div className="mb-2">
                  <h5 className="font-semibold text-slate-800 mb-1 text-xs">Payment Options</h5>
                  
                  {/* Horizontal Payment Options */}
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    {/* Full Payment Button */}
                    <button
                      onClick={() => {
                        setPaymentType('full');
                      }}
                      className={`p-1.5 rounded text-xs font-medium transition-all ${
                        paymentType === 'full'
                          ? 'bg-blue-100 border border-blue-300 text-blue-800'
                          : !getCreditInfo().canPayFull
                            ? 'bg-red-100 border border-red-300 text-red-800 cursor-not-allowed opacity-60'
                            : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                      disabled={!getCreditInfo().canPayFull}
                    >
                      {getCreditInfo().canPayFull ? "Full Payment" : "Limit exceeded"}
                    </button>

                    {/* EMI Button */}
                    <button
                      onClick={() => {
                        setPaymentType('emi');
                        setEmiDuration(3);
                      }}
                      className={`p-1.5 rounded text-xs font-medium transition-all ${
                        paymentType === 'emi'
                          ? 'bg-blue-100 border border-blue-300 text-blue-800'
                          : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      EMI 3M
                    </button>
                  </div>

                  {/* EMI Duration Selector - Only show when EMI is selected */}
                  {paymentType === 'emi' && (
                    <div className="relative">
                      <label className="text-xs text-gray-600 mb-1 block">EMI Duration</label>
                      <button
                        onClick={() => setShowEmiDropdown(!showEmiDropdown)}
                        className="w-full p-1.5 rounded border border-gray-300 text-xs font-medium transition-all bg-white hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{emiDuration < 12 ? `${emiDuration} months` : `${emiDuration/12} year${emiDuration/12 > 1 ? 's' : ''}`}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${showEmiDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Upward Opening Dropdown */}
                      {showEmiDropdown && (
                        <>
                          {/* Overlay to close on outside click */}
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowEmiDropdown(false)}
                          />
                          <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded shadow-lg z-20 overflow-hidden">
                            {[3, 6, 12, 24, 60].filter(months => {
                              // Only show EMI options that user can afford based on credit limit
                              const { availableCredit } = getCreditInfo();
                              return showPurchaseModal.investmentRequired <= availableCredit;
                            }).map((months) => (
                              <button
                                key={months}
                                onClick={() => {
                                  setEmiDuration(months);
                                  setShowEmiDropdown(false);
                                }}
                                className={`w-full p-2 text-xs font-medium transition-all flex justify-between items-center border-b border-gray-100 last:border-b-0 ${
                                  emiDuration === months
                                    ? 'bg-blue-50 text-blue-800'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <span>{months < 12 ? `${months} months` : `${months/12} year${months/12 > 1 ? 's' : ''}`}</span>
                                <span className="text-xs text-gray-500">
                                  ₹{Math.ceil(showPurchaseModal.investmentRequired / months).toLocaleString()}/mo
                                </span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Compact Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white border-red-500 text-xs py-1.5"
                  onClick={() => {
                    setShowPurchaseModal(null);
                    setPaymentMethod('bank');
                    setPaymentType(null);
                    setEmiDuration(3);
                    setShowEmiDropdown(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs py-1.5"
                  onClick={() => {
                    // Handle purchase logic here - check if paymentType is selected
                    if (!paymentType && paymentMethod === 'credit') {
                      alert('Please select a payment option (Full Payment or EMI)');
                      return;
                    }
                    
                    const finalPaymentType = paymentType || 'full';
                    const result = purchaseDeal(
                      showPurchaseModal,
                      paymentMethod,
                      finalPaymentType,
                      finalPaymentType === 'emi' ? emiDuration : undefined
                    );
                    
                    if (result?.success) {
                      console.log('Purchase successful:', {
                        deal: showPurchaseModal.title,
                        amount: showPurchaseModal.investmentRequired,
                        paymentMethod,
                        paymentType,
                        emiDuration: paymentType === 'emi' ? emiDuration : null
                      });
                      setShowPurchaseModal(null);
                      setPaymentMethod('bank');
                      setPaymentType(null);
                      setEmiDuration(3);
                      setShowEmiDropdown(false);
                    } else {
                      console.error('Purchase failed:', result?.message);
                      alert(`Purchase failed: ${result?.message || 'Unknown error'}`);
                    }
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