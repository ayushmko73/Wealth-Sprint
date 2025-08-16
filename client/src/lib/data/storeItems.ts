// Store Items Data for Wealth Sprint Game

export interface StoreItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'property' | 'vehicle' | 'business' | 'gadget' | 'investment' | 'entertainment' | 'liability';
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
  isLiability?: boolean; // Items that drain money instead of generating it
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

  // 🔻 LIABILITIES - Items that drain money instead of building wealth
  {
    id: 'luxury_car_emi',
    name: 'Luxury Car (EMI Trap)',
    price: 80000,
    description: 'Flashy car that drains money through EMI and maintenance.',
    category: 'liability',
    icon: '🚗',
    passiveIncome: -2500, // Negative income = expense
    maintenanceCost: 1200,
    appreciationRate: -15,
    isLiability: true,
    abilities: ['Status symbol', 'Social prestige'],
    disabilities: ['High EMI', 'Depreciation', 'Insurance costs', 'Fuel expenses'],
    rarity: 'rare',
    specialEffect: 'Increases reputation by 2 but drains ₹2,500 monthly through EMI',
  },
  {
    id: 'expensive_smartphone',
    name: 'Expensive Smartphone Upgrade',
    price: 15000,
    description: 'Latest flagship phone that becomes outdated quickly.',
    category: 'liability',
    icon: '📱',
    passiveIncome: -500, // Monthly plan + EMI
    maintenanceCost: 200,
    appreciationRate: -40,
    isLiability: true,
    abilities: ['Social status', 'Latest features'],
    disabilities: ['Rapid obsolescence', 'Expensive plans', 'Fragile hardware'],
    rarity: 'common',
    specialEffect: 'Tempts you to upgrade every year, causing recurring expenses',
  },
  {
    id: 'designer_clothing',
    name: 'Designer Clothing Addiction',
    price: 25000,
    description: 'Expensive wardrobe that provides no financial returns.',
    category: 'liability',
    icon: '👔',
    passiveIncome: -800, // Monthly shopping addiction
    maintenanceCost: 300,
    appreciationRate: -60,
    isLiability: true,
    abilities: ['Fashion statement', 'Confidence boost'],
    disabilities: ['No resale value', 'Trend dependency', 'Seasonal obsolescence'],
    rarity: 'common',
    specialEffect: 'Triggers impulse buying, reducing savings by ₹800 monthly',
  },
  {
    id: 'credit_card_debt',
    name: 'Credit Card Debt',
    price: 50000,
    description: 'High-interest debt that compounds monthly.',
    category: 'liability',
    icon: '💳',
    passiveIncome: -1750, // 3.5% monthly interest
    maintenanceCost: 0,
    appreciationRate: 0,
    isLiability: true,
    abilities: ['Instant gratification'],
    disabilities: ['Compound interest', 'Minimum payment trap', 'Credit score damage'],
    rarity: 'epic',
    specialEffect: 'Grows by 3.5% monthly if not paid off, financial death spiral',
  },
  {
    id: 'lavish_vacations',
    name: 'Lavish Destination Vacations',
    price: 40000,
    description: 'Expensive holidays that provide temporary happiness.',
    category: 'liability',
    icon: '✈️',
    passiveIncome: -1000, // Annual vacation fund
    maintenanceCost: 500,
    appreciationRate: -100,
    isLiability: true,
    abilities: ['Memories', 'Social media content', 'Temporary happiness'],
    disabilities: ['No lasting value', 'Recurring expense', 'FOMO addiction'],
    rarity: 'rare',
    specialEffect: 'Creates vacation addiction, demanding bigger trips yearly',
  },
  {
    id: 'overpriced_gym',
    name: 'Overpriced Gym Membership',
    price: 8000,
    description: 'Expensive gym membership you rarely use.',
    category: 'liability',
    icon: '🏋️',
    passiveIncome: -600, // Monthly membership
    maintenanceCost: 100,
    appreciationRate: -100,
    isLiability: true,
    abilities: ['Health motivation', 'Social environment'],
    disabilities: ['Unused membership', 'Recurring charges', 'Contract lock-in'],
    rarity: 'common',
    specialEffect: 'Auto-renews annually, charging ₹600 monthly whether used or not',
  },
  {
    id: 'luxury_apartment_rent',
    name: 'High-Rent Luxury Apartment',
    price: 35000,
    description: 'Expensive rental that drains savings monthly.',
    category: 'liability',
    icon: '🏙️',
    passiveIncome: -4500, // Monthly rent
    maintenanceCost: 800,
    appreciationRate: 0,
    isLiability: true,
    abilities: ['Prime location', 'Luxury amenities', 'Status address'],
    disabilities: ['No ownership', 'Annual rent hikes', 'Security deposits'],
    rarity: 'epic',
    specialEffect: 'Rent increases 10% annually, no asset building',
  },
  {
    id: 'gambling_casino',
    name: 'Gambling & Casino Nights',
    price: 20000,
    description: 'Risky entertainment that usually leads to losses.',
    category: 'liability',
    icon: '🎲',
    passiveIncome: -1500, // Average monthly losses
    maintenanceCost: 200,
    appreciationRate: -100,
    isLiability: true,
    abilities: ['Adrenaline rush', 'Social activity'],
    disabilities: ['Addiction risk', 'House always wins', 'Impulsive decisions'],
    rarity: 'epic',
    specialEffect: 'Creates gambling addiction, losses increase over time',
  },
  {
    id: 'impulse_shopping_loan',
    name: 'Loan on Impulse Shopping',
    price: 30000,
    description: 'Personal loan taken for unnecessary purchases.',
    category: 'liability',
    icon: '🛍️',
    passiveIncome: -1200, // EMI payments
    maintenanceCost: 300,
    appreciationRate: -80,
    isLiability: true,
    abilities: ['Instant gratification', 'Latest trends'],
    disabilities: ['High interest rates', 'Impulse regret', 'Debt accumulation'],
    rarity: 'rare',
    specialEffect: 'Triggers more impulse buying, creating a debt cycle',
  },
  {
    id: 'uninsured_medical',
    name: 'Uninsured Medical Expenses',
    price: 45000,
    description: 'Medical bills that could have been avoided with insurance.',
    category: 'liability',
    icon: '🏥',
    passiveIncome: -1800, // Medical payment plan
    maintenanceCost: 400,
    appreciationRate: -100,
    isLiability: true,
    abilities: ['Health treatment'],
    disabilities: ['Financial stress', 'Recurring treatments', 'Emergency costs'],
    rarity: 'legendary',
    specialEffect: 'Medical emergencies can trigger massive unexpected expenses',
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