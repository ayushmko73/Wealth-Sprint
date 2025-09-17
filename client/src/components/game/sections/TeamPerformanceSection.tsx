import React, { useState } from 'react';
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
  ArrowRight,
  Star,
  Target,
  Briefcase,
  Calendar,
  Activity,
  PieChart
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

interface TeamPerformanceSectionProps {
  onNavigateToTeamManagement?: () => void;
}

const TeamPerformanceSection: React.FC<TeamPerformanceSectionProps> = ({ onNavigateToTeamManagement }) => {
  const { financialData, purchasedSectors } = useWealthSprintGame();
  const { teamMembers } = useTeamManagement();

  // Calculate performance metrics
  const calculateSectorPerformance = (member: any) => {
    if (!member.assignedSector) return null;
    
    const sector = SECTOR_MAPPING[member.assignedSector as keyof typeof SECTOR_MAPPING];
    const basePerformance = member.stats.impact || 70;
    const sectorBonus = sector ? sector.incomeBoost * 100 : 0;
    const totalPerformance = Math.min(100, basePerformance + sectorBonus * 0.3);
    
    // Calculate monthly contribution as 1.1x to 5x of company's monthly business income
    const companyMonthlyIncome = financialData.businessRevenue || 50000; // Default if no business revenue yet
    const memberImpact = member.stats.impact || 70; // Member's impact score (0-100)
    const sectorMultiplier = sector ? (1 + sector.incomeBoost) : 1; // Sector bonus multiplier
    
    // Calculate contribution multiplier based on member performance (1.1x to 5x range)
    const baseMultiplier = 1.1; // Minimum multiplier
    const maxMultiplier = 5.0;   // Maximum multiplier
    
    // Performance factor: higher impact = higher multiplier
    const performanceFactor = (memberImpact / 100) * sectorMultiplier;
    const contributionMultiplier = baseMultiplier + (performanceFactor * (maxMultiplier - baseMultiplier));
    
    const monthlyContribution = Math.round(companyMonthlyIncome * contributionMultiplier);
    
    return {
      sector: sector,
      performance: Math.round(totalPerformance),
      monthlyContribution: monthlyContribution,
      growthContribution: Math.round((basePerformance / 100) * 2.5), // Percentage contribution to company growth
      role: getSectorRole(member.assignedSector, member.role)
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

  const assignedMembers = teamMembers.filter(member => member.assignedSector);
  const unassignedMembers = teamMembers.filter(member => !member.assignedSector);

  const totalMonthlyContribution = assignedMembers.reduce((sum, member) => {
    const performance = calculateSectorPerformance(member);
    return sum + (performance?.monthlyContribution || 0);
  }, 0);

  const averagePerformance = assignedMembers.length > 0 
    ? Math.round(assignedMembers.reduce((sum, member) => {
        const performance = calculateSectorPerformance(member);
        return sum + (performance?.performance || 0);
      }, 0) / assignedMembers.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0ead6] to-[#f8f4e8] p-2 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="text-blue-600 mr-3" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-[#3a3a3a]">Team Performance</h1>
            <p className="text-sm text-gray-600">Monitor your team's sector performance and contributions</p>
          </div>
        </div>
        <Button
          onClick={onNavigateToTeamManagement}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <UserCog className="mr-2" size={16} />
          Manage Team
        </Button>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Team</p>
                <p className="text-2xl font-bold text-blue-600">{teamMembers.length}</p>
              </div>
              <Users className="text-blue-500" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned to Sectors</p>
                <p className="text-2xl font-bold text-green-600">{assignedMembers.length}</p>
              </div>
              <Building className="text-green-500" size={24} />
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

      {/* Team Members Performance */}
      <div className="space-y-6">
        {/* Assigned Members */}
        {assignedMembers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-[#3a3a3a] mb-4 flex items-center">
              <Building className="mr-2 text-green-600" size={20} />
              Sector-Assigned Team Members ({assignedMembers.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {assignedMembers.map((member) => {
                const performance = calculateSectorPerformance(member);
                if (!performance) return null;

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
                        <Badge className={`${performance.sector?.color} text-white`}>
                          {performance.sector?.icon} {performance.sector?.name}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {/* Sector Role */}
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-purple-700 mb-1">Sector Role:</p>
                          <p className="text-sm text-purple-600">{performance.role}</p>
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
                            <p className="font-medium">
                              {member.experience} year{member.experience !== 1 ? 's' : ''}
                            </p>
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
          </div>
        )}

        {/* Unassigned Members */}
        {unassignedMembers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-[#3a3a3a] mb-4 flex items-center">
              <Users className="mr-2 text-orange-600" size={20} />
              Unassigned Team Members ({unassignedMembers.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {unassignedMembers.map((member) => (
                <Card key={member.id} className="bg-white border-2 border-dashed border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#3a3a3a]">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.seniority} {member.role}</p>
                          <p className="text-xs text-orange-600 mt-1">Not assigned to any sector</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={onNavigateToTeamManagement}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                    
                    <div className="mt-3 text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-gray-600">Monthly Salary:</span>
                          <p className="font-medium text-green-600">{formatIndianCurrency(member.salary/12)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Potential:</span>
                          <p className="font-medium text-blue-600">{member.stats.impact}% Impact</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Team Members */}
        {teamMembers.length === 0 && (
          <Card className="bg-white">
            <CardContent className="p-8 text-center">
              <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No Team Members</h2>
              <p className="text-gray-500 mb-4">Start building your dream team by hiring your first employee!</p>
              <Button 
                onClick={onNavigateToTeamManagement}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <UserCog className="mr-2" size={16} />
                Start Hiring
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeamPerformanceSection;