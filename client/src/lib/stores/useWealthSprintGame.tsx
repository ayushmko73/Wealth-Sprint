import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { TeamMember, TeamRole, teamRoles, generateRandomTeamMember, generateRandomName, calculatePromotionCost, calculateBonusAmount } from '../data/teamRoles';
import { useTeamManagement } from './useTeamManagement';
import { formatMoney } from '../utils/formatMoney';

export interface PlayerStats {
  name?: string;
  emotion: number;
  stress: number;
  karma: number;
  logic: number;
  reputation: number;
  energy: number;
  // Enhanced emotional business simulation stats
  clarityXP: number;
  loopScore: number; // Tracks accumulated emotional damage
  founderTrait: 'visionary' | 'empathic' | 'capitalist' | 'manipulator' | 'reflective';
  strategyCards: string[]; // Cards earned through progress
  defeatedBosses: string[]; // Loop bosses defeated
  recentActions: string[]; // Track recent actions for loop detection
}

export interface Bond {
  id: string;
  type: 'Government' | 'Corporate' | 'Junk';
  investedAmount: number;
  interestRate: number;
  turnsToMature: number;
  status: 'active' | 'matured' | 'defaulted';
  purchaseDate: Date;
}

export interface BusinessSectorInvestment {
  sectorId: string;
  sectorName: string;
  totalInvested: number;
  monthlyRevenue: number;
  activeCities: string[];
  activeMenuTypes: string[];
  activePricingStrategies: string[];
  activeLogisticsModels: string[];
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  type: 'bond_purchase' | 'bond_maturity' | 'salary_credit' | 'bonus_paid' | 'loan_deducted' | 'team_payment' | 'fd_maturity' | 'investment' | 'business' | 'sector_purchase' | 'business_operations' | 'store_purchase' | 'loan_applied' | 'loan_approved' | 'loan_disbursed' | 'loan_payment';
  amount: number;
  description: string;
  timestamp: Date;
  fromAccount: 'bank' | 'business';
  toAccount: 'bank' | 'business';
}

export interface Asset {
  id: string;
  name: string;
  category: 'real_estate' | 'vehicles' | 'business' | 'gadget' | 'investment' | 'entertainment';
  value: number;
  purchasePrice: number;
  purchaseDate: Date;
  monthlyIncome: number;
  appreciationRate?: number;
  maintenanceCost?: number;
  description: string;
  icon: string;
  storeItemId?: string; // Link to store item
}

export interface Liability {
  id: string;
  name: string;
  category: 'home_loan' | 'car_loan' | 'education_loan' | 'credit_card' | 'business_debt' | 'personal_loan';
  outstandingAmount: number;
  originalAmount: number;
  interestRate: number;
  emi: number;
  tenure: number;
  remainingMonths: number;
  description: string;
  icon: string;
  status?: 'pending' | 'approved' | 'active' | 'paid_off';
  applicationDate?: Date;
  approvalDate?: Date;
  disbursementDate?: Date;
  gameTimeApprovalDay?: number;
  // Penalty tracking
  missedPayments?: number;
  penaltyLevel?: 0 | 1 | 2; // 0: no penalty, 1: first penalty (5% extra interest), 2: bank takeover
  lastPaymentDue?: number; // Game day when last payment was due
  originalInterestRate?: number; // Store original rate before penalties
}

export interface FinancialData {
  bankBalance: number;
  netWorth: number;
  mainIncome: number;
  sideIncome: number;
  monthlyExpenses: number;
  totalAssets: number;
  totalLiabilities: number;
  cashflow: number;
  investments: {
    stocks: number;
    bonds: number;
    fd: number;
    mutualFunds: number;
    realEstate: number;
  };
  savingsGoal: number;
  currentSavings: number;
  bondPortfolio: Bond[];
  transactionHistory: Transaction[];
  teamSalaries: number; // Total monthly team salaries
  businessSectors: BusinessSectorInvestment[]; // Track business sector investments
  businessRevenue: number; // Monthly revenue from all business sectors
  assets: Asset[]; // Player owned assets
  liabilities: Liability[]; // Player liabilities
}

export interface GameEvent {
  id: string;
  type: 'scenario' | 'financial' | 'achievement' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp?: Date;
  impact?: {
    duration: number;
    effects: any;
  };
}

export interface UIState {
  // Section-specific UI states that should persist across navigation
  cashflowSelectedCategory: string;
  financialManagementCategory: string;
  teamManagementActiveTab: string;
  currentTeam: any[]; // Array of hired employees
  businessSelectedCategory: string;
  businessSelectedSector: string | null;
  bondsSelectedCategory: string;
  settingsActiveTab: string;
  assetsSelectedCategory: string;
  stockMarketSelectedStock: string | null;
  // Add more section states as needed
}

interface WealthSprintGameState {
  // Game State
  currentWeek: number;
  currentDay: number;
  gameStarted: boolean;
  gameEnded: boolean;
  endingType: 'rich' | 'balanced' | 'failure' | 'blackout' | null;
  
  // Time Engine State (Background Only)
  timeEngine: {
    currentGameDay: number;
    currentGameMonth: number;
    currentGameYear: number;
    daysSinceLastScenario: number;
    isGameEnded: boolean;
  };
  
  // Game State Trackers
  gameState: {
    isHospitalized: boolean;
    hospitalizationTurnsLeft: number;
    isMentalBreakdown: boolean;
    breakdownTurnsLeft: number;
    isBlackoutMode: boolean;
    blackoutTurnsLeft: number;
    turnsWithoutBreak: number;
    lastAutoSaveTurn: number;
    // Bankruptcy and jail states
    isBankrupt: boolean;
    isInJail: boolean;
    jailTurnsLeft: number;
    bankruptcyReason: string;
  };
  
  // Player Data
  playerStats: PlayerStats;
  financialData: FinancialData;
  gameEvents: GameEvent[];
  teamMembers: TeamMember[];
  purchasedSectors: string[]; // Track purchased sector IDs

  // Fast food chains persistent state
  fastFoodChains?: {
    cities: any[];
    menuTypes: any[];
    pricingStrategies: any[];
    logisticsModels: any[];
  };

  // UI State - persistent across navigation
  uiState: UIState;
  
  // Actions
  updatePlayerStats: (updates: Partial<PlayerStats>) => void;
  updateFinancialData: (updates: Partial<FinancialData>) => void;
  addGameEvent: (event: GameEvent) => void;
  advanceTime: () => void;
  advanceGameTime: () => void;
  startGame: () => void;
  resetGame: () => void;
  endGame: (endingType: 'rich' | 'balanced' | 'failure' | 'blackout') => void;
  
  // Critical Game Logic
  checkStressSystem: () => void;
  checkEmotionSystem: () => void;
  checkBankruptcy: () => boolean;
  checkReputationAccess: () => boolean;
  checkBlackoutMode: () => void;
  processTurn: () => void;
  
  // Maturity functions
  maturityToBank: (amount: number, type: 'FD' | 'Bond', instrumentName: string) => void;
  
  // Credit card functions
  chargeToCredit: (amount: number, description: string) => boolean;
  payCreditCardBill: (amount: number) => boolean;
  
  // Loan functions
  applyForLoan: (amount: number, purpose: string) => string | false;
  approveLoan: (loanId: string) => boolean;
  disburseLoan: (loanId: string) => boolean;
  payLoanEMI: (loanId: string, amount?: number) => boolean;
  customLoanPayment: (loanId: string, amount: number) => boolean;
  processLoanApprovals: () => void;
  // Loan penalty functions
  processLoanPenalties: () => void;
  applyLoanPenalty: (loanId: string, penaltyLevel: 1 | 2) => void;
  triggerBankruptcy: (reason: string) => void;
  
  // Investment functions
  makeInvestment: (type: 'stocks' | 'bonds' | 'fd' | 'mutualFunds' | 'realEstate', amount: number) => boolean;
  setSavingsGoal: (goal: number) => void;
  addToSavings: (amount: number) => void;
  
  // Bond management functions
  purchaseBond: (bondType: 'Government' | 'Corporate' | 'Junk', amount: number) => boolean;
  processBondMaturity: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  
  // Business sector management functions
  investInBusinessSector: (sectorId: string, sectorName: string, investmentType: string, amount: number) => boolean;
  updateBusinessSectorRevenue: () => void;
  calculateBusinessRevenue: () => number;
  
  // Team management functions
  hireEmployee: (employeeId: string, name: string, role: string, salary: number, department: string, roleTemplateId?: string) => boolean;
  promoteEmployee: (employeeId: string, newRoleId: string) => boolean;
  giveBonus: (employeeId: string, amount?: number) => boolean;
  updateEmployeePerformance: (employeeId: string, performance: number) => void;
  processTeamSalaries: () => void;
  
  // Enhanced emotional business simulation functions
  addRecentAction: (action: string) => void;
  checkLoopBosses: () => void;
  defeatLoopBoss: (bossId: string, strategyCardId?: string) => void;
  earnStrategyCard: (cardId: string) => void;
  useStrategyCard: (cardId: string) => boolean;
  gainClarityXP: (amount: number, reason: string) => void;
  increaseLoopScore: (amount: number, reason: string) => void;
  setFounderTrait: (trait: 'visionary' | 'empathic' | 'capitalist' | 'manipulator' | 'reflective') => void;
  
  // Sector management functions
  purchaseSector: (sectorId: string) => boolean;
  setFastFoodState: (state: any) => void;
  
  // Asset and Liability management functions
  addAsset: (asset: Omit<Asset, 'id'>) => string;
  removeAsset: (assetId: string) => boolean;
  updateAsset: (assetId: string, updates: Partial<Asset>) => boolean;
  getAssets: () => Asset[];
  getAssetsByCategory: (category: string) => Asset[];
  addLiability: (liability: Omit<Liability, 'id'>) => string;
  removeLiability: (liabilityId: string) => boolean;
  updateLiability: (liabilityId: string, updates: Partial<Liability>) => boolean;
  getLiabilities: () => Liability[];
  updateAssetValues: () => void;
  calculateNetWorth: () => number;
  
  // Deal investment functions
  purchaseDeal: (deal: any, paymentMethod: 'bank' | 'credit', paymentType: 'full' | 'emi', emiDuration?: number) => { success: boolean; message: string };
  
  // UI State management functions
  updateUIState: (updates: Partial<UIState>) => void;
}

// Initial state values
const initialPlayerStats: PlayerStats = {
  emotion: 50,
  stress: 30,
  karma: 60,
  logic: 45,
  reputation: 40,
  energy: 75,
  // Enhanced emotional business simulation stats
  clarityXP: 0,
  loopScore: 0,
  founderTrait: 'reflective', // Default trait, can be changed in onboarding
  strategyCards: [],
  defeatedBosses: [],
  recentActions: [],
};

const initialFinancialData: FinancialData = {
  bankBalance: 500000, // ₹5 lakhs starting cash
  netWorth: 500000,
  mainIncome: 75000, // ₹75k monthly salary
  sideIncome: 15000, // ₹15k side income
  monthlyExpenses: 45000, // ₹45k monthly expenses
  totalAssets: 500000,
  totalLiabilities: 0, // No default liabilities
  cashflow: 45000, // 75k + 15k - 45k = 45k
  investments: {
    stocks: 0,
    bonds: 0,
    fd: 0,
    mutualFunds: 0,
    realEstate: 0,
  },
  savingsGoal: 1000000, // ₹10 lakhs savings goal
  currentSavings: 0,
  bondPortfolio: [],
  transactionHistory: [],
  teamSalaries: 0,
  businessSectors: [],
  businessRevenue: 0,
  assets: [], // Start with no assets - players buy from store
  liabilities: [], // Start with no default liabilities
};

const initialUIState: UIState = {
  cashflowSelectedCategory: 'Overview',
  financialManagementCategory: 'Cashflow Overview',
  teamManagementActiveTab: 'overview',
  currentTeam: [],
  businessSelectedCategory: 'all',
  businessSelectedSector: null,
  bondsSelectedCategory: 'all',
  settingsActiveTab: 'profile',
  assetsSelectedCategory: 'Assets',
  stockMarketSelectedStock: null,
};

export const useWealthSprintGame = create<WealthSprintGameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentWeek: 1,
    currentDay: 1,
    gameStarted: false,
    gameEnded: false,
    endingType: null,
    
    // Time Engine Initial State (Background Only)
    timeEngine: {
      currentGameDay: 1,
      currentGameMonth: 1,
      currentGameYear: 1,
      daysSinceLastScenario: 0,
      isGameEnded: false,
    },
    
    // Game State Trackers
    gameState: {
      isHospitalized: false,
      hospitalizationTurnsLeft: 0,
      isMentalBreakdown: false,
      breakdownTurnsLeft: 0,
      isBlackoutMode: false,
      blackoutTurnsLeft: 0,
      turnsWithoutBreak: 0,
      lastAutoSaveTurn: 0,
      // Bankruptcy and jail states
      isBankrupt: false,
      isInJail: false,
      jailTurnsLeft: 0,
      bankruptcyReason: '',
    },
    
    playerStats: { ...initialPlayerStats },
    financialData: { ...initialFinancialData },
    gameEvents: [],
    teamMembers: [],
    purchasedSectors: [],
    uiState: { ...initialUIState },

    // Actions
    updatePlayerStats: (updates: Partial<PlayerStats>) => {
      set((state) => {
        const newStats = { ...state.playerStats };
        
        // Handle incremental updates for numeric stats
        Object.entries(updates).forEach(([key, value]) => {
          if (typeof value === 'number') {
            const statKey = key as keyof PlayerStats;
            if (statKey === 'emotion' || statKey === 'stress' || statKey === 'karma' || 
                statKey === 'logic' || statKey === 'reputation' || statKey === 'energy' ||
                statKey === 'clarityXP' || statKey === 'loopScore') {
              // Add the value (could be positive or negative) and clamp between 0-100
              const currentValue = newStats[statKey] as number;
              (newStats as any)[statKey] = Math.max(0, Math.min(100, currentValue + value));
            } else {
              // Direct assignment for other numeric values
              (newStats as any)[key] = value;
            }
          } else {
            // Direct assignment for non-numeric values
            (newStats as any)[key] = value;
          }
        });
        
        return {
          playerStats: newStats,
        };
      });
    },

    updateFinancialData: (updates: Partial<FinancialData>) => {
      set((state) => {
        const newFinancialData = { ...state.financialData };
        
        // Handle incremental updates for numeric financial data
        Object.entries(updates).forEach(([key, value]) => {
          if (typeof value === 'number') {
            if (key === 'bankBalance') {
              // Add the value (could be positive or negative)
              newFinancialData.bankBalance = Math.max(0, newFinancialData.bankBalance + value);
            } else {
              // Direct assignment for other numeric values
              (newFinancialData as any)[key] = value;
            }
          } else {
            // Direct assignment for non-numeric values
            (newFinancialData as any)[key] = value;
          }
        });
        
        // Calculate net worth
        newFinancialData.netWorth = newFinancialData.bankBalance + newFinancialData.totalAssets - newFinancialData.totalLiabilities;
        
        // Calculate cashflow
        newFinancialData.cashflow = newFinancialData.mainIncome + newFinancialData.sideIncome - newFinancialData.monthlyExpenses;
        
        return {
          financialData: newFinancialData,
        };
      });
    },

    updateUIState: (updates: Partial<UIState>) => {
      set((state) => ({
        uiState: {
          ...state.uiState,
          ...updates,
        },
      }));
    },
    


    // Credit card functions
    chargeToCredit: (amount: number, description: string) => {
      const state = get();
      const currentCreditUsed = state.financialData.liabilities.find(l => l.category === 'credit_card')?.outstandingAmount || 0;
      const creditLimit = 500000; // ₹5 lakh credit limit
      
      if (currentCreditUsed + amount > creditLimit) {
        return false; // Credit limit exceeded
      }
      
      // Find existing credit card liability or create new one
      const existingCreditCard = state.financialData.liabilities.find(l => l.category === 'credit_card');
      
      if (existingCreditCard) {
        // Update existing credit card debt
        set((state) => ({
          financialData: {
            ...state.financialData,
            liabilities: state.financialData.liabilities.map(liability =>
              liability.category === 'credit_card'
                ? {
                    ...liability,
                    outstandingAmount: liability.outstandingAmount + amount
                  }
                : liability
            ),
            totalLiabilities: state.financialData.totalLiabilities + amount
          }
        }));
      } else {
        // Create new credit card liability
        const newCreditCard: Liability = {
          id: `credit_card_${Date.now()}`,
          name: 'Credit Card Outstanding',
          category: 'credit_card',
          outstandingAmount: amount,
          originalAmount: amount,
          interestRate: 3.5, // 3.5% monthly
          emi: Math.max(amount * 0.05, 5000), // 5% minimum payment or ₹5000
          tenure: 12,
          remainingMonths: 12,
          description: 'Premium Credit Card Outstanding',
          icon: '💳'
        };
        
        set((state) => ({
          financialData: {
            ...state.financialData,
            liabilities: [...state.financialData.liabilities, newCreditCard],
            totalLiabilities: state.financialData.totalLiabilities + amount
          }
        }));
      }
      
      // Add transaction record
      get().addTransaction({
        type: 'store_purchase',
        amount: -amount,
        description: `Credit Card: ${description}`,
        fromAccount: 'bank',
        toAccount: 'business'
      });
      
      return true;
    },

    payCreditCardBill: (amount: number) => {
      const state = get();
      const creditCard = state.financialData.liabilities.find(l => l.category === 'credit_card');
      
      if (!creditCard || amount <= 0 || amount > state.financialData.bankBalance) {
        return false;
      }
      
      const paymentAmount = Math.min(amount, creditCard.outstandingAmount);
      
      set((state) => ({
        financialData: {
          ...state.financialData,
          bankBalance: state.financialData.bankBalance - paymentAmount,
          liabilities: state.financialData.liabilities.map(liability =>
            liability.category === 'credit_card'
              ? {
                  ...liability,
                  outstandingAmount: liability.outstandingAmount - paymentAmount
                }
              : liability
          ).filter(liability => 
            liability.category !== 'credit_card' || liability.outstandingAmount > 0
          ),
          totalLiabilities: state.financialData.totalLiabilities - paymentAmount
        }
      }));
      
      // Add transaction record
      get().addTransaction({
        type: 'loan_deducted',
        amount: -paymentAmount,
        description: `Credit Card Payment`,
        fromAccount: 'bank',
        toAccount: 'bank'
      });
      
      return true;
    },
    
    maturityToBank: (amount: number, type: 'FD' | 'Bond', instrumentName: string) => {
      set((state) => ({
        financialData: {
          ...state.financialData,
          bankBalance: state.financialData.bankBalance + amount,
        },
      }));
      
      // Add maturity event
      get().addGameEvent({
        id: `maturity_${Date.now()}`,
        type: 'financial',
        title: `${type} Matured`,
        description: `Your ${instrumentName} matured. ₹${amount.toLocaleString()} added to Bank Balance.`,
        timestamp: new Date(),
      });
    },
    
    // Investment functions
    makeInvestment: (type: 'stocks' | 'bonds' | 'fd' | 'mutualFunds' | 'realEstate', amount: number) => {
      const state = get();
      if (state.financialData.bankBalance >= amount) {
        set((state) => ({
          financialData: {
            ...state.financialData,
            bankBalance: state.financialData.bankBalance - amount,
            investments: {
              ...state.financialData.investments,
              [type]: state.financialData.investments[type] + amount,
            },
            totalAssets: state.financialData.totalAssets + amount,
          },
        }));
        
        // Add investment event
        get().addGameEvent({
          id: `investment_${Date.now()}`,
          type: 'financial',
          title: 'Investment Made',
          description: `Invested ₹${amount.toLocaleString()} in ${type}`,
          timestamp: new Date(),
        });
        
        return true;
      }
      return false;
    },
    
    setSavingsGoal: (goal: number) => {
      set((state) => ({
        financialData: {
          ...state.financialData,
          savingsGoal: goal,
        },
      }));
    },
    
    addToSavings: (amount: number) => {
      const state = get();
      if (state.financialData.bankBalance >= amount) {
        set((state) => ({
          financialData: {
            ...state.financialData,
            bankBalance: state.financialData.bankBalance - amount,
            currentSavings: state.financialData.currentSavings + amount,
          },
        }));
        
        // Add savings event
        get().addGameEvent({
          id: `savings_${Date.now()}`,
          type: 'financial',
          title: 'Savings Added',
          description: `Added ₹${amount.toLocaleString()} to savings. Total: ₹${(state.financialData.currentSavings + amount).toLocaleString()}`,
          timestamp: new Date(),
        });
        
        return true;
      }
      return false;
    },

    addGameEvent: (event: GameEvent) => {
      set((state) => ({
        gameEvents: [
          {
            ...event,
            timestamp: event.timestamp || new Date(),
          },
          ...state.gameEvents.slice(0, 49), // Keep only 50 recent events
        ],
      }));
    },

    advanceTime: () => {
      set((state) => {
        let newWeek = state.currentWeek;
        let newDay = state.currentDay + 1;
        
        if (newDay > 7) {
          newDay = 1;
          newWeek += 1;
          
          // Update business sector revenue before calculating weekly income
          get().updateBusinessSectorRevenue();
          
          // Weekly income processing
          const weeklyIncome = (state.financialData.mainIncome + state.financialData.sideIncome) / 4;
          const weeklyExpenses = state.financialData.monthlyExpenses / 4;
          
          // Auto-debt processing (EMI/loan payments)
          const weeklyDebtPayments = state.financialData.totalLiabilities * 0.02; // 2% of total debt weekly
          const netWeeklyChange = weeklyIncome - weeklyExpenses - weeklyDebtPayments;
          
          // Update financial data
          const newFinancialData = {
            ...state.financialData,
            bankBalance: state.financialData.bankBalance + netWeeklyChange,
            totalAssets: state.financialData.totalAssets + Math.max(0, netWeeklyChange),
            totalLiabilities: Math.max(0, state.financialData.totalLiabilities - weeklyDebtPayments * 0.3), // 30% goes to principal
            netWorth: state.financialData.netWorth + netWeeklyChange,
          };
          
          // Add debt payment event if there are liabilities
          if (state.financialData.totalLiabilities > 0) {
            get().addGameEvent({
              id: `debt_payment_${newWeek}`,
              type: 'financial',
              title: 'Auto-Debt Payment',
              description: `Weekly EMI of ₹${weeklyDebtPayments.toLocaleString()} processed. Remaining debt: ₹${newFinancialData.totalLiabilities.toLocaleString()}`,
              timestamp: new Date(),
            });
          }
          
          // Update team experience every 48 weeks 
          useTeamManagement.getState().increaseTeamExperience(newWeek);
          
          // Process loan approvals and penalties
          get().processLoanApprovals();
          get().processLoanPenalties();
          
          return {
            currentWeek: newWeek,
            currentDay: newDay,
            financialData: newFinancialData,
          };
        }
        
        return {
          currentDay: newDay,
        };
      });
      
      // Also advance game time engine
      get().advanceGameTime();
    },

    // Background Time Engine with proper timing
    // 1 real day = 24 game days
    // 7 game days = 1 week  
    // 4 weeks = 1 month
    // 12 months = 1 year
    // Add automatic Clarity XP earning mechanisms
    checkFinancialMilestones: () => {
      const { financialData, playerStats } = get();
      const bankBalance = financialData.bankBalance;
      
      // Define milestones and their Clarity XP rewards
      const milestones = [
        { amount: 100000, xp: 10, key: 'milestone_100k' },
        { amount: 500000, xp: 25, key: 'milestone_500k' },
        { amount: 1000000, xp: 50, key: 'milestone_1m' },
        { amount: 5000000, xp: 100, key: 'milestone_5m' },
        { amount: 10000000, xp: 200, key: 'milestone_10m' }
      ];
      
      // Check for reached milestones (store in playerStats to avoid repeating)
      const reachedMilestones = playerStats.reachedMilestones || [];
      
      milestones.forEach(milestone => {
        if (bankBalance >= milestone.amount && !reachedMilestones.includes(milestone.key)) {
          get().gainClarityXP(milestone.xp, `reaching ₹${milestone.amount.toLocaleString()} milestone`);
          
          // Mark milestone as reached
          set((state) => ({
            playerStats: {
              ...state.playerStats,
              reachedMilestones: [...(state.playerStats.reachedMilestones || []), milestone.key]
            }
          }));
        }
      });
    },

    advanceGameTime: () => {
      set((state) => {
        const { timeEngine } = state;
        
        // Skip if game has already ended
        if (timeEngine.isGameEnded) {
          return state;
        }
        
        let newGameDay = timeEngine.currentGameDay + 1;
        let newGameMonth = timeEngine.currentGameMonth;
        let newGameYear = timeEngine.currentGameYear;
        let newDaysSinceLastScenario = timeEngine.daysSinceLastScenario + 1;
        
        // Advance month after 28 days (4 weeks * 7 days)
        if (newGameDay > 28) {
          newGameDay = 1;
          newGameMonth += 1;
          
          // Monthly salary processing
          const monthlySalary = state.financialData.mainIncome + state.financialData.sideIncome;
          const monthlyExpenses = state.financialData.monthlyExpenses;
          
          // Auto-debt processing (Monthly EMI/loan payments)
          const monthlyDebtPayments = state.financialData.totalLiabilities * 0.08; // 8% of total debt monthly
          const netMonthlyChange = monthlySalary - monthlyExpenses - monthlyDebtPayments;
          
          // Update financial data
          const newFinancialData = {
            ...state.financialData,
            bankBalance: state.financialData.bankBalance + netMonthlyChange,
            totalAssets: state.financialData.totalAssets + Math.max(0, netMonthlyChange),
            totalLiabilities: Math.max(0, state.financialData.totalLiabilities - monthlyDebtPayments * 0.4), // 40% goes to principal
            netWorth: state.financialData.netWorth + netMonthlyChange,
          };
          
          // Process team salaries
          get().processTeamSalaries();
          
          // Monthly Clarity XP bonus for consistent progress
          get().gainClarityXP(5, "monthly progress and consistency");
          
          // Check FD maturity and auto-save
          get().addGameEvent({
            id: `monthly_salary_${newGameMonth}_${newGameYear}`,
            type: 'financial',
            title: 'Monthly Salary Processed',
            description: `Salary of ₹${monthlySalary.toLocaleString()} credited. Net change: ₹${netMonthlyChange.toLocaleString()}`,
            timestamp: new Date(),
          });
          
          // Advance year if month exceeds 12
          if (newGameMonth > 12) {
            newGameMonth = 1;
            newGameYear += 1;
            
            // Continue indefinitely - no year limit
            // Game continues beyond 5 years with escalating challenges
            
            // Add yearly milestone events for progression beyond 5 years
            if (newGameYear > 5) {
              get().addGameEvent({
                id: `year_milestone_${newGameYear}`,
                type: 'info',
                title: `Year ${newGameYear} Milestone`,
                description: `Congratulations! You've reached year ${newGameYear}. New challenges and opportunities await!`,
                timestamp: new Date(),
              });
            }
          }
          
          return {
            ...state,
            timeEngine: {
              ...timeEngine,
              currentGameDay: newGameDay,
              currentGameMonth: newGameMonth,
              currentGameYear: newGameYear,
              daysSinceLastScenario: newDaysSinceLastScenario,
            },
            financialData: newFinancialData,
          };
        }
        
        // Daily stress increase
        const updatedPlayerStats = {
          ...state.playerStats,
          stress: Math.min(100, state.playerStats.stress + 1),
        };
        
        // Trigger scenario every 3-4 days
        if (newDaysSinceLastScenario >= 3 && Math.random() < 0.5) {
          newDaysSinceLastScenario = 0;
          // Scenario will be triggered by scenario engine
        }
        
        // Auto-checks on 1st, 15th, 30th day of each month
        if (newGameDay === 1 || newGameDay === 15 || newGameDay === 30) {
          // Trigger auto-checks
          get().addGameEvent({
            id: `auto_check_${newGameDay}_${newGameMonth}_${newGameYear}`,
            type: 'info',
            title: 'Auto-Check Completed',
            description: `Monthly financial review completed. Current net worth: ₹${state.financialData.netWorth.toLocaleString()}`,
            timestamp: new Date(),
          });
        }
        
        // Check for financial milestones every day
        get().checkFinancialMilestones();
        
        // Console logging for developer (Settings panel access)
        console.log("⏱️ Game Time Engine Active: 24× faster than real world time");
        console.log("🕰️ 1 real-world hour = 1 in-game day. 5 in-game years = ~75 real hours.");
        console.table({ 
          currentGameDay: newGameDay, 
          currentGameMonth: newGameMonth, 
          currentGameYear: newGameYear,
          daysSinceLastScenario: newDaysSinceLastScenario
        });
        
        return {
          ...state,
          timeEngine: {
            ...timeEngine,
            currentGameDay: newGameDay,
            currentGameMonth: newGameMonth,
            currentGameYear: newGameYear,
            daysSinceLastScenario: newDaysSinceLastScenario,
          },
          playerStats: updatedPlayerStats,
        };
      });
    },

    // Critical Game Logic Systems
    checkStressSystem: () => {
      const state = get();
      if (state.playerStats.stress >= 100 && !state.gameState.isHospitalized) {
        // Trigger Hospitalization Event
        set((state) => ({
          gameState: {
            ...state.gameState,
            isHospitalized: true,
            hospitalizationTurnsLeft: 3,
          },
          playerStats: {
            ...state.playerStats,
            stress: 40,
            energy: 70,
          },
          financialData: {
            ...state.financialData,
            bankBalance: state.financialData.bankBalance - 10000,
          },
        }));
        
        get().addGameEvent({
          id: `hospitalization_${Date.now()}`,
          type: 'warning',
          title: '🏥 Hospitalization Event',
          description: 'You collapsed from overwork. ₹10,000 deducted for hospital fees. Game frozen for 3 turns.',
          timestamp: new Date(),
        });
      }
    },

    checkEmotionSystem: () => {
      const state = get();
      if (state.playerStats.emotion <= 0 && !state.gameState.isMentalBreakdown) {
        // Trigger Mental Breakdown
        set((state) => ({
          gameState: {
            ...state.gameState,
            isMentalBreakdown: true,
            breakdownTurnsLeft: 2,
          },
          playerStats: {
            ...state.playerStats,
            emotion: 30,
          },
        }));
        
        get().addGameEvent({
          id: `mental_breakdown_${Date.now()}`,
          type: 'warning',
          title: '💔 Mental Breakdown',
          description: 'You lost the will to continue. Game frozen for 2 turns. A team member left due to neglect.',
          timestamp: new Date(),
        });
      }
    },

    checkBankruptcy: () => {
      const state = get();
      // Bankruptcy no longer ends the game - players can recover
      // Log warning for negative balance but continue playing
      if (state.financialData.bankBalance < -100000) {
        get().addGameEvent({
          id: `debt_warning_${Date.now()}`,
          type: 'warning',
          title: '⚠️ High Debt Warning',
          description: 'Your balance is significantly negative. Focus on increasing income and reducing expenses.',
          timestamp: new Date(),
        });
      }
      return false; // Never trigger game end
    },

    checkReputationAccess: () => {
      const state = get();
      return state.playerStats.reputation >= 10;
    },

    checkBlackoutMode: () => {
      const state = get();
      if (state.playerStats.stress >= 90 && state.playerStats.emotion <= 10 && !state.gameState.isBlackoutMode) {
        // Trigger Blackout Mode
        set((state) => ({
          gameState: {
            ...state.gameState,
            isBlackoutMode: true,
            blackoutTurnsLeft: 1,
          },
          financialData: {
            ...state.financialData,
            bankBalance: state.financialData.bankBalance - 5000,
          },
        }));
        
        get().addGameEvent({
          id: `blackout_${Date.now()}`,
          type: 'warning',
          title: '😵 Blackout Mode',
          description: 'High stress + low emotion triggered blackout. ₹5,000 penalty, 1 turn skipped.',
          timestamp: new Date(),
        });
      }
    },

    processTurn: () => {
      const state = get();
      
      // Check all critical systems
      get().checkStressSystem();
      get().checkEmotionSystem();
      get().checkBlackoutMode();
      
      // Process bond maturity
      get().processBondMaturity();
      
      // Bankruptcy checks removed - game continues indefinitely
      // Players can recover from negative balances
      
      // Update turn counters
      set((state) => ({
        gameState: {
          ...state.gameState,
          turnsWithoutBreak: state.gameState.turnsWithoutBreak + 1,
          
          // Decrease hospitalization turns
          hospitalizationTurnsLeft: Math.max(0, state.gameState.hospitalizationTurnsLeft - 1),
          isHospitalized: state.gameState.hospitalizationTurnsLeft > 1,
          
          // Decrease breakdown turns
          breakdownTurnsLeft: Math.max(0, state.gameState.breakdownTurnsLeft - 1),
          isMentalBreakdown: state.gameState.breakdownTurnsLeft > 1,
          
          // Decrease blackout turns
          blackoutTurnsLeft: Math.max(0, state.gameState.blackoutTurnsLeft - 1),
          isBlackoutMode: state.gameState.blackoutTurnsLeft > 1,
        },
      }));
      
      // Auto-save every 3 turns
      if (state.gameState.turnsWithoutBreak % 3 === 0) {
        // Auto-save logic (localStorage is handled by subscription)
        get().addGameEvent({
          id: `auto_save_${Date.now()}`,
          type: 'info',
          title: '💾 Auto-Save',
          description: 'Game progress automatically saved.',
          timestamp: new Date(),
        });
      }
      
      // Check for burnout (6 turns without break)
      if (state.gameState.turnsWithoutBreak >= 6) {
        get().addGameEvent({
          id: `burnout_warning_${Date.now()}`,
          type: 'warning',
          title: '🔥 Burnout Warning',
          description: 'You haven\'t taken a break in 6 turns. Consider resting to avoid consequences.',
          timestamp: new Date(),
        });
      }
      
      // Check for game ending conditions after 5 years
      if (state.timeEngine.currentGameYear >= 5) {
        const netWorth = state.financialData.netWorth;
        const stress = state.playerStats.stress;
        const emotion = state.playerStats.emotion;
        
        if (netWorth >= 10000000 && stress < 50) {
          get().endGame('rich');
        } else if (netWorth >= 5000000 && emotion > 60) {
          get().endGame('balanced');
        } else {
          get().endGame('failure');
        }
      }
    },

    endGame: (endingType: 'rich' | 'balanced' | 'failure' | 'blackout') => {
      set((state) => ({
        gameEnded: true,
        endingType,
      }));
      
      const endingMessages = {
        rich: '🎉 Rich Ending: You achieved ₹1Cr+ with low stress!',
        balanced: '⚖️ Balanced Ending: You achieved ₹50L+ with good emotional health!',
        failure: '💔 Failure Ending: You went bankrupt or couldn\'t manage the pressure.',
        blackout: '😵 Blackout Ending: You pushed too hard and lost everything.'
      };
      
      get().addGameEvent({
        id: `game_end_${Date.now()}`,
        type: 'achievement',
        title: 'Game Ended',
        description: endingMessages[endingType],
        timestamp: new Date(),
      });
    },

    startGame: () => {
      set((state) => ({
        gameStarted: true,
        gameEvents: [
          {
            id: 'game_start',
            type: 'info',
            title: '🚀 Welcome to Wealth Sprint!',
            description: 'Your journey to financial independence begins now. Make smart decisions to grow your wealth and achieve your goals.',
            timestamp: new Date(),
          },
          ...state.gameEvents,
        ],
      }));
    },

    resetGame: () => {
      set(() => ({
        currentWeek: 1,
        currentDay: 1,
        gameStarted: false,
        gameEnded: false,
        endingType: null,
        timeEngine: {
          currentGameDay: 1,
          currentGameMonth: 1,
          currentGameYear: 1,
          daysSinceLastScenario: 0,
          isGameEnded: false,
        },
        gameState: {
          isHospitalized: false,
          hospitalizationTurnsLeft: 0,
          isMentalBreakdown: false,
          breakdownTurnsLeft: 0,
          isBlackoutMode: false,
          blackoutTurnsLeft: 0,
          turnsWithoutBreak: 0,
          lastAutoSaveTurn: 0,
          isBankrupt: false,
          isInJail: false,
          jailTurnsLeft: 0,
          bankruptcyReason: '',
        },
        playerStats: { ...initialPlayerStats },
        financialData: { ...initialFinancialData },
        gameEvents: [],
        teamMembers: [],
      }));
    },
    
    // Bond management functions
    purchaseBond: (bondType: 'Government' | 'Corporate' | 'Junk', amount: number) => {
      const state = get();
      if (state.financialData.bankBalance >= amount) {
        const bondConfig = {
          Government: { interestRate: 4, maturityTurns: 12 },
          Corporate: { interestRate: 8, maturityTurns: 8 },
          Junk: { interestRate: 15, maturityTurns: 4 }
        };
        
        const config = bondConfig[bondType];
        const newBond: Bond = {
          id: `bond_${Date.now()}`,
          type: bondType,
          investedAmount: amount,
          interestRate: config.interestRate,
          turnsToMature: config.maturityTurns,
          status: 'active',
          purchaseDate: new Date()
        };
        
        set((state) => ({
          financialData: {
            ...state.financialData,
            bankBalance: state.financialData.bankBalance - amount,
            bondPortfolio: [...state.financialData.bondPortfolio, newBond],
            investments: {
              ...state.financialData.investments,
              bonds: state.financialData.investments.bonds + amount
            }
          }
        }));
        
        get().addTransaction({
          type: 'bond_purchase',
          amount: -amount,
          description: `Purchased ${bondType} Bond - ${config.interestRate}% for ${config.maturityTurns} turns`,
          fromAccount: 'bank',
          toAccount: 'bank'
        });
        
        return true;
      }
      return false;
    },
    
    processBondMaturity: () => {
      const state = get();
      const updatedBonds = state.financialData.bondPortfolio.map(bond => {
        if (bond.status === 'active') {
          const newTurnsToMature = bond.turnsToMature - 1;
          
          if (newTurnsToMature <= 0) {
            // Bond matured
            if (bond.type === 'Junk' && Math.random() < 0.1) {
              // 10% default chance for junk bonds
              get().addTransaction({
                type: 'bond_maturity',
                amount: 0,
                description: `${bond.type} Bond defaulted - Lost ₹${bond.investedAmount.toLocaleString()}`,
                fromAccount: 'bank',
                toAccount: 'bank'
              });
              
              return { ...bond, status: 'defaulted' as const, turnsToMature: 0 };
            } else {
              // Successful maturity
              const maturityAmount = bond.investedAmount * (1 + bond.interestRate / 100);
              
              set((state) => ({
                financialData: {
                  ...state.financialData,
                  bankBalance: state.financialData.bankBalance + maturityAmount,
                  investments: {
                    ...state.financialData.investments,
                    bonds: state.financialData.investments.bonds - bond.investedAmount
                  }
                }
              }));
              
              get().addTransaction({
                type: 'bond_maturity',
                amount: maturityAmount,
                description: `${bond.type} Bond matured - ₹${bond.investedAmount.toLocaleString()} → ₹${maturityAmount.toLocaleString()}`,
                fromAccount: 'bank',
                toAccount: 'bank'
              });
              
              return { ...bond, status: 'matured' as const, turnsToMature: 0 };
            }
          } else {
            return { ...bond, turnsToMature: newTurnsToMature };
          }
        }
        return bond;
      });
      
      set((state) => ({
        financialData: {
          ...state.financialData,
          bondPortfolio: updatedBonds
        }
      }));
    },
    
    addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
      const newTransaction: Transaction = {
        ...transaction,
        id: `txn_${Date.now()}`,
        timestamp: new Date()
      };
      
      set((state) => ({
        financialData: {
          ...state.financialData,
          transactionHistory: [newTransaction, ...state.financialData.transactionHistory].slice(0, 100) // Keep last 100 transactions
        }
      }));
    },

    // Deal investment functionality
    purchaseDeal: (deal: any, paymentMethod: 'bank' | 'credit', paymentType: 'full' | 'emi', emiDuration?: number) => {
      const state = get();
      const amount = deal.investmentRequired;
      
      // Check if purchase is possible
      if (paymentMethod === 'bank' && state.financialData.bankBalance < amount) {
        return { success: false, message: 'Insufficient bank balance' };
      }
      
      if (paymentMethod === 'credit') {
        // Check credit limit - total purchase amount should be within available limit
        const currentCreditUsed = state.financialData.liabilities
          .filter(l => l.category === 'credit_card')
          .reduce((sum, l) => sum + l.outstandingAmount, 0);
        const creditLimit = 500000;
        const availableCredit = creditLimit - currentCreditUsed;
        
        if (amount > availableCredit) {
          return { success: false, message: 'Credit limit exceeded' };
        }
      }
      
      // Process payment
      if (paymentMethod === 'bank') {
        // Direct bank payment
        set((state) => ({
          financialData: {
            ...state.financialData,
            bankBalance: state.financialData.bankBalance - amount,
            investments: {
              ...state.financialData.investments,
              stocks: state.financialData.investments.stocks + amount
            }
          }
        }));
        
        get().addTransaction({
          type: 'investment',
          amount: -amount,
          description: `Investment: ${deal.title} - Bank Payment`,
          fromAccount: 'bank',
          toAccount: 'business'
        });
      } else {
        // Credit card payment
        if (paymentType === 'full') {
          // Full payment - charge entire amount to credit card immediately
          get().chargeToCredit(amount, `Investment: ${deal.title} - Full Payment`);
        } else {
          // EMI - create EMI liability which blocks credit limit for total amount
          // but monthly payments will gradually free up the limit
          const monthlyEmi = Math.ceil(amount / (emiDuration || 12));
          const emiLiability: Liability = {
            id: `emi_${Date.now()}`,
            name: `${deal.title} EMI`,
            category: 'credit_card',
            outstandingAmount: amount, // Total amount blocks credit limit
            originalAmount: amount,
            interestRate: 3.5, // 3.5% monthly interest on credit card EMI
            emi: monthlyEmi,
            tenure: emiDuration || 12,
            remainingMonths: emiDuration || 12,
            description: `EMI for ${deal.title}`,
            icon: '💳'
          };
          
          set((state) => ({
            financialData: {
              ...state.financialData,
              liabilities: [...state.financialData.liabilities, emiLiability],
              totalLiabilities: state.financialData.totalLiabilities + amount
            }
          }));
          
          // Add transaction for EMI setup
          get().addTransaction({
            type: 'investment',
            amount: amount,
            description: `EMI Setup: ${deal.title} - ${emiDuration} months @ ₹${monthlyEmi.toLocaleString()}/month`,
            fromAccount: 'bank',
            toAccount: 'business'
          });
        }
        
        set((state) => ({
          financialData: {
            ...state.financialData,
            investments: {
              ...state.financialData.investments,
              stocks: state.financialData.investments.stocks + amount
            }
          }
        }));
      }
      
      // Add deal as asset
      const newAsset: Asset = {
        id: `deal_${Date.now()}`,
        name: deal.title,
        category: 'investment',
        value: amount,
        purchasePrice: amount,
        purchaseDate: new Date(),
        monthlyIncome: deal.cashflowMonthly || 0,
        appreciationRate: (deal.expectedROI || 0) / 100 / 12, // Monthly appreciation
        description: deal.description || `Investment in ${deal.title}`,
        icon: '📈',
        storeItemId: deal.id
      };
      
      set((state) => ({
        financialData: {
          ...state.financialData,
          assets: [...state.financialData.assets, newAsset],
          totalAssets: state.financialData.totalAssets + amount
        }
      }));
      
      // Add success event
      get().addGameEvent({
        id: `deal_purchase_${Date.now()}`,
        type: 'achievement',
        title: 'Investment Completed',
        description: `Successfully invested ₹${amount.toLocaleString()} in ${deal.title}. Expected monthly return: ₹${deal.cashflowMonthly?.toLocaleString() || '0'}`,
        timestamp: new Date(),
      });
      
      return { success: true, message: 'Investment completed successfully' };
    },

    // Business sector management functions
    investInBusinessSector: (sectorId: string, sectorName: string, investmentType: string, amount: number) => {
      const state = get();
      
      if (state.financialData.bankBalance < amount) {
        return false;
      }
      
      set((state) => {
        const existingSectorIndex = state.financialData.businessSectors.findIndex(s => s.sectorId === sectorId);
        let updatedBusinessSectors = [...state.financialData.businessSectors];
        
        if (existingSectorIndex >= 0) {
          // Update existing sector
          const existingSector = updatedBusinessSectors[existingSectorIndex];
          updatedBusinessSectors[existingSectorIndex] = {
            ...existingSector,
            totalInvested: existingSector.totalInvested + amount,
            lastUpdated: new Date()
          };
        } else {
          // Create new sector entry
          updatedBusinessSectors.push({
            sectorId,
            sectorName,
            totalInvested: amount,
            monthlyRevenue: 0,
            activeCities: [],
            activeMenuTypes: [],
            activePricingStrategies: [],
            activeLogisticsModels: [],
            lastUpdated: new Date()
          });
        }
        
        return {
          financialData: {
            ...state.financialData,
            bankBalance: state.financialData.bankBalance - amount,
            businessSectors: updatedBusinessSectors
          }
        };
      });
      
      // Add transaction record
      get().addTransaction({
        type: 'business_operations',
        amount: -amount,
        description: `Investment in ${sectorName} - ${investmentType}`,
        fromAccount: 'bank',
        toAccount: 'business'
      });
      
      // Recalculate business revenue
      get().updateBusinessSectorRevenue();
      
      return true;
    },

    calculateBusinessRevenue: () => {
      const state = get();
      let totalMonthlyRevenue = 0;
      
      state.financialData.businessSectors.forEach(sector => {
        if (sector.sectorId === 'fast_food') {
          // Calculate Fast Food Chain revenue based on active components
          let baseRevenue = sector.activeCities.length * 15000; // ₹15k per city per month
          
          // Apply menu type bonuses
          let menuBonus = 0;
          if (sector.activeMenuTypes.includes('standard')) menuBonus += 0.2;
          if (sector.activeMenuTypes.includes('premium')) menuBonus += 0.45;
          if (sector.activeMenuTypes.includes('local')) menuBonus += 0.3;
          
          // Apply pricing strategy bonuses
          let pricingBonus = 0;
          if (sector.activePricingStrategies.includes('high_margin')) pricingBonus += 0.45;
          if (sector.activePricingStrategies.includes('volume_based')) pricingBonus += 0.25;
          
          // Apply logistics bonuses
          let logisticsBonus = 0;
          if (sector.activeLogisticsModels.includes('quick_commerce')) logisticsBonus += 0.2;
          if (sector.activeLogisticsModels.includes('franchise')) logisticsBonus += 0.4;
          
          const totalBonus = 1 + menuBonus + pricingBonus + logisticsBonus;
          totalMonthlyRevenue += Math.floor(baseRevenue * totalBonus);
        }
        // Add other sector types here in the future
      });
      
      return totalMonthlyRevenue;
    },

    updateBusinessSectorRevenue: () => {
      const calculatedRevenue = get().calculateBusinessRevenue();
      
      set((state) => {
        const newSideIncome = state.financialData.sideIncome - state.financialData.businessRevenue + calculatedRevenue;
        
        return {
          financialData: {
            ...state.financialData,
            businessRevenue: calculatedRevenue,
            sideIncome: newSideIncome,
            cashflow: state.financialData.mainIncome + newSideIncome - state.financialData.monthlyExpenses
          }
        };
      });
    },
    
    // Team management functions
    hireEmployee: (employeeId: string, name: string, role: string, salary: number, department: string, roleTemplateId?: string) => {
      const state = get();
      const monthlySalary = salary / 12;
      
      // Check if company can afford the employee (need 3 months runway)
      if (state.financialData.bankBalance < monthlySalary * 3) {
        return false;
      }
      
      const newEmployee: TeamMember = {
        id: employeeId,
        name: name,
        role: role,
        roleId: roleTemplateId || role,
        department: department,
        color: '#3b82f6', // Default blue color
        emoji: '👤',
        isActive: true,
        salary: monthlySalary,
        experience: Math.floor(Math.random() * 50) + 20,
        loyalty: Math.floor(Math.random() * 20) + 70,
        performance: Math.floor(Math.random() * 30) + 60,
        stress: Math.floor(Math.random() * 30) + 10,
        hireDate: new Date(),
        emotionalTrait: 'Professional',
        clarityContribution: Math.floor(Math.random() * 10) + 5,
        loopRisk: Math.floor(Math.random() * 20) + 10,
        status: 'Active' as const
      };
      
      set((state) => ({
        teamMembers: [...state.teamMembers, newEmployee],
        financialData: {
          ...state.financialData,
          teamSalaries: state.financialData.teamSalaries + monthlySalary,
          monthlyExpenses: state.financialData.monthlyExpenses + monthlySalary
        }
      }));
      
      get().addTransaction({
        type: 'team_payment',
        amount: -monthlySalary,
        description: `Hired ${name} as ${role}`,
        fromAccount: 'bank',
        toAccount: 'bank'
      });
      
      get().addGameEvent({
        id: `hire_${Date.now()}`,
        type: 'info',
        title: 'New Team Member',
        description: `Successfully hired ${name} as ${role}`,
        timestamp: new Date()
      });
      
      return true;
    },
    
    promoteEmployee: (employeeId: string, newRoleId: string) => {
      const employee = get().teamMembers.find(e => e.id === employeeId);
      const newRole = teamRoles.find(r => r.id === newRoleId);
      
      if (!employee || !newRole) return false;
      
      const state = get();
      const newSalary = newRole.baseSalary / 12;
      const promotionCost = calculatePromotionCost(employee.salary, newSalary);
      
      if (state.financialData.bankBalance < promotionCost) {
        return false;
      }
      
      set((state) => ({
        teamMembers: state.teamMembers.map(member => 
          member.id === employeeId 
            ? { 
                ...member, 
                roleId: newRoleId, 
                salary: newSalary,
                currentLevel: 1, // Default level for promoted employee
                lastPromotion: new Date(),
                loyalty: Math.min(100, member.loyalty + 15),
                performance: Math.min(100, member.performance + 10)
              }
            : member
        ),
        financialData: {
          ...state.financialData,
          bankBalance: state.financialData.bankBalance - promotionCost,
          teamSalaries: state.financialData.teamSalaries - employee.salary + newSalary,
          monthlyExpenses: state.financialData.monthlyExpenses - employee.salary + newSalary
        }
      }));
      
      get().addTransaction({
        type: 'team_payment',
        amount: -promotionCost,
        description: `Promoted ${employee.name} to ${newRole.name}`,
        fromAccount: 'bank',
        toAccount: 'bank'
      });
      
      get().addGameEvent({
        id: `promotion_${Date.now()}`,
        type: 'achievement',
        title: 'Team Promotion',
        description: `${employee.name} promoted to ${newRole.name}`,
        timestamp: new Date()
      });
      
      return true;
    },
    
    giveBonus: (employeeId: string, amount?: number) => {
      const employee = get().teamMembers.find(e => e.id === employeeId);
      if (!employee) return false;
      
      const state = get();
      const bonusAmount = amount || calculateBonusAmount(employee.salary, employee.performance);
      
      if (state.financialData.bankBalance < bonusAmount) {
        return false;
      }
      
      set((state) => ({
        teamMembers: state.teamMembers.map(member => 
          member.id === employeeId 
            ? { 
                ...member, 
                lastBonus: new Date(),
                loyalty: Math.min(100, member.loyalty + 10),
                performance: Math.min(100, member.performance + 5)
              }
            : member
        ),
        financialData: {
          ...state.financialData,
          bankBalance: state.financialData.bankBalance - bonusAmount
        }
      }));
      
      get().addTransaction({
        type: 'bonus_paid',
        amount: -bonusAmount,
        description: `Bonus paid to ${employee.name}`,
        fromAccount: 'bank',
        toAccount: 'bank'
      });
      
      get().addGameEvent({
        id: `bonus_${Date.now()}`,
        type: 'financial',
        title: 'Bonus Paid',
        description: `Paid ${employee.name} a bonus of ₹${bonusAmount.toLocaleString()}`,
        timestamp: new Date()
      });
      
      return true;
    },
    
    
    updateEmployeePerformance: (employeeId: string, performance: number) => {
      set((state) => ({
        teamMembers: state.teamMembers.map(member => 
          member.id === employeeId 
            ? { ...member, performance: Math.max(0, Math.min(100, performance)) }
            : member
        )
      }));
    },
    
    processTeamSalaries: () => {
      const state = get();
      const totalSalaries = state.financialData.teamSalaries;
      
      if (totalSalaries === 0) return;
      
      if (state.financialData.bankBalance < totalSalaries) {
        // Can't pay salaries - affects team morale
        set((state) => ({
          teamMembers: state.teamMembers.map(member => ({
            ...member,
            loyalty: Math.max(0, member.loyalty - 20),
            performance: Math.max(0, member.performance - 15)
          }))
        }));
        
        get().addGameEvent({
          id: `salary_crisis_${Date.now()}`,
          type: 'warning',
          title: 'Salary Crisis',
          description: `Unable to pay team salaries. Team morale severely affected.`,
          timestamp: new Date()
        });
        
        return;
      }
      
      // Pay salaries
      set((state) => ({
        financialData: {
          ...state.financialData,
          bankBalance: state.financialData.bankBalance - totalSalaries
        }
      }));
      
      get().addTransaction({
        type: 'team_payment',
        amount: -totalSalaries,
        description: `Monthly salary payments to team`,
        fromAccount: 'bank',
        toAccount: 'bank'
      });
      
      // Improve team stats slightly for regular payment
      set((state) => ({
        teamMembers: state.teamMembers.map(member => ({
          ...member,
          loyalty: Math.min(100, member.loyalty + 2),
          experience: Math.min(100, member.experience + 1)
        }))
      }));
    },
    
    // Enhanced emotional business simulation functions
    addRecentAction: (action: string) => {
      set((state) => ({
        playerStats: {
          ...state.playerStats,
          recentActions: [...state.playerStats.recentActions.slice(-4), action] // Keep last 5 actions
        }
      }));
    },

    checkLoopBosses: () => {
      const state = get();
      const { checkLoopBossTriggers } = require('../data/industrySectors');
      
      const triggeredBoss = checkLoopBossTriggers(state.playerStats, state.playerStats.recentActions);
      if (triggeredBoss && !state.playerStats.defeatedBosses.includes(triggeredBoss.id)) {
        // Apply boss effects
        get().updatePlayerStats(triggeredBoss.effects.playerStats);
        
        get().addGameEvent({
          id: `loop_boss_${triggeredBoss.id}_${Date.now()}`,
          type: 'warning',
          title: `Loop Boss: ${triggeredBoss.name}`,
          description: `${triggeredBoss.description} ${triggeredBoss.effects.businessImpact}`,
          timestamp: new Date(),
          impact: {
            duration: 5,
            effects: triggeredBoss.effects
          }
        });
      }
    },

    defeatLoopBoss: (bossId: string, strategyCardId?: string) => {
      set((state) => ({
        playerStats: {
          ...state.playerStats,
          defeatedBosses: [...state.playerStats.defeatedBosses, bossId],
          clarityXP: state.playerStats.clarityXP + 100, // Bonus for defeating boss
          loopScore: Math.max(0, state.playerStats.loopScore - 30) // Reduce loop damage
        }
      }));
      
      if (strategyCardId) {
        get().useStrategyCard(strategyCardId);
      }
      
      get().addGameEvent({
        id: `boss_defeated_${bossId}_${Date.now()}`,
        type: 'achievement',
        title: 'Loop Boss Defeated!',
        description: `You've overcome your ${bossId.replace('_', ' ')} and gained valuable clarity.`,
        timestamp: new Date()
      });
    },

    earnStrategyCard: (cardId: string) => {
      set((state) => ({
        playerStats: {
          ...state.playerStats,
          strategyCards: [...state.playerStats.strategyCards, cardId]
        }
      }));
      
      get().addGameEvent({
        id: `card_earned_${cardId}_${Date.now()}`,
        type: 'achievement',
        title: 'Strategy Card Earned!',
        description: `You've unlocked a new strategy card: ${cardId.replace('_', ' ')}`,
        timestamp: new Date()
      });
    },

    useStrategyCard: (cardId: string) => {
      const state = get();
      if (!state.playerStats.strategyCards.includes(cardId)) {
        return false;
      }

      const { strategyCards } = require('../data/industrySectors');
      const card = strategyCards.find((c: any) => c.id === cardId);
      
      if (card) {
        // Apply card effects
        if (card.effects.playerStats) {
          get().updatePlayerStats(card.effects.playerStats);
        }
        
        // Remove card from inventory (single use)
        set((state) => ({
          playerStats: {
            ...state.playerStats,
            strategyCards: state.playerStats.strategyCards.filter(c => c !== cardId)
          }
        }));
        
        get().addGameEvent({
          id: `card_used_${cardId}_${Date.now()}`,
          type: 'info',
          title: 'Strategy Card Used',
          description: `Applied ${card.name}: ${card.description}`,
          timestamp: new Date()
        });
        
        return true;
      }
      
      return false;
    },

    gainClarityXP: (amount: number, reason: string) => {
      set((state) => ({
        playerStats: {
          ...state.playerStats,
          clarityXP: state.playerStats.clarityXP + amount
        }
      }));
      
      get().addGameEvent({
        id: `clarity_gained_${Date.now()}`,
        type: 'info',
        title: 'Clarity Gained',
        description: `+${amount} Clarity XP from ${reason}`,
        timestamp: new Date()
      });
    },

    increaseLoopScore: (amount: number, reason: string) => {
      set((state) => ({
        playerStats: {
          ...state.playerStats,
          loopScore: state.playerStats.loopScore + amount
        }
      }));
      
      // Check for loop boss triggers after increasing loop score
      get().checkLoopBosses();
    },

    setFounderTrait: (trait: 'visionary' | 'empathic' | 'capitalist' | 'manipulator' | 'reflective') => {
      set((state) => ({
        playerStats: {
          ...state.playerStats,
          founderTrait: trait
        }
      }));
      
      get().addGameEvent({
        id: `trait_set_${trait}_${Date.now()}`,
        type: 'info',
        title: 'Founder Trait Set',
        description: `You've chosen the ${trait} founder archetype.`,
        timestamp: new Date()
      });
    },

    // Sector management functions
    purchaseSector: (sectorId: string) => {
      const state = get();
      const investmentAmount = 200000; // ₹2 lakhs

      // Check if sector is already purchased
      if (state.purchasedSectors.includes(sectorId)) {
        return false;
      }

      // Check if sufficient funds
      if (state.financialData.bankBalance < investmentAmount) {
        get().addGameEvent({
          id: `insufficient_funds_${sectorId}_${Date.now()}`,
          type: 'warning',
          title: '🚨 Insufficient Balance',
          description: `You need ₹${investmentAmount.toLocaleString()} to purchase this sector. Current balance: ₹${state.financialData.bankBalance.toLocaleString()}`,
          timestamp: new Date()
        });
        return false;
      }

      // Purchase the sector
      set((state) => ({
        purchasedSectors: [...state.purchasedSectors, sectorId],
        financialData: {
          ...state.financialData,
          bankBalance: state.financialData.bankBalance - investmentAmount
        }
      }));

      // Add transaction record to banking system
      get().addTransaction({
        type: 'sector_purchase',
        amount: -investmentAmount,
        description: `Purchased ${sectorId} business sector`,
        fromAccount: 'bank',
        toAccount: 'business'
      });

      // Add success notification
      get().addGameEvent({
        id: `sector_purchased_${sectorId}_${Date.now()}`,
        type: 'achievement',
        title: '🎯 Sector Purchased!',
        description: `Successfully purchased new sector! Investment: ₹${investmentAmount.toLocaleString()}`,
        timestamp: new Date()
      });


      return true;
    },

    // Fast food chains state management
    setFastFoodState: (state: any) => {
      set((prevState) => ({
        fastFoodChains: state
      }));
    },

    // Asset and Liability management functions
    addAsset: (asset: Omit<Asset, 'id'>) => {
      const assetId = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newAsset: Asset = {
        ...asset,
        id: assetId,
      };

      set((state) => ({
        financialData: {
          ...state.financialData,
          assets: [...state.financialData.assets, newAsset],
          totalAssets: state.financialData.totalAssets + asset.value,
          sideIncome: state.financialData.sideIncome + asset.monthlyIncome,
          monthlyExpenses: state.financialData.monthlyExpenses + (asset.maintenanceCost || 0),
        }
      }));

      // Auto-calculate net worth
      get().calculateNetWorth();

      return assetId;
    },

    removeAsset: (assetId: string) => {
      const state = get();
      const asset = state.financialData.assets.find(a => a.id === assetId);
      if (!asset) return false;

      set((state) => ({
        financialData: {
          ...state.financialData,
          assets: state.financialData.assets.filter(a => a.id !== assetId),
          totalAssets: state.financialData.totalAssets - asset.value,
          sideIncome: state.financialData.sideIncome - asset.monthlyIncome,
          monthlyExpenses: state.financialData.monthlyExpenses - (asset.maintenanceCost || 0),
        }
      }));

      // Auto-calculate net worth
      get().calculateNetWorth();

      return true;
    },

    updateAsset: (assetId: string, updates: Partial<Asset>) => {
      const state = get();
      const assetIndex = state.financialData.assets.findIndex(a => a.id === assetId);
      if (assetIndex === -1) return false;

      const oldAsset = state.financialData.assets[assetIndex];
      const updatedAsset = { ...oldAsset, ...updates };

      set((state) => {
        const newAssets = [...state.financialData.assets];
        newAssets[assetIndex] = updatedAsset;

        return {
          financialData: {
            ...state.financialData,
            assets: newAssets,
            totalAssets: state.financialData.totalAssets - oldAsset.value + updatedAsset.value,
            sideIncome: state.financialData.sideIncome - oldAsset.monthlyIncome + updatedAsset.monthlyIncome,
            monthlyExpenses: state.financialData.monthlyExpenses - (oldAsset.maintenanceCost || 0) + (updatedAsset.maintenanceCost || 0),
          }
        };
      });

      // Auto-calculate net worth
      get().calculateNetWorth();

      return true;
    },

    getAssets: () => {
      return get().financialData.assets;
    },

    getAssetsByCategory: (category: string) => {
      return get().financialData.assets.filter(asset => asset.category === category);
    },

    addLiability: (liability: Omit<Liability, 'id'>) => {
      const liabilityId = `liability_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newLiability: Liability = {
        ...liability,
        id: liabilityId,
      };

      set((state) => ({
        financialData: {
          ...state.financialData,
          liabilities: [...state.financialData.liabilities, newLiability],
          totalLiabilities: state.financialData.totalLiabilities + liability.outstandingAmount,
          monthlyExpenses: state.financialData.monthlyExpenses + liability.emi,
        }
      }));

      // Auto-calculate net worth
      get().calculateNetWorth();

      return liabilityId;
    },

    removeLiability: (liabilityId: string) => {
      const state = get();
      const liability = state.financialData.liabilities.find(l => l.id === liabilityId);
      if (!liability) return false;

      set((state) => ({
        financialData: {
          ...state.financialData,
          liabilities: state.financialData.liabilities.filter(l => l.id !== liabilityId),
          totalLiabilities: state.financialData.totalLiabilities - liability.outstandingAmount,
          monthlyExpenses: state.financialData.monthlyExpenses - liability.emi,
        }
      }));

      // Auto-calculate net worth
      get().calculateNetWorth();

      return true;
    },

    updateLiability: (liabilityId: string, updates: Partial<Liability>) => {
      const state = get();
      const liabilityIndex = state.financialData.liabilities.findIndex(l => l.id === liabilityId);
      if (liabilityIndex === -1) return false;

      const oldLiability = state.financialData.liabilities[liabilityIndex];
      const updatedLiability = { ...oldLiability, ...updates };

      set((state) => {
        const newLiabilities = [...state.financialData.liabilities];
        newLiabilities[liabilityIndex] = updatedLiability;

        return {
          financialData: {
            ...state.financialData,
            liabilities: newLiabilities,
            totalLiabilities: state.financialData.totalLiabilities - oldLiability.outstandingAmount + updatedLiability.outstandingAmount,
            monthlyExpenses: state.financialData.monthlyExpenses - oldLiability.emi + updatedLiability.emi,
          }
        };
      });

      // Auto-calculate net worth
      get().calculateNetWorth();

      return true;
    },

    getLiabilities: () => {
      return get().financialData.liabilities;
    },

    updateAssetValues: () => {
      const state = get();
      const updatedAssets = state.financialData.assets.map(asset => {
        if (asset.appreciationRate) {
          const monthlyAppreciation = asset.appreciationRate / 12 / 100;
          const newValue = asset.value * (1 + monthlyAppreciation);
          return { ...asset, value: newValue };
        }
        return asset;
      });

      const totalAssets = updatedAssets.reduce((sum, asset) => sum + asset.value, 0);

      set((state) => ({
        financialData: {
          ...state.financialData,
          assets: updatedAssets,
          totalAssets: totalAssets,
        }
      }));

      // Auto-calculate net worth
      get().calculateNetWorth();
    },

    calculateNetWorth: () => {
      const state = get();
      const totalAssets = state.financialData.totalAssets + state.financialData.bankBalance;
      const totalLiabilities = state.financialData.totalLiabilities;
      const netWorth = totalAssets - totalLiabilities;

      set((prevState) => ({
        financialData: {
          ...prevState.financialData,
          netWorth: netWorth,
          cashflow: prevState.financialData.mainIncome + prevState.financialData.sideIncome - prevState.financialData.monthlyExpenses,
        }
      }));

      return netWorth;
    },
    
    // Loan management functions
    applyForLoan: (amount: number, purpose: string) => {
      const state = get();
      
      // Check for existing active loans - only one loan allowed at a time
      const activeLoans = state.financialData.liabilities.filter(l => l.category === 'personal_loan' && l.status === 'active');
      if (activeLoans.length > 0) {
        return false; // Cannot take new loan while existing loan is active
      }
      
      // Check if player is eligible (minimum net worth, credit score, etc.)
      const creditScore = Math.min(900, Math.max(300, 720 + Math.floor((state.financialData.netWorth - 500000) / 10000)));
      if (creditScore < 600) {
        return false; // Credit score too low
      }
      
      if (amount < 50000 || amount > 2000000) {
        return false; // Amount out of range
      }
      
      const loanId = `loan_${Date.now()}`;
      
      const newLoan: Liability = {
        id: loanId,
        name: `Personal Loan - ${purpose}`,
        category: 'personal_loan',
        outstandingAmount: amount, // Instantly active with full amount
        originalAmount: amount,
        interestRate: 28, // 28% annual
        emi: Math.floor((amount * (28/100/12)) / (1 - Math.pow(1 + (28/100/12), -24))), // 2 year tenure
        tenure: 24,
        remainingMonths: 24,
        description: `${purpose} - ₹${amount.toLocaleString()}`,
        icon: '🏦',
        status: 'active', // Instantly approved and active
        applicationDate: new Date(),
        approvalDate: new Date(),
        disbursementDate: new Date(),
        // Initialize penalty tracking
        missedPayments: 0,
        penaltyLevel: 0,
        lastPaymentDue: undefined,
        originalInterestRate: 28
      };
      
      set((state) => ({
        financialData: {
          ...state.financialData,
          bankBalance: state.financialData.bankBalance + amount, // Add loan amount to bank balance immediately
          liabilities: [...state.financialData.liabilities, newLoan],
          totalLiabilities: state.financialData.totalLiabilities + amount // Add to total liabilities
        }
      }));
      
      get().addTransaction({
        type: 'loan_disbursed',
        amount: amount,
        description: `Instant loan approved and disbursed: ${purpose} - ₹${amount.toLocaleString()}`,
        fromAccount: 'bank',
        toAccount: 'bank'
      });
      
      get().addGameEvent({
        id: `loan_instant_${Date.now()}`,
        type: 'achievement',
        title: 'Loan Instantly Approved!',
        description: `₹${amount.toLocaleString()} loan for ${purpose} approved and disbursed immediately. EMI: ₹${newLoan.emi.toLocaleString()}/month`,
        timestamp: new Date()
      });
      
      return loanId;
    },
    
    approveLoan: (loanId: string) => {
      const state = get();
      const loan = state.financialData.liabilities.find(l => l.id === loanId);
      
      if (!loan || loan.status !== 'pending') {
        return false;
      }
      
      set((state) => ({
        financialData: {
          ...state.financialData,
          liabilities: state.financialData.liabilities.map(liability =>
            liability.id === loanId
              ? { ...liability, status: 'approved', approvalDate: new Date() }
              : liability
          )
        }
      }));
      
      get().addTransaction({
        type: 'loan_approved',
        amount: 0,
        description: `Loan approved: ${loan.name} - ₹${loan.originalAmount.toLocaleString()}`,
        fromAccount: 'bank',
        toAccount: 'bank'
      });
      
      get().addGameEvent({
        id: `loan_approval_${Date.now()}`,
        type: 'achievement',
        title: 'Loan Approved!',
        description: `Your loan application for ₹${loan.originalAmount.toLocaleString()} has been approved. You can now disburse the amount.`,
        timestamp: new Date()
      });
      
      return true;
    },
    
    disburseLoan: (loanId: string) => {
      const state = get();
      const loan = state.financialData.liabilities.find(l => l.id === loanId);
      
      if (!loan || loan.status !== 'approved') {
        return false;
      }
      
      set((state) => ({
        financialData: {
          ...state.financialData,
          bankBalance: state.financialData.bankBalance + loan.originalAmount,
          liabilities: state.financialData.liabilities.map(liability =>
            liability.id === loanId
              ? { 
                  ...liability, 
                  status: 'active', 
                  outstandingAmount: loan.originalAmount,
                  disbursementDate: new Date() 
                }
              : liability
          ),
          totalLiabilities: state.financialData.totalLiabilities + loan.originalAmount
        }
      }));
      
      get().addTransaction({
        type: 'loan_disbursed',
        amount: loan.originalAmount,
        description: `Loan disbursed: ${loan.name} - ₹${loan.originalAmount.toLocaleString()}`,
        fromAccount: 'bank',
        toAccount: 'bank'
      });
      
      get().addGameEvent({
        id: `loan_disbursement_${Date.now()}`,
        type: 'financial',
        title: 'Loan Disbursed',
        description: `₹${loan.originalAmount.toLocaleString()} has been credited to your account. EMI: ₹${loan.emi.toLocaleString()}/month`,
        timestamp: new Date()
      });
      
      return true;
    },
    
    payLoanEMI: (loanId: string, amount?: number) => {
      const state = get();
      const loan = state.financialData.liabilities.find(l => l.id === loanId);
      
      if (!loan || loan.status !== 'active' || loan.outstandingAmount <= 0) {
        return false;
      }
      
      const paymentAmount = amount || loan.emi;
      
      if (paymentAmount > state.financialData.bankBalance) {
        return false; // Insufficient funds
      }
      
      const principal = paymentAmount - (loan.outstandingAmount * (loan.interestRate / 100 / 12));
      const newOutstanding = Math.max(0, loan.outstandingAmount - principal);
      const newRemainingMonths = Math.max(0, loan.remainingMonths - 1);
      
      set((state) => ({
        financialData: {
          ...state.financialData,
          bankBalance: state.financialData.bankBalance - paymentAmount,
          liabilities: state.financialData.liabilities.map(liability =>
            liability.id === loanId
              ? { 
                  ...liability, 
                  outstandingAmount: newOutstanding,
                  remainingMonths: newRemainingMonths,
                  status: (newOutstanding === 0 ? 'paid_off' : 'active') as 'paid_off' | 'active'
                }
              : liability
          ).filter(liability => 
            liability.id !== loanId || liability.outstandingAmount > 0
          ),
          totalLiabilities: state.financialData.totalLiabilities - principal
        }
      }));
      
      get().addTransaction({
        type: 'loan_payment',
        amount: -paymentAmount,
        description: `Loan EMI: ${loan.name} - ₹${paymentAmount.toLocaleString()}`,
        fromAccount: 'bank',
        toAccount: 'bank'
      });
      
      if (newOutstanding === 0) {
        // Boost karma when loan is fully paid
        set((state) => ({
          playerStats: {
            ...state.playerStats,
            karma: Math.min(100, state.playerStats.karma + 5)
          }
        }));
        
        get().addGameEvent({
          id: `loan_paid_off_${Date.now()}`,
          type: 'achievement',
          title: 'Loan Paid Off!',
          description: `Congratulations! You have fully paid off your ${loan.name}. Karma increased by 5 points!`,
          timestamp: new Date()
        });
      }
      
      return true;
    },

    customLoanPayment: (loanId: string, amount: number) => {
      const state = get();
      const loan = state.financialData.liabilities.find(l => l.id === loanId);
      
      if (!loan || loan.status !== 'active' || loan.outstandingAmount <= 0) {
        return false;
      }
      
      if (amount <= 0 || amount > state.financialData.bankBalance) {
        return false; // Invalid amount or insufficient funds
      }
      
      const newOutstanding = Math.max(0, loan.outstandingAmount - amount);
      
      set((state) => ({
        financialData: {
          ...state.financialData,
          bankBalance: state.financialData.bankBalance - amount,
          liabilities: state.financialData.liabilities.map(liability =>
            liability.id === loanId
              ? { 
                  ...liability, 
                  outstandingAmount: newOutstanding,
                  status: (newOutstanding === 0 ? 'paid_off' : 'active') as 'paid_off' | 'active',
                  lastCustomPayment: Date.now()
                }
              : liability
          ).filter(liability => 
            liability.id !== loanId || liability.outstandingAmount > 0
          ),
          totalLiabilities: state.financialData.totalLiabilities - amount
        }
      }));
      
      get().addTransaction({
        type: 'loan_payment',
        amount: -amount,
        description: `Custom loan payment: ${loan.name} - ₹${amount.toLocaleString()}`,
        fromAccount: 'bank',
        toAccount: 'bank'
      });
      
      if (newOutstanding === 0) {
        // Boost karma when loan is fully paid
        set((state) => ({
          playerStats: {
            ...state.playerStats,
            karma: Math.min(100, state.playerStats.karma + 5)
          }
        }));
        
        get().addGameEvent({
          id: `loan_custom_paid_off_${Date.now()}`,
          type: 'achievement',
          title: 'Loan Paid Off!',
          description: `Congratulations! You have fully paid off your ${loan.name} with custom payment. Karma increased by 5 points!`,
          timestamp: new Date()
        });
      }
      
      return true;
    },
    
    processLoanApprovals: () => {
      const state = get();
      const currentGameDay = state.timeEngine.currentGameDay;
      
      state.financialData.liabilities.forEach(loan => {
        if (loan.status === 'pending' && loan.gameTimeApprovalDay && currentGameDay >= loan.gameTimeApprovalDay) {
          get().approveLoan(loan.id);
        }
      });
    },
    
    // Loan penalty processing - Check every game day for missed payments
    processLoanPenalties: () => {
      const state = get();
      const currentGameDay = state.timeEngine.currentGameDay;
      
      state.financialData.liabilities.forEach(loan => {
        if (loan.category === 'personal_loan' && loan.status === 'active') {
          // Initialize penalty tracking if not present
          if (!loan.lastPaymentDue) {
            get().updateLiability(loan.id, {
              lastPaymentDue: currentGameDay + 28, // First payment due after 4 weeks (28 days)
              missedPayments: 0,
              penaltyLevel: 0,
              originalInterestRate: loan.interestRate
            });
            return;
          }
          
          // Check if payment is overdue (4 weeks = 28 game days)
          if (currentGameDay > loan.lastPaymentDue!) {
            const missedPayments = (loan.missedPayments || 0) + 1;
            
            if (missedPayments === 1 && (!loan.penaltyLevel || loan.penaltyLevel !== 1)) {
              // First penalty: 5% additional interest
              get().applyLoanPenalty(loan.id, 1);
            } else if (missedPayments >= 2 && loan.penaltyLevel !== 2) {
              // Second penalty: Bank takeover
              get().applyLoanPenalty(loan.id, 2);
            }
            
            // Update next payment due date
            get().updateLiability(loan.id, {
              missedPayments,
              lastPaymentDue: currentGameDay + 28 // Next payment due in 4 weeks
            });
          }
        }
      });
    },
    
    // Apply specific penalty levels
    applyLoanPenalty: (loanId: string, penaltyLevel: 1 | 2) => {
      const state = get();
      const loan = state.financialData.liabilities.find(l => l.id === loanId);
      
      if (!loan) return;
      
      if (penaltyLevel === 1) {
        // First penalty: 5% additional interest (33% total instead of 28%)
        const newInterestRate = (loan.originalInterestRate || 28) + 5;
        const newEMI = Math.floor((loan.outstandingAmount * (newInterestRate/100/12)) / (1 - Math.pow(1 + (newInterestRate/100/12), -loan.remainingMonths)));
        
        get().updateLiability(loanId, {
          interestRate: newInterestRate,
          emi: newEMI,
          penaltyLevel: 1
        });
        
        get().addGameEvent({
          id: `loan_penalty_1_${Date.now()}`,
          type: 'warning',
          title: '🚨 Loan Penalty Applied!',
          description: `Your loan payment is overdue! Interest rate increased by 5% to ${newInterestRate}%. Pay your EMI to avoid further penalties.`,
          timestamp: new Date()
        });
        
      } else if (penaltyLevel === 2) {
        // Second penalty: Bank takeover of assets/liabilities
        const totalAssetValue = state.financialData.assets.reduce((sum, asset) => sum + asset.value, 0);
        const totalLoanAmount = loan.outstandingAmount;
        
        if (totalAssetValue >= totalLoanAmount) {
          // Bank takes over sufficient assets to cover loan
          let remainingDebt = totalLoanAmount;
          const assetsToTake = [...state.financialData.assets];
          
          // Remove assets until debt is covered
          while (remainingDebt > 0 && assetsToTake.length > 0) {
            const asset = assetsToTake.pop()!;
            remainingDebt -= asset.value;
            get().removeAsset(asset.id);
          }
          
          // Remove the loan as it's now covered
          get().removeLiability(loanId);
          
          get().addGameEvent({
            id: `loan_penalty_2_${Date.now()}`,
            type: 'warning',
            title: '🏦 Bank Asset Seizure!',
            description: `The bank has seized your assets worth ${formatMoney(totalAssetValue)} to cover your outstanding loan of ${formatMoney(totalLoanAmount)}.`,
            timestamp: new Date()
          });
          
        } else {
          // Insufficient assets - Heavy penalties but game continues
          // Clear all liabilities but add large negative balance instead of ending game
          set((state) => ({
            financialData: {
              ...state.financialData,
              bankBalance: state.financialData.bankBalance - totalLoanAmount,
              assets: [], // Assets still seized
              liabilities: [], // All debts cleared
              totalAssets: 0,
              totalLiabilities: 0,
              netWorth: state.financialData.bankBalance - totalLoanAmount
            }
          }));
          
          get().addGameEvent({
            id: `severe_debt_penalty_${Date.now()}`,
            type: 'warning',
            title: '🚨 Severe Financial Crisis!',
            description: `Unable to cover ₹${totalLoanAmount.toLocaleString()} loan. All assets seized, massive debt added. You can still recover!`,
            timestamp: new Date()
          });
        }
        
        get().updateLiability(loanId, {
          penaltyLevel: 2
        });
      }
    },
    
    // Severe financial crisis but game continues
    triggerBankruptcy: (reason: string) => {
      // Instead of ending game, apply severe penalties but allow recovery
      set((state) => ({
        gameState: {
          ...state.gameState,
          isBankrupt: false, // No longer sets bankruptcy flag
          isInJail: false, // No jail mechanics
          bankruptcyReason: undefined
        },
        playerStats: {
          ...state.playerStats,
          stress: Math.min(100, state.playerStats.stress + 30),
          emotion: Math.max(0, state.playerStats.emotion - 20),
          reputation: Math.max(0, state.playerStats.reputation - 40)
        }
      }));
      
      get().addGameEvent({
        id: `financial_crisis_${Date.now()}`,
        type: 'warning',
        title: '💸 SEVERE FINANCIAL CRISIS!',
        description: `${reason}. Heavy penalties applied but you can still recover. Focus on rebuilding!`,
        timestamp: new Date()
      });
      
      // Game continues - no ending
    },
  }))
);

// Computed helper functions (non-hooks to avoid circular dependency)
export const calculateFinancialIndependence = (financialData: FinancialData) => {
  const fiRatio = financialData.sideIncome / financialData.monthlyExpenses;
  const isFinanciallyIndependent = fiRatio >= 1.0;
  const progressPercent = Math.min(100, fiRatio * 100);
  
  return {
    fiRatio,
    isFinanciallyIndependent,
    progressPercent,
    monthsToFI: isFinanciallyIndependent ? 0 : Math.ceil((financialData.monthlyExpenses - financialData.sideIncome) / (financialData.mainIncome * 0.3)), // Assuming 30% savings rate
  };
};

export const calculatePlayerLevel = (playerStats: PlayerStats) => {
  // Calculate overall player level based on stats
  const totalStats = Object.values(playerStats).reduce((sum, stat) => {
    return sum + (typeof stat === 'number' ? stat : 0);
  }, 0);
  const averageStats = totalStats / Object.keys(playerStats).length;
  
  const level = Math.floor(averageStats / 10) + 1;
  const levelProgress = (averageStats % 10) * 10;
  
  return {
    level: Math.min(10, level), // Max level 10
    progress: levelProgress,
    averageStats,
  };
};

// Auto-save functionality
if (typeof window !== 'undefined') {
  useWealthSprintGame.subscribe(
    (state) => state,
    (state) => {
      // Auto-save to localStorage every state change
      localStorage.setItem('wealthSprintSave', JSON.stringify({
        currentWeek: state.currentWeek,
        currentDay: state.currentDay,
        gameStarted: state.gameStarted,
        gameEnded: state.gameEnded,
        endingType: state.endingType,
        timeEngine: state.timeEngine,
        gameState: state.gameState,
        playerStats: state.playerStats,
        financialData: state.financialData,
        gameEvents: state.gameEvents.slice(0, 20), // Save only recent events
        purchasedSectors: state.purchasedSectors,
        fastFoodChains: state.fastFoodChains,
      }));
    }
  );
  
  // Load saved game on initialization
  const savedGame = localStorage.getItem('wealthSprintSave');
  if (savedGame) {
    try {
      const parsedSave = JSON.parse(savedGame);
      useWealthSprintGame.setState(parsedSave);
    } catch (error) {
      console.warn('Failed to load saved game:', error);
    }
  }
}