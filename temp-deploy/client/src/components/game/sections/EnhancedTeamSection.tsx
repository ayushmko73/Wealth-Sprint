import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
  MessageCircle
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { teamRoles, TeamRole, getDepartments, getRolesByDepartment, getUnlockedRoles, generateRandomTeamMember } from '@/lib/data/teamRoles';

// Status color mapping
const statusColors = {
  'Stable': '#22C55E',
  'Active': '#3B82F6', 
  'Warning': '#F59E0B',
  'Critical': '#EF4444',
  'Overloaded': '#DC2626',
  'In Loop': '#8B5CF6'
};

// Department icons
const departmentIcons = {
  'Executive': Crown,
  'Operations': Briefcase,
  'Public': MessageCircle,
  'Culture': Heart,
  'Defense': Shield,
  'Innovation': Lightbulb,
  'Strategy': Target
};

export default function EnhancedTeamSection() {
  const { 
    teamMembers, 
    financialData, 
    playerStats,
    hireEmployee, 
    promoteEmployee, 
    giveBonus, 
    fireEmployee,
    addGameEvent,
    gainClarityXP,
    increaseLoopScore
  } = useWealthSprintGame();

  const [selectedRole, setSelectedRole] = useState<TeamRole | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showHireDialog, setShowHireDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

  const activeTeamMembers = teamMembers.filter(member => member.isActive);
  const departments = getDepartments();
  const unlockedRoles = getUnlockedRoles(playerStats.clarityXP, 0, playerStats.defeatedBosses);

  // Calculate team metrics
  const teamClarityScore = activeTeamMembers.reduce((sum, member) => 
    sum + (member.clarityContribution || member.performance), 0) / Math.max(activeTeamMembers.length, 1);
  
  const totalTeamCost = activeTeamMembers.reduce((sum, member) => sum + member.salary, 0);
  const averageLoopRisk = activeTeamMembers.reduce((sum, member) => 
    sum + (member.loopRisk || member.stress), 0) / Math.max(activeTeamMembers.length, 1);

  // Filter members by department
  const filteredMembers = selectedDepartment === 'All' 
    ? activeTeamMembers 
    : activeTeamMembers.filter(member => member.department === selectedDepartment);

  const handleHireEmployee = (roleId: string) => {
    const role = teamRoles.find(r => r.id === roleId);
    if (!role) return;

    if (financialData.bankBalance < role.baseSalary * 0.1) {
      addGameEvent(`Insufficient funds to hire ${role.name}. Need ₹${(role.baseSalary * 0.1).toLocaleString()} signing bonus.`);
      return;
    }

    const newMember = generateRandomTeamMember(roleId);
    const memberId = `team_${Date.now()}`;
    
    hireEmployee(memberId, newMember.name, newMember.role, role.baseSalary, newMember.department);
    gainClarityXP(5); // Hiring gives clarity XP
    setShowHireDialog(false);
    addGameEvent(`🎉 Hired ${newMember.name} as ${role.name} for ₹${role.baseSalary.toLocaleString()}/year`);
  };

  const RoleCard = ({ role, isUnlocked }: { role: TeamRole; isUnlocked: boolean }) => {
    const existingMember = activeTeamMembers.find(member => member.roleId === role.id);
    
    return (
      <Card 
        className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
          isUnlocked ? 'hover:shadow-lg' : 'opacity-50'
        } ${existingMember ? 'ring-2 ring-green-500' : ''}`}
        style={{ 
          borderColor: role.color,
          borderWidth: '2px',
          backgroundColor: '#FFE4C4CC',
          color: 'white'
        }}
        onClick={() => isUnlocked && setSelectedRole(role)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{role.emoji}</span>
              <div>
                <CardTitle className="text-sm font-bold text-white">
                  {role.name}
                </CardTitle>
                <p className="text-xs text-white opacity-80">{role.department}</p>
              </div>
            </div>
            {existingMember && (
              <Badge variant="secondary" className="text-xs">
                Hired
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white opacity-80">Salary:</span>
              <span className="font-medium text-white">₹{role.baseSalary.toLocaleString()}</span>
            </div>
            <div className="text-xs">
              <span className="font-medium text-white">{role.theme}</span>
            </div>
            <p className="text-xs text-white opacity-80 line-clamp-2">
              {role.description}
            </p>
            {!isUnlocked && role.unlockRequirement && (
              <Badge variant="outline" className="text-xs">
                Needs {role.unlockRequirement.clarityXP || 0} Clarity XP
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const TeamMemberCard = ({ member }: { member: any }) => {
    const role = teamRoles.find(r => r.id === member.roleId);
    if (!role) return null;

    const statusColor = statusColors[member.status as keyof typeof statusColors] || statusColors.Active;

    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-all duration-200"
        onClick={() => setSelectedMember(member.id)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Avatar 
              className="w-12 h-12" 
              style={{ backgroundColor: `${role.color}20`, border: `2px solid ${role.color}` }}
            >
              <AvatarFallback style={{ color: role.color }}>
                {role.emoji}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{member.name}</h3>
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ borderColor: statusColor, color: statusColor }}
                >
                  {member.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{role.name}</p>
              <p className="text-xs" style={{ color: role.color }}>{member.emotionalTrait}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Performance:</span>
              <Progress value={member.performance} className="h-1 mt-1" />
            </div>
            <div>
              <span className="text-muted-foreground">Stress:</span>
              <Progress 
                value={member.stress} 
                className="h-1 mt-1"
                style={{ backgroundColor: member.stress > 70 ? '#fee2e2' : undefined }}
              />
            </div>
            <div>
              <span className="text-muted-foreground">Loyalty:</span>
              <Progress value={member.loyalty} className="h-1 mt-1" />
            </div>
            <div>
              <span className="text-muted-foreground">Loop Risk:</span>
              <Progress 
                value={member.loopRisk || member.stress} 
                className="h-1 mt-1"
                style={{ backgroundColor: (member.loopRisk || member.stress) > 60 ? '#fef3c7' : undefined }}
              />
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Salary:</span>
            <span className="font-medium">₹{member.salary.toLocaleString()}/yr</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Team+ Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Team+ Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Build your emotional business empire with color-coded roles
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setShowHireDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Hire Team
          </Button>
        </div>
      </div>

      {/* Team Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-2xl font-bold">{activeTeamMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clarity Score</p>
                <p className="text-2xl font-bold">{Math.round(teamClarityScore)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team Cost</p>
                <p className="text-2xl font-bold">₹{Math.round(totalTeamCost / 1000)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${averageLoopRisk > 60 ? 'bg-red-100' : 'bg-green-100'}`}>
                <AlertTriangle className={`w-5 h-5 ${averageLoopRisk > 60 ? 'text-red-600' : 'text-green-600'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Loop Risk</p>
                <p className="text-2xl font-bold">{Math.round(averageLoopRisk)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedDepartment} onValueChange={setSelectedDepartment} className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="All">All</TabsTrigger>
          {departments.map(dept => {
            const Icon = departmentIcons[dept as keyof typeof departmentIcons] || Briefcase;
            return (
              <TabsTrigger key={dept} value={dept} className="flex items-center gap-1">
                <Icon className="w-3 h-3" />
                {dept}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedDepartment} className="space-y-4">
          {/* Current Team Members */}
          {filteredMembers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Current Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map(member => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}

          {/* Available Roles */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Available Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(selectedDepartment === 'All' ? unlockedRoles : getRolesByDepartment(selectedDepartment))
                .filter(role => unlockedRoles.some(ur => ur.id === role.id))
                .map(role => (
                  <RoleCard 
                    key={role.id} 
                    role={role} 
                    isUnlocked={unlockedRoles.some(ur => ur.id === role.id)}
                  />
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Role Details Dialog */}
      <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
        <DialogContent className="max-w-2xl">
          {selectedRole && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-3xl">{selectedRole.emoji}</span>
                  <div>
                    <span style={{ color: selectedRole.color }}>{selectedRole.name}</span>
                    <p className="text-sm text-muted-foreground font-normal">
                      {selectedRole.department} Department
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Theme</h4>
                    <Badge variant="outline" style={{ borderColor: selectedRole.color, color: selectedRole.color }}>
                      {selectedRole.theme}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Base Salary</h4>
                    <p className="text-lg font-bold">₹{selectedRole.baseSalary.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRole.skills.map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Emotional Profile</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Trait: </span>
                      <span className="text-sm">{selectedRole.emotionalTrait}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Loop Vulnerability: </span>
                      <span className="text-sm text-orange-600">{selectedRole.loopVulnerability}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => handleHireEmployee(selectedRole.id)}
                    className="flex-1"
                    style={{ backgroundColor: selectedRole.color }}
                    disabled={activeTeamMembers.some(member => member.roleId === selectedRole.id)}
                  >
                    {activeTeamMembers.some(member => member.roleId === selectedRole.id) 
                      ? 'Already Hired' 
                      : 'Hire Now'
                    }
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedRole(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Hire Dialog */}
      <Dialog open={showHireDialog} onOpenChange={setShowHireDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" style={{ backgroundColor: '#FFE4C4CC', color: 'white' }}>
          <DialogHeader>
            <DialogTitle className="text-white">Hire New Team Member</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedRoles.map(role => (
              <RoleCard 
                key={role.id} 
                role={role} 
                isUnlocked={true}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}