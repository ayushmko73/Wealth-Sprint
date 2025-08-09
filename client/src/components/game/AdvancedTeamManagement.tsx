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
  Unlock
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
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="mr-3"
          >
            <ArrowLeft size={20} />
          </Button>
          <Users className="text-[#d4af37] mr-2" size={24} />
          <h1 className="text-2xl font-bold text-[#3a3a3a]">Advanced Team Management</h1>
        </div>
        <Badge className="bg-blue-500 text-white">
          {teamMembers.length} Team Members
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="hiring">Hiring Center</TabsTrigger>
          <TabsTrigger value="skills">Skill Development</TabsTrigger>
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
                <Label>Filter by Department:</Label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Team Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member) => {
                  const role = CORE_ROLES.find(r => r.name === member.role);
                  return (
                    <Card key={member.id} className="bg-white hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback style={{ backgroundColor: role?.color }}>
                                {role?.emoji}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{member.name}</CardTitle>
                              <Badge variant="secondary" className="text-xs">
                                {member.seniority} {member.role}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Loyalty:</span>
                            <div className="flex items-center gap-2">
                              <Progress value={member.stats.loyalty} className="h-2" />
                              <span className="text-xs">{member.stats.loyalty}%</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Energy:</span>
                            <div className="flex items-center gap-2">
                              <Progress value={member.stats.energy} className="h-2" />
                              <span className="text-xs">{member.stats.energy}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Salary */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Salary:</span>
                          <span className="font-medium">{formatIndianCurrency(member.salary)}/year</span>
                        </div>

                        {/* Skills */}
                        <div>
                          <span className="text-sm text-gray-600">Skills ({member.skills?.length || 0}):</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(member.skills || []).slice(0, 3).map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {(member.skills?.length || 0) > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{(member.skills?.length || 0) - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePromote(member)}
                            className="flex-1"
                          >
                            <ArrowUp size={14} className="mr-1" />
                            Promote
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedMember(member);
                              setActiveTab('skills');
                            }}
                            className="flex-1"
                          >
                            <TreePine size={14} className="mr-1" />
                            Skills
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleFire(member)}
                          >
                            <X size={14} />
                          </Button>
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available Candidates</h2>
            <Button onClick={() => {
              for (let i = 0; i < 5; i++) {
                generateJobApplicant();
              }
            }} variant="outline">
              <Plus className="mr-2" size={16} />
              Generate New Candidates
            </Button>
          </div>

          {jobApplicants.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <UserPlus className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Candidates Available</h3>
                <p className="text-gray-500 mb-4">Generate new job candidates to start hiring</p>
                <Button onClick={() => {
                  for (let i = 0; i < 5; i++) {
                    generateJobApplicant();
                  }
                }} className="bg-blue-500 hover:bg-blue-600">
                  Generate Candidates
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobApplicants.map((applicant) => {
                const role = CORE_ROLES.find(r => r.name === applicant.role);
                const canAfford = financialData.bankBalance >= applicant.expectedSalary;
                
                return (
                  <Card key={applicant.id} className={`bg-white ${!canAfford ? 'opacity-60' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback style={{ backgroundColor: role?.color }}>
                              {role?.emoji}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{applicant.name}</CardTitle>
                            <p className="text-sm text-gray-600">{applicant.role}</p>
                          </div>
                        </div>
                        <Badge className={canAfford ? 'bg-green-500' : 'bg-red-500'}>
                          {formatIndianCurrency(applicant.expectedSalary)}/year
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Experience */}
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Experience:</span>
                        <span className="text-sm font-medium">{applicant.experience} years</span>
                      </div>

                      {/* Skills */}
                      <div>
                        <span className="text-sm text-gray-600">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {applicant.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Hire Button */}
                      <Button
                        onClick={() => handleHire(applicant)}
                        disabled={!canAfford}
                        className="w-full bg-blue-500 hover:bg-blue-600"
                      >
                        {canAfford ? (
                          <>
                            <UserPlus className="mr-2" size={16} />
                            Hire for {formatIndianCurrency(applicant.expectedSalary)}
                          </>
                        ) : (
                          <>
                            <AlertCircle className="mr-2" size={16} />
                            Insufficient Funds
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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