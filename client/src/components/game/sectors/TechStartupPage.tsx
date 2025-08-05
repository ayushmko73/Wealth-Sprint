import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Star,
  Users,
  Code,
  Rocket,
  Lightbulb,
  Target,
  Zap,
  Globe,
  Smartphone,
  Database,
  Shield,
  Brain,
  Cpu
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';

interface TechProduct {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  developmentCost: number;
  launched: boolean;
  monthlyRevenue: number;
  monthlyExpenses: number;
  userBase: number;
  growthRate: number;
  marketFit: number;
  technology: string;
  stage: 'idea' | 'mvp' | 'beta' | 'launched' | 'scaling';
  burnRate: number;
  runway: number;
  valuation: number;
}

interface InvestmentRound {
  id: string;
  roundType: 'Seed' | 'Series A' | 'Series B' | 'Series C';
  amount: number;
  valuation: number;
  investors: string[];
  requirements: string[];
  unlocked: boolean;
  completed: boolean;
}

interface TechStartupPageProps {
  onBack: () => void;
}

const TechStartupPage: React.FC<TechStartupPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { financialData, updateFinancialData } = useWealthSprintGame();

  // Add icons back to products after loading
  const addIconsToProducts = (productsData: TechProduct[]): TechProduct[] => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'ai_platform': <Brain className="h-5 w-5" />,
      'mobile_app': <Smartphone className="h-5 w-5" />,
      'saas_tool': <Database className="h-5 w-5" />,
      'blockchain_solution': <Shield className="h-5 w-5" />,
      'iot_system': <Cpu className="h-5 w-5" />
    };
    
    return productsData.map(product => ({
      ...product,
      icon: iconMap[product.id] || <Code className="h-5 w-5" />
    }));
  };

  // Load saved products data on component mount
  const loadSavedProducts = (): TechProduct[] => {
    try {
      const saved = localStorage.getItem('techStartupProducts');
      if (saved) {
        const parsedProducts = JSON.parse(saved);
        return addIconsToProducts(parsedProducts);
      }
    } catch (error) {
      console.warn('Failed to load saved tech startup products:', error);
    }
    // Return default products if no saved data
    return addIconsToProducts([
      {
        id: 'ai_platform',
        name: 'AI Analytics Platform',
        icon: <Brain className="h-5 w-5" />,
        description: 'Machine learning platform for business intelligence',
        developmentCost: 200000,
        launched: true, // Starting product
        monthlyRevenue: 150000,
        monthlyExpenses: 90000,
        userBase: 1200,
        growthRate: 25,
        marketFit: 75,
        technology: 'AI/ML',
        stage: 'launched',
        burnRate: 45000,
        runway: 18,
        valuation: 5000000
      },
      {
        id: 'mobile_app',
        name: 'Productivity Mobile App',
        icon: <Smartphone className="h-5 w-5" />,
        description: 'Cross-platform productivity and collaboration app',
        developmentCost: 120000,
        launched: false,
        monthlyRevenue: 80000,
        monthlyExpenses: 50000,
        userBase: 0,
        growthRate: 40,
        marketFit: 60,
        technology: 'React Native',
        stage: 'mvp',
        burnRate: 25000,
        runway: 24,
        valuation: 2000000
      },
      {
        id: 'saas_tool',
        name: 'Enterprise SaaS Tool',
        icon: <Database className="h-5 w-5" />,
        description: 'Cloud-based enterprise resource management',
        developmentCost: 300000,
        launched: false,
        monthlyRevenue: 250000,
        monthlyExpenses: 120000,
        userBase: 0,
        growthRate: 20,
        marketFit: 85,
        technology: 'Cloud Computing',
        stage: 'idea',
        burnRate: 60000,
        runway: 36,
        valuation: 8000000
      },
      {
        id: 'blockchain_solution',
        name: 'Blockchain Security',
        icon: <Shield className="h-5 w-5" />,
        description: 'Decentralized security and identity management',
        developmentCost: 400000,
        launched: false,
        monthlyRevenue: 180000,
        monthlyExpenses: 85000,
        userBase: 0,
        growthRate: 35,
        marketFit: 70,
        technology: 'Blockchain',
        stage: 'idea',
        burnRate: 40000,
        runway: 30,
        valuation: 6000000
      },
      {
        id: 'iot_system',
        name: 'IoT Management System',
        icon: <Cpu className="h-5 w-5" />,
        description: 'Industrial IoT monitoring and automation',
        developmentCost: 350000,
        launched: false,
        monthlyRevenue: 300000,
        monthlyExpenses: 140000,
        userBase: 0,
        growthRate: 30,
        marketFit: 80,
        technology: 'IoT',
        stage: 'idea',
        burnRate: 70000,
        runway: 42,
        valuation: 10000000
      }
    ]);
  };
  
  const [products, setProducts] = useState<TechProduct[]>(loadSavedProducts);

  // Save products data whenever products state changes
  useEffect(() => {
    const serializableProducts = products.map(product => ({
      ...product,
      icon: null // Remove non-serializable icon
    }));
    localStorage.setItem('techStartupProducts', JSON.stringify(serializableProducts));
  }, [products]);

  // User growth simulation for launched products
  useEffect(() => {
    const userGrowthInterval = setInterval(() => {
      setProducts(currentProducts => {
        return currentProducts.map(product => {
          if (product.launched && product.stage === 'launched') {
            // Simulate user growth based on market fit and growth rate
            const baseGrowth = Math.floor(product.userBase * (product.growthRate / 100 / 12)); // Monthly growth
            const marketFitMultiplier = product.marketFit / 100;
            const actualGrowth = Math.floor(baseGrowth * marketFitMultiplier);
            
            return {
              ...product,
              userBase: product.userBase + actualGrowth,
              monthlyRevenue: Math.floor(product.monthlyRevenue * (1 + (actualGrowth / product.userBase) * 0.1))
            };
          }
          return product;
        });
      });
    }, 25000); // Every 25 seconds

    return () => clearInterval(userGrowthInterval);
  }, []);

  // Monthly profit auto-transfer to bank account
  useEffect(() => {
    const monthlyTransferInterval = setInterval(() => {
      const launchedProducts = products.filter(product => product.launched);
      if (launchedProducts.length > 0) {
        // Calculate total monthly profit (accounting for market fit)
        let totalProfit = 0;
        launchedProducts.forEach(product => {
          let adjustedRevenue = product.monthlyRevenue;
          // Market fit affects revenue
          if (product.marketFit < 50) {
            adjustedRevenue *= 0.6; // 40% reduction for poor market fit
          } else if (product.marketFit > 80) {
            adjustedRevenue *= 1.4; // 40% increase for excellent market fit
          }
          totalProfit += (adjustedRevenue - product.monthlyExpenses);
        });

        // Transfer profit to bank account
        if (totalProfit > 0) {
          updateFinancialData({
            bankBalance: financialData.bankBalance + totalProfit
          });
          
          console.log(`Monthly Tech Startup profit transferred: ₹${totalProfit.toLocaleString()}`);
        }
      }
    }, 28000); // 28 seconds for testing

    return () => clearInterval(monthlyTransferInterval);
  }, [products, financialData.bankBalance, updateFinancialData]);

  const [investmentRounds] = useState<InvestmentRound[]>([
    {
      id: 'seed_round',
      roundType: 'Seed',
      amount: 2000000,
      valuation: 8000000,
      investors: ['Angel Investors', 'Early Stage VC'],
      requirements: ['MVP Ready', 'Initial Traction', 'Strong Team'],
      unlocked: true,
      completed: false
    },
    {
      id: 'series_a',
      roundType: 'Series A',
      amount: 8000000,
      valuation: 30000000,
      investors: ['Tier 1 VCs', 'Strategic Partners'],
      requirements: ['Product-Market Fit', 'Scaling Revenue', 'Clear Business Model'],
      unlocked: false,
      completed: false
    },
    {
      id: 'series_b',
      roundType: 'Series B',
      amount: 20000000,
      valuation: 100000000,
      investors: ['Growth VCs', 'Corporate VCs'],
      requirements: ['Market Leadership', 'International Expansion', 'Profitability Path'],
      unlocked: false,
      completed: false
    },
    {
      id: 'series_c',
      roundType: 'Series C',
      amount: 50000000,
      valuation: 500000000,
      investors: ['Late Stage VCs', 'Private Equity'],
      requirements: ['Dominant Market Position', 'IPO Readiness', 'Global Scale'],
      unlocked: false,
      completed: false
    }
  ]);

  // Calculate market-fit-adjusted revenue
  const calculateMarketAdjustedRevenue = (product: TechProduct) => {
    if (!product.launched) return 0;
    let adjustedRevenue = product.monthlyRevenue;
    if (product.marketFit < 50) {
      adjustedRevenue *= 0.6; // 40% reduction for poor market fit
    } else if (product.marketFit > 80) {
      adjustedRevenue *= 1.4; // 40% increase for excellent market fit
    }
    return adjustedRevenue;
  };

  const currentMetrics = {
    totalRevenue: products.reduce((sum, p) => sum + calculateMarketAdjustedRevenue(p), 0),
    totalExpenses: products.filter(p => p.launched).reduce((sum, p) => sum + p.monthlyExpenses, 0),
    netProfit: products.reduce((sum, p) => sum + (calculateMarketAdjustedRevenue(p) - (p.launched ? p.monthlyExpenses : 0)), 0),
    launchedProducts: products.filter(p => p.launched).length,
    totalUsers: products.filter(p => p.launched).reduce((sum, p) => sum + p.userBase, 0),
    avgMarketFit: products.filter(p => p.launched).reduce((sum, p) => sum + p.marketFit, 0) / Math.max(products.filter(p => p.launched).length, 1),
    totalValuation: products.reduce((sum, p) => sum + (p.launched ? p.valuation : 0), 0)
  };

  const launchProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.launched) return;
    
    // Check if player has sufficient funds
    if (financialData.bankBalance < product.developmentCost) {
      alert("⚠️ Insufficient funds to develop and launch this product.");
      return;
    }
    
    // Deduct money and launch product
    updateFinancialData({
      bankBalance: financialData.bankBalance - product.developmentCost
    });
    
    // Update products with launch
    setProducts(prev => 
      prev.map(p => 
        p.id === productId ? { 
          ...p, 
          launched: true,
          stage: 'launched',
          userBase: Math.floor(Math.random() * 500) + 100, // Initial users
          marketFit: Math.max(p.marketFit - 20, 30) // Market fit decreases initially
        } : p
      )
    );
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'idea': return 'bg-gray-100 text-gray-800';
      case 'mvp': return 'bg-blue-100 text-blue-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      case 'launched': return 'bg-green-100 text-green-800';
      case 'scaling': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-3 md:p-6">
      <div className="mb-4 md:mb-6">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-blue-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Business</span>
          </Button>
          
          {/* Bank Balance Display */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 md:p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              <div>
                <p className="text-xs md:text-sm text-green-700">Bank Balance</p>
                <p className="text-sm md:text-lg font-bold text-green-800">₹{financialData.bankBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-3 rounded-full bg-blue-500 text-white text-lg md:text-xl">
            🚀
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Tech Startup Hub</h1>
            <p className="text-sm md:text-base text-gray-600">Build innovative technology solutions</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-2 gap-3 mb-4 md:mb-6 md:gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              <div>
                <p className="text-xs md:text-sm text-green-700">Monthly Revenue</p>
                <p className="text-sm md:text-lg font-bold text-green-800">₹{currentMetrics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              <div>
                <p className="text-xs md:text-sm text-blue-700">Net Profit</p>
                <p className="text-sm md:text-lg font-bold text-blue-800">₹{currentMetrics.netProfit.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              <div>
                <p className="text-xs md:text-sm text-purple-700">Total Users</p>
                <p className="text-sm md:text-lg font-bold text-purple-800">{currentMetrics.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
              <div>
                <p className="text-xs md:text-sm text-orange-700">Valuation</p>
                <p className="text-sm md:text-lg font-bold text-orange-800">₹{(currentMetrics.totalValuation / 10000000).toFixed(1)}Cr</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="overview" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="products" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Products</TabsTrigger>
          <TabsTrigger value="funding" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Funding</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-blue-500" />
                  Startup Portfolio Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{currentMetrics.launchedProducts}</p>
                    <p className="text-sm text-gray-600">Live Products</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{currentMetrics.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{Math.round(currentMetrics.avgMarketFit)}%</p>
                    <p className="text-sm text-gray-600">Market Fit</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">₹{(currentMetrics.totalValuation / 10000000).toFixed(1)}Cr</p>
                    <p className="text-sm text-gray-600">Valuation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="space-y-4">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className={`transition-all duration-200 ${
                  product.launched 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${product.launched ? 'bg-green-500' : 'bg-gray-400'} text-white`}>
                        {product.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col gap-2">
                      <Badge variant="secondary" className={getStageColor(product.stage)}>
                        {product.stage.toUpperCase()}
                      </Badge>
                      {!product.launched && (
                        <Button
                          size="sm"
                          onClick={() => launchProduct(product.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Launch ₹{product.developmentCost.toLocaleString()}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Technology:</span>
                      <span className="font-medium text-blue-600">{product.technology}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Revenue:</span>
                      <span className="font-medium text-green-600">₹{product.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Expenses:</span>
                      <span className="font-medium text-red-600">₹{product.monthlyExpenses.toLocaleString()}</span>
                    </div>
                    {product.launched && (
                      <>
                        <div className="flex justify-between">
                          <span>User Base:</span>
                          <span className="font-medium text-blue-600">{product.userBase.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Market Fit:</span>
                          <span className={`font-medium ${product.marketFit >= 80 ? 'text-green-600' : product.marketFit >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {product.marketFit}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Growth Rate:</span>
                          <span className="font-medium text-purple-600">{product.growthRate}%/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Valuation:</span>
                          <span className="font-medium text-orange-600">₹{(product.valuation / 10000000).toFixed(1)}Cr</span>
                        </div>
                      </>
                    )}
                    <hr />
                    <div className="flex justify-between font-bold">
                      <span>Net Profit:</span>
                      <span className="text-green-600">
                        ₹{product.launched 
                          ? (calculateMarketAdjustedRevenue(product) - product.monthlyExpenses).toLocaleString()
                          : (product.monthlyRevenue - product.monthlyExpenses).toLocaleString()
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="funding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Investment Rounds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investmentRounds.map((round) => (
                  <Card key={round.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{round.roundType} Round</h4>
                          <p className="text-sm text-gray-600">Funding Amount: ₹{(round.amount / 10000000).toFixed(1)}Cr</p>
                          <p className="text-sm text-gray-600">Pre-money Valuation: ₹{(round.valuation / 10000000).toFixed(1)}Cr</p>
                        </div>
                        <Badge 
                          variant={round.completed ? "default" : round.unlocked ? "secondary" : "outline"}
                          className={round.completed ? "bg-green-100 text-green-800" : round.unlocked ? "bg-blue-100 text-blue-800" : ""}
                        >
                          {round.completed ? 'Completed' : round.unlocked ? 'Available' : 'Locked'}
                        </Badge>
                      </div>
                      
                      <div className="mt-3">
                        <h5 className="font-medium text-sm mb-2">Target Investors:</h5>
                        <div className="flex flex-wrap gap-1">
                          {round.investors.map((investor, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {investor}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3">
                        <h5 className="font-medium text-sm mb-2">Requirements:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {round.requirements.map((req, index) => (
                            <li key={index}>• {req}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {round.unlocked && !round.completed && (
                        <Button 
                          className="mt-3 w-full" 
                          size="sm"
                          disabled={!round.unlocked}
                        >
                          Start {round.roundType} Round
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">User Growth</h4>
                      <div className="flex items-center gap-2">
                        <Progress value={Math.min(100, (currentMetrics.totalUsers / 10000) * 100)} className="flex-1 h-2" />
                        <span className="text-sm font-medium">+{Math.round(currentMetrics.totalUsers * 0.25)} this month</span>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Revenue Growth</h4>
                      <div className="flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">+22% this month</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Product Performance</h4>
                    <div className="space-y-2">
                      {products.filter(p => p.launched).map(product => (
                        <div key={product.id} className="flex justify-between items-center">
                          <span className="text-sm">{product.name}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={product.marketFit} className="w-20 h-2" />
                            <span className="text-xs font-medium w-8">{product.marketFit}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechStartupPage;