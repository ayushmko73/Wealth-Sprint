import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Smartphone, 
  Code, 
  Rocket,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Cpu,
  Cloud,
  Database,
  Zap,
  Target,
  Globe
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { toast } from 'sonner';

interface TechStartupsPageProps {
  onBack: () => void;
}

interface TechProduct {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  marketPotential: string;
  active: boolean;
}

interface TechStack {
  id: string;
  name: string;
  description: string;
  cost: number;
  performance: string;
  scalability: string;
  active: boolean;
}

interface ScalingStrategy {
  id: string;
  name: string;
  description: string;
  cost: number;
  growthRate: string;
  riskLevel: string;
  active: boolean;
}

const TechStartupsPageNew: React.FC<TechStartupsPageProps> = ({ onBack }) => {
  const { financialData } = useWealthSprintGame();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [companyName] = useState('TechVenture Labs');
  const [developmentProgress] = useState(65);
  
  // Tech products
  const [techProducts, setTechProducts] = useState<TechProduct[]>([
    {
      id: 'mobile_app',
      name: 'Mobile App Platform',
      description: 'Cross-platform mobile application development',
      cost: 400000,
      category: 'Mobile',
      marketPotential: 'High',
      active: false
    },
    {
      id: 'ai_saas',
      name: 'AI SaaS Solution',
      description: 'Machine learning powered business intelligence',
      cost: 600000,
      category: 'AI/ML',
      marketPotential: 'Very High',
      active: false
    },
    {
      id: 'blockchain',
      name: 'Blockchain Platform',
      description: 'Decentralized application infrastructure',
      cost: 800000,
      category: 'Blockchain',
      marketPotential: 'High',
      active: false
    }
  ]);

  // Tech stacks
  const [techStacks, setTechStacks] = useState<TechStack[]>([
    {
      id: 'cloud_native',
      name: 'Cloud-Native Stack',
      description: 'Kubernetes, Docker, microservices architecture',
      cost: 300000,
      performance: 'High',
      scalability: 'Excellent',
      active: false
    },
    {
      id: 'serverless',
      name: 'Serverless Architecture',
      description: 'AWS Lambda, Vercel, auto-scaling infrastructure',
      cost: 250000,
      performance: 'Medium',
      scalability: 'Auto',
      active: false
    }
  ]);

  // Scaling strategies
  const [scalingStrategies, setScalingStrategies] = useState<ScalingStrategy[]>([
    {
      id: 'rapid_growth',
      name: 'Rapid Growth Model',
      description: 'Aggressive market penetration with heavy investment',
      cost: 500000,
      growthRate: 'Very High',
      riskLevel: 'High',
      active: false
    },
    {
      id: 'sustainable',
      name: 'Sustainable Growth',
      description: 'Steady growth with focus on profitability',
      cost: 300000,
      growthRate: 'Medium',
      riskLevel: 'Low',
      active: false
    }
  ]);

  const activeProducts = techProducts.filter(p => p.active);
  const activeStacks = techStacks.filter(s => s.active);
  const finalRevenue = 80000 + (activeProducts.length * 25000) + (activeStacks.length * 15000);

  const checkFunds = (amount: number) => {
    if (financialData.bankBalance < amount) {
      toast.error(`Insufficient funds! Need ₹${amount.toLocaleString()}`);
      return false;
    }
    return true;
  };

  const launchProduct = (productId: string) => {
    const product = techProducts.find(p => p.id === productId);
    if (!product) return;

    if (!checkFunds(product.cost)) return;

    const { investInBusinessSector } = useWealthSprintGame.getState();
    
    const success = investInBusinessSector('tech_startups', 'Tech Startups', `Launched ${product.name}`, product.cost);
    
    if (success) {
      setTechProducts(prev => 
        prev.map(p => 
          p.id === productId ? { ...p, active: true } : p
        )
      );
      toast.success(`🚀 ${product.name} launched successfully!`);
    }
  };

  const implementStack = (stackId: string) => {
    const stack = techStacks.find(s => s.id === stackId);
    if (!stack) return;

    if (!checkFunds(stack.cost)) return;

    const { investInBusinessSector } = useWealthSprintGame.getState();
    
    const success = investInBusinessSector('tech_startups', 'Tech Startups', `Implemented ${stack.name}`, stack.cost);
    
    if (success) {
      setTechStacks(prev => 
        prev.map(s => 
          s.id === stackId ? { ...s, active: true } : s
        )
      );
      toast.success(`⚡ ${stack.name} implemented!`);
    }
  };

  const activateStrategy = (strategyId: string) => {
    const strategy = scalingStrategies.find(s => s.id === strategyId);
    if (!strategy) return;

    if (!checkFunds(strategy.cost)) return;

    const { investInBusinessSector } = useWealthSprintGame.getState();
    
    const success = investInBusinessSector('tech_startups', 'Tech Startups', `Activated ${strategy.name}`, strategy.cost);
    
    if (success) {
      setScalingStrategies(prev => 
        prev.map(s => ({ ...s, active: s.id === strategyId }))
      );
      toast.success(`📈 ${strategy.name} activated!`);
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
                <div className="text-2xl">💻</div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{companyName}</h1>
                <p className="text-blue-200 text-sm">Tech Startup Management • Build innovative solutions</p>
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
                <div className="text-blue-200 text-xs">Active Products</div>
                <div className="text-white font-bold text-lg">{activeProducts.length}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Tech Stacks</div>
                <div className="text-green-300 font-bold text-lg">{activeStacks.length}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Development</div>
                <div className="text-yellow-300 font-bold text-lg">{developmentProgress}%</div>
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
                { id: 'products', label: 'Products', icon: Rocket },
                { id: 'tech_stack', label: 'Tech Stack', icon: Code },
                { id: 'scaling', label: 'Scaling', icon: TrendingUp }
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
                  <Rocket className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700">Products</p>
                    <p className="text-lg font-bold text-green-800">{activeProducts.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-700">Tech Stack</p>
                    <p className="text-lg font-bold text-purple-800">{activeStacks.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-orange-700">Development</p>
                    <p className="text-lg font-bold text-orange-800">{developmentProgress}%</p>
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
              <Rocket className="w-5 h-5 text-blue-600" />
              Product Development ({activeProducts.length} launched)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {techProducts.map((product) => (
                <Card key={product.id} className={`border transition-all hover:shadow-lg ${product.active ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      {product.active && <Badge className="bg-green-600 text-white text-xs">Active</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Potential:</span>
                        <span className="font-medium text-green-600">{product.marketPotential}</span>
                      </div>
                    </div>
                    {!product.active && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Development Cost:</span>
                          <span className="font-bold text-blue-600">₹{product.cost.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => launchProduct(product.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={financialData.bankBalance < product.cost}
                        >
                          <Rocket className="w-4 h-4 mr-2" />
                          Launch Product
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Tab */}
        {activeTab === 'tech_stack' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              Technology Stack ({activeStacks.length} implemented)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {techStacks.map((stack) => (
                <Card key={stack.id} className={`border transition-all hover:shadow-lg ${stack.active ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{stack.name}</h4>
                      {stack.active && <Badge className="bg-green-600 text-white text-xs">Active</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{stack.description}</p>
                    {!stack.active && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Implementation Cost:</span>
                          <span className="font-bold text-blue-600">₹{stack.cost.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => implementStack(stack.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={financialData.bankBalance < stack.cost}
                        >
                          <Code className="w-4 h-4 mr-2" />
                          Implement Stack
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Scaling Tab */}
        {activeTab === 'scaling' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Scaling Strategies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scalingStrategies.map((strategy) => (
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
                          <span className="text-sm font-medium">Investment Cost:</span>
                          <span className="font-bold text-blue-600">₹{strategy.cost.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => activateStrategy(strategy.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={financialData.bankBalance < strategy.cost}
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Activate Strategy
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

export default TechStartupsPageNew;