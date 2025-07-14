// Team+ Enhanced Role System with Emotional Business Simulation
export interface TeamRole {
  id: string;
  name: string;
  department: string;
  color: string;
  emoji: string;
  theme: string;
  description: string;
  emotionalTrait: string;
  loopVulnerability: string;
  skills: string[];
  synergies: string[];
  baseSalary: number;
  unlockRequirement?: {
    clarityXP?: number;
    sectorsCompleted?: number;
    defeatedBosses?: string[];
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleId: string;
  department: string;
  color: string;
  emoji: string;
  isActive: boolean;
  salary: number;
  experience: number;
  loyalty: number;
  performance: number;
  stress: number;
  hireDate: Date;
  emotionalTrait: string;
  clarityContribution: number;
  loopRisk: number;
  status: 'Active' | 'Overloaded' | 'In Loop' | 'Stable' | 'Warning' | 'Critical';
}

// Core team roles for Team+
export const teamRoles: TeamRole[] = [
  // Executive Roles
  {
    id: 'ceo',
    name: 'Chief Executive Officer',
    department: 'Executive',
    color: '#0059FF',
    emoji: '👑',
    theme: 'Vision vs Isolation',
    description: 'Leads everything with maximum Clarity XP impact. When CEO enters loop, entire game slows down.',
    emotionalTrait: 'Visionary but prone to isolation',
    loopVulnerability: 'Burnout from carrying too much responsibility',
    skills: ['Vision Setting', 'Strategic Planning', 'Team Inspiration', 'Investor Relations'],
    synergies: ['cmo_managing', 'cso', 'cfo'],
    baseSalary: 200000,
    unlockRequirement: { clarityXP: 100 }
  },
  {
    id: 'cmo_managing',
    name: 'Chief Managing Officer',
    department: 'Executive',
    color: '#FF5722',
    emoji: '🧩',
    theme: 'Execution vs Burnout',
    description: 'Handles operations, schedules, chaos control. Efficiency leads to faster unlocks.',
    emotionalTrait: 'Organized perfectionist',
    loopVulnerability: 'Over-control leading to team friction',
    skills: ['Operations Management', 'Process Optimization', 'Team Coordination', 'Crisis Management'],
    synergies: ['operator', 'administrator', 'cpo'],
    baseSalary: 150000,
    unlockRequirement: { clarityXP: 75 }
  },
  {
    id: 'cfo',
    name: 'Chief Financial Officer',
    department: 'Executive',
    color: '#388E3C',
    emoji: '💰',
    theme: 'Caution vs Greed',
    description: 'Handles budget, investments, cost optimization, and risk hedging.',
    emotionalTrait: 'Conservative financial strategist',
    loopVulnerability: 'Fear-greed seesaw affecting decisions',
    skills: ['Financial Planning', 'Investment Strategy', 'Risk Management', 'Investor Relations'],
    synergies: ['finance', 'ceo', 'administrator'],
    baseSalary: 155000,
    unlockRequirement: { clarityXP: 85 }
  },
  {
    id: 'cto',
    name: 'Chief Technology Officer',
    department: 'Executive',
    color: '#607D8B',
    emoji: '💻',
    theme: 'Precision vs Detachment',
    description: 'Builds AI, automation, product backend. High skill unlocks clarity tools.',
    emotionalTrait: 'Technical perfectionist',
    loopVulnerability: 'Emotional detachment from team needs',
    skills: ['Technical Architecture', 'AI/ML Strategy', 'Product Engineering', 'Team Leadership'],
    synergies: ['technology', 'administrator'],
    baseSalary: 165000,
    unlockRequirement: { clarityXP: 100 }
  },

  // Core Operational Roles
  {
    id: 'operator',
    name: 'Operator',
    department: 'Operations',
    color: '#69788C',
    emoji: '⚙️',
    theme: 'Reliability vs Invisible Burnout',
    description: 'Converts strategy into operations. Handles logistics, scheduling, daily task chains.',
    emotionalTrait: 'Calm under pressure',
    loopVulnerability: 'Invisible overload from taking on too much without reflection',
    skills: ['Process Management', 'Quality Control', 'Team Coordination', 'Problem Solving'],
    synergies: ['administrator', 'technology'],
    baseSalary: 75000
  },
  {
    id: 'administrator',
    name: 'Administrator',
    department: 'Operations',
    color: '#A67C52',
    emoji: '🗂️',
    theme: 'Order vs Over-Organization',
    description: 'Manages backend workflows, schedules, legal compliance, and documentation.',
    emotionalTrait: 'Silent organizer',
    loopVulnerability: 'Over-organization leading to paralysis by process',
    skills: ['Documentation', 'Compliance', 'Process Design', 'Legal Operations'],
    synergies: ['legal', 'finance', 'hr'],
    baseSalary: 65000
  },
  {
    id: 'finance',
    name: 'Finance',
    department: 'Operations',
    color: '#2E8B57',
    emoji: '💸',
    theme: 'Discipline vs Fear-Greed',
    description: 'Manages budgets, forecasts, investor reports, and tax strategy.',
    emotionalTrait: 'Number monk',
    loopVulnerability: 'Fear-greed seesaw preventing optimal decisions',
    skills: ['Financial Analysis', 'Budget Management', 'Tax Strategy', 'Investment Tracking'],
    synergies: ['cfo', 'administrator', 'sales'],
    baseSalary: 80000
  },
  {
    id: 'technology',
    name: 'Technology',
    department: 'Operations',
    color: '#008080',
    emoji: '💻',
    theme: 'Innovation vs Technical Debt',
    description: 'Builds product backend, manages technical infrastructure and automation.',
    emotionalTrait: 'Code architect',
    loopVulnerability: 'Technical perfectionism over user needs',
    skills: ['Software Development', 'System Architecture', 'DevOps', 'Technical Strategy'],
    synergies: ['cto', 'operator'],
    baseSalary: 95000
  },

  // Public Interface Roles
  {
    id: 'marketing',
    name: 'Marketing',
    department: 'Public',
    color: '#FF4081',
    emoji: '📣',
    theme: 'Emotion vs Narrative Control',
    description: 'Drives brand identity, user trust, influencer impact, and campaign reach.',
    emotionalTrait: 'Story sculptor',
    loopVulnerability: 'Fame addiction losing touch with product reality',
    skills: ['Brand Strategy', 'Content Creation', 'Social Media', 'Campaign Management'],
    synergies: ['sales', 'communicator'],
    baseSalary: 70000
  },
  {
    id: 'sales',
    name: 'Sales',
    department: 'Public',
    color: '#FBC02D',
    emoji: '🤝',
    theme: 'Confidence vs Rejection Trauma',
    description: 'Drives revenue by closing deals, building partnerships, handling frontline objections.',
    emotionalTrait: 'Closer with soul',
    loopVulnerability: 'Rejection spiral leading to call avoidance',
    skills: ['Deal Closing', 'Relationship Building', 'Negotiation', 'Customer Development'],
    synergies: ['marketing', 'finance', 'customer_service'],
    baseSalary: 85000
  },
  {
    id: 'customer_service',
    name: 'Customer Service',
    department: 'Public',
    color: '#03A9F4',
    emoji: '🧑‍💼',
    theme: 'Loyalty vs Emotional Absorption',
    description: 'Maintains customer relationships, handles support, and gathers user feedback.',
    emotionalTrait: 'Customer advocate',
    loopVulnerability: 'Absorbing customer emotions without boundaries',
    skills: ['Customer Support', 'Relationship Management', 'Problem Resolution', 'Feedback Analysis'],
    synergies: ['sales', 'hr', 'marketing'],
    baseSalary: 55000
  },

  // Culture & Support Roles
  {
    id: 'hr',
    name: 'Human Resources',
    department: 'Culture',
    color: '#A78BFA',
    emoji: '🫂',
    theme: 'Harmony vs Hidden Conflict',
    description: 'Manages hiring, morale, team alignment, and emotional loop balancing.',
    emotionalTrait: 'Team harmony keeper',
    loopVulnerability: 'Invisible role loop - feeling undervalued while managing others',
    skills: ['Team Building', 'Conflict Resolution', 'Hiring Strategy', 'Culture Development'],
    synergies: ['administrator', 'customer_service'],
    baseSalary: 70000
  },
  {
    id: 'creative',
    name: 'Creative',
    department: 'Innovation',
    color: '#BA68C8',
    emoji: '🎨',
    theme: 'Innovation vs Perfectionism',
    description: 'Handles product design, user experience, and creative problem solving.',
    emotionalTrait: 'Artistic visionary',
    loopVulnerability: 'Perfectionist paralysis preventing launches',
    skills: ['Design Strategy', 'UX/UI Design', 'Creative Direction', 'Brand Design'],
    synergies: ['marketing', 'technology'],
    baseSalary: 75000
  },
  {
    id: 'communicator',
    name: 'Communicator',
    department: 'Public',
    color: '#2CD3C6',
    emoji: '🗣️',
    theme: 'Clarity vs Message Distortion',
    description: 'Manages internal and external communications, PR, and team alignment.',
    emotionalTrait: 'Message clarity expert',
    loopVulnerability: 'Message distortion under pressure',
    skills: ['Internal Communications', 'Public Relations', 'Content Strategy', 'Crisis Communication'],
    synergies: ['marketing', 'hr'],
    baseSalary: 65000
  },
  {
    id: 'visionary',
    name: 'Visionary',
    department: 'Strategy',
    color: '#FFD700',
    emoji: '🔭',
    theme: 'Big Picture vs Reality Disconnect',
    description: 'Provides strategic vision, future planning, and innovative thinking.',
    emotionalTrait: 'Big picture thinker',
    loopVulnerability: 'Disconnect from operational reality',
    skills: ['Strategic Vision', 'Future Planning', 'Innovation Strategy', 'Market Trends'],
    synergies: ['ceo'],
    baseSalary: 90000
  },
  {
    id: 'empath',
    name: 'Empath',
    department: 'Culture',
    color: '#FF808B',
    emoji: '🤝',
    theme: 'Team Connection vs Emotional Overwhelm',
    description: 'Maintains team morale, emotional intelligence, and interpersonal harmony.',
    emotionalTrait: 'Team emotional anchor',
    loopVulnerability: 'Emotional overwhelm from absorbing team stress',
    skills: ['Emotional Intelligence', 'Team Counseling', 'Conflict Mediation', 'Culture Building'],
    synergies: ['hr', 'customer_service'],
    baseSalary: 60000
  }
];

// Helper functions
export const getRoleById = (id: string): TeamRole | undefined => {
  return teamRoles.find(role => role.id === id);
};

export const getRolesByDepartment = (department: string): TeamRole[] => {
  return teamRoles.filter(role => role.department === department);
};

export const getDepartments = (): string[] => {
  return [...new Set(teamRoles.map(role => role.department))];
};

export const getUnlockedRoles = (clarityXP: number, sectorsCompleted: number, defeatedBosses: string[]): TeamRole[] => {
  return teamRoles.filter(role => {
    if (!role.unlockRequirement) return true;
    
    const requirements = role.unlockRequirement;
    
    if (requirements.clarityXP && clarityXP < requirements.clarityXP) return false;
    if (requirements.sectorsCompleted && sectorsCompleted < requirements.sectorsCompleted) return false;
    if (requirements.defeatedBosses && !requirements.defeatedBosses.every(boss => defeatedBosses.includes(boss))) return false;
    
    return true;
  });
};

// Name generation
export const indianNames = {
  first: [
    'Aarav', 'Riya', 'Kabir', 'Saanvi', 'Vivaan', 'Tanya', 'Ishaan', 'Meera', 'Aryan', 'Kiara',
    'Aditya', 'Naina', 'Dev', 'Ananya', 'Rahul', 'Shruti', 'Kunal', 'Avni', 'Yash', 'Pooja',
    'Rohan', 'Priya', 'Harsh', 'Sneha', 'Karan', 'Divya', 'Varun', 'Neha', 'Siddharth', 'Kavya'
  ],
  last: [
    'Mehta', 'Shah', 'Roy', 'Singh', 'Kapoor', 'Reddy', 'Nair', 'Verma', 'Joshi', 'Gupta',
    'Sharma', 'Patel', 'Kumar', 'Agarwal', 'Bansal', 'Malhotra', 'Chopra', 'Sinha', 'Iyer', 'Rao'
  ]
};

export const emotionalTraits = [
  'Visionary dreamer',
  'Calm under pressure',
  'Insecure but genius',
  'Perfectionist streak',
  'Natural motivator',
  'Data-driven thinker',
  'Creative visionary',
  'People-first mentality',
  'Results-focused',
  'Quietly brilliant',
  'Empathic leader',
  'Strategic mastermind'
];

export const generateRandomTeamMember = (roleId: string): Omit<TeamMember, 'id'> => {
  const role = getRoleById(roleId);
  if (!role) throw new Error(`Role ${roleId} not found`);
  
  const firstName = indianNames.first[Math.floor(Math.random() * indianNames.first.length)];
  const lastName = indianNames.last[Math.floor(Math.random() * indianNames.last.length)];
  const trait = emotionalTraits[Math.floor(Math.random() * emotionalTraits.length)];
  
  const basePerformance = 60 + Math.random() * 35;
  const baseLoyalty = 50 + Math.random() * 40;
  const baseStress = Math.random() * 50;
  
  let status: TeamMember['status'] = 'Active';
  if (baseStress > 70) status = 'Critical';
  else if (baseStress > 50 || basePerformance < 70) status = 'Warning';
  else if (basePerformance > 85 && baseStress < 20) status = 'Stable';
  
  return {
    name: `${firstName} ${lastName}`,
    role: role.name,
    roleId: role.id,
    department: role.department,
    color: role.color,
    emoji: role.emoji,
    isActive: true,
    salary: role.baseSalary + Math.floor(Math.random() * 20000),
    experience: Math.floor(Math.random() * 100),
    loyalty: Math.round(baseLoyalty),
    performance: Math.round(basePerformance),
    stress: Math.round(baseStress),
    hireDate: new Date(),
    emotionalTrait: trait,
    clarityContribution: Math.round(basePerformance * 0.8),
    loopRisk: Math.round(baseStress + (100 - baseLoyalty) * 0.5),
    status
  };
};

// Additional helper functions for Team+ system
export const generateRandomName = (): string => {
  const firstName = indianNames.first[Math.floor(Math.random() * indianNames.first.length)];
  const lastName = indianNames.last[Math.floor(Math.random() * indianNames.last.length)];
  return `${firstName} ${lastName}`;
};

export const calculatePromotionCost = (currentSalary: number, newSalary: number): number => {
  const salaryIncrease = newSalary - currentSalary;
  return Math.round(salaryIncrease * 2.5); // 2.5x the annual increase as promotion cost
};

export const calculateBonusAmount = (salary: number, performance: number): number => {
  const baseBonus = salary * 0.1; // 10% of salary as base
  const performanceMultiplier = performance / 100; // Scale by performance
  return Math.round(baseBonus * performanceMultiplier);
};