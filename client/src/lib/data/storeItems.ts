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
  // Unique abilities and disabilities
  abilities?: string[];
  disabilities?: string[];
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  specialEffect?: string;
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
    abilities: ['Low maintenance', 'Easy to rent', 'Great for beginners'],
    disabilities: ['Limited space', 'Lower rental yield'],
    rarity: 'common',
    specialEffect: 'Reduces stress by 2 when owned',
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
    abilities: ['High appreciation', 'Luxury rental rates', 'Status symbol'],
    disabilities: ['High maintenance', 'Market sensitive', 'Illiquid asset'],
    rarity: 'epic',
    specialEffect: 'Increases reputation by 5 points',
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
    abilities: ['Daily cash flow', 'Community building', 'Scalable franchise'],
    disabilities: ['Weather dependent', 'High competition', 'Staff dependent'],
    rarity: 'rare',
    specialEffect: 'Generates random bonus income 20% of the time',
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
    abilities: ['E-commerce ready', 'Large cargo space', 'Commercial licensing'],
    disabilities: ['High fuel costs', 'Parking restrictions', 'Wear and tear'],
    rarity: 'common',
    specialEffect: 'Unlocks delivery business opportunities',
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
    abilities: ['Remote work enabler', 'Skill development', 'Multiple income streams'],
    disabilities: ['Rapid obsolescence', 'Fragile hardware', 'Power dependent'],
    rarity: 'common',
    specialEffect: 'Increases side income potential by 25%',
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
    abilities: ['Nostalgic appeal', 'Social gathering', 'Gaming tournaments'],
    disabilities: ['Space consuming', 'Mechanical issues', 'Limited audience'],
    rarity: 'common',
    specialEffect: 'Reduces stress by 1 point monthly',
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
    abilities: ['Government subsidies', 'Green energy credits', '25-year lifespan', 'Grid independence'],
    disabilities: ['Weather dependent', 'High initial cost', 'Technology risk'],
    rarity: 'epic',
    specialEffect: 'Reduces electricity bills by 80% for all properties',
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
    abilities: ['Aerial surveillance', 'Photography services', 'Emergency response'],
    disabilities: ['Weather sensitive', 'Battery limited', 'Regulatory restrictions'],
    rarity: 'rare',
    specialEffect: 'Provides real-time market data for investments',
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
    abilities: ['Cultural investment', 'Tax benefits', 'Art appreciation', 'Elite networking'],
    disabilities: ['Market volatility', 'Authenticity risks', 'Storage requirements'],
    rarity: 'epic',
    specialEffect: 'Attracts high-net-worth investors, increasing all investment returns by 5%',
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
    abilities: ['Prime location', 'Corporate tenants', 'Long-term leases', 'Business networking'],
    disabilities: ['Economic cycles', 'Remote work trend', 'High vacancy risk'],
    rarity: 'legendary',
    specialEffect: 'Increases credibility for business loans by 200 credit points',
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
    abilities: ['Eco-friendly', 'Self-driving', 'Premium ride sharing', 'Tech innovation'],
    disabilities: ['Expensive repairs', 'Charging infrastructure', 'Battery degradation'],
    rarity: 'legendary',
    specialEffect: 'Reduces monthly fuel costs by ₹5,000 for all vehicles',
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
    abilities: ['Brand recognition', 'Multiple revenue streams', 'Catering opportunities', 'Franchise potential'],
    disabilities: ['High labor costs', 'Food waste risk', 'Health regulations', 'Economic sensitivity'],
    rarity: 'legendary',
    specialEffect: 'Generates celebrity endorsements worth ₹50,000 quarterly',
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