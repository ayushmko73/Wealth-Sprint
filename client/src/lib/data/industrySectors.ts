import { IndustrySector, Business, LoopBoss, StrategyCard } from '../types/GameTypes';

export const industrySectors: IndustrySector[] = [
  {
    id: 'fast_food',
    name: 'Fast Food Chains',
    icon: '🍟',
    description: 'Choose recipe quality, speed, locations. Manage customer satisfaction vs cost.',
    unlockRequirements: {
      sectorsCompleted: 0,
      maxLoopScore: 100,
    },
    isUnlocked: true,
    businesses: [
      {
        id: 'burger_express',
        name: 'Burger Express',
        type: 'franchise',
        investmentRequired: 200000,
        monthlyRevenue: 45000,
        monthlyExpenses: 35000,
        monthlyProfit: 10000,
        riskLevel: 'medium',
        growthPotential: 'high',
        loopChallenge: 'Speed vs Quality Loop - Racing to scale compromises food quality',
        isOwned: false,
        ownershipPercentage: 0
      },
      {
        id: 'pizza_hub',
        name: 'Pizza Hub',
        type: 'franchise',
        investmentRequired: 300000,
        monthlyRevenue: 60000,
        monthlyExpenses: 45000,
        monthlyProfit: 15000,
        riskLevel: 'low',
        growthPotential: 'medium',
        loopChallenge: 'Quality control across multiple locations',
        isOwned: false,
        ownershipPercentage: 0
      }
    ]
  },
  {
    id: 'tech_startups',
    name: 'Tech Startups',
    icon: '💻',
    description: 'Build product → feedback → pivot. Overcome shiny object syndrome.',
    unlockRequirements: {
      sectorsCompleted: 1,
      maxLoopScore: 80,
    },
    isUnlocked: false,
    businesses: [
      {
        id: 'app_dev_studio',
        name: 'App Dev Studio',
        type: 'startup',
        investmentRequired: 800000,
        monthlyRevenue: 120000,
        monthlyExpenses: 95000,
        monthlyProfit: 25000,
        riskLevel: 'high',
        growthPotential: 'very_high',
        loopChallenge: 'Shiny Object Syndrome - Losing focus chasing new features',
        isOwned: false,
        ownershipPercentage: 0
      },
      {
        id: 'web_agency',
        name: 'Web Agency',
        type: 'service',
        investmentRequired: 400000,
        monthlyRevenue: 75000,
        monthlyExpenses: 55000,
        monthlyProfit: 20000,
        riskLevel: 'medium',
        growthPotential: 'high',
        loopChallenge: 'Client scope creep and timeline pressure',
        isOwned: false,
        ownershipPercentage: 0
      }
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: '📦',
    description: 'Marketing, fulfillment, warehousing. Navigate fake influencers and thin margins.',
    unlockRequirements: {
      sectorsCompleted: 2,
      maxLoopScore: 60,
    },
    isUnlocked: false,
    businesses: [
      {
        id: 'fashion_marketplace',
        name: 'Fashion Marketplace',
        type: 'ecommerce',
        investmentRequired: 700000,
        monthlyRevenue: 180000,
        monthlyExpenses: 150000,
        monthlyProfit: 30000,
        riskLevel: 'high',
        growthPotential: 'high',
        loopChallenge: 'Fake Growth Loop - Inflated metrics hide real problems',
        isOwned: false,
        ownershipPercentage: 0
      },
      {
        id: 'electronics_store',
        name: 'Electronics Store',
        type: 'ecommerce',
        investmentRequired: 600000,
        monthlyRevenue: 140000,
        monthlyExpenses: 115000,
        monthlyProfit: 25000,
        riskLevel: 'medium',
        growthPotential: 'medium',
        loopChallenge: 'Inventory management vs cash flow',
        isOwned: false,
        ownershipPercentage: 0
      }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    description: 'Research, trials, hospitals. Navigate guilt loop between saving lives vs profit.',
    unlockRequirements: {
      sectorsCompleted: 3,
      maxLoopScore: 50,
    },
    isUnlocked: false,
    businesses: [
      {
        id: 'telemedicine_platform',
        name: 'Telemedicine Platform',
        type: 'healthtech',
        investmentRequired: 1500000,
        monthlyRevenue: 400000,
        monthlyExpenses: 280000,
        monthlyProfit: 120000,
        riskLevel: 'medium',
        growthPotential: 'very_high',
        loopChallenge: 'Guilt Loop - Balancing patient care with business viability',
        isOwned: false,
        ownershipPercentage: 0
      },
      {
        id: 'medical_devices',
        name: 'Medical Devices',
        type: 'manufacturing',
        investmentRequired: 2000000,
        monthlyRevenue: 500000,
        monthlyExpenses: 350000,
        monthlyProfit: 150000,
        riskLevel: 'high',
        growthPotential: 'high',
        loopChallenge: 'Regulatory compliance vs innovation speed',
        isOwned: false,
        ownershipPercentage: 0
      }
    ]
  }
];

export const loopBosses: LoopBoss[] = [
  {
    id: 'burnout_loop',
    name: 'Burnout Boss',
    type: 'burnout',
    description: 'Over-scaling with no delegation leads to staff leaving and decision paralysis.',
    triggerConditions: {
      stress: 85,
      loopScore: 30,
      specificActions: ['overwork_team', 'refuse_delegation', 'micromanage']
    },
    effects: {
      playerStats: { stress: 20, energy: -30, reputation: -15 },
      teamImpact: 'Top performers leave, morale crashes',
      businessImpact: 'Growth stagnates, quality drops'
    },
    counterCards: ['delegation_card', 'self_care_practice']
  },
  {
    id: 'betrayal_boss',
    name: 'Betrayal Flame',
    type: 'betrayal',
    description: 'Co-founder or key partner betrays you, causing trust crash and frozen growth.',
    triggerConditions: {
      karma: 30,
      loopScore: 25,
      specificActions: ['ignore_partner_concerns', 'unfair_equity_split']
    },
    effects: {
      playerStats: { emotion: -40, karma: -20, reputation: -25 },
      teamImpact: 'Team splits loyalty, communication breaks down',
      businessImpact: 'Growth freezes, investor confidence drops'
    },
    counterCards: ['forgiveness_card', 'trust_rebuilding']
  },
  {
    id: 'self_doubt_boss',
    name: 'Self-Doubt Shadow',
    type: 'self_doubt',
    description: 'Repeated product failures lock clarity XP and create decision paralysis.',
    triggerConditions: {
      emotion: 25,
      loopScore: 35,
      specificActions: ['ignore_feedback', 'perfectionism', 'fear_of_failure']
    },
    effects: {
      playerStats: { logic: -25, emotion: -15, clarityXP: -50 },
      teamImpact: 'Team loses confidence in leadership',
      businessImpact: 'Innovation stops, market share lost'
    },
    counterCards: ['reflection_unlock', 'growth_mindset']
  },
  {
    id: 'ego_flame',
    name: 'Ego Flame',
    type: 'ego',
    description: 'Big wins lead to over-risking and eventual loss of everything.',
    triggerConditions: {
      reputation: 90,
      loopScore: 20,
      specificActions: ['ignore_advice', 'overconfident_risks', 'dismissive_attitude']
    },
    effects: {
      playerStats: { karma: -30, logic: -20, reputation: -40 },
      teamImpact: 'Team becomes yes-men or rebels',
      businessImpact: 'Catastrophic decisions lead to losses'
    },
    counterCards: ['humility_practice', 'advisors_council']
  },
  {
    id: 'greed_overload',
    name: 'Greed Overload',
    type: 'greed',
    description: 'Crypto boom mentality leads to all-in bets and eventual crash.',
    triggerConditions: {
      karma: 20,
      loopScore: 40,
      specificActions: ['all_in_investments', 'ignore_ethics', 'exploit_opportunities']
    },
    effects: {
      playerStats: { karma: -50, emotion: -30, clarityXP: -100 },
      teamImpact: 'Ethical team members quit',
      businessImpact: 'Financial crash, reputation destroyed'
    },
    counterCards: ['root_value_recall', 'ethical_framework']
  }
];

export const strategyCards: StrategyCard[] = [
  {
    id: 'delegation_card',
    name: 'Delegation Mastery',
    description: 'Learn to delegate effectively without micromanaging.',
    type: 'delegation',
    effects: {
      playerStats: { stress: -20, energy: 15, clarityXP: 25 },
      teamBonus: 20,
      businessBonus: 15
    },
    unlockConditions: {
      founderTrait: 'visionary'
    }
  },
  {
    id: 'forgiveness_card',
    name: 'Forgiveness Practice',
    description: 'Release resentment and rebuild trust after betrayal.',
    type: 'forgiveness',
    effects: {
      playerStats: { emotion: 30, karma: 20, clarityXP: 40 },
      teamBonus: 25
    },
    unlockConditions: {
      defeatedBosses: ['betrayal_boss']
    }
  },
  {
    id: 'reflection_unlock',
    name: 'Deep Reflection',
    description: 'Regular self-reflection prevents decision paralysis.',
    type: 'reflection',
    effects: {
      playerStats: { logic: 20, emotion: 15, clarityXP: 50 },
      businessBonus: 20
    },
    unlockConditions: {
      founderTrait: 'reflective'
    }
  },
  {
    id: 'humility_practice',
    name: 'Humility Practice',
    description: 'Stay grounded despite success and listen to others.',
    type: 'humility',
    effects: {
      playerStats: { karma: 25, reputation: 15, clarityXP: 35 },
      teamBonus: 30
    },
    unlockConditions: {
      defeatedBosses: ['ego_flame']
    }
  },
  {
    id: 'root_value_recall',
    name: 'Root Value Recall',
    description: 'Remember why you started and realign with core values.',
    type: 'values',
    effects: {
      playerStats: { karma: 40, emotion: 25, clarityXP: 60 },
      teamBonus: 35,
      businessBonus: 25
    },
    unlockConditions: {
      defeatedBosses: ['greed_overload']
    }
  },
  {
    id: 'self_care_practice',
    name: 'Self-Care Mastery',
    description: 'Prioritize health and well-being for sustainable performance.',
    type: 'reflection',
    effects: {
      playerStats: { stress: -30, energy: 25, emotion: 20 },
      teamBonus: 15
    },
    unlockConditions: {
    }
  },
  {
    id: 'trust_rebuilding',
    name: 'Trust Rebuilding',
    description: 'Systematic approach to rebuilding broken relationships.',
    type: 'forgiveness',
    effects: {
      playerStats: { emotion: 20, karma: 15, reputation: 10 },
      teamBonus: 40
    },
    unlockConditions: {
    }
  },
  {
    id: 'growth_mindset',
    name: 'Growth Mindset',
    description: 'View failures as learning opportunities, not defeats.',
    type: 'reflection',
    effects: {
      playerStats: { logic: 25, emotion: 20, clarityXP: 45 },
      businessBonus: 30
    },
    unlockConditions: {
    }
  }
];

// Helper functions
export const getUnlockedSectors = (sectorsCompleted: number, loopScore: number): IndustrySector[] => {
  return industrySectors.filter(sector => 
    sectorsCompleted >= sector.unlockRequirements.sectorsCompleted &&
    loopScore <= sector.unlockRequirements.maxLoopScore
  );
};

export const checkLoopBossTriggers = (playerStats: any, actions: string[]): LoopBoss | null => {
  for (const boss of loopBosses) {
    const { triggerConditions } = boss;
    let triggered = true;

    // Check stat conditions
    if (triggerConditions.stress && playerStats.stress < triggerConditions.stress) triggered = false;
    if (triggerConditions.emotion && playerStats.emotion > triggerConditions.emotion) triggered = false;
    if (triggerConditions.karma && playerStats.karma > triggerConditions.karma) triggered = false;
    if (triggerConditions.loopScore && playerStats.loopScore < triggerConditions.loopScore) triggered = false;

    // Check specific actions
    if (triggerConditions.specificActions) {
      const hasRequiredActions = triggerConditions.specificActions.some(action => actions.includes(action));
      if (!hasRequiredActions) triggered = false;
    }

    if (triggered) return boss;
  }
  return null;
};

export const getAvailableStrategyCards = (playerStats: any, defeatedBosses: string[]): StrategyCard[] => {
  return strategyCards.filter(card => {
    const { unlockConditions } = card;
    
    if (unlockConditions.founderTrait && playerStats.founderTrait !== unlockConditions.founderTrait) return false;
    if (unlockConditions.defeatedBosses) {
      const hasRequiredBosses = unlockConditions.defeatedBosses.every(boss => defeatedBosses.includes(boss));
      if (!hasRequiredBosses) return false;
    }
    
    return true;
  });
};