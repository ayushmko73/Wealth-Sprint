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
  Clock,
  Star,
  Plus,
  X,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

const premiumStoreItems = [
  {
    id: 'small-apartment',
    name: 'Small Apartment',
    subtitle: 'RESIDENTIAL PROPERTY',
    price: 45000,
    monthlyIncome: 500,
    category: 'Real Estate',
    image: '🏠',
    description: 'Cozy starter home in prime location',
    tier: 'starter'
  },
  {
    id: 'luxury-villa',
    name: 'Luxury Villa',
    subtitle: 'PREMIUM RESIDENCE',
    price: 250000,
    monthlyIncome: 5000,
    category: 'Real Estate',
    image: '🏰',
    description: 'Exclusive villa with premium amenities',
    tier: 'premium'
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop Business',
    subtitle: 'FOOD & BEVERAGE',
    price: 80000,
    monthlyIncome: 1200,
    category: 'Businesses',
    image: '☕',
    description: 'Trendy coffee shop in busy district',
    tier: 'growth'
  },
  {
    id: 'delivery-van',
    name: 'Delivery Van',
    subtitle: 'COMMERCIAL VEHICLE',
    price: 25000,
    monthlyIncome: 400,
    category: 'Transport',
    image: '🚐',
    description: 'Reliable van for delivery services',
    tier: 'starter'
  },
  {
    id: 'motorbike',
    name: 'Motorbike',
    subtitle: 'PERSONAL TRANSPORT',
    price: 12000,
    monthlyIncome: 90,
    category: 'Transport',
    image: '🏍️',
    description: 'Fast and efficient city transport',
    tier: 'starter'
  },
  {
    id: 'laptop',
    name: 'High-End Laptop',
    subtitle: 'PROFESSIONAL TECH',
    price: 3500,
    monthlyIncome: 30,
    category: 'Tech',
    image: '💻',
    description: 'Powerful laptop for work and gaming',
    tier: 'starter'
  }
];

const StoreSection: React.FC = () => {
  const { financialData, addTransaction, updateFinancialData } = useWealthSprintGame();
  const { purchaseItem, getPurchasedItems } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const categories = ['All', 'Real Estate', 'Transport', 'Businesses', 'Tech'];
  
  const categoryIcons: Record<string, React.ReactNode> = {
    'All': <Star size={16} />,
    'Real Estate': <Home size={16} />,
    'Transport': <Car size={16} />,
    'Businesses': <Building2 size={16} />,
    'Tech': <Smartphone size={16} />
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
      toast.success(`Successfully purchased ${item.name}!`);
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    }
  };

  const purchasedItems = getPurchasedItems();
  const totalInvestment = purchasedItems.reduce((sum, item) => sum + item.price, 0);
  const monthlyIncome = purchasedItems.reduce((sum, item) => sum + item.passiveIncome, 0);

  const tierColors = {
    starter: '#DEB887',
    growth: '#CD853F', 
    premium: '#B8860B'
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      
      {/* Modern Header */}
      <div 
        className="sticky top-0 z-10 backdrop-blur-md border-b"
        style={{ 
          backgroundColor: 'rgba(245, 241, 232, 0.95)',
          borderBottomColor: '#E5D3B3'
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              Marketplace
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                className="p-2 rounded-xl transition-colors"
                style={{ backgroundColor: '#E5D3B3', color: '#8B4513' }}
              >
                <Filter size={16} />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#A0522D' }} />
            <input
              type="text"
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-0 outline-0"
              style={{ 
                backgroundColor: '#FFF8DC',
                color: '#8B4513'
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div 
            className="p-3 rounded-xl text-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
          >
            <div className="text-lg font-bold" style={{ color: '#8B4513' }}>
              {formatMoney(financialData.bankBalance)}
            </div>
            <div className="text-xs" style={{ color: '#A0522D' }}>Available</div>
          </div>
          <div 
            className="p-3 rounded-xl text-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
          >
            <div className="text-lg font-bold" style={{ color: '#228B22' }}>
              {formatMoney(monthlyIncome)}
            </div>
            <div className="text-xs" style={{ color: '#A0522D' }}>Monthly</div>
          </div>
          <div 
            className="p-3 rounded-xl text-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
          >
            <div className="text-lg font-bold" style={{ color: '#8B4513' }}>
              {purchasedItems.length}
            </div>
            <div className="text-xs" style={{ color: '#A0522D' }}>Owned</div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all"
              style={{
                backgroundColor: selectedCategory === category ? '#8B4513' : 'rgba(255, 255, 255, 0.8)',
                color: selectedCategory === category ? 'white' : '#8B4513',
                border: `1px solid ${selectedCategory === category ? '#8B4513' : '#E5D3B3'}`
              }}
            >
              {categoryIcons[category]}
              {category}
            </button>
          ))}
        </div>

        {/* Product Cards */}
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isPurchased = purchasedItems.some(p => p.storeItemId === item.id);
            const canAfford = financialData.bankBalance >= item.price;
            const roi = ((item.monthlyIncome * 12) / item.price * 100);
            
            return (
              <div
                key={item.id}
                className="rounded-xl p-4 border transition-all hover:shadow-sm"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderColor: '#E5D3B3'
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Icon & Tier Indicator */}
                  <div className="relative">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: '#FFF8DC' }}
                    >
                      {item.image}
                    </div>
                    <div 
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                      style={{ backgroundColor: tierColors[item.tier as keyof typeof tierColors] }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-semibold text-base" style={{ color: '#8B4513' }}>
                          {item.name}
                        </h3>
                        <p className="text-xs font-medium" style={{ color: '#A0522D' }}>
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg" style={{ color: '#8B4513' }}>
                          {formatMoney(item.price)}
                        </div>
                        <div className="text-xs" style={{ color: '#228B22' }}>
                          {roi.toFixed(1)}% ROI
                        </div>
                      </div>
                    </div>
                    
                    {/* Income Badge */}
                    <div 
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2"
                      style={{ backgroundColor: 'rgba(34, 139, 34, 0.1)', color: '#228B22' }}
                    >
                      <TrendingUp size={10} />
                      {formatMoney(item.monthlyIncome)}/month
                    </div>
                    
                    <p className="text-sm mb-3" style={{ color: '#8B7355' }}>
                      {item.description}
                    </p>
                    
                    {/* Action Button */}
                    {isPurchased ? (
                      <div 
                        className="flex items-center gap-2 px-3 py-2 rounded-xl w-fit"
                        style={{ backgroundColor: 'rgba(34, 139, 34, 0.1)', color: '#228B22' }}
                      >
                        <CheckCircle size={14} />
                        <span className="text-sm font-medium">Owned</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        style={{
                          backgroundColor: canAfford ? '#8B4513' : '#D3D3D3',
                          color: canAfford ? 'white' : '#888888'
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

        {/* Portfolio Summary */}
        {purchasedItems.length > 0 && (
          <div 
            className="mt-6 p-4 rounded-xl border"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: '#E5D3B3'
            }}
          >
            <h3 className="font-semibold mb-3" style={{ color: '#8B4513' }}>Your Portfolio</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm" style={{ color: '#A0522D' }}>Total Investment</div>
                <div className="font-bold text-lg" style={{ color: '#8B4513' }}>
                  {formatMoney(totalInvestment)}
                </div>
              </div>
              <div>
                <div className="text-sm" style={{ color: '#A0522D' }}>Monthly Income</div>
                <div className="font-bold text-lg" style={{ color: '#228B22' }}>
                  {formatMoney(monthlyIncome)}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {purchasedItems.slice(0, 8).map((item, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ backgroundColor: '#FFF8DC' }}
                >
                  {premiumStoreItems.find(si => si.id === item.storeItemId)?.image || '📦'}
                </div>
              ))}
              {purchasedItems.length > 8 && (
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: '#E5D3B3', color: '#8B4513' }}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-2xl p-6 max-w-sm w-full relative"
            style={{ backgroundColor: '#FFF8DC' }}
          >
            <button
              onClick={() => setShowPurchaseModal(null)}
              className="absolute top-4 right-4 p-1 rounded-full"
              style={{ backgroundColor: '#E5D3B3', color: '#8B4513' }}
            >
              <X size={16} />
            </button>
            
            <div className="text-center">
              <div className="text-4xl mb-3">{showPurchaseModal.image}</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#8B4513' }}>
                Confirm Purchase
              </h3>
              <p className="mb-4" style={{ color: '#A0522D' }}>
                {showPurchaseModal.name} for {formatMoney(showPurchaseModal.price)}
              </p>
              
              <div 
                className="rounded-xl p-3 mb-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              >
                <div className="text-sm mb-1" style={{ color: '#A0522D' }}>After purchase:</div>
                <div className="font-semibold" style={{ color: '#8B4513' }}>
                  Balance: {formatMoney(financialData.bankBalance - showPurchaseModal.price)}
                </div>
                <div className="text-sm" style={{ color: '#228B22' }}>
                  +{formatMoney(showPurchaseModal.monthlyIncome)}/month income
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(null)}
                  className="flex-1 py-2 rounded-xl font-medium"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#8B4513' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmPurchase(showPurchaseModal)}
                  className="flex-1 py-2 rounded-xl font-medium text-white"
                  style={{ backgroundColor: '#8B4513' }}
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