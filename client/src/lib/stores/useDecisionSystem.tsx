import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Decision, DecisionOption, getDecisionsForDay } from '../data/decisionsData';

export interface PlayerDecision {
  id: string;
  decisionId: string;
  day: number;
  question: string;
  selectedOptionId: string;
  selectedOptionText: string;
  consequences: any;
  timestamp: Date;
  blockchainHash?: string; // For blockchain storage
  ipfsHash?: string; // For IPFS storage
}

export interface DailyDecisionSession {
  day: number;
  decisions: Decision[];
  completedDecisions: PlayerDecision[];
  currentDecisionIndex: number;
  isCompleted: boolean;
  startTime: Date;
  endTime?: Date;
}

interface DecisionSystemState {
  // Current session data
  currentSession: DailyDecisionSession | null;
  allPlayerDecisions: PlayerDecision[];
  
  // UI state
  showDecisionCard: boolean;
  showResultScreen: boolean;
  currentDecision: Decision | null;
  selectedOption: DecisionOption | null;
  
  // New consolidated interface support
  selectedOptions: Record<string, DecisionOption>;
  
  // Game integration
  gameDay: number;
  hasCompletedToday: boolean;
  
  // Actions
  startDailyDecisions: (day: number) => void;
  selectDecisionOption: (decisionId: string, option: DecisionOption) => void;
  submitDecision: () => void;
  submitAllDecisions: () => void;
  nextDecision: () => void;
  finishDailyDecisions: () => void;
  
  // Blockchain functions (simulated for now)
  storeDecisionOnChain: (decision: PlayerDecision) => Promise<string>;
  retrieveDecisionFromChain: (hash: string) => Promise<PlayerDecision>;
  checkAndStartTodaysDecisions: () => void;
  
  // Data management
  getDecisionHistory: () => PlayerDecision[];
  getDecisionsByDay: (day: number) => PlayerDecision[];
  resetDecisionSystem: () => void;
  
  // Daily check
  checkAndStartTodaysDecisions: () => void;
}

const useDecisionSystem = create<DecisionSystemState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentSession: null,
    allPlayerDecisions: [],
    showDecisionCard: false,
    showResultScreen: false,
    currentDecision: null,
    selectedOption: null,
    selectedOptions: {},
    gameDay: 1,
    hasCompletedToday: false,

    // Start daily decisions for a specific day
    startDailyDecisions: (day: number) => {
      const decisions = getDecisionsForDay(day);
      if (decisions.length === 0) return;

      const session: DailyDecisionSession = {
        day,
        decisions,
        completedDecisions: [],
        currentDecisionIndex: 0,
        isCompleted: false,
        startTime: new Date()
      };

      set({
        currentSession: session,
        currentDecision: decisions[0],
        showDecisionCard: true,
        showResultScreen: false,
        selectedOption: null,
        selectedOptions: {},
        gameDay: day,
        hasCompletedToday: false
      });
    },

    // Select an option for the current decision
    selectDecisionOption: (decisionId: string, option: DecisionOption) => {
      set((state) => ({
        selectedOption: option,
        selectedOptions: {
          ...state.selectedOptions,
          [decisionId]: option
        }
      }));
    },

    // Submit the selected decision and show results
    submitDecision: async () => {
      const { currentSession, currentDecision, selectedOption } = get();
      if (!currentSession || !currentDecision || !selectedOption) return;

      // Create player decision record
      const playerDecision: PlayerDecision = {
        id: `pd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        decisionId: currentDecision.id,
        day: currentSession.day,
        question: currentDecision.question,
        selectedOptionId: selectedOption.id,
        selectedOptionText: selectedOption.text,
        consequences: selectedOption.consequences,
        timestamp: new Date()
      };

      // Store on blockchain (simulated)
      try {
        const blockchainHash = await get().storeDecisionOnChain(playerDecision);
        playerDecision.blockchainHash = blockchainHash;
      } catch (error) {
        console.error('Failed to store decision on blockchain:', error);
      }

      // Update session with completed decision
      const updatedSession = {
        ...currentSession,
        completedDecisions: [...currentSession.completedDecisions, playerDecision]
      };

      set({
        currentSession: updatedSession,
        allPlayerDecisions: [...get().allPlayerDecisions, playerDecision],
        showDecisionCard: false,
        showResultScreen: true
      });

      // Apply consequences to game state (integrate with main game store)
      if (selectedOption.consequences) {
        // This will be integrated with useWealthSprintGame store
        console.log('Applying consequences:', selectedOption.consequences);
      }
    },

    // Submit all decisions at once (new consolidated interface)
    submitAllDecisions: async () => {
      const { currentSession, selectedOptions } = get();
      if (!currentSession) return;

      const useWealthSprintGame = await import('../stores/useWealthSprintGame').then(m => m.useWealthSprintGame);

      // Process all decisions
      for (const decision of currentSession.decisions) {
        const selectedOption = selectedOptions[decision.id];
        if (!selectedOption) continue;

        // Create player decision record
        const playerDecision: PlayerDecision = {
          id: `pd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          decisionId: decision.id,
          day: currentSession.day,
          question: decision.question,
          selectedOptionId: selectedOption.id,
          selectedOptionText: selectedOption.text,
          consequences: selectedOption.consequences,
          timestamp: new Date()
        };

        // Store on blockchain (simulated)
        try {
          const blockchainHash = await get().storeDecisionOnChain(playerDecision);
          playerDecision.blockchainHash = blockchainHash;
          console.log('Decision stored on blockchain:', blockchainHash);
        } catch (error) {
          console.error('Error storing on blockchain:', error);
        }

        // Apply consequences to game state
        if (selectedOption.consequences) {
          console.log('Applying consequences:', selectedOption.consequences);
          
          // Apply financial consequences
          if (selectedOption.consequences.financial) {
            useWealthSprintGame.getState().updateFinancialData({
              bankBalance: selectedOption.consequences.financial
            });
          }

          // Apply stat consequences (emotion, stress, etc.)
          const statUpdates: any = {};
          Object.entries(selectedOption.consequences).forEach(([key, value]) => {
            if (key !== 'financial' && key !== 'description' && typeof value === 'number') {
              statUpdates[key] = value;
            }
          });
          
          if (Object.keys(statUpdates).length > 0) {
            useWealthSprintGame.getState().updatePlayerStats(statUpdates);
          }
        }

        // Add to completed decisions and history
        currentSession.completedDecisions.push(playerDecision);
        set(state => ({
          allPlayerDecisions: [...state.allPlayerDecisions, playerDecision]
        }));
      }

      // Mark session as completed
      currentSession.isCompleted = true;
      currentSession.endTime = new Date();

      set({
        showDecisionCard: false,
        showResultScreen: true,
        hasCompletedToday: true
      });
    },

    // Move to next decision or finish session
    nextDecision: () => {
      const { currentSession } = get();
      if (!currentSession) return;

      const nextIndex = currentSession.currentDecisionIndex + 1;
      
      if (nextIndex < currentSession.decisions.length) {
        // Move to next decision
        const nextDecision = currentSession.decisions[nextIndex];
        const updatedSession = {
          ...currentSession,
          currentDecisionIndex: nextIndex
        };

        set({
          currentSession: updatedSession,
          currentDecision: nextDecision,
          showDecisionCard: true,
          showResultScreen: false,
          selectedOption: null
        });
      } else {
        // All decisions completed
        get().finishDailyDecisions();
      }
    },

    // Finish daily decision session
    finishDailyDecisions: () => {
      const { currentSession } = get();
      if (!currentSession) return;

      const finishedSession = {
        ...currentSession,
        isCompleted: true,
        endTime: new Date()
      };

      set({
        currentSession: finishedSession,
        showDecisionCard: false,
        showResultScreen: false,
        hasCompletedToday: true,
        currentDecision: null,
        selectedOption: null
      });
    },

    // Simulated blockchain storage (replace with actual implementation)
    storeDecisionOnChain: async (decision: PlayerDecision): Promise<string> => {
      // Simulate blockchain storage delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a hash-like string for simulation
      const dataString = JSON.stringify({
        id: decision.id,
        decisionId: decision.decisionId,
        day: decision.day,
        selectedOptionId: decision.selectedOptionId,
        timestamp: decision.timestamp.toISOString()
      });
      
      // Simple hash simulation (replace with actual blockchain integration)
      const hash = btoa(dataString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      
      console.log('Decision stored on blockchain:', hash);
      return hash;
    },

    // Simulated blockchain retrieval
    retrieveDecisionFromChain: async (hash: string): Promise<PlayerDecision> => {
      // Simulate retrieval delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In real implementation, this would query blockchain by hash
      const stored = get().allPlayerDecisions.find(d => d.blockchainHash === hash);
      if (!stored) {
        throw new Error('Decision not found on blockchain');
      }
      
      return stored;
    },

    // Get all player decisions
    getDecisionHistory: () => {
      return get().allPlayerDecisions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    },

    // Get decisions for specific day
    getDecisionsByDay: (day: number) => {
      return get().allPlayerDecisions.filter(d => d.day === day);
    },

    // Reset entire decision system
    resetDecisionSystem: () => {
      set({
        currentSession: null,
        allPlayerDecisions: [],
        showDecisionCard: false,
        showResultScreen: false,
        currentDecision: null,
        selectedOption: null,
        gameDay: 1,
        hasCompletedToday: false
      });
    },

    // Check and start today's decisions automatically
    checkAndStartTodaysDecisions: () => {
      const { gameDay, hasCompletedToday } = get();
      
      // Only start if haven't completed today's decisions
      if (!hasCompletedToday) {
        const existingDecisions = get().getDecisionsByDay(gameDay);
        const expectedDecisions = getDecisionsForDay(gameDay);
        
        // Start decisions if none completed for today or incomplete set
        if (existingDecisions.length === 0 || existingDecisions.length < expectedDecisions.length) {
          get().startDailyDecisions(gameDay);
        }
      }
    }
  }))
);

export { useDecisionSystem };