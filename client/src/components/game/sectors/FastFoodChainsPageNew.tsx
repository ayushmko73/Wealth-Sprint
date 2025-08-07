import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Store, 
  Truck, 
  Smartphone, 
  Building2,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  ChefHat,
  Target,
  Zap,
  Award,
  AlertTriangle,
  Camera,
  Volume2,
  Crown
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { toast } from 'sonner';

interface FastFoodChainsPageProps {
  onBack: () => void;
}

interface City {
  id: string;
  name: string;
  cost: number;
  population: string;
  customerBoost: number;
  deliveryTime: string;
  unlocked: boolean;
}

interface MenuType {
  id: string;
  name: string;
  description: string;
  cost: number;
  revenueBoost: number;
  active: boolean;
}

interface PricingStrategy {
  id: string;
  name: string;
  description: string;
  cost: number;
  customerFootfall: string;
  profitMargin: string;
  active: boolean;
}

interface LogisticsModel {
  id: string;
  name: string;
  description: string;
  cost: number;
  deliveryTime: string;
  active: boolean;
}

interface EventCard {
  id: string;
  title: string;
  description: string;
  effect: string;
  duration: string;
  active: boolean;
}

const FastFoodChainsPageNew: React.FC<FastFoodChainsPageProps> = ({ onBack }) => {
  const { financialData, spendFromWallet } = useWealthSprintGame();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [brandName, setBrandName] = useState('My Fast Food Chain');
  const [customerSatisfaction] = useState(78);
  
  // Cities for expansion
  const [cities, setCities] = useState<City[]>([
    {
      id: 'ranikhet',
      name: 'Ranikhet',
      cost: 250000,
      population: '50K',
      customerBoost: 15,
      deliveryTime: '25 min',
      unlocked: false
    },
    {
      id: 'jaipur',
      name: 'Jaipur',
      cost: 500000,
      population: '3.5M',
      customerBoost: 35,
      deliveryTime: '35 min',
      unlocked: false
    },
    {
      id: 'delhi',
      name: 'Delhi',
      cost: 1000000,
      population: '32M',
      customerBoost: 75,
      deliveryTime: '45 min',
      unlocked: false
    },
    {
      id: 'mumbai',
      name: 'Mumbai',
      cost: 1200000,
      population: '20M',
      customerBoost: 85,
      deliveryTime: '40 min',
      unlocked: false
    },
    {
      id: 'bangalore',
      name: 'Bangalore',
      cost: 800000,
      population: '13M',
      customerBoost: 65,
      deliveryTime: '30 min',
      unlocked: false
    }
  ]);

  // Menu options
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([
    {
      id: 'standard',
      name: 'Standard Menu',
      description: 'Classic items with affordable pricing',
      cost: 50000,
      revenueBoost: 20,
      active: false
    },
    {
      id: 'premium',
      name: 'Premium Menu',
      description: 'Gourmet, international, or high-margin items',
      cost: 150000,
      revenueBoost: 45,
      active: false
    },
    {
      id: 'local',
      name: 'Local Tastes',
      description: 'Custom dishes based on selected cities',
      cost: 100000,
      revenueBoost: 30,
      active: false
    }
  ]);

  // Pricing strategies
  const [pricingStrategies, setPricingStrategies] = useState<PricingStrategy[]>([
    {
      id: 'high_margin',
      name: 'High Margin',
      description: 'Lower customer footfall, higher per-item profit',
      cost: 75000,
      customerFootfall: 'Low',
      profitMargin: 'High (45%)',
      active: false
    },
    {
      id: 'volume_based',
      name: 'Volume Based',
      description: 'Lower price, higher footfall and brand expansion',
      cost: 60000,
      customerFootfall: 'High',
      profitMargin: 'Medium (25%)',
      active: false
    }
  ]);

  // Logistics models
  const [logisticsModels, setLogisticsModels] = useState<LogisticsModel[]>([
    {
      id: 'quick_commerce',
      name: 'Quick Commerce',
      description: 'Own bikes/scooters for ultra-fast 30-minute delivery',
      cost: 200000,
      deliveryTime: '30 min',
      active: false
    },
    {
      id: 'franchise',
      name: 'Franchise',
      description: 'Independent stores paying licensing fees',
      cost: 500000,
      deliveryTime: '35 min',
      active: false
    }
  ]);

  // Event cards
  const [eventCards] = useState<EventCard[]>([
    {
      id: 'rainy_day',
      title: 'Rainy Day Boost',
      description: 'Hot food demand increases in Delhi',
      effect: 'Revenue +15%',
      duration: 'Today',
      active: true
    },
    {
      id: 'festival_season',
      title: 'Festival Season',
      description: 'High demand during festive period',
      effect: 'Customer satisfaction +10%',
      duration: '3 days',
      active: false
    }
  ]);

  // Calculate current metrics
  const activeCities = cities.filter(c => c.unlocked);
  const totalRevenue = activeCities.reduce((sum, city) => sum + (city.customerBoost * 1000), 0);
  const activeMenuBoost = menuTypes.filter(m => m.active).reduce((sum, m) => sum + m.revenueBoost, 0);
  const finalRevenue = totalRevenue + (totalRevenue * activeMenuBoost / 100);

  // Check sufficient funds function
  const checkFunds = (amount: number): boolean => {
    if (financialData.bankBalance < amount) {
      toast.error('⚠️ Insufficient funds to complete this action.');
      return false;
    }
    return true;
  };

  // Expand to city
  const expandToCity = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return;

    if (!checkFunds(city.cost)) return;

    // Deduct from bank balance and add transaction record
    const { updateFinancialData, addTransaction, financialData } = useWealthSprintGame.getState();
    
    updateFinancialData({
      bankBalance: financialData.bankBalance - city.cost
    });

    addTransaction({
      type: 'business_operations',
      amount: -city.cost,
      description: `City expansion to ${city.name}`,
      fromAccount: 'bank',
      toAccount: 'business'
    });

    setCities(prev => 
      prev.map(c => 
        c.id === cityId ? { ...c, unlocked: true } : c
      )
    );
    toast.success(`🏪 Successfully expanded to ${city.name}!`);
  };

  // Activate menu type
  const activateMenuType = (menuId: string) => {
    const menu = menuTypes.find(m => m.id === menuId);
    if (!menu) return;

    if (!checkFunds(menu.cost)) return;

    // Deduct from bank balance and add transaction record
    const { updateFinancialData, addTransaction, financialData } = useWealthSprintGame.getState();
    
    updateFinancialData({
      bankBalance: financialData.bankBalance - menu.cost
    });

    addTransaction({
      type: 'business_operations',
      amount: -menu.cost,
      description: `Activated ${menu.name} for Fast Food Chain`,
      fromAccount: 'bank',
      toAccount: 'business'
    });

    setMenuTypes(prev => 
      prev.map(m => 
        m.id === menuId ? { ...m, active: true } : m
      )
    );
    toast.success(`🍽️ ${menu.name} activated!`);
  };

  // Activate pricing strategy
  const activatePricingStrategy = (strategyId: string) => {
    const strategy = pricingStrategies.find(s => s.id === strategyId);
    if (!strategy) return;

    if (!checkFunds(strategy.cost)) return;

    // Deduct from bank balance and add transaction record
    const { updateFinancialData, addTransaction, financialData } = useWealthSprintGame.getState();
    
    updateFinancialData({
      bankBalance: financialData.bankBalance - strategy.cost
    });

    addTransaction({
      type: 'business_operations',
      amount: -strategy.cost,
      description: `Activated ${strategy.name} pricing strategy`,
      fromAccount: 'bank',
      toAccount: 'business'
    });

    setPricingStrategies(prev => 
      prev.map(s => ({ ...s, active: s.id === strategyId }))
    );
    toast.success(`💰 ${strategy.name} pricing strategy activated!`);
  };

  // Activate logistics model
  const activateLogisticsModel = (modelId: string) => {
    const model = logisticsModels.find(m => m.id === modelId);
    if (!model) return;

    if (!checkFunds(model.cost)) return;

    // Deduct from bank balance and add transaction record
    const { updateFinancialData, addTransaction, financialData } = useWealthSprintGame.getState();
    
    updateFinancialData({
      bankBalance: financialData.bankBalance - model.cost
    });

    addTransaction({
      type: 'business_operations',
      amount: -model.cost,
      description: `Activated ${model.name} logistics model`,
      fromAccount: 'bank',
      toAccount: 'business'
    });

    setLogisticsModels(prev => 
      prev.map(m => ({ ...m, active: m.id === modelId }))
    );
    toast.success(`🚚 ${model.name} logistics activated!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2 hover:bg-orange-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-red-500 text-white">
            🍟
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{brandName}</h1>
            <p className="text-gray-600">Build your food empire across India</p>
          </div>
        </div>
      </div>

      {/* Bank Balance Display */}
      <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-xl font-bold text-green-700">₹{financialData.bankBalance.toLocaleString()}</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              Customer Satisfaction: {customerSatisfaction}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-green-700">Monthly Revenue</p>
                <p className="text-lg font-bold text-green-800">₹{finalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-700">Active Cities</p>
                <p className="text-lg font-bold text-blue-800">{activeCities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-purple-700">Customer Rating</p>
                <p className="text-lg font-bold text-purple-800">★ {(customerSatisfaction / 20).toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-orange-700">Active Menu Boost</p>
                <p className="text-lg font-bold text-orange-800">+{activeMenuBoost}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-white">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="cities" 
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Cities
          </TabsTrigger>
          <TabsTrigger 
            value="operations" 
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Operations
          </TabsTrigger>
          <TabsTrigger 
            value="brand" 
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Brand
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Active Cities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Active Cities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeCities.map((city) => (
                  <div key={city.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">{city.name}</p>
                      <p className="text-sm text-gray-600">Population: {city.population}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">+{city.customerBoost}% revenue</Badge>
                  </div>
                ))}
                {activeCities.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No cities expanded yet</p>
                )}
              </CardContent>
            </Card>

            {/* Event Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Active Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {eventCards.filter(e => e.active).map((event) => (
                  <div key={event.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{event.title}</p>
                      <Badge className="bg-yellow-100 text-yellow-800">{event.duration}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                    <p className="text-sm font-medium text-green-600">{event.effect}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cities Tab (Replace Business Models) */}
        <TabsContent value="cities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Expand to New Cities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cities.map((city) => (
                  <Card key={city.id} className={`${city.unlocked ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {city.name}
                        </div>
                        {city.unlocked ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge variant="outline">Available</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Population:</span>
                          <span className="font-medium">{city.population}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expansion Cost:</span>
                          <span className="font-medium">₹{city.cost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue Boost:</span>
                          <span className="font-medium text-green-600">+{city.customerBoost}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery Time:</span>
                          <span className="font-medium">{city.deliveryTime}</span>
                        </div>
                      </div>

                      {!city.unlocked && (
                        <Button 
                          onClick={() => expandToCity(city.id)}
                          disabled={financialData.bankBalance < city.cost}
                          className={`w-full ${
                            financialData.bankBalance >= city.cost 
                              ? 'bg-red-500 hover:bg-red-600 text-white' 
                              : 'bg-gray-300 text-gray-500'
                          }`}
                        >
                          {financialData.bankBalance < city.cost ? (
                            <>
                              <AlertTriangle className="h-4 w-4 mr-2 text-gray-500" />
                              Insufficient Funds
                            </>
                          ) : (
                            <>
                              Expand - ₹{city.cost.toLocaleString()}
                            </>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Menu Section */}
            <Card className="border-orange-200 bg-orange-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-orange-600" />
                  Menu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {menuTypes.map((menu) => (
                  <div key={menu.id} className={`p-3 rounded-lg border transition-all duration-200 ${
                    menu.active 
                      ? 'border-green-400 bg-green-100 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{menu.name}</p>
                      {menu.active && (
                        <Badge className="bg-green-500 text-white">
                          💚 Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{menu.description}</p>
                    <p className="text-sm font-medium text-green-600">Revenue +{menu.revenueBoost}%</p>
                    {!menu.active && (
                      <Button 
                        onClick={() => activateMenuType(menu.id)}
                        disabled={financialData.bankBalance < menu.cost}
                        className={`w-full mt-2 ${
                          financialData.bankBalance >= menu.cost 
                            ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                            : 'bg-gray-300 text-gray-500'
                        }`}
                        size="sm"
                      >
                        Activate - ₹{menu.cost.toLocaleString()}
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pricing Strategy */}
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  Pricing Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pricingStrategies.map((strategy) => (
                  <div key={strategy.id} className={`p-3 rounded-lg border transition-all duration-200 ${
                    strategy.active 
                      ? 'border-green-400 bg-green-100 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{strategy.name}</p>
                      {strategy.active && (
                        <Badge className="bg-green-500 text-white">
                          💚 Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{strategy.description}</p>
                    <div className="text-sm space-y-1">
                      <p>Footfall: <span className="font-medium text-blue-600">{strategy.customerFootfall}</span></p>
                      <p>Margin: <span className="font-medium text-green-600">{strategy.profitMargin}</span></p>
                    </div>
                    {!strategy.active && (
                      <Button 
                        onClick={() => activatePricingStrategy(strategy.id)}
                        disabled={financialData.bankBalance < strategy.cost}
                        className={`w-full mt-2 ${
                          financialData.bankBalance >= strategy.cost 
                            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                            : 'bg-gray-300 text-gray-500'
                        }`}
                        size="sm"
                      >
                        Activate - ₹{strategy.cost.toLocaleString()}
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Logistics */}
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-purple-600" />
                  Logistics & Business
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {logisticsModels.map((model) => (
                  <div key={model.id} className={`p-3 rounded-lg border transition-all duration-200 ${
                    model.active 
                      ? 'border-green-400 bg-green-100 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{model.name}</p>
                      {model.active && (
                        <Badge className="bg-green-500 text-white">
                          💚 Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                    <p className="text-sm">Delivery: <span className="font-medium text-purple-600">{model.deliveryTime}</span></p>
                    {!model.active && (
                      <Button 
                        onClick={() => activateLogisticsModel(model.id)}
                        disabled={financialData.bankBalance < model.cost}
                        className={`w-full mt-2 ${
                          financialData.bankBalance >= model.cost 
                            ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                            : 'bg-gray-300 text-gray-500'
                        }`}
                        size="sm"
                      >
                        Activate - ₹{model.cost.toLocaleString()}
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Brand Tab */}
        <TabsContent value="brand" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Brand Customization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Brand Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input
                    id="brand-name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Enter your brand name"
                  />
                </div>
                <div>
                  <Label>Upload Logo</Label>
                  <Button variant="outline" className="w-full mt-2">
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Brand Logo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Customer Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Customer Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Food Critic Review</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">4.2</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">"Exceptional taste and quick delivery. The local menu adds authentic flavors."</p>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="font-medium text-yellow-800 mb-1">Brand Impact</p>
                  <p className="text-sm text-yellow-700">Recent review increased brand reputation by 5%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FastFoodChainsPageNew;