import { create } from "zustand";
import { TeamMember } from "../types/GameTypes";

export interface JobApplicant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  expectedSalary: number;
  experience: number;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  interviewQuestions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  autoHireThreshold: number; // HR can auto-hire if applicant score >= this
}

interface TeamManagementState {
  teamMembers: TeamMember[];
  teamSynergy: number;
  burnoutRisk: number;
  jobApplicants: JobApplicant[];
  
  // Actions
  addTeamMember: (member: TeamMember) => void;
  removeTeamMember: (memberId: string) => void;
  updateTeamMember: (memberId: string, updates: Partial<TeamMember>) => void;
  calculateTeamSynergy: () => void;
  calculateBurnoutRisk: () => void;
  initializeTeam: () => void;
  
  // Hiring system
  generateJobApplicant: () => void;
  hireCandidateDirectly: (applicantId: string) => boolean;
  promoteTeamMember: (memberId: string) => void;
  giveBonusToMember: (memberId: string, amount: number) => void;
  
  // Experience progression
  increaseTeamExperience: (currentWeek: number) => void;
  updateRoleBasedOnExperience: (memberId: string) => void;
  getRoleFromExperience: (experience: number, baseRole: string) => string;
  getSeniorityFromExperience: (experience: number) => 'Fresher' | 'Junior' | 'Senior' | 'Chief' | 'CEO';
}

const initialTeamMembers: TeamMember[] = [];

// Job roles data
const jobRoles = [
  { role: "Junior Accountant", baseSalary: 35000, productivity: 15 },
  { role: "Sales Intern", baseSalary: 25000, productivity: 20 },
  { role: "Assistant HR", baseSalary: 40000, productivity: 10 },
  { role: "Senior HR", baseSalary: 80000, productivity: 25 },
  { role: "Marketing Analyst", baseSalary: 60000, productivity: 35 },
  { role: "Product Head", baseSalary: 140000, productivity: 80 },
  { role: "Lead Developer", baseSalary: 120000, productivity: 90 },
  { role: "Senior Developer", baseSalary: 100000, productivity: 70 },
];

// Sample names for applicants
const candidateNames = [
  "Rahul Gupta", "Anita Desai", "Vikram Singh", "Meera Kapoor", "Arun Nair",
  "Deepika Sharma", "Rohan Joshi", "Kavya Reddy", "Nitin Agarwal", "Pooja Malhotra",
  "Sanjay Yadav", "Ritu Choudhary", "Karan Malhotra", "Nisha Bansal", "Ajay Verma"
];

// Helper functions for generating candidate data
const generateSkillsForRole = (role: string): string[] => {
  const skillsMap: Record<string, string[]> = {
    "Junior Accountant": ["Excel", "Accounting", "Bookkeeping", "GST"],
    "Sales Intern": ["Communication", "CRM", "Lead Generation", "Customer Service"],
    "Assistant HR": ["Recruitment", "Employee Relations", "HR Policies", "Payroll"],
    "Senior HR": ["Talent Management", "Leadership", "Strategic Planning", "Culture Building"],
    "Marketing Analyst": ["Analytics", "Digital Marketing", "SEO", "Campaign Management"],
    "Product Head": ["Product Strategy", "Market Research", "User Experience", "Leadership"],
    "Lead Developer": ["React", "Node.js", "System Architecture", "Team Leadership"],
    "Senior Developer": ["JavaScript", "Python", "Database Design", "API Development"],
  };
  return skillsMap[role] || ["General Skills", "Problem Solving", "Communication"];
};

const generateStrengthsForRole = (role: string): string[] => {
  const strengthsMap: Record<string, string[]> = {
    "Junior Accountant": ["Attention to detail", "Analytical thinking", "Process oriented"],
    "Sales Intern": ["Enthusiasm", "Quick learner", "People skills"],
    "Assistant HR": ["Organizational skills", "Empathy", "Multi-tasking"],
    "Senior HR": ["Strategic thinking", "Leadership", "Conflict resolution"],
    "Marketing Analyst": ["Data-driven", "Creative thinking", "Result-oriented"],
    "Product Head": ["Vision", "Decision making", "User focus"],
    "Lead Developer": ["Technical expertise", "Mentoring", "Problem solving"],
    "Senior Developer": ["Code quality", "Innovation", "Collaboration"],
  };
  return strengthsMap[role] || ["Dedicated", "Reliable", "Team player"];
};

const generateWeaknessesForRole = (role: string): string[] => {
  const weaknessesMap: Record<string, string[]> = {
    "Junior Accountant": ["New to industry", "Needs guidance", "Limited experience"],
    "Sales Intern": ["Inexperienced", "Needs training", "Impatient"],
    "Assistant HR": ["Limited experience", "Needs supervision", "Overwhelmed by workload"],
    "Senior HR": ["Resistant to change", "Perfectionist", "Delegation issues"],
    "Marketing Analyst": ["Overthinking", "Perfectionist", "Impatient with results"],
    "Product Head": ["Micromanagement", "Perfectionist", "Impatient"],
    "Lead Developer": ["Perfectionist", "Workaholic", "Impatient with junior devs"],
    "Senior Developer": ["Perfectionist", "Prefers working alone", "Resistant to feedback"],
  };
  return weaknessesMap[role] || ["Perfectionist", "Workaholic", "Impatient"];
};

const generateInterviewQuestions = (role: string) => {
  const questionsMap: Record<string, Array<{question: string, options: string[], correctAnswer: number}>> = {
    "Junior Accountant": [
      {
        question: "What is the primary purpose of a trial balance?",
        options: ["To calculate profit", "To ensure debits equal credits", "To prepare tax returns", "To track expenses"],
        correctAnswer: 1
      },
      {
        question: "Which software is commonly used for accounting?",
        options: ["Photoshop", "Tally", "AutoCAD", "Figma"],
        correctAnswer: 1
      },
      {
        question: "What does GST stand for?",
        options: ["General Sales Tax", "Goods and Services Tax", "Government Standard Tax", "Global Service Tax"],
        correctAnswer: 1
      }
    ],
    "Sales Intern": [
      {
        question: "What is the first step in the sales process?",
        options: ["Closing the deal", "Prospecting", "Follow-up", "Presentation"],
        correctAnswer: 1
      },
      {
        question: "What does CRM stand for?",
        options: ["Customer Relationship Management", "Customer Revenue Management", "Client Record Management", "Customer Retention Model"],
        correctAnswer: 0
      },
      {
        question: "How do you handle rejection in sales?",
        options: ["Give up immediately", "Learn from it and move on", "Argue with the customer", "Wait for them to call back"],
        correctAnswer: 1
      }
    ],
    "Marketing Analyst": [
      {
        question: "What is CTR in digital marketing?",
        options: ["Cost to Revenue", "Click Through Rate", "Customer Tracking Rate", "Conversion Target Rate"],
        correctAnswer: 1
      },
      {
        question: "Which metric measures customer acquisition cost?",
        options: ["ROI", "CAC", "LTV", "ARPU"],
        correctAnswer: 1
      },
      {
        question: "What is A/B testing used for?",
        options: ["Bug testing", "Comparing two versions", "Security testing", "Performance testing"],
        correctAnswer: 1
      }
    ],
    "Lead Developer": [
      {
        question: "What is the main benefit of using React hooks?",
        options: ["Better performance", "Functional components state management", "Easier debugging", "Smaller bundle size"],
        correctAnswer: 1
      },
      {
        question: "What does API stand for?",
        options: ["Application Programming Interface", "Automated Program Integration", "Advanced Programming Interface", "Application Process Integration"],
        correctAnswer: 0
      },
      {
        question: "What is the purpose of version control?",
        options: ["Bug tracking", "Code collaboration and history", "Performance monitoring", "Security testing"],
        correctAnswer: 1
      }
    ]
  };
  
  return questionsMap[role] || [
    {
      question: "What motivates you to work?",
      options: ["Money only", "Learning and growth", "Just a job", "Free time"],
      correctAnswer: 1
    },
    {
      question: "How do you handle pressure?",
      options: ["Panic", "Stay calm and prioritize", "Avoid it", "Blame others"],
      correctAnswer: 1
    },
    {
      question: "What is your strength?",
      options: ["I don't have any", "Problem solving", "I'm perfect", "I work slowly"],
      correctAnswer: 1
    }
  ];
};

export const useTeamManagement = create<TeamManagementState>((set, get) => ({
  teamMembers: initialTeamMembers,
  teamSynergy: 0,
  burnoutRisk: 0,
  jobApplicants: [],

  addTeamMember: (member: TeamMember) => {
    const state = get();
    set({
      teamMembers: [...state.teamMembers, member],
    });
    get().calculateTeamSynergy();
    get().calculateBurnoutRisk();
  },

  removeTeamMember: (memberId: string) => {
    const state = get();
    set({
      teamMembers: state.teamMembers.filter(member => member.id !== memberId),
    });
    get().calculateTeamSynergy();
    get().calculateBurnoutRisk();
  },

  updateTeamMember: (memberId: string, updates: Partial<TeamMember>) => {
    const state = get();
    set({
      teamMembers: state.teamMembers.map(member => 
        member.id === memberId 
          ? { ...member, ...updates }
          : member
      ),
    });
    get().calculateTeamSynergy();
    get().calculateBurnoutRisk();
  },

  calculateTeamSynergy: () => {
    const state = get();
    if (state.teamMembers.length === 0) {
      set({ teamSynergy: 0 });
      return;
    }

    const averageLoyalty = state.teamMembers.reduce((sum, member) => sum + member.stats.loyalty, 0) / state.teamMembers.length;
    const averageImpact = state.teamMembers.reduce((sum, member) => sum + member.stats.impact, 0) / state.teamMembers.length;
    const averageEnergy = state.teamMembers.reduce((sum, member) => sum + member.stats.energy, 0) / state.teamMembers.length;
    
    // Calculate synergy bonus based on team composition
    const roleCount = state.teamMembers.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const diversityBonus = Object.keys(roleCount).length * 5; // 5 points per unique role
    const synergy = Math.min(100, (averageLoyalty + averageImpact + averageEnergy) / 3 + diversityBonus);
    
    set({ teamSynergy: Math.round(synergy) });
  },

  calculateBurnoutRisk: () => {
    const state = get();
    if (state.teamMembers.length === 0) {
      set({ burnoutRisk: 0 });
      return;
    }

    const overworkedMembers = state.teamMembers.filter(member => member.stats.energy < 50).length;
    const burntOutMembers = state.teamMembers.filter(member => member.stats.mood === 'burnt_out').length;
    const lowLoyaltyMembers = state.teamMembers.filter(member => member.stats.loyalty < 60).length;
    
    const riskFactors = (overworkedMembers * 2) + (burntOutMembers * 3) + lowLoyaltyMembers;
    const burnoutRisk = Math.min(100, (riskFactors / state.teamMembers.length) * 20);
    
    set({ burnoutRisk: Math.round(burnoutRisk) });
  },

  initializeTeam: () => {
    set({
      teamMembers: initialTeamMembers,
    });
    get().calculateTeamSynergy();
    get().calculateBurnoutRisk();
  },

  generateJobApplicant: () => {
    const roleData = jobRoles[Math.floor(Math.random() * jobRoles.length)];
    const name = candidateNames[Math.floor(Math.random() * candidateNames.length)];
    const avatars = ["👨‍💼", "👩‍💼", "👨‍💻", "👩‍💻", "👨‍🎓", "👩‍🎓"];
    
    const applicant: JobApplicant = {
      id: `applicant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      role: roleData.role,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      expectedSalary: roleData.baseSalary + Math.floor(Math.random() * 20000 - 10000),
      experience: Math.floor(Math.random() * 8) + 1,
      skills: generateSkillsForRole(roleData.role),
      strengths: generateStrengthsForRole(roleData.role),
      weaknesses: generateWeaknessesForRole(roleData.role),
      interviewQuestions: generateInterviewQuestions(roleData.role),
      autoHireThreshold: 70 + Math.floor(Math.random() * 20),
    };
    
    set(state => ({
      jobApplicants: [...state.jobApplicants, applicant],
    }));
  },

  hireCandidateDirectly: (applicantId: string) => {
    const state = get();
    const applicant = state.jobApplicants.find(app => app.id === applicantId);
    
    if (applicant) {
      const newMember: TeamMember = {
        id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: applicant.name,
        role: get().getRoleFromExperience(applicant.experience, applicant.role),
        avatar: applicant.avatar,
        salary: applicant.expectedSalary,
        joinDate: new Date(),
        experience: applicant.experience, // Use experience from applicant
        skills: applicant.skills,
        achievements: [],
        stats: {
          loyalty: 60 + Math.floor(Math.random() * 20),
          impact: 40 + Math.floor(Math.random() * 30),
          energy: 70 + Math.floor(Math.random() * 20),
          mood: 'neutral' as const,
        },
        personality: {
          type: "ENFP-T",
          motivationTriggers: ["Growth opportunities", "Recognition", "Team collaboration"],
          weakSpots: ["Micromanagement", "Unrealistic expectations"],
        },
        emotionalTrait: "Balanced",
        loopVulnerability: "none",
        clarityContribution: 40 + Math.floor(Math.random() * 30),
        hiddenDynamics: {
          trustWithFounder: 80,
          creativeFulfillment: 70,
          burnoutRisk: 20,
          isHidingStruggles: false
        },
        department: 'Operations' as const,
        seniority: get().getSeniorityFromExperience(applicant.experience),
        status: 'Neutral' as const,
        promotionHistory: [],
        isCEO: false,
      };
      
      set(state => ({
        teamMembers: [...state.teamMembers, newMember],
        jobApplicants: state.jobApplicants.filter(app => app.id !== applicantId),
      }));
      
      get().calculateTeamSynergy();
      get().calculateBurnoutRisk();
      return true;
    }
    return false;
  },


  promoteTeamMember: (memberId: string) => {
    const state = get();
    const member = state.teamMembers.find(m => m.id === memberId);
    
    if (member) {
      const promotedMember = {
        ...member,
        salary: member.salary * 1.25,
        stats: {
          ...member.stats,
          loyalty: Math.min(100, member.stats.loyalty + 20),
          impact: Math.min(100, member.stats.impact + 10),
          energy: Math.min(100, member.stats.energy + 15),
          mood: 'motivated' as const,
        },
      };
      
      set(state => ({
        teamMembers: state.teamMembers.map(m => 
          m.id === memberId ? promotedMember : m
        ),
      }));
      
      get().calculateTeamSynergy();
      return true;
    }
    return false;
  },

  giveBonusToMember: (memberId: string, amount: number) => {
    const state = get();
    const member = state.teamMembers.find(m => m.id === memberId);
    
    if (member) {
      const updatedMember = {
        ...member,
        stats: {
          ...member.stats,
          loyalty: Math.min(100, member.stats.loyalty + 15),
          energy: Math.min(100, member.stats.energy + 10),
          mood: 'motivated' as const,
        },
      };
      
      set(state => ({
        teamMembers: state.teamMembers.map(m => 
          m.id === memberId ? updatedMember : m
        ),
      }));
      
      get().calculateTeamSynergy();
      return true;
    }
    return false;
  },

  increaseTeamExperience: (currentWeek: number) => {
    // Increase experience by 1 year every 48 weeks
    if (currentWeek % 48 === 0) {
      set(state => ({
        teamMembers: state.teamMembers.map(member => {
          const newExperience = member.experience + 1;
          const baseRole = member.role.replace(/^(Fresher|Junior|Senior|Chief)\s+/, '');
          const newRole = get().getRoleFromExperience(newExperience, baseRole);
          
          return {
            ...member,
            experience: newExperience,
            role: newRole,
            seniority: get().getSeniorityFromExperience(newExperience)
          };
        })
      }));
    }
  },

  getRoleFromExperience: (experience: number, baseRole: string) => {
    if (experience === 0) return `Fresher ${baseRole}`;
    if (experience >= 1 && experience <= 5) return `Junior ${baseRole}`;
    if (experience >= 6 && experience <= 10) return `Senior ${baseRole}`;
    if (experience >= 11) return `Chief ${baseRole}`;
    return baseRole;
  },

  getSeniorityFromExperience: (experience: number) => {
    if (experience === 0) return 'Fresher' as const;
    if (experience >= 1 && experience <= 5) return 'Junior' as const;
    if (experience >= 6 && experience <= 10) return 'Senior' as const;
    if (experience >= 11) return 'Chief' as const;
    return 'Junior' as const;
  },

  updateRoleBasedOnExperience: (memberId: string) => {
    set(state => {
      const member = state.teamMembers.find(m => m.id === memberId);
      if (!member) return state;

      const baseRole = member.role.replace(/^(Fresher|Junior|Senior|Chief)\s+/, '');
      const newRole = get().getRoleFromExperience(member.experience, baseRole);
      const newSeniority = get().getSeniorityFromExperience(member.experience);

      return {
        teamMembers: state.teamMembers.map(m => 
          m.id === memberId 
            ? { ...m, role: newRole, seniority: newSeniority }
            : m
        )
      };
    });
  },
}));
