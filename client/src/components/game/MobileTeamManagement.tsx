import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Crown,
  ArrowUp,
  ArrowDown,
  Plus,
  X,
  Filter,
  Building,
  Briefcase,
  DollarSign,
  Star,
  Heart,
  Zap,
  Award,
  Settings
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { useTeamManagement } from '@/lib/stores/useTeamManagement';
import { TeamMember } from '@/lib/types/GameTypes';
import { toast } from 'sonner';
import { formatIndianCurrency } from '@/lib/utils';

// Core role definitions with vibrant colors
const CORE_ROLES = [
  {
    id: 'financial_advisor',
    name: 'Financial Advisor',
    department: 'Financial',
    emoji: '💰',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    borderColor: 'border-yellow-400',
    description: 'Manages investment strategies and financial planning',
    baseSalary: 120000
  },
  {
    id: 'risk_analyst',
    name: 'Risk Analyst', 
    department: 'Risk',
    emoji: '🛡️',
    color: 'from-red-400 to-pink-500',
    bgColor: 'bg-gradient-to-br from-red-50 to-pink-50',
    borderColor: 'border-red-400',
    description: 'Analyzes and mitigates business risks',
    baseSalary: 110000
  },
  {
    id: 'marketing_director',
    name: 'Marketing Director',
    department: 'Marketing', 
    emoji: '📈',
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    borderColor: 'border-blue-400',
    description: 'Drives brand growth and customer acquisition',
    baseSalary: 130000
  },
  {
    id: 'sales_manager',
    name: 'Sales Manager',
    department: 'Sales',
    emoji: '🎯',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    borderColor: 'border-green-400',
    description: 'Leads sales team and revenue generation',
    baseSalary: 115000
  },
  {
    id: 'operations_manager',
    name: 'Operations Manager',
    department: 'Operations',
    emoji: '⚙️',
    color: 'from-purple-400 to-violet-500',
    bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
    borderColor: 'border-purple-400',
    description: 'Optimizes business operations and processes',
    baseSalary: 125000
  },
  {
    id: 'ceo',
    name: 'Chief Executive Officer',
    department: 'Executive',
    emoji: '👑',
    color: 'from-amber-400 to-yellow-500',
    bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    borderColor: 'border-amber-400',
    description: 'Strategic leadership and overall business direction',
    baseSalary: 200000
  }
];

// Additional department roles with vibrant colors
const ADDITIONAL_ROLES = [
  {
    id: 'hr_manager',
    name: 'HR Manager',
    department: 'Human Resources',
    emoji: '👥',
    color: 'from-orange-400 to-red-500',
    bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
    borderColor: 'border-orange-400',
    description: 'Manages talent acquisition and employee relations',
    baseSalary: 95000
  },
  {
    id: 'hr_specialist',
    name: 'HR Specialist',
    department: 'Human Resources',
    emoji: '🤝',
    color: 'from-orange-300 to-red-400',
    bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
    borderColor: 'border-orange-300',
    description: 'Handles recruitment and employee development',
    baseSalary: 75000
  },
  {
    id: 'product_lead',
    name: 'Product Lead',
    department: 'Technician',
    emoji: '🔧',
    color: 'from-slate-400 to-gray-600',
    bgColor: 'bg-gradient-to-br from-slate-50 to-gray-50',
    borderColor: 'border-slate-400',
    description: 'Oversees product development and technical innovation',
    baseSalary: 140000
  },
  {
    id: 'tech_analyst',
    name: 'Tech Analyst',
    department: 'Technician',
    emoji: '💻',
    color: 'from-indigo-400 to-blue-600',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50',
    borderColor: 'border-indigo-400',
    description: 'Analyzes technical requirements and solutions',
    baseSalary: 105000
  },
  {
    id: 'systems_engineer',
    name: 'Systems Engineer',
    department: 'Technician',
    emoji: '🖥️',
    color: 'from-gray-400 to-slate-600',
    bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50',
    borderColor: 'border-gray-400',
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
  { id: 'fast_food', name: 'Fast Food', icon: '🍔', color: 'from-red-400 to-orange-500' },
  { id: 'tech_startup', name: 'Tech Startup', icon: '💻', color: 'from-blue-400 to-purple-500' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒', color: 'from-green-400 to-blue-500' },
  { id: 'healthcare', name: 'Health-Care', icon: '🏥', color: 'from-teal-400 to-green-500' }
];

interface MobileTeamManagementProps {
  onClose: () => void;
}

export default function MobileTeamManagement({ onClose }: MobileTeamManagementProps) {
  const { financialData } = useWealthSprintGame();
  const { teamMembers, addTeamMember, updateTeamMember } = useTeamManagement();
  
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false);
  const [showEmployeeDetail, setShowEmployeeDetail] = useState<TeamMember | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    type: 'promote' | 'demote';
    employee: TeamMember;
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Generate initial team members for each core role if they don't exist
  const generateCoreTeam = useCallback(() => {
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
  }, [teamMembers, addTeamMember]);

  // Generate core team on component mount
  useEffect(() => {
    if (teamMembers.length === 0) {
      generateCoreTeam();
    }
  }, [generateCoreTeam, teamMembers.length]);

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
      case 'Junior': return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      case 'Mid': return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white';
      case 'Senior': return 'bg-gradient-to-r from-purple-400 to-purple-500 text-white';
      case 'VP': return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
      case 'CEO': return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'Promoted': return 'border-green-400 shadow-lg shadow-green-100 ring-2 ring-green-200';
      case 'Demoted': return 'border-red-400 shadow-lg shadow-red-100 ring-2 ring-red-200';
      default: return 'border-gray-200 shadow-md';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Team Management</h1>
            <p className="text-sm text-gray-600">{filteredMembers.length} employees</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowFilters(!showFilters)} 
            variant="outline" 
            size="sm"
            className="bg-white/80"
          >
            <Filter size={16} />
          </Button>
          <Button onClick={onClose} variant="outline" size="sm" className="bg-white/80">
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">Department</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="bg-white/90">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Departments</SelectItem>
                  <SelectItem value="Executive">👑 Executive</SelectItem>
                  <SelectItem value="Financial">💰 Financial</SelectItem>
                  <SelectItem value="Risk">🛡️ Risk</SelectItem>
                  <SelectItem value="Marketing">📈 Marketing</SelectItem>
                  <SelectItem value="Sales">🎯 Sales</SelectItem>
                  <SelectItem value="Operations">⚙️ Operations</SelectItem>
                  <SelectItem value="Human Resources">👥 HR</SelectItem>
                  <SelectItem value="Technician">🔧 Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Business Sector</Label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="bg-white/90">
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

            <div>
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-white/90">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Promoted">🌟 Promoted</SelectItem>
                  <SelectItem value="Demoted">⚠️ Demoted</SelectItem>
                  <SelectItem value="Neutral">😐 Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <Button onClick={promoteAll} size="sm" className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white shadow-lg">
          <ArrowUp size={16} className="mr-1" />
          Promote All
        </Button>
        <Button onClick={demoteAll} size="sm" variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
          <ArrowDown size={16} className="mr-1" />
          Demote All
        </Button>
        <Button onClick={() => setShowAddRoleDialog(true)} size="sm" className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white shadow-lg">
          <Plus size={16} />
        </Button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMembers.map((member) => {
          const role = ALL_ROLES.find(r => r.name === member.role);
          return (
            <Card 
              key={member.id}
              className={`cursor-pointer hover:scale-[1.02] transition-all duration-300 ${getStatusBorderColor(member.status)} ${role?.bgColor || 'bg-white'}`}
              onClick={() => setShowEmployeeDetail(member)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${role?.color} flex items-center justify-center text-white text-lg shadow-lg`}>
                      {role?.emoji || '👤'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      {member.assignedSector && (
                        <div className="flex items-center gap-1 mt-1">
                          <Building size={12} className="text-blue-500" />
                          <span className="text-xs text-blue-600 font-medium">{member.assignedSector}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {member.isCEO && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                      <Crown size={12} className="mr-1" />
                      CEO
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getSeniorityBadgeColor(member.seniority)}>
                      {member.seniority}
                    </Badge>
                    {member.status !== 'Neutral' && (
                      <Badge 
                        className={
                          member.status === 'Promoted' 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg' 
                            : 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg'
                        }
                      >
                        {member.status === 'Promoted' ? '🌟' : '⚠️'} {member.status}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} className="text-green-500" />
                      <span className="text-gray-600">Salary:</span>
                    </div>
                    <span className="font-semibold text-green-600">{formatIndianCurrency(member.salary)}</span>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <Heart size={12} className="text-red-400 mx-auto mb-1" />
                      <div className="text-gray-600">Loyalty</div>
                      <div className="font-semibold">{member.stats.loyalty}%</div>
                    </div>
                    <div className="text-center">
                      <Zap size={12} className="text-yellow-400 mx-auto mb-1" />
                      <div className="text-gray-600">Energy</div>
                      <div className="font-semibold">{member.stats.energy}%</div>
                    </div>
                    <div className="text-center">
                      <Star size={12} className="text-purple-400 mx-auto mb-1" />
                      <div className="text-gray-600">Impact</div>
                      <div className="font-semibold">{member.stats.impact}%</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePromote(member);
                      }}
                    >
                      <ArrowUp size={12} className="mr-1" />
                      Promote
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDemote(member);
                      }}
                    >
                      <ArrowDown size={12} className="mr-1" />
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
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${ALL_ROLES.find(r => r.name === showEmployeeDetail.role)?.color} flex items-center justify-center text-white text-2xl shadow-lg`}>
                  {ALL_ROLES.find(r => r.name === showEmployeeDetail.role)?.emoji || '👤'}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{showEmployeeDetail.name}</h2>
                  <p className="text-gray-600">{showEmployeeDetail.role}</p>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <Label className="text-xs font-medium text-gray-500">Department</Label>
                  <p className="font-semibold">{showEmployeeDetail.department}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-500">Seniority</Label>
                  <Badge className={getSeniorityBadgeColor(showEmployeeDetail.seniority)}>
                    {showEmployeeDetail.seniority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-500">Salary</Label>
                  <p className="font-semibold text-green-600">{formatIndianCurrency(showEmployeeDetail.salary)}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-500">Join Date</Label>
                  <p className="font-semibold">{showEmployeeDetail.joinDate.toLocaleDateString()}</p>
                </div>
              </div>

              {/* Assign Sector */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Assigned Sector</Label>
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
                  <SelectTrigger className="bg-white/90">
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

              {/* Skills */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Skills</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {showEmployeeDetail.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
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
          <DialogContent className="max-w-sm mx-4">
            <DialogHeader>
              <DialogTitle className="text-center">
                {showConfirmDialog.type === 'promote' ? '🎉 Promote Employee?' : '⚠️ Demote Employee?'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="text-center space-y-3">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${ALL_ROLES.find(r => r.name === showConfirmDialog.employee.role)?.color} flex items-center justify-center text-white text-2xl shadow-lg mx-auto`}>
                {ALL_ROLES.find(r => r.name === showConfirmDialog.employee.role)?.emoji || '👤'}
              </div>
              <p className="text-gray-600">
                {showConfirmDialog.type === 'promote' ? 'Promote' : 'Demote'} {showConfirmDialog.employee.name}?
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowConfirmDialog(null)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={showConfirmDialog.type === 'promote' ? confirmPromotion : confirmDemotion}
                className={`flex-1 ${
                  showConfirmDialog.type === 'promote' 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600' 
                    : 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600'
                } text-white shadow-lg`}
              >
                {showConfirmDialog.type === 'promote' ? 'Promote' : 'Demote'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Role Dialog */}
      {showAddRoleDialog && (
        <Dialog open={showAddRoleDialog} onOpenChange={setShowAddRoleDialog}>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-3">
              {ADDITIONAL_ROLES.map(role => {
                const existing = teamMembers.find(member => member.role === role.name);
                return (
                  <Card 
                    key={role.id}
                    className={`cursor-pointer hover:scale-105 transition-all ${role.bgColor} ${role.borderColor} border-2 ${existing ? 'opacity-50' : ''}`}
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
                    <CardContent className="p-3 text-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center text-white text-lg shadow-lg mx-auto mb-2`}>
                        {role.emoji}
                      </div>
                      <h3 className="font-semibold text-sm">{role.name}</h3>
                      <p className="text-xs text-gray-600">{role.department}</p>
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        {formatIndianCurrency(role.baseSalary)}
                      </p>
                      {existing && (
                        <Badge className="mt-2 bg-gray-500 text-white">Already Hired</Badge>
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