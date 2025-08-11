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
    <div className="min-h-screen bg-stone-50">
      {/* Minimal Header with Search */}
      <div className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-300 focus:border-stone-300 text-stone-700 placeholder-stone-400"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-stone-800 text-white' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {categoryIcons[category]}
              {category}
            </button>
          ))}
        </div>
        
        {/* Balance Display */}
        <div className="mt-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
          <div className="text-sm text-stone-500 mb-1">Available Balance</div>
          <div className="text-xl font-semibold text-stone-800">
            {formatMoney(financialData.bankBalance)}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-6 space-y-4">
        {filteredItems.map((item, index) => {
          const isPurchased = purchasedItems.some(p => p.storeItemId === item.id);
          const canAfford = financialData.bankBalance >= item.price;
          
          return (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-stone-200 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Product Icon */}
                <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  {item.image}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-stone-800 mb-1">
                        {item.name}
                      </h3>
                      <div className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                        {item.subtitle}
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-semibold text-stone-800">
                        {formatMoney(item.price)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Monthly Income */}
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium mb-2">
                    <Plus size={10} />
                    {formatMoney(item.monthlyIncome)}/mo
                  </div>
                  
                  <div className="text-sm text-stone-600 mb-3">
                    {item.description}
                  </div>
                  
                  {/* Purchase Button */}
                  {isPurchased ? (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg w-fit">
                      <CheckCircle size={14} />
                      <span className="text-sm font-medium">Owned</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        canAfford
                          ? 'bg-stone-800 text-white hover:bg-stone-900'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
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

      {/* Recent Purchases & Inventory */}
      <div className="bg-white border-t border-stone-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Recent Purchases */}
          <div>
            <h3 className="font-semibold text-stone-800 mb-4">Recent Purchases</h3>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.slice(0, 3).map((transaction, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-stone-50 rounded-lg border border-stone-200"
                  >
                    <div className="text-sm font-medium text-stone-700 mb-1">
                      {transaction.description}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-red-600">
                        {formatMoney(transaction.amount)}
                      </div>
                      <div className="text-xs text-stone-500">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="text-3xl mb-2">🛍️</div>
                  <div className="text-sm text-stone-500">No purchases yet</div>
                </div>
              )}
            </div>
          </div>

          {/* Inventory */}
          <div>
            <h4 className="font-semibold text-stone-800 mb-4">My Inventory</h4>
            <div className="grid grid-cols-6 gap-2">
              {purchasedItems.slice(0, 12).map((item, index) => (
                <div
                  key={index}
                  className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-sm border border-stone-200"
                >
                  {premiumStoreItems.find(si => si.id === item.storeItemId)?.image || '📦'}
                </div>
              ))}
              {purchasedItems.length === 0 && (
                <div className="col-span-6 text-center py-8">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-sm text-stone-500">Start shopping to build your inventory</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">{showPurchaseModal.image}</div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">
                Confirm Purchase
              </h3>
              <p className="text-stone-600 mb-6">
                {showPurchaseModal.name} for {formatMoney(showPurchaseModal.price)}
              </p>
              
              <div className="bg-stone-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-stone-600 mb-2">After purchase:</div>
                <div className="font-semibold text-stone-800">
                  Balance: {formatMoney(financialData.bankBalance - showPurchaseModal.price)}
                </div>
                <div className="text-sm text-green-600">
                  Monthly income: +{formatMoney(showPurchaseModal.monthlyIncome)}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(null)}
                  className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmPurchase(showPurchaseModal)}
                  className="flex-1 px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors font-medium"
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