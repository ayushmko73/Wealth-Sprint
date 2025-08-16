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
    passiveIncome: 1500,
    maintenanceCost: 500,
    appreciationRate: 8.5,
  },
  {
    id: 'luxury_villa',
    name: 'Luxury Villa',
    price: 250000,
    description: 'Spacious estate with pool and garden.',
    category: 'property',
    icon: '🏖️',
    passiveIncome: 8000,
    maintenanceCost: 2000,
    appreciationRate: 10,
  },
  {
    id: 'coffee_shop',
    name: 'Coffee Shop',
    price: 80000,
    description: 'A small café generating daily sales.',
    category: 'business',
    icon: '☕',
    passiveIncome: 2500,
    maintenanceCost: 800,
    appreciationRate: 12,
  },
  {
    id: 'delivery_van',
    name: 'Delivery Van',
    price: 25000,
    description: 'Medium-sized van for transporting goods.',
    category: 'vehicle',
    icon: '🚐',
    passiveIncome: 1800,
    maintenanceCost: 600,
    appreciationRate: -10,
  },
  {
    id: 'motorbike',
    name: 'Motorbike',
    price: 12000,
    description: 'Two-wheeler for quick city travel.',
    category: 'vehicle',
    icon: '🏍️',
    passiveIncome: 800,
    maintenanceCost: 300,
    appreciationRate: -15,
  },
  {
    id: 'laptop',
    name: 'Laptop',
    price: 3500,
    description: 'Boosts productivity for remote work.',
    category: 'gadget',
    icon: '💻',
    passiveIncome: 500,
    maintenanceCost: 100,
    appreciationRate: -20,
  },
  {
    id: 'arcade_machine',
    name: 'Arcade Machine',
    price: 5000,
    description: 'Fun gaming setup for home or rental.',
    category: 'entertainment',
    icon: '🕹️',
    passiveIncome: 150,
    maintenanceCost: 50,
    appreciationRate: -5,
  },
  {
    id: 'solar_power_plant',
    name: 'Solar Power Plant',
    price: 120000,
    description: 'Generates renewable electricity for resale.',
    category: 'investment',
    icon: '☀️',
    passiveIncome: 4500,
    maintenanceCost: 1000,
    appreciationRate: 8,
  },
  {
    id: 'fishing_boat',
    name: 'Fishing Boat',
    price: 40000,
    description: 'Ideal for fishing trips or small business.',
    category: 'vehicle',
    icon: '⛵',
    passiveIncome: 2200,
    maintenanceCost: 800,
    appreciationRate: -8,
  },
  {
    id: 'drone',
    name: 'Drone',
    price: 2200,
    description: 'Aerial photography and delivery potential.',
    category: 'gadget',
    icon: '🚁',
    passiveIncome: 300,
    maintenanceCost: 80,
    appreciationRate: -25,
  },
  {
    id: 'fast_food_stall',
    name: 'Fast Food Stall',
    price: 150000,
    description: 'Popular food stall with steady income.',
    category: 'business',
    icon: '🍔',
    passiveIncome: 6000,
    maintenanceCost: 1500,
    appreciationRate: 15,
  },
  {
    id: 'gym_equipment',
    name: 'Gym Equipment Set',
    price: 4000,
    description: 'Full setup for personal or commercial gym.',
    category: 'entertainment',
    icon: '🏋️',
    passiveIncome: 300,
    maintenanceCost: 100,
    appreciationRate: -10,
  },
  {
    id: 'smartwatch',
    name: 'Smart Watch',
    price: 600,
    description: 'Tracks fitness and sends notifications.',
    category: 'gadget',
    icon: '⌚',
    passiveIncome: 50,
    maintenanceCost: 20,
    appreciationRate: -30,
  },
  {
    id: 'advertising_billboard',
    name: 'Advertising Billboard',
    price: 9000,
    description: 'Earn revenue by renting ad space.',
    category: 'investment',
    icon: '📺',
    passiveIncome: 450,
    maintenanceCost: 100,
    appreciationRate: 5,
  },
  {
    id: 'art_gallery',
    name: 'Art Gallery',
    price: 70000,
    description: 'Display and sell high-value artwork.',
    category: 'investment',
    icon: '🎨',
    passiveIncome: 1800,
    maintenanceCost: 500,
    appreciationRate: 12,
  },
  {
    id: 'car',
    name: 'Car',
    price: 35000,
    description: 'Personal vehicle for daily transportation.',
    category: 'vehicle',
    icon: '🚗',
    passiveIncome: 1200,
    maintenanceCost: 400,
    appreciationRate: -12,
  },
  {
    id: 'commercial_office',
    name: 'Commercial Office Space',
    price: 12000000,
    description: 'Premium office space in business district',
    category: 'property',
    icon: '🏢',
    passiveIncome: 45000,
    maintenanceCost: 5000,
    appreciationRate: 10,
  },
  {
    id: 'warehouse_facility',
    name: 'Industrial Warehouse',
    price: 5000000,
    description: 'Large storage facility for logistics business',
    category: 'property',
    icon: '🏭',
    passiveIncome: 18000,
    maintenanceCost: 2500,
    appreciationRate: 6,
  },
  {
    id: 'delivery_fleet',
    name: 'Delivery Vehicle Fleet',
    price: 1500000,
    description: '3 commercial vehicles for delivery business',
    category: 'vehicle',
    icon: '🚚',
    passiveIncome: 45000,
    maintenanceCost: 8000,
    appreciationRate: -10,
  },
  {
    id: 'tesla',
    name: 'Tesla',
    price: 2500000,
    description: 'Premium electric vehicle with autopilot features',
    category: 'vehicle',
    icon: '⚡',
    passiveIncome: 15000,
    maintenanceCost: 3000,
    appreciationRate: -8,
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    price: 3500000,
    description: 'Full-service restaurant with established brand',
    category: 'business',
    icon: '🍽️',
    passiveIncome: 85000,
    maintenanceCost: 15000,
    appreciationRate: 12,
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

export const getCategoryStats = () => {
  const stats = storeItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { count: 0, totalValue: 0 };
    }
    acc[item.category].count += 1;
    acc[item.category].totalValue += item.price;
    return acc;
  }, {} as Record<string, { count: number; totalValue: number }>);
  
  return stats;
};