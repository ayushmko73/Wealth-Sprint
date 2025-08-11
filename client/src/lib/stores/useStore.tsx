import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { StoreItem } from '../data/storeItems';

export interface PurchasedItem {
  id: string;
  storeItemId: string;
  purchaseDate: Date;
  purchasePrice: number;
  item: StoreItem;
}

interface StoreState {
  purchasedItems: PurchasedItem[];
  
  // Actions
  purchaseItem: (item: StoreItem) => string; // Returns purchase ID
  getPurchasedItems: () => PurchasedItem[];
  getPurchasedItemsByCategory: (category: string) => PurchasedItem[];
  getTotalSpent: () => number;
  getTotalPassiveIncome: () => number;
}

export const useStore = create<StoreState>()(
  subscribeWithSelector((set, get) => ({
    purchasedItems: [],

    purchaseItem: (item: StoreItem) => {
      const purchaseId = `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const purchase: PurchasedItem = {
        id: purchaseId,
        storeItemId: item.id,
        purchaseDate: new Date(),
        purchasePrice: item.price,
        item: item,
      };

      set(state => ({
        purchasedItems: [...state.purchasedItems, purchase],
      }));

      return purchaseId;
    },

    getPurchasedItems: () => {
      return get().purchasedItems;
    },

    getPurchasedItemsByCategory: (category: string) => {
      return get().purchasedItems.filter(purchase => purchase.item.category === category);
    },

    getTotalSpent: () => {
      return get().purchasedItems.reduce((total, purchase) => total + purchase.purchasePrice, 0);
    },

    getTotalPassiveIncome: () => {
      return get().purchasedItems.reduce((total, purchase) => {
        return total + (purchase.item.passiveIncome || 0);
      }, 0);
    },
  }))
);