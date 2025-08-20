import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  Award,
  DollarSign,
  Star,
  Briefcase,
  Clock,
  Target,
  Zap,
  Building2,
  BarChart3,
  Crown,
  Activity
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { toast } from 'sonner';

interface Employee {
  id: string;
  name: string;
  role: string;
  sector: string;
  experience: number;
  performance: number;
  salary: number;
  hired: boolean;
}

export default function TeamManagementSection() {
  const { financialData, updateFinancialData } = useWealthSprintGame();
  
  const [activeTab, setActiveTab] = useState('overview');
  
  // Available employees to hire
  const [availableEmployees] = useState<Employee[]>([
    {
      id: 'emp_001',
      name: 'Rajesh Kumar',
      role: 'Operations Manager',
      sector: 'fast_food',
      experience: 5,
      performance: 85,
      salary: 45000,
      hired: false
    },
    {
      id: 'emp_002',
      name: 'Priya Sharma',
      role: 'Software Developer',
      sector: 'tech_startups',
      experience: 3,
      performance: 92,
      salary: 60000,
      hired: false
    },
    {
      id: 'emp_003',
      name: 'Amit Patel',
      role: 'Marketing Specialist',
      sector: 'ecommerce',
      experience: 4,
      performance: 78,
      salary: 40000,
      hired: false
    },
    {
      id: 'emp_004',
      name: 'Dr. Sneha Reddy',
      role: 'Medical Director',
      sector: 'healthcare',
      experience: 8,
      performance: 95,
      salary: 80000,
      hired: false
    },
    {
      id: 'emp_005',
      name: 'Vikram Singh',
      role: 'Chef Manager',
      sector: 'fast_food',
      experience: 6,
      performance: 88,
      salary: 35000,
      hired: false
    },
    {
      id: 'emp_006',
      name: 'Anita Gupta',
      role: 'Tech Lead',
      sector: 'tech_startups',
      experience: 7,
      performance: 90,
      salary: 75000,
      hired: false
    }
  ]);

  const [currentTeam, setCurrentTeam] = useState<Employee[]>([]);
  
  const sectorNames = {
    fast_food: 'Fast Food',
    tech_startups: 'Tech Startups', 
    ecommerce: 'E-commerce',
    healthcare: 'Healthcare'
  };

  const sectorEmojis = {
    fast_food: '🍟',
    tech_startups: '💻',
    ecommerce: '🛒',
    healthcare: '🏥'
  };

  const getRoleIcon = (role: string) => {
    if (role.includes('Manager') || role.includes('Director')) return Crown;
    if (role.includes('Developer') || role.includes('Tech')) return Briefcase;
    if (role.includes('Marketing')) return Target;
    if (role.includes('Chef')) return Star;
    return Users;
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600 bg-green-50';
    if (performance >= 80) return 'text-blue-600 bg-blue-50';
    if (performance >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const hireEmployee = (employeeId: string) => {
    const employee = availableEmployees.find(e => e.id === employeeId);
    if (!employee) return;

    if (financialData.bankBalance < employee.salary) {
      toast.error(`Insufficient funds! Need ₹${employee.salary.toLocaleString()} for monthly salary`);
      return;
    }

    // Deduct first month salary
    updateFinancialData({
      bankBalance: financialData.bankBalance - employee.salary
    });

    // Add to team
    setCurrentTeam(prev => [...prev, { ...employee, hired: true }]);
    
    toast.success(`🎉 Successfully hired ${employee.name}!`);
  };

  const getTeamStats = () => {
    const totalEmployees = currentTeam.length;
    const avgPerformance = totalEmployees > 0 
      ? Math.round(currentTeam.reduce((sum, emp) => sum + emp.performance, 0) / totalEmployees)
      : 0;
    const totalSalaryExpense = currentTeam.reduce((sum, emp) => sum + emp.salary, 0);
    const sectorDistribution = currentTeam.reduce((acc, emp) => {
      acc[emp.sector] = (acc[emp.sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEmployees,
      avgPerformance,
      totalSalaryExpense,
      sectorDistribution
    };
  };

  const stats = getTeamStats();

  return (
    <div className="min-h-screen bg-white">
      {/* Blue Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="px-4 py-4">
          {/* Main Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-15 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Team Management</h1>
                <p className="text-blue-200 text-sm">Build your dream team • Hire, manage, and optimize your workforce</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-15 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 text-white text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Budget: ₹{(financialData.bankBalance / 100000).toFixed(1)}L</span>
              </div>
            </div>
          </div>

          {/* Team Summary */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-blue-200 text-xs">Total Employees</div>
                <div className="text-white font-bold text-lg">{stats.totalEmployees}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Avg Performance</div>
                <div className="text-green-300 font-bold text-lg">{stats.avgPerformance}%</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Monthly Salaries</div>
                <div className="text-yellow-300 font-bold text-lg">₹{(stats.totalSalaryExpense / 1000).toFixed(0)}K</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Active Sectors</div>
                <div className="text-orange-300 font-bold text-lg">{Object.keys(stats.sectorDistribution).length}</div>
              </div>
            </div>
          </div>

          {/* Horizontal Tabs Menu */}
          <div className="bg-blue-700 rounded-lg p-1">
            <div className="flex overflow-x-auto scrollbar-hide gap-1">
              {[
                { id: 'overview', label: 'Overview', icon: Star },
                { id: 'current_team', label: 'Current Team', icon: Users },
                { id: 'hiring', label: 'Hiring', icon: UserPlus },
                { id: 'performance', label: 'Performance', icon: BarChart3 },
                { id: 'sectors', label: 'By Sector', icon: Building2 }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant="ghost"
                    size="sm"
                    className={`flex-shrink-0 transition-all duration-200 ${
                      isActive 
                        ? 'bg-white text-blue-800 hover:bg-white hover:text-blue-800' 
                        : 'bg-transparent text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-700">Team Size</p>
                    <p className="text-lg font-bold text-blue-800">{stats.totalEmployees}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700">Performance</p>
                    <p className="text-lg font-bold text-green-800">{stats.avgPerformance}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-700">Monthly Cost</p>
                    <p className="text-lg font-bold text-purple-800">₹{(stats.totalSalaryExpense / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-orange-700">Sectors</p>
                    <p className="text-lg font-bold text-orange-800">{Object.keys(stats.sectorDistribution).length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sector Distribution */}
            {stats.totalEmployees > 0 && (
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Team Distribution by Sector
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(stats.sectorDistribution).map(([sector, count]) => (
                      <div key={sector} className="text-center p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-2xl mb-1">{sectorEmojis[sector as keyof typeof sectorEmojis]}</div>
                        <div className="text-sm text-gray-600">{sectorNames[sector as keyof typeof sectorNames]}</div>
                        <div className="text-lg font-bold text-blue-600">{count} {count === 1 ? 'employee' : 'employees'}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Current Team Tab */}
        {activeTab === 'current_team' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Current Team ({stats.totalEmployees} employees)
            </h3>
            {currentTeam.length === 0 ? (
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No employees hired yet. Start building your team from the Hiring section!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentTeam.map((employee) => {
                  const RoleIcon = getRoleIcon(employee.role);
                  return (
                    <Card key={employee.id} className="bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:shadow-lg transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <RoleIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                            <p className="text-sm text-gray-600">{employee.role}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sector:</span>
                            <div className="flex items-center gap-1">
                              <span>{sectorEmojis[employee.sector as keyof typeof sectorEmojis]}</span>
                              <span className="font-medium">{sectorNames[employee.sector as keyof typeof sectorNames]}</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Experience:</span>
                            <span className="font-medium">{employee.experience} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Performance:</span>
                            <Badge className={`text-xs ${getPerformanceColor(employee.performance)}`}>
                              {employee.performance}%
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Salary:</span>
                            <span className="font-medium text-green-600">₹{employee.salary.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Hiring Tab */}
        {activeTab === 'hiring' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Available Candidates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableEmployees.filter(emp => !currentTeam.find(t => t.id === emp.id)).map((employee) => {
                const RoleIcon = getRoleIcon(employee.role);
                return (
                  <Card key={employee.id} className="border transition-all hover:shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <RoleIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                          <p className="text-sm text-gray-600">{employee.role}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sector:</span>
                          <div className="flex items-center gap-1">
                            <span>{sectorEmojis[employee.sector as keyof typeof sectorEmojis]}</span>
                            <span className="font-medium">{sectorNames[employee.sector as keyof typeof sectorNames]}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-medium">{employee.experience} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Performance:</span>
                          <Badge className={`text-xs ${getPerformanceColor(employee.performance)}`}>
                            {employee.performance}%
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Salary:</span>
                          <span className="font-medium text-blue-600">₹{employee.salary.toLocaleString()}/month</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => hireEmployee(employee.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={financialData.bankBalance < employee.salary}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Hire Employee
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Team Performance Analysis
            </h3>
            {currentTeam.length === 0 ? (
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No performance data available. Hire employees to see analytics.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-green-600 text-2xl font-bold">{stats.avgPerformance}%</div>
                      <div className="text-green-700 text-sm">Average Performance</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-blue-600 text-2xl font-bold">{currentTeam.filter(e => e.performance >= 90).length}</div>
                      <div className="text-blue-700 text-sm">Top Performers</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-purple-600 text-2xl font-bold">₹{Math.round(stats.totalSalaryExpense / stats.totalEmployees || 0).toLocaleString()}</div>
                      <div className="text-purple-700 text-sm">Avg Salary</div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-4">Performance Distribution</h4>
                    <div className="space-y-3">
                      {currentTeam.map((employee) => (
                        <div key={employee.id} className="flex items-center gap-3">
                          <div className="w-32 text-sm font-medium truncate">{employee.name}</div>
                          <div className="flex-1">
                            <Progress value={employee.performance} className="h-2" />
                          </div>
                          <div className="w-12 text-sm text-right">{employee.performance}%</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Sectors Tab */}
        {activeTab === 'sectors' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Team by Business Sectors
            </h3>
            <div className="space-y-4">
              {Object.entries(sectorNames).map(([sectorId, sectorName]) => {
                const sectorEmployees = currentTeam.filter(emp => emp.sector === sectorId);
                const sectorEmoji = sectorEmojis[sectorId as keyof typeof sectorEmojis];
                
                return (
                  <Card key={sectorId} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{sectorEmoji}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{sectorName}</h4>
                            <p className="text-sm text-gray-600">{sectorEmployees.length} employees</p>
                          </div>
                        </div>
                        {sectorEmployees.length > 0 && (
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Avg Performance</div>
                            <div className="font-bold text-blue-600">
                              {Math.round(sectorEmployees.reduce((sum, emp) => sum + emp.performance, 0) / sectorEmployees.length)}%
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {sectorEmployees.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          No employees in this sector yet
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {sectorEmployees.map((employee) => {
                            const RoleIcon = getRoleIcon(employee.role);
                            return (
                              <div key={employee.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <RoleIcon className="w-4 h-4 text-gray-600" />
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{employee.name}</div>
                                  <div className="text-xs text-gray-600">{employee.role}</div>
                                </div>
                                <Badge className={`text-xs ${getPerformanceColor(employee.performance)}`}>
                                  {employee.performance}%
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}