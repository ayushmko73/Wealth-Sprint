import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserCog,
  TrendingUp, 
  Award, 
  UserPlus, 
  Star, 
  DollarSign, 
  AlertCircle, 
  Heart,
  Brain,
  Zap,
  Target,
  Shield,
  Coffee,
  AlertTriangle,
  CheckCircle,
  Eye,
  Crown,
  Briefcase,
  Building,
  Lightbulb,
  Palette,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  Filter,
  MoreVertical,
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  TreePine,
  User,
  ArrowLeft,
  Sparkles,
  Rocket,
  Lock,
  Unlock,
  ChevronRight
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { useTeamManagement, JobApplicant } from '@/lib/stores/useTeamManagement';
import { TeamMember } from '@/lib/types/GameTypes';
import { toast } from 'sonner';
import { formatIndianCurrency } from '@/lib/utils';

// Core role definitions
const CORE_ROLES = [
  {
    id: 'financial_advisor',
    name: 'Financial Advisor',
    department: 'Financial',
    emoji: '💰',
    color: '#d4af37',
    description: 'Manages investment strategies and financial planning',
    baseSalary: 120000
  },
  {
    id: 'risk_analyst',
    name: 'Risk Analyst', 
    department: 'Risk',
    emoji: '🛡️',
    color: '#e74c3c',
    description: 'Analyzes and mitigates business risks',
    baseSalary: 110000
  },
  {
    id: 'marketing_director',
    name: 'Marketing Director',
    department: 'Marketing', 
    emoji: '📈',
    color: '#3498db',
    description: 'Drives brand growth and customer acquisition',
    baseSalary: 130000
  },
  {
    id: 'sales_manager',
    name: 'Sales Manager',
    department: 'Sales',
    emoji: '🎯',
    color: '#2ecc71',
    description: 'Leads sales team and revenue generation',
    baseSalary: 115000
  },
  {
    id: 'operations_manager',
    name: 'Operations Manager',
    department: 'Operations',
    emoji: '⚙️',
    color: '#9b59b6',
    description: 'Optimizes business operations and processes',
    baseSalary: 125000
  },
  {
    id: 'ceo',
    name: 'Chief Executive Officer',
    department: 'Executive',
    emoji: '👑',
    color: '#f39c12',
    description: 'Strategic leadership and overall business direction',
    baseSalary: 200000
  }
];

// Department structure for hiring interface
interface Candidate {
  id: string;
  name: string;
  age: number;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  salary: number;
  experienceYears: number;
  education: string;
  position: string;
  previousCompanies: string[];
  skills: string[];
}

interface Department {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  candidates: Candidate[];
}

const DEPARTMENTS: Department[] = [
  {
    id: 'finance',
    name: 'Finance & Strategy',
    icon: <DollarSign size={24} />,
    color: '#d4af37',
    candidates: [
      {
        id: 'aarav_mehta',
        name: 'Aarav Mehta',
        age: 34,
        impact: 'High',
        description: 'Improves investment returns.',
        salary: 10000,
        experienceYears: 6,
        education: 'MBA in Finance from IIM',
        position: 'Financial Advisor',
        previousCompanies: ['HDFC Bank', 'ICICI Securities'],
        skills: ['Portfolio Management', 'Risk Assessment', 'Financial Planning', 'Investment Strategy']
      },
      {
        id: 'arjun_malhotra',
        name: 'Arjun Malhotra',
        age: 28,
        impact: 'Medium',
        description: 'Reduces losses in risky deals.',
        salary: 8000,
        experienceYears: 4,
        education: 'CA with Risk Management Certification',
        position: 'Risk Analyst',
        previousCompanies: ['Kotak Mahindra', 'Axis Bank'],
        skills: ['Risk Assessment', 'Data Analysis', 'Financial Modeling']
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Sales & Marketing',
    icon: <TrendingUp size={24} />,
    color: '#e74c3c',
    candidates: [
      {
        id: 'meera_iyer',
        name: 'Meera Iyer',
        age: 31,
        impact: 'High',
        description: 'Drives brand growth and customer acquisition.',
        salary: 9000,
        experienceYears: 7,
        education: 'MBA in Marketing from XLRI',
        position: 'Marketing Director',
        previousCompanies: ['Unilever', 'P&G'],
        skills: ['Brand Strategy', 'Digital Marketing', 'Customer Analytics', 'Campaign Management']
      },
      {
        id: 'rohan_kapoor',
        name: 'Rohan Kapoor',
        age: 29,
        impact: 'Medium',
        description: 'Increases sales conversion rates.',
        salary: 7500,
        experienceYears: 5,
        education: 'BBA with Sales Certification',
        position: 'Sales Manager',
        previousCompanies: ['Reliance', 'Tata Group'],
        skills: ['Sales Strategy', 'Client Relations', 'Team Leadership']
      }
    ]
  },
  {
    id: 'operations',
    name: 'Operations & Technology',
    icon: <Briefcase size={24} />,
    color: '#3498db',
    candidates: [
      {
        id: 'priya_singh',
        name: 'Priya Singh',
        age: 26,
        impact: 'High',
        description: 'Optimizes operational efficiency.',
        salary: 8500,
        experienceYears: 4,
        education: 'B.Tech in Computer Science',
        position: 'Operations Manager',
        previousCompanies: ['Amazon', 'Flipkart'],
        skills: ['Process Optimization', 'Project Management', 'Data Analytics']
      }
    ]
  }
];

// Skill Node Interface for skill trees
interface SkillNode {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  category: 'core' | 'technical' | 'leadership' | 'soft';
  prerequisites: string[];
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  cost?: number;
}

interface AdvancedTeamManagementProps {
  onClose: () => void;
}

const AdvancedTeamManagement: React.FC<AdvancedTeamManagementProps> = ({ onClose }) => {
  const { financialData, updateFinancialData, addGameEvent } = useWealthSprintGame();
  const { 
    teamMembers, 
    jobApplicants, 
    addTeamMember, 
    removeTeamMember, 
    updateTeamMember,
    generateJobApplicant,
    hireCandidateDirectly
  } = useTeamManagement();

  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'hiring' | 'skills'>('overview');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showHireDialog, setShowHireDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{type: string, employee: TeamMember} | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [skillTrees, setSkillTrees] = useState<Record<string, SkillNode[]>>({});
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  // Generate skill tree based on team member's current skills
  const generateSkillTree = (member: TeamMember): SkillNode[] => {
    const baseSkills = member.skills || [];
    const skillNodes: SkillNode[] = [];
    
    // Core Skills (always unlocked)
    skillNodes.push(
      {
        id: 'communication',
        name: 'Communication',
        level: baseSkills.includes('Communication') ? 3 : 1,
        maxLevel: 5,
        category: 'core',
        prerequisites: [],
        description: 'Effective team communication and collaboration',
        icon: <User size={16} />,
        unlocked: true,
        cost: 5000
      },
      {
        id: 'problem_solving',
        name: 'Problem Solving',
        level: 2,
        maxLevel: 5,
        category: 'core',
        prerequisites: [],
        description: 'Analytical thinking and solution development',
        icon: <Zap size={16} />,
        unlocked: true,
        cost: 6000
      }
    );

    // Technical Skills (based on role)
    if (member.role.toLowerCase().includes('developer') || member.role.toLowerCase().includes('technology')) {
      skillNodes.push(
        {
          id: 'programming',
          name: 'Programming',
          level: baseSkills.some((s: string) => ['React', 'Node.js', 'Python', 'JavaScript'].includes(s)) ? 4 : 2,
          maxLevel: 5,
          category: 'technical',
          prerequisites: ['problem_solving'],
          description: 'Software development and coding expertise',
          icon: <TrendingUp size={16} />,
          unlocked: true,
          cost: 8000
        },
        {
          id: 'system_design',
          name: 'System Design',
          level: baseSkills.includes('System Design') ? 3 : 1,
          maxLevel: 5,
          category: 'technical',
          prerequisites: ['programming'],
          description: 'Architecture and scalable system planning',
          icon: <Award size={16} />,
          unlocked: baseSkills.includes('System Design'),
          cost: 12000
        }
      );
    }

    // Marketing Skills
    if (member.role.toLowerCase().includes('marketing')) {
      skillNodes.push(
        {
          id: 'digital_marketing',
          name: 'Digital Marketing',
          level: baseSkills.includes('Digital Marketing') ? 4 : 2,
          maxLevel: 5,
          category: 'technical',
          prerequisites: ['communication'],
          description: 'Online marketing and social media expertise',
          icon: <Palette size={16} />,
          unlocked: true,
          cost: 7000
        },
        {
          id: 'analytics',
          name: 'Analytics',
          level: baseSkills.includes('Analytics') ? 3 : 1,
          maxLevel: 5,
          category: 'technical',
          prerequisites: ['digital_marketing'],
          description: 'Data analysis and performance metrics',
          icon: <TrendingUp size={16} />,
          unlocked: baseSkills.includes('Analytics'),
          cost: 9000
        }
      );
    }

    // Financial Skills
    if (member.role.toLowerCase().includes('financial') || member.role.toLowerCase().includes('advisor')) {
      skillNodes.push(
        {
          id: 'investment_strategy',
          name: 'Investment Strategy',
          level: baseSkills.includes('Investment Strategy') ? 4 : 2,
          maxLevel: 5,
          category: 'technical',
          prerequisites: ['problem_solving'],
          description: 'Portfolio management and investment planning',
          icon: <DollarSign size={16} />,
          unlocked: true,
          cost: 10000
        },
        {
          id: 'risk_assessment',
          name: 'Risk Assessment',
          level: baseSkills.includes('Risk Assessment') ? 3 : 1,
          maxLevel: 5,
          category: 'technical',
          prerequisites: ['investment_strategy'],
          description: 'Financial risk analysis and mitigation',
          icon: <Shield size={16} />,
          unlocked: baseSkills.includes('Risk Assessment'),
          cost: 11000
        }
      );
    }

    // Leadership Skills (for senior roles)
    const isLeader = member.seniority === 'Senior' || member.seniority === 'VP' || member.seniority === 'CEO';
    skillNodes.push(
      {
        id: 'team_leadership',
        name: 'Team Leadership',
        level: isLeader ? 3 : 1,
        maxLevel: 5,
        category: 'leadership',
        prerequisites: ['communication'],
        description: 'Leading teams and driving performance',
        icon: <Award size={16} />,
        unlocked: isLeader,
        cost: 15000
      },
      {
        id: 'strategic_thinking',
        name: 'Strategic Thinking',
        level: isLeader ? 2 : 1,
        maxLevel: 5,
        category: 'leadership',
        prerequisites: ['team_leadership'],
        description: 'Long-term planning and vision development',
        icon: <Star size={16} />,
        unlocked: isLeader,
        cost: 18000
      }
    );

    return skillNodes;
  };

  // Initialize skill trees for all team members
  useEffect(() => {
    const trees: Record<string, SkillNode[]> = {};
    teamMembers.forEach(member => {
      trees[member.id] = generateSkillTree(member);
    });
    setSkillTrees(trees);
  }, [teamMembers]);

  // Training/Upgrade skill function
  const upgradeSkill = (memberId: string, skillId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    const skillTree = skillTrees[memberId];
    const skill = skillTree?.find(s => s.id === skillId);
    
    if (!member || !skill || !skill.cost) return;
    
    if (financialData.bankBalance < skill.cost) {
      toast.error('Insufficient funds for skill upgrade');
      return;
    }

    if (skill.level >= skill.maxLevel) {
      toast.error('Skill already at maximum level');
      return;
    }

    // Update financial data
    updateFinancialData({
      bankBalance: financialData.bankBalance - skill.cost
    });

    // Update member skills
    const updatedSkills = member.skills || [];
    if (!updatedSkills.includes(skill.name)) {
      updatedSkills.push(skill.name);
    }

    updateTeamMember(memberId, {
      skills: updatedSkills,
      stats: {
        ...member.stats,
        loyalty: Math.min(100, member.stats.loyalty + 5),
        energy: Math.min(100, member.stats.energy + 5),
      }
    });

    // Regenerate skill tree
    const updatedMember = { ...member, skills: updatedSkills };
    setSkillTrees(prev => ({
      ...prev,
      [memberId]: generateSkillTree(updatedMember)
    }));

    toast.success(`${skill.name} upgraded for ${member.name}!`);
  };

  const handleHire = (applicant: JobApplicant) => {
    const totalCost = applicant.expectedSalary;
    
    if (financialData.bankBalance >= totalCost) {
      const success = hireCandidateDirectly(applicant.id);
      
      if (success) {
        updateFinancialData({
          bankBalance: financialData.bankBalance - totalCost,
          monthlyExpenses: financialData.monthlyExpenses + (applicant.expectedSalary / 12)
        });
        
        addGameEvent({
          id: `hire_${Date.now()}`,
          type: 'achievement',
          title: '🎉 New Team Member',
          description: `Hired ${applicant.name} as ${applicant.role}`,
          impact: { duration: 1, effects: {} }
        });
        
        setShowHireDialog(false);
        toast.success(`Successfully hired ${applicant.name}!`);
      } else {
        toast.error('Failed to hire candidate');
      }
    } else {
      toast.error('Insufficient funds to hire this candidate');
    }
  };

  const handleFire = (member: TeamMember) => {
    removeTeamMember(member.id);
    updateFinancialData({
      monthlyExpenses: financialData.monthlyExpenses - (member.salary / 12)
    });
    
    addGameEvent({
      id: `fire_${Date.now()}`,
      type: 'info',
      title: '📤 Team Member Departed',
      description: `${member.name} has left the company`,
      impact: { duration: 1, effects: {} }
    });
    
    toast.success(`${member.name} has been removed from the team`);
  };

  // Candidate hiring function from departments
  const handleHireCandidate = (candidate: Candidate) => {
    if (financialData.bankBalance >= candidate.salary * 12) {
      const newTeamMember: TeamMember = {
        id: candidate.id,
        name: candidate.name,
        role: candidate.position,
        avatar: candidate.position.includes('Finance') ? '💰' : 
                candidate.position.includes('Marketing') || candidate.position.includes('Sales') ? '📈' :
                '⚙️',
        skills: candidate.skills,
        salary: candidate.salary * 12, // Convert monthly to yearly
        stats: {
          loyalty: 75,
          impact: candidate.impact === 'High' ? 90 : candidate.impact === 'Medium' ? 75 : 60,
          energy: 85,
          mood: 'motivated' as const
        },
        joinDate: new Date(),
        achievements: [],
        personality: {
          type: candidate.impact === 'High' ? 'High Performer' : 'Team Player',
          motivationTriggers: ['Growth', 'Recognition'],
          weakSpots: ['Perfectionism']
        },
        emotionalTrait: candidate.impact === 'High' ? 'High achiever' : 'Steady contributor',
        loopVulnerability: 'none' as const,
        clarityContribution: candidate.impact === 'High' ? 8 : candidate.impact === 'Medium' ? 6 : 4,
        hiddenDynamics: {
          trustWithFounder: 75,
          creativeFulfillment: 80,
          burnoutRisk: 20,
          isHidingStruggles: false
        },
        department: candidate.position.includes('Finance') ? 'Financial' : 
                   candidate.position.includes('Marketing') || candidate.position.includes('Sales') ? 'Marketing' :
                   'Operations',
        seniority: 'Mid' as const,
        status: 'Neutral' as const,
        promotionHistory: [],
        isCEO: false,
      };

      addTeamMember(newTeamMember);
      updateFinancialData({
        bankBalance: financialData.bankBalance - (candidate.salary * 12),
        monthlyExpenses: financialData.monthlyExpenses + candidate.salary
      });

      toast.success(`Successfully hired ${candidate.name}!`);
      setSelectedDepartment(null); // Go back to department selection
    } else {
      toast.error('Insufficient funds to hire this candidate');
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const isAlreadyHired = (candidateId: string) => {
    return teamMembers.some(member => member.id === candidateId);
  };

  const handlePromote = (member: TeamMember) => {
    setShowConfirmDialog({ type: 'promote', employee: member });
  };

  const confirmPromotion = () => {
    if (!showConfirmDialog) return;
    
    const { employee } = showConfirmDialog;
    const seniorityLevels = ['Junior', 'Mid', 'Senior', 'VP', 'CEO'];
    const currentIndex = seniorityLevels.indexOf(employee.seniority);
    
    if (currentIndex < seniorityLevels.length - 1) {
      const newSeniority = seniorityLevels[currentIndex + 1] as any;
      const salaryIncrease = employee.salary * 0.25;
      
      updateTeamMember(employee.id, {
        seniority: newSeniority,
        salary: employee.salary + salaryIncrease,
        stats: {
          ...employee.stats,
          loyalty: Math.min(100, employee.stats.loyalty + 15),
          energy: Math.min(100, employee.stats.energy + 10),
        }
      });
      
      toast.success(`${employee.name} promoted to ${newSeniority}!`);
    }
    
    setShowConfirmDialog(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-500';
      case 'technical': return 'bg-green-500';
      case 'leadership': return 'bg-purple-500';
      case 'soft': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getSkillLevelColor = (level: number, maxLevel: number) => {
    const percentage = level / maxLevel;
    if (percentage >= 0.8) return 'text-green-600';
    if (percentage >= 0.6) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const filteredMembers = departmentFilter === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => {
        const role = CORE_ROLES.find(r => r.name === member.role);
        return role?.department === departmentFilter;
      });

  const departments = ['all', ...Array.from(new Set(CORE_ROLES.map(r => r.department)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0ead6] to-[#f8f4e8] p-2 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <UserCog className="text-blue-600 mr-2" size={24} />
          <h1 className="text-2xl font-bold text-[#3a3a3a]">Team Management</h1>
        </div>
        <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
          <Users className="mr-1" size={14} />
          {teamMembers.length} Team Members
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-md">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Users className="mr-2" size={16} />
            Team Overview
          </TabsTrigger>
          <TabsTrigger value="hiring" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            <UserPlus className="mr-2" size={16} />
            Hiring Center
          </TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <Star className="mr-2" size={16} />
            Skill Development
          </TabsTrigger>
        </TabsList>

        {/* Team Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {teamMembers.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">No Employees</h2>
                <p className="text-gray-500 mb-4">Start building your dream team by hiring your first employee!</p>
                <Button 
                  onClick={() => setActiveTab('hiring')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <UserPlus className="mr-2" size={16} />
                  Start Hiring
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Department Filter */}
              <div className="flex items-center gap-4">
                <Label className="text-gray-700 font-medium">Filter by Department:</Label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-48 bg-white border-2 border-blue-200 hover:border-blue-400 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept} className="hover:bg-blue-50">
                        {dept === 'all' ? 'All Departments' : dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Team Members List */}
              <div className="space-y-4">
                {filteredMembers.map((member) => {
                  const role = CORE_ROLES.find(r => r.name === member.role);
                  
                  return (
                    <Card key={member.id} className="bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                              <User className="text-white" size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-[#3a3a3a]">{member.name}</h3>
                                <div className={`px-2 py-1 rounded-full text-xs text-white ${
                                  member.stats.impact >= 80 ? 'bg-green-500' : 
                                  member.stats.impact >= 60 ? 'bg-yellow-500' : 'bg-orange-500'
                                }`}>
                                  {member.stats.impact >= 80 ? 'High' : 
                                   member.stats.impact >= 60 ? 'Medium' : 'Low'} Impact
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{member.seniority} {member.role}</p>
                              <p className="text-sm text-gray-700 mb-3">{role?.description}</p>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Experience:</span>
                                  <span className="ml-2 font-medium">
                                    {Math.floor((new Date().getTime() - new Date(member.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Salary:</span>
                                  <span className="ml-2 font-medium text-green-600">{formatIndianCurrency(member.salary)}/year</span>
                                </div>
                              </div>

                              <div className="mt-3">
                                <span className="text-sm text-gray-600 font-medium">Skills:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {(member.skills || []).map((skill, index) => {
                                    const colors = [
                                      'bg-blue-100 text-blue-800 border-blue-300',
                                      'bg-green-100 text-green-800 border-green-300', 
                                      'bg-purple-100 text-purple-800 border-purple-300',
                                      'bg-orange-100 text-orange-800 border-orange-300',
                                      'bg-pink-100 text-pink-800 border-pink-300',
                                      'bg-indigo-100 text-indigo-800 border-indigo-300'
                                    ];
                                    const colorClass = colors[index % colors.length];
                                    return (
                                      <Badge key={skill} className={`text-xs ${colorClass}`}>
                                        {skill}
                                      </Badge>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col gap-2">
                            <Button
                              size="sm"
                              onClick={() => handlePromote(member)}
                              className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <ArrowUp className="mr-2 text-white" size={16} />
                              Promote
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedMember(member);
                                setActiveTab('skills');
                              }}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <TreePine className="mr-1 text-white" size={14} />
                              Skills
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleFire(member)}
                              className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <X className="text-white" size={14} />
                              Fire
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </TabsContent>

        {/* Hiring Center Tab */}
        <TabsContent value="hiring" className="space-y-6">
          {!selectedDepartment ? (
            // Department Selection View
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-[#3a3a3a] mb-4">Select Department:</h2>
              </div>

              {/* Department Cards */}
              <div className="space-y-4">
                {DEPARTMENTS.map((department) => (
                  <Card 
                    key={department.id} 
                    className="bg-white hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-300"
                    onClick={() => setSelectedDepartment(department.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
                            style={{ 
                              background: `linear-gradient(135deg, ${department.color}20, ${department.color}40)`,
                              color: department.color,
                              border: `2px solid ${department.color}30`
                            }}
                          >
                            {department.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#3a3a3a] text-lg">{department.name}</h3>
                            <p className="text-gray-600 text-sm flex items-center">
                              <Users className="mr-1" size={14} />
                              {department.candidates.length} candidates available
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Current Team Members */}
              {teamMembers.length > 0 && (
                <div className="mt-8">
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Your Team ({teamMembers.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="font-medium">{member.name}</span>
                            <span className="text-gray-600">{formatIndianCurrency(member.salary)}/year</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          ) : (
            // Candidate Selection View
            (() => {
              const department = DEPARTMENTS.find(d => d.id === selectedDepartment);
              if (!department) return null;
              
              return (
                <>
                  {/* Header */}
                  <div className="flex items-center mb-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDepartment(null)}
                      className="mr-3"
                    >
                      <ArrowLeft size={20} />
                    </Button>
                    <div 
                      className="mr-2"
                      style={{ color: department.color }}
                    >
                      {department.icon}
                    </div>
                    <h1 className="text-2xl font-bold text-[#3a3a3a]">{department.name}</h1>
                  </div>

                  {/* Candidates Section */}
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-[#3a3a3a] mb-4">Select Candidate:</h2>
                  </div>

                  {/* Candidate Cards */}
                  <div className="space-y-4">
                    {department.candidates.map((candidate) => {
                      const alreadyHired = isAlreadyHired(candidate.id);
                      const canAfford = financialData.bankBalance >= candidate.salary * 12;
                      
                      return (
                        <Card key={candidate.id} className="bg-gray-100">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                                  <User className="text-white" size={20} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-semibold text-[#3a3a3a]">{candidate.name}</h3>
                                  </div>
                                  
                                  <p className="text-sm text-gray-600 mb-1">{candidate.age} • {candidate.education}</p>
                                  <p className="text-sm font-medium text-blue-600 mb-1">Position: {candidate.position}</p>
                                  <p className="text-sm text-gray-600 mb-2">Previous Companies: {candidate.previousCompanies.join(', ')}</p>
                                  <p className="text-gray-600 text-sm mb-3">{candidate.description}</p>
                                  
                                  {/* Skills */}
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {candidate.skills.map((skill, index) => {
                                      const colors = [
                                        'bg-blue-100 text-blue-800 border-blue-300',
                                        'bg-green-100 text-green-800 border-green-300', 
                                        'bg-purple-100 text-purple-800 border-purple-300',
                                        'bg-orange-100 text-orange-800 border-orange-300',
                                        'bg-pink-100 text-pink-800 border-pink-300',
                                        'bg-indigo-100 text-indigo-800 border-indigo-300'
                                      ];
                                      const colorClass = colors[index % colors.length];
                                      return (
                                        <Badge key={index} className={`text-xs ${colorClass}`}>
                                          {skill}
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                  
                                  <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-1">
                                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                        <User size={10} className="text-white" />
                                      </div>
                                      <span className="font-medium">{formatIndianCurrency(candidate.salary * 12)}/year</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Star size={14} className="text-yellow-500" />
                                      <span>{candidate.experienceYears} years exp</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleHireCandidate(candidate)}
                                disabled={alreadyHired || !canAfford}
                                className={`${
                                  alreadyHired 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700'
                                } text-white px-4 py-2`}
                              >
                                {alreadyHired ? 'Hired' : 'Hire Now'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </>
              );
            })()
          )}
        </TabsContent>

        {/* Skill Development Tab */}
        <TabsContent value="skills" className="space-y-6">
          {teamMembers.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <TreePine className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">No Team Members</h2>
                <p className="text-gray-500 mb-4">Hire employees first to access skill development features</p>
                <Button 
                  onClick={() => setActiveTab('hiring')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <UserPlus className="mr-2" size={16} />
                  Start Hiring
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Member Selection */}
              {!selectedMember && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Select Team Member for Skill Development:</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map((member) => {
                      const role = CORE_ROLES.find(r => r.name === member.role);
                      return (
                        <Card 
                          key={member.id} 
                          className="bg-white hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedMember(member)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback style={{ backgroundColor: role?.color }}>
                                  {role?.emoji}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-lg">{member.name}</h3>
                                <p className="text-gray-600 text-sm">{member.role}</p>
                                <p className="text-blue-600 text-sm">{member.skills?.length || 0} skills acquired</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Skill Tree for Selected Member */}
              {selectedMember && (
                <div className="space-y-6">
                  {/* Member Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMember(null)}
                      >
                        <ArrowLeft size={16} />
                      </Button>
                      <Avatar>
                        <AvatarFallback style={{ backgroundColor: CORE_ROLES.find(r => r.name === selectedMember.role)?.color }}>
                          {CORE_ROLES.find(r => r.name === selectedMember.role)?.emoji}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-semibold">{selectedMember.name}</h2>
                        <p className="text-gray-600">{selectedMember.role} - Skill Development</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500">
                      Available Budget: {formatIndianCurrency(financialData.bankBalance)}
                    </Badge>
                  </div>

                  {/* Skill Categories */}
                  {['core', 'technical', 'leadership', 'soft'].map(category => {
                    const categorySkills = skillTrees[selectedMember.id]?.filter(skill => skill.category === category) || [];
                    
                    if (categorySkills.length === 0) return null;

                    return (
                      <Card key={category} className="bg-white">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${getCategoryColor(category)}`} />
                            {category.charAt(0).toUpperCase() + category.slice(1)} Skills
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categorySkills.map(skill => (
                              <Card key={skill.id} className="border-2">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      {skill.icon}
                                      <span className="font-medium">{skill.name}</span>
                                      {skill.unlocked ? (
                                        <Unlock className="w-4 h-4 text-green-500" />
                                      ) : (
                                        <Lock className="w-4 h-4 text-red-500" />
                                      )}
                                    </div>
                                    <Badge variant="outline" className={getSkillLevelColor(skill.level, skill.maxLevel)}>
                                      {skill.level}/{skill.maxLevel}
                                    </Badge>
                                  </div>

                                  <p className="text-sm text-gray-600 mb-3">{skill.description}</p>

                                  <div className="space-y-2">
                                    <Progress value={(skill.level / skill.maxLevel) * 100} className="h-2" />
                                    
                                    {skill.unlocked && skill.level < skill.maxLevel && (
                                      <Button
                                        size="sm"
                                        onClick={() => upgradeSkill(selectedMember.id, skill.id)}
                                        disabled={!skill.cost || financialData.bankBalance < skill.cost}
                                        className="w-full bg-green-500 hover:bg-green-600"
                                      >
                                        <Sparkles className="mr-2" size={14} />
                                        Upgrade - {formatIndianCurrency(skill.cost || 0)}
                                      </Button>
                                    )}

                                    {!skill.unlocked && (
                                      <div className="text-xs text-gray-500">
                                        Requires: {skill.prerequisites.join(', ')}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <Dialog open={!!showConfirmDialog} onOpenChange={() => setShowConfirmDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm {showConfirmDialog.type === 'promote' ? 'Promotion' : 'Action'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                Are you sure you want to promote {showConfirmDialog.employee.name}? 
                This will increase their salary by 25%.
              </p>
              <div className="flex gap-2">
                <Button onClick={confirmPromotion} className="flex-1">
                  Confirm Promotion
                </Button>
                <Button variant="outline" onClick={() => setShowConfirmDialog(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdvancedTeamManagement;