import React, { useState, useMemo } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
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
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'credit_card'>('bank');
  const [emiDuration, setEmiDuration] = useState<'2' | '6' | '12' | '60'>('6');

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
    if (paymentMethod === 'bank') {
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

      toast.success(`Successfully invested ${formatCurrency(deal.investmentRequired)} in ${deal.title} using Bank Account!`);
    } else {
      // Credit Card EMI Purchase
      const months = parseInt(emiDuration);
      const monthlyRate = 0.035;
      const emiAmount = Math.ceil((deal.investmentRequired * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months)));
      
      // Use credit card for the purchase
      const creditCardSuccess = useWealthSprintGame.getState().chargeToCredit?.(deal.investmentRequired, `Investment: ${deal.title}`);
      
      if (!creditCardSuccess) {
        toast.error('Credit card limit exceeded. Please try a smaller amount or use bank payment.');
        return;
      }

      // Add investment to portfolio
      useWealthSprintGame.setState((state) => ({
        financialData: {
          ...state.financialData,
          investments: {
            ...state.financialData.investments,
            realEstate: state.financialData.investments.realEstate + deal.investmentRequired
          }
        }
      }));

      toast.success(`Investment of ${formatCurrency(deal.investmentRequired)} approved! EMI: ${formatCurrency(emiAmount)}/month for ${months} months`);
    }
    
    setShowModal(false);
    setPaymentMethod('bank'); // Reset to default
    setEmiDuration('6'); // Reset to default
  };

  // Compact Deal Card Component
  const CompactCard = ({ deal }: { deal: Deal }) => {
    const sectorInfo = deal.sector ? sectorConfig[deal.sector] : null;
    const canAfford = financialData.bankBalance >= deal.investmentRequired;
    
    return (
      <Card className="bg-white border border-gray-200 hover:shadow-md transition-all h-48 w-80">
        <div className="p-3 h-full flex flex-col">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{sectorInfo?.icon || '💼'}</span>
              <div>
                <h3 className="font-semibold text-sm text-gray-900 leading-tight">{deal.title}</h3>
                <span className="text-xs text-gray-500">{sectorInfo?.label}</span>
              </div>
            </div>
            <Badge className={`text-xs ${getRarityColor(deal.rarity)}`}>
              {deal.rarity}
            </Badge>
          </div>

          {/* Price & ROI Row */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-bold text-gray-900">{formatCurrency(deal.investmentRequired)}</div>
            <div className="text-xs text-blue-600 font-medium">{deal.expectedROI}% ROI</div>
          </div>

          {/* Income Badge */}
          <div className="bg-yellow-50 px-2 py-1 rounded text-center mb-2">
            <span className="text-xs text-yellow-800 font-medium">💰 {formatCurrency(deal.cashflowMonthly)}/mo</span>
          </div>

          {/* Abilities & Risks Row */}
          <div className="grid grid-cols-2 gap-2 mb-2 flex-1">
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-1">⭐ Abilities</div>
              <div className="space-y-1">
                {deal.abilities.slice(0, 2).map((ability, index) => (
                  <Badge key={index} className="text-xs bg-green-100 text-green-800 block">
                    {ability}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-1">⚠️ Risks</div>
              <div className="space-y-1">
                {deal.risks.slice(0, 2).map((risk, index) => (
                  <Badge key={index} className="text-xs bg-red-100 text-red-800 block">
                    {risk}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Details Row */}
          <div className="grid grid-cols-2 gap-1 text-xs mb-2">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span>{formatCurrency(deal.monthlyIncome)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings className="w-3 h-3 text-red-600" />
              <span>{formatCurrency(deal.maintenanceCost)}</span>
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            onClick={() => {
              setSelectedDeal(deal);
              setShowModal(true);
            }}
            className={`w-full h-8 text-xs ${canAfford 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canAfford}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            {canAfford ? 'Purchase' : 'Insufficient Funds'}
          </Button>
        </div>
      </Card>
    );
  };

  // Enhanced Investment Modal with Payment Options
  const InvestmentModal = () => {
    const calculateEMI = (amount: number, months: number) => {
      const monthlyRate = 0.035; // 3.5% monthly for credit card
      return Math.ceil((amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months)));
    };

    const emiDurationOptions = [
      { value: '2', label: '2 months', months: 2 },
      { value: '6', label: '6 months', months: 6 },
      { value: '12', label: '1 year', months: 12 },
      { value: '60', label: '5 years', months: 60 }
    ];

    return (
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              {selectedDeal?.title}
            </DialogTitle>
            <DialogDescription>
              Confirm your investment details
            </DialogDescription>
          </DialogHeader>

          {selectedDeal && (
            <div className="space-y-3">
              {/* Investment Summary - Compact */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-blue-600 font-medium text-xs">Investment Amount</div>
                    <div className="text-base font-bold">{formatCurrency(selectedDeal.investmentRequired)}</div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-medium text-xs">Expected ROI</div>
                    <div className="text-base font-bold text-green-600">{selectedDeal.expectedROI}%</div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-medium text-xs">Monthly Cashflow</div>
                    <div className="text-base font-bold">{formatCurrency(selectedDeal.cashflowMonthly)}</div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-medium text-xs">Timeline</div>
                    <div className="text-base font-bold">{selectedDeal.timeHorizon} months</div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white border border-gray-200 p-3 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-2">Payment Method</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'bank')}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Bank Account (Full Payment)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'credit_card')}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Credit Card (EMI Available)</span>
                  </label>
                </div>
              </div>

              {/* EMI Duration (Only for Credit Card) */}
              {paymentMethod === 'credit_card' && (
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-gray-700 mb-2">EMI Duration</div>
                  <select
                    value={emiDuration}
                    onChange={(e) => setEmiDuration(e.target.value as '2' | '6' | '12' | '60')}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    {emiDurationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} - EMI: {formatCurrency(calculateEMI(selectedDeal.investmentRequired, option.months))}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    Interest Rate: 3.5% per month
                  </div>
                </div>
              )}

              {/* Current Balance */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Current Bank Balance:</span>
                  <span className="font-bold">{formatCurrency(financialData.bankBalance)}</span>
                </div>
                {paymentMethod === 'bank' && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">After Investment:</span>
                    <span className={`font-bold ${financialData.bankBalance - selectedDeal.investmentRequired >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(financialData.bankBalance - selectedDeal.investmentRequired)}
                    </span>
                  </div>
                )}
                {paymentMethod === 'credit_card' && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Monthly EMI:</span>
                    <span className="font-bold text-orange-600">
                      {formatCurrency(calculateEMI(selectedDeal.investmentRequired, parseInt(emiDuration)))}
                    </span>
                  </div>
                )}
              </div>

              {/* Risk Warning */}
              <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-800">Risk: {selectedDeal.riskLevel}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handlePurchase(selectedDeal)}
                  className="flex-1 bg-green-600 hover:bg-green-700 h-9 text-sm"
                  disabled={paymentMethod === 'bank' && financialData.bankBalance < selectedDeal.investmentRequired}
                >
                  <PlayCircle className="w-3 h-3 mr-1" />
                  {paymentMethod === 'bank' ? 'Pay Full Amount' : 'Start EMI'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="px-4 h-9 text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6 p-4">
      {/* Compact Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allDeals.map((deal) => (
          <CompactCard key={deal.id} deal={deal} />
        ))}
      </div>

      {/* Modal */}
      <InvestmentModal />
    </div>
  );
};

export default SimpleOpportunitiesSection;