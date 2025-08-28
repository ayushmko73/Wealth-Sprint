import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { useStore } from '../../../lib/stores/useStore';
import { formatMoney } from '../../../lib/utils/formatMoney';
import { storeItems, getCategories, getCategoryStats } from '../../../lib/data/storeItems';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  ShoppingBag, 
  Home, 
  Car, 
  Building2, 
  Smartphone,
  TrendingUp,
  Gamepad2,
  CheckCircle,
  DollarSign,
  Star,
  X,
  Coins,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Target,
  Crown,
  Gem,
  Laptop,
  Coffee,
  Truck,
  Bike,
  Joystick,
  Sun,
  Anchor,
  Plane,
  Utensils,
  Dumbbell,
  Watch,
  MonitorSpeaker,
  Palette,
  Warehouse,
  Building,
  Calendar,
  Banknote,
  Store,
  Shield,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  Calculator,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

const StoreSection: React.FC = () => {
  const { 
    financialData, 
    addTransaction, 
    updateFinancialData, 
    addAsset,
    addLiability,
    chargeToCredit 
  } = useWealthSprintGame();
  const { purchaseItem, getPurchasedItems } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showPurchaseModal, setShowPurchaseModal] = useState<any>(null);
  const [selectedEmiMonths, setSelectedEmiMonths] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'credit'>('bank');
  const [paymentType, setPaymentType] = useState<'full' | 'emi' | null>(null);
  const [emiDuration, setEmiDuration] = useState<number>(3);
  const [showEmiDropdown, setShowEmiDropdown] = useState(false);

  const categories = ['All', ...getCategories().map(cat => 
    cat.charAt(0).toUpperCase() + cat.slice(1)
  )];
  
  // Dynamic EMI options based on user's credit limit and affordability
  const getAvailableEmiOptions = (itemPrice: number) => {
    const { availableCredit, totalMonthlyEmi } = getCreditInfo();
    const monthlyIncome = financialData.mainIncome + financialData.sideIncome;
    const maxAffordableEmi = monthlyIncome * 0.4; // Max 40% of income for EMI
    const remainingEmiCapacity = maxAffordableEmi - totalMonthlyEmi;
    
    const baseOptions = [
      { months: 3, label: '3 months' },
      { months: 6, label: '6 months' },
      { months: 12, label: '1 year' },
      { months: 24, label: '2 years' },
      { months: 60, label: '5 years' }
    ];
    
    // Filter options based on:
    // 1. Total purchase amount should not exceed available credit
    // 2. Monthly EMI should not exceed remaining EMI capacity
    return baseOptions.filter(option => {
      const monthlyEmi = Math.ceil(itemPrice / option.months);
      return itemPrice <= availableCredit && monthlyEmi <= remainingEmiCapacity;
    });
  };

  // Credit limit calculation helper
  const getCreditInfo = () => {
    const creditCardLiabilities = financialData.liabilities.filter(l => l.category === 'credit_card');
    const totalCreditUsed = creditCardLiabilities.reduce((sum, liability) => sum + liability.outstandingAmount, 0);
    const totalMonthlyEmi = financialData.liabilities.reduce((sum, liability) => sum + liability.emi, 0);
    const creditLimit = 500000; // ₹5 lakh credit limit
    const availableCredit = creditLimit - totalCreditUsed;
    const canPayFull = showPurchaseModal && showPurchaseModal.price <= availableCredit;
    return { totalCreditUsed, totalMonthlyEmi, creditLimit, availableCredit, canPayFull };
  };
  
  const categoryIcons: Record<string, React.ReactNode> = {
    'All': <Star className="w-4 h-4" />,
    'Property': <Home className="w-4 h-4" />,
    'Vehicle': <Car className="w-4 h-4" />,
    'Business': <Building2 className="w-4 h-4" />,
    'Gadget': <Smartphone className="w-4 h-4" />,
    'Investment': <TrendingUp className="w-4 h-4" />,
    'Entertainment': <Gamepad2 className="w-4 h-4" />
  };

  const getCategoryColors = (category: string, isSelected: boolean) => {
    return {
      bg: isSelected ? 'bg-white text-blue-800 shadow-md' : 'bg-white/10 text-white hover:bg-white/20',
      text: 'text-blue-800',
      badge: 'bg-blue-500'
    };
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-slate-500 text-white';
    }
  };

  const getRarityIcon = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="w-3 h-3" />;
      case 'epic': return <Gem className="w-3 h-3" />;
      case 'rare': return <Sparkles className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  const getItemIcon = (item: any) => {
    const iconMap: Record<string, React.ReactNode> = {
      'small_apartment': <Home className="w-6 h-6" />,
      'luxury_villa': <Crown className="w-6 h-6" />,
      'coffee_shop': <Coffee className="w-6 h-6" />,
      'delivery_van': <Truck className="w-6 h-6" />,
      'motorbike': <Bike className="w-6 h-6" />,
      'laptop': <Laptop className="w-6 h-6" />,
      'arcade_machine': <Joystick className="w-6 h-6" />,
      'solar_power_plant': <Sun className="w-6 h-6" />,
      'fishing_boat': <Anchor className="w-6 h-6" />,
      'drone': <Plane className="w-6 h-6" />,
      'fast_food_stall': <Utensils className="w-6 h-6" />,
      'gym_equipment': <Dumbbell className="w-6 h-6" />,
      'smartwatch': <Watch className="w-6 h-6" />,
      'advertising_billboard': <MonitorSpeaker className="w-6 h-6" />,
      'art_gallery': <Palette className="w-6 h-6" />,
      'car': <Car className="w-6 h-6" />,
      'commercial_office': <Building className="w-6 h-6" />,
      'warehouse_facility': <Warehouse className="w-6 h-6" />,
      'delivery_fleet': <Truck className="w-6 h-6" />,
      'tesla': <Zap className="w-6 h-6" />,
      'restaurant': <Utensils className="w-6 h-6" />,
      // New Liability items (distributed across categories)
      'luxury_sports_car': <Car className="w-6 h-6" />,
      'private_jet_membership': <Plane className="w-6 h-6" />,
      'designer_clothing_collection': <Building2 className="w-6 h-6" />,
      'expensive_watch_set': <Watch className="w-6 h-6" />,
      'luxury_vacation_package': <Plane className="w-6 h-6" />,
      'exotic_pets': <Target className="w-6 h-6" />,
      'ultra_luxury_villa': <Crown className="w-6 h-6" />,
      'home_theater_upgrade': <MonitorSpeaker className="w-6 h-6" />,
      'exclusive_club_membership': <Building2 className="w-6 h-6" />,
      'high_interest_credit_card': <DollarSign className="w-6 h-6" />
    };
    return iconMap[item.id] || <ShoppingBag className="w-6 h-6" />;
  };

  const purchasedItems = getPurchasedItems();

  const filteredItems = storeItems.filter(item => {
    const isPurchased = purchasedItems.some(p => p.storeItemId === item.id);
    const matchesCategory = selectedCategory === 'All' || 
      item.category.charAt(0).toUpperCase() + item.category.slice(1) === selectedCategory;
    
    // If item is owned, only show it in its specific category, not in "All" or other categories
    if (isPurchased) {
      return item.category.charAt(0).toUpperCase() + item.category.slice(1) === selectedCategory;
    }
    
    return matchesCategory;
  });

  const handlePurchase = (item: any) => {
    const { totalCreditUsed, totalMonthlyEmi, availableCredit } = getCreditInfo();
    const monthlyIncome = financialData.mainIncome + financialData.sideIncome;
    const maxAffordableEmi = monthlyIncome * 0.4;
    const remainingEmiCapacity = maxAffordableEmi - totalMonthlyEmi;
    
    // Check if user can afford this item either via bank balance or credit
    const canAffordCash = financialData.bankBalance >= item.price;
    const canAffordCredit = availableCredit >= item.price;
    const availableEmiOptions = getAvailableEmiOptions(item.price);
    
    if (!canAffordCash && !canAffordCredit && availableEmiOptions.length === 0) {
      toast.error(`Cannot afford this item! Bank: ₹${financialData.bankBalance.toLocaleString()}, Available Credit: ₹${availableCredit.toLocaleString()}, EMI Capacity: ₹${remainingEmiCapacity.toLocaleString()}/mo`);
      return;
    }
    
    // Show EMI info if they have existing EMIs
    if (totalMonthlyEmi > 0) {
      toast.info(`Current total EMI: ₹${totalMonthlyEmi.toLocaleString()}/month (${remainingEmiCapacity.toLocaleString()} remaining capacity)`);
    }
    
    setShowPurchaseModal(item);
  };

  const confirmPurchase = (item: any, selectedPaymentMethod?: string, emiMonths: number = 1) => {
    try {
      let paymentMethod = '';
      let useCredit = false;
      
      // Check current total EMI commitments
      const currentTotalEmi = financialData.liabilities
        .filter(l => l.emi > 0)
        .reduce((sum, l) => sum + l.emi, 0);
      
      // Determine payment method based on user selection or funds availability
      if (selectedPaymentMethod === 'credit' || (financialData.bankBalance < item.price)) {
        // Calculate new EMI amount
        const newMonthlyEmi = emiMonths > 1 ? Math.ceil(item.price / emiMonths) : 0;
        const totalNewEmi = currentTotalEmi + newMonthlyEmi;
        
        // Check credit limit - total outstanding amount should not exceed limit
        const currentCreditUsed = financialData.liabilities
          .filter(l => l.category === 'credit_card')
          .reduce((sum, l) => sum + l.outstandingAmount, 0);
        const creditLimit = 500000;
        
        if (currentCreditUsed + item.price > creditLimit) {
          toast.error(`Credit limit exceeded! Available credit: ₹${(creditLimit - currentCreditUsed).toLocaleString()}`);
          return;
        }
        
        // Check EMI affordability for multi-month EMIs
        if (emiMonths > 1) {
          const monthlyIncome = financialData.mainIncome + financialData.sideIncome;
          const maxAffordableEmi = monthlyIncome * 0.4;
          
          if (totalNewEmi > maxAffordableEmi) {
            toast.error(`EMI exceeds affordability! New EMI: ₹${newMonthlyEmi.toLocaleString()}/mo would make total EMI ₹${totalNewEmi.toLocaleString()}/mo (Max affordable: ₹${maxAffordableEmi.toLocaleString()}/mo)`);
            return;
          }
        }
        
        // Create EMI liability if more than 1 month
        if (emiMonths > 1) {
          // Add new EMI liability with unique identifier to ensure separate entries
          const emiId = `${item.id}_emi_${Date.now()}`;
          addLiability({
            name: `${item.name} EMI`,
            category: 'credit_card', // Use credit_card category for EMI tracking
            outstandingAmount: item.price,
            originalAmount: item.price,
            interestRate: 18, // 18% annual interest for EMI
            emi: newMonthlyEmi,
            tenure: emiMonths,
            remainingMonths: emiMonths,
            description: `${emiMonths}-month EMI for ${item.name} (${item.category})`,
            icon: '💳',
          });
          
          paymentMethod = `Credit Card (${emiMonths} month EMI - ₹${newMonthlyEmi.toLocaleString()}/mo)`;
          toast.success(`New EMI added! Total monthly EMI: ₹${totalNewEmi.toLocaleString()}`);
        } else {
          // Full payment on credit card
          const success = chargeToCredit(item.price, item.name);
          if (!success) {
            toast.error('Credit limit exceeded');
            return;
          }
          paymentMethod = 'Credit Card (Full Payment)';
        }
        
        useCredit = true;
      } else {
        updateFinancialData({
          bankBalance: financialData.bankBalance - item.price,
        });
        paymentMethod = 'Bank Account';
      }

      purchaseItem({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category.toLowerCase(),
        description: item.description,
        icon: item.icon,
        passiveIncome: item.passiveIncome || 0
      });

      // Calculate net monthly cashflow to determine if it's an asset or liability
      const monthlyIncome = item.passiveIncome || 0;
      const maintenanceCost = item.maintenanceCost || getMaintenanceCost(item.category, item.price);
      const netCashflow = monthlyIncome - maintenanceCost;
      
      const assetCategory = getCategoryMapping(item.category);
      
      if (netCashflow > 0) {
        // Positive cashflow = Asset
        addAsset({
          name: item.name,
          category: assetCategory,
          value: item.price,
          purchasePrice: item.price,
          purchaseDate: new Date(),
          monthlyIncome: monthlyIncome,
          appreciationRate: item.appreciationRate || getAppreciationRate(item.category),
          maintenanceCost: maintenanceCost,
          description: item.description,
          icon: item.icon,
          storeItemId: item.id,
        });
      } else {
        // Negative cashflow = Liability
        const liabilityCategory = getLiabilityCategoryMapping(item.category);
        addLiability({
          name: item.name,
          category: liabilityCategory,
          outstandingAmount: item.price,
          originalAmount: item.price,
          interestRate: 0, // No interest on purchases, just ongoing costs
          emi: Math.abs(netCashflow), // Monthly drain on finances
          tenure: 0, // Indefinite liability
          remainingMonths: 0, // Indefinite
          description: item.description,
          icon: item.icon || '💸',
        });
      }

      addTransaction({
        type: 'store_purchase',
        amount: -item.price,
        description: `Store: ${item.name}`,
        fromAccount: 'bank',
        toAccount: 'business',
      });
      
      setShowPurchaseModal(null);
      setSelectedEmiMonths(1); // Reset EMI selection
      
      // Add credit card benefits
      if (useCredit) {
        const cashback = Math.floor(item.price * 0.005); // 0.5% cashback
        if (cashback > 0) {
          updateFinancialData({
            bankBalance: financialData.bankBalance + cashback,
          });
          toast.success(`Successfully purchased ${item.name} using ${paymentMethod}! Earned ${formatMoney(cashback)} cashback!`);
        } else {
          toast.success(`Successfully purchased ${item.name} using ${paymentMethod}!`);
        }
      } else {
        toast.success(`Successfully purchased ${item.name} using ${paymentMethod}!`);
      }
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    }
  };

  const getCategoryMapping = (storeCategory: string): 'real_estate' | 'vehicles' | 'business' | 'gadget' | 'investment' | 'entertainment' => {
    switch (storeCategory) {
      case 'property': return 'real_estate';
      case 'vehicle': return 'vehicles';
      case 'business': return 'business';
      case 'gadget': return 'gadget';
      case 'investment': return 'investment';
      default: return 'entertainment';
    }
  };

  const getLiabilityCategoryMapping = (storeCategory: string): 'home_loan' | 'car_loan' | 'education_loan' | 'credit_card' | 'business_debt' | 'personal_loan' => {
    switch (storeCategory) {
      case 'property': return 'home_loan';
      case 'vehicle': return 'car_loan';
      case 'business': return 'business_debt';
      case 'gadget': return 'personal_loan';
      case 'investment': return 'personal_loan';
      default: return 'personal_loan';
    }
  };

  const getAppreciationRate = (category: string): number => {
    switch (category) {
      case 'property': return 8.5;
      case 'vehicle': return -10;
      case 'business': return 15;
      case 'gadget': return -20;
      default: return 0;
    }
  };

  const getMaintenanceCost = (category: string, price: number): number => {
    switch (category) {
      case 'property': return Math.floor(price * 0.01 / 12);
      case 'vehicle': return Math.floor(price * 0.05 / 12);
      case 'business': return Math.floor(price * 0.02 / 12);
      case 'gadget': return Math.floor(price * 0.01 / 12);
      default: return 0;
    }
  };

  const stats = getCategoryStats();
  const totalValue = storeItems.reduce((sum, item) => sum + item.price, 0);
  const totalItems = storeItems.length;
  const ownedValue = purchasedItems.reduce((sum, item) => {
    const storeItem = storeItems.find(si => si.id === item.storeItemId);
    return sum + (storeItem?.price || 0);
  }, 0);

  // Sort items to show purchased items first, then unpurchased
  const sortedItems = filteredItems.sort((a, b) => {
    const aIsPurchased = purchasedItems.some(p => p.storeItemId === a.id);
    const bIsPurchased = purchasedItems.some(p => p.storeItemId === b.id);
    
    if (aIsPurchased && !bIsPurchased) return -1;
    if (!aIsPurchased && bIsPurchased) return 1;
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Store Header - Inspired by Stock Market/Banking Sections */}
      <div className="mx-2">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        {/* Main Header Row */}
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            <div>
              <h1 className="text-lg font-bold">Wealth Store</h1>
              <p className="text-blue-100 text-xs">Premium assets & investment opportunities • 24/7 marketplace</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-200">Market Status</p>
            <p className="text-sm font-bold text-green-400">OPEN</p>
          </div>
        </div>
        
        {/* Store Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-3 px-4">
          <div>
            <p className="text-blue-200 text-xs">TOTAL CATALOG: <span className="text-white font-bold">{formatMoney(totalValue)}</span> <span className="text-green-400">+{totalItems} items</span></p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">YOUR PORTFOLIO: <span className="text-white font-bold">{formatMoney(ownedValue)}</span></p>
          </div>
        </div>
        
        {/* Bottom Metrics */}
        <div className="grid grid-cols-4 gap-2 text-center px-4 pb-3">
          <div>
            <p className="text-blue-200 text-xs">Balance</p>
            <p className="text-sm font-bold">{formatMoney(financialData.bankBalance)}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">Credit Used</p>
            <p className="text-sm font-bold text-orange-400">{formatMoney(getCreditInfo().totalCreditUsed)}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">Monthly EMI</p>
            <p className="text-sm font-bold text-red-400">{formatMoney(getCreditInfo().totalMonthlyEmi)}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">Owned Items</p>
            <p className="text-sm font-bold text-green-400">{purchasedItems.length}</p>
          </div>
        </div>
        
        {/* Category Navigation */}
        <div className="overflow-x-auto px-4 pb-4">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shadow-md ${
                  getCategoryColors(category, selectedCategory === category).bg
                }`}
              >
                {categoryIcons[category]}
                {category}
                {category !== 'All' && (
                  <Badge className={`ml-1 ${getCategoryColors(category, false).badge} text-white text-xs`}>
                    {stats[category.toLowerCase()]?.count || 0}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Owned Assets Section - Hidden to reduce clutter */}

      {/* Store Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {sortedItems.map((item) => {
          const isPurchased = purchasedItems.some(p => p.storeItemId === item.id);
          const canAfford = financialData.bankBalance >= item.price;
          const roi = (((item.passiveIncome || 0) * 12) / item.price * 100);
          
          return isPurchased ? (
              // Compact Owned Item Card
              <Card
                key={item.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100 text-green-600">
                        {getItemIcon(item)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                            {item.category}
                          </Badge>
                          <span className="text-xs text-green-600 font-semibold">
                            {roi.toFixed(1)}% ROI
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-800">
                        {formatMoney(item.price)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Coins className="w-3 h-3" />
                        <span className="font-semibold">{formatMoney(item.passiveIncome || 0)}/mo</span>
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-600 ml-auto mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Full Purchase Card
              <Card
                key={item.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 hover:border-blue-300"
              >
                <CardContent className="p-4">
                  {/* Item Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
                        {getItemIcon(item)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{item.name}</h3>
                        <Badge className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Price and ROI */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-right">
                      <div className="text-xl font-bold text-slate-800">
                        {formatMoney(item.price)}
                      </div>
                      <div className="text-sm text-blue-600 font-semibold">
                        {roi.toFixed(1)}% Annual ROI
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 rounded-full">
                      <Coins className="w-3 h-3 text-amber-600" />
                      <span className="text-xs font-semibold text-amber-700">
                        {formatMoney(item.passiveIncome || 0)}/mo
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-3">{item.description}</p>

                  {/* Liability Warning - Show cause and bad impact */}
                  {item.isLiability && (item.cause || item.badImpact) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="text-base font-bold text-red-700">⚠️ Lifestyle Inflation Trap</span>
                      </div>
                      {item.cause && (
                        <div className="mb-3">
                          <span className="text-sm font-bold text-red-700 block mb-2">Cause:</span>
                          <span className="text-sm text-red-600 leading-relaxed">{item.cause}</span>
                        </div>
                      )}
                      {item.badImpact && (
                        <div>
                          <span className="text-sm font-bold text-red-700 block mb-2">Bad Impact:</span>
                          <span className="text-sm text-red-600 leading-relaxed">{item.badImpact}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rarity and Special Effect */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`text-xs px-2 py-1 ${getRarityColor(item.rarity)}`}>
                        {getRarityIcon(item.rarity)}
                        <span className="ml-1 capitalize">{item.rarity || 'common'}</span>
                      </Badge>
                    </div>
                    
                    {item.specialEffect && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-2">
                        <div className="flex items-start gap-2">
                          <Zap className="w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-amber-800 font-medium">{item.specialEffect}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Abilities and Disabilities */}
                  {(item.abilities || item.disabilities) && (
                    <div className="mb-4 space-y-2">
                      {item.abilities && item.abilities.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Shield className="w-3 h-3 text-green-600" />
                            <span className="text-xs font-semibold text-green-700">Abilities:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.abilities.slice(0, 3).map((ability, idx) => (
                              <Badge key={idx} className="text-[10px] bg-green-100 text-green-800 border-green-200">
                                {ability}
                              </Badge>
                            ))}
                            {item.abilities.length > 3 && (
                              <Badge className="text-[10px] bg-green-100 text-green-600 border-green-200">
                                +{item.abilities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {item.disabilities && item.disabilities.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            <span className="text-xs font-semibold text-red-700">Risks:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.disabilities.slice(0, 2).map((disability, idx) => (
                              <Badge key={idx} className="text-[10px] bg-red-100 text-red-800 border-red-200">
                                {disability}
                              </Badge>
                            ))}
                            {item.disabilities.length > 2 && (
                              <Badge className="text-[10px] bg-red-100 text-red-600 border-red-200">
                                +{item.disabilities.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Financial Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3 text-green-500" />
                      <span className="text-slate-600">Income: {formatMoney(item.passiveIncome || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowDownRight className="w-3 h-3 text-red-500" />
                      <span className="text-slate-600">Maintenance: {formatMoney(item.maintenanceCost || 0)}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handlePurchase(item)}
                    className={`w-full ${
                      canAfford 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {canAfford ? 'Purchase' : 'Insufficient Funds'}
                  </Button>
                </CardContent>
              </Card>
            );
        })}
      </div>

      {/* Compact Purchase Modal - Deals Section Style */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-xs w-full bg-white shadow-2xl border-0">
            <CardContent className="p-3 bg-white rounded-lg">
              {/* Compact Header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-800">Investment Purchase</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowPurchaseModal(null);
                    setPaymentMethod('bank');
                    setPaymentType(null);
                    setEmiDuration(3);
                    setShowEmiDropdown(false);
                  }}
                  className="h-4 w-4 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              {/* Compact Item Info */}
              <div className="text-center mb-2">
                <div className="w-10 h-10 mx-auto mb-1 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  {getItemIcon(showPurchaseModal)}
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">
                  {showPurchaseModal.name}
                </h4>
                <p className="text-blue-600 text-xs font-medium">
                  {showPurchaseModal.category}
                </p>
              </div>

              {/* Compact Investment Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <Calculator className="w-3 h-3 text-blue-600" />
                  <h5 className="font-semibold text-blue-800 text-xs">Key Investment Information</h5>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div>
                    <span className="text-blue-600">Investment Amount:</span>
                    <div className="font-bold text-blue-800">{formatMoney(showPurchaseModal.price)}</div>
                  </div>
                  <div>
                    <span className="text-blue-600">Expected ROI:</span>
                    <div className="font-bold text-green-800">{(((showPurchaseModal.passiveIncome || 0) * 12) / showPurchaseModal.price * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <span className="text-blue-600">Monthly Earnings:</span>
                    <div className="font-bold text-green-800">{formatMoney(showPurchaseModal.passiveIncome || 0)}</div>
                  </div>
                  <div>
                    <span className="text-blue-600">Time Horizon:</span>
                    <div className="font-bold text-blue-800">18 months</div>
                  </div>
                  <div>
                    <span className="text-blue-600">Risk Level:</span>
                    <div className="font-bold capitalize text-xs text-yellow-600">Medium</div>
                  </div>
                  <div>
                    <span className="text-blue-600">Liquidity:</span>
                    <div className="font-bold text-blue-800 capitalize text-xs">Medium</div>
                  </div>
                </div>
              </div>

              {/* Compact Payment Method */}
              <div className="mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <CreditCard className="w-3 h-3 text-slate-600" />
                  <h5 className="font-semibold text-slate-800 text-xs">Payment Method</h5>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => {
                      setPaymentMethod('bank');
                      setPaymentType('full');
                    }}
                    className={`p-1.5 rounded text-xs font-medium transition-all ${
                      paymentMethod === 'bank'
                        ? 'bg-blue-100 border border-blue-300 text-blue-800'
                        : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-1 justify-center">
                      <Building2 className="w-3 h-3" />
                      Banking
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setPaymentMethod('credit');
                      setPaymentType(null);
                    }}
                    className={`p-1.5 rounded text-xs font-medium transition-all ${
                      paymentMethod === 'credit'
                        ? 'bg-blue-100 border border-blue-300 text-blue-800'
                        : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-1 justify-center">
                      <CreditCard className="w-3 h-3" />
                      Credit Card
                    </div>
                  </button>
                </div>
              </div>

              {/* Credit Card Payment Options */}
              {paymentMethod === 'credit' && (
                <div className="mb-2">
                  <h5 className="font-semibold text-slate-800 mb-1 text-xs">Payment Options</h5>
                  
                  {/* Horizontal Payment Options */}
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    {/* Full Payment Button */}
                    <button
                      onClick={() => {
                        setPaymentType('full');
                      }}
                      className={`p-1.5 rounded text-xs font-medium transition-all ${
                        paymentType === 'full'
                          ? 'bg-blue-100 border border-blue-300 text-blue-800'
                          : !getCreditInfo().canPayFull
                            ? 'bg-red-100 border border-red-300 text-red-800 cursor-not-allowed opacity-60'
                            : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                      disabled={!getCreditInfo().canPayFull}
                    >
                      {getCreditInfo().canPayFull ? "Full Payment" : "Limit exceeded"}
                    </button>

                    {/* EMI Button */}
                    <button
                      onClick={() => {
                        const availableOptions = getAvailableEmiOptions(showPurchaseModal.price);
                        if (availableOptions.length > 0) {
                          setPaymentType('emi');
                          setEmiDuration(availableOptions[0].months);
                        }
                      }}
                      disabled={getAvailableEmiOptions(showPurchaseModal.price).length === 0}
                      className={`p-1.5 rounded text-xs font-medium transition-all ${
                        getAvailableEmiOptions(showPurchaseModal.price).length === 0
                          ? 'bg-red-100 border border-red-300 text-red-800 cursor-not-allowed opacity-60'
                          : paymentType === 'emi'
                          ? 'bg-blue-100 border border-blue-300 text-blue-800'
                          : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {getAvailableEmiOptions(showPurchaseModal.price).length === 0 
                        ? 'EMI Not Available' 
                        : `EMI Options`}
                    </button>
                  </div>

                  {/* EMI Duration Selector - Only show when EMI is selected */}
                  {paymentType === 'emi' && (
                    <div className="relative">
                      <label className="text-xs text-gray-600 mb-1 block">EMI Duration</label>
                      <button
                        onClick={() => setShowEmiDropdown(!showEmiDropdown)}
                        className="w-full p-1.5 rounded border border-gray-300 text-xs font-medium transition-all bg-white hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{emiDuration < 12 ? `${emiDuration} months` : `${emiDuration/12} year${emiDuration/12 > 1 ? 's' : ''}`}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${showEmiDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Upward Opening Dropdown */}
                      {showEmiDropdown && (
                        <>
                          {/* Overlay to close on outside click */}
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowEmiDropdown(false)}
                          />
                          <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded shadow-lg z-20 overflow-hidden">
                            {getAvailableEmiOptions(showPurchaseModal.price).length === 0 ? (
                              <div className="p-2 text-xs text-red-600 text-center">
                                No EMI options available within your credit limit
                              </div>
                            ) : (
                              getAvailableEmiOptions(showPurchaseModal.price).map((option) => (
                                <button
                                  key={option.months}
                                  onClick={() => {
                                    setEmiDuration(option.months);
                                    setShowEmiDropdown(false);
                                  }}
                                  className={`w-full p-2 text-xs font-medium transition-all flex justify-between items-center border-b border-gray-100 last:border-b-0 ${
                                    emiDuration === option.months
                                      ? 'bg-blue-50 text-blue-800'
                                      : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  <span>{option.label}</span>
                                  <span className="text-xs text-gray-500">
                                    ₹{Math.ceil(showPurchaseModal.price / option.months).toLocaleString()}/mo
                                  </span>
                                </button>
                              ))
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Compact Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white border-red-500 text-xs py-1.5"
                  onClick={() => {
                    setShowPurchaseModal(null);
                    setPaymentMethod('bank');
                    setPaymentType(null);
                    setEmiDuration(3);
                    setShowEmiDropdown(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs py-1.5"
                  onClick={() => {
                    // Handle purchase logic here - check if paymentType is selected
                    if (!paymentType && paymentMethod === 'credit') {
                      toast.error('Please select a payment option (Full Payment or EMI)');
                      return;
                    }
                    
                    const finalPaymentType = paymentType || 'full';
                    const finalEmiMonths = paymentMethod === 'credit' && finalPaymentType === 'emi' ? emiDuration : 1;
                    
                    confirmPurchase(
                      showPurchaseModal,
                      paymentMethod,
                      finalEmiMonths
                    );
                    
                    setShowPurchaseModal(null);
                    setPaymentMethod('bank');
                    setPaymentType(null);
                    setEmiDuration(3);
                    setShowEmiDropdown(false);
                  }}
                >
                  Purchase
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StoreSection;