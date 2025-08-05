import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  AlertTriangle
} from 'lucide-react';

interface FastFoodChainsPageProps {
  onBack: () => void;
}

interface BusinessModel {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  cost: number;
  active: boolean;
  monthlyRevenue: number;
  monthlyExpenses: number;
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
  
  const [businessModels, setBusinessModels] = useState<BusinessModel[]>([
    {
      id: 'dine_in',
      name: 'Local Dine-in Restaurant',
      icon: <Store className="h-5 w-5" />,
      description: 'Traditional restaurant with seating',
      cost: 150000,
      active: true,
      monthlyRevenue: 85000,
      monthlyExpenses: 65000
    },
    {
      id: 'cloud_kitchen',
      name: 'Cloud Kitchen',
      icon: <ChefHat className="h-5 w-5" />,
      description: 'Delivery-only kitchen operations',
      cost: 80000,
      active: false,
      monthlyRevenue: 120000,
      monthlyExpenses: 75000
    },
    {
      id: 'delivery_platform',
      name: 'Delivery Platform',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'App platform for partner restaurants',
      cost: 300000,
      active: false,
      monthlyRevenue: 200000,
      monthlyExpenses: 120000
    },
    {
      id: 'franchise',
      name: 'Franchise Model',
      icon: <Building2 className="h-5 w-5" />,
      description: 'Scale through franchise partnerships',
      cost: 500000,
      active: false,
      monthlyRevenue: 350000,
      monthlyExpenses: 180000
    }
  ]);

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

  const currentMetrics = {
    totalRevenue: businessModels.filter(m => m.active).reduce((sum, m) => sum + m.monthlyRevenue, 0),
    totalExpenses: businessModels.filter(m => m.active).reduce((sum, m) => sum + m.monthlyExpenses, 0),
    netProfit: businessModels.filter(m => m.active).reduce((sum, m) => sum + (m.monthlyRevenue - m.monthlyExpenses), 0),
    activeCities: businessModels.filter(m => m.active).length,
    customerRating: 4.2,
    activeModels: businessModels.filter(m => m.active).length
  };

  const activateModel = (modelId: string) => {
    setBusinessModels(prev => 
      prev.map(model => 
        model.id === modelId ? { ...model, active: true } : model
      )
    );
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
          Back to Business
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-red-500 text-white">
            🍟
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fast Food Chains</h1>
            <p className="text-gray-600">Build your food empire across multiple business models</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-green-700">Monthly Revenue</p>
                <p className="text-lg font-bold text-green-800">₹{currentMetrics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-700">Net Profit</p>
                <p className="text-lg font-bold text-blue-800">₹{currentMetrics.netProfit.toLocaleString()}</p>
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
                <p className="text-lg font-bold text-purple-800">★ {currentMetrics.customerRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-orange-700">Active Cities</p>
                <p className="text-lg font-bold text-orange-800">{currentMetrics.activeCities}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-white">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Business Models</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="expansion">Expansion</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Active Models */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Active Business Models
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {businessModels.filter(m => m.active).map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {model.icon}
                      <div>
                        <p className="font-medium">{model.name}</p>
                        <p className="text-sm text-gray-600">₹{(model.monthlyRevenue - model.monthlyExpenses).toLocaleString()}/month profit</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                ))}
                {businessModels.filter(m => m.active).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No active business models</p>
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

        {/* Business Models Tab */}
        <TabsContent value="models" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {businessModels.map((model) => (
              <Card key={model.id} className={`${model.active ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {model.icon}
                      {model.name}
                    </div>
                    {model.active ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{model.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Setup Cost:</span>
                      <span className="font-medium">₹{model.cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Revenue:</span>
                      <span className="font-medium text-green-600">₹{model.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Expenses:</span>
                      <span className="font-medium text-red-600">₹{model.monthlyExpenses.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold">
                      <span>Net Profit:</span>
                      <span className="text-green-600">₹{(model.monthlyRevenue - model.monthlyExpenses).toLocaleString()}</span>
                    </div>
                  </div>

                  {!model.active && (
                    <Button 
                      onClick={() => activateModel(model.id)}
                      className="w-full bg-red-500 hover:bg-red-600"
                    >
                      Activate Model - ₹{model.cost.toLocaleString()}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Menu Engineering */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  Menu Engineering
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Standard Menu
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  Premium Menu
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Local Tastes
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
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  High Margin
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Volume Based
                </Button>
              </CardContent>
            </Card>

            {/* Logistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Logistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  In-house Fleet
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Third-party Partners
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