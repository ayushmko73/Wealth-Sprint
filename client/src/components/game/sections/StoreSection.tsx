import React, { useState, useEffect } from 'react';
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
  Star,
  Sparkles,
  TrendingUp,
  Heart,
  Flame,
  Zap,
  ShoppingBag,
  X
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
  const [isLoading, setIsLoading] = useState(false);
  const [pulsingItems, setPulsingItems] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [celebrateMode, setCelebrateMode] = useState(false);

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

  // Add dynamic effects
  useEffect(() => {
    const interval = setInterval(() => {
      const randomItem = premiumStoreItems[Math.floor(Math.random() * premiumStoreItems.length)];
      setPulsingItems(prev => new Set(Array.from(prev).concat([randomItem.id])));
      setTimeout(() => {
        setPulsingItems(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.delete(randomItem.id);
          return newSet;
        });
      }, 3000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handlePurchase = (item: any) => {
    if (financialData.bankBalance < item.price) {
      // Add shake animation for insufficient funds
      const button = document.querySelector(`[data-item="${item.id}"] button`);
      if (button) {
        button.classList.add('animate-pulse');
        setTimeout(() => button.classList.remove('animate-pulse'), 500);
      }
      toast.error('Insufficient funds for this purchase', {
        style: {
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          color: 'white',
          border: 'none'
        }
      });
      return;
    }
    setShowPurchaseModal(item);
  };

  const confirmPurchase = async (item: any) => {
    try {
      setIsLoading(true);
      
      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

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

      // Celebration mode
      setCelebrateMode(true);
      setTimeout(() => setCelebrateMode(false), 2000);

      setShowPurchaseModal(null);
      setIsLoading(false);

      toast.success(`🎉 Purchase successful — ${item.name}`, {
        style: {
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: 'white',
          border: 'none',
          fontSize: '16px',
          padding: '16px'
        },
        duration: 4000
      });
    } catch (error) {
      setIsLoading(false);
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
          {categories.map((category, index) => {
            const itemCount = filteredItems.filter(item => category === 'All' || item.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 transform hover:scale-105 relative ${
                  selectedCategory === category
                    ? 'text-white shadow-lg' 
                    : 'text-slate-600 border border-amber-200/60 hover:shadow-md hover:border-amber-300/60'
                }`}
                style={{
                  background: selectedCategory === category 
                    ? 'linear-gradient(135deg, #2E7D4A 0%, #22C55E 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,252,232,0.95) 100%)',
                  animationDelay: `${index * 100}ms`
                }}
              >
                {categoryIcons[category]}
                <span className="font-semibold text-sm">{category}</span>
                {itemCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                    style={{
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      fontSize: '10px'
                    }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Bank Balance Display - Mobile */}
        <div className="mt-4 p-4 rounded-2xl shadow-lg relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,252,232,0.95) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.3)'
        }}>
          {celebrateMode && (
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-green-400/20 animate-pulse"></div>
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-amber-700/80 font-medium">Available Balance</div>
            <div className="flex items-center gap-1">
              <Coins size={16} className="text-amber-600" />
              <span className="text-xs text-amber-600 font-medium">Wallet</span>
            </div>
          </div>
          <div className="text-xl font-bold mb-2" style={{ color: '#1F2937' }}>
            {formatMoney(financialData.bankBalance)}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-2 bg-amber-200/50 rounded-full overflow-hidden">
              <div 
                className="h-2 bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${Math.min((financialData.bankBalance / 100000) * 100, 100)}%`,
                  animation: celebrateMode ? 'pulse 1s infinite' : 'none'
                }}
              ></div>
            </div>
            <TrendingUp size={14} className="text-emerald-500" />
          </div>
          <div className="text-xs text-slate-600">
            Next milestone: {formatMoney(100000)}
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
          
          const isPulsing = pulsingItems.has(item.id);
          const isHovered = hoveredCard === item.id;
          
          return (
            <div
              key={item.id}
              data-item={item.id}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`rounded-2xl p-4 shadow-lg transition-all duration-500 transform border border-amber-200/30 relative overflow-hidden ${
                isHovered ? 'shadow-2xl -translate-y-2 scale-[1.02]' : 'hover:shadow-xl hover:-translate-y-1'
              } ${isPulsing ? 'animate-pulse border-emerald-400/50' : ''}`}
              style={{ 
                background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,252,232,0.95) 100%), ${categoryGradients[item.category] || categoryGradients['Lifestyle']}`,
                boxShadow: isHovered 
                  ? '0 20px 40px rgba(212, 175, 55, 0.25), 0 0 20px rgba(34, 197, 94, 0.1)' 
                  : '0 8px 32px rgba(212, 175, 55, 0.15)'
              }}
            >
              {/* Popularity indicator */}
              {isPulsing && (
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white z-10"
                     style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
                  <Flame size={12} />
                  <span>Popular</span>
                </div>
              )}

              {/* Hover effects */}
              {isHovered && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white z-10"
                     style={{ background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)' }}>
                  <Heart size={12} />
                  <span>Trending</span>
                </div>
              )}

              <div className="flex items-start gap-4 relative z-10">
                {/* Product Image */}
                <div 
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0 transition-all duration-300 ${
                    isHovered ? 'scale-110 rotate-6' : ''
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #FEF7E0 0%, #FDF4E6 50%, #FCF1E0 100%)',
                    boxShadow: isHovered 
                      ? 'inset 0 2px 8px rgba(212, 175, 55, 0.3), 0 8px 16px rgba(212, 175, 55, 0.2)' 
                      : 'inset 0 2px 8px rgba(212, 175, 55, 0.2)'
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
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl w-fit shadow-sm animate-pulse"
                      style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.15) 100%)',
                        color: '#047857',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <CheckCircle size={14} />
                      <span className="font-bold text-sm">Owned</span>
                      <Sparkles size={12} className="animate-spin" />
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford}
                      className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 transform shadow-lg relative overflow-hidden group ${
                        canAfford
                          ? 'text-white hover:scale-105 active:scale-95'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      style={{
                        background: canAfford 
                          ? 'linear-gradient(135deg, #2E7D4A 0%, #22C55E 100%)'
                          : undefined
                      }}
                    >
                      {canAfford && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      )}
                      <span className="relative flex items-center justify-center gap-2">
                        {canAfford ? (
                          <>
                            <ShoppingBag size={16} />
                            Buy now
                          </>
                        ) : (
                          'Insufficient Funds'
                        )}
                      </span>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div 
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 animate-slideUp relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(254,252,232,0.98) 100%)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowPurchaseModal(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-200/80 rounded-full flex items-center justify-center hover:bg-gray-300/80 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Animated background */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500 animate-pulse"></div>
            
            <div className="text-center">
              <div className="text-7xl mb-4 animate-bounce">{showPurchaseModal.image}</div>
              <h3 className="font-serif text-2xl font-bold text-slate-800 mb-2">
                Confirm Purchase
              </h3>
              <p className="text-slate-600 mb-6 text-lg">
                {showPurchaseModal.name} for <span className="font-bold text-slate-800">{formatMoney(showPurchaseModal.price)}</span>
              </p>
              
              <div 
                className="rounded-2xl p-5 mb-6 border border-amber-200/50"
                style={{
                  background: 'linear-gradient(135deg, rgba(254, 252, 232, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%)'
                }}
              >
                <div className="text-sm text-amber-700 mb-3 font-medium">After purchase:</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-slate-600">New Balance</div>
                    <div className="font-bold text-lg text-emerald-600">
                      {formatMoney(financialData.bankBalance - showPurchaseModal.price)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-600">Monthly Income</div>
                    <div className="font-bold text-lg text-blue-600">
                      +{formatMoney(showPurchaseModal.monthlyIncome)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(null)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmPurchase(showPurchaseModal)}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-200 relative overflow-hidden ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #2E7D4A 0%, #22C55E 100%)',
                    color: 'white'
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Zap size={16} />
                      Confirm Purchase
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
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