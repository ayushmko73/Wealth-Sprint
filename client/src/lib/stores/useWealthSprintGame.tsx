import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { TeamMember, TeamRole, teamRoles, generateRandomTeamMember, generateRandomName, calculatePromotionCost, calculateBonusAmount } from '../data/teamRoles';

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
  type: 'bond_purchase' | 'bond_maturity' | 'wallet_transfer' | 'salary_credit' | 'bonus_paid' | 'loan_deducted' | 'team_payment' | 'fd_maturity' | 'investment' | 'business' | 'sector_purchase' | 'business_operations';
  amount: number;
  description: string;
  timestamp: Date;
  fromAccount: 'bank' | 'wallet' | 'business';
  toAccount: 'bank' | 'wallet' | 'business';
}

export interface FinancialData {
  bankBalance: number;
  inHandCash: number;
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
  
  // Enhanced wallet functions
  transferToWallet: (amount: number) => boolean;
  transferFromWallet: (amount: number) => boolean;
  spendFromWallet: (amount: number, description: string) => boolean;
  maturityToBank: (amount: number, type: 'FD' | 'Bond', instrumentName: string) => void;
  
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
  inHandCash: 25000, // ₹25k in-hand cash
  netWorth: 525000,
  mainIncome: 75000, // ₹75k monthly salary
  sideIncome: 15000, // ₹15k side income
  monthlyExpenses: 45000, // ₹45k monthly expenses
  totalAssets: 525000,
  totalLiabilities: 0,
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
    },
    
    playerStats: { ...initialPlayerStats },
    financialData: { ...initialFinancialData },
    gameEvents: [],
    teamMembers: [],
    purchasedSectors: [],

    // Actions
    updatePlayerStats: (updates: Partial<PlayerStats>) => {
      set((state) => ({
        playerStats: {
          ...state.playerStats,
          ...updates,
        },
      }));
    },

    updateFinancialData: (updates: Partial<FinancialData>) => {
      set((state) => {
        const newFinancialData = { ...state.financialData, ...updates };
        
        // Calculate net worth
        newFinancialData.netWorth = newFinancialData.bankBalance + newFinancialData.inHandCash + newFinancialData.totalAssets - newFinancialData.totalLiabilities;
        
        // Calculate cashflow
        newFinancialData.cashflow = newFinancialData.mainIncome + newFinancialData.sideIncome - newFinancialData.monthlyExpenses;
        
        return {
          financialData: newFinancialData,
        };
      });
    },
    
    // Enhanced wallet functions
    transferToWallet: (amount: number) => {
      const state = get();
      if (state.financialData.bankBalance >= amount) {
        set((state) => ({
          financialData: {
            ...state.financialData,
            bankBalance: state.financialData.bankBalance - amount,
            inHandCash: state.financialData.inHandCash + amount,
          },
        }));
        return true;
      }
      return false;
    },

    transferFromWallet: (amount: number) => {
      const state = get();
      if (state.financialData.inHandCash >= amount) {
        set((state) => ({
          financialData: {
            ...state.financialData,
            inHandCash: state.financialData.inHandCash - amount,
            bankBalance: state.financialData.bankBalance + amount,
          },
        }));
        return true;
      }
      return false;
    },
    
    spendFromWallet: (amount: number, description: string) => {
      const state = get();
      if (state.financialData.inHandCash >= amount) {
        set((state) => ({
          financialData: {
            ...state.financialData,
            inHandCash: state.financialData.inHandCash - amount,
            monthlyExpenses: state.financialData.monthlyExpenses + amount,
          },
        }));
        
        // Add transaction event
        get().addGameEvent({
          id: `wallet_spend_${Date.now()}`,
          type: 'financial',
          title: 'Wallet Purchase',
          description: `Spent ₹${amount.toLocaleString()} from wallet on ${description}`,
          timestamp: new Date(),
        });
        
        return true;
      }
      return false;
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

    // Background Time Engine (24× Speed)
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
        
        // Advance month if day exceeds 30
        if (newGameDay > 30) {
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
            
            // Check if game should end after 5 years
            if (newGameYear > 5) {
              return {
                ...state,
                timeEngine: {
                  ...timeEngine,
                  currentGameDay: 30,
                  currentGameMonth: 12,
                  currentGameYear: 5,
                  daysSinceLastScenario: newDaysSinceLastScenario,
                  isGameEnded: true,
                },
                financialData: newFinancialData,
              };
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
      if (state.financialData.bankBalance < -100000) {
        get().endGame('failure');
        return true;
      }
      return false;
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
      
      // Check bankruptcy (ends game if true)
      if (get().checkBankruptcy()) {
        return;
      }
      
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

      // Gain some clarity XP for strategic expansion
      get().gainClarityXP(25, `Strategic sector purchase`);

      return true;
    },

    // Fast food chains state management
    setFastFoodState: (state: any) => {
      set((prevState) => ({
        fastFoodChains: state
      }));
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