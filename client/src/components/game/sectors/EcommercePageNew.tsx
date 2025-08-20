import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Package, 
  Truck,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Globe,
  Smartphone,
  CreditCard,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { toast } from 'sonner';

interface EcommercePageProps {
  onBack: () => void;
}

interface ProductCategory {
  id: string;
  name: string;
  description: string;
  cost: number;
  marketSize: string;
  profitMargin: string;
  active: boolean;
}

interface Platform {
  id: string;
  name: string;
  description: string;
  cost: number;
  features: string;
  commission: string;
  active: boolean;
}

interface MarketingChannel {
  id: string;
  name: string;
  description: string;
  cost: number;
  reach: string;
  conversionRate: string;
  active: boolean;
}

const EcommercePageNew: React.FC<EcommercePageProps> = ({ onBack }) => {
  const { financialData } = useWealthSprintGame();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [storeName] = useState('Digital Marketplace');
  const [conversionRate] = useState(3.2);
  
  // Product categories
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([
    {
      id: 'electronics',
      name: 'Electronics',
      description: 'Smartphones, laptops, gadgets and accessories',
      cost: 500000,
      marketSize: 'Large',
      profitMargin: '15-25%',
      active: false
    },
    {
      id: 'fashion',
      name: 'Fashion & Lifestyle',
      description: 'Clothing, shoes, accessories and beauty products',
      cost: 350000,
      marketSize: 'Very Large',
      profitMargin: '40-60%',
      active: false
    },
    {
      id: 'home_garden',
      name: 'Home & Garden',
      description: 'Furniture, decor, kitchen and gardening supplies',
      cost: 400000,
      marketSize: 'Medium',
      profitMargin: '30-45%',
      active: false
    }
  ]);

  // E-commerce platforms
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'marketplace',
      name: 'Multi-Vendor Marketplace',
      description: 'Allow third-party sellers to list products',
      cost: 600000,
      features: 'Vendor management, commission system',
      commission: '5-15%',
      active: false
    },
    {
      id: 'dropshipping',
      name: 'Dropshipping Platform',
      description: 'Automated order fulfillment without inventory',
      cost: 300000,
      features: 'Supplier integration, auto-fulfillment',
      commission: '10-20%',
      active: false
    }
  ]);

  // Marketing channels
  const [marketingChannels, setMarketingChannels] = useState<MarketingChannel[]>([
    {
      id: 'social_media',
      name: 'Social Media Ads',
      description: 'Facebook, Instagram, and TikTok advertising',
      cost: 200000,
      reach: 'High',
      conversionRate: '2-4%',
      active: false
    },
    {
      id: 'influencer',
      name: 'Influencer Marketing',
      description: 'Partnerships with social media influencers',
      cost: 250000,
      reach: 'Medium',
      conversionRate: '5-8%',
      active: false
    },
    {
      id: 'seo_content',
      name: 'SEO & Content Marketing',
      description: 'Search optimization and content creation',
      cost: 150000,
      reach: 'Medium',
      conversionRate: '3-6%',
      active: false
    }
  ]);

  const activeCategories = productCategories.filter(c => c.active);
  const activePlatforms = platforms.filter(p => p.active);
  const activeChannels = marketingChannels.filter(c => c.active);
  const finalRevenue = 60000 + (activeCategories.length * 20000) + (activePlatforms.length * 30000) + (activeChannels.length * 15000);

  const checkFunds = (amount: number) => {
    if (financialData.bankBalance < amount) {
      toast.error(`Insufficient funds! Need ₹${amount.toLocaleString()}`);
      return false;
    }
    return true;
  };

  const launchCategory = (categoryId: string) => {
    const category = productCategories.find(c => c.id === categoryId);
    if (!category) return;

    if (!checkFunds(category.cost)) return;

    const { investInBusinessSector } = useWealthSprintGame.getState();
    
    const success = investInBusinessSector('ecommerce', 'E-commerce', `Launched ${category.name} category`, category.cost);
    
    if (success) {
      setProductCategories(prev => 
        prev.map(c => 
          c.id === categoryId ? { ...c, active: true } : c
        )
      );
      toast.success(`🛍️ ${category.name} category launched!`);
    }
  };

  const activatePlatform = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return;

    if (!checkFunds(platform.cost)) return;

    const { investInBusinessSector } = useWealthSprintGame.getState();
    
    const success = investInBusinessSector('ecommerce', 'E-commerce', `Activated ${platform.name}`, platform.cost);
    
    if (success) {
      setPlatforms(prev => 
        prev.map(p => 
          p.id === platformId ? { ...p, active: true } : p
        )
      );
      toast.success(`🏪 ${platform.name} activated!`);
    }
  };

  const activateChannel = (channelId: string) => {
    const channel = marketingChannels.find(c => c.id === channelId);
    if (!channel) return;

    if (!checkFunds(channel.cost)) return;

    const { investInBusinessSector } = useWealthSprintGame.getState();
    
    const success = investInBusinessSector('ecommerce', 'E-commerce', `Activated ${channel.name}`, channel.cost);
    
    if (success) {
      setMarketingChannels(prev => 
        prev.map(c => 
          c.id === channelId ? { ...c, active: true } : c
        )
      );
      toast.success(`📢 ${channel.name} activated!`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Blue Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="px-4 py-4">
          {/* Main Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="p-2 bg-white bg-opacity-15 rounded-lg">
                <div className="text-2xl">🛒</div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{storeName}</h1>
                <p className="text-blue-200 text-sm">E-commerce Management • Build your online empire</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-15 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 text-white text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Budget: ₹{(financialData.bankBalance / 100000).toFixed(1)}L</span>
              </div>
            </div>
          </div>

          {/* Business Summary */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-blue-200 text-xs">Product Categories</div>
                <div className="text-white font-bold text-lg">{activeCategories.length}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Platforms</div>
                <div className="text-green-300 font-bold text-lg">{activePlatforms.length}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Conversion Rate</div>
                <div className="text-yellow-300 font-bold text-lg">{conversionRate}%</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Total Investment</div>
                <div className="text-orange-300 font-bold text-lg">₹0.0L</div>
              </div>
            </div>
          </div>

          {/* Horizontal Tabs Menu */}
          <div className="bg-blue-700 rounded-lg p-1">
            <div className="flex overflow-x-auto scrollbar-hide gap-1">
              {[
                { id: 'overview', label: 'Overview', icon: Star },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'platforms', label: 'Platforms', icon: Globe },
                { id: 'marketing', label: 'Marketing', icon: BarChart3 }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant="ghost"
                    size="sm"
                    className={`flex-shrink-0 transition-all duration-200 ${
                      isActive 
                        ? 'bg-white text-blue-800 hover:bg-white hover:text-blue-800' 
                        : 'bg-transparent text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-700">Monthly Revenue</p>
                    <p className="text-lg font-bold text-blue-800">₹{finalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700">Categories</p>
                    <p className="text-lg font-bold text-green-800">{activeCategories.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-700">Conversion</p>
                    <p className="text-lg font-bold text-purple-800">{conversionRate}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-orange-700">Marketing</p>
                    <p className="text-lg font-bold text-orange-800">{activeChannels.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Product Categories ({activeCategories.length} active)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productCategories.map((category) => (
                <Card key={category.id} className={`border transition-all hover:shadow-lg ${category.active ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{category.name}</h4>
                      {category.active && <Badge className="bg-green-600 text-white text-xs">Active</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Size:</span>
                        <span className="font-medium">{category.marketSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profit Margin:</span>
                        <span className="font-medium text-green-600">{category.profitMargin}</span>
                      </div>
                    </div>
                    {!category.active && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Launch Cost:</span>
                          <span className="font-bold text-blue-600">₹{category.cost.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => launchCategory(category.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={financialData.bankBalance < category.cost}
                        >
                          <Package className="w-4 h-4 mr-2" />
                          Launch Category
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Platforms Tab */}
        {activeTab === 'platforms' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              E-commerce Platforms ({activePlatforms.length} active)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <Card key={platform.id} className={`border transition-all hover:shadow-lg ${platform.active ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                      {platform.active && <Badge className="bg-green-600 text-white text-xs">Active</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{platform.description}</p>
                    {!platform.active && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Setup Cost:</span>
                          <span className="font-bold text-blue-600">₹{platform.cost.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => activatePlatform(platform.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={financialData.bankBalance < platform.cost}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Activate Platform
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Marketing Tab */}
        {activeTab === 'marketing' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Marketing Channels ({activeChannels.length} active)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketingChannels.map((channel) => (
                <Card key={channel.id} className={`border transition-all hover:shadow-lg ${channel.active ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{channel.name}</h4>
                      {channel.active && <Badge className="bg-green-600 text-white text-xs">Active</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{channel.description}</p>
                    {!channel.active && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Campaign Cost:</span>
                          <span className="font-bold text-blue-600">₹{channel.cost.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => activateChannel(channel.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={financialData.bankBalance < channel.cost}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Launch Campaign
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default EcommercePageNew;