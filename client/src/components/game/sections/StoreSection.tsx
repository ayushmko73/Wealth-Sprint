import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { useStore } from '../../../lib/stores/useStore';
import { storeItems, StoreItem } from '../../../lib/data/storeItems';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../ui/alert-dialog';
import { formatMoney } from '../../../lib/utils/formatMoney';
import { 
  ShoppingCart, 
  DollarSign, 
  ArrowLeft,
  Home,
  Car,
  Building2,
  Smartphone,
  TrendingUp,
  GamepadIcon,
  Search,
  Filter,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

const StoreSection: React.FC = () => {
  const { financialData, addTransaction, updateFinancialData } = useWealthSprintGame();
  const { purchaseItem, getPurchasedItems } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState<StoreItem | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState<StoreItem | null>(null);

  const categoryIcons: Record<string, React.ReactNode> = {
    all: <ShoppingCart size={20} />,
    property: <Home size={20} />,
    vehicle: <Car size={20} />,
    business: <Building2 size={20} />,
    gadget: <Smartphone size={20} />,
    investment: <TrendingUp size={20} />,
    entertainment: <GamepadIcon size={20} />,
  };

  const categoryColors: Record<string, string> = {
    property: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    vehicle: 'bg-green-100 text-green-800 hover:bg-green-200',
    business: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    gadget: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    investment: 'bg-red-100 text-red-800 hover:bg-red-200',
    entertainment: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
  };

  const filteredItems = storeItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePurchase = (item: StoreItem) => {
    if (financialData.bankBalance < item.price) {
      toast.error('Not enough funds');
      return;
    }
    
    setShowConfirmDialog(item);
  };

  const confirmPurchase = (item: StoreItem) => {
    try {
      // Deduct amount from bank balance
      updateFinancialData({
        bankBalance: financialData.bankBalance - item.price,
      });

      // Add to purchased items
      const purchaseId = purchaseItem(item);

      // Add transaction to history
      addTransaction({
        type: 'store_purchase',
        amount: -item.price,
        description: `Store purchase: ${item.name}`,
        fromAccount: 'bank',
        toAccount: 'business',
      });

      setShowConfirmDialog(null);
      setShowSuccessDialog(item);

      toast.success(`Successfully purchased ${item.name}!`);
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    }
  };

  const categories = ['all', ...Array.from(new Set(storeItems.map(item => item.category)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart size={24} className="text-green-600" />
              <CardTitle className="text-2xl text-[#3a3a3a]">Store</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                <DollarSign size={16} className="text-green-600" />
                <span className="font-semibold text-green-800">
                  {formatMoney(financialData.bankBalance)}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 capitalize ${
                    selectedCategory === category 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'hover:bg-green-50'
                  }`}
                >
                  {categoryIcons[category]}
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-600">Total Items</div>
              <div className="text-2xl font-bold text-blue-800">{storeItems.length}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-semibold text-green-600">Showing</div>
              <div className="text-2xl font-bold text-green-800">{filteredItems.length}</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-600">Purchased</div>
              <div className="text-2xl font-bold text-purple-800">{getPurchasedItems().length}</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="font-semibold text-orange-600">Available</div>
              <div className="text-2xl font-bold text-orange-800">{storeItems.length - getPurchasedItems().length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const isPurchased = getPurchasedItems().some(p => p.storeItemId === item.id);
          const canAfford = financialData.bankBalance >= item.price;
          
          return (
            <Card 
              key={item.id} 
              className={`hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                isPurchased ? 'bg-gray-50 border-gray-300' : 'hover:border-green-300'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <Badge 
                    className={`capitalize ${categoryColors[item.category] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {item.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-[#3a3a3a] leading-tight">
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 h-12 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      {formatMoney(item.price)}
                    </span>
                    {item.passiveIncome && (
                      <div className="text-xs text-green-500">
                        +{formatMoney(item.passiveIncome)}/mo
                      </div>
                    )}
                  </div>
                  
                  {isPurchased ? (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg">
                      <CheckCircle size={16} />
                      <span className="text-sm font-medium">Purchased</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford}
                      className={`w-full ${
                        canAfford 
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Buy Now' : 'Insufficient Funds'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <AlertDialog open={true} onOpenChange={() => setShowConfirmDialog(null)}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-[#3a3a3a]">
                Confirm Purchase
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl">{showConfirmDialog.icon}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{showConfirmDialog.name}</div>
                      <div className="text-sm text-gray-600">{showConfirmDialog.description}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Price:</div>
                      <div className="font-semibold text-red-600">-{formatMoney(showConfirmDialog.price)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Remaining Balance:</div>
                      <div className="font-semibold text-green-600">
                        {formatMoney(financialData.bankBalance - showConfirmDialog.price)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded">
                    This purchase will be recorded in your transaction history.
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => confirmPurchase(showConfirmDialog)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Confirm Purchase
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <Dialog open={true} onOpenChange={() => setShowSuccessDialog(null)}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold text-green-600">
                Purchase Successful!
              </DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4 py-4">
              <div className="text-6xl">{showSuccessDialog.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{showSuccessDialog.name}</h3>
                <p className="text-sm text-gray-600">{showSuccessDialog.description}</p>
              </div>
              
              {showSuccessDialog.passiveIncome && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">
                    Passive Income: +{formatMoney(showSuccessDialog.passiveIncome)}/month
                  </div>
                </div>
              )}
              
              <Button 
                onClick={() => setShowSuccessDialog(null)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Continue Shopping
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StoreSection;