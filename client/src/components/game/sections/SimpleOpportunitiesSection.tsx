import React, { useState, useMemo } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { 
  Building2,
  Heart,
  Home,
  Laptop,
  ShoppingCart,
  MapPin,
  Leaf,
  PlayCircle,
  Settings,
  TrendingUp,
  DollarSign,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

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
  abilities: string[];
  risks: string[];
  monthlyIncome: number;
  maintenanceCost: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const SimpleOpportunitiesSection: React.FC = () => {
  const { playerStats, financialData, addTransaction } = useWealthSprintGame();
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
    'fast_food': { icon: '☕', label: 'Fast Food', color: 'bg-orange-100 text-orange-800' },
    'tech': { icon: '💻', label: 'Technology', color: 'bg-blue-100 text-blue-800' },
    'healthcare': { icon: '🏥', label: 'Healthcare', color: 'bg-green-100 text-green-800' },
    'ecommerce': { icon: '🛒', label: 'E-commerce', color: 'bg-purple-100 text-purple-800' },
    'real_estate': { icon: '🏢', label: 'Real Estate', color: 'bg-gray-100 text-gray-800' },
    'renewable_energy': { icon: '🌱', label: 'Renewable Energy', color: 'bg-emerald-100 text-emerald-800' }
  };

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get risk color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock deals data (store-style)
  const allDeals: Deal[] = useMemo(() => [
    {
      id: 'ai_saas_platform',
      type: 'sector',
      sector: 'tech',
      title: 'AI SaaS Platform',
      description: 'Revolutionary AI platform automating business processes for SMEs.',
      company: 'NeuralFlow Technologies',
      investmentRequired: 12000000,
      expectedROI: 45,
      riskLevel: 'high',
      timeHorizon: 36,
      cashflowMonthly: 180000,
      monthlyIncome: 250000,
      maintenanceCost: 50000,
      status: 'available',
      rarity: 'epic',
      abilities: ['AI-powered automation', 'Predictive analytics', 'Scalable architecture'],
      risks: ['High competition', 'Technology disruption', 'Market volatility']
    },
    {
      id: 'premium_restaurant',
      type: 'sector',
      sector: 'fast_food',
      title: 'Premium Restaurant Chain',
      description: 'Upscale dining expansion with modern presentation.',
      company: 'Gourmet Express Holdings',
      investmentRequired: 7500000,
      expectedROI: 28,
      riskLevel: 'medium',
      timeHorizon: 18,
      cashflowMonthly: 425000,
      monthlyIncome: 180000,
      maintenanceCost: 80000,
      status: 'available',
      rarity: 'rare',
      abilities: ['Premium brand recognition', 'High customer loyalty', 'Franchise opportunities'],
      risks: ['Economic downturns', 'Food safety regulations', 'Seasonal fluctuations']
    },
    {
      id: 'telemedicine_network',
      type: 'sector',
      sector: 'healthcare',
      title: 'Telemedicine Network',
      description: 'Digital healthcare platform connecting rural areas with specialists.',
      company: 'HealthBridge Digital',
      investmentRequired: 9500000,
      expectedROI: 32,
      riskLevel: 'medium',
      timeHorizon: 24,
      cashflowMonthly: 315000,
      monthlyIncome: 220000,
      maintenanceCost: 60000,
      status: 'available',
      rarity: 'rare',
      abilities: ['Government partnerships', 'Rural market penetration', 'AI diagnosis integration'],
      risks: ['Regulatory changes', 'Technology adoption barriers', 'Data privacy concerns']
    },
    {
      id: 'luxury_ecommerce',
      type: 'sector',
      sector: 'ecommerce',
      title: 'Luxury E-commerce Platform',
      description: 'Curated luxury marketplace with authenticated designer goods.',
      company: 'LuxeVault Commerce',
      investmentRequired: 15000000,
      expectedROI: 38,
      riskLevel: 'high',
      timeHorizon: 30,
      cashflowMonthly: 225000,
      monthlyIncome: 320000,
      maintenanceCost: 90000,
      status: 'available',
      rarity: 'legendary',
      abilities: ['Luxury brand partnerships', 'Authentication technology', 'High-end customer base'],
      risks: ['Counterfeit challenges', 'Economic sensitivity', 'Brand reputation risks']
    },
    {
      id: 'solar_energy_farms',
      type: 'sector',
      sector: 'renewable_energy',
      title: 'Solar Energy Farms',
      description: 'Large-scale solar installations with government backing.',
      company: 'SunPower Industries',
      investmentRequired: 20000000,
      expectedROI: 25,
      riskLevel: 'low',
      timeHorizon: 48,
      cashflowMonthly: 350000,
      monthlyIncome: 400000,
      maintenanceCost: 70000,
      status: 'available',
      rarity: 'epic',
      abilities: ['Government subsidies', 'Long-term contracts', 'Environmental benefits'],
      risks: ['Weather dependency', 'Policy changes', 'Technology obsolescence']
    },
    {
      id: 'commercial_real_estate',
      type: 'sector',
      sector: 'real_estate',
      title: 'Commercial Real Estate',
      description: 'Prime office spaces in tier-1 cities with established tenants.',
      company: 'MetroSpaces Realty',
      investmentRequired: 25000000,
      expectedROI: 22,
      riskLevel: 'low',
      timeHorizon: 60,
      cashflowMonthly: 450000,
      monthlyIncome: 500000,
      maintenanceCost: 100000,
      status: 'available',
      rarity: 'rare',
      abilities: ['Prime locations', 'Stable rental income', 'Property appreciation'],
      risks: ['Market downturns', 'Tenant defaults', 'Maintenance costs']
    }
  ], []);

  // Handle investment purchase
  const handlePurchase = (deal: Deal) => {
    const canAfford = financialData.bankBalance >= deal.investmentRequired;
    
    if (!canAfford) {
      toast.error(`Insufficient funds. You need ${formatCurrency(deal.investmentRequired)} but only have ${formatCurrency(financialData.bankBalance)}`);
      return;
    }

    // Update bank balance by deducting investment amount
    useWealthSprintGame.setState((state) => ({
      financialData: {
        ...state.financialData,
        bankBalance: state.financialData.bankBalance - deal.investmentRequired,
        investments: {
          ...state.financialData.investments,
          realEstate: state.financialData.investments.realEstate + deal.investmentRequired
        }
      }
    }));
    
    // Add transaction record
    addTransaction({
      type: 'investment',
      amount: -deal.investmentRequired,
      description: `Investment: ${deal.title}`,
      fromAccount: 'bank',
      toAccount: 'business'
    });

    toast.success(`Successfully invested ${formatCurrency(deal.investmentRequired)} in ${deal.title}!`);
    setShowModal(false);
  };

  // Store-style Deal Card Component
  const StoreStyleCard = ({ deal }: { deal: Deal }) => {
    const sectorInfo = deal.sector ? sectorConfig[deal.sector] : null;
    const canAfford = financialData.bankBalance >= deal.investmentRequired;
    
    return (
      <Card className="p-4 bg-white border border-gray-200 hover:shadow-lg transition-all">
        <div className="space-y-4">
          {/* Header with Icon and Title */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {sectorInfo?.icon || '💼'}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{deal.title}</h3>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                {sectorInfo?.label}
                {sectorInfo && (
                  <Badge className={`text-xs ${sectorInfo.color}`}>
                    {sectorInfo.label}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Investment Amount */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(deal.investmentRequired)}</div>
            <div className="text-sm text-blue-600 font-medium">{deal.expectedROI}% Annual ROI</div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">{deal.description}</p>

          {/* Rarity Badge */}
          <div className="flex justify-center">
            <Badge className={`text-xs ${getRarityColor(deal.rarity)} capitalize`}>
              {deal.rarity}
            </Badge>
          </div>

          {/* Bonus Income */}
          <div className="bg-yellow-50 p-2 rounded text-center">
            <div className="text-xs text-yellow-800 font-medium">
              💰 {formatCurrency(deal.cashflowMonthly)}/mo
            </div>
          </div>

          {/* Abilities */}
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1">⭐ Abilities:</div>
            <div className="flex flex-wrap gap-1">
              {deal.abilities.slice(0, 3).map((ability, index) => (
                <Badge key={index} className="text-xs bg-green-100 text-green-800">
                  {ability}
                </Badge>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1">⚠️ Risks:</div>
            <div className="flex flex-wrap gap-1">
              {deal.risks.slice(0, 2).map((risk, index) => (
                <Badge key={index} className="text-xs bg-red-100 text-red-800">
                  {risk}
                </Badge>
              ))}
              {deal.risks.length > 2 && (
                <Badge className="text-xs bg-red-100 text-red-800">
                  +{deal.risks.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          {/* Financial Details */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span>Income: {formatCurrency(deal.monthlyIncome)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings className="w-3 h-3 text-red-600" />
              <span>Maintenance: {formatCurrency(deal.maintenanceCost)}</span>
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            onClick={() => {
              setSelectedDeal(deal);
              setShowModal(true);
            }}
            className={`w-full ${canAfford 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canAfford}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {canAfford ? 'Purchase' : 'Insufficient Funds'}
          </Button>

          {/* Settings Icon */}
          <div className="absolute top-2 right-2">
            <Settings className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </Card>
    );
  };

  // Investment Modal
  const InvestmentModal = () => (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            {selectedDeal?.title}
          </DialogTitle>
          <DialogDescription>
            Confirm your investment details
          </DialogDescription>
        </DialogHeader>

        {selectedDeal && (
          <div className="space-y-4">
            {/* Investment Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-blue-600 font-medium">Investment Amount</div>
                  <div className="text-lg font-bold">{formatCurrency(selectedDeal.investmentRequired)}</div>
                </div>
                <div>
                  <div className="text-blue-600 font-medium">Expected Annual ROI</div>
                  <div className="text-lg font-bold text-green-600">{selectedDeal.expectedROI}%</div>
                </div>
                <div>
                  <div className="text-blue-600 font-medium">Monthly Cashflow</div>
                  <div className="text-lg font-bold">{formatCurrency(selectedDeal.cashflowMonthly)}</div>
                </div>
                <div>
                  <div className="text-blue-600 font-medium">Timeline</div>
                  <div className="text-lg font-bold">{selectedDeal.timeHorizon} months</div>
                </div>
              </div>
            </div>

            {/* Current Balance */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Bank Balance:</span>
                <span className="font-bold">{formatCurrency(financialData.bankBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">After Investment:</span>
                <span className={`font-bold ${financialData.bankBalance - selectedDeal.investmentRequired >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(financialData.bankBalance - selectedDeal.investmentRequired)}
                </span>
              </div>
            </div>

            {/* Risk Warning */}
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Investment Risk: {selectedDeal.riskLevel}</span>
              </div>
              <p className="text-xs text-yellow-700">
                All investments carry risk. Expected returns are not guaranteed and actual performance may vary.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => handlePurchase(selectedDeal)}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={financialData.bankBalance < selectedDeal.investmentRequired}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Confirm Investment
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
      {/* Simple Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allDeals.map((deal) => (
          <StoreStyleCard key={deal.id} deal={deal} />
        ))}
      </div>

      {/* Modal */}
      <InvestmentModal />
    </div>
  );
};

export default SimpleOpportunitiesSection;