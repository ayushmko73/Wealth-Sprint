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

  const categories = ['All', ...getCategories().map(cat => 
    cat.charAt(0).toUpperCase() + cat.slice(1)
  )];
  
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
    const colorMap: Record<string, { bg: string, text: string, badge: string }> = {
      'All': { 
        bg: isSelected ? 'bg-white text-slate-800' : 'bg-white/10 text-white hover:bg-white/20', 
        text: 'text-slate-800', 
        badge: 'bg-slate-500' 
      },
      'Property': { 
        bg: isSelected ? 'bg-white text-emerald-800' : 'bg-emerald-500/20 text-white hover:bg-emerald-500/30', 
        text: 'text-emerald-800', 
        badge: 'bg-emerald-600' 
      },
      'Vehicle': { 
        bg: isSelected ? 'bg-white text-blue-800' : 'bg-blue-500/20 text-white hover:bg-blue-500/30', 
        text: 'text-blue-800', 
        badge: 'bg-blue-600' 
      },
      'Business': { 
        bg: isSelected ? 'bg-white text-amber-800' : 'bg-amber-500/20 text-white hover:bg-amber-500/30', 
        text: 'text-amber-800', 
        badge: 'bg-amber-600' 
      },
      'Gadget': { 
        bg: isSelected ? 'bg-white text-purple-800' : 'bg-purple-500/20 text-white hover:bg-purple-500/30', 
        text: 'text-purple-800', 
        badge: 'bg-purple-600' 
      },
      'Investment': { 
        bg: isSelected ? 'bg-white text-teal-800' : 'bg-teal-500/20 text-white hover:bg-teal-500/30', 
        text: 'text-teal-800', 
        badge: 'bg-teal-600' 
      },
      'Entertainment': { 
        bg: isSelected ? 'bg-white text-rose-800' : 'bg-rose-500/20 text-white hover:bg-rose-500/30', 
        text: 'text-rose-800', 
        badge: 'bg-rose-600' 
      }
    };
    return colorMap[category] || colorMap['All'];
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
      'restaurant': <Utensils className="w-6 h-6" />
    };
    return iconMap[item.id] || <ShoppingBag className="w-6 h-6" />;
  };

  const filteredItems = storeItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || 
      item.category.charAt(0).toUpperCase() + item.category.slice(1) === selectedCategory;
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

  const confirmPurchase = (item: any) => {
    try {
      let paymentMethod = '';
      
      if (financialData.bankBalance >= item.price) {
        updateFinancialData({
          bankBalance: financialData.bankBalance - item.price,
        });
        paymentMethod = 'Bank Account';
      } else {
        const success = chargeToCredit(item.price, item.name);
        if (!success) {
          toast.error('Credit limit exceeded');
          return;
        }
        paymentMethod = 'Credit Card';
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
      addAsset({
        name: item.name,
        category: assetCategory,
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
      toast.success(`Successfully purchased ${item.name} using ${paymentMethod}!`);
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

  const purchasedItems = getPurchasedItems();
  const stats = getCategoryStats();
  const totalValue = storeItems.reduce((sum, item) => sum + item.price, 0);
  const totalItems = storeItems.length;
  const ownedValue = purchasedItems.reduce((sum, item) => {
    const storeItem = storeItems.find(si => si.id === item.storeItemId);
    return sum + (storeItem?.price || 0);
  }, 0);

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

      {/* Owned Assets Section */}
      {purchasedItems.length > 0 && (
        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-emerald-800">Your Assets Portfolio</h2>
              <Badge className="bg-emerald-600 text-white">{purchasedItems.length} items</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {purchasedItems.slice(0, 4).map((purchasedItem) => {
                const storeItem = storeItems.find(item => item.id === purchasedItem.storeItemId);
                if (!storeItem) return null;
                
                return (
                  <div key={`owned-${purchasedItem.id}`} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg text-emerald-600">
                      {getItemIcon(storeItem)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-emerald-800">{storeItem.name}</div>
                      <div className="text-xs text-emerald-600">+{formatMoney(storeItem.passiveIncome || 0)}/month</div>
                    </div>
                    <Badge className="bg-emerald-600 text-white text-xs">Owned</Badge>
                  </div>
                );
              })}
            </div>
            {purchasedItems.length > 4 && (
              <p className="text-center text-emerald-600 text-sm mt-2">+{purchasedItems.length - 4} more assets</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Store Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isPurchased = purchasedItems.some(p => p.storeItemId === item.id);
          const canAfford = financialData.bankBalance >= item.price;
          const roi = (((item.passiveIncome || 0) * 12) / item.price * 100);
          
          return (
            <Card
              key={item.id}
              className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                isPurchased 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 hover:border-blue-300'
              }`}
            >
              <CardContent className="p-4">
                {/* Item Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isPurchased 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {getItemIcon(item)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{item.name}</h3>
                      <Badge className={`text-xs ${
                        isPurchased 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  {isPurchased && <CheckCircle className="w-5 h-5 text-green-600" />}
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
                {isPurchased ? (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Owned
                  </Button>
                ) : (
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
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Purchase Confirmation Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">Confirm Purchase</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPurchaseModal(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  {getItemIcon(showPurchaseModal)}
                </div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">
                  {showPurchaseModal.name}
                </h4>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {formatMoney(showPurchaseModal.price)}
                </p>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 rounded-full">
                  <Coins className="w-3 h-3 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700">
                    +{formatMoney(showPurchaseModal.passiveIncome || 0)}/month
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="text-sm font-semibold text-slate-700 mb-2">Payment Method:</div>
                {financialData.bankBalance >= showPurchaseModal.price ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-green-700">Bank Account</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-blue-700">Credit Card</span>
                  </div>
                )}
                
                <div className="text-sm text-slate-600 mt-2">
                  After purchase: {formatMoney(
                    financialData.bankBalance >= showPurchaseModal.price 
                      ? financialData.bankBalance - showPurchaseModal.price 
                      : financialData.bankBalance
                  )} remaining
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPurchaseModal(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  onClick={() => confirmPurchase(showPurchaseModal)}
                >
                  Confirm Purchase
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