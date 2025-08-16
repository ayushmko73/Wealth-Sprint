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
  isLiability?: boolean; // Items that drain money instead of generating it
  cause?: string; // Why someone would want this liability
  badImpact?: string; // The negative consequences
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

  // 🔻 LIABILITIES - Items that drain money instead of building wealth (distributed across categories)
  
  // Vehicle Liabilities
  {
    id: 'luxury_sports_car',
    name: 'Luxury Sports Car',
    price: 120000,
    description: 'High-end sports car that drains money through high depreciation, costly maintenance, insurance, and fuel.',
    category: 'vehicle',
    icon: '🏎️',
    passiveIncome: -8500, // Monthly EMI + maintenance + insurance + fuel
    maintenanceCost: 3500,
    appreciationRate: -25,
    isLiability: true,
    cause: 'Desire for status, thrill, and showing off wealth',
    badImpact: 'High depreciation, costly maintenance, insurance, and fuel',
    abilities: ['Ultimate status symbol', 'Adrenaline rush', 'Social prestige'],
    disabilities: ['Massive depreciation', 'Expensive maintenance', 'High insurance costs', 'Premium fuel only'],
    rarity: 'epic',
    specialEffect: 'Drains ₹8,500 monthly but increases social reputation dramatically',
  },
  {
    id: 'private_jet_membership',
    name: 'Private Jet Membership',
    price: 2500000,
    description: 'Exclusive private jet access for ultimate travel luxury and convenience.',
    category: 'vehicle',
    icon: '✈️',
    passiveIncome: -45000, // Monthly membership + usage fees
    maintenanceCost: 15000,
    appreciationRate: -100,
    isLiability: true,
    cause: 'Wanting comfort, speed, and exclusivity in travel',
    badImpact: 'Extremely high recurring costs, taxes, and fuel expenses',
    abilities: ['Ultimate travel luxury', 'Time saving', 'Elite networking'],
    disabilities: ['Massive recurring costs', 'Usage limitations', 'Weather dependent'],
    rarity: 'legendary',
    specialEffect: 'Creates addiction to luxury travel, monthly costs keep increasing',
  },

  // Entertainment Liabilities
  {
    id: 'designer_clothing_collection',
    name: 'Designer Clothing Collection',
    price: 80000,
    description: 'Expensive fashion collection that provides no financial returns but satisfies vanity.',
    category: 'entertainment',
    icon: '👔',
    passiveIncome: -3200, // Monthly shopping addiction + storage
    maintenanceCost: 800,
    appreciationRate: -70,
    isLiability: true,
    cause: 'Vanity, fashion trends, and social influence',
    badImpact: 'No resale value, fast-changing trends make them outdated',
    abilities: ['Fashion statement', 'Social status', 'Confidence boost'],
    disabilities: ['Zero resale value', 'Trend dependency', 'Storage costs'],
    rarity: 'rare',
    specialEffect: 'Triggers compulsive shopping, draining ₹3,200 monthly',
  },
  {
    id: 'expensive_watch_set',
    name: 'Expensive Watch Set',
    price: 150000,
    description: 'Luxury timepiece collection that ties up money in non-productive assets.',
    category: 'entertainment',
    icon: '⌚',
    passiveIncome: -1200, // Insurance + maintenance
    maintenanceCost: 600,
    appreciationRate: -15,
    isLiability: true,
    cause: 'Collector\'s pride, status symbol',
    badImpact: 'Ties up money in non-productive assets; risk of theft',
    abilities: ['Status symbol', 'Collector\'s pride', 'Conversation starter'],
    disabilities: ['Non-productive asset', 'Theft risk', 'High insurance'],
    rarity: 'epic',
    specialEffect: 'Increases desire for more expensive watches, creating collection addiction',
  },
  {
    id: 'luxury_vacation_package',
    name: 'Luxury Vacation Package',
    price: 75000,
    description: 'Extravagant holiday that drains savings for temporary enjoyment.',
    category: 'entertainment',
    icon: '🏖️',
    passiveIncome: -2500, // Annual vacation fund + recurring travel expenses
    maintenanceCost: 0,
    appreciationRate: -100,
    isLiability: true,
    cause: 'Escape, social media show-off, relaxation',
    badImpact: 'One-time enjoyment, drains savings, no financial growth',
    abilities: ['Temporary happiness', 'Social media content', 'Stress relief'],
    disabilities: ['No lasting value', 'FOMO addiction', 'Recurring pressure'],
    rarity: 'rare',
    specialEffect: 'Creates vacation addiction, demanding bigger trips yearly',
  },
  {
    id: 'exotic_pets',
    name: 'Exotic Pets',
    price: 45000,
    description: 'Unique pets that require expensive care and have unpredictable costs.',
    category: 'entertainment',
    icon: '🦜',
    passiveIncome: -2800, // Monthly care + food + medical
    maintenanceCost: 1500,
    appreciationRate: -100,
    isLiability: true,
    cause: 'Passion, uniqueness, luxury status',
    badImpact: 'Expensive care, legal risks, unpredictable medical bills',
    abilities: ['Unique status', 'Companionship', 'Conversation piece'],
    disabilities: ['Expensive care', 'Legal restrictions', 'Unpredictable costs'],
    rarity: 'epic',
    specialEffect: 'Medical emergencies can cause sudden massive expenses',
  },

  // Property Liabilities
  {
    id: 'ultra_luxury_villa',
    name: 'Ultra-Luxury Villa',
    price: 850000,
    description: 'Oversized luxury property that drains money through taxes, upkeep, and low liquidity.',
    category: 'property',
    icon: '🏰',
    passiveIncome: -12000, // Property tax + maintenance + utilities
    maintenanceCost: 8000,
    appreciationRate: 5,
    isLiability: true,
    cause: 'Showcasing lifestyle, bigger space than needed',
    badImpact: 'Property tax, high upkeep, no cash flow, low liquidity',
    abilities: ['Ultimate status symbol', 'Entertainment space', 'Family gatherings'],
    disabilities: ['Massive upkeep costs', 'Property taxes', 'Low liquidity'],
    rarity: 'legendary',
    specialEffect: 'Locks up wealth in illiquid asset while draining ₹12,000 monthly',
  },
  {
    id: 'home_theater_upgrade',
    name: 'Home Theater Upgrade',
    price: 95000,
    description: 'High-end entertainment system that provides no returns and requires constant upgrades.',
    category: 'property',
    icon: '🎬',
    passiveIncome: -1800, // Electricity + subscription services + maintenance
    maintenanceCost: 800,
    appreciationRate: -35,
    isLiability: true,
    cause: 'Desire for entertainment, showing off home luxury',
    badImpact: 'High setup cost, ongoing upgrades, no returns',
    abilities: ['Entertainment value', 'Social gatherings', 'Home luxury'],
    disabilities: ['Rapid obsolescence', 'High electricity costs', 'Subscription dependencies'],
    rarity: 'rare',
    specialEffect: 'Technology upgrades create continuous spending pressure',
  },

  // Business/Investment Liabilities
  {
    id: 'exclusive_club_membership',
    name: 'Exclusive Club Membership',
    price: 180000,
    description: 'Elite social club with high joining fees and recurring expenses.',
    category: 'business',
    icon: '🏌️',
    passiveIncome: -4500, // Monthly dues + additional charges
    maintenanceCost: 1000,
    appreciationRate: -100,
    isLiability: true,
    cause: 'Networking, social prestige, luxury experiences',
    badImpact: 'High joining & renewal fees, recurring expenses',
    abilities: ['Elite networking', 'Social prestige', 'Business connections'],
    disabilities: ['High recurring fees', 'Limited usage', 'Social pressure'],
    rarity: 'epic',
    specialEffect: 'Creates pressure to maintain expensive lifestyle to fit in',
  },
  {
    id: 'high_interest_credit_card',
    name: 'High-Interest Credit Card',
    price: 0,
    description: 'Credit facility that creates debt trap through high interest and overspending habits.',
    category: 'investment',
    icon: '💳',
    passiveIncome: -3500, // Interest charges on accumulated debt
    maintenanceCost: 500,
    appreciationRate: 0,
    isLiability: true,
    cause: 'Quick access to money, overspending habit',
    badImpact: 'Debt trap, huge interest payments, low credit score',
    abilities: ['Instant purchasing power', 'Emergency access'],
    disabilities: ['Compound interest trap', 'Overspending temptation', 'Credit score damage'],
    rarity: 'legendary',
    specialEffect: 'Debt compounds at 3.5% monthly, creating financial death spiral',
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