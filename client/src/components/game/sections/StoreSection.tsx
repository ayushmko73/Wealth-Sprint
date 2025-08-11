import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { useStore } from '../../../lib/stores/useStore';
import { formatMoney } from '../../../lib/utils/formatMoney';
import { 
  Search, 
  Home, 
  Car, 
  Building2, 
  Smartphone, 
  Gamepad2,
  Coins,
  Info,
  CheckCircle,
  Clock,
  Star,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

// Premium store items with the exact data you specified
const premiumStoreItems = [
  {
    id: 'small-apartment',
    name: 'Small Apartment',
    subtitle: 'RESIDENTIAL PROPERTY',
    price: 45000,
    monthlyIncome: 500,
    category: 'Real Estate',
    image: '🏠',
    description: 'Cozy starter home in prime location'
  },
  {
    id: 'luxury-villa',
    name: 'Luxury Villa',
    subtitle: 'PREMIUM RESIDENCE',
    price: 250000,
    monthlyIncome: 5000,
    category: 'Real Estate',
    image: '🏰',
    description: 'Exclusive villa with premium amenities'
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop Business',
    subtitle: 'FOOD & BEVERAGE',
    price: 80000,
    monthlyIncome: 1200,
    category: 'Businesses',
    image: '☕',
    description: 'Trendy coffee shop in busy district'
  },
  {
    id: 'delivery-van',
    name: 'Delivery Van',
    subtitle: 'COMMERCIAL VEHICLE',
    price: 25000,
    monthlyIncome: 400,
    category: 'Transport',
    image: '🚐',
    description: 'Reliable van for delivery services'
  },
  {
    id: 'motorbike',
    name: 'Motorbike',
    subtitle: 'PERSONAL TRANSPORT',
    price: 12000,
    monthlyIncome: 90,
    category: 'Transport',
    image: '🏍️',
    description: 'Fast and efficient city transport'
  },
  {
    id: 'laptop',
    name: 'High-End Laptop',
    subtitle: 'PROFESSIONAL TECH',
    price: 3500,
    monthlyIncome: 30,
    category: 'Tech',
    image: '💻',
    description: 'Powerful laptop for work and gaming'
  },
  {
    id: 'arcade-machine',
    name: 'Arcade Machine',
    subtitle: 'ENTERTAINMENT',
    price: 5000,
    monthlyIncome: 120,
    category: 'Lifestyle',
    image: '🕹️',
    description: 'Classic arcade machine for entertainment'
  },
  {
    id: 'solar-plant',
    name: 'Solar Power Plant',
    subtitle: 'RENEWABLE ENERGY',
    price: 120000,
    monthlyIncome: 2400,
    category: 'Businesses',
    image: '🔋',
    description: 'Clean energy generation facility'
  },
  {
    id: 'drone',
    name: 'Drone',
    subtitle: 'AERIAL TECH',
    price: 2200,
    monthlyIncome: 20,
    category: 'Tech',
    image: '🚁',
    description: 'Professional drone with 4K camera'
  },
  {
    id: 'fast-food-franchise',
    name: 'Fast Food Franchise',
    subtitle: 'RESTAURANT CHAIN',
    price: 150000,
    monthlyIncome: 2200,
    category: 'Businesses',
    image: '🍔',
    description: 'Popular fast food franchise outlet'
  },
  {
    id: 'billboard',
    name: 'Advertisement Billboard',
    subtitle: 'MARKETING ASSET',
    price: 9000,
    monthlyIncome: 300,
    category: 'Businesses',
    image: '📺',
    description: 'Prime location advertising billboard'
  },
  {
    id: 'art-gallery',
    name: 'Art Gallery Collection',
    subtitle: 'FINE ARTS',
    price: 70000,
    monthlyIncome: 800,
    category: 'Lifestyle',
    image: '🎨',
    description: 'Curated collection of fine artworks'
  }
];

const StoreSection: React.FC = () => {
  const { financialData, addTransaction, updateFinancialData } = useWealthSprintGame();
  const { purchaseItem, getPurchasedItems } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState<any>(null);

  const categories = ['All', 'Real Estate', 'Transport', 'Businesses', 'Tech', 'Lifestyle'];
  
  const categoryIcons: Record<string, React.ReactNode> = {
    'All': <Star size={18} />,
    'Real Estate': <Home size={18} />,
    'Transport': <Car size={18} />,
    'Businesses': <Building2 size={18} />,
    'Tech': <Smartphone size={18} />,
    'Lifestyle': <Gamepad2 size={18} />
  };

  const filteredItems = premiumStoreItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
      toast.success(`Purchase successful — ${item.name}`, {
        style: {
          background: '#10B981',
          color: 'white',
          border: 'none'
        }
      });
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    }
  };

  const recentTransactions = financialData.transactionHistory
    .filter(t => t.type === 'store_purchase')
    .slice(0, 5)
    .reverse();

  const purchasedItems = getPurchasedItems();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF4E6' }}>
      {/* Header with Search */}
      <div className="px-4 py-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: '#D2B48C' }} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-0 outline-0 text-base"
            style={{ 
              backgroundColor: '#FAEBD7',
              color: '#8B4513'
            }}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-4 py-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl whitespace-nowrap text-sm font-medium transition-all duration-300"
              style={{
                backgroundColor: selectedCategory === category ? '#8B4513' : '#FAEBD7',
                color: selectedCategory === category ? 'white' : '#8B4513',
                border: `1px solid ${selectedCategory === category ? '#8B4513' : '#DDD'}`
              }}
            >
              {categoryIcons[category]}
              {category}
            </button>
          ))}
        </div>
        
        {/* Balance Display */}
        <div 
          className="mt-4 p-4 rounded-2xl"
          style={{ backgroundColor: '#FAEBD7', border: '1px solid #DDD' }}
        >
          <div className="text-sm mb-1" style={{ color: '#A0522D' }}>Available Balance</div>
          <div className="text-xl font-semibold" style={{ color: '#8B4513' }}>
            {formatMoney(financialData.bankBalance)}
          </div>
        </div>
      </div>

      {/* Product Cards */}
      <div className="p-4 space-y-3">
        {filteredItems.map((item, index) => {
          const isPurchased = purchasedItems.some(p => p.storeItemId === item.id);
          const canAfford = financialData.bankBalance >= item.price;
          
          return (
            <div
              key={item.id}
              className="rounded-2xl p-4 border"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E5E5E5'
              }}
            >
              <div className="flex items-start gap-4">
                {/* Product Icon */}
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: '#FAEBD7' }}
                >
                  {item.image}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1" style={{ color: '#8B4513' }}>
                        {item.name}
                      </h3>
                      <div className="text-xs font-medium uppercase tracking-wide" style={{ color: '#A0522D' }}>
                        {item.subtitle}
                      </div>
                    </div>
                    
                    <div className="text-lg font-semibold" style={{ color: '#8B4513' }}>
                      {formatMoney(item.price)}
                    </div>
                  </div>
                  
                  {/* Monthly Income */}
                  <div 
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
                    style={{ 
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      color: '#047857'
                    }}
                  >
                    <Plus size={10} />
                    {formatMoney(item.monthlyIncome)}/mo
                  </div>
                  
                  <div className="text-sm mb-3" style={{ color: '#8B7355' }}>
                    {item.description}
                  </div>
                  
                  {/* Purchase Button */}
                  {isPurchased ? (
                    <div 
                      className="flex items-center gap-2 px-4 py-2 rounded-2xl w-fit"
                      style={{ 
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        color: '#047857'
                      }}
                    >
                      <CheckCircle size={14} />
                      <span className="text-sm font-medium">Owned</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford}
                      className="px-6 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300"
                      style={{
                        backgroundColor: canAfford ? '#8B4513' : '#D3D3D3',
                        color: canAfford ? 'white' : '#888888'
                      }}
                    >
                      {canAfford ? 'Buy now' : 'Insufficient Funds'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Purchases & Inventory */}
      <div 
        className="p-4 border-t"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderTop: '1px solid #E5E5E5' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Recent Purchases */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#8B4513' }}>Recent Purchases</h3>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.slice(0, 3).map((transaction, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-2xl border"
                    style={{ backgroundColor: '#FAEBD7', border: '1px solid #DDD' }}
                  >
                    <div className="text-sm font-medium mb-1" style={{ color: '#8B4513' }}>
                      {transaction.description}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold" style={{ color: '#DC2626' }}>
                        {formatMoney(transaction.amount)}
                      </div>
                      <div className="text-xs flex items-center gap-1" style={{ color: '#A0522D' }}>
                        <Clock size={10} />
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div 
                  className="text-center py-6 rounded-2xl border"
                  style={{ backgroundColor: '#FAEBD7', border: '1px solid #DDD' }}
                >
                  <div className="text-3xl mb-2">🛍️</div>
                  <div className="text-sm" style={{ color: '#A0522D' }}>No purchases yet</div>
                </div>
              )}
            </div>
          </div>

          {/* Inventory */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#8B4513' }}>My Inventory</h4>
            <div className="grid grid-cols-6 gap-2">
              {purchasedItems.slice(0, 12).map((item, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm border"
                  style={{ backgroundColor: '#FAEBD7', border: '1px solid #DDD' }}
                >
                  {premiumStoreItems.find(si => si.id === item.storeItemId)?.image || '📦'}
                </div>
              ))}
              {purchasedItems.length === 0 && (
                <div className="col-span-6 text-center py-6">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-sm" style={{ color: '#A0522D' }}>Start shopping to build your inventory</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border" style={{ backgroundColor: '#FAEBD7', border: '1px solid #DDD' }}>
            <div className="text-center">
              <div className="text-4xl mb-4">{showPurchaseModal.image}</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#8B4513' }}>
                Confirm Purchase
              </h3>
              <p className="mb-6" style={{ color: '#A0522D' }}>
                {showPurchaseModal.name} for {formatMoney(showPurchaseModal.price)}
              </p>
              
              <div 
                className="rounded-2xl p-4 mb-6 border"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', border: '1px solid #E5E5E5' }}
              >
                <div className="text-sm mb-2" style={{ color: '#A0522D' }}>After purchase:</div>
                <div className="font-semibold" style={{ color: '#8B4513' }}>
                  Balance: {formatMoney(financialData.bankBalance - showPurchaseModal.price)}
                </div>
                <div className="text-sm" style={{ color: '#047857' }}>
                  Monthly income: +{formatMoney(showPurchaseModal.monthlyIncome)}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(null)}
                  className="flex-1 px-4 py-3 border rounded-2xl font-medium"
                  style={{ backgroundColor: 'white', color: '#8B4513', border: '1px solid #DDD' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmPurchase(showPurchaseModal)}
                  className="flex-1 px-4 py-3 rounded-2xl font-medium text-white"
                  style={{ backgroundColor: '#8B4513' }}
                >
                  Confirm Purchase
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