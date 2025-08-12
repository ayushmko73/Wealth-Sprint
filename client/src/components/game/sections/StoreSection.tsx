import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { useStore } from '../../../lib/stores/useStore';
import { formatMoney } from '../../../lib/utils/formatMoney';
import { storeItems, getCategories } from '../../../lib/data/storeItems';
import { 
  Home, 
  Car, 
  Building2, 
  Smartphone,
  ShoppingBag,
  CheckCircle,
  Star,
  X,
  Coins,
  TrendingUp,
  GamepadIcon
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
    'All': <Star size={16} />,
    'Property': <Home size={16} />,
    'Vehicle': <Car size={16} />,
    'Business': <Building2 size={16} />,
    'Gadget': <Smartphone size={16} />,
    'Investment': <TrendingUp size={16} />,
    'Entertainment': <GamepadIcon size={16} />
  };

  const filteredItems = storeItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || 
      item.category.charAt(0).toUpperCase() + item.category.slice(1) === selectedCategory;
    return matchesCategory;
  });

  const handlePurchase = (item: any) => {
    const currentCreditUsed = financialData.liabilities.find(l => l.category === 'credit_card')?.outstandingAmount || 0;
    const creditLimit = 500000; // ₹5 lakh credit limit
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
        // Pay with bank balance
        updateFinancialData({
          bankBalance: financialData.bankBalance - item.price,
        });
        paymentMethod = 'Bank Account';
      } else {
        // Pay with credit card
        const success = chargeToCredit(item.price, item.name);
        if (!success) {
          toast.error('Credit limit exceeded');
          return;
        }
        paymentMethod = 'Credit Card';
      }

      // Add to both store purchases (for inventory tracking) and assets (for financial tracking)
      purchaseItem({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category.toLowerCase(),
        description: item.description,
        icon: item.icon,
        passiveIncome: item.passiveIncome || 0
      });

      // Add to assets with proper categorization
      const assetCategory = getCategoryMapping(item.category);
      addAsset({
        name: item.name,
        category: assetCategory,
        value: item.price, // Asset value equals purchase price initially
        purchasePrice: item.price,
        purchaseDate: new Date(),
        monthlyIncome: item.passiveIncome || 0, // Use passiveIncome from store data
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
      toast.success(`Successfully purchased ${item.name} using ${paymentMethod}! Added to your assets.`);
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    }
  };

  // Helper functions for asset categorization
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
      case 'property': return 8.5; // Real estate typically appreciates 8-10% annually
      case 'vehicle': return -10; // Vehicles depreciate
      case 'business': return 15; // Businesses can appreciate with growth
      case 'gadget': return -20; // Tech gadgets depreciate quickly
      default: return 0;
    }
  };

  const getMaintenanceCost = (category: string, price: number): number => {
    switch (category) {
      case 'property': return Math.floor(price * 0.01 / 12); // 1% annually as monthly cost
      case 'vehicle': return Math.floor(price * 0.05 / 12); // 5% annually for vehicle maintenance
      case 'business': return Math.floor(price * 0.02 / 12); // 2% annually for business expenses
      case 'gadget': return Math.floor(price * 0.01 / 12); // 1% annually for tech maintenance
      default: return 0;
    }
  };

  const purchasedItems = getPurchasedItems();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f3' }}>
      
      {/* Simple Header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#3a3a3a' }}>
          Store
        </h1>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all"
              style={{
                backgroundColor: selectedCategory === category ? '#4F9CF9' : '#ffffff',
                color: selectedCategory === category ? 'white' : '#3a3a3a',
                border: '1px solid #e8dcc6'
              }}
            >
              {categoryIcons[category]}
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards */}
      <div className="px-4 pb-4">
        {/* Owned Items Section */}
        {purchasedItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#3a3a3a' }}>
              Owned Assets
            </h2>
            <div 
              className="rounded-xl p-4"
              style={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e8dcc6',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div className="grid grid-cols-1 gap-3">
                {purchasedItems.map((purchasedItem) => {
                  const storeItem = storeItems.find(item => item.id === purchasedItem.storeItemId);
                  if (!storeItem) return null;
                  
                  return (
                    <div key={`owned-${purchasedItem.id}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                          style={{ backgroundColor: '#ffffff', border: '1px solid #e8dcc6' }}
                        >
                          {storeItem.icon}
                        </div>
                        <div>
                          <div className="font-medium" style={{ color: '#3a3a3a' }}>
                            {storeItem.name}
                          </div>
                          <div 
                            className="text-sm px-2 py-1 rounded-full inline-block"
                            style={{ backgroundColor: '#ffffff', color: '#9333EA', border: '1px solid #e8dcc6' }}
                          >
                            +{formatMoney(storeItem.passiveIncome || 0)}/month
                          </div>
                        </div>
                      </div>
                      <div 
                        className="px-3 py-1.5 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: '#22C55E', color: '#ffffff' }}
                      >
                        Owned
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isPurchased = purchasedItems.some(p => p.storeItemId === item.id);
            const canAfford = financialData.bankBalance >= item.price;
            const roi = (((item.passiveIncome || 0) * 12) / item.price * 100);
            
            return (
              <div
                key={item.id}
                className="rounded-xl p-4"
                style={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e8dcc6',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: '#ffffff', border: '1px solid #e8dcc6' }}
                  >
                    {item.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: '#3a3a3a' }}>
                          {item.name}
                        </h3>
                        <p className="text-sm" style={{ color: '#666' }}>
                          {item.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl" style={{ color: '#3a3a3a' }}>
                          {formatMoney(item.price)}
                        </div>
                        <div className="text-sm" style={{ color: '#22C55E' }}>
                          {roi.toFixed(1)}% ROI
                        </div>
                      </div>
                    </div>
                    
                    {/* Monthly Income Badge */}
                    <div 
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium mb-3"
                      style={{ backgroundColor: '#ffffff', color: '#9333EA', border: '1px solid #e8dcc6' }}
                    >
                      <Coins size={12} />
                      {formatMoney(item.passiveIncome || 0)}/month
                    </div>
                    
                    <p className="text-sm mb-4" style={{ color: '#666' }}>
                      {item.description}
                    </p>
                    
                    {/* Action Button */}
                    {isPurchased ? (
                      <div 
                        className="flex items-center gap-2 px-4 py-2 rounded-lg w-fit"
                        style={{ backgroundColor: '#22C55E', color: '#ffffff' }}
                      >
                        <CheckCircle size={16} />
                        <span className="font-medium">Owned</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all"
                        style={{
                          backgroundColor: canAfford ? '#22C55E' : '#EF4444',
                          color: 'white'
                        }}
                      >
                        <ShoppingBag size={16} />
                        {canAfford ? 'Purchase' : 'Insufficient Funds'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-xl p-6 max-w-sm w-full relative"
            style={{ backgroundColor: '#ffffff', border: '1px solid #e8dcc6', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            <button
              onClick={() => setShowPurchaseModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full"
              style={{ backgroundColor: '#e8dcc6', color: '#3a3a3a' }}
            >
              <X size={16} />
            </button>
            
            <div className="text-center">
              <div className="text-5xl mb-4">{showPurchaseModal.image}</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#3a3a3a' }}>
                Confirm Purchase
              </h3>
              <p className="mb-4" style={{ color: '#666' }}>
                {showPurchaseModal.name} for {formatMoney(showPurchaseModal.price)}
              </p>
              
              {/* Payment Method Display */}
              <div 
                className="rounded-xl p-4 mb-4"
                style={{ backgroundColor: '#f8f9fa' }}
              >
                <div className="text-sm mb-2" style={{ color: '#666' }}>Payment Method:</div>
                {financialData.bankBalance >= showPurchaseModal.price ? (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-green-700">Bank Account</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-blue-700">💳 Credit Card</span>
                  </div>
                )}
                
                <div className="text-sm" style={{ color: '#666' }}>After purchase:</div>
                {financialData.bankBalance >= showPurchaseModal.price ? (
                  <div className="font-semibold" style={{ color: '#3a3a3a' }}>
                    Bank Balance: {formatMoney(financialData.bankBalance - showPurchaseModal.price)}
                  </div>
                ) : (
                  <div>
                    <div className="font-semibold" style={{ color: '#3a3a3a' }}>
                      Bank Balance: {formatMoney(financialData.bankBalance)}
                    </div>
                    <div className="font-semibold text-blue-700">
                      Credit Used: {formatMoney((financialData.liabilities.find(l => l.category === 'credit_card')?.outstandingAmount || 0) + showPurchaseModal.price)}
                    </div>
                  </div>
                )}
                <div className="text-sm mt-1" style={{ color: '#9333EA' }}>
                  +{formatMoney(showPurchaseModal.passiveIncome || 0)}/month income
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(null)}
                  className="flex-1 py-3 rounded-xl font-medium text-white"
                  style={{ backgroundColor: '#EF4444' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmPurchase(showPurchaseModal)}
                  className="flex-1 py-3 rounded-xl font-medium text-white"
                  style={{ backgroundColor: '#22C55E' }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default StoreSection;