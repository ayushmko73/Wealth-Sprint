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
  // Real Estate Properties
  {
    id: 'mumbai_2bhk',
    name: '2BHK Apartment in Mumbai',
    price: 7500000,
    description: 'Prime location apartment generating rental income',
    category: 'property',
    icon: '🏠',
    passiveIncome: 25000, // Monthly rental income
    maintenanceCost: 3000,
    appreciationRate: 8.5,
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
  // Vehicle Fleet
  {
    id: 'delivery_fleet',
    name: 'Delivery Vehicle Fleet',
    price: 1500000,
    description: '3 commercial vehicles for delivery business',
    category: 'vehicle',
    icon: '🚚',
    passiveIncome: 45000,
    maintenanceCost: 8000,
    appreciationRate: -10, // Depreciation
  },
  {
    id: 'luxury_car',
    name: 'Luxury Sedan',
    price: 2500000,
    description: 'Premium vehicle for executive transport service',
    category: 'vehicle',
    icon: '🚗',
    passiveIncome: 12000,
    maintenanceCost: 4000,
    appreciationRate: -15,
  },
  // Business Investments
  {
    id: 'tech_startup',
    name: 'Tech Startup Equity',
    price: 1000000,
    description: '15% stake in a growing fintech startup',
    category: 'business',
    icon: '🚀',
    passiveIncome: 0,
    maintenanceCost: 0,
    appreciationRate: 25,
  },
  {
    id: 'restaurant_chain',
    name: 'Restaurant Chain Franchise',
    price: 3500000,
    description: 'Multi-location food franchise with established brand',
    category: 'business',
    icon: '🍽️',
    passiveIncome: 85000,
    maintenanceCost: 15000,
    appreciationRate: 12,
  },
  // Investment Instruments
  {
    id: 'government_bonds',
    name: 'Government Bonds Portfolio',
    price: 500000,
    description: 'Safe government securities with fixed returns',
    category: 'investment',
    icon: '🏛️',
    passiveIncome: 3500,
    maintenanceCost: 0,
    appreciationRate: 0,
  },
  {
    id: 'mutual_funds',
    name: 'Equity Mutual Funds',
    price: 250000,
    description: 'Diversified equity portfolio managed by professionals',
    category: 'investment',
    icon: '📈',
    passiveIncome: 1800,
    maintenanceCost: 200,
    appreciationRate: 12,
  },
  // Intellectual Property
  {
    id: 'online_course',
    name: 'Online Course Revenue',
    price: 50000,
    description: 'Passive income from educational content',
    category: 'business',
    icon: '📚',
    passiveIncome: 12000,
    maintenanceCost: 1000,
    appreciationRate: 15,
  },
  {
    id: 'mobile_app',
    name: 'Mobile App with Ads',
    price: 150000,
    description: 'Revenue-generating mobile application',
    category: 'business',
    icon: '📱',
    passiveIncome: 8500,
    maintenanceCost: 2000,
    appreciationRate: 20,
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