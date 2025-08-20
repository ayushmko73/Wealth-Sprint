import React, { useState, useEffect } from 'react';
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
  Crown,
  Activity
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
  customerAppeal: string;
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

const FastFoodChainsPageNew: React.FC<FastFoodChainsPageProps> = ({ onBack }) => {
  const { financialData, updateFinancialData, fastFoodChains, setFastFoodState } = useWealthSprintGame();
  
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
      cost: 750000,
      population: '32M',
      customerBoost: 50,
      deliveryTime: '45 min',
      unlocked: false
    }
  ]);

  // Menu types
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([
    {
      id: 'classic',
      name: 'Classic Burgers',
      description: 'Traditional fast food menu with burgers, fries, and shakes',
      cost: 150000,
      customerAppeal: 'High',
      revenueBoost: 20,
      active: false
    },
    {
      id: 'healthy',
      name: 'Healthy Options',
      description: 'Salads, wraps, and organic ingredients',
      cost: 200000,
      customerAppeal: 'Medium',
      revenueBoost: 15,
      active: false
    }
  ]);

  // Pricing strategies
  const [pricingStrategies, setPricingStrategies] = useState<PricingStrategy[]>([
    {
      id: 'premium',
      name: 'Premium Pricing',
      description: 'High-quality ingredients with premium pricing',
      cost: 100000,
      customerFootfall: 'Medium',
      profitMargin: 'High',
      active: false
    },
    {
      id: 'value',
      name: 'Value Pricing',
      description: 'Competitive pricing to attract more customers',
      cost: 75000,
      customerFootfall: 'High',
      profitMargin: 'Medium',
      active: false
    }
  ]);

  // Logistics models
  const [logisticsModels, setLogisticsModels] = useState<LogisticsModel[]>([
    {
      id: 'express',
      name: 'Express Delivery',
      description: 'Fast delivery service with dedicated fleet',
      cost: 300000,
      deliveryTime: '15-20 min',
      active: false
    },
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: 'Regular delivery service with third-party partners',
      cost: 150000,
      deliveryTime: '30-40 min',
      active: false
    }
  ]);

  // Helper functions
  const activeCities = cities.filter(c => c.unlocked);
  const activeMenus = menuTypes.filter(m => m.active);
  const finalRevenue = 50000 + (activeCities.length * 15000) + (activeMenus.length * 10000);
  const activeMenuBoost = activeMenus.reduce((total, menu) => total + menu.revenueBoost, 0);

  const checkFunds = (amount: number) => {
    if (financialData.bankBalance < amount) {
      toast.error(`Insufficient funds! Need ₹${amount.toLocaleString()}`);
      return false;
    }
    return true;
  };

  // Unlock city
  const unlockCity = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return;

    if (!checkFunds(city.cost)) return;

    const { investInBusinessSector } = useWealthSprintGame.getState();
    
    const success = investInBusinessSector('fast_food', 'Fast Food Chains', `City expansion to ${city.name}`, city.cost);
    
    if (success) {
      setCities(prev => 
        prev.map(c => 
          c.id === cityId ? { ...c, unlocked: true } : c
        )
      );
      toast.success(`🏪 Successfully expanded to ${city.name}!`);
    }
  };

  // Activate menu type
  const activateMenuType = (menuId: string) => {
    const menu = menuTypes.find(m => m.id === menuId);
    if (!menu) return;

    if (!checkFunds(menu.cost)) return;

    const { investInBusinessSector } = useWealthSprintGame.getState();
    
    const success = investInBusinessSector('fast_food', 'Fast Food Chains', `Activated ${menu.name}`, menu.cost);
    
    if (success) {
      setMenuTypes(prev => 
        prev.map(m => 
          m.id === menuId ? { ...m, active: true } : m
        )
      );
      toast.success(`🍽️ ${menu.name} activated!`);
    }
  };

  // Activate pricing strategy
  const activatePricingStrategy = (strategyId: string) => {
    const strategy = pricingStrategies.find(s => s.id === strategyId);
    if (!strategy) return;

    if (!checkFunds(strategy.cost)) return;

    const { investInBusinessSector } = useWealthSprintGame.getState();
    
    const success = investInBusinessSector('fast_food', 'Fast Food Chains', `Activated ${strategy.name} pricing strategy`, strategy.cost);
    
    if (success) {
      setPricingStrategies(prev => 
        prev.map(s => ({ ...s, active: s.id === strategyId }))
      );
      toast.success(`💰 ${strategy.name} pricing strategy activated!`);
    }
  };

  // Activate logistics model
  const activateLogisticsModel = (modelId: string) => {
    const model = logisticsModels.find(m => m.id === modelId);
    if (!model) return;

    if (!checkFunds(model.cost)) return;

    const { investInBusinessSector } = useWealthSprintGame.getState();
    
    const success = investInBusinessSector('fast_food', 'Fast Food Chains', `Activated ${model.name} logistics model`, model.cost);
    
    if (success) {
      setLogisticsModels(prev => 
        prev.map(m => ({ ...m, active: m.id === modelId }))
      );
      toast.success(`🚚 ${model.name} logistics activated!`);
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
                <div className="text-2xl">🍟</div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{brandName}</h1>
                <p className="text-blue-200 text-sm">Fast Food Chain Management • Build your food empire</p>
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
                <div className="text-blue-200 text-xs">Active Cities</div>
                <div className="text-white font-bold text-lg">{activeCities.length}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Menu Types</div>
                <div className="text-green-300 font-bold text-lg">{activeMenus.length}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Satisfaction</div>
                <div className="text-yellow-300 font-bold text-lg">{customerSatisfaction}%</div>
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
                { id: 'expansion', label: 'City Expansion', icon: MapPin },
                { id: 'menu', label: 'Menu Types', icon: ChefHat },
                { id: 'pricing', label: 'Pricing', icon: DollarSign },
                { id: 'logistics', label: 'Logistics', icon: Truck }
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
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700">Active Cities</p>
                    <p className="text-lg font-bold text-green-800">{activeCities.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-700">Satisfaction</p>
                    <p className="text-lg font-bold text-purple-800">{customerSatisfaction}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-orange-700">Menu Boost</p>
                    <p className="text-lg font-bold text-orange-800">+{activeMenuBoost}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* City Expansion Tab */}
        {activeTab === 'expansion' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              City Expansion ({activeCities.length}/{cities.length} unlocked)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map((city) => (
                <Card key={city.id} className={`border transition-all hover:shadow-lg ${city.unlocked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{city.name}</h4>
                      {city.unlocked && <Badge className="bg-green-600 text-white text-xs">Active</Badge>}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Population:</span>
                        <span className="font-medium">{city.population}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer Boost:</span>
                        <span className="font-medium text-green-600">+{city.customerBoost}%</span>
                      </div>
                    </div>
                    {!city.unlocked && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Investment Cost:</span>
                          <span className="font-bold text-blue-600">₹{city.cost.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => unlockCity(city.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={financialData.bankBalance < city.cost}
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Expand to {city.name}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-blue-600" />
              Menu Types ({activeMenus.length} active)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuTypes.map((menu) => (
                <Card key={menu.id} className={`border transition-all hover:shadow-lg ${menu.active ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{menu.name}</h4>
                      {menu.active && <Badge className="bg-green-600 text-white text-xs">Active</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{menu.description}</p>
                    {!menu.active && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Activation Cost:</span>
                          <span className="font-bold text-blue-600">₹{menu.cost.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => activateMenuType(menu.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={financialData.bankBalance < menu.cost}
                        >
                          <ChefHat className="w-4 h-4 mr-2" />
                          Activate Menu
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Pricing Strategies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pricingStrategies.map((strategy) => (
                <Card key={strategy.id} className={`border transition-all hover:shadow-lg ${strategy.active ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                      {strategy.active && <Badge className="bg-green-600 text-white text-xs">Active</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                    {!strategy.active && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Implementation Cost:</span>
                          <span className="font-bold text-blue-600">₹{strategy.cost.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => activatePricingStrategy(strategy.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={financialData.bankBalance < strategy.cost}
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Implement Strategy
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Logistics Tab */}
        {activeTab === 'logistics' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Logistics Models
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {logisticsModels.map((model) => (
                <Card key={model.id} className={`border transition-all hover:shadow-lg ${model.active ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{model.name}</h4>
                      {model.active && <Badge className="bg-green-600 text-white text-xs">Active</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                    {!model.active && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Setup Cost:</span>
                          <span className="font-bold text-blue-600">₹{model.cost.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => activateLogisticsModel(model.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={financialData.bankBalance < model.cost}
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          Setup Logistics
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

export default FastFoodChainsPageNew;