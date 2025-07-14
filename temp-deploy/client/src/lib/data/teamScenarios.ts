import { GameScenario } from './scenarios';

export interface TeamScenario extends GameScenario {
  requiredRole?: string;
  triggerEmployee?: string;
  teamImpact?: {
    roleId: string;
    effects: {
      performance?: number;
      loyalty?: number;
      stress?: number;
    };
  }[];
}

export const teamBasedScenarios: TeamScenario[] = [
  // Executive Department Scenarios
  {
    id: 1001,
    section: 'Business',
    title: 'Strategic Vision Alignment',
    description: 'Your Chief Executive Officer presents a bold new strategic direction that could revolutionize the company, but requires significant investment.',
    urgency: 'high',
    requiredRole: 'Executive',
    options: [
      {
        id: 'vision_approve',
        text: 'Approve the strategic vision and allocate resources',
        effects: {
          bankBalance: -100000,
          emotion: 10,
          logic: 15,
          reputation: 20
        },
        description: 'Bold leadership decision with long-term benefits'
      },
      {
        id: 'vision_modify',
        text: 'Request modifications to make it more conservative',
        effects: {
          bankBalance: -50000,
          emotion: 5,
          logic: 10,
          stress: 5
        },
        description: 'Balanced approach with moderate impact'
      },
      {
        id: 'vision_reject',
        text: 'Reject the proposal and maintain current strategy',
        effects: {
          emotion: -10,
          logic: 5,
          stress: 10
        },
        description: 'Safe but potentially demotivating choice'
      }
    ],
    tags: ['strategy', 'executive', 'leadership'],
    teamImpact: [
      {
        roleId: 'ceo',
        effects: { loyalty: 15, performance: 10 }
      }
    ]
  },

  // Operations Department Scenarios
  {
    id: 1002,
    section: 'Business',
    title: 'Operations Efficiency Crisis',
    description: 'Your Operations Manager reports critical inefficiencies in the workflow that are costing the company significant money daily.',
    urgency: 'high',
    requiredRole: 'Operations',
    options: [
      {
        id: 'ops_overhaul',
        text: 'Implement complete operational overhaul',
        effects: {
          bankBalance: -75000,
          mainIncome: 25000,
          logic: 20,
          stress: 15
        },
        description: 'Expensive but transformative solution'
      },
      {
        id: 'ops_gradual',
        text: 'Implement gradual improvements over time',
        effects: {
          bankBalance: -30000,
          mainIncome: 10000,
          logic: 10,
          stress: 5
        },
        description: 'Moderate investment with steady returns'
      },
      {
        id: 'ops_delay',
        text: 'Delay improvements to preserve cash flow',
        effects: {
          mainIncome: -15000,
          stress: 20,
          logic: -5
        },
        description: 'Short-term savings with long-term costs'
      }
    ],
    tags: ['operations', 'efficiency', 'management'],
    teamImpact: [
      {
        roleId: 'operations_manager',
        effects: { performance: 15, stress: -10 }
      }
    ]
  },

  // Innovation Department Scenarios
  {
    id: 1003,
    section: 'Innovation',
    title: 'Breakthrough Technology Discovery',
    description: 'Your Innovation team has discovered a potentially game-changing technology that could disrupt the entire industry.',
    urgency: 'medium',
    requiredRole: 'Innovation',
    options: [
      {
        id: 'tech_patent',
        text: 'Invest heavily in patents and development',
        effects: {
          bankBalance: -150000,
          sideIncome: 50000,
          logic: 25,
          reputation: 30
        },
        description: 'High risk, high reward innovation play'
      },
      {
        id: 'tech_partner',
        text: 'Partner with established companies',
        effects: {
          bankBalance: -50000,
          sideIncome: 20000,
          logic: 15,
          reputation: 10
        },
        description: 'Shared risk and shared rewards'
      },
      {
        id: 'tech_shelf',
        text: 'Shelve the technology for now',
        effects: {
          emotion: -15,
          logic: -10,
          stress: 10
        },
        description: 'Conservative approach missing opportunity'
      }
    ],
    tags: ['innovation', 'technology', 'disruption'],
    teamImpact: [
      {
        roleId: 'innovation_lead',
        effects: { performance: 20, loyalty: 15 }
      }
    ]
  },

  // Public Relations Scenarios
  {
    id: 1004,
    section: 'Personal',
    title: 'Public Relations Crisis',
    description: 'Your PR team faces a potential scandal that could damage the company reputation significantly.',
    urgency: 'high',
    requiredRole: 'Public',
    options: [
      {
        id: 'pr_transparent',
        text: 'Be completely transparent and apologetic',
        effects: {
          emotion: 10,
          reputation: -10,
          karma: 15,
          stress: 20
        },
        description: 'Honest approach with short-term pain'
      },
      {
        id: 'pr_deflect',
        text: 'Deflect and minimize the issue',
        effects: {
          reputation: -5,
          karma: -10,
          stress: 15,
          logic: 5
        },
        description: 'Damage control with ethical concerns'
      },
      {
        id: 'pr_aggressive',
        text: 'Launch aggressive counter-campaign',
        effects: {
          bankBalance: -80000,
          reputation: 5,
          karma: -5,
          stress: 25
        },
        description: 'Expensive but potentially effective'
      }
    ],
    tags: ['public_relations', 'crisis', 'reputation'],
    teamImpact: [
      {
        roleId: 'pr_manager',
        effects: { stress: 25, performance: 10 }
      }
    ]
  },

  // Defense/Security Scenarios
  {
    id: 1005,
    section: 'Business',
    title: 'Cybersecurity Breach Threat',
    description: 'Your Security team has detected suspicious activity that could lead to a major data breach.',
    urgency: 'high',
    requiredRole: 'Defense',
    options: [
      {
        id: 'security_upgrade',
        text: 'Immediately upgrade all security systems',
        effects: {
          bankBalance: -120000,
          reputation: 10,
          logic: 20,
          stress: 10
        },
        description: 'Comprehensive security overhaul'
      },
      {
        id: 'security_monitor',
        text: 'Increase monitoring and hire consultants',
        effects: {
          bankBalance: -40000,
          logic: 10,
          stress: 15
        },
        description: 'Moderate response with ongoing costs'
      },
      {
        id: 'security_minimal',
        text: 'Implement minimal security patches',
        effects: {
          bankBalance: -10000,
          stress: 25,
          logic: -5
        },
        description: 'Risky cost-cutting measure'
      }
    ],
    tags: ['security', 'cyber', 'defense'],
    teamImpact: [
      {
        roleId: 'security_lead',
        effects: { stress: 20, performance: 15 }
      }
    ]
  },

  // Culture Department Scenarios
  {
    id: 1006,
    section: 'HR/Team',
    title: 'Company Culture Transformation',
    description: 'Your Culture team proposes a comprehensive wellness and culture program to improve employee satisfaction.',
    urgency: 'medium',
    requiredRole: 'Culture',
    options: [
      {
        id: 'culture_full',
        text: 'Implement comprehensive culture program',
        effects: {
          bankBalance: -60000,
          emotion: 25,
          stress: -15,
          reputation: 15
        },
        description: 'Investment in employee wellbeing'
      },
      {
        id: 'culture_basic',
        text: 'Start with basic wellness initiatives',
        effects: {
          bankBalance: -20000,
          emotion: 10,
          stress: -5,
          reputation: 5
        },
        description: 'Modest beginning with positive impact'
      },
      {
        id: 'culture_postpone',
        text: 'Postpone culture initiatives',
        effects: {
          emotion: -10,
          stress: 15,
          reputation: -5
        },
        description: 'Focus on business priorities first'
      }
    ],
    tags: ['culture', 'wellness', 'team'],
    teamImpact: [
      {
        roleId: 'culture_lead',
        effects: { loyalty: 20, performance: 10 }
      }
    ]
  },

  // Strategy Department Scenarios
  {
    id: 1007,
    section: 'Business',
    title: 'Market Expansion Opportunity',
    description: 'Your Strategy team identifies a lucrative new market that could triple your revenue within two years.',
    urgency: 'medium',
    requiredRole: 'Strategy',
    options: [
      {
        id: 'expansion_aggressive',
        text: 'Pursue aggressive market expansion',
        effects: {
          bankBalance: -200000,
          sideIncome: 75000,
          logic: 20,
          reputation: 25,
          stress: 20
        },
        description: 'Bold expansion with significant investment'
      },
      {
        id: 'expansion_cautious',
        text: 'Test the market with limited investment',
        effects: {
          bankBalance: -75000,
          sideIncome: 25000,
          logic: 15,
          reputation: 10,
          stress: 10
        },
        description: 'Cautious approach with manageable risk'
      },
      {
        id: 'expansion_research',
        text: 'Continue research without commitment',
        effects: {
          bankBalance: -15000,
          logic: 10,
          stress: 5
        },
        description: 'Information gathering without action'
      }
    ],
    tags: ['strategy', 'expansion', 'market'],
    teamImpact: [
      {
        roleId: 'strategy_lead',
        effects: { performance: 15, loyalty: 10 }
      }
    ]
  }
];

export const getTeamScenarios = (teamMembers: any[]): TeamScenario[] => {
  const availableRoles = teamMembers.map(member => member.roleId);
  return teamBasedScenarios.filter(scenario => 
    !scenario.requiredRole || availableRoles.includes(scenario.requiredRole)
  );
};

export const getScenarioByTeamMember = (roleId: string): TeamScenario[] => {
  return teamBasedScenarios.filter(scenario => scenario.requiredRole === roleId);
};