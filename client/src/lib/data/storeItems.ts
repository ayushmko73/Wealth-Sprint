// Store Items Data for Wealth Sprint Game

export interface StoreItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'property' | 'vehicle' | 'business' | 'gadget' | 'investment' | 'entertainment';
  icon: string;
  image?: string;
  // Future expansion fields
  passiveIncome?: number;
  maintenanceCost?: number;
  appreciationRate?: number;
}

export const storeItems: StoreItem[] = [
  {
    id: 'small_apartment',
    name: 'Small Apartment',
    price: 45000,
    description: 'Compact city home with one bedroom.',
    category: 'property',
    icon: '🏠',
  },
  {
    id: 'luxury_villa',
    name: 'Luxury Villa',
    price: 250000,
    description: 'Spacious estate with pool and garden.',
    category: 'property',
    icon: '🏖️',
  },
  {
    id: 'coffee_shop',
    name: 'Coffee Shop Business',
    price: 80000,
    description: 'A small café generating daily sales.',
    category: 'business',
    icon: '☕',
    passiveIncome: 2500, // Monthly income
  },
  {
    id: 'delivery_van',
    name: 'Delivery Van',
    price: 25000,
    description: 'Medium-sized van for transporting goods.',
    category: 'vehicle',
    icon: '🚐',
  },
  {
    id: 'motorbike',
    name: 'Motorbike',
    price: 12000,
    description: 'Two-wheeler for quick city travel.',
    category: 'vehicle',
    icon: '🏍️',
  },
  {
    id: 'high_end_laptop',
    name: 'High-End Laptop',
    price: 3500,
    description: 'Boosts productivity for remote work.',
    category: 'gadget',
    icon: '💻',
  },
  {
    id: 'arcade_machine',
    name: 'Arcade Machine',
    price: 5000,
    description: 'Fun gaming setup for home or rental.',
    category: 'entertainment',
    icon: '🕹️',
    passiveIncome: 150, // Monthly rental income
  },
  {
    id: 'solar_power_plant',
    name: 'Solar Power Plant',
    price: 120000,
    description: 'Generates renewable electricity for resale.',
    category: 'investment',
    icon: '☀️',
    passiveIncome: 4500, // Monthly income
  },
  {
    id: 'fishing_boat',
    name: 'Fishing Boat',
    price: 40000,
    description: 'Ideal for fishing trips or small business.',
    category: 'vehicle',
    icon: '⛵',
  },
  {
    id: 'drone',
    name: 'Drone',
    price: 2200,
    description: 'Aerial photography and delivery potential.',
    category: 'gadget',
    icon: '🚁',
  },
  {
    id: 'fast_food_franchise',
    name: 'Fast Food Franchise',
    price: 150000,
    description: 'Popular chain outlet with steady income.',
    category: 'business',
    icon: '🍔',
    passiveIncome: 6000, // Monthly income
  },
  {
    id: 'gym_equipment',
    name: 'Gym Equipment Set',
    price: 4000,
    description: 'Full setup for personal or commercial gym.',
    category: 'entertainment',
    icon: '🏋️',
    passiveIncome: 300, // Monthly rental income
  },
  {
    id: 'smartwatch',
    name: 'Smartwatch',
    price: 600,
    description: 'Tracks fitness and sends notifications.',
    category: 'gadget',
    icon: '⌚',
  },
  {
    id: 'advertising_billboard',
    name: 'Advertising Billboard',
    price: 9000,
    description: 'Earn revenue by renting ad space.',
    category: 'investment',
    icon: '📺',
    passiveIncome: 450, // Monthly rental income
  },
  {
    id: 'art_gallery',
    name: 'Art Gallery Collection',
    price: 70000,
    description: 'Display and sell high-value artwork.',
    category: 'investment',
    icon: '🎨',
    passiveIncome: 1800, // Monthly income
  },
];

// Helper functions
export const getItemById = (id: string): StoreItem | undefined => {
  return storeItems.find(item => item.id === id);
};

export const getItemsByCategory = (category: string): StoreItem[] => {
  return storeItems.filter(item => item.category === category);
};

export const getCategories = (): string[] => {
  return Array.from(new Set(storeItems.map(item => item.category)));
};