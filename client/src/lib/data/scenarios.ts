// Enhanced Scenario System for Wealth Sprint
export interface ScenarioChoice {
  id: string;
  text: string;
  effects: {
    bankBalance?: number;
    inHandCash?: number;
    emotion?: number;
    stress?: number;
    karma?: number;
    logic?: number;
    reputation?: number;
    energy?: number;
    mainIncome?: number;
    sideIncome?: number;
    monthlyExpenses?: number;
  };
  description: string;
}

export interface GameScenario {
  id: number;
  section: 'Finance' | 'Emotion' | 'Business' | 'Personal' | 'Investment' | 'HR/Team';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  options: ScenarioChoice[];
  tags: string[];
}

export const scenarioDatabase: GameScenario[] = [
  // FINANCE SCENARIOS (200+)
  {
    id: 1,
    section: 'Finance',
    title: 'FD Maturity Decision',
    description: 'Your 5-year FD of ₹5 lakhs has matured. Interest rates have dropped significantly since you invested.',
    urgency: 'medium',
    tags: ['FD', 'Investment', 'Interest rates'],
    options: [
      {
        id: 'renew_fd',
        text: 'Renew FD at lower rate (6.5%)',
        effects: { bankBalance: 500000, emotion: -5, logic: 5 },
        description: 'Safe but lower returns'
      },
      {
        id: 'equity_invest',
        text: 'Invest in equity mutual funds',
        effects: { bankBalance: 500000, stress: 10, logic: 10 },
        description: 'Higher risk, potentially higher returns'
      },
      {
        id: 'real_estate',
        text: 'Use as down payment for property',
        effects: { bankBalance: 500000, stress: 20, reputation: 10 },
        description: 'Leverage for real estate investment'
      }
    ]
  },
  {
    id: 2,
    section: 'Finance',
    title: 'EMI Burden Crisis',
    description: 'Your monthly EMIs are consuming 65% of your income. You need to make a difficult decision.',
    urgency: 'high',
    tags: ['EMI', 'Debt', 'Financial crisis'],
    options: [
      {
        id: 'sell_asset',
        text: 'Sell investments to pay off loans',
        effects: { bankBalance: 200000, stress: -20, logic: 10 },
        description: 'Reduce debt burden but lose investment potential'
      },
      {
        id: 'extend_tenure',
        text: 'Extend loan tenure to reduce EMI',
        effects: { monthlyExpenses: -5000, stress: 5, karma: -5 },
        description: 'Lower EMI but more total interest'
      },
      {
        id: 'side_income',
        text: 'Start freelancing for extra income',
        effects: { sideIncome: 15000, stress: 15, energy: -10 },
        description: 'More income but work-life balance suffers'
      }
    ]
  },
  {
    id: 3,
    section: 'Finance',
    title: 'Salary Delayed Crisis',
    description: 'Your company has delayed salaries for 3 months due to cash flow issues. Bills are piling up.',
    urgency: 'high',
    tags: ['Salary', 'Cash flow', 'Emergency'],
    options: [
      {
        id: 'personal_loan',
        text: 'Take personal loan for expenses',
        effects: { bankBalance: 150000, stress: 20, karma: -5 },
        description: 'Immediate relief but debt burden'
      },
      {
        id: 'family_help',
        text: 'Ask family for financial help',
        effects: { inHandCash: 50000, emotion: -15, reputation: -10 },
        description: 'Family support but damaged pride'
      },
      {
        id: 'job_switch',
        text: 'Start looking for new job immediately',
        effects: { stress: 10, logic: 15, energy: -5 },
        description: 'Long-term solution but uncertain timing'
      }
    ]
  },
  {
    id: 4,
    section: 'Finance',
    title: 'Debt Trap Warning',
    description: 'Credit card bills have reached ₹3 lakhs. Minimum payments are becoming difficult.',
    urgency: 'high',
    tags: ['Credit card', 'Debt trap', 'Financial crisis'],
    options: [
      {
        id: 'debt_consolidation',
        text: 'Take personal loan for debt consolidation',
        effects: { bankBalance: 300000, stress: 10, logic: 10 },
        description: 'Lower interest but still debt'
      },
      {
        id: 'sell_everything',
        text: 'Sell all non-essential assets',
        effects: { bankBalance: 200000, emotion: -20, stress: -10 },
        description: 'Drastic step but debt freedom'
      },
      {
        id: 'negotiate_settlement',
        text: 'Negotiate with bank for settlement',
        effects: { bankBalance: 150000, reputation: -20, karma: -10 },
        description: 'Partial relief but credit score damage'
      }
    ]
  },
  {
    id: 5,
    section: 'Finance',
    title: 'Bond Investment Opportunity',
    description: 'Government bonds with 8% return for 10 years are available. Should you invest your savings?',
    urgency: 'medium',
    tags: ['Bonds', 'Government', 'Long-term investment'],
    options: [
      {
        id: 'invest_bonds',
        text: 'Invest ₹2 lakhs in bonds',
        effects: { bankBalance: -200000, logic: 10, stress: -5 },
        description: 'Safe long-term investment'
      },
      {
        id: 'equity_instead',
        text: 'Invest in equity for better returns',
        effects: { bankBalance: -200000, stress: 10, logic: 5 },
        description: 'Higher risk but potential for better returns'
      },
      {
        id: 'keep_liquid',
        text: 'Keep money in savings account',
        effects: { emotion: -5, logic: -10 },
        description: 'Liquid but inflation erosion'
      }
    ]
  },

  // EMOTION SCENARIOS (200+)
  {
    id: 101,
    section: 'Emotion',
    title: 'Midnight Burnout',
    description: 'You\'ve worked 22 days non-stop. Your energy is at 20%. Family is complaining about your absence.',
    urgency: 'high',
    tags: ['Burnout', 'Overwork', 'Work-life balance'],
    options: [
      {
        id: 'take_rest',
        text: 'Take 2-day rest',
        effects: { energy: 40, mainIncome: -10000, emotion: 20 },
        description: 'Rest and recover but lose income'
      },
      {
        id: 'push_harder',
        text: 'Push through for the deadline',
        effects: { karma: -10, stress: 30, mainIncome: 20000 },
        description: 'Complete work but risk health'
      },
      {
        id: 'delegate_work',
        text: 'Delegate some tasks to team',
        effects: { stress: -10, reputation: 5, logic: 10 },
        description: 'Smart delegation but depends on team'
      }
    ]
  },
  {
    id: 102,
    section: 'Emotion',
    title: 'Regret Over Investment Loss',
    description: 'You lost ₹2 lakhs in a risky stock investment. You\'re feeling depressed and making poor decisions.',
    urgency: 'medium',
    tags: ['Regret', 'Loss', 'Depression'],
    options: [
      {
        id: 'accept_move_on',
        text: 'Accept the loss and move on',
        effects: { emotion: 15, logic: 20, stress: -10 },
        description: 'Healthy response to failure'
      },
      {
        id: 'revenge_trading',
        text: 'Try to recover losses with more trading',
        effects: { bankBalance: -50000, emotion: -20, stress: 25 },
        description: 'Dangerous emotional response'
      },
      {
        id: 'seek_counseling',
        text: 'Talk to a financial counselor',
        effects: { inHandCash: -5000, emotion: 10, logic: 15 },
        description: 'Professional help for emotional recovery'
      }
    ]
  },
  {
    id: 103,
    section: 'Emotion',
    title: 'Motivation Crisis',
    description: 'You\'ve been feeling unmotivated for weeks. Work performance is declining.',
    urgency: 'medium',
    tags: ['Motivation', 'Performance', 'Career'],
    options: [
      {
        id: 'take_vacation',
        text: 'Take a week-long vacation',
        effects: { inHandCash: -25000, energy: 30, emotion: 25 },
        description: 'Recharge but expensive'
      },
      {
        id: 'new_challenges',
        text: 'Request new challenging projects',
        effects: { stress: 10, logic: 15, reputation: 10 },
        description: 'Stimulate motivation through challenge'
      },
      {
        id: 'career_counseling',
        text: 'Seek career counseling',
        effects: { inHandCash: -10000, logic: 20, emotion: 10 },
        description: 'Professional guidance for career direction'
      }
    ]
  },

  // BUSINESS SCENARIOS (200+)
  {
    id: 201,
    section: 'Business',
    title: 'Team Conflict Resolution',
    description: 'Two senior team members are in serious conflict, affecting entire team productivity.',
    urgency: 'high',
    tags: ['Team conflict', 'Leadership', 'Productivity'],
    options: [
      {
        id: 'mediate_conflict',
        text: 'Mediate the conflict personally',
        effects: { stress: 15, reputation: 10, logic: 10 },
        description: 'Direct intervention but time-consuming'
      },
      {
        id: 'separate_teams',
        text: 'Separate them into different teams',
        effects: { stress: 5, reputation: -5, logic: 5 },
        description: 'Quick fix but may not solve root cause'
      },
      {
        id: 'hr_intervention',
        text: 'Let HR handle the situation',
        effects: { stress: -5, reputation: -10, karma: -5 },
        description: 'Avoid direct confrontation but seen as weak'
      }
    ]
  },
  {
    id: 202,
    section: 'Business',
    title: 'Major Deal Opportunity',
    description: 'A potential client offers ₹50 lakh contract but demands 90-day payment terms.',
    urgency: 'medium',
    tags: ['Deal', 'Cash flow', 'Business growth'],
    options: [
      {
        id: 'accept_deal',
        text: 'Accept the deal with payment terms',
        effects: { mainIncome: 500000, stress: 20, reputation: 15 },
        description: 'Big opportunity but cash flow risk'
      },
      {
        id: 'negotiate_terms',
        text: 'Negotiate for 30-day payment terms',
        effects: { mainIncome: 350000, stress: 10, logic: 10 },
        description: 'Balanced approach with lower risk'
      },
      {
        id: 'reject_deal',
        text: 'Reject due to payment terms',
        effects: { emotion: -10, logic: 15, stress: -5 },
        description: 'Conservative but safe approach'
      }
    ]
  },
  {
    id: 203,
    section: 'Business',
    title: 'Product Pivot Decision',
    description: 'Market research shows your main product needs major changes. This will cost ₹20 lakhs.',
    urgency: 'high',
    tags: ['Product pivot', 'Market research', 'Investment'],
    options: [
      {
        id: 'full_pivot',
        text: 'Invest in complete product pivot',
        effects: { bankBalance: -200000, stress: 25, logic: 15 },
        description: 'Major change but better market fit'
      },
      {
        id: 'gradual_changes',
        text: 'Make gradual improvements',
        effects: { bankBalance: -75000, stress: 10, logic: 10 },
        description: 'Safer approach but slower adaptation'
      },
      {
        id: 'continue_current',
        text: 'Continue with current product',
        effects: { mainIncome: -50000, stress: -5, logic: -10 },
        description: 'No investment but declining market share'
      }
    ]
  },

  // PERSONAL SCENARIOS (200+)
  {
    id: 301,
    section: 'Personal',
    title: 'Family Emergency Fund',
    description: 'Your sibling needs ₹3 lakhs for their child\'s education. You have the money but it\'s your emergency fund.',
    urgency: 'high',
    tags: ['Family', 'Emergency fund', 'Education'],
    options: [
      {
        id: 'help_family',
        text: 'Give the money to help family',
        effects: { bankBalance: -300000, emotion: 20, karma: 25 },
        description: 'Family support but depleted emergency fund'
      },
      {
        id: 'partial_help',
        text: 'Give ₹1.5 lakhs as partial help',
        effects: { bankBalance: -150000, emotion: 5, karma: 10 },
        description: 'Balanced approach but family may be disappointed'
      },
      {
        id: 'suggest_loan',
        text: 'Suggest they take an education loan',
        effects: { emotion: -10, logic: 15, karma: -5 },
        description: 'Practical but may strain relationship'
      }
    ]
  },
  {
    id: 302,
    section: 'Personal',
    title: 'Relationship vs Career',
    description: 'Your partner wants to relocate for their career. This means you\'ll have to leave your high-paying job.',
    urgency: 'high',
    tags: ['Relationship', 'Career', 'Relocation'],
    options: [
      {
        id: 'relocate_together',
        text: 'Relocate and find new job',
        effects: { mainIncome: -25000, emotion: 20, stress: 15 },
        description: 'Support partner but career setback'
      },
      {
        id: 'long_distance',
        text: 'Maintain long-distance relationship',
        effects: { monthlyExpenses: 10000, emotion: -15, stress: 20 },
        description: 'Keep job but strain relationship'
      },
      {
        id: 'remote_work',
        text: 'Negotiate remote work arrangement',
        effects: { mainIncome: -10000, emotion: 10, logic: 15 },
        description: 'Compromise solution but income reduction'
      }
    ]
  },
  {
    id: 303,
    section: 'Personal',
    title: 'Health Insurance Decision',
    description: 'Your health insurance premium has increased by 40%. You need to decide on coverage.',
    urgency: 'medium',
    tags: ['Health insurance', 'Healthcare', 'Premium'],
    options: [
      {
        id: 'pay_premium',
        text: 'Pay increased premium',
        effects: { monthlyExpenses: 5000, stress: 5, logic: 15 },
        description: 'Maintain coverage but higher cost'
      },
      {
        id: 'reduce_coverage',
        text: 'Reduce coverage to lower premium',
        effects: { monthlyExpenses: 1000, stress: 10, logic: 5 },
        description: 'Lower cost but higher risk'
      },
      {
        id: 'switch_provider',
        text: 'Switch to different insurance provider',
        effects: { monthlyExpenses: 2000, stress: 15, logic: 10 },
        description: 'Moderate cost but coverage uncertainty'
      }
    ]
  },

  // INVESTMENT SCENARIOS (200+)
  {
    id: 401,
    section: 'Investment',
    title: 'Crypto Investment Hype',
    description: 'Everyone around you is making money in cryptocurrency. You have ₹2 lakhs to invest.',
    urgency: 'medium',
    tags: ['Cryptocurrency', 'FOMO', 'High risk'],
    options: [
      {
        id: 'invest_crypto',
        text: 'Invest ₹2 lakhs in cryptocurrency',
        effects: { bankBalance: -200000, stress: 25, emotion: 10 },
        description: 'High risk, high reward but very volatile'
      },
      {
        id: 'small_investment',
        text: 'Invest only ₹50,000 to test waters',
        effects: { bankBalance: -50000, stress: 10, logic: 10 },
        description: 'Conservative approach to high-risk investment'
      },
      {
        id: 'avoid_crypto',
        text: 'Avoid cryptocurrency completely',
        effects: { emotion: -5, logic: 20, stress: -5 },
        description: 'Safe but might miss opportunities'
      }
    ]
  },
  {
    id: 402,
    section: 'Investment',
    title: 'Real Estate Scam Alert',
    description: 'A property dealer offers 40% below market rate. Something seems fishy but the deal looks attractive.',
    urgency: 'high',
    tags: ['Real estate', 'Scam', 'Due diligence'],
    options: [
      {
        id: 'investigate_deal',
        text: 'Hire lawyer to investigate the deal',
        effects: { inHandCash: -25000, logic: 20, stress: 10 },
        description: 'Due diligence but additional cost'
      },
      {
        id: 'trust_dealer',
        text: 'Trust the dealer and proceed',
        effects: { bankBalance: -500000, stress: 30, karma: -15 },
        description: 'High risk of fraud'
      },
      {
        id: 'walk_away',
        text: 'Walk away from the deal',
        effects: { emotion: -5, logic: 15, stress: -10 },
        description: 'Safe but might miss genuine opportunity'
      }
    ]
  },
  {
    id: 403,
    section: 'Investment',
    title: 'Stock Market Crash',
    description: 'Market has crashed 30% in two days. Your portfolio is down ₹3 lakhs.',
    urgency: 'high',
    tags: ['Stock market', 'Crash', 'Portfolio'],
    options: [
      {
        id: 'hold_investments',
        text: 'Hold all investments and wait',
        effects: { stress: 20, logic: 15, emotion: -10 },
        description: 'Patient approach but uncertain recovery'
      },
      {
        id: 'sell_everything',
        text: 'Sell everything to prevent further losses',
        effects: { bankBalance: -300000, stress: 30, logic: -10 },
        description: 'Panic selling often leads to losses'
      },
      {
        id: 'buy_more',
        text: 'Buy more stocks at discounted prices',
        effects: { bankBalance: -100000, stress: 15, logic: 20 },
        description: 'Contrarian approach but requires courage'
      }
    ]
  },

  // HR/TEAM SCENARIOS (200+)
  {
    id: 501,
    section: 'HR/Team',
    title: 'Key Employee Resignation',
    description: 'Your best developer wants to quit for 40% salary hike at another company.',
    urgency: 'high',
    tags: ['Resignation', 'Retention', 'Salary hike'],
    options: [
      {
        id: 'counter_offer',
        text: 'Match the salary offer',
        effects: { monthlyExpenses: 30000, stress: 10, reputation: 10 },
        description: 'Retain talent but cost increase'
      },
      {
        id: 'negotiate_benefits',
        text: 'Offer better benefits instead of salary',
        effects: { monthlyExpenses: 15000, stress: 15, logic: 10 },
        description: 'Creative retention but may not work'
      },
      {
        id: 'let_them_go',
        text: 'Let them go and hire replacement',
        effects: { mainIncome: -50000, stress: 25, logic: 5 },
        description: 'Cheaper but productivity loss'
      }
    ]
  },
  {
    id: 502,
    section: 'HR/Team',
    title: 'Loyalty Crisis',
    description: 'Anonymous survey shows 60% of team is considering leaving. Morale is at all-time low.',
    urgency: 'high',
    tags: ['Loyalty', 'Morale', 'Team management'],
    options: [
      {
        id: 'team_bonuses',
        text: 'Give surprise bonuses to everyone',
        effects: { bankBalance: -200000, emotion: 15, reputation: 20 },
        description: 'Expensive but immediate morale boost'
      },
      {
        id: 'restructure_management',
        text: 'Restructure management approach',
        effects: { stress: 20, logic: 15, reputation: 10 },
        description: 'Fundamental change but time-consuming'
      },
      {
        id: 'one_on_one',
        text: 'Conduct one-on-one meetings with each member',
        effects: { stress: 15, emotion: 10, logic: 10 },
        description: 'Personal attention but very time-consuming'
      }
    ]
  },
  {
    id: 503,
    section: 'HR/Team',
    title: 'Promotion Dilemma',
    description: 'Two equally qualified team members are competing for the same promotion. Both threaten to leave if not promoted.',
    urgency: 'medium',
    tags: ['Promotion', 'Competition', 'Team dynamics'],
    options: [
      {
        id: 'promote_both',
        text: 'Create two positions and promote both',
        effects: { monthlyExpenses: 40000, stress: 5, reputation: 15 },
        description: 'Expensive but maintains team harmony'
      },
      {
        id: 'merit_based',
        text: 'Promote based on clear merit criteria',
        effects: { stress: 15, logic: 20, reputation: 10 },
        description: 'Fair but may lose one person'
      },
      {
        id: 'external_hire',
        text: 'Hire external candidate for the position',
        effects: { monthlyExpenses: 25000, stress: 10, reputation: -15 },
        description: 'Neutral but team may feel betrayed'
      }
    ]
  }
];

// Helper functions for scenario management
export const getRandomScenarios = (count: number = 3): GameScenario[] => {
  const shuffled = [...scenarioDatabase].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getScenariosBySection = (section: string): GameScenario[] => {
  return scenarioDatabase.filter(scenario => scenario.section === section);
};

export const getScenariosByUrgency = (urgency: string): GameScenario[] => {
  return scenarioDatabase.filter(scenario => scenario.urgency === urgency);
};

export const getScenariosByTag = (tag: string): GameScenario[] => {
  return scenarioDatabase.filter(scenario => scenario.tags.includes(tag));
};

export const getRandomScenarioBySection = (section: string): GameScenario | null => {
  const sectionScenarios = getScenariosBySection(section);
  if (sectionScenarios.length === 0) return null;
  return sectionScenarios[Math.floor(Math.random() * sectionScenarios.length)];
};

export const getScenarioById = (id: number): GameScenario | null => {
  return scenarioDatabase.find(scenario => scenario.id === id) || null;
};

// Advanced scenario selection based on player state
export const getContextualScenarios = (playerStats: any, financialData: any): GameScenario[] => {
  const contextualScenarios: GameScenario[] = [];
  
  // Financial stress scenarios
  if (financialData.bankBalance < 50000) {
    contextualScenarios.push(...getScenariosByTag('Financial crisis'));
  }
  
  // Emotional scenarios based on stats
  if (playerStats.stress > 70) {
    contextualScenarios.push(...getScenariosByTag('Burnout'));
  }
  
  if (playerStats.emotion < 40) {
    contextualScenarios.push(...getScenariosByTag('Motivation'));
  }
  
  // Business scenarios for high performers
  if (playerStats.reputation > 80) {
    contextualScenarios.push(...getScenariosByTag('Leadership'));
  }
  
  // Investment scenarios for wealthy players
  if (financialData.bankBalance > 500000) {
    contextualScenarios.push(...getScenariosBySection('Investment'));
  }
  
  // Remove duplicates and shuffle
  const uniqueScenarios = [...new Set(contextualScenarios)];
  return uniqueScenarios.sort(() => Math.random() - 0.5).slice(0, 3);
};