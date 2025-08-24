import React, { useState, useMemo } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { 
  Search,
  Filter,
  Calculator,
  TrendingUp,
  Building2,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Home,
  Laptop,
  ShoppingCart,
  MapPin,
  Leaf,
  X,
  PlayCircle,
  Info
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
  timeHorizon: number;
  cashflowMonthly: number;
  status: 'available' | 'active' | 'completed' | 'pending';
}

const SimpleOpportunitiesSection: React.FC = () => {
  const { playerStats, financialData } = useWealthSprintGame();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('roi');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString()}`;
  };

  // Sector configuration
  const sectorConfig = {
    'fast_food': { icon: <Home className="w-5 h-5" />, label: 'Fast Food', color: 'bg-orange-100 text-orange-800' },
    'tech': { icon: <Laptop className="w-5 h-5" />, label: 'Technology', color: 'bg-blue-100 text-blue-800' },
    'healthcare': { icon: <Heart className="w-5 h-5" />, label: 'Healthcare', color: 'bg-green-100 text-green-800' },
    'ecommerce': { icon: <ShoppingCart className="w-5 h-5" />, label: 'E-commerce', color: 'bg-purple-100 text-purple-800' },
    'real_estate': { icon: <MapPin className="w-5 h-5" />, label: 'Real Estate', color: 'bg-gray-100 text-gray-800' },
    'renewable_energy': { icon: <Leaf className="w-5 h-5" />, label: 'Renewable Energy', color: 'bg-emerald-100 text-emerald-800' }
  };

  // Mock deals data
  const allDeals: Deal[] = useMemo(() => [
    {
      id: 'premium_restaurant',
      type: 'sector',
      sector: 'fast_food',
      title: 'Premium Restaurant Chain',
      description: 'Upscale dining expansion opportunity with modern presentation and affluent target market.',
      company: 'Gourmet Express Holdings',
      investmentRequired: 7500000,
      expectedROI: 28,
      riskLevel: 'medium',
      timeHorizon: 18,
      cashflowMonthly: 425000,
      status: 'available'
    },
    {
      id: 'ai_saas_platform',
      type: 'sector',
      sector: 'tech',
      title: 'AI-Powered SaaS Platform',
      description: 'Revolutionary AI platform automating business processes for SMEs with predictive analytics.',
      company: 'NeuralFlow Technologies',
      investmentRequired: 12000000,
      expectedROI: 45,
      riskLevel: 'high',
      timeHorizon: 36,
      cashflowMonthly: 180000,
      status: 'available'
    },
    {
      id: 'telemedicine_network',
      type: 'sector',
      sector: 'healthcare',
      title: 'Telemedicine Network',
      description: 'Digital healthcare platform connecting rural areas with specialist doctors and AI diagnosis.',
      company: 'HealthBridge Digital',
      investmentRequired: 9500000,
      expectedROI: 32,
      riskLevel: 'medium',
      timeHorizon: 24,
      cashflowMonthly: 315000,
      status: 'available'
    },
    {
      id: 'luxury_ecommerce',
      type: 'sector',
      sector: 'ecommerce',
      title: 'Luxury E-commerce Platform',
      description: 'Curated luxury marketplace with authenticated designer goods and AI styling recommendations.',
      company: 'LuxeVault Commerce',
      investmentRequired: 15000000,
      expectedROI: 38,
      riskLevel: 'high',
      timeHorizon: 30,
      cashflowMonthly: 225000,
      status: 'available'
    },
    {
      id: 'solar_energy_farms',
      type: 'sector',
      sector: 'renewable_energy',
      title: 'Solar Energy Farms',
      description: 'Large-scale solar installations with government backing and long-term power purchase agreements.',
      company: 'SunPower Industries',
      investmentRequired: 20000000,
      expectedROI: 25,
      riskLevel: 'low',
      timeHorizon: 48,
      cashflowMonthly: 350000,
      status: 'available'
    },
    {
      id: 'commercial_real_estate',
      type: 'sector',
      sector: 'real_estate',
      title: 'Commercial Real Estate',
      description: 'Prime office spaces in tier-1 cities with established tenants and stable rental income.',
      company: 'MetroSpaces Realty',
      investmentRequired: 25000000,
      expectedROI: 22,
      riskLevel: 'low',
      timeHorizon: 60,
      cashflowMonthly: 450000,
      status: 'available'
    }
  ], []);

  // Filter and sort deals
  const filteredAndSortedDeals = useMemo(() => {
    let filtered = allDeals.filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = filterRisk === 'all' || deal.riskLevel === filterRisk;
      return matchesSearch && matchesRisk;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'roi': return b.expectedROI - a.expectedROI;
        case 'investment': return a.investmentRequired - b.investmentRequired;
        case 'cashflow': return b.cashflowMonthly - a.cashflowMonthly;
        case 'timeline': return a.timeHorizon - b.timeHorizon;
        default: return 0;
      }
    });

    return filtered;
  }, [allDeals, searchTerm, sortBy, filterRisk]);

  // Get risk color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Deal Card Component
  const DealCard = ({ deal }: { deal: Deal }) => {
    const sectorInfo = deal.sector ? sectorConfig[deal.sector] : null;
    
    return (
      <Card 
        className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-blue-300"
        onClick={() => {
          setSelectedDeal(deal);
          setShowModal(true);
        }}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              {sectorInfo ? sectorInfo.icon : <Building2 className="w-5 h-5 text-gray-600" />}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{deal.title}</h3>
              <p className="text-gray-600 text-sm">{deal.company}</p>
            </div>
          </div>

          {/* Investment Amount */}
          <div className="text-center bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(deal.investmentRequired)}</div>
            <div className="text-sm text-gray-600">Investment Required</div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{deal.expectedROI}%</div>
              <div className="text-xs text-gray-600">ROI</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{formatCurrency(deal.cashflowMonthly)}</div>
              <div className="text-xs text-gray-600">Monthly</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">{deal.timeHorizon}m</div>
              <div className="text-xs text-gray-600">Timeline</div>
            </div>
          </div>

          {/* Risk Level */}
          <div className="flex justify-between items-center">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              View Details
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // Investment Modal
  const InvestmentModal = () => (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            {selectedDeal?.title}
          </DialogTitle>
        </DialogHeader>

        {selectedDeal && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div><span className="font-medium">Company:</span> {selectedDeal.company}</div>
                <div><span className="font-medium">Investment:</span> {formatCurrency(selectedDeal.investmentRequired)}</div>
                <div><span className="font-medium">Expected ROI:</span> {selectedDeal.expectedROI}%</div>
              </div>
              <div className="space-y-2">
                <div><span className="font-medium">Monthly Cashflow:</span> {formatCurrency(selectedDeal.cashflowMonthly)}</div>
                <div><span className="font-medium">Timeline:</span> {selectedDeal.timeHorizon} months</div>
                <div><span className="font-medium">Risk Level:</span> {selectedDeal.riskLevel}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-gray-700">{selectedDeal.description}</p>
            </div>

            {/* Financial Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3">Financial Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-blue-600">Annual Return (Expected)</div>
                  <div className="font-bold">{formatCurrency(selectedDeal.investmentRequired * (selectedDeal.expectedROI / 100))}</div>
                </div>
                <div>
                  <div className="text-blue-600">Annual Cashflow</div>
                  <div className="font-bold">{formatCurrency(selectedDeal.cashflowMonthly * 12)}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => {
                  alert(`Investment successful! You have invested ${formatCurrency(selectedDeal.investmentRequired)} in ${selectedDeal.title}`);
                  setShowModal(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Invest {formatCurrency(selectedDeal.investmentRequired)}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="px-6"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Investment Opportunities</h1>
        <p className="text-gray-600">Discover premium investment opportunities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-3 text-center">
          <div className="text-xl font-bold text-blue-600">{filteredAndSortedDeals.length}</div>
          <div className="text-sm text-gray-600">Available</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xl font-bold text-green-600">32.5%</div>
          <div className="text-sm text-gray-600">Avg ROI</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xl font-bold text-purple-600">{formatCurrency(287500)}</div>
          <div className="text-sm text-gray-600">Avg Cashflow</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xl font-bold text-orange-600">24</div>
          <div className="text-sm text-gray-600">Avg Months</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search deals or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roi">Expected ROI</SelectItem>
              <SelectItem value="investment">Investment Amount</SelectItem>
              <SelectItem value="cashflow">Monthly Cashflow</SelectItem>
              <SelectItem value="timeline">Timeline</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedDeals.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No deals found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modal */}
      <InvestmentModal />
    </div>
  );
};

export default SimpleOpportunitiesSection;