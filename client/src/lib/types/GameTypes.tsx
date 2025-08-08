export interface PlayerStats {
  logic: number;
  emotion: number;
  karma: number;
  stress: number;
  reputation: number;
  energy: number;
  name?: string;
  // New emotional business simulation stats
  clarityXP: number;
  loopScore: number; // Negative stat tracking accumulated emotional damage
  founderTrait: 'visionary' | 'empathic' | 'capitalist' | 'manipulator' | 'reflective';
  strategyCards: string[]; // Cards earned through progress
}

// Industry sectors for business empire building
export interface IndustrySector {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockRequirements: {
    clarityXP: number;
    sectorsCompleted: number;
    maxLoopScore: number;
  };
  isUnlocked: boolean;
  businesses: Business[];
}

export interface Business {
  id: string;
  sectorId: string;
  name: string;
  type: string;
  revenue: number;
  operationalCost: number;
  employeeCount: number;
  marketShare: number;
  qualityScore: number; // Affected by loop decisions
  sustainabilityScore: number;
  isActive: boolean;
}

export interface FinancialData {
  netWorth: number;
  mainIncome: number;
  sideIncome: number;
  monthlyExpenses: number;
  bankBalance: number;
  totalAssets: number;
  totalLiabilities: number;
  cashflow: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stats: {
    loyalty: number;
    impact: number;
    energy: number;
    mood: 'motivated' | 'neutral' | 'burnt_out';
  };
  salary: number;
  joinDate: Date;
  skills: string[];
  achievements: string[];
  personality: {
    type: string;
    motivationTriggers: string[];
    weakSpots: string[];
  };
  // Enhanced emotional dynamics for modern team UI
  emotionalTrait: string; // e.g., "Calm under pressure", "Insecure but genius"
  loopVulnerability: 'burnout' | 'betrayal' | 'self_doubt' | 'none';
  clarityContribution: number; // How much they add to team clarity
  hiddenDynamics: {
    trustWithFounder: number;
    creativeFulfillment: number;
    burnoutRisk: number;
    isHidingStruggles: boolean;
  };
  // New team management fields
  department: 'Executive' | 'Financial' | 'Risk' | 'Marketing' | 'Sales' | 'Operations' | 'Human Resources' | 'Technician';
  seniority: 'Junior' | 'Mid' | 'Senior' | 'VP' | 'CEO';
  status: 'Promoted' | 'Demoted' | 'Neutral';
  assignedSector?: string; // Fast Food, Tech Startup, E-commerce, Health-Care
  promotionHistory: {
    date: Date;
    action: 'Promoted' | 'Demoted';
    fromLevel: string;
    toLevel: string;
    reason?: string;
  }[];
  isCEO: boolean;
}

// Loop Bosses for emotional damage system
export interface LoopBoss {
  id: string;
  name: string;
  type: 'burnout' | 'betrayal' | 'self_doubt' | 'ego' | 'greed';
  description: string;
  triggerConditions: {
    stress?: number;
    emotion?: number;
    karma?: number;
    loopScore?: number;
    specificActions?: string[];
  };
  effects: {
    playerStats: Partial<PlayerStats>;
    teamImpact: string;
    businessImpact: string;
  };
  counterCards: string[]; // Strategy cards that can defeat this boss
}

// Strategy Cards for gameplay depth
export interface StrategyCard {
  id: string;
  name: string;
  description: string;
  type: 'reflection' | 'delegation' | 'forgiveness' | 'humility' | 'values';
  effects: {
    playerStats?: Partial<PlayerStats>;
    teamBonus?: number;
    businessBonus?: number;
  };
  unlockConditions: {
    clarityXP?: number;
    defeatedBosses?: string[];
    founderTrait?: string;
  };
}

export interface Stock {
  code: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volatility: 'low' | 'medium' | 'high' | 'very_high';
  volume: number;
  marketCap: number;
  peRatio: number;
  dividend: number;
  beta: number;
  high52w: number;
  low52w: number;
  priceHistory: { date: Date; price: number; volume: number }[];
}

export interface Bond {
  id: string;
  name: string;
  type: 'government' | 'corporate' | 'tax_free' | 'green';
  interestRate: number;
  maturityYears: number;
  rating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'CC' | 'C';
  minInvestment: number;
  issuer: string;
  couponFrequency: 'monthly' | 'quarterly' | 'yearly';
  earlyExitAllowed: boolean;
  earlyExitPenalty: number;
}

export interface BankAccount {
  id: string;
  type: 'savings' | 'fd' | 'recurring' | 'loan';
  balance: number;
  interestRate: number;
  maturityDate?: Date;
  autoDebit?: {
    amount: number;
    frequency: 'monthly' | 'quarterly' | 'yearly';
    purpose: string;
  };
  penaltyRate?: number;
}

export interface BusinessDeal {
  id: string;
  type: 'vc_funding' | 'acquisition' | 'partnership' | 'license' | 'exit';
  title: string;
  description: string;
  value: number;
  dealerName: string;
  dealerAvatar: string;
  timeLimit: number; // hours
  options: {
    id: string;
    text: string;
    consequences: {
      cashflow: number;
      equity: number;
      reputation: number;
      stress: number;
      karma: number;
    };
  }[];
  hiddenClauses?: string[];
}

export interface GameScenario {
  id: string;
  category: 'business' | 'stocks' | 'real_estate' | 'emotion' | 'logic' | 'health' | 'risk' | 'ethics';
  title: string;
  description: string;
  context: string;
  options: {
    id: string;
    text: string;
    consequences: {
      stats: Partial<PlayerStats>;
      financial: Partial<FinancialData>;
      events?: string[];
    };
  }[];
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  requiredStats?: Partial<PlayerStats>;
}

export interface GameEvent {
  id: string;
  type: 'news' | 'market' | 'team' | 'personal';
  title: string;
  description: string;
  impact: {
    duration: number; // days
    effects: {
      stats?: Partial<PlayerStats>;
      financial?: Partial<FinancialData>;
      stockMarket?: { volatility: number; sentiment: number };
    };
  };
  timestamp: Date;
}

export type GamePhase = 'menu' | 'playing' | 'financial_independence' | 'challenge_mode';

export interface GameState {
  phase: GamePhase;
  currentWeek: number;
  currentDay: number;
  playerStats: PlayerStats;
  financialData: FinancialData;
  activeScenarios: GameScenario[];
  completedScenarios: string[];
  teamMembers: TeamMember[];
  stocks: Stock[];
  bonds: Bond[];
  bankAccounts: BankAccount[];
  businessDeals: BusinessDeal[];
  gameEvents: GameEvent[];
  settings: {
    theme: 'light' | 'dark';
    soundEnabled: boolean;
    musicEnabled: boolean;
    gameSpeed: 'slow' | 'normal' | 'fast';
  };
}
