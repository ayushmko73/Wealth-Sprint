import React, { useState, useEffect } from 'react';
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

// Employee Categories with icons
const employeeCategories = [
  { id: 'business', name: 'Business', icon: Building2, color: 'from-blue-600 to-blue-800' },
  { id: 'finance', name: 'Finance', icon: DollarSign, color: 'from-green-600 to-green-800' },
  { id: 'tech', name: 'Tech', icon: Code, color: 'from-purple-600 to-purple-800' },
  { id: 'operations', name: 'Operations', icon: Target, color: 'from-orange-600 to-orange-800' },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp, color: 'from-pink-600 to-pink-800' },
  { id: 'creative', name: 'Creative', icon: Palette, color: 'from-indigo-600 to-indigo-800' },
];

// Employee Roles with 4 seniority levels
const employeeRoles = [
  { id: 'business_analyst', name: 'Business Analyst', category: 'business', icon: BarChart3, baseSalary: 45000 },
  { id: 'financial_advisor', name: 'Financial Advisor', category: 'finance', icon: DollarSign, baseSalary: 55000 },
  { id: 'marketing_strategist', name: 'Marketing Strategist', category: 'marketing', icon: TrendingUp, baseSalary: 50000 },
  { id: 'operations_manager', name: 'Operations Manager', category: 'operations', icon: Target, baseSalary: 60000 },
  { id: 'software_engineer', name: 'Software Engineer', category: 'tech', icon: Code, baseSalary: 70000 },
  { id: 'ui_ux_designer', name: 'UI/UX Designer', category: 'creative', icon: Palette, baseSalary: 48000 },
  { id: 'data_scientist', name: 'Data Scientist', category: 'tech', icon: Database, baseSalary: 75000 },
  { id: 'sales_executive', name: 'Sales Executive', category: 'business', icon: Phone, baseSalary: 42000 },
  { id: 'hr_specialist', name: 'Human Resources Specialist', category: 'operations', icon: UserCheck, baseSalary: 46000 },
  { id: 'legal_consultant', name: 'Legal Consultant', category: 'business', icon: Scale, baseSalary: 65000 },
  { id: 'customer_success', name: 'Customer Success Manager', category: 'operations', icon: Heart, baseSalary: 52000 },
  { id: 'product_manager', name: 'Product Manager', category: 'business', icon: Package, baseSalary: 68000 },
];

// Seniority levels with promotion requirements
const seniorityLevels = [
  { id: 'new_member', name: 'New Member', yearsRequired: 0, salaryMultiplier: 1.0, color: 'bg-gray-600' },
  { id: 'junior', name: 'Junior', yearsRequired: 1, salaryMultiplier: 1.3, color: 'bg-blue-600' },
  { id: 'senior', name: 'Senior', yearsRequired: 5, salaryMultiplier: 1.8, color: 'bg-purple-600' },
  { id: 'veteran', name: 'Veteran', yearsRequired: 10, salaryMultiplier: 2.5, color: 'bg-gold-600' },
];

// Name generator system with 50 first names and 50 surnames
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
  hireDate: Date;
  salary: number;
  performance: number;
  skills: string[];
  isHired: boolean;
}

// Generate random name
const generateRandomName = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = surnames[Math.floor(Math.random() * surnames.length)];
  return { firstName, lastName };
};

// Calculate promotion progress
const calculatePromotionProgress = (yearsWorked: number, currentSeniority: string) => {
  const currentLevel = seniorityLevels.find(level => level.id === currentSeniority);
  const nextLevel = seniorityLevels.find(level => level.yearsRequired > yearsWorked);
  
  if (!nextLevel) return { progress: 100, nextLevel: null, yearsToPromotion: 0 };
  
  const progress = currentLevel ? (yearsWorked / nextLevel.yearsRequired) * 100 : 0;
  const yearsToPromotion = nextLevel.yearsRequired - yearsWorked;
  
  return { progress, nextLevel, yearsToPromotion };
};

// Auto-promote employee based on years worked
const getPromotedSeniority = (yearsWorked: number) => {
  for (let i = seniorityLevels.length - 1; i >= 0; i--) {
    if (yearsWorked >= seniorityLevels[i].yearsRequired) {
      return seniorityLevels[i].id;
    }
  }
  return 'new_member';
};

export default function TeamHiringSection() {
  const { financialData, updateFinancialData } = useWealthSprintGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Employee[]>([]);

  // Generate initial employee pool
  useEffect(() => {
    const generateEmployeePool = () => {
      const pool: Employee[] = [];
      
      // Generate 3-5 employees per role
      employeeRoles.forEach(role => {
        const count = Math.floor(Math.random() * 3) + 3; // 3-5 employees per role
        
        for (let i = 0; i < count; i++) {
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
            hireDate: new Date(),
            salary: role.baseSalary,
            performance: Math.floor(Math.random() * 40) + 60, // 60-100%
            skills: [],
            isHired: false,
          };
          pool.push(employee);
        }
      });
      
      return pool;
    };
    
    setEmployees(generateEmployeePool());
  }, []);

  // Auto-promote employees based on time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTeam(prevTeam => 
        prevTeam.map(employee => {
          const yearsWorked = employee.yearsWorked + (1/365); // Increment daily
          const newSeniority = getPromotedSeniority(yearsWorked);
          const newSalary = newSeniority !== employee.seniority 
            ? Math.round(employeeRoles.find(r => r.id === employee.roleId)?.baseSalary || 0 * 
                (seniorityLevels.find(s => s.id === newSeniority)?.salaryMultiplier || 1))
            : employee.salary;
            
          return {
            ...employee,
            yearsWorked,
            seniority: newSeniority,
            salary: newSalary,
          };
        })
      );
    }, 1000); // Update every second for demo purposes

    return () => clearInterval(interval);
  }, []);

  // Filter employees based on category and search
  const filteredEmployees = employees.filter(employee => {
    const matchesCategory = selectedCategory === 'all' || employee.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && !employee.isHired;
  });

  // Hire employee function
  const hireEmployee = (employee: Employee) => {
    if (financialData.bankBalance < employee.salary) {
      toast.error(`Insufficient funds! Need ₹${employee.salary.toLocaleString()} to hire ${employee.firstName} ${employee.lastName}`);
      return;
    }

    // Deduct hiring cost
    updateFinancialData({
      bankBalance: financialData.bankBalance - employee.salary,
      monthlyExpenses: financialData.monthlyExpenses + employee.salary,
    });

    // Add to team
    const hiredEmployee = {
      ...employee,
      isHired: true,
      hireDate: new Date(),
    };

    setCurrentTeam(prev => [...prev, hiredEmployee]);
    setEmployees(prev => prev.map(emp => 
      emp.id === employee.id ? { ...emp, isHired: true } : emp
    ));

    toast.success(`Successfully hired ${employee.firstName} ${employee.lastName} as ${employee.role}!`);
  };

  // Get category icon
  const getCategoryIcon = (categoryId: string) => {
    const category = employeeCategories.find(cat => cat.id === categoryId);
    return category?.icon || Building2;
  };

  // Get seniority badge color
  const getSeniorityBadgeColor = (seniority: string) => {
    const level = seniorityLevels.find(s => s.id === seniority);
    return level?.color || 'bg-gray-600';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Team Management - Hiring
        </h1>
        <p className="text-slate-400">Build your dream team to scale your business empire</p>
      </div>

      {/* Category Menu Button */}
      <div className="mb-6">
        <div className="relative">
          <Button
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className="bg-slate-800 hover:bg-slate-700 border-slate-600 text-white flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Employee Categories
            <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} />
          </Button>
          
          {showCategoryMenu && (
            <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-10 min-w-64">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setShowCategoryMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors ${
                  selectedCategory === 'all' ? 'bg-slate-700 text-blue-400' : ''
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
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowCategoryMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors ${
                      selectedCategory === category.id ? 'bg-slate-700 text-blue-400' : ''
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
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Available Employees */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-400" />
            Available Talent Pool
          </h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredEmployees.map(employee => {
              const CategoryIcon = getCategoryIcon(employee.category);
              const category = employeeCategories.find(cat => cat.id === employee.category);
              
              return (
                <Card key={employee.id} className="bg-slate-800 border-slate-600 hover:border-slate-500 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category?.color} flex items-center justify-center`}>
                          <CategoryIcon className="w-6 h-6 text-white" />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-white">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-sm text-slate-300">{employee.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${getSeniorityBadgeColor(employee.seniority)} text-white`}>
                              {seniorityLevels.find(s => s.id === employee.seniority)?.name}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                              {employee.performance}% Performance
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-slate-400 mb-2">
                          ₹{employee.salary.toLocaleString()}/mo
                        </div>
                        <Button
                          onClick={() => hireEmployee(employee)}
                          disabled={financialData.bankBalance < employee.salary}
                          className="bg-green-600 hover:bg-green-700 text-white disabled:bg-slate-600"
                        >
                          Hire
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Current Team */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Current Team ({currentTeam.length})
          </h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {currentTeam.map(employee => {
              const CategoryIcon = getCategoryIcon(employee.category);
              const category = employeeCategories.find(cat => cat.id === employee.category);
              const promotionData = calculatePromotionProgress(employee.yearsWorked, employee.seniority);
              
              return (
                <Card key={employee.id} className="bg-slate-800 border-slate-600">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Employee Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${category?.color} flex items-center justify-center`}>
                            <CategoryIcon className="w-5 h-5 text-white" />
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-white text-sm">
                              {employee.firstName} {employee.lastName}
                            </h3>
                            <p className="text-xs text-slate-300">{employee.role}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getSeniorityBadgeColor(employee.seniority)} text-white`}>
                            {seniorityLevels.find(s => s.id === employee.seniority)?.name}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Experience and Salary */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>{employee.yearsWorked.toFixed(1)} years</span>
                        </div>
                        <div className="text-green-400 font-medium">
                          ₹{employee.salary.toLocaleString()}/mo
                        </div>
                      </div>
                      
                      {/* Promotion Progress */}
                      {promotionData.nextLevel && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">
                              Next: {promotionData.nextLevel.name}
                            </span>
                            <span className="text-slate-400">
                              {promotionData.yearsToPromotion.toFixed(1)} years left
                            </span>
                          </div>
                          <Progress 
                            value={promotionData.progress} 
                            className="h-2 bg-slate-700"
                          />
                        </div>
                      )}
                      
                      {promotionData.progress >= 100 && (
                        <div className="flex items-center gap-1 text-xs text-yellow-400">
                          <ArrowUp className="w-3 h-3" />
                          <span>Ready for promotion!</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {currentTeam.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No team members hired yet</p>
                <p className="text-sm">Start building your team by hiring talented professionals</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-white">{currentTeam.length}</div>
            <div className="text-sm text-slate-400">Team Size</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold text-white">
              ₹{currentTeam.reduce((sum, emp) => sum + emp.salary, 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Monthly Payroll</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-white">
              {currentTeam.length > 0 ? Math.round(currentTeam.reduce((sum, emp) => sum + emp.performance, 0) / currentTeam.length) : 0}%
            </div>
            <div className="text-sm text-slate-400">Avg Performance</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-white">
              {currentTeam.filter(emp => emp.seniority !== 'new_member').length}
            </div>
            <div className="text-sm text-slate-400">Experienced Staff</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}