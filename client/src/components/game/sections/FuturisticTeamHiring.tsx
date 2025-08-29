import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Building2,
  BarChart3,
  Code,
  Palette,
  Database,
  Phone,
  UserCheck,
  Scale,
  Heart,
  Package,
  ChevronDown,
  Filter,
  Search,
  Calendar,
  ArrowUp
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { useTeamManagement } from '@/lib/stores/useTeamManagement';
import { toast } from 'sonner';

// Employee Categories
const employeeCategories = [
  { id: 'business', name: 'Business', icon: Building2, color: 'from-blue-600 to-blue-800' },
  { id: 'finance', name: 'Finance', icon: DollarSign, color: 'from-green-600 to-green-800' },
  { id: 'tech', name: 'Tech', icon: Code, color: 'from-purple-600 to-purple-800' },
  { id: 'operations', name: 'Operations', icon: Target, color: 'from-orange-600 to-orange-800' },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp, color: 'from-pink-600 to-pink-800' },
];

// Employee Roles
const employeeRoles = [
  { id: 'business_analyst', name: 'Business Analyst', category: 'business', icon: BarChart3, baseSalary: 45000 },
  { id: 'financial_advisor', name: 'Financial Advisor', category: 'finance', icon: DollarSign, baseSalary: 55000 },
  { id: 'marketing_strategist', name: 'Marketing Strategist', category: 'marketing', icon: TrendingUp, baseSalary: 50000 },
  { id: 'operations_manager', name: 'Operations Manager', category: 'operations', icon: Target, baseSalary: 60000 },
  { id: 'software_engineer', name: 'Software Engineer', category: 'tech', icon: Code, baseSalary: 70000 },
  { id: 'ui_ux_designer', name: 'UI/UX Designer', category: 'tech', icon: Palette, baseSalary: 48000 },
  { id: 'data_scientist', name: 'Data Scientist', category: 'tech', icon: Database, baseSalary: 75000 },
  { id: 'sales_executive', name: 'Sales Executive', category: 'business', icon: Phone, baseSalary: 42000 },
  { id: 'hr_specialist', name: 'HR Specialist', category: 'operations', icon: UserCheck, baseSalary: 46000 },
  { id: 'legal_consultant', name: 'Legal Consultant', category: 'business', icon: Scale, baseSalary: 65000 },
  { id: 'customer_success', name: 'Customer Success Manager', category: 'operations', icon: Heart, baseSalary: 52000 },
  { id: 'product_manager', name: 'Product Manager', category: 'business', icon: Package, baseSalary: 68000 },
];

// Seniority levels
const seniorityLevels = [
  { id: 'new_member', name: 'New Member', yearsRequired: 0, salaryMultiplier: 1.0, color: 'bg-gray-600' },
  { id: 'junior', name: 'Junior', yearsRequired: 1, salaryMultiplier: 1.3, color: 'bg-blue-600' },
  { id: 'senior', name: 'Senior', yearsRequired: 5, salaryMultiplier: 1.8, color: 'bg-purple-600' },
  { id: 'veteran', name: 'Veteran', yearsRequired: 10, salaryMultiplier: 2.5, color: 'bg-yellow-600' },
];

// Names
const firstNames = [
  'Aarav', 'Ishaan', 'Neel', 'Ruhan', 'Tanmay', 'Viren', 'Reyansh', 'Devika', 'Meera', 'Kavya',
  'Arjun', 'Rohan', 'Karan', 'Vikram', 'Aditya', 'Priya', 'Ananya', 'Riya', 'Shreya', 'Pooja',
  'Rahul', 'Amit', 'Suresh', 'Rajesh', 'Deepak', 'Neha', 'Sunita', 'Rekha', 'Geeta', 'Sonia',
  'Akash', 'Nitin', 'Sanjay', 'Manoj', 'Vinod', 'Seema', 'Radha', 'Kiran', 'Lata', 'Maya',
  'Harsh', 'Gaurav', 'Yogesh', 'Ramesh', 'Sunil', 'Kavita', 'Usha', 'Sushma', 'Nisha', 'Parul'
];

const surnames = [
  'Sharma', 'Mehta', 'Kapoor', 'Iyer', 'Raghavan', 'Sinha', 'Deshmukh', 'Chauhan', 'Oberoi', 'Malhotra',
  'Gupta', 'Singh', 'Kumar', 'Verma', 'Agarwal', 'Jain', 'Patel', 'Shah', 'Modi', 'Thakur',
  'Yadav', 'Reddy', 'Nair', 'Pillai', 'Menon', 'Bhat', 'Rao', 'Prasad', 'Mishra', 'Tiwari',
  'Pandey', 'Saxena', 'Bansal', 'Mittal', 'Agnihotri', 'Bhardwaj', 'Chopra', 'Dhawan', 'Khanna', 'Sethi',
  'Bajaj', 'Jindal', 'Khurana', 'Mahajan', 'Nagpal', 'Sawhney', 'Trehan', 'Vohra', 'Wadhwa', 'Ahuja'
];

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  roleId: string;
  category: string;
  seniority: string;
  yearsWorked: number;
  experience: number;
  performance: number;
  salary: number;
  isHired: boolean;
}

const generateRandomName = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = surnames[Math.floor(Math.random() * surnames.length)];
  return { firstName, lastName };
};

const calculatePromotionProgress = (yearsWorked: number, currentSeniority: string) => {
  const nextLevel = seniorityLevels.find(level => level.yearsRequired > yearsWorked);
  if (!nextLevel) return { progress: 100, nextLevel: null, yearsToPromotion: 0 };
  
  const progress = (yearsWorked / nextLevel.yearsRequired) * 100;
  const yearsToPromotion = nextLevel.yearsRequired - yearsWorked;
  return { progress, nextLevel, yearsToPromotion };
};

const getPromotedSeniority = (yearsWorked: number) => {
  for (let i = seniorityLevels.length - 1; i >= 0; i--) {
    if (yearsWorked >= seniorityLevels[i].yearsRequired) {
      return seniorityLevels[i].id;
    }
  }
  return 'new_member';
};

export default function FuturisticTeamHiring() {
  const { financialData, updateFinancialData } = useWealthSprintGame();
  const { teamMembers, addTeamMember } = useTeamManagement();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Employee[]>([]);
  const [activeTab, setActiveTab] = useState('hiring');

  // Generate initial employees
  useEffect(() => {
    const pool: Employee[] = [];
    employeeRoles.forEach(role => {
      for (let i = 0; i < 4; i++) {
        const { firstName, lastName } = generateRandomName();
        const employee: Employee = {
          id: `emp_${role.id}_${i}`,
          firstName,
          lastName,
          role: role.name,
          roleId: role.id,
          category: role.category,
          seniority: 'new_member',
          yearsWorked: 0,
          experience: Math.floor(Math.random() * 5) + 1,
          performance: Math.floor(Math.random() * 40) + 60,
          salary: role.baseSalary,
          isHired: false,
        };
        pool.push(employee);
      }
    });
    setEmployees(pool);
  }, []);

  // Auto-promote team members
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTeam(prev => 
        prev.map(emp => {
          const yearsWorked = emp.yearsWorked + (1/365);
          const newSeniority = getPromotedSeniority(yearsWorked);
          const salaryMultiplier = seniorityLevels.find(s => s.id === newSeniority)?.salaryMultiplier || 1;
          const newSalary = newSeniority !== emp.seniority 
            ? Math.round((employeeRoles.find(r => r.id === emp.roleId)?.baseSalary || 0) * salaryMultiplier)
            : emp.salary;
            
          return { ...emp, yearsWorked, seniority: newSeniority, salary: newSalary };
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesCategory = selectedCategory === 'all' || emp.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && !emp.isHired;
  });

  // Hire employee
  const hireEmployee = (employee: Employee) => {
    if (financialData.bankBalance < employee.salary) {
      toast.error(`Insufficient funds! Need ₹${employee.salary.toLocaleString()}`);
      return;
    }

    updateFinancialData({
      bankBalance: financialData.bankBalance - employee.salary,
      monthlyExpenses: financialData.monthlyExpenses + employee.salary,
    });

    const hiredEmployee = { ...employee, isHired: true };
    setCurrentTeam(prev => [...prev, hiredEmployee]);
    setEmployees(prev => prev.map(emp => 
      emp.id === employee.id ? { ...emp, isHired: true } : emp
    ));

    toast.success(`Hired ${employee.firstName} ${employee.lastName}!`);
  };

  // Get category icon
  const getCategoryIcon = (categoryId: string) => {
    const category = employeeCategories.find(cat => cat.id === categoryId);
    return category?.icon || Building2;
  };

  // Get seniority color
  const getSeniorityBadgeColor = (seniority: string) => {
    const level = seniorityLevels.find(s => s.id === seniority);
    return level?.color || 'bg-gray-600';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Blue Header - Matching the image design */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 shadow-xl">
        <div className="px-4 py-6">
          {/* Header Content */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Team Management</h1>
                <p className="text-blue-200 text-sm">Build your dream team • Hire, manage, and optimize your workforce</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-blue-200 text-xs">Budget Available</div>
              <div className="text-white font-bold text-lg">₹{(financialData.bankBalance / 100000).toFixed(2)}L</div>
            </div>
          </div>

          {/* Team Statistics */}
          <div className="bg-white bg-opacity-15 rounded-xl p-4 mb-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{currentTeam.length}</div>
                <div className="text-blue-200 text-xs">Total Employees</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-300">
                  {currentTeam.length > 0 ? Math.round(currentTeam.reduce((sum, emp) => sum + emp.performance, 0) / currentTeam.length) : 0}%
                </div>
                <div className="text-blue-200 text-xs">Avg Performance</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-300">
                  ₹{Math.round(currentTeam.reduce((sum, emp) => sum + emp.salary, 0) / 1000)}K
                </div>
                <div className="text-blue-200 text-xs">Monthly Salaries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-300">
                  {currentTeam.filter(emp => emp.seniority !== 'new_member').length}
                </div>
                <div className="text-blue-200 text-xs">Purchased Sectors</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-blue-700 rounded-lg p-1 w-full">
              <TabsTrigger 
                value="overview" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-800 text-white"
              >
                <Star className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="current_team" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-800 text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Current Team
              </TabsTrigger>
              <TabsTrigger 
                value="hiring" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-800 text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Hiring
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <div className="mt-6">
              <TabsContent value="hiring" className="mt-0">
                <div className="space-y-4">
                  {/* Category Filter */}
                  <div className="relative">
                    <Button
                      onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                      className="bg-blue-700 hover:bg-blue-600 text-white flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      Employee Categories
                      <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} />
                    </Button>
                    
                    {showCategoryMenu && (
                      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-64">
                        <button
                          onClick={() => { setSelectedCategory('all'); setShowCategoryMenu(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors ${
                            selectedCategory === 'all' ? 'bg-blue-50 text-blue-800' : ''
                          }`}
                        >
                          <Users className="w-5 h-5" />
                          <span>All Categories</span>
                        </button>
                        
                        {employeeCategories.map(category => {
                          const Icon = category.icon;
                          return (
                            <button
                              key={category.id}
                              onClick={() => { setSelectedCategory(category.id); setShowCategoryMenu(false); }}
                              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors ${
                                selectedCategory === category.id ? 'bg-blue-50 text-blue-800' : ''
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span>{category.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search employees by name or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="current_team" className="mt-0">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold text-white mb-2">Current Team ({currentTeam.length})</h3>
                  <p className="text-blue-200">Your hired employees will appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="overview" className="mt-0">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold text-white mb-2">Team Overview</h3>
                  <p className="text-blue-200">Team statistics and performance metrics</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Main Content - Available Candidates */}
      {activeTab === 'hiring' && (
        <div className="p-4">
          {/* Available Candidates Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Available Candidates</h2>
          </div>

          {/* Candidate Cards */}
          <div className="space-y-4">
            {filteredEmployees.slice(0, 5).map(employee => {
              const CategoryIcon = getCategoryIcon(employee.category);
              const category = employeeCategories.find(cat => cat.id === employee.category);
              
              return (
                <Card key={employee.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <CategoryIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-gray-600">{employee.role}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span>Experience: {employee.experience} years</span>
                            <span>Performance: {employee.performance}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Salary:</div>
                        <div className="font-bold text-gray-900 mb-3">₹{employee.salary.toLocaleString()}/month</div>
                        <Button
                          onClick={() => hireEmployee(employee)}
                          disabled={financialData.bankBalance < employee.salary}
                          className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 px-6"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Hire Employee
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Team Content */}
      {activeTab === 'current_team' && (
        <div className="p-4">
          {currentTeam.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No team members hired yet</p>
              <p className="text-gray-500">Start building your team by hiring professionals</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {currentTeam.map(employee => {
                const promotionData = calculatePromotionProgress(employee.yearsWorked, employee.seniority);
                const CategoryIcon = getCategoryIcon(employee.category);
                
                return (
                  <Card key={employee.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CategoryIcon className="w-8 h-8 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </h3>
                            <p className="text-gray-600">{employee.role}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={`text-xs ${getSeniorityBadgeColor(employee.seniority)} text-white`}>
                                {seniorityLevels.find(s => s.id === employee.seniority)?.name}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {employee.yearsWorked.toFixed(1)} years
                              </span>
                            </div>
                            {promotionData.nextLevel && (
                              <div className="mt-2">
                                <div className="text-xs text-gray-500 mb-1">
                                  Next: {promotionData.nextLevel.name} ({promotionData.yearsToPromotion.toFixed(1)} years left)
                                </div>
                                <Progress value={promotionData.progress} className="h-2" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Performance</div>
                          <div className="text-xl font-bold text-green-600">{employee.performance}%</div>
                          <div className="text-sm text-gray-500 mt-2">Salary</div>
                          <div className="font-bold text-gray-900">₹{employee.salary.toLocaleString()}/mo</div>
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
    </div>
  );
}