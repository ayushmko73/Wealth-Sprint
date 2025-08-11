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
  ShoppingBag,
  TrendingUp,
  CheckCircle,
  Star,
  Plus,
  X,
  Filter,
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
  const [searchQuery, setSearchQuery] = useState('');
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
      toast.success(`Successfully purchased ${item.name}!`);
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    }
  };

  const purchasedItems = getPurchasedItems();
  const monthlyIncome = purchasedItems.reduce((sum, item) => sum + item.passiveIncome, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f3' }}>
      
      {/* Header */}
      <div className="p-4 border-b" style={{ backgroundColor: '#faf8f3', borderBottomColor: '#e8dcc6' }}>
        <h1 className="text-2xl font-bold mb-4" style={{ color: '#3a3a3a' }}>
          Store
        </h1>
        
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#999' }} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border-0 outline-0"
            style={{ 
              backgroundColor: '#ffffff',
              color: '#3a3a3a',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          />
        </div>

        {/* Balance Card */}
        <div 
          className="p-4 rounded-2xl"
          style={{ 
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm mb-1" style={{ color: '#666' }}>Available Balance</div>
              <div className="text-xl font-bold" style={{ color: '#3a3a3a' }}>
                {formatMoney(financialData.bankBalance)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm mb-1" style={{ color: '#666' }}>Monthly Income</div>
              <div className="text-lg font-semibold" style={{ color: '#2E8B57' }}>
                {formatMoney(monthlyIncome)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="p-4" style={{ backgroundColor: '#faf8f3' }}>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl whitespace-nowrap text-sm font-medium transition-all"
              style={{
                backgroundColor: selectedCategory === category ? '#3a3a3a' : '#ffffff',
                color: selectedCategory === category ? 'white' : '#3a3a3a',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isPurchased = purchasedItems.some(p => p.storeItemId === item.id);
            const canAfford = financialData.bankBalance >= item.price;
            const roi = ((item.monthlyIncome * 12) / item.price * 100);
            
            return (
              <div
                key={item.id}
                className="rounded-2xl p-4 transition-all hover:shadow-md"
                style={{ 
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: '#faf8f3' }}
                  >
                    {item.image}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-base" style={{ color: '#3a3a3a' }}>
                          {item.name}
                        </h3>
                        <p className="text-sm" style={{ color: '#666' }}>
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg" style={{ color: '#3a3a3a' }}>
                          {formatMoney(item.price)}
                        </div>
                        <div className="text-xs" style={{ color: '#2E8B57' }}>
                          {roi.toFixed(1)}% ROI
                        </div>
                      </div>
                    </div>
                    
                    {/* Monthly Income Badge */}
                    <div 
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-2"
                      style={{ backgroundColor: '#f0f8f4', color: '#2E8B57' }}
                    >
                      <Coins size={10} />
                      {formatMoney(item.monthlyIncome)}/month
                    </div>
                    
                    <p className="text-sm mb-3" style={{ color: '#666' }}>
                      {item.description}
                    </p>
                    
                    {/* Action Button */}
                    {isPurchased ? (
                      <div 
                        className="flex items-center gap-2 px-3 py-2 rounded-2xl w-fit"
                        style={{ backgroundColor: '#f0f8f4', color: '#2E8B57' }}
                      >
                        <CheckCircle size={14} />
                        <span className="text-sm font-medium">Owned</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all"
                        style={{
                          backgroundColor: canAfford ? '#3a3a3a' : '#e8dcc6',
                          color: canAfford ? 'white' : '#999999'
                        }}
                      >
                        <ShoppingBag size={14} />
                        {canAfford ? 'Purchase' : 'Insufficient Funds'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Portfolio Overview */}
        {purchasedItems.length > 0 && (
          <div 
            className="mt-6 p-4 rounded-2xl"
            style={{ 
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <h3 className="font-semibold mb-3" style={{ color: '#3a3a3a' }}>Your Assets</h3>
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: '#666' }}>Total Items</span>
              <span className="font-semibold" style={{ color: '#3a3a3a' }}>
                {purchasedItems.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: '#666' }}>Monthly Income</span>
              <span className="font-semibold" style={{ color: '#2E8B57' }}>
                {formatMoney(monthlyIncome)}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {purchasedItems.slice(0, 8).map((item, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm"
                  style={{ backgroundColor: '#faf8f3' }}
                >
                  {storeItems.find(si => si.id === item.storeItemId)?.image || '📦'}
                </div>
              ))}
              {purchasedItems.length > 8 && (
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: '#e8dcc6', color: '#666' }}
                >
                  +{purchasedItems.length - 8}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-2xl p-6 max-w-sm w-full relative"
            style={{ backgroundColor: '#ffffff' }}
          >
            <button
              onClick={() => setShowPurchaseModal(null)}
              className="absolute top-4 right-4 p-1 rounded-full"
              style={{ backgroundColor: '#f5f5f5', color: '#666' }}
            >
              <X size={16} />
            </button>
            
            <div className="text-center">
              <div className="text-4xl mb-3">{showPurchaseModal.image}</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#3a3a3a' }}>
                Confirm Purchase
              </h3>
              <p className="mb-4" style={{ color: '#666' }}>
                {showPurchaseModal.name} for {formatMoney(showPurchaseModal.price)}
              </p>
              
              <div 
                className="rounded-2xl p-4 mb-4"
                style={{ backgroundColor: '#faf8f3' }}
              >
                <div className="text-sm mb-2" style={{ color: '#666' }}>After purchase:</div>
                <div className="font-semibold" style={{ color: '#3a3a3a' }}>
                  Balance: {formatMoney(financialData.bankBalance - showPurchaseModal.price)}
                </div>
                <div className="text-sm" style={{ color: '#2E8B57' }}>
                  +{formatMoney(showPurchaseModal.monthlyIncome)}/month income
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(null)}
                  className="flex-1 py-2 rounded-2xl font-medium"
                  style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmPurchase(showPurchaseModal)}
                  className="flex-1 py-2 rounded-2xl font-medium text-white"
                  style={{ backgroundColor: '#3a3a3a' }}
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