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
  const [emiDuration, setEmiDuration] = useState<'2' | '6' | '12' | '60' | 'full'>('6');
  const [rejectedDeals, setRejectedDeals] = useState<Set<string>>(new Set());

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

  // Get current credit card usage and limit
  const getCreditCardInfo = () => {
    const currentCreditUsed = financialData.liabilities.find(l => l.category === 'credit_card')?.outstandingAmount || 0;
    const creditLimit = 500000; // ₹5 lakh credit limit
    const availableCredit = creditLimit - currentCreditUsed;
    return { currentCreditUsed, creditLimit, availableCredit };
  };

  // Handle investment purchase
  const handlePurchase = (deal: Deal, isEMI: boolean = false) => {
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
      // Credit Card Purchase (EMI or Full Payment)
      const { availableCredit } = getCreditCardInfo();
      
      if (availableCredit < deal.investmentRequired) {
        toast.error(`Credit card limit insufficient. Available: ${formatCurrency(availableCredit)}, Required: ${formatCurrency(deal.investmentRequired)}`);
        return;
      }

      // Use credit card for the purchase
      const creditCardSuccess = useWealthSprintGame.getState().chargeToCredit?.(deal.investmentRequired, `Investment: ${deal.title}`);
      
      if (!creditCardSuccess) {
        toast.error('Credit card transaction failed. Please try again.');
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

      if (isEMI) {
        const months = parseInt(emiDuration);
        const monthlyRate = 0.035;
        const emiAmount = Math.ceil((deal.investmentRequired * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months)));
        toast.success(`Investment approved with EMI! ${formatCurrency(emiAmount)}/month for ${months} months`);
      } else {
        toast.success(`Investment of ${formatCurrency(deal.investmentRequired)} approved using Credit Card!`);
      }
    }
    
    setShowModal(false);
    setPaymentMethod('bank'); // Reset to default
    setEmiDuration('6'); // Reset to default
  };

  // Handle reject deal with slide animation
  const handleRejectDeal = (dealId: string) => {
    setRejectedDeals(prev => new Set(prev).add(dealId));
    setTimeout(() => {
      setRejectedDeals(prev => {
        const newSet = new Set(prev);
        newSet.delete(dealId);
        return newSet;
      });
    }, 500); // Remove from rejected list after animation
  };

  // Organized Deal Card Component
  const OrganizedCard = ({ deal }: { deal: Deal }) => {
    const sectorInfo = deal.sector ? sectorConfig[deal.sector] : null;
    const canAfford = financialData.bankBalance >= deal.investmentRequired;
    const isRejected = rejectedDeals.has(deal.id);
    
    return (
      <Card className={`bg-white border border-gray-200 hover:shadow-md transition-all duration-500 h-64 w-72 ${
        isRejected ? 'transform -translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
      }`}>
        <div className="p-4 h-full flex flex-col">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{sectorInfo?.icon || '💼'}</span>
              <div>
                <h3 className="font-semibold text-base text-gray-900 leading-tight">{deal.title}</h3>
                <span className="text-sm text-gray-500">{sectorInfo?.label}</span>
              </div>
            </div>
            <Badge className={`text-xs ${getRarityColor(deal.rarity)}`}>
              {deal.rarity}
            </Badge>
          </div>

          {/* Price & ROI Row */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-xl font-bold text-gray-900">{formatCurrency(deal.investmentRequired)}</div>
            <div className="text-sm text-blue-600 font-medium">{deal.expectedROI}% ROI</div>
          </div>

          {/* Income Badge */}
          <div className="bg-yellow-50 px-3 py-2 rounded text-center mb-3">
            <span className="text-sm text-yellow-800 font-medium">💰 {formatCurrency(deal.cashflowMonthly)}/mo</span>
          </div>

          {/* Abilities & Risks Row */}
          <div className="grid grid-cols-2 gap-3 mb-3 flex-1">
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2">⭐ Abilities</div>
              <div className="space-y-1">
                {deal.abilities.slice(0, 2).map((ability, index) => (
                  <Badge key={index} className="text-xs bg-green-100 text-green-800 block text-center py-1">
                    {ability}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2">⚠️ Risks</div>
              <div className="space-y-1">
                {deal.risks.slice(0, 2).map((risk, index) => (
                  <Badge key={index} className="text-xs bg-red-100 text-red-800 block text-center py-1">
                    {risk}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Details Row */}
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>Income: {formatCurrency(deal.monthlyIncome)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings className="w-4 h-4 text-red-600" />
              <span>Cost: {formatCurrency(deal.maintenanceCost)}</span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-2">
            <Button
              onClick={() => handleRejectDeal(deal.id)}
              className="bg-red-500 hover:bg-red-600 text-white h-9 text-sm px-4"
            >
              Reject
            </Button>
            <Button
              onClick={() => {
                setSelectedDeal(deal);
                setShowModal(true);
              }}
              className={`flex-1 h-9 text-sm ${canAfford 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!canAfford}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {canAfford ? 'Purchase' : 'Insufficient Funds'}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // Compact Investment Modal with Payment Options
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

    const { availableCredit, creditLimit, currentCreditUsed } = getCreditCardInfo();
    const canUseCredit = availableCredit >= (selectedDeal?.investmentRequired || 0);

    return (
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              {selectedDeal?.title}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Confirm your investment details
            </DialogDescription>
          </DialogHeader>

          {selectedDeal && (
            <div className="space-y-2">
              {/* Investment Summary - Ultra Compact */}
              <div className="bg-blue-50 p-2 rounded">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-blue-600 font-medium">Investment Amount</div>
                    <div className="text-sm font-bold">{formatCurrency(selectedDeal.investmentRequired)}</div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-medium">Expected ROI</div>
                    <div className="text-sm font-bold text-green-600">{selectedDeal.expectedROI}%</div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-medium">Monthly Cashflow</div>
                    <div className="text-sm font-bold">{formatCurrency(selectedDeal.cashflowMonthly)}</div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-medium">Timeline</div>
                    <div className="text-sm font-bold">{selectedDeal.timeHorizon} months</div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white border border-gray-200 p-2 rounded">
                <div className="text-xs font-semibold text-gray-700 mb-1">Payment Method</div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'bank')}
                      className="text-blue-600"
                    />
                    <span className="text-xs">Bank Account (Full Payment)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'credit_card')}
                      className="text-blue-600"
                      disabled={!canUseCredit}
                    />
                    <span className={`text-xs ${!canUseCredit ? 'text-gray-400' : ''}`}>
                      Credit Card {!canUseCredit ? '(Insufficient Limit)' : '(EMI Available)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Credit Card Info */}
              {paymentMethod === 'credit_card' && (
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-600 mb-1">Credit Card Limit:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Available:</span>
                      <span className={`font-bold ml-1 ${canUseCredit ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(availableCredit)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Used:</span>
                      <span className="font-bold ml-1 text-gray-700">{formatCurrency(currentCreditUsed)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* EMI Duration (Only for Credit Card) */}
              {paymentMethod === 'credit_card' && canUseCredit && (
                <div className="bg-white border border-gray-200 p-2 rounded">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Payment Type</div>
                  <select
                    value={emiDuration}
                    onChange={(e) => setEmiDuration(e.target.value as '2' | '6' | '12' | '60' | 'full')}
                    className="w-full p-1 border border-gray-300 rounded text-xs"
                  >
                    <option value="full">Full Payment (No EMI)</option>
                    {emiDurationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} - EMI: {formatCurrency(calculateEMI(selectedDeal.investmentRequired, option.months))}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    Interest Rate: 3.5% per month (EMI only)
                  </div>
                </div>
              )}

              {/* Current Balance */}
              <div className="bg-gray-50 p-2 rounded">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Bank Balance:</span>
                    <div className="font-bold">{formatCurrency(financialData.bankBalance)}</div>
                  </div>
                  {paymentMethod === 'bank' && (
                    <div>
                      <span className="text-gray-600">After Investment:</span>
                      <div className={`font-bold ${financialData.bankBalance - selectedDeal.investmentRequired >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(financialData.bankBalance - selectedDeal.investmentRequired)}
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'credit_card' && emiDuration !== 'full' && (
                    <div>
                      <span className="text-gray-600">Monthly EMI:</span>
                      <div className="font-bold text-orange-600">
                        {formatCurrency(calculateEMI(selectedDeal.investmentRequired, parseInt(emiDuration as string)))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Risk Warning */}
              <div className="bg-yellow-50 p-1 rounded border border-yellow-200">
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-800">Risk: {selectedDeal.riskLevel}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <Button
                  onClick={() => handlePurchase(selectedDeal, emiDuration !== 'full')}
                  className="flex-1 bg-green-600 hover:bg-green-700 h-8 text-xs"
                  disabled={
                    (paymentMethod === 'bank' && financialData.bankBalance < selectedDeal.investmentRequired) ||
                    (paymentMethod === 'credit_card' && !canUseCredit)
                  }
                >
                  <PlayCircle className="w-3 h-3 mr-1" />
                  {paymentMethod === 'bank' ? 'Pay Full Amount' : 
                   emiDuration === 'full' ? 'Pay Full (Credit)' : 'Start EMI'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="px-3 h-8 text-xs"
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
      {/* Organized Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allDeals.map((deal) => (
          <OrganizedCard key={deal.id} deal={deal} />
        ))}
      </div>

      {/* Modal */}
      <InvestmentModal />
    </div>
  );
};

export default SimpleOpportunitiesSection;