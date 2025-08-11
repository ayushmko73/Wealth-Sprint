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
  Settings,
  Info,
  CheckCircle,
  Clock,
  Star
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
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #F5F5DC 0%, #F0EAD6 50%, #EBE5D1 100%)' 
    }}>
      {/* Top Search Bar */}
      <div className="p-4" style={{ 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,244,230,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(232, 220, 198, 0.3)'
      }}>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-3.5 text-amber-600/60" />
          <input
            type="text"
            placeholder="Search luxury items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/90 border border-amber-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 shadow-sm text-slate-700 placeholder-amber-600/60"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,252,232,0.95) 100%)'
            }}
          />
        </div>
      </div>

      {/* Mobile Category Scrollable Horizontal Bar */}
      <div className="px-4 py-3" style={{ 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.70) 0%, rgba(248,244,230,0.70) 100%)'
      }}>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'text-white shadow-lg' 
                  : 'text-slate-600 border border-amber-200/60 hover:shadow-md hover:border-amber-300/60'
              }`}
              style={{
                background: selectedCategory === category 
                  ? 'linear-gradient(135deg, #2E7D4A 0%, #22C55E 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,252,232,0.95) 100%)'
              }}
            >
              {categoryIcons[category]}
              <span className="font-semibold text-sm">{category}</span>
            </button>
          ))}
        </div>
        
        {/* Bank Balance Display - Mobile */}
        <div className="mt-4 p-4 rounded-2xl shadow-lg" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,252,232,0.95) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.3)'
        }}>
          <div className="text-sm text-amber-700/80 mb-1 font-medium">Available Balance</div>
          <div className="text-xl font-bold" style={{ color: '#1F2937' }}>
            {formatMoney(financialData.bankBalance)}
          </div>
          <div className="w-full h-1 bg-amber-200/50 rounded-full mt-2">
            <div className="h-1 bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Mobile Single Column */}
      <div className="p-4 space-y-4">
        {filteredItems.map((item, index) => {
          const isPurchased = purchasedItems.some(p => p.storeItemId === item.id);
          const canAfford = financialData.bankBalance >= item.price;
          
          // Dynamic gradient colors based on category
          const categoryGradients: Record<string, string> = {
            'Real Estate': 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%)',
            'Transport': 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(134, 239, 172, 0.05) 100%)',
            'Businesses': 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(196, 181, 253, 0.05) 100%)',
            'Tech': 'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(254, 215, 170, 0.05) 100%)',
            'Lifestyle': 'linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(251, 207, 232, 0.05) 100%)'
          };
          
          return (
            <div
              key={item.id}
              className="rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-amber-200/30"
              style={{ 
                background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,252,232,0.95) 100%), ${categoryGradients[item.category] || categoryGradients['Lifestyle']}`,
                boxShadow: '0 8px 32px rgba(212, 175, 55, 0.15)'
              }}
            >
              <div className="flex items-start gap-4">
                {/* Product Image */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #FEF7E0 0%, #FDF4E6 50%, #FCF1E0 100%)',
                    boxShadow: 'inset 0 2px 8px rgba(212, 175, 55, 0.2)'
                  }}
                >
                  {item.image}
                </div>
                
                {/* Content Block */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 pr-2">
                      <h3 className="font-serif text-lg font-bold text-slate-800 mb-1 line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="text-xs font-bold tracking-wider mb-2" style={{ color: '#7C3AED' }}>
                        {item.subtitle}
                      </div>
                    </div>
                    
                    {/* Price and Info Button */}
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-slate-800">
                          {formatMoney(item.price)}
                        </span>
                        <button 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-200 hover:scale-110"
                          style={{
                            background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)'
                          }}
                        >
                          <Info size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Monthly Cashflow Pill */}
                  <div 
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3 shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.15) 100%)',
                      color: '#047857',
                      border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    <Coins size={12} />
                    + {formatMoney(item.monthlyIncome)}
                  </div>
                  
                  <div className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                    {item.description}
                  </div>
                  
                  {/* Buy Button */}
                  {isPurchased ? (
                    <div 
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl w-fit shadow-sm"
                      style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.15) 100%)',
                        color: '#047857',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <CheckCircle size={14} />
                      <span className="font-bold text-sm">Owned</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford}
                      className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        canAfford
                          ? 'text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      style={{
                        background: canAfford 
                          ? 'linear-gradient(135deg, #2E7D4A 0%, #22C55E 100%)'
                          : undefined
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

      {/* Bottom Transaction & Inventory Panel - Mobile */}
      <div 
        className="p-5 mt-8 border-t"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.90) 0%, rgba(248,244,230,0.90) 100%)',
          borderTop: '1px solid rgba(212, 175, 55, 0.3)'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Recent Purchases */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-slate-800">Recent Purchases</h3>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.slice(0, 3).map((transaction, index) => (
                  <div 
                    key={index} 
                    className="rounded-xl p-4 shadow-md border border-amber-200/50"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,252,232,0.95) 100%)'
                    }}
                  >
                    <div className="text-sm font-semibold text-slate-700 truncate mb-1">
                      {transaction.description}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm" style={{ color: '#DC2626' }}>
                        {formatMoney(transaction.amount)}
                      </div>
                      <div className="text-xs text-amber-600 flex items-center gap-1 font-medium">
                        <Clock size={10} />
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div 
                  className="text-center py-6 rounded-xl border border-amber-200/50"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,252,232,0.95) 100%)'
                  }}
                >
                  <div className="text-4xl mb-2">🛍️</div>
                  <div className="text-sm text-slate-600 font-medium">No purchases yet</div>
                </div>
              )}
            </div>
          </div>

          {/* My Inventory */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4 text-slate-800">My Inventory</h4>
            <div className="grid grid-cols-6 gap-3">
              {purchasedItems.slice(0, 12).map((item, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-md transition-all duration-200 hover:scale-110 border border-amber-200/50"
                  style={{
                    background: 'linear-gradient(135deg, #FEF7E0 0%, #FDF4E6 50%, #FCF1E0 100%)'
                  }}
                >
                  {premiumStoreItems.find(si => si.id === item.storeItemId)?.image || '📦'}
                </div>
              ))}
              {purchasedItems.length === 0 && (
                <div className="col-span-6 text-center py-6">
                  <div className="text-4xl mb-2">📦</div>
                  <div className="text-sm text-slate-600 font-medium">Start shopping to build your inventory</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">{showPurchaseModal.image}</div>
              <h3 className="font-serif text-2xl font-semibold text-[#3a3a3a] mb-2">
                Confirm Purchase
              </h3>
              <p className="text-gray-600 mb-6">
                {showPurchaseModal.name} for {formatMoney(showPurchaseModal.price)}
              </p>
              
              <div className="bg-[#F5F5DC] rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 mb-2">After purchase:</div>
                <div className="font-semibold text-[#2E7D4A]">
                  Balance: {formatMoney(financialData.bankBalance - showPurchaseModal.price)}
                </div>
                <div className="text-sm text-[#10B981]">
                  Monthly income: +{formatMoney(showPurchaseModal.monthlyIncome)}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmPurchase(showPurchaseModal)}
                  className="flex-1 px-4 py-3 bg-[#2E7D4A] text-white rounded-xl hover:bg-[#236B3C] transition-colors font-semibold"
                >
                  Confirm Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreSection;