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
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const StoreSection: React.FC = () => {
  const { 
    financialData, 
    addTransaction, 
    updateFinancialData, 
    addAsset,
    chargeToCredit 
  } = useWealthSprintGame();
  const { purchaseItem, getPurchasedItems } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showPurchaseModal, setShowPurchaseModal] = useState<any>(null);
  const [selectedEmiMonths, setSelectedEmiMonths] = useState<number>(1);

  const categories = ['All', ...getCategories().map(cat => 
    cat.charAt(0).toUpperCase() + cat.slice(1)
  )];
  
  const emiOptions = [
    { months: 1, label: '1 Month' },
    { months: 2, label: '2 Months' },
    { months: 6, label: '6 Months' },
    { months: 12, label: '1 Year' }
  ];
  
  const categoryIcons: Record<string, React.ReactNode> = {
    'All': <Star className="w-4 h-4" />,
    'Property': <Home className="w-4 h-4" />,
    'Vehicle': <Car className="w-4 h-4" />,
    'Business': <Building2 className="w-4 h-4" />,
    'Gadget': <Smartphone className="w-4 h-4" />,
    'Investment': <TrendingUp className="w-4 h-4" />,
    'Entertainment': <Gamepad2 className="w-4 h-4" />,
    'Liability': <AlertTriangle className="w-4 h-4" />
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
      // Liability items
      'luxury_car_emi': <Car className="w-6 h-6" />,
      'expensive_smartphone': <Smartphone className="w-6 h-6" />,
      'designer_clothing': <Building2 className="w-6 h-6" />,
      'credit_card_debt': <DollarSign className="w-6 h-6" />,
      'lavish_vacations': <Plane className="w-6 h-6" />,
      'overpriced_gym': <Dumbbell className="w-6 h-6" />,
      'luxury_apartment_rent': <Building className="w-6 h-6" />,
      'gambling_casino': <Target className="w-6 h-6" />,
      'impulse_shopping_loan': <ShoppingCart className="w-6 h-6" />,
      'uninsured_medical': <Shield className="w-6 h-6" />
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
    const currentCreditUsed = financialData.liabilities.find(l => l.category === 'credit_card')?.outstandingAmount || 0;
    const creditLimit = 500000;
    const availableCredit = creditLimit - currentCreditUsed;
    
    if (financialData.bankBalance < item.price && availableCredit < item.price) {
      toast.error('Insufficient funds and credit limit exceeded');
      return;
    }
    setShowPurchaseModal(item);
  };

  const confirmPurchase = (item: any, selectedPaymentMethod?: string, emiMonths: number = 1) => {
    try {
      let paymentMethod = '';
      let useCredit = false;
      
      // Determine payment method based on user selection or funds availability
      if (selectedPaymentMethod === 'credit' || (financialData.bankBalance < item.price)) {
        const success = chargeToCredit(item.price, item.name);
        if (!success) {
          toast.error('Credit limit exceeded');
          return;
        }
        paymentMethod = 'Credit Card';
        useCredit = true;
        
        // Create EMI entry if credit card and months > 1
        if (emiMonths > 1) {
          const monthlyEmi = Math.ceil(item.price / emiMonths);
          paymentMethod += ` (${emiMonths} month EMI)`;
        }
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

      const assetCategory = getCategoryMapping(item.category);
      const assetType = item.isLiability ? 'Liability' : assetCategory;
      
      addAsset({
        name: item.name,
        category: assetType,
        value: item.price,
        purchasePrice: item.price,
        purchaseDate: new Date(),
        monthlyIncome: item.passiveIncome || 0,
        appreciationRate: item.appreciationRate || getAppreciationRate(item.category),
        maintenanceCost: item.maintenanceCost || getMaintenanceCost(item.category, item.price),
        description: item.description,
        icon: item.icon,
        storeItemId: item.id,
      });

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

  const getCategoryMapping = (storeCategory: string): 'real_estate' | 'vehicles' | 'business' | 'gadget' | 'investment' | 'entertainment' | 'liability' => {
    switch (storeCategory) {
      case 'property': return 'real_estate';
      case 'vehicle': return 'vehicles';
      case 'business': return 'business';
      case 'gadget': return 'gadget';
      case 'investment': return 'investment';
      case 'liability': return 'liability';
      default: return 'entertainment';
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
    <div className="space-y-4 p-4">
      {/* Store Header - Inspired by Stock Market/Banking Sections */}
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
            <p className="text-blue-200 text-xs">Owned</p>
            <p className="text-sm font-bold text-green-400">{purchasedItems.length}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">Available</p>
            <p className="text-sm font-bold text-white">{totalItems - purchasedItems.length}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">Categories</p>
            <p className="text-sm font-bold">{getCategories().length}</p>
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

      {/* Owned Assets Section - Hidden to reduce clutter */}

      {/* Store Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Compact Purchase Confirmation Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-sm w-full bg-white shadow-2xl border-0">
            <CardContent className="p-4 bg-white rounded-lg">
              {/* Header with Close Button */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-800">Confirm Purchase</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPurchaseModal(null)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Compact Item Info */}
              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  {getItemIcon(showPurchaseModal)}
                </div>
                <h4 className="font-bold text-slate-800 text-base mb-1">
                  {showPurchaseModal.name}
                </h4>
                <p className="text-xl font-bold text-blue-600 mb-1">
                  {formatMoney(showPurchaseModal.price)}
                </p>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-full">
                  <Coins className="w-3 h-3 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700">
                    +{formatMoney(showPurchaseModal.passiveIncome || 0)}/month
                  </span>
                </div>
              </div>

              {/* Compact Payment Method */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <DollarSign className="w-3 h-3" />
                  Payment Method:
                </div>
                
                {/* Bank Account Option */}
                {financialData.bankBalance >= showPurchaseModal.price && (
                  <div className="bg-green-50 border border-green-200 rounded p-2 mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-semibold text-green-700">Bank Account</span>
                      </div>
                      <span className="text-xs text-green-600">Recommended</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">No additional fees • Instant payment</p>
                  </div>
                )}
                
                {/* Credit Card Option */}
                <div className="bg-purple-50 border border-purple-200 rounded p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-purple-700">Credit Card</span>
                    </div>
                    <span className="text-xs text-purple-600">Benefits Available</span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <p className="text-xs text-purple-600">• Instant purchase protection</p>
                    <p className="text-xs text-purple-600">• 0.5% cashback on all purchases</p>
                    <p className="text-xs text-purple-600">• Build credit score faster</p>
                  </div>
                  
                  {/* EMI Options - Compact */}
                  <div className="mt-2 border-t border-purple-200 pt-2">
                    <p className="text-xs font-semibold text-purple-700 mb-1">EMI Options:</p>
                    <div className="grid grid-cols-4 gap-1">
                      {emiOptions.map((option) => (
                        <button
                          key={option.months}
                          onClick={() => setSelectedEmiMonths(option.months)}
                          className={`text-xs p-1 rounded text-center transition-all ${
                            selectedEmiMonths === option.months
                              ? 'bg-purple-600 text-white font-bold'
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {selectedEmiMonths > 1 && (
                      <p className="text-xs text-purple-600 mt-1">
                        Monthly: {formatMoney(Math.ceil(showPurchaseModal.price / selectedEmiMonths))}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Compact Action Buttons */}
              <div className="space-y-2">
                {/* Bank Payment Button */}
                {financialData.bankBalance >= showPurchaseModal.price && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 text-sm"
                    onClick={() => confirmPurchase(showPurchaseModal, 'bank')}
                  >
                    <CheckCircle className="w-3 h-3 mr-2" />
                    Pay with Bank Account
                  </Button>
                )}
                
                {/* Credit Card Payment Button */}
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 text-sm"
                  onClick={() => confirmPurchase(showPurchaseModal, 'credit', selectedEmiMonths)}
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                  {selectedEmiMonths > 1 
                    ? `Pay with Credit Card (${selectedEmiMonths} month EMI)`
                    : 'Pay with Credit Card + Benefits'
                  }
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