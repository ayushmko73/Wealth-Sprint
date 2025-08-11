import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { useStore } from '../../../lib/stores/useStore';
import { formatMoney } from '../../../lib/utils/formatMoney';
import { 
  Home, 
  Car, 
  Building2, 
  Smartphone,
  ShoppingBag,
  CheckCircle,
  Star,
  X,
  Coins
} from 'lucide-react';
import { toast } from 'sonner';

const storeItems = [
  {
    id: 'small-apartment',
    name: 'Small Apartment',
    subtitle: 'Residential Property',
    price: 45000,
    monthlyIncome: 500,
    category: 'Real Estate',
    image: '🏠',
    description: 'Cozy starter home in prime location'
  },
  {
    id: 'luxury-villa',
    name: 'Luxury Villa', 
    subtitle: 'Premium Residence',
    price: 250000,
    monthlyIncome: 5000,
    category: 'Real Estate',
    image: '🏰',
    description: 'Exclusive villa with premium amenities'
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    subtitle: 'Food & Beverage',
    price: 80000,
    monthlyIncome: 1200,
    category: 'Business',
    image: '☕',
    description: 'Trendy coffee shop in busy district'
  },
  {
    id: 'delivery-van',
    name: 'Delivery Van',
    subtitle: 'Commercial Vehicle',
    price: 25000,
    monthlyIncome: 400,
    category: 'Transport',
    image: '🚐',
    description: 'Reliable van for delivery services'
  },
  {
    id: 'motorbike',
    name: 'Motorbike',
    subtitle: 'Personal Transport',
    price: 12000,
    monthlyIncome: 90,
    category: 'Transport',
    image: '🏍️',
    description: 'Fast and efficient city transport'
  },
  {
    id: 'laptop',
    name: 'High-End Laptop',
    subtitle: 'Professional Tech',
    price: 3500,
    monthlyIncome: 30,
    category: 'Tech',
    image: '💻',
    description: 'Powerful laptop for work and gaming'
  }
];

const StoreSection: React.FC = () => {
  const { financialData, addTransaction, updateFinancialData } = useWealthSprintGame();
  const { purchaseItem, getPurchasedItems } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showPurchaseModal, setShowPurchaseModal] = useState<any>(null);

  const categories = ['All', 'Real Estate', 'Transport', 'Business', 'Tech'];
  
  const categoryIcons: Record<string, React.ReactNode> = {
    'All': <Star size={16} />,
    'Real Estate': <Home size={16} />,
    'Transport': <Car size={16} />,
    'Business': <Building2 size={16} />,
    'Tech': <Smartphone size={16} />
  };

  const filteredItems = storeItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesCategory;
  });

  const handlePurchase = (item: any) => {
    if (financialData.bankBalance < item.price) {
      toast.error('Insufficient funds for this purchase');
      return;
    }
    setShowPurchaseModal(item);
  };

  const confirmPurchase = (item: any) => {
    try {
      updateFinancialData({
        bankBalance: financialData.bankBalance - item.price,
      });

      purchaseItem({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category.toLowerCase(),
        description: item.description,
        icon: item.image,
        passiveIncome: item.monthlyIncome
      });

      addTransaction({
        type: 'store_purchase',
        amount: -item.price,
        description: `Store: ${item.name}`,
        fromAccount: 'bank',
        toAccount: 'business',
      });

      setShowPurchaseModal(null);
      toast.success(`Successfully purchased ${item.name}!`);
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all"
              style={{
                backgroundColor: selectedCategory === category ? '#4F9CF9' : '#faf8f3',
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
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isPurchased = purchasedItems.some(p => p.storeItemId === item.id);
            const canAfford = financialData.bankBalance >= item.price;
            const roi = ((item.monthlyIncome * 12) / item.price * 100);
            
            return (
              <div
                key={item.id}
                className="rounded-2xl p-4"
                style={{ 
                  backgroundColor: '#faf8f3',
                  border: '1px solid #e8dcc6'
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: '#e8dcc6' }}
                  >
                    {item.image}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: '#3a3a3a' }}>
                          {item.name}
                        </h3>
                        <p className="text-sm" style={{ color: '#666' }}>
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl" style={{ color: '#3a3a3a' }}>
                          {formatMoney(item.price)}
                        </div>
                        <div className="text-sm" style={{ color: '#d4af37' }}>
                          {roi.toFixed(1)}% ROI
                        </div>
                      </div>
                    </div>
                    
                    {/* Monthly Income Badge */}
                    <div 
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium mb-3"
                      style={{ backgroundColor: '#e8dcc6', color: '#3a3a3a' }}
                    >
                      <Coins size={12} />
                      {formatMoney(item.monthlyIncome)}/month
                    </div>
                    
                    <p className="text-sm mb-4" style={{ color: '#666' }}>
                      {item.description}
                    </p>
                    
                    {/* Action Button */}
                    {isPurchased ? (
                      <div 
                        className="flex items-center gap-2 px-4 py-2 rounded-lg w-fit"
                        style={{ backgroundColor: '#e8dcc6', color: '#3a3a3a' }}
                      >
                        <CheckCircle size={16} />
                        <span className="font-medium">Owned</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all"
                        style={{
                          backgroundColor: canAfford ? '#22C55E' : '#e8dcc6',
                          color: canAfford ? 'white' : '#999999'
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
            className="rounded-lg p-6 max-w-sm w-full relative"
            style={{ backgroundColor: '#faf8f3', border: '1px solid #e8dcc6' }}
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
              
              <div 
                className="rounded-lg p-4 mb-6"
                style={{ backgroundColor: '#e8dcc6' }}
              >
                <div className="text-sm mb-2" style={{ color: '#666' }}>After purchase:</div>
                <div className="font-semibold" style={{ color: '#3a3a3a' }}>
                  Balance: {formatMoney(financialData.bankBalance - showPurchaseModal.price)}
                </div>
                <div className="text-sm" style={{ color: '#3a3a3a' }}>
                  +{formatMoney(showPurchaseModal.monthlyIncome)}/month income
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(null)}
                  className="flex-1 py-3 rounded-lg font-medium"
                  style={{ backgroundColor: '#e8dcc6', color: '#3a3a3a' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmPurchase(showPurchaseModal)}
                  className="flex-1 py-3 rounded-lg font-medium text-white"
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