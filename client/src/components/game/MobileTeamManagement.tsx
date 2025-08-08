import React, { useState, useCallback, useEffect, useRef } from 'react';
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

// Core role definitions with warm beige theme colors
const CORE_ROLES = [
  {
    id: 'financial_advisor',
    name: 'Financial Advisor',
    department: 'Financial',
    emoji: '💰',
    color: '#f5e8c3', // Muted gold
    iconColor: '#5E5A6F', // Muted slate
    description: 'Manages investment strategies and financial planning',
    baseSalary: 120000
  },
  {
    id: 'risk_analyst',
    name: 'Risk Analyst', 
    department: 'Risk',
    emoji: '🛡️',
    color: '#fce3e3', // Muted coral
    iconColor: '#5E5A6F',
    description: 'Analyzes and mitigates business risks',
    baseSalary: 110000
  },
  {
    id: 'marketing_director',
    name: 'Marketing Director',
    department: 'Marketing', 
    emoji: '📈',
    color: '#e8f2f5', // Soft blue-gray
    iconColor: '#5E5A6F',
    description: 'Drives brand growth and customer acquisition',
    baseSalary: 130000
  },
  {
    id: 'sales_manager',
    name: 'Sales Manager',
    department: 'Sales',
    emoji: '🎯',
    color: '#e8f5e8', // Soft green
    iconColor: '#5E5A6F',
    description: 'Leads sales team and revenue generation',
    baseSalary: 115000
  },
  {
    id: 'operations_manager',
    name: 'Operations Manager',
    department: 'Operations',
    emoji: '⚙️',
    color: '#f0e8f5', // Soft purple
    iconColor: '#5E5A6F',
    description: 'Optimizes business operations and processes',
    baseSalary: 125000
  },
  {
    id: 'ceo',
    name: 'Chief Executive Officer',
    department: 'Executive',
    emoji: '👑',
    color: '#f5e8c3', // Muted gold
    iconColor: '#5E5A6F',
    description: 'Strategic leadership and overall business direction',
    baseSalary: 200000
  }
];

// Additional department roles with warm beige theme colors
const ADDITIONAL_ROLES = [
  {
    id: 'hr_manager',
    name: 'HR Manager',
    department: 'Human Resources',
    emoji: '👥',
    color: '#f0e8d5', // Warm peach
    iconColor: '#5E5A6F',
    description: 'Manages talent acquisition and employee relations',
    baseSalary: 95000
  },
  {
    id: 'hr_specialist',
    name: 'HR Specialist',
    department: 'Human Resources',
    emoji: '🤝',
    color: '#f0e8d5', // Warm peach
    iconColor: '#5E5A6F',
    description: 'Handles recruitment and employee development',
    baseSalary: 75000
  },
  {
    id: 'product_lead',
    name: 'Product Lead',
    department: 'Technician',
    emoji: '🔧',
    color: '#e8ebe8', // Soft gray-green
    iconColor: '#5E5A6F',
    description: 'Oversees product development and technical innovation',
    baseSalary: 140000
  },
  {
    id: 'tech_analyst',
    name: 'Tech Analyst',
    department: 'Technician',
    emoji: '💻',
    color: '#e8ebe8', // Soft gray-green
    iconColor: '#5E5A6F',
    description: 'Analyzes technical requirements and solutions',
    baseSalary: 105000
  },
  {
    id: 'systems_engineer',
    name: 'Systems Engineer',
    department: 'Technician',
    emoji: '🖥️',
    color: '#e8ebe8', // Soft gray-green
    iconColor: '#5E5A6F',
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
  
  // Ref for the main container to handle click outside
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Prevent auto-back when clicking outside of interactive elements
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only prevent auto-back if clicking outside of buttons, dialogs, and interactive elements
      const target = event.target as Element;
      if (containerRef.current && 
          containerRef.current.contains(target) &&
          !target.closest('button') &&
          !target.closest('[role="dialog"]') &&
          !target.closest('[role="combobox"]') &&
          !target.closest('select') &&
          !target.closest('.card-interactive')) {
        // Don't trigger onClose - let user explicitly close
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
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
      case 'Junior': return 'bg-stone-400 text-white';
      case 'Mid': return 'bg-blue-400 text-white';
      case 'Senior': return 'bg-purple-400 text-white';
      case 'VP': return 'bg-orange-400 text-white';
      case 'CEO': return 'bg-amber-500 text-white';
      default: return 'bg-stone-400 text-white';
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'Promoted': return 'border-green-300 shadow-sm';
      case 'Demoted': return 'border-red-300 shadow-sm';
      default: return 'border-stone-200 shadow-sm';
    }
  };

  const getProgressColor = (type: string, value: number) => {
    switch (type) {
      case 'loyalty':
        return value >= 80 ? '#B4D3A1' : value >= 50 ? '#F2C078' : '#F8AFA6';
      case 'energy':
        return value >= 80 ? '#B4D3A1' : value >= 50 ? '#F2C078' : '#F8AFA6';
      case 'impact':
        return value >= 80 ? '#B4D3A1' : value >= 50 ? '#F2C078' : '#F8AFA6';
      default:
        return '#F2C078';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen p-4" 
      style={{ 
        fontFamily: 'Inter, sans-serif',
        background: 'linear-gradient(135deg, #f7f3ed 0%, #f2ede0 100%)'
      }}
    >
      {/* Team Management Header with Beige Theme */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-amber-900 rounded-2xl shadow-sm">
            <Users className="text-amber-50" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Team Management</h1>
            <p className="text-amber-700">{filteredMembers.length} employees building your empire</p>
          </div>
        </div>
        
        <div className="flex justify-end mb-4">
          <Button 
            onClick={() => setShowFilters(!showFilters)} 
            variant="outline" 
            size="sm"
            className="bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
          >
            <Filter size={16} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Beige Filters Panel */}
      {showFilters && (
        <div className="mb-8 p-6 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-amber-800 mb-2 block">Department</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="bg-amber-50 border-amber-200 text-amber-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-amber-50 border-amber-200">
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
              <Label className="text-sm font-medium text-amber-800 mb-2 block">Business Sector</Label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="bg-amber-50 border-amber-200 text-amber-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-amber-50 border-amber-200">
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
              <Label className="text-sm font-medium text-amber-800 mb-2 block">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-amber-50 border-amber-200 text-amber-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-amber-50 border-amber-200">
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



      {/* Team Grid - Clean Business Section Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const role = ALL_ROLES.find(r => r.name === member.role);
          return (
            <Card 
              key={member.id}
              className="card-interactive cursor-pointer hover:scale-105 transition-all duration-300 bg-amber-50 border border-amber-200 rounded-2xl shadow-lg hover:shadow-xl"
              onClick={() => setShowEmployeeDetail(member)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-800 to-amber-900 flex items-center justify-center text-2xl shadow-lg">
                    {role?.emoji || '👤'}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-amber-900 mb-1">{member.name}</CardTitle>
                    <p className="text-amber-700 font-medium">{member.role}</p>
                    {member.assignedSector && (
                      <div className="flex items-center gap-2 mt-2">
                        <Building size={14} className="text-amber-600" />
                        <span className="text-sm text-amber-800 font-medium">{member.assignedSector}</span>
                      </div>
                    )}
                  </div>
                  {member.isCEO && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-lg">
                      <Crown size={14} className="mr-1" />
                      CEO
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getSeniorityBadgeColor(member.seniority)} px-3 py-1 rounded-full font-medium`}>
                      {member.seniority}
                    </Badge>
                    {member.status !== 'Neutral' && (
                      <Badge 
                        className={`px-3 py-1 rounded-full font-medium ${
                          member.status === 'Promoted' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                      >
                        {member.status === 'Promoted' ? '🌟' : '⚠️'} {member.status}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="bg-amber-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-amber-600" />
                        <span className="text-amber-800 font-medium">Monthly Salary</span>
                      </div>
                      <span className="font-bold text-amber-800 text-lg">{formatIndianCurrency(member.salary)}</span>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mx-auto mb-3 shadow-md">
                        <Heart size={20} className="text-red-600" />
                      </div>
                      <div className="text-amber-700 font-medium text-sm">Loyalty</div>
                      <div className="font-bold text-amber-900 text-lg">{member.stats.loyalty}%</div>
                      <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${member.stats.loyalty}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center mx-auto mb-3 shadow-md">
                        <Zap size={20} className="text-yellow-600" />
                      </div>
                      <div className="text-amber-700 font-medium text-sm">Energy</div>
                      <div className="font-bold text-amber-900 text-lg">{member.stats.energy}%</div>
                      <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${member.stats.energy}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mx-auto mb-3 shadow-md">
                        <Star size={20} className="text-purple-600" />
                      </div>
                      <div className="text-amber-700 font-medium text-sm">Impact</div>
                      <div className="font-bold text-amber-900 text-lg">{member.stats.impact}%</div>
                      <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${member.stats.impact}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      size="lg" 
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium shadow-md transition-all duration-200 hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePromote(member);
                      }}
                    >
                      <ArrowUp size={16} className="mr-2" />
                      Promote
                    </Button>
                    <Button 
                      size="lg" 
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium shadow-md transition-all duration-200 hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDemote(member);
                      }}
                    >
                      <ArrowDown size={16} className="mr-2" />
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
          <DialogContent className="max-w-md mx-4 bg-[#fffdf7] border border-[#e5ddd1]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-sm"
                  style={{ 
                    backgroundColor: ALL_ROLES.find(r => r.name === showEmployeeDetail.role)?.iconColor || '#5E5A6F' 
                  }}
                >
                  {ALL_ROLES.find(r => r.name === showEmployeeDetail.role)?.emoji || '👤'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#3E3C38]">{showEmployeeDetail.name}</h2>
                  <p className="text-[#888174]">{showEmployeeDetail.role}</p>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <Label className="text-xs font-medium text-[#888174]">Department</Label>
                  <p className="font-semibold text-[#3E3C38]">{showEmployeeDetail.department}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-[#888174]">Seniority</Label>
                  <Badge className={`${getSeniorityBadgeColor(showEmployeeDetail.seniority)} rounded-lg px-2 py-1`}>
                    {showEmployeeDetail.seniority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs font-medium text-[#888174]">Salary</Label>
                  <p className="font-semibold text-[#3E3C38]">{formatIndianCurrency(showEmployeeDetail.salary)}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-[#888174]">Join Date</Label>
                  <p className="font-semibold text-[#3E3C38]">{showEmployeeDetail.joinDate.toLocaleDateString()}</p>
                </div>
              </div>

              {/* Assign Sector */}
              <div>
                <Label className="text-sm font-medium text-[#3E3C38]">Assigned Sector</Label>
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
                  <SelectTrigger className="bg-[#fffdf7] border-[#e5ddd1] text-[#3E3C38]">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
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
                <Label className="text-sm font-medium text-[#3E3C38]">Skills</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {showEmployeeDetail.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-[#e5ddd1] text-[#3E3C38]">{skill}</Badge>
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
          <DialogContent className="max-w-sm mx-4 bg-[#fffdf7] border border-[#e5ddd1]">
            <DialogHeader>
              <DialogTitle className="text-center">
                {showConfirmDialog.type === 'promote' ? '🎉 Promote Employee?' : '⚠️ Demote Employee?'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="text-center space-y-3">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-sm mx-auto"
                style={{ 
                  backgroundColor: ALL_ROLES.find(r => r.name === showConfirmDialog.employee.role)?.iconColor || '#5E5A6F' 
                }}
              >
                {ALL_ROLES.find(r => r.name === showConfirmDialog.employee.role)?.emoji || '👤'}
              </div>
              <p className="text-[#888174]">
                {showConfirmDialog.type === 'promote' ? 'Promote' : 'Demote'} {showConfirmDialog.employee.name}?
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmDialog(null)} 
                className="flex-1 border-[#e5ddd1] text-[#3E3C38] hover:bg-[#faf7f2]"
              >
                Cancel
              </Button>
              <Button 
                onClick={showConfirmDialog.type === 'promote' ? confirmPromotion : confirmDemotion}
                className={`flex-1 ${
                  showConfirmDialog.type === 'promote' 
                    ? 'bg-[#cfe7cd] hover:bg-[#b8ddb4]' 
                    : 'bg-[#f7c2c2] hover:bg-[#f4b0b0]'
                } text-[#3E3C38] border-0 shadow-sm rounded-xl transition-all duration-200 hover:scale-[1.02]`}
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
          <DialogContent className="max-w-md mx-4 bg-[#fffdf7] border border-[#e5ddd1]">
            <DialogHeader>
              <DialogTitle className="text-[#3E3C38]">Add New Team Member</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-3">
              {ADDITIONAL_ROLES.map(role => {
                const existing = teamMembers.find(member => member.role === role.name);
                return (
                  <Card 
                    key={role.id}
                    className={`cursor-pointer hover:scale-105 transition-all border-2 ${existing ? 'opacity-50' : ''}`}
                    style={{ 
                      backgroundColor: role.color,
                      borderColor: role.iconColor,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                    }}
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
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg shadow-sm mx-auto mb-2"
                        style={{ backgroundColor: role.iconColor }}
                      >
                        {role.emoji}
                      </div>
                      <h3 className="font-semibold text-sm text-[#3E3C38]">{role.name}</h3>
                      <p className="text-xs text-[#888174]">{role.department}</p>
                      <p className="text-xs mt-1 font-medium text-[#3E3C38]">
                        {formatIndianCurrency(role.baseSalary)}
                      </p>
                      {existing && (
                        <Badge className="mt-2 bg-[#5E5A6F] text-white">Already Hired</Badge>
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