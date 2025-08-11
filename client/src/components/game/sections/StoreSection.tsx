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
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5DC' }}>
      {/* Top Search Bar */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-[#e8dcc6]">
        <div className="relative max-w-md mx-auto">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#e8dcc6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2E7D4A] focus:border-transparent"
          />
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        
        {/* Left Category Bar (20%) */}
        <div className="w-1/5 p-4 border-r border-[#e8dcc6]" style={{ backgroundColor: '#e8dcc6' }}>
          <h3 className="font-serif font-semibold text-lg mb-4 text-[#3a3a3a]">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#2E7D4A] text-white shadow-md'
                    : 'bg-white/60 hover:bg-white text-[#3a3a3a] hover:shadow-sm'
                }`}
              >
                {categoryIcons[category]}
                <span className="font-medium">{category}</span>
              </button>
            ))}
          </div>
          
          {/* Bank Balance Display */}
          <div className="mt-6 p-4 bg-white/80 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Available Balance</div>
            <div className="text-xl font-bold text-[#2E7D4A]">
              {formatMoney(financialData.bankBalance)}
            </div>
          </div>
        </div>

        {/* Middle Content Area (60%) */}
        <div className="w-3/5 overflow-y-auto p-4">
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const isPurchased = purchasedItems.some(p => p.storeItemId === item.id);
              const canAfford = financialData.bankBalance >= item.price;
              
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#e8dcc6]"
                  style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}
                >
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-[#F5F5DC] to-[#e8dcc6] rounded-xl flex items-center justify-center text-3xl shadow-inner">
                      {item.image}
                    </div>
                    
                    {/* Content Block */}
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-semibold text-[#3a3a3a] mb-1">
                        {item.name}
                      </h3>
                      <div className="text-xs text-[#6B21A8] font-semibold tracking-wider mb-2">
                        {item.subtitle}
                      </div>
                      
                      {/* Monthly Cashflow Pill */}
                      <div className="inline-flex items-center gap-2 bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full text-sm font-medium">
                        <Coins size={14} />
                        + {formatMoney(item.monthlyIncome)}
                      </div>
                      
                      <div className="text-sm text-gray-600 mt-2">
                        {item.description}
                      </div>
                    </div>
                    
                    {/* Right Price Area */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-[#3a3a3a]">
                          {formatMoney(item.price)}
                        </span>
                        <button className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white hover:bg-[#B8941F] transition-colors">
                          <Info size={12} />
                        </button>
                      </div>
                      
                      {isPurchased ? (
                        <div className="flex items-center gap-2 text-[#10B981] bg-[#10B981]/10 px-4 py-2 rounded-xl">
                          <CheckCircle size={16} />
                          <span className="font-medium">Owned</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePurchase(item)}
                          disabled={!canAfford}
                          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                            canAfford
                              ? 'bg-[#2E7D4A] hover:bg-[#236B3C] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
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
        </div>

        {/* Right Transaction & Inventory Panel (20%) */}
        <div className="w-1/5 p-4 border-l border-[#e8dcc6] bg-white/50">
          <h3 className="font-serif font-semibold text-lg mb-4 text-[#3a3a3a]">Recent Purchases</h3>
          
          <div className="space-y-3 mb-6">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-[#e8dcc6]">
                  <div className="text-sm font-medium text-[#3a3a3a] truncate">
                    {transaction.description}
                  </div>
                  <div className="text-red-600 font-semibold text-xs">
                    {formatMoney(transaction.amount)}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                No purchases yet
              </div>
            )}
          </div>

          <h4 className="font-serif font-semibold mb-3 text-[#3a3a3a]">My Inventory</h4>
          <div className="grid grid-cols-3 gap-2">
            {purchasedItems.slice(0, 9).map((item, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-gradient-to-br from-[#F5F5DC] to-[#e8dcc6] rounded-lg flex items-center justify-center text-lg shadow-sm"
              >
                {premiumStoreItems.find(si => si.id === item.storeItemId)?.image || '📦'}
              </div>
            ))}
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