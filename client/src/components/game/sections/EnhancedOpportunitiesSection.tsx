import React, { useState, useMemo } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import OpportunitiesModals from './OpportunitiesModals';
import { 
  Search,
  Filter,
  SortAsc,
  Calculator,
  TrendingUp,
  Building2,
  Globe,
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
  ArrowRight,
  Play,
  FileText,
  MoreHorizontal,
  Eye,
  BookOpen,
  Info,
  Gauge,
  MousePointer2,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  aiInsight?: string;
  trending?: boolean;
  featured?: boolean;
}

const EnhancedOpportunitiesSection: React.FC = () => {
  const { playerStats, financialData } = useWealthSprintGame();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('roi');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterSector, setFilterSector] = useState('all');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [savedDeals, setSavedDeals] = useState<string[]>([]);
  const [hoveredDeal, setHoveredDeal] = useState<string | null>(null);
  const [rejectedDeals, setRejectedDeals] = useState<string[]>([]);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString()}`;
  };

  // Sector configuration
  const sectorConfig = {
    'fast_food': { 
      icon: <Home className="w-5 h-5" />, 
      color: 'from-orange-400 to-red-500', 
      bgColor: 'bg-orange-50', 
      textColor: 'text-orange-800', 
      borderColor: 'border-orange-200',
      label: 'Fast Food'
    },
    'tech': { 
      icon: <Laptop className="w-5 h-5" />, 
      color: 'from-blue-400 to-indigo-600', 
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-800', 
      borderColor: 'border-blue-200',
      label: 'Technology'
    },
    'healthcare': { 
      icon: <Heart className="w-5 h-5" />, 
      color: 'from-green-400 to-emerald-600', 
      bgColor: 'bg-green-50', 
      textColor: 'text-green-800', 
      borderColor: 'border-green-200',
      label: 'Healthcare'
    },
    'ecommerce': { 
      icon: <ShoppingCart className="w-5 h-5" />, 
      color: 'from-purple-400 to-violet-600', 
      bgColor: 'bg-purple-50', 
      textColor: 'text-purple-800', 
      borderColor: 'border-purple-200',
      label: 'E-commerce'
    },
    'real_estate': { 
      icon: <MapPin className="w-5 h-5" />, 
      color: 'from-slate-400 to-gray-600', 
      bgColor: 'bg-slate-50', 
      textColor: 'text-slate-800', 
      borderColor: 'border-slate-200',
      label: 'Real Estate'
    },
    'renewable_energy': { 
      icon: <Leaf className="w-5 h-5" />, 
      color: 'from-teal-400 to-lime-500', 
      bgColor: 'bg-teal-50', 
      textColor: 'text-teal-800', 
      borderColor: 'border-teal-200',
      label: 'Renewable Energy'
    }
  };

  // Mock deals data with enhanced features
  const allDeals: Deal[] = useMemo(() => {
    const deals: Deal[] = [
      {
        id: 'premium_restaurant_q3_fy25',
        type: 'sector',
        sector: 'fast_food',
        title: 'Premium Restaurant Chain',
        tagline: 'UPSCALE DINING EXPANSION OPPORTUNITY',
        description: 'Revolutionary fine-dining experience combining traditional flavors with modern presentation. Target market: affluent millennials and Gen-Z professionals.',
        company: 'Gourmet Express Holdings',
        investmentRequired: 7500000,
        expectedROI: 28,
        riskLevel: 'medium',
        liquidity: 'medium',
        timeHorizon: 18,
        cashflowMonthly: 425000,
        status: 'available',
        timelineStage: 'initiation',
        timeline: 'Q3 FY25',
        requirements: { 
          minSectors: 1, 
          specificSectors: ['fast_food'],
          minNetWorth: 5000000,
          minReputation: 70
        },
        benefits: [
          'Premium market positioning with 40% higher margins',
          'Exclusive licensing agreements with celebrity chefs',
          'Advanced kitchen automation reducing labor costs by 25%',
          'Strategic locations in tier-1 city commercial districts'
        ],
        risks: [
          'Economic downturn affecting luxury spending',
          'High operational complexity requiring skilled management',
          'Intense competition from established premium brands'
        ],
        keyFactors: { 
          'Market Size': '₹850Cr annually in target cities',
          'Competition': 'Medium - 3 major players',
          'Growth Rate': '15% YoY in premium dining',
          'Seasonality': 'Low impact due to corporate events'
        },
        termsConditions: [
          'Strategic partnership: 60-40 profit sharing favoring investor',
          'Operational control retained by management team',
          'Quarterly dividend distribution starting month 6',
          'Exit clause available after 24 months with 90-day notice',
          'Performance bonuses tied to EBITDA targets'
        ],
        financials: {
          projections: [
            { month: 6, revenue: 4500000, profit: 1125000 },
            { month: 12, revenue: 6750000, profit: 2025000 },
            { month: 18, revenue: 9000000, profit: 2700000 }
          ],
          breakEvenMonths: 8
        },
        aiInsight: 'Strong fundamentals with proven management track record. Market timing is excellent as premium dining demand has recovered 120% post-pandemic. Location analysis shows 3.2x foot traffic multiplier in proposed sites.',
        trending: true,
        featured: true
      },
      {
        id: 'ai_saas_platform_q2_fy25',
        type: 'sector',
        sector: 'tech',
        title: 'AI-Powered SaaS Platform',
        tagline: 'NEXT-GEN BUSINESS AUTOMATION SUITE',
        description: 'Revolutionary AI platform automating complex business processes for SMEs. Features include predictive analytics, automated reporting, and intelligent decision support systems.',
        company: 'NeuralFlow Technologies',
        investmentRequired: 12000000,
        expectedROI: 45,
        riskLevel: 'high',
        liquidity: 'low',
        timeHorizon: 36,
        cashflowMonthly: 180000,
        status: 'available',
        timelineStage: 'initiation',
        timeline: 'Q2 FY25',
        requirements: { 
          minSectors: 0, 
          minNetWorth: 8000000,
          minReputation: 60
        },
        benefits: [
          'First-mover advantage in AI automation for SMEs',
          'Recurring SaaS revenue model with 95% retention rate',
          'Scalable technology platform with global expansion potential',
          'Strategic partnerships with Microsoft Azure and AWS'
        ],
        risks: [
          'Rapid technology evolution requiring continuous R&D investment',
          'Regulatory uncertainties around AI implementation',
          'Intense competition from tech giants entering the space',
          'Customer acquisition costs in nascent market'
        ],
        keyFactors: { 
          'TAM': '₹2,400Cr globally by 2026',
          'ARR Growth': '300% projected in first 24 months',
          'Patent Portfolio': '12 pending AI patents',
          'Team Strength': '15 AI/ML PhDs and 45 engineers'
        },
        termsConditions: [
          'Series A investment: 18% equity stake',
          'Board seat with veto rights on major decisions',
          'Anti-dilution protection through Series B',
          'Liquidation preference: 2x non-participating preferred',
          'Tag-along and drag-along rights included'
        ],
        financials: {
          projections: [
            { month: 6, revenue: 1800000, profit: -900000 },
            { month: 12, revenue: 5400000, profit: 540000 },
            { month: 36, revenue: 18000000, profit: 6300000 }
          ],
          breakEvenMonths: 14
        },
        aiInsight: 'Exceptional team with proven track record at Google and Microsoft. Product-market fit validated with 200+ pilot customers showing 40% productivity gains. Recommend investment despite high risk due to massive upside potential.',
        trending: true,
        featured: false
      },
      {
        id: 'telemedicine_expansion_q4_fy25',
        type: 'sector',
        sector: 'healthcare',
        title: 'Telemedicine Network Expansion',
        tagline: 'DIGITAL HEALTHCARE REVOLUTION',
        description: 'Comprehensive telemedicine platform connecting rural areas with specialist doctors. Includes AI-powered preliminary diagnosis and mobile health units for critical care.',
        company: 'HealthBridge Digital',
        investmentRequired: 9500000,
        expectedROI: 32,
        riskLevel: 'medium',
        liquidity: 'medium',
        timeHorizon: 24,
        cashflowMonthly: 315000,
        status: 'available',
        timelineStage: 'growth',
        timeline: 'Q4 FY25',
        requirements: { 
          minSectors: 1, 
          specificSectors: ['healthcare', 'tech'],
          minNetWorth: 6000000,
          minReputation: 75
        },
        benefits: [
          'Government support through Digital India initiative',
          'Scalable platform serving 500+ rural healthcare centers',
          'Insurance partnerships covering 80% of treatments',
          'Award-winning diagnostic AI with 92% accuracy rate'
        ],
        risks: [
          'Regulatory approval delays for new medical devices',
          'Rural connectivity infrastructure limitations',
          'Doctor availability and training requirements'
        ],
        keyFactors: { 
          'Market Reach': '500M+ underserved rural population',
          'Growth Trajectory': '25% monthly user acquisition',
          'Partnerships': '15 state health departments signed',
          'Technology Edge': 'Proprietary AI diagnostic engine'
        },
        termsConditions: [
          'Joint venture: 55-45 revenue sharing structure',
          'Technology licensing fees: 3% of gross revenue',
          'Expansion funding commitment: ₹5Cr additional in year 2',
          'Performance milestones tied to patient outcomes',
          'Social impact metrics included in success criteria'
        ],
        financials: {
          projections: [
            { month: 6, revenue: 2850000, profit: 570000 },
            { month: 12, revenue: 5700000, profit: 1710000 },
            { month: 24, revenue: 11400000, profit: 3648000 }
          ],
          breakEvenMonths: 7
        },
        aiInsight: 'Strong ESG investment with excellent growth potential. Government backing provides regulatory safety net. Rural healthcare market is severely underserved, presenting significant opportunity with positive social impact.',
        trending: false,
        featured: true
      },
      {
        id: 'luxury_ecommerce_q1_fy26',
        type: 'sector',
        sector: 'ecommerce',
        title: 'Luxury E-commerce Platform',
        tagline: 'PREMIUM MARKETPLACE FOR AFFLUENT CONSUMERS',
        description: 'Curated luxury marketplace featuring authenticated designer goods, exclusive collections, and personalized shopping experiences powered by AI styling recommendations.',
        company: 'LuxeVault Commerce',
        investmentRequired: 15000000,
        expectedROI: 38,
        riskLevel: 'high',
        liquidity: 'medium',
        timeHorizon: 30,
        cashflowMonthly: 225000,
        status: 'available',
        timelineStage: 'initiation',
        timeline: 'Q1 FY26',
        requirements: { 
          minSectors: 2, 
          specificSectors: ['ecommerce', 'tech'],
          minNetWorth: 12000000,
          minReputation: 80
        },
        benefits: [
          'Premium market with average order values of ₹25,000+',
          'Exclusive brand partnerships with global luxury houses',
          'Advanced authentication technology preventing counterfeits',
          'Personalized concierge service driving customer loyalty'
        ],
        risks: [
          'Economic sensitivity affecting luxury spending patterns',
          'High customer acquisition costs in premium segment',
          'Supply chain complexities with international brands',
          'Seasonal demand fluctuations during economic uncertainty'
        ],
        keyFactors: { 
          'Customer LTV': '₹2.5L average over 36 months',
          'Market Size': '₹1,200Cr Indian luxury e-commerce market',
          'Brand Partners': '150+ luxury brands signed exclusively',
          'Tech Advantage': 'Proprietary authentication and AI styling'
        },
        termsConditions: [
          'Preferred equity investment: 22% stake with liquidation preference',
          'Board representation with strategic oversight rights',
          'Milestone-based funding releases tied to GMV targets',
          'Exclusive territory rights for Indian subcontinent',
          'Co-investment opportunities in international expansion'
        ],
        financials: {
          projections: [
            { month: 6, revenue: 3600000, profit: -1800000 },
            { month: 12, revenue: 9000000, profit: 900000 },
            { month: 30, revenue: 27000000, profit: 10260000 }
          ],
          breakEvenMonths: 11
        },
        aiInsight: 'Luxury e-commerce is experiencing rapid digital transformation. Platform\'s authentication technology addresses key market pain point. Management team has successful exits from previous luxury ventures. High growth potential with premium margins.',
        trending: true,
        featured: false
      }
    ];

    return deals;
  }, []);

  // Filter and sort deals
  const filteredAndSortedDeals = useMemo(() => {
    let filtered = allDeals.filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRisk = filterRisk === 'all' || deal.riskLevel === filterRisk;
      const matchesSector = filterSector === 'all' || deal.sector === filterSector;
      const notRejected = !rejectedDeals.includes(deal.id);
      
      return matchesSearch && matchesRisk && matchesSector && notRejected;
    });

    // Sort deals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'roi':
          return b.expectedROI - a.expectedROI;
        case 'investment':
          return a.investmentRequired - b.investmentRequired;
        case 'risk':
          const riskOrder = { 'low': 1, 'medium': 2, 'high': 3 };
          return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        case 'timeline':
          return a.timeHorizon - b.timeHorizon;
        case 'cashflow':
          return b.cashflowMonthly - a.cashflowMonthly;
        default:
          return 0;
      }
    });

    return filtered;
  }, [allDeals, searchTerm, sortBy, filterRisk, filterSector, rejectedDeals]);

  // Get risk color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Save/unsave deal
  const toggleSaveDeal = (dealId: string) => {
    setSavedDeals(prev => 
      prev.includes(dealId) 
        ? prev.filter(id => id !== dealId)
        : [...prev, dealId]
    );
  };

  // Reject deal with animation
  const handleRejectDeal = (dealId: string) => {
    setRejectedDeals(prev => [...prev, dealId]);
    // Remove from view after animation completes
    setTimeout(() => {
      setRejectedDeals(prev => prev.filter(id => id !== dealId));
    }, 3000); // Keep for 3 seconds to show the animation
  };

  // Export deals to CSV
  const exportDeals = () => {
    const csv = [
      ['Title', 'Company', 'Investment Required', 'Expected ROI', 'Risk Level', 'Timeline', 'Monthly Cashflow'].join(','),
      ...filteredAndSortedDeals.map(deal => [
        deal.title,
        deal.company,
        deal.investmentRequired,
        `${deal.expectedROI}%`,
        deal.riskLevel,
        `${deal.timeHorizon} months`,
        deal.cashflowMonthly
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'investment_opportunities.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Share deal
  const shareDeal = (deal: Deal) => {
    if (navigator.share) {
      navigator.share({
        title: `Investment Opportunity: ${deal.title}`,
        text: `Check out this investment opportunity: ${deal.title} by ${deal.company}. Expected ROI: ${deal.expectedROI}%`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      const text = `Investment Opportunity: ${deal.title} by ${deal.company}. Expected ROI: ${deal.expectedROI}%. Investment Required: ${formatCurrency(deal.investmentRequired)}`;
      navigator.clipboard.writeText(text);
      alert('Deal details copied to clipboard!');
    }
  };

  // Enhanced Deal Card with micro-interactions and compact design
  const EnhancedDealCard = ({ deal }: { deal: Deal }) => {
    const sectorInfo = deal.sector ? sectorConfig[deal.sector] : null;
    const isSaved = savedDeals.includes(deal.id);
    const isHovered = hoveredDeal === deal.id;
    const isRejected = rejectedDeals.includes(deal.id);
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isRejected ? 0 : 1, 
          x: isRejected ? -300 : 0,
          y: 0,
          scale: isRejected ? 0.8 : 1
        }}
        exit={{ opacity: 0, x: -300, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        whileHover={isRejected ? {} : { 
          y: -4, 
          scale: 1.02,
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)"
        }}
        onHoverStart={() => !isRejected && setHoveredDeal(deal.id)}
        onHoverEnd={() => setHoveredDeal(null)}
        className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      >
        {/* Header with Icon and Badge */}
        <div className="flex items-start justify-between p-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <motion.div 
              className={`w-10 h-10 rounded-xl ${sectorInfo ? sectorInfo.bgColor : 'bg-gray-100'} flex items-center justify-center`}
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              {sectorInfo ? sectorInfo.icon : <Building2 className="w-5 h-5 text-gray-600" />}
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {deal.featured && (
                  <Badge className="text-xs bg-purple-500 text-white px-2 py-0.5">
                    EPIC
                  </Badge>
                )}
                {deal.trending && (
                  <Badge className="text-xs bg-orange-500 text-white px-2 py-0.5">
                    RARE
                  </Badge>
                )}
              </div>
              <h3 className="font-bold text-lg leading-tight text-gray-900">
                {deal.title}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {deal.sector?.replace('_', ' ') || 'General'}
              </p>
            </div>
          </div>
          
          {/* Save button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveDeal(deal.id);
            }}
            className={`p-2 rounded-lg transition-all ${
              isSaved 
                ? 'bg-yellow-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Investment Amount */}
        <div className="px-4 py-3 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(deal.investmentRequired)}
          </div>
          <div className="text-lg font-bold text-emerald-600 flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {deal.expectedROI}% ROI
          </div>
        </div>

        {/* Key Metrics - Compact Row */}
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex justify-between text-xs text-gray-600">
            <div>Income: {formatCurrency(deal.cashflowMonthly)}</div>
            <div>Cost: {formatCurrency(deal.investmentRequired / 10)}</div>
          </div>
        </div>

        {/* Abilities and Risks */}
        <div className="px-4 py-3 space-y-2">
          {/* Abilities */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-semibold text-gray-700">Abilities</span>
            </div>
            <div className="space-y-1">
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                AI-powered automation
              </div>
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Predictive analytics
              </div>
            </div>
          </div>

          {/* Risks */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-semibold text-gray-700">Risks</span>
            </div>
            <div className="space-y-1">
              <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                High competition
              </div>
              <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                Technology disruption
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 p-4 border-t border-gray-50">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm"
              onClick={() => {
                setSelectedDeal(deal);
                setShowModal(true);
              }}
            >
              Invest Now
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              className="px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 text-sm"
              onClick={() => {
                setSelectedDeal(deal);
                setShowDeepDive(true);
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              className="px-3 py-2 rounded-lg border border-red-300 hover:border-red-400 text-red-600 hover:bg-red-50 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRejectDeal(deal.id);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Target className="w-10 h-10 text-blue-600" />
                Investment Opportunities
              </h1>
              <p className="text-gray-600 text-lg">
                Discover premium investment opportunities curated by AI and expert analysis
              </p>
            </div>
            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => setShowTutorial(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 hover:border-blue-500"
                >
                  <BookOpen className="w-4 h-4" />
                  Tutorial
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={exportDeals}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{filteredAndSortedDeals.length}</div>
                  <div className="text-sm text-gray-600">Available Deals</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">32.5%</div>
                  <div className="text-sm text-gray-600">Avg ROI</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(287500)}</div>
                  <div className="text-sm text-gray-600">Avg Cashflow</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{savedDeals.length}</div>
                  <div className="text-sm text-gray-600">Saved Deals</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-8"
        >
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search deals, companies, or sectors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-xl border-2 focus:border-blue-500 text-base"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-gray-600" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] rounded-xl border-2">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roi">Expected ROI</SelectItem>
                  <SelectItem value="investment">Investment Amount</SelectItem>
                  <SelectItem value="risk">Risk Level</SelectItem>
                  <SelectItem value="timeline">Timeline</SelectItem>
                  <SelectItem value="cashflow">Monthly Cashflow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Risk Filter */}
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-600" />
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-[140px] rounded-xl border-2">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sector Filter */}
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-600" />
              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger className="w-[160px] rounded-xl border-2">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {Object.entries(sectorConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || sortBy !== 'roi' || filterRisk !== 'all' || filterSector !== 'all') && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm('');
                    setSortBy('roi');
                    setFilterRisk('all');
                    setFilterSector('all');
                  }}
                  className="px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Deals Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          layout
        >
          <AnimatePresence>
            {filteredAndSortedDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <EnhancedDealCard deal={deal} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredAndSortedDeals.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setFilterRisk('all');
                setFilterSector('all');
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Clear all filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <OpportunitiesModals
        selectedDeal={selectedDeal}
        showModal={showModal}
        showDeepDive={showDeepDive}
        showTutorial={showTutorial}
        setShowModal={setShowModal}
        setShowDeepDive={setShowDeepDive}
        setShowTutorial={setShowTutorial}
        onInvest={(deal) => {
          // Investment logic here
          console.log('Investing in:', deal.title);
          alert(`Investment successful! You have invested ${formatCurrency(deal.investmentRequired)} in ${deal.title}`);
          setShowModal(false);
          setShowDeepDive(false);
        }}
      />
    </div>
  );
};

export default EnhancedOpportunitiesSection;