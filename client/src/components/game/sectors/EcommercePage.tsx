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
  Package,
  ShoppingCart,
  Truck,
  Warehouse,
  Target,
  BarChart3,
  Zap,
  Globe,
  Smartphone,
  CreditCard,
  MessageCircle
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';

interface EcommerceChannel {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  setupCost: number;
  active: boolean;
  monthlyRevenue: number;
  monthlyExpenses: number;
  customerBase: number;
  conversionRate: number;
  avgOrderValue: number;
  category: string;
  marketShare: number;
  competitionLevel: number;
  growthRate: number;
}

interface MarketingCampaign {
  id: string;
  title: string;
  description: string;
  cost: number;
  duration: string;
  active: boolean;
  targetAudience: string;
  expectedROI: number;
  reachMultiplier: number;
  channel: 'social' | 'search' | 'influencer' | 'email';
}

interface EcommercePageProps {
  onBack: () => void;
}

const EcommercePage: React.FC<EcommercePageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { financialData, updateFinancialData } = useWealthSprintGame();

  // Add icons back to channels after loading
  const addIconsToChannels = (channelsData: EcommerceChannel[]): EcommerceChannel[] => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'marketplace': <ShoppingCart className="h-5 w-5" />,
      'brand_store': <Warehouse className="h-5 w-5" />,
      'mobile_app': <Smartphone className="h-5 w-5" />,
      'social_commerce': <MessageCircle className="h-5 w-5" />,
      'b2b_platform': <Globe className="h-5 w-5" />
    };
    
    return channelsData.map(channel => ({
      ...channel,
      icon: iconMap[channel.id] || <ShoppingCart className="h-5 w-5" />
    }));
  };

  // Load saved channels data on component mount
  const loadSavedChannels = (): EcommerceChannel[] => {
    try {
      const saved = localStorage.getItem('ecommerceChannels');
      if (saved) {
        const parsedChannels = JSON.parse(saved);
        return addIconsToChannels(parsedChannels);
      }
    } catch (error) {
      console.warn('Failed to load saved ecommerce channels:', error);
    }
    // Return default channels if no saved data
    return addIconsToChannels([
      {
        id: 'marketplace',
        name: 'Marketplace Store',
        icon: <ShoppingCart className="h-5 w-5" />,
        description: 'Amazon, Flipkart, and other marketplace presence',
        setupCost: 50000,
        active: true, // Starting channel
        monthlyRevenue: 120000,
        monthlyExpenses: 45000,
        customerBase: 5000,
        conversionRate: 3.2,
        avgOrderValue: 1200,
        category: 'Multi-category',
        marketShare: 25,
        competitionLevel: 85,
        growthRate: 15
      },
      {
        id: 'brand_store',
        name: 'Brand Website',
        icon: <Warehouse className="h-5 w-5" />,
        description: 'Direct-to-consumer branded e-commerce site',
        setupCost: 120000,
        active: false,
        monthlyRevenue: 200000,
        monthlyExpenses: 80000,
        customerBase: 3000,
        conversionRate: 5.8,
        avgOrderValue: 2000,
        category: 'Premium Products',
        marketShare: 40,
        competitionLevel: 60,
        growthRate: 25
      },
      {
        id: 'mobile_app',
        name: 'Mobile App',
        icon: <Smartphone className="h-5 w-5" />,
        description: 'Native mobile shopping application',
        setupCost: 180000,
        active: false,
        monthlyRevenue: 250000,
        monthlyExpenses: 95000,
        customerBase: 8000,
        conversionRate: 4.5,
        avgOrderValue: 1500,
        category: 'Mobile Commerce',
        marketShare: 35,
        competitionLevel: 70,
        growthRate: 40
      },
      {
        id: 'social_commerce',
        name: 'Social Commerce',
        icon: <MessageCircle className="h-5 w-5" />,
        description: 'Instagram, Facebook, and WhatsApp selling',
        setupCost: 80000,
        active: false,
        monthlyRevenue: 150000,
        monthlyExpenses: 55000,
        customerBase: 12000,
        conversionRate: 2.8,
        avgOrderValue: 800,
        category: 'Lifestyle Products',
        marketShare: 30,
        competitionLevel: 75,
        growthRate: 50
      },
      {
        id: 'b2b_platform',
        name: 'B2B Platform',
        icon: <Globe className="h-5 w-5" />,
        description: 'Wholesale and bulk business sales',
        setupCost: 220000,
        active: false,
        monthlyRevenue: 400000,
        monthlyExpenses: 150000,
        customerBase: 500,
        conversionRate: 8.5,
        avgOrderValue: 15000,
        category: 'Wholesale',
        marketShare: 20,
        competitionLevel: 45,
        growthRate: 20
      }
    ]);
  };
  
  const [channels, setChannels] = useState<EcommerceChannel[]>(loadSavedChannels);

  // Save channels data whenever channels state changes
  useEffect(() => {
    const serializableChannels = channels.map(channel => ({
      ...channel,
      icon: null // Remove non-serializable icon
    }));
    localStorage.setItem('ecommerceChannels', JSON.stringify(serializableChannels));
  }, [channels]);

  // Market performance fluctuation - simulate market changes
  useEffect(() => {
    const marketFluctuationInterval = setInterval(() => {
      setChannels(currentChannels => {
        return currentChannels.map(channel => {
          if (channel.active) {
            // Random market fluctuations
            const marketChange = (Math.random() - 0.5) * 0.1; // ±5% change
            const newConversionRate = Math.max(1, Math.min(10, channel.conversionRate * (1 + marketChange)));
            const customerGrowth = Math.floor(channel.customerBase * (channel.growthRate / 100 / 12)); // Monthly growth
            
            return {
              ...channel,
              conversionRate: Number(newConversionRate.toFixed(1)),
              customerBase: channel.customerBase + customerGrowth
            };
          }
          return channel;
        });
      });
    }, 20000); // Every 20 seconds

    return () => clearInterval(marketFluctuationInterval);
  }, []);

  // Monthly profit auto-transfer to bank account
  useEffect(() => {
    const monthlyTransferInterval = setInterval(() => {
      const activeChannels = channels.filter(channel => channel.active);
      if (activeChannels.length > 0) {
        // Calculate total monthly profit
        let totalProfit = 0;
        activeChannels.forEach(channel => {
          let adjustedRevenue = channel.monthlyRevenue;
          // Market competition affects revenue
          if (channel.competitionLevel > 80) {
            adjustedRevenue *= 0.85; // 15% reduction for high competition
          } else if (channel.competitionLevel < 50) {
            adjustedRevenue *= 1.2; // 20% increase for low competition
          }
          totalProfit += (adjustedRevenue - channel.monthlyExpenses);
        });

        // Transfer profit to bank account
        if (totalProfit > 0) {
          updateFinancialData({
            bankBalance: financialData.bankBalance + totalProfit
          });
          
          console.log(`Monthly E-commerce profit transferred: ₹${totalProfit.toLocaleString()}`);
        }
      }
    }, 32000); // 32 seconds for testing

    return () => clearInterval(monthlyTransferInterval);
  }, [channels, financialData.bankBalance, updateFinancialData]);

  const [marketingCampaigns] = useState<MarketingCampaign[]>([
    {
      id: 'social_media_blitz',
      title: 'Social Media Advertising',
      description: 'Instagram and Facebook targeted ads campaign',
      cost: 25000,
      duration: '2 weeks',
      active: false,
      targetAudience: 'Young Adults 18-35',
      expectedROI: 250,
      reachMultiplier: 1.3,
      channel: 'social'
    },
    {
      id: 'google_ads',
      title: 'Google Ads Campaign',
      description: 'Search engine marketing and shopping ads',
      cost: 40000,
      duration: '1 month',
      active: false,
      targetAudience: 'High-intent buyers',
      expectedROI: 320,
      reachMultiplier: 1.5,
      channel: 'search'
    },
    {
      id: 'influencer_partnership',
      title: 'Influencer Collaborations',
      description: 'Partner with micro and macro influencers',
      cost: 60000,
      duration: '3 weeks',
      active: false,
      targetAudience: 'Lifestyle enthusiasts',
      expectedROI: 280,
      reachMultiplier: 1.8,
      channel: 'influencer'
    },
    {
      id: 'email_marketing',
      title: 'Email Marketing Automation',
      description: 'Personalized email campaigns and newsletters',
      cost: 15000,
      duration: 'Ongoing',
      active: false,
      targetAudience: 'Existing customers',
      expectedROI: 400,
      reachMultiplier: 1.1,
      channel: 'email'
    }
  ]);

  // Calculate competition-adjusted revenue
  const calculateCompetitionAdjustedRevenue = (channel: EcommerceChannel) => {
    if (!channel.active) return 0;
    let adjustedRevenue = channel.monthlyRevenue;
    if (channel.competitionLevel > 80) {
      adjustedRevenue *= 0.85; // 15% reduction for high competition
    } else if (channel.competitionLevel < 50) {
      adjustedRevenue *= 1.2; // 20% increase for low competition
    }
    return adjustedRevenue;
  };

  const currentMetrics = {
    totalRevenue: channels.reduce((sum, c) => sum + calculateCompetitionAdjustedRevenue(c), 0),
    totalExpenses: channels.filter(c => c.active).reduce((sum, c) => sum + c.monthlyExpenses, 0),
    netProfit: channels.reduce((sum, c) => sum + (calculateCompetitionAdjustedRevenue(c) - (c.active ? c.monthlyExpenses : 0)), 0),
    activeChannels: channels.filter(c => c.active).length,
    totalCustomers: channels.filter(c => c.active).reduce((sum, c) => sum + c.customerBase, 0),
    avgConversionRate: channels.filter(c => c.active).reduce((sum, c) => sum + c.conversionRate, 0) / Math.max(channels.filter(c => c.active).length, 1),
    avgOrderValue: channels.filter(c => c.active).reduce((sum, c) => sum + c.avgOrderValue, 0) / Math.max(channels.filter(c => c.active).length, 1)
  };

  const launchChannel = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (!channel || channel.active) return;
    
    // Check if player has sufficient funds
    if (financialData.bankBalance < channel.setupCost) {
      alert("⚠️ Insufficient funds to launch this channel.");
      return;
    }
    
    // Deduct money and launch channel
    updateFinancialData({
      bankBalance: financialData.bankBalance - channel.setupCost
    });
    
    // Update channels with launch
    setChannels(prev => 
      prev.map(c => 
        c.id === channelId ? { 
          ...c, 
          active: true,
          customerBase: Math.floor(c.customerBase * 0.3), // Start with 30% of potential customers
        } : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-3 md:p-6">
      <div className="mb-4 md:mb-6">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-purple-100"
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
          <div className="p-2 md:p-3 rounded-full bg-purple-500 text-white text-lg md:text-xl">
            🛒
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">E-commerce Empire</h1>
            <p className="text-sm md:text-base text-gray-600">Build multi-channel online retail presence</p>
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
                <p className="text-xs md:text-sm text-purple-700">Total Customers</p>
                <p className="text-sm md:text-lg font-bold text-purple-800">{currentMetrics.totalCustomers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
              <div>
                <p className="text-xs md:text-sm text-orange-700">Conversion Rate</p>
                <p className="text-sm md:text-lg font-bold text-orange-800">{currentMetrics.avgConversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="overview" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="channels" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Channels</TabsTrigger>
          <TabsTrigger value="marketing" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Marketing</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-purple-500" />
                  E-commerce Network Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{currentMetrics.activeChannels}</p>
                    <p className="text-sm text-gray-600">Active Channels</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">₹{Math.round(currentMetrics.avgOrderValue)}</p>
                    <p className="text-sm text-gray-600">Avg Order Value</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{currentMetrics.totalCustomers.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Customers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{currentMetrics.avgConversionRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <div className="space-y-4">
            {channels.map((channel) => (
              <Card 
                key={channel.id} 
                className={`transition-all duration-200 ${
                  channel.active 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200 hover:border-purple-300'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${channel.active ? 'bg-green-500' : 'bg-gray-400'} text-white`}>
                        {channel.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                        <p className="text-sm text-gray-600">{channel.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {channel.active ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => launchChannel(channel.id)}
                          className="bg-purple-500 hover:bg-purple-600 text-white"
                        >
                          Launch ₹{channel.setupCost.toLocaleString()}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-medium text-purple-600">{channel.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Revenue:</span>
                      <span className="font-medium text-green-600">₹{channel.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Expenses:</span>
                      <span className="font-medium text-red-600">₹{channel.monthlyExpenses.toLocaleString()}</span>
                    </div>
                    {channel.active && (
                      <>
                        <div className="flex justify-between">
                          <span>Customer Base:</span>
                          <span className="font-medium text-blue-600">{channel.customerBase.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conversion Rate:</span>
                          <span className="font-medium text-orange-600">{channel.conversionRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Order Value:</span>
                          <span className="font-medium text-green-600">₹{channel.avgOrderValue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Competition Level:</span>
                          <span className={`font-medium ${channel.competitionLevel >= 80 ? 'text-red-600' : channel.competitionLevel >= 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {channel.competitionLevel}%
                          </span>
                        </div>
                      </>
                    )}
                    <hr />
                    <div className="flex justify-between font-bold">
                      <span>Net Profit:</span>
                      <span className="text-green-600">
                        ₹{channel.active 
                          ? (calculateCompetitionAdjustedRevenue(channel) - channel.monthlyExpenses).toLocaleString()
                          : (channel.monthlyRevenue - channel.monthlyExpenses).toLocaleString()
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Marketing Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketingCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{campaign.title}</h4>
                          <p className="text-sm text-gray-600">{campaign.description}</p>
                        </div>
                        <Badge 
                          variant={campaign.active ? "default" : "secondary"}
                          className={campaign.active ? "bg-green-100 text-green-800" : ""}
                        >
                          {campaign.active ? 'Running' : 'Available'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                        <div>Cost: ₹{campaign.cost.toLocaleString()}</div>
                        <div>Duration: {campaign.duration}</div>
                        <div>Target: {campaign.targetAudience}</div>
                        <div>Expected ROI: {campaign.expectedROI}%</div>
                      </div>
                      
                      {!campaign.active && (
                        <Button 
                          className="mt-3 w-full" 
                          size="sm"
                          disabled={financialData.bankBalance < campaign.cost}
                        >
                          Launch Campaign ₹{campaign.cost.toLocaleString()}
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
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Revenue Growth</h4>
                      <div className="flex items-center gap-2">
                        <Progress value={75} className="flex-1 h-2" />
                        <span className="text-sm font-medium">+18% this month</span>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Customer Acquisition</h4>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">+{Math.round(currentMetrics.totalCustomers * 0.15)} new customers</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Channel Performance</h4>
                    <div className="space-y-2">
                      {channels.filter(c => c.active).map(channel => (
                        <div key={channel.id} className="flex justify-between items-center">
                          <span className="text-sm">{channel.name}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={channel.conversionRate * 10} className="w-20 h-2" />
                            <span className="text-xs font-medium w-12">{channel.conversionRate}%</span>
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

export default EcommercePage;