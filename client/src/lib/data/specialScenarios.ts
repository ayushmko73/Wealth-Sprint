import { GameScenario } from './scenarios';

// Special scenarios triggered by specific game conditions
export const specialScenarios: { [key: string]: GameScenario } = {
  // Stress >= 100 (Hospitalization)
  hospitalization: {
    id: 9001,
    section: 'Personal',
    title: 'Hospital Emergency',
    description: 'You collapsed in the office and woke up in the ICU. The doctors say you need immediate rest.',
    urgency: 'high',
    options: [
      {
        id: 'rest',
        text: 'Take the rest seriously',
        effects: {
          stress: -60,
          bankBalance: -10000,
          energy: 20,
          emotion: 10
        },
        description: 'Rest and recover properly'
      },
      {
        id: 'ignore',
        text: 'Ignore and get back to work',
        effects: {
          stress: 10,
          karma: -20,
          energy: -10,
          bankBalance: -5000
        },
        description: 'Push through the pain'
      }
    ],
    tags: ['stress', 'health', 'emergency']
  },

  // Emotion <= 0 (Mental Breakdown)
  mentalBreakdown: {
    id: 9002,
    section: 'Emotion',
    title: 'Mental Breakdown',
    description: 'You lost the will to continue. Everything feels pointless and overwhelming.',
    urgency: 'high',
    options: [
      {
        id: 'therapy',
        text: 'Seek professional help',
        effects: {
          emotion: 30,
          bankBalance: -15000,
          stress: -20,
          karma: 5
        },
        description: 'Invest in mental health'
      },
      {
        id: 'isolate',
        text: 'Isolate and handle alone',
        effects: {
          emotion: 10,
          stress: 20,
          reputation: -10,
          karma: -5
        },
        description: 'Try to cope alone'
      }
    ],
    tags: ['emotion', 'mental health', 'breakdown']
  },

  // Bankruptcy (Bank Balance < -100000)
  bankruptcy: {
    id: 9003,
    section: 'Finance',
    title: 'Bankruptcy Alert',
    description: 'You are ₹1L in debt. Your financial situation is critical and recovery seems impossible.',
    urgency: 'high',
    options: [
      {
        id: 'emergency_loan',
        text: 'Take emergency loan',
        effects: {
          bankBalance: 150000,
          stress: 30,
          karma: -10,
          reputation: -20
        },
        description: 'Get emergency funding'
      },
      {
        id: 'give_up',
        text: 'Accept defeat',
        effects: {
          emotion: -50,
          stress: -20,
          karma: -30
        },
        description: 'End the struggle'
      }
    ],
    tags: ['finance', 'bankruptcy', 'crisis']
  },

  // Reputation < 10 (Low Reputation)
  lowReputation: {
    id: 9004,
    section: 'Business',
    title: 'Reputation Crisis',
    description: 'Your reputation is so low that investors and partners are avoiding you.',
    urgency: 'high',
    options: [
      {
        id: 'public_apology',
        text: 'Make public apology',
        effects: {
          reputation: 15,
          emotion: -10,
          stress: 10,
          karma: 10
        },
        description: 'Humble yourself publicly'
      },
      {
        id: 'rebrand',
        text: 'Rebrand and start fresh',
        effects: {
          reputation: 25,
          bankBalance: -50000,
          stress: 20,
          energy: -15
        },
        description: 'Complete image overhaul'
      }
    ],
    tags: ['reputation', 'business', 'crisis']
  },

  // Karma < 10 (Low Karma)
  lowKarma: {
    id: 9005,
    section: 'Personal',
    title: 'Moral Reckoning',
    description: 'Your unethical decisions are catching up. People are questioning your integrity.',
    urgency: 'medium',
    options: [
      {
        id: 'charity',
        text: 'Donate to charity',
        effects: {
          karma: 20,
          bankBalance: -25000,
          reputation: 10,
          emotion: 5
        },
        description: 'Make amends through giving'
      },
      {
        id: 'continue_path',
        text: 'Continue current path',
        effects: {
          karma: -5,
          reputation: -10,
          stress: 15,
          bankBalance: 10000
        },
        description: 'Stay the course'
      }
    ],
    tags: ['karma', 'ethics', 'moral']
  },

  // Burnout (6+ turns without break)
  burnout: {
    id: 9006,
    section: 'Personal',
    title: 'Burnout Syndrome',
    description: 'You haven\'t taken a break in weeks. Your body and mind are exhausted.',
    urgency: 'high',
    options: [
      {
        id: 'vacation',
        text: 'Take a vacation',
        effects: {
          stress: -40,
          energy: 30,
          emotion: 15,
          bankBalance: -20000
        },
        description: 'Recharge completely'
      },
      {
        id: 'power_through',
        text: 'Power through it',
        effects: {
          stress: 25,
          energy: -20,
          emotion: -10,
          bankBalance: 5000
        },
        description: 'Keep working hard'
      }
    ],
    tags: ['burnout', 'rest', 'health']
  },

  // High Stress + Low Emotion (Blackout Mode)
  blackout: {
    id: 9007,
    section: 'Personal',
    title: 'Blackout Episode',
    description: 'High stress and low emotion triggered a blackout. You woke up not remembering the last few hours.',
    urgency: 'high',
    options: [
      {
        id: 'medical_help',
        text: 'Seek medical attention',
        effects: {
          stress: -30,
          emotion: 20,
          bankBalance: -15000,
          energy: 10
        },
        description: 'Get professional help'
      },
      {
        id: 'self_medicate',
        text: 'Self-medicate and continue',
        effects: {
          stress: 10,
          emotion: -5,
          karma: -10,
          energy: -15
        },
        description: 'Handle it yourself'
      }
    ],
    tags: ['blackout', 'crisis', 'health']
  }
};

// Function to check for special scenario triggers
export const checkSpecialScenarioTriggers = (
  playerStats: any,
  financialData: any,
  gameState: any
): GameScenario | null => {
  // Check for stress hospitalization
  if (playerStats.stress >= 100 && !gameState.isHospitalized) {
    return specialScenarios.hospitalization;
  }

  // Check for mental breakdown
  if (playerStats.emotion <= 0 && !gameState.isMentalBreakdown) {
    return specialScenarios.mentalBreakdown;
  }

  // Check for bankruptcy
  if (financialData.bankBalance < -100000) {
    return specialScenarios.bankruptcy;
  }

  // Check for low reputation
  if (playerStats.reputation < 10) {
    return specialScenarios.lowReputation;
  }

  // Check for low karma
  if (playerStats.karma < 10) {
    return specialScenarios.lowKarma;
  }

  // Check for burnout
  if (gameState.turnsWithoutBreak >= 6) {
    return specialScenarios.burnout;
  }

  // Check for blackout mode
  if (playerStats.stress >= 90 && playerStats.emotion <= 10 && !gameState.isBlackoutMode) {
    return specialScenarios.blackout;
  }

  return null;
};