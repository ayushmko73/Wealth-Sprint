import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Building,
  UserCog,
  Star,
  Briefcase,
  Calendar,
  Activity
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { useTeamManagement } from '@/lib/stores/useTeamManagement';
import { formatIndianCurrency } from '@/lib/utils';

// Sector mapping
const SECTOR_MAPPING = {
  'fast_food': { name: 'Fast Food Chains', icon: '🍟', incomeBoost: 0.20, color: 'bg-red-500' },
  'tech_startups': { name: 'Tech Startups', icon: '💻', incomeBoost: 0.30, color: 'bg-blue-500' },
  'ecommerce': { name: 'E-commerce', icon: '📦', incomeBoost: 0.25, color: 'bg-purple-500' },
  'healthcare': { name: 'Healthcare', icon: '🏥', incomeBoost: 0.35, color: 'bg-green-500' },
};

interface SectorTeamSectionProps {
  sectorId: string;
  onNavigateToTeamManagement?: () => void;
}

const SectorTeamSection: React.FC<SectorTeamSectionProps> = ({ 
  sectorId, 
  onNavigateToTeamManagement 
}) => {
  const { financialData } = useWealthSprintGame();
  const { teamMembers } = useTeamManagement();

  // Get sector info
  const sector = SECTOR_MAPPING[sectorId as keyof typeof SECTOR_MAPPING];
  if (!sector) {
    return <div>Sector not found</div>;
  }

  // Filter employees assigned to this specific sector only
  const sectorEmployees = teamMembers.filter(member => member.assignedSector === sectorId);

  // Calculate performance metrics for this sector
  const calculateSectorPerformance = (member: any) => {
    const basePerformance = member.stats.impact || 70;
    const sectorBonus = sector.incomeBoost * 100;
    const totalPerformance = Math.min(100, basePerformance + sectorBonus * 0.3);
    
    return {
      performance: Math.round(totalPerformance),
      monthlyContribution: Math.round(member.salary * (sector.incomeBoost + ((member.stats.impact || 70) / 100) * 0.15) / 12),
      growthContribution: Math.round((basePerformance / 100) * 2.5),
      role: getSectorRole(sectorId, member.role)
    };
  };

  const getSectorRole = (sectorId: string, baseRole: string) => {
    const roles = {
      'fast_food': {
        'Financial Manager': 'Revenue Optimization Manager',
        'Risk Manager': 'Quality Control Supervisor',
        'Marketing Manager': 'Brand Marketing Director',
        'Sales Manager': 'Store Operations Manager',
        'Operations Manager': 'Supply Chain Coordinator',
        'HR Manager': 'Staff Training Director',
        'Senior Engineer': 'Kitchen Systems Engineer',
      },
      'tech_startups': {
        'Financial Manager': 'Funding & Investment Manager',
        'Risk Manager': 'Product Security Lead',
        'Marketing Manager': 'Growth Marketing Director',
        'Sales Manager': 'Business Development Manager',
        'Operations Manager': 'Product Operations Lead',
        'HR Manager': 'Talent Acquisition Director',
        'Senior Engineer': 'Lead Software Architect',
      },
      'ecommerce': {
        'Financial Manager': 'E-commerce Finance Manager',
        'Risk Manager': 'Fraud Prevention Specialist',
        'Marketing Manager': 'Digital Marketing Director',
        'Sales Manager': 'Customer Success Manager',
        'Operations Manager': 'Fulfillment Operations Lead',
        'HR Manager': 'Remote Team Coordinator',
        'Senior Engineer': 'Platform Engineering Lead',
      },
      'healthcare': {
        'Financial Manager': 'Healthcare Finance Director',
        'Risk Manager': 'Compliance & Risk Officer',
        'Marketing Manager': 'Patient Outreach Director',
        'Sales Manager': 'Client Relations Manager',
        'Operations Manager': 'Clinical Operations Manager',
        'HR Manager': 'Medical Staff Coordinator',
        'Senior Engineer': 'Healthcare IT Specialist',
      }
    };
    
    const sectorRoles = roles[sectorId as keyof typeof roles];
    return sectorRoles ? sectorRoles[baseRole as keyof typeof sectorRoles] || baseRole : baseRole;
  };

  const totalMonthlyContribution = sectorEmployees.reduce((sum, member) => {
    const performance = calculateSectorPerformance(member);
    return sum + performance.monthlyContribution;
  }, 0);

  const averagePerformance = sectorEmployees.length > 0 
    ? Math.round(sectorEmployees.reduce((sum, member) => {
        const performance = calculateSectorPerformance(member);
        return sum + performance.performance;
      }, 0) / sectorEmployees.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Sector Team Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-2xl mr-3">{sector.icon}</div>
          <div>
            <h2 className="text-xl font-bold text-[#3a3a3a]">{sector.name} Team</h2>
            <p className="text-sm text-gray-600">
              {sectorEmployees.length} employee{sectorEmployees.length !== 1 ? 's' : ''} assigned to this sector
            </p>
          </div>
        </div>
        {onNavigateToTeamManagement && (
          <Button
            onClick={onNavigateToTeamManagement}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <UserCog className="mr-2" size={16} />
            Manage Team
          </Button>
        )}
      </div>

      {/* Sector Performance Overview */}
      {sectorEmployees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Size</p>
                  <p className="text-2xl font-bold text-blue-600">{sectorEmployees.length}</p>
                </div>
                <Users className="text-blue-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                  <p className="text-2xl font-bold text-purple-600">{averagePerformance}%</p>
                </div>
                <TrendingUp className="text-purple-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Contribution</p>
                  <p className="text-2xl font-bold text-orange-600">{formatIndianCurrency(totalMonthlyContribution)}</p>
                </div>
                <DollarSign className="text-orange-500" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sector Employees */}
      {sectorEmployees.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sectorEmployees.map((member) => {
            const performance = calculateSectorPerformance(member);

            return (
              <Card key={member.id} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#3a3a3a] text-lg">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.seniority} {member.role}</p>
                      </div>
                    </div>
                    <Badge className={`${sector.color} text-white`}>
                      {sector.icon} {sector.name}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {/* Sector Role */}
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-purple-700 mb-1">Sector Role:</p>
                      <p className="text-sm text-purple-600">{performance.role}</p>
                      <p className="text-xs text-purple-600 mt-1">
                        Income Boost: +{Math.round((sector.incomeBoost + ((member.stats.impact || 70) / 100) * 0.15) * 100)}%
                      </p>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-blue-700">Performance</span>
                          <span className="text-xs font-bold text-blue-700">{performance.performance}%</span>
                        </div>
                        <Progress value={performance.performance} className="h-2" />
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-green-700">Growth Impact</span>
                          <span className="text-xs font-bold text-green-700">{performance.growthContribution}%</span>
                        </div>
                        <Progress value={performance.growthContribution * 10} className="h-2" />
                      </div>
                    </div>

                    {/* Financial Metrics */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Monthly Salary:</span>
                        <p className="font-medium text-green-600">{formatIndianCurrency(member.salary/12)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly Contribution:</span>
                        <p className="font-medium text-orange-600">{formatIndianCurrency(performance.monthlyContribution)}</p>
                      </div>
                    </div>

                    {/* Experience and Joining Date */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Experience:</span>
                        <span className="ml-2 font-medium">
                          {Math.floor((new Date().getTime() - new Date(member.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} year
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Joined:</span>
                        <span className="ml-2 font-medium">
                          {new Date(member.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* No Employees for This Sector */
        <Card className="bg-white">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{sector.icon}</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Team Members Assigned</h3>
            <p className="text-gray-500 mb-4">
              This sector doesn't have any employees assigned yet. 
              Assign team members to {sector.name} to see their performance here.
            </p>
            {onNavigateToTeamManagement && (
              <Button 
                onClick={onNavigateToTeamManagement}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <UserCog className="mr-2" size={16} />
                Assign Team Members
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SectorTeamSection;