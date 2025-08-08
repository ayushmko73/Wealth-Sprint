import React, { useState } from 'react';
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
  ArrowDown
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

// Additional department roles
const ADDITIONAL_ROLES = [
  {
    id: 'hr_manager',
    name: 'HR Manager',
    department: 'Human Resources',
    emoji: '👥',
    color: '#e67e22',
    description: 'Manages talent acquisition and employee relations',
    baseSalary: 95000
  },
  {
    id: 'hr_specialist',
    name: 'HR Specialist',
    department: 'Human Resources',
    emoji: '🤝',
    color: '#e67e22',
    description: 'Handles recruitment and employee development',
    baseSalary: 75000
  },
  {
    id: 'product_lead',
    name: 'Product Lead',
    department: 'Technician',
    emoji: '🔧',
    color: '#34495e',
    description: 'Oversees product development and technical innovation',
    baseSalary: 140000
  },
  {
    id: 'tech_analyst',
    name: 'Tech Analyst',
    department: 'Technician',
    emoji: '💻',
    color: '#34495e',
    description: 'Analyzes technical requirements and solutions',
    baseSalary: 105000
  },
  {
    id: 'systems_engineer',
    name: 'Systems Engineer',
    department: 'Technician',
    emoji: '🖥️',
    color: '#34495e',
    description: 'Maintains and optimizes technical infrastructure',
    baseSalary: 120000
  }
];

const ALL_ROLES = [...CORE_ROLES, ...ADDITIONAL_ROLES];

// Sample names for different departments
const NAME_POOLS = {
  'Financial': ['Aravind Sharma', 'Meera Patel', 'Vikram Gupta', 'Kavya Nair', 'Rohan Malhotra'],
  'Risk': ['Deepika Singh', 'Arjun Reddy', 'Nisha Agarwal', 'Karan Joshi', 'Pooja Verma'],
  'Marketing': ['Sanjay Yadav', 'Ritu Bansal', 'Nitin Kapoor', 'Anita Desai', 'Rahul Kumar'],
  'Sales': ['Priya Choudhary', 'Ajay Sharma', 'Neha Malhotra', 'Siddharth Nair', 'Divya Gupta'],
  'Operations': ['Amit Patel', 'Sneha Reddy', 'Manoj Singh', 'Kritika Agarwal', 'Varun Joshi'],
  'Executive': ['Rajesh Mehta', 'Sunita Sharma', 'Ashok Gupta', 'Meena Nair', 'Suresh Patel'],
  'Human Resources': ['Lakshmi Iyer', 'Sunil Yadav', 'Preeti Bansal', 'Harish Kumar', 'Swati Verma'],
  'Technician': ['Ramesh Babu', 'Gayatri Nair', 'Prakash Reddy', 'Shweta Singh', 'Anil Kumar']
};

// Business sectors for assignment
const BUSINESS_SECTORS = [
  { id: 'fast_food', name: 'Fast Food', icon: '🍔' },
  { id: 'tech_startup', name: 'Tech Startup', icon: '💻' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'healthcare', name: 'Health-Care', icon: '🏥' }
];

interface TeamManagementSectionProps {
  onClose: () => void;
}

export default function TeamManagementSection({ onClose }: TeamManagementSectionProps) {
  const { financialData, updateFinancialData, playerStats } = useWealthSprintGame();
  const { teamMembers, addTeamMember, updateTeamMember, removeTeamMember } = useTeamManagement();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false);
  const [showEmployeeDetail, setShowEmployeeDetail] = useState<TeamMember | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    type: 'promote' | 'demote';
    employee: TeamMember;
  } | null>(null);

  // Generate initial team members for each core role if they don't exist
  const generateCoreTeam = () => {
    CORE_ROLES.forEach(role => {
      const existing = teamMembers.find(member => member.role === role.name);
      if (!existing) {
        const randomName = NAME_POOLS[role.department as keyof typeof NAME_POOLS][
          Math.floor(Math.random() * NAME_POOLS[role.department as keyof typeof NAME_POOLS].length)
        ];
        
        const newMember: TeamMember = {
          id: `${role.id}_${Date.now()}`,
          name: randomName,
          role: role.name,
          avatar: role.emoji,
          stats: {
            loyalty: 60 + Math.floor(Math.random() * 30),
            impact: 50 + Math.floor(Math.random() * 40),
            energy: 70 + Math.floor(Math.random() * 20),
            mood: 'neutral' as const
          },
          salary: role.baseSalary,
          joinDate: new Date(),
          skills: [`${role.department} expertise`, 'Leadership', 'Strategic thinking'],
          achievements: [],
          personality: {
            type: 'Professional',
            motivationTriggers: ['Recognition', 'Growth', 'Challenge'],
            weakSpots: ['Micromanagement', 'Unrealistic deadlines']
          },
          emotionalTrait: 'Dedicated professional',
          loopVulnerability: 'none' as const,
          clarityContribution: 5 + Math.floor(Math.random() * 5),
          hiddenDynamics: {
            trustWithFounder: 70 + Math.floor(Math.random() * 20),
            creativeFulfillment: 60 + Math.floor(Math.random() * 30),
            burnoutRisk: 20 + Math.floor(Math.random() * 20),
            isHidingStruggles: false
          },
          department: role.department as any,
          seniority: role.id === 'ceo' ? 'CEO' as const : 'Mid' as const,
          status: 'Neutral' as const,
          promotionHistory: [],
          isCEO: role.id === 'ceo'
        };
        
        addTeamMember(newMember);
      }
    });
  };

  // Generate core team on component mount
  React.useEffect(() => {
    if (teamMembers.length === 0) {
      generateCoreTeam();
    }
  }, []);

  // Filter team members based on selected filters
  const filteredMembers = teamMembers.filter(member => {
    if (selectedRole !== 'All' && member.department !== selectedRole) return false;
    if (selectedSector !== 'All' && member.assignedSector !== selectedSector) return false;
    if (selectedStatus !== 'All' && member.status !== selectedStatus) return false;
    return true;
  });

  const handlePromote = (member: TeamMember) => {
    setShowConfirmDialog({ type: 'promote', employee: member });
  };

  const handleDemote = (member: TeamMember) => {
    setShowConfirmDialog({ type: 'demote', employee: member });
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
        status: 'Promoted' as const,
        promotionHistory: [
          ...employee.promotionHistory,
          {
            date: new Date(),
            action: 'Promoted' as const,
            fromLevel: employee.seniority,
            toLevel: newSeniority,
            reason: 'Performance excellence'
          }
        ],
        stats: {
          ...employee.stats,
          loyalty: Math.min(100, employee.stats.loyalty + 15),
          energy: Math.min(100, employee.stats.energy + 10),
          mood: 'motivated' as const
        }
      });
      
      toast.success(`${employee.name} promoted to ${newSeniority}!`);
    }
    
    setShowConfirmDialog(null);
  };

  const confirmDemotion = () => {
    if (!showConfirmDialog) return;
    
    const { employee } = showConfirmDialog;
    const seniorityLevels = ['Junior', 'Mid', 'Senior', 'VP', 'CEO'];
    const currentIndex = seniorityLevels.indexOf(employee.seniority);
    
    if (currentIndex > 0) {
      const newSeniority = seniorityLevels[currentIndex - 1] as any;
      const salaryDecrease = employee.salary * 0.15;
      
      updateTeamMember(employee.id, {
        seniority: newSeniority,
        salary: Math.max(50000, employee.salary - salaryDecrease),
        status: 'Demoted' as const,
        promotionHistory: [
          ...employee.promotionHistory,
          {
            date: new Date(),
            action: 'Demoted' as const,
            fromLevel: employee.seniority,
            toLevel: newSeniority,
            reason: 'Performance concerns'
          }
        ],
        stats: {
          ...employee.stats,
          loyalty: Math.max(0, employee.stats.loyalty - 20),
          energy: Math.max(20, employee.stats.energy - 15),
          mood: 'burnt_out' as const
        }
      });
      
      toast.error(`${employee.name} demoted to ${newSeniority}`);
    }
    
    setShowConfirmDialog(null);
  };

  const promoteAll = () => {
    filteredMembers.forEach(member => {
      const seniorityLevels = ['Junior', 'Mid', 'Senior', 'VP', 'CEO'];
      const currentIndex = seniorityLevels.indexOf(member.seniority);
      
      if (currentIndex < seniorityLevels.length - 1) {
        const newSeniority = seniorityLevels[currentIndex + 1] as any;
        const salaryIncrease = member.salary * 0.25;
        
        updateTeamMember(member.id, {
          seniority: newSeniority,
          salary: member.salary + salaryIncrease,
          status: 'Promoted' as const
        });
      }
    });
    
    toast.success('All eligible employees promoted!');
  };

  const demoteAll = () => {
    filteredMembers.forEach(member => {
      const seniorityLevels = ['Junior', 'Mid', 'Senior', 'VP', 'CEO'];
      const currentIndex = seniorityLevels.indexOf(member.seniority);
      
      if (currentIndex > 0) {
        const newSeniority = seniorityLevels[currentIndex - 1] as any;
        const salaryDecrease = member.salary * 0.15;
        
        updateTeamMember(member.id, {
          seniority: newSeniority,
          salary: Math.max(50000, member.salary - salaryDecrease),
          status: 'Demoted' as const
        });
      }
    });
    
    toast.error('All eligible employees demoted');
  };

  const getSeniorityBadgeColor = (seniority: string) => {
    switch (seniority) {
      case 'Junior': return 'bg-gray-500';
      case 'Mid': return 'bg-blue-500';
      case 'Senior': return 'bg-purple-500';
      case 'VP': return 'bg-orange-500';
      case 'CEO': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'Promoted': return 'border-green-500 shadow-green-200';
      case 'Demoted': return 'border-red-500 shadow-red-200';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0ead6] to-[#f8f4e8] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="text-[#d4af37]" size={32} />
          <h1 className="text-3xl font-bold text-[#3a3a3a]">Team Management</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={promoteAll} variant="outline" className="gap-2">
            <ArrowUp size={16} />
            Promote All
          </Button>
          <Button onClick={demoteAll} variant="outline" className="gap-2">
            <ArrowDown size={16} />
            Demote All
          </Button>
          <Button onClick={() => setShowAddRoleDialog(true)} className="gap-2 bg-[#d4af37] hover:bg-[#b8941f]">
            <Plus size={16} />
            Add Role
          </Button>
          <Button onClick={onClose} variant="outline" size="icon">
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Label>Role:</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="Executive">Executive</SelectItem>
              <SelectItem value="Financial">Financial</SelectItem>
              <SelectItem value="Risk">Risk</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Human Resources">HR</SelectItem>
              <SelectItem value="Technician">Technician</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label>Sector:</Label>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Sectors</SelectItem>
              {BUSINESS_SECTORS.map(sector => (
                <SelectItem key={sector.id} value={sector.name}>
                  {sector.icon} {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label>Status:</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Promoted">Promoted</SelectItem>
              <SelectItem value="Demoted">Demoted</SelectItem>
              <SelectItem value="Neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const role = ALL_ROLES.find(r => r.name === member.role);
          return (
            <Card 
              key={member.id}
              className={`cursor-pointer hover:scale-105 transition-all duration-300 ${getStatusBorderColor(member.status)}`}
              onClick={() => setShowEmployeeDetail(member)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12" style={{ backgroundColor: role?.color + '20' }}>
                      <AvatarFallback style={{ color: role?.color }}>
                        {role?.emoji || '👤'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-[#3a3a3a]">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      {member.assignedSector && (
                        <p className="text-xs text-blue-600">📍 {member.assignedSector}</p>
                      )}
                    </div>
                  </div>
                  
                  {member.isCEO && (
                    <Badge className="bg-yellow-500 text-white">
                      <Crown size={12} className="mr-1" />
                      CEO
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getSeniorityBadgeColor(member.seniority)} text-white`}>
                      {member.seniority}
                    </Badge>
                    {member.status !== 'Neutral' && (
                      <Badge 
                        variant={member.status === 'Promoted' ? 'default' : 'destructive'}
                        className={member.status === 'Promoted' ? 'bg-green-500' : 'bg-red-500'}
                      >
                        {member.status}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Salary:</span>
                    <span className="font-semibold">{formatIndianCurrency(member.salary)}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 gap-1 text-green-600 hover:bg-green-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePromote(member);
                      }}
                    >
                      <ArrowUp size={12} />
                      Promote
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 gap-1 text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDemote(member);
                      }}
                    >
                      <ArrowDown size={12} />
                      Demote
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Employee Detail Modal */}
      {showEmployeeDetail && (
        <Dialog open={!!showEmployeeDetail} onOpenChange={() => setShowEmployeeDetail(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="w-16 h-16">
                  <AvatarFallback>
                    {ALL_ROLES.find(r => r.name === showEmployeeDetail.role)?.emoji || '👤'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{showEmployeeDetail.name}</h2>
                  <p className="text-gray-600">{showEmployeeDetail.role}</p>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Department</Label>
                  <p className="font-semibold">{showEmployeeDetail.department}</p>
                </div>
                <div>
                  <Label>Seniority</Label>
                  <Badge className={`${getSeniorityBadgeColor(showEmployeeDetail.seniority)} text-white`}>
                    {showEmployeeDetail.seniority}
                  </Badge>
                </div>
                <div>
                  <Label>Salary</Label>
                  <p className="font-semibold">{formatIndianCurrency(showEmployeeDetail.salary)}</p>
                </div>
                <div>
                  <Label>Join Date</Label>
                  <p className="font-semibold">{showEmployeeDetail.joinDate.toLocaleDateString()}</p>
                </div>
              </div>

              {/* Assign Sector */}
              <div>
                <Label>Assigned Sector</Label>
                <Select 
                  value={showEmployeeDetail.assignedSector || 'none'} 
                  onValueChange={(value) => {
                    updateTeamMember(showEmployeeDetail.id, {
                      assignedSector: value === 'none' ? undefined : value
                    });
                    setShowEmployeeDetail({
                      ...showEmployeeDetail,
                      assignedSector: value === 'none' ? undefined : value
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Assignment</SelectItem>
                    {BUSINESS_SECTORS.map(sector => (
                      <SelectItem key={sector.id} value={sector.name}>
                        {sector.icon} {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Promotion History */}
              {showEmployeeDetail.promotionHistory.length > 0 && (
                <div>
                  <Label>Promotion History</Label>
                  <div className="space-y-2 mt-2">
                    {showEmployeeDetail.promotionHistory.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">
                          {entry.action}: {entry.fromLevel} → {entry.toLevel}
                        </span>
                        <span className="text-xs text-gray-500">
                          {entry.date.toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              <div>
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {showEmployeeDetail.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <Dialog open={!!showConfirmDialog} onOpenChange={() => setShowConfirmDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Confirm {showConfirmDialog.type === 'promote' ? 'Promotion' : 'Demotion'}
              </DialogTitle>
            </DialogHeader>
            
            <p>
              Are you sure you want to {showConfirmDialog.type} {showConfirmDialog.employee.name}?
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowConfirmDialog(null)}>
                Cancel
              </Button>
              <Button 
                onClick={showConfirmDialog.type === 'promote' ? confirmPromotion : confirmDemotion}
                variant={showConfirmDialog.type === 'promote' ? 'default' : 'destructive'}
              >
                Yes, {showConfirmDialog.type === 'promote' ? 'Promote' : 'Demote'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Role Dialog */}
      {showAddRoleDialog && (
        <Dialog open={showAddRoleDialog} onOpenChange={setShowAddRoleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              {ADDITIONAL_ROLES.map(role => {
                const existing = teamMembers.find(member => member.role === role.name);
                return (
                  <Card 
                    key={role.id}
                    className={`cursor-pointer hover:scale-105 transition-all ${existing ? 'opacity-50' : ''}`}
                    onClick={() => {
                      if (!existing) {
                        const randomName = NAME_POOLS[role.department as keyof typeof NAME_POOLS][
                          Math.floor(Math.random() * NAME_POOLS[role.department as keyof typeof NAME_POOLS].length)
                        ];
                        
                        const newMember: TeamMember = {
                          id: `${role.id}_${Date.now()}`,
                          name: randomName,
                          role: role.name,
                          avatar: role.emoji,
                          stats: {
                            loyalty: 60 + Math.floor(Math.random() * 30),
                            impact: 50 + Math.floor(Math.random() * 40),
                            energy: 70 + Math.floor(Math.random() * 20),
                            mood: 'neutral' as const
                          },
                          salary: role.baseSalary,
                          joinDate: new Date(),
                          skills: [`${role.department} expertise`, 'Teamwork', 'Problem solving'],
                          achievements: [],
                          personality: {
                            type: 'Professional',
                            motivationTriggers: ['Recognition', 'Growth'],
                            weakSpots: ['Micromanagement']
                          },
                          emotionalTrait: 'Dedicated professional',
                          loopVulnerability: 'none' as const,
                          clarityContribution: 3 + Math.floor(Math.random() * 4),
                          hiddenDynamics: {
                            trustWithFounder: 70 + Math.floor(Math.random() * 20),
                            creativeFulfillment: 60 + Math.floor(Math.random() * 30),
                            burnoutRisk: 20 + Math.floor(Math.random() * 20),
                            isHidingStruggles: false
                          },
                          department: role.department as any,
                          seniority: 'Junior' as const,
                          status: 'Neutral' as const,
                          promotionHistory: [],
                          isCEO: false
                        };
                        
                        addTeamMember(newMember);
                        setShowAddRoleDialog(false);
                        toast.success(`Added ${randomName} as ${role.name}!`);
                      }
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{role.emoji}</div>
                      <h3 className="font-semibold text-sm">{role.name}</h3>
                      <p className="text-xs text-gray-600">{role.department}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {formatIndianCurrency(role.baseSalary)}
                      </p>
                      {existing && (
                        <Badge className="mt-2 bg-gray-500">Already Hired</Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}