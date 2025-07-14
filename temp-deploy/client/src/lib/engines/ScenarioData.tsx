export const scenarioTemplates = [
  // Business Scenarios
  {
    category: 'business',
    title: 'Venture Capital Proposal',
    description: 'A prominent VC firm is interested in funding your startup',
    context: 'TechVenture Capital wants to invest ₹5 crores for 25% equity in your company. They also want a board seat.',
    options: [
      {
        text: 'Accept the deal immediately',
        consequences: {
          stats: { logic: -5, emotion: 10, stress: -10 },
          financial: { bankBalance: 50000000, monthlyExpenses: 2000000 },
        },
      },
      {
        text: 'Negotiate for better terms',
        consequences: {
          stats: { logic: 10, emotion: -5, stress: 5 },
          financial: { bankBalance: 40000000 },
        },
      },
      {
        text: 'Decline and seek alternatives',
        consequences: {
          stats: { logic: 5, karma: 5, stress: 10 },
          financial: {},
        },
      },
    ],
    rarity: 'uncommon',
    requiredStats: { logic: 60 },
  },
  {
    category: 'business',
    title: 'Key Employee Resignation',
    description: 'Your CTO is threatening to quit over work-life balance',
    context: 'Your best engineer says they are burnt out and considering leaving for a competitor offering better work-life balance.',
    options: [
      {
        text: 'Offer a 40% salary increase',
        consequences: {
          stats: { emotion: 5, stress: 5 },
          financial: { monthlyExpenses: 50000 },
        },
      },
      {
        text: 'Implement flexible working hours',
        consequences: {
          stats: { karma: 10, emotion: 5 },
          financial: {},
        },
      },
      {
        text: 'Let them go and hire someone new',
        consequences: {
          stats: { logic: -10, karma: -15, stress: 15 },
          financial: { monthlyExpenses: -20000 },
        },
      },
    ],
    rarity: 'common',
  },
  {
    category: 'stocks',
    title: 'Market Crash Alert',
    description: 'The stock market is experiencing a major downturn',
    context: 'News reports indicate a 15% market crash today. Your portfolio is down ₹2 lakhs.',
    options: [
      {
        text: 'Sell everything to minimize losses',
        consequences: {
          stats: { emotion: -15, stress: 20 },
          financial: { totalAssets: -200000 },
        },
      },
      {
        text: 'Hold your positions and wait',
        consequences: {
          stats: { logic: 10, stress: 10 },
          financial: { totalAssets: -300000 },
        },
      },
      {
        text: 'Buy more stocks at lower prices',
        consequences: {
          stats: { logic: 15, emotion: -10 },
          financial: { totalAssets: 100000, bankBalance: -500000 },
        },
      },
    ],
    rarity: 'rare',
  },
  {
    category: 'stocks',
    title: 'Hot Stock Tip',
    description: 'A friend recommends a "guaranteed" stock pick',
    context: 'Your college friend claims to have insider information about a startup going public next week.',
    options: [
      {
        text: 'Invest heavily based on the tip',
        consequences: {
          stats: { emotion: 10, karma: -10, logic: -15 },
          financial: { totalAssets: 200000, bankBalance: -300000 },
        },
      },
      {
        text: 'Invest a small amount to test',
        consequences: {
          stats: { logic: 5, emotion: 5 },
          financial: { totalAssets: 50000, bankBalance: -50000 },
        },
      },
      {
        text: 'Ignore the tip and do your own research',
        consequences: {
          stats: { logic: 15, karma: 5 },
          financial: {},
        },
      },
    ],
    rarity: 'common',
  },
  {
    category: 'ethics',
    title: 'Tax Evasion Opportunity',
    description: 'Your accountant suggests a questionable tax strategy',
    context: 'Your CA claims you can save ₹5 lakhs in taxes using a "creative" interpretation of the law.',
    options: [
      {
        text: 'Go ahead with the plan',
        consequences: {
          stats: { karma: -20, stress: 15 },
          financial: { bankBalance: 500000 },
        },
      },
      {
        text: 'Seek a second opinion',
        consequences: {
          stats: { logic: 10, karma: 5 },
          financial: { bankBalance: 250000 },
        },
      },
      {
        text: 'Pay the full tax amount',
        consequences: {
          stats: { karma: 15, logic: 5 },
          financial: {},
        },
      },
    ],
    rarity: 'uncommon',
  },
  {
    category: 'real_estate',
    title: 'Property Investment Opportunity',
    description: 'A prime real estate opportunity has emerged',
    context: 'A property developer is offering pre-launch prices for a commercial complex in a growing area.',
    options: [
      {
        text: 'Invest ₹50 lakhs immediately',
        consequences: {
          stats: { emotion: 10, stress: 20 },
          financial: { totalAssets: 2000000, bankBalance: -5000000 },
        },
      },
      {
        text: 'Negotiate payment terms',
        consequences: {
          stats: { logic: 10, emotion: 5 },
          financial: { totalAssets: 1500000, bankBalance: -3000000 },
        },
      },
      {
        text: 'Skip this opportunity',
        consequences: {
          stats: { logic: 5, emotion: -5 },
          financial: {},
        },
      },
    ],
    rarity: 'uncommon',
  },
  {
    category: 'health',
    title: 'Stress Management',
    description: 'You are feeling overwhelmed with work pressure',
    context: 'Long working hours and constant decision-making are taking a toll on your mental health.',
    options: [
      {
        text: 'Take a week-long vacation',
        consequences: {
          stats: { stress: -25, emotion: 15, energy: 20 },
          financial: { bankBalance: -100000 },
        },
      },
      {
        text: 'Hire a personal assistant',
        consequences: {
          stats: { stress: -10, energy: 10 },
          financial: { monthlyExpenses: 35000 },
        },
      },
      {
        text: 'Push through and work harder',
        consequences: {
          stats: { stress: 15, emotion: -10, energy: -15 },
          financial: { mainIncome: 20000 },
        },
      },
    ],
    rarity: 'common',
  },
  {
    category: 'emotion',
    title: 'Family Emergency',
    description: 'A family member needs urgent financial help',
    context: 'Your cousin needs ₹3 lakhs for emergency medical treatment and has nowhere else to turn.',
    options: [
      {
        text: 'Give the money without hesitation',
        consequences: {
          stats: { karma: 20, emotion: 10, stress: 10 },
          financial: { bankBalance: -300000 },
        },
      },
      {
        text: 'Lend the money with interest',
        consequences: {
          stats: { logic: 5, karma: -5, emotion: -5 },
          financial: { bankBalance: -300000, sideIncome: 5000 },
        },
      },
      {
        text: 'Suggest they find other sources',
        consequences: {
          stats: { logic: -5, karma: -15, emotion: -20 },
          financial: {},
        },
      },
    ],
    rarity: 'uncommon',
  },
  {
    category: 'logic',
    title: 'Market Analysis Decision',
    description: 'Conflicting market reports are confusing your strategy',
    context: 'Two reputable analysts have opposite views on the market direction for the next quarter.',
    options: [
      {
        text: 'Follow the bullish analyst',
        consequences: {
          stats: { emotion: 10, logic: -5 },
          financial: { totalAssets: 150000 },
        },
      },
      {
        text: 'Follow the bearish analyst',
        consequences: {
          stats: { logic: 5, emotion: -10 },
          financial: { totalAssets: -50000 },
        },
      },
      {
        text: 'Do your own analysis',
        consequences: {
          stats: { logic: 15, energy: -10 },
          financial: { totalAssets: 100000 },
        },
      },
    ],
    rarity: 'common',
  },
  {
    category: 'risk',
    title: 'Cryptocurrency Investment',
    description: 'A new cryptocurrency promises massive returns',
    context: 'A blockchain startup is offering early investor tokens at a 90% discount from expected listing price.',
    options: [
      {
        text: 'Invest ₹10 lakhs for maximum returns',
        consequences: {
          stats: { emotion: 15, stress: 25, logic: -10 },
          financial: { totalAssets: 500000, bankBalance: -1000000 },
        },
      },
      {
        text: 'Invest ₹2 lakhs as a small bet',
        consequences: {
          stats: { emotion: 5, stress: 10 },
          financial: { totalAssets: 100000, bankBalance: -200000 },
        },
      },
      {
        text: 'Avoid the risky investment',
        consequences: {
          stats: { logic: 10, emotion: -5 },
          financial: {},
        },
      },
    ],
    rarity: 'uncommon',
  },
  // Additional scenarios for variety
  {
    category: 'business',
    title: 'Partnership Proposal',
    description: 'A competitor wants to merge operations',
    context: 'Your main competitor proposes a strategic partnership that could double your market reach.',
    options: [
      {
        text: 'Accept the partnership',
        consequences: {
          stats: { logic: 10, reputation: 15 },
          financial: { mainIncome: 40000, monthlyExpenses: 20000 },
        },
      },
      {
        text: 'Negotiate better terms',
        consequences: {
          stats: { logic: 15, stress: 5 },
          financial: { mainIncome: 30000 },
        },
      },
      {
        text: 'Decline and compete independently',
        consequences: {
          stats: { emotion: 5, stress: 10 },
          financial: { mainIncome: 10000 },
        },
      },
    ],
    rarity: 'uncommon',
  },
  {
    category: 'stocks',
    title: 'Dividend Declaration',
    description: 'Your major holding announces a special dividend',
    context: 'The company you hold 1000 shares of announces a ₹50 per share special dividend.',
    options: [
      {
        text: 'Reinvest the dividend',
        consequences: {
          stats: { logic: 10, emotion: 5 },
          financial: { totalAssets: 75000 },
        },
      },
      {
        text: 'Take cash and diversify',
        consequences: {
          stats: { logic: 5, emotion: 5 },
          financial: { bankBalance: 50000 },
        },
      },
      {
        text: 'Use dividend for personal expenses',
        consequences: {
          stats: { emotion: 10, logic: -5 },
          financial: { bankBalance: 50000, monthlyExpenses: -10000 },
        },
      },
    ],
    rarity: 'common',
  },
  {
    category: 'ethics',
    title: 'Bribery Demand',
    description: 'An official demands a bribe for license approval',
    context: 'A government official hints that ₹2 lakhs could expedite your business license approval.',
    options: [
      {
        text: 'Pay the bribe for quick approval',
        consequences: {
          stats: { karma: -25, stress: 20 },
          financial: { bankBalance: -200000, mainIncome: 50000 },
        },
      },
      {
        text: 'Report the official',
        consequences: {
          stats: { karma: 20, stress: 15 },
          financial: { mainIncome: -20000 },
        },
      },
      {
        text: 'Wait for legal processing',
        consequences: {
          stats: { karma: 10, logic: 5, stress: 10 },
          financial: { mainIncome: 10000 },
        },
      },
    ],
    rarity: 'rare',
  },
  {
    category: 'health',
    title: 'Work-Life Balance',
    description: 'Your family complains about your work schedule',
    context: 'Your spouse and children feel neglected due to your 80-hour work weeks.',
    options: [
      {
        text: 'Reduce work hours significantly',
        consequences: {
          stats: { emotion: 20, stress: -15, energy: 10 },
          financial: { mainIncome: -30000 },
        },
      },
      {
        text: 'Hire more staff to delegate',
        consequences: {
          stats: { emotion: 10, stress: -10 },
          financial: { monthlyExpenses: 80000 },
        },
      },
      {
        text: 'Explain the necessity and continue',
        consequences: {
          stats: { emotion: -15, stress: 10 },
          financial: { mainIncome: 20000 },
        },
      },
    ],
    rarity: 'common',
  },
  {
    category: 'emotion',
    title: 'Success Celebration',
    description: 'Your startup reaches a major milestone',
    context: 'Your company has achieved its first ₹1 crore revenue month. The team wants to celebrate.',
    options: [
      {
        text: 'Throw a lavish celebration party',
        consequences: {
          stats: { emotion: 20, reputation: 15 },
          financial: { bankBalance: -500000 },
        },
      },
      {
        text: 'Give team bonuses instead',
        consequences: {
          stats: { karma: 15, emotion: 10 },
          financial: { bankBalance: -300000 },
        },
      },
      {
        text: 'Reinvest the profit for growth',
        consequences: {
          stats: { logic: 15, emotion: -5 },
          financial: { totalAssets: 200000 },
        },
      },
    ],
    rarity: 'uncommon',
  },
];
