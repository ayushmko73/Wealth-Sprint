import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
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
  Plus
} from 'lucide-react';

interface FastFoodChainsPageProps {
  onBack: () => void;
}

interface City {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  expansionCost: number;
  expanded: boolean;
  monthlyRevenue: number;
  monthlyExpenses: number;
  customerMultiplier: number;
  deliveryTime: number;
  quality: number; // Product quality (0-100)
  qualityDecreaseDate?: Date; // When quality was last decreased
}

interface Milestone {
  id: string;
  title: string;
  requirement: number;
  reward: string;
  unlocked: boolean;
}

const FastFoodChainsPage: React.FC<FastFoodChainsPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [totalProfit] = useState(180000); // Current profit for milestone tracking
  const { financialData, updateFinancialData } = useWealthSprintGame();

  // Add icons back to cities after loading
  const addIconsToCities = (citiesData: City[]): City[] => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'ranikhet': <MapPin className="h-5 w-5" />,
      'jaipur': <Building2 className="h-5 w-5" />,
      'delhi': <Building2 className="h-5 w-5" />,
      'mumbai': <Building2 className="h-5 w-5" />,
      'bangalore': <Building2 className="h-5 w-5" />
    };
    
    return citiesData.map(city => ({
      ...city,
      icon: iconMap[city.id] || <Building2 className="h-5 w-5" />
    }));
  };

  // Load saved cities data on component mount
  const loadSavedCities = (): City[] => {
    try {
      const saved = localStorage.getItem('fastFoodCities');
      if (saved) {
        const parsedCities = JSON.parse(saved);
        // Ensure dates are properly reconstructed and add icons back
        const citiesWithDates = parsedCities.map((city: any) => ({
          ...city,
          qualityDecreaseDate: city.qualityDecreaseDate ? new Date(city.qualityDecreaseDate) : undefined
        }));
        return addIconsToCities(citiesWithDates);
      }
    } catch (error) {
      console.warn('Failed to load saved cities:', error);
    }
    // Return default cities if no saved data
    return addIconsToCities([
      {
        id: 'ranikhet',
        name: 'Ranikhet',
        icon: <MapPin className="h-5 w-5" />,
        description: 'Hill station with growing food scene',
        expansionCost: 120000,
        expanded: true,
        monthlyRevenue: 85000,
        monthlyExpenses: 65000,
        customerMultiplier: 1.0,
        deliveryTime: 25,
        quality: 75
      },
      {
        id: 'jaipur',
        name: 'Jaipur',
        icon: <Building2 className="h-5 w-5" />,
        description: 'Pink City - Heritage tourism hub',
        expansionCost: 200000,
        expanded: false,
        monthlyRevenue: 150000,
        monthlyExpenses: 95000,
        customerMultiplier: 1.3,
        deliveryTime: 30,
        quality: 80
      },
      {
        id: 'delhi',
        name: 'Delhi',
        icon: <Building2 className="h-5 w-5" />,
        description: 'National Capital - Massive market',
        expansionCost: 400000,
        expanded: false,
        monthlyRevenue: 300000,
        monthlyExpenses: 180000,
        customerMultiplier: 1.8,
        deliveryTime: 35,
        quality: 85
      },
      {
        id: 'mumbai',
        name: 'Mumbai',
        icon: <Building2 className="h-5 w-5" />,
        description: 'Financial Capital - Premium market',
        expansionCost: 500000,
        expanded: false,
        monthlyRevenue: 400000,
        monthlyExpenses: 240000,
        customerMultiplier: 2.0,
        deliveryTime: 40,
        quality: 90
      },
      {
        id: 'bangalore',
        name: 'Bangalore',
        icon: <Building2 className="h-5 w-5" />,
        description: 'Tech Hub - Young demographic',
        expansionCost: 350000,
        expanded: false,
        monthlyRevenue: 250000,
        monthlyExpenses: 145000,
        customerMultiplier: 1.6,
        deliveryTime: 28,
        quality: 88
      }
    ]);
  };
  
  const [cities, setCities] = useState<City[]>(loadSavedCities);

  // Save cities data whenever cities state changes (excluding non-serializable icon)
  React.useEffect(() => {
    const serializableCities = cities.map(city => ({
      ...city,
      icon: null // Remove non-serializable icon
    }));
    localStorage.setItem('fastFoodCities', JSON.stringify(serializableCities));
  }, [cities]);

  // Quality recovery system - gradually increase quality for expanded cities
  React.useEffect(() => {
    const qualityRecoveryInterval = setInterval(() => {
      setCities(currentCities => {
        return currentCities.map(city => {
          if (city.expanded && city.quality < 90) {
            // Increase quality by 1-2 points every 10 seconds, max 90%
            const qualityIncrease = Math.floor(Math.random() * 2) + 1;
            return {
              ...city,
              quality: Math.min(90, city.quality + qualityIncrease)
            };
          }
          return city;
        });
      });
    }, 10000); // Every 10 seconds

    return () => clearInterval(qualityRecoveryInterval);
  }, []);

  // Monthly profit auto-transfer to bank account (every 4 weeks = 28 days)
  React.useEffect(() => {
    const monthlyTransferInterval = setInterval(() => {
      const expandedCities = cities.filter(city => city.expanded);
      if (expandedCities.length > 0) {
        // Calculate total monthly profit
        let totalProfit = 0;
        expandedCities.forEach(city => {
          let adjustedRevenue = city.monthlyRevenue;
          if (city.quality < 50) {
            adjustedRevenue *= 0.8; // 20% reduction for poor quality
          } else if (city.quality > 70) {
            adjustedRevenue *= 1.2; // 20% increase for high quality
          }
          totalProfit += (adjustedRevenue - city.monthlyExpenses);
        });

        // Transfer profit to bank account
        if (totalProfit > 0) {
          updateFinancialData({
            bankBalance: financialData.bankBalance + totalProfit
          });
          
          // Show notification or log (optional)
          console.log(`Monthly Fast Food profit transferred: ₹${totalProfit.toLocaleString()}`);
        }
      }
    }, 30000); // 30 seconds for testing (represents 1 month in game time)

    return () => clearInterval(monthlyTransferInterval);
  }, [cities, financialData.bankBalance, updateFinancialData]);

  const [milestones] = useState<Milestone[]>([
    {
      id: 'second_kitchen',
      title: 'Second Cloud Kitchen',
      requirement: 500000,
      reward: 'Unlock additional cloud kitchen location',
      unlocked: totalProfit >= 500000
    },
    {
      id: 'delivery_app',
      title: 'Delivery App Launch',
      requirement: 1500000,
      reward: 'Launch your own delivery platform',
      unlocked: totalProfit >= 1500000
    },
    {
      id: 'franchise_unlock',
      title: 'Franchise Opportunities',
      requirement: 2500000,
      reward: 'Start franchising your brand',
      unlocked: totalProfit >= 2500000
    },
    {
      id: 'national_expansion',
      title: 'National Expansion',
      requirement: 5000000,
      reward: 'Expand to tier-2 and tier-3 cities',
      unlocked: totalProfit >= 5000000
    }
  ]);

  // Calculate quality-adjusted revenue
  const calculateQualityAdjustedRevenue = (city: City) => {
    if (!city.expanded) return 0;
    let adjustedRevenue = city.monthlyRevenue;
    if (city.quality < 50) {
      adjustedRevenue *= 0.8; // 20% reduction for poor quality
    } else if (city.quality > 70) {
      adjustedRevenue *= 1.2; // 20% increase for high quality
    }
    return adjustedRevenue;
  };

  const currentMetrics = {
    totalRevenue: cities.reduce((sum, c) => sum + calculateQualityAdjustedRevenue(c), 0),
    totalExpenses: cities.filter(c => c.expanded).reduce((sum, c) => sum + c.monthlyExpenses, 0),
    netProfit: cities.reduce((sum, c) => sum + (calculateQualityAdjustedRevenue(c) - (c.expanded ? c.monthlyExpenses : 0)), 0),
    activeCities: cities.filter(c => c.expanded).length,
    customerRating: 4.2,
    expandedCities: cities.filter(c => c.expanded).length,
    averageQuality: cities.filter(c => c.expanded).reduce((sum, c) => sum + c.quality, 0) / Math.max(cities.filter(c => c.expanded).length, 1)
  };

  const expandToCity = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city || city.expanded) return;
    
    // Check if player has sufficient funds
    if (financialData.bankBalance < city.expansionCost) {
      alert("⚠️ Insufficient funds to complete this action.");
      return;
    }
    
    // Deduct money and expand to city
    updateFinancialData({
      bankBalance: financialData.bankBalance - city.expansionCost
    });
    
    // Update cities with quality decrease and expansion
    setCities(prev => 
      prev.map(c => 
        c.id === cityId ? { 
          ...c, 
          expanded: true,
          quality: Math.max(c.quality - 25, 20), // Quality decreases by 25 points, min 20
          qualityDecreaseDate: new Date()
        } : c
      )
    );
  };

  // Quality improvement over time
  React.useEffect(() => {
    const qualityTimer = setInterval(() => {
      setCities(prev => 
        prev.map(city => {
          if (!city.expanded || !city.qualityDecreaseDate) return city;
          
          const daysSinceDecrease = Math.floor(
            (new Date().getTime() - city.qualityDecreaseDate!.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          // Quality improves by 5 points per day, max 95
          if (daysSinceDecrease > 0 && city.quality < 95) {
            return {
              ...city,
              quality: Math.min(city.quality + (daysSinceDecrease * 5), 95)
            };
          }
          
          return city;
        })
      );
    }, 10000); // Check every 10 seconds for demo purposes
    
    return () => clearInterval(qualityTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-orange-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Business</span>
          </Button>
          
          {/* Bank Balance Display - Mobile */}
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
          <div className="p-2 md:p-3 rounded-full bg-red-500 text-white text-lg md:text-xl">
            🍟
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Fast Food Chains</h1>
            <p className="text-sm md:text-base text-gray-600">Build your food empire across India</p>
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
              <Star className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              <div>
                <p className="text-xs md:text-sm text-purple-700">Customer Rating</p>
                <p className="text-sm md:text-lg font-bold text-purple-800">★ {currentMetrics.customerRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
              <div>
                <p className="text-xs md:text-sm text-orange-700">Active Cities</p>
                <p className="text-sm md:text-lg font-bold text-orange-800">{currentMetrics.activeCities}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="overview" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="cities" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Cities</TabsTrigger>
          <TabsTrigger value="operations" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Operations</TabsTrigger>
          <TabsTrigger value="expansion" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Milestones</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Active Cities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Active Cities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cities.filter(c => c.expanded).map((city) => (
                  <div key={city.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {city.icon}
                      <div>
                        <p className="font-medium">{city.name}</p>
                        <p className="text-sm text-gray-600">₹{(city.monthlyRevenue - city.monthlyExpenses).toLocaleString()}/month profit</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Expanded</Badge>
                  </div>
                ))}
                {cities.filter(c => c.expanded).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No expanded cities</p>
                )}
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-medium">₹{currentMetrics.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Expenses</span>
                    <span className="font-medium text-red-600">₹{currentMetrics.totalExpenses.toLocaleString()}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold">
                    <span>Net Profit</span>
                    <span className="text-green-600">₹{currentMetrics.netProfit.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Profit Margin</p>
                  <Progress 
                    value={currentMetrics.totalRevenue > 0 ? (currentMetrics.netProfit / currentMetrics.totalRevenue) * 100 : 0} 
                    className="h-2"
                  />
                  <p className="text-sm text-gray-600">
                    {currentMetrics.totalRevenue > 0 ? ((currentMetrics.netProfit / currentMetrics.totalRevenue) * 100).toFixed(1) : 0}% profit margin
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* City Expansion Tab */}
        <TabsContent value="cities" className="space-y-3 md:space-y-4">
          <div className="mb-3 md:mb-4 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              <span className="text-sm md:text-base font-medium text-blue-800">Bank: ₹{financialData.bankBalance.toLocaleString()}</span>
            </div>
            <p className="text-xs md:text-sm text-blue-700">Expand your fast food chain to new cities across India</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {cities.map((city) => (
              <Card key={city.id} className={`${city.expanded ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {city.icon}
                      {city.name}
                    </div>
                    {city.expanded ? (
                      <Badge className="bg-green-100 text-green-800">Expanded</Badge>
                    ) : (
                      <Badge variant="outline">Available</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{city.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Expansion Cost:</span>
                      <span className="font-medium">₹{city.expansionCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Revenue:</span>
                      <span className="font-medium text-green-600">₹{city.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Expenses:</span>
                      <span className="font-medium text-red-600">₹{city.monthlyExpenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Delivery Time:</span>
                      <span className="font-medium text-orange-600">{city.deliveryTime} mins</span>
                    </div>
                    {city.expanded && (
                      <div className="flex justify-between">
                        <span>Product Quality:</span>
                        <span className={`font-medium ${city.quality >= 70 ? 'text-green-600' : city.quality >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {city.quality}%
                        </span>
                      </div>
                    )}
                    <hr />
                    <div className="flex justify-between font-bold">
                      <span>Net Profit:</span>
                      <span className="text-green-600">
                        ₹{city.expanded 
                          ? (calculateQualityAdjustedRevenue(city) - city.monthlyExpenses).toLocaleString()
                          : (city.monthlyRevenue - city.monthlyExpenses).toLocaleString()
                        }
                      </span>
                    </div>
                  </div>

                  {!city.expanded && (
                    <Button 
                      onClick={() => expandToCity(city.id)}
                      disabled={financialData.bankBalance < city.expansionCost}
                      className={`w-full ${
                        financialData.bankBalance < city.expansionCost 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {financialData.bankBalance < city.expansionCost 
                        ? '⚠️ Insufficient Funds' 
                        : `Expand to ${city.name} - ₹${city.expansionCost.toLocaleString()}`
                      }
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {/* Menu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  Menu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Target className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div>Standard Menu</div>
                    <div className="text-xs text-gray-500 hidden md:block">Classic items, affordable pricing</div>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Award className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div>Premium Menu</div>
                    <div className="text-xs text-gray-500 hidden md:block">Gourmet, high-margin items</div>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div>Local Tastes</div>
                    <div className="text-xs text-gray-500 hidden md:block">City-specific dishes</div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Pricing Strategy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div>High Margin</div>
                    <div className="text-xs text-gray-500 hidden md:block">Lower footfall, higher profit</div>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div>Volume Based</div>
                    <div className="text-xs text-gray-500 hidden md:block">Lower price, higher footfall</div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Logistics & Business */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Logistics & Business
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Zap className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div>Quick Commerce</div>
                    <div className="text-xs text-gray-500 hidden md:block">30-min delivery fleet</div>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div>Franchise</div>
                    <div className="text-xs text-gray-500 hidden md:block">Licensing & passive income</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Operational Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Current Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Delivery Time Issues</p>
                      <p className="text-sm text-gray-600">Average delivery time: 35 minutes</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Address
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Staff Shortage</p>
                      <p className="text-sm text-gray-600">Peak hour understaffing</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Hire
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expansion Tab */}
        <TabsContent value="expansion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Expansion Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.id} className={`p-4 rounded-lg border ${milestone.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{milestone.title}</h3>
                      <p className="text-sm text-gray-600">{milestone.reward}</p>
                      <p className="text-xs text-gray-500">Required: ₹{milestone.requirement.toLocaleString()} profit</p>
                    </div>
                    <div className="text-right">
                      {milestone.unlocked ? (
                        <Badge className="bg-green-100 text-green-800">Unlocked</Badge>
                      ) : (
                        <Badge variant="outline">Locked</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Progress 
                      value={Math.min((totalProfit / milestone.requirement) * 100, 100)} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      ₹{totalProfit.toLocaleString()} / ₹{milestone.requirement.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FastFoodChainsPage;