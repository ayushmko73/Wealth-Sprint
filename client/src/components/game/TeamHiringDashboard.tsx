import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { formatIndianCurrency } from '@/lib/utils';
import { 
  ExecutiveIcon, 
  SalesMarketingIcon, 
  FinancialIcon, 
  ConsultantIcon, 
  ProductDesignIcon, 
  LegalIcon, 
  HumanResourcesIcon,
  ExperienceIcon,
  ImpactIcon,
  SalaryIcon,
  DomainsIcon,
  MenuIcon,
  CloseIcon
} from '@/assets/icons';

// Sector definitions with detailed information
const SECTORS = {
  "Logistics": { owned: false, profit: 0, linkedEmployees: [] },
  "Education": { owned: false, profit: 0, linkedEmployees: [] },
  "SaaS": { owned: false, profit: 0, linkedEmployees: [] },
  "Real Estate": { owned: false, profit: 0, linkedEmployees: [] },
  "Fast Food Chains": { owned: false, profit: 0, linkedEmployees: [] },
  "E-commerce": { owned: false, profit: 0, linkedEmployees: [] },
  "Healthcare": { owned: false, profit: 0, linkedEmployees: [] },
  "Fintech": { owned: false, profit: 0, linkedEmployees: [] },
  "Manufacturing": { owned: false, profit: 0, linkedEmployees: [] }
};

// Department configuration with roles and sector connections
const DEPARTMENTS = {
  "Executive": {
    color: "#2e7d32",
    icon: ExecutiveIcon,
    roles: [
      { name: "Chief Executive Officer (CEO)", baseSalary: 2500000, roleId: "ceo", sectors: ["Strategic Planning", "Leadership", "Vision"] },
      { name: "Chief Operating Officer (COO)", baseSalary: 2200000, roleId: "coo", sectors: ["Operations", "Logistics", "Management"] },
      { name: "Chief Technology Officer (CTO)", baseSalary: 2400000, roleId: "cto", sectors: ["Technology", "Innovation", "AI"] },
      { name: "Chief Strategy Officer (CSO)", baseSalary: 2100000, roleId: "cso", sectors: ["Strategy", "Analytics", "Planning"] },
      { name: "Chief Growth Officer (CGO)", baseSalary: 2000000, roleId: "cgo", sectors: ["Growth", "Expansion", "Markets"] },
    ]
  },
  "Sales & Marketing": {
    color: "#d32f2f",
    icon: SalesMarketingIcon,
    roles: [
      { name: "Marketing Director", baseSalary: 1500000, roleId: "marketing_director", sectors: ["Digital Marketing", "Campaigns", "Branding"] },
      { name: "Sales Head", baseSalary: 1400000, roleId: "sales_head", sectors: ["Sales", "Client Relations", "Revenue"] },
      { name: "Brand Manager", baseSalary: 1200000, roleId: "brand_manager", sectors: ["Brand Strategy", "Creative", "Design"] },
      { name: "Social Media Strategist", baseSalary: 1000000, roleId: "social_media_strategist", sectors: ["Social Media", "Content", "Engagement"] },
      { name: "Customer Acquisition Lead", baseSalary: 1300000, roleId: "customer_acquisition_lead", sectors: ["Lead Generation", "Conversion", "Growth"] },
    ]
  },
  "Financial Management": {
    color: "#1976d2",
    icon: FinancialIcon,
    roles: [
      { name: "Chief Financial Officer (CFO)", baseSalary: 2000000, roleId: "cfo", sectors: ["Financial Planning", "Budgeting", "Investment"] },
      { name: "Financial Analyst", baseSalary: 1100000, roleId: "financial_analyst", sectors: ["Analysis", "Reporting", "Forecasting"] },
      { name: "Investment Manager", baseSalary: 1600000, roleId: "investment_manager", sectors: ["Portfolio Management", "Risk", "Returns"] },
      { name: "Budget Controller", baseSalary: 1200000, roleId: "budget_controller", sectors: ["Budget Control", "Cost Management", "Optimization"] },
      { name: "Accountant", baseSalary: 900000, roleId: "accountant", sectors: ["Accounting", "Tax", "Compliance"] },
    ]
  },
  "Consultant": {
    color: "#7b1fa2",
    icon: ConsultantIcon,
    roles: [
      { name: "Business Consultant", baseSalary: 1400000, roleId: "business_consultant", sectors: ["Business Strategy", "Process", "Efficiency"] },
      { name: "Startup Advisor", baseSalary: 1300000, roleId: "startup_advisor", sectors: ["Startups", "Scaling", "Innovation"] },
      { name: "Strategy Consultant", baseSalary: 1500000, roleId: "strategy_consultant", sectors: ["Strategic Planning", "Market Entry", "Growth"] },
      { name: "Market Research Expert", baseSalary: 1200000, roleId: "market_research_expert", sectors: ["Market Analysis", "Consumer Insights", "Trends"] },
      { name: "Operational Analyst", baseSalary: 1100000, roleId: "operational_analyst", sectors: ["Operations", "Data Analysis", "Performance"] },
    ]
  },
  "Product Design": {
    color: "#0288d1",
    icon: ProductDesignIcon,
    roles: [
      { name: "Head of Product", baseSalary: 1800000, roleId: "head_of_product", sectors: ["Product Strategy", "Roadmap", "Vision"] },
      { name: "UX/UI Designer", baseSalary: 1300000, roleId: "ux_ui_designer", sectors: ["User Experience", "Interface Design", "Prototyping"] },
      { name: "Product Manager", baseSalary: 1500000, roleId: "product_manager", sectors: ["Product Development", "Requirements", "Launch"] },
      { name: "Innovation Specialist", baseSalary: 1400000, roleId: "innovation_specialist", sectors: ["Innovation", "Research", "Emerging Tech"] },
      { name: "Prototype Architect", baseSalary: 1600000, roleId: "prototype_architect", sectors: ["Prototyping", "Architecture", "Development"] },
    ]
  },
  "Legal & Compliance": {
    color: "#5d4037",
    icon: LegalIcon,
    roles: [
      { name: "Chief Legal Officer (CLO)", baseSalary: 1900000, roleId: "clo", sectors: ["Legal Strategy", "Compliance", "Risk Management"] },
      { name: "Corporate Lawyer", baseSalary: 1600000, roleId: "corporate_lawyer", sectors: ["Corporate Law", "Contracts", "Mergers"] },
      { name: "Regulatory Compliance Officer", baseSalary: 1300000, roleId: "regulatory_compliance_officer", sectors: ["Regulatory", "Compliance", "Audits"] },
      { name: "IP & Trademark Specialist", baseSalary: 1400000, roleId: "ip_trademark_specialist", sectors: ["Intellectual Property", "Patents", "Trademarks"] },
      { name: "Contract Manager", baseSalary: 1200000, roleId: "contract_manager", sectors: ["Contract Management", "Negotiations", "Legal Review"] },
    ]
  },
  "Human Resources": {
    color: "#e64a19",
    icon: HumanResourcesIcon,
    roles: [
      { name: "HR Manager", baseSalary: 1400000, roleId: "hr_manager", sectors: ["HR Strategy", "People Management", "Culture"] },
      { name: "Talent Acquisition Specialist", baseSalary: 1200000, roleId: "talent_acquisition_specialist", sectors: ["Recruitment", "Talent Sourcing", "Hiring"] },
      { name: "People Experience Lead", baseSalary: 1300000, roleId: "people_experience_lead", sectors: ["Employee Experience", "Engagement", "Retention"] },
      { name: "Learning & Development Head", baseSalary: 1350000, roleId: "learning_development_head", sectors: ["Training", "Development", "Skills"] },
      { name: "Payroll & Benefits Coordinator", baseSalary: 1000000, roleId: "payroll_benefits_coordinator", sectors: ["Payroll", "Benefits", "Compensation"] },
    ]
  },
};

interface TeamHiringDashboardProps {
  onClose: () => void;
}

export default function TeamHiringDashboard({ onClose }: TeamHiringDashboardProps) {
  const { 
    teamMembers, 
    financialData, 
    hireEmployee, 
    addGameEvent,
    gainClarityXP 
  } = useWealthSprintGame();

  const [selectedDepartment, setSelectedDepartment] = useState<string>("Executive");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const activeTeamMembers = teamMembers.filter(member => member.isActive);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);
  const totalTeamCost = activeTeamMembers.reduce((sum, member) => sum + (member.salary || 0), 0);

  const handleDepartmentSelect = (dept: string) => {
    setSelectedDepartment(dept);
  };

  const handleHireEmployee = (role: {roleId: string, name: string, baseSalary: number, sectors: string[]}, department: string) => {
    const monthlySalary = Math.floor(role.baseSalary / 12);
    
    if (financialData.bankBalance < monthlySalary) {
      addGameEvent({
        id: `hire_failed_${Date.now()}`,
        type: 'warning',
        title: 'Insufficient Funds',
        description: `❌ Insufficient Balance to hire ${role.name}. Need ₹${monthlySalary.toLocaleString()}/month.`,
        timestamp: new Date()
      });
      return;
    }

    // Generate random experience between 10-95
    const experience = Math.floor(Math.random() * (95 - 10 + 1)) + 10;
    const actualMonthlySalary = Math.floor(monthlySalary * (experience / 100));
    
    // Generate random name for the employee
    const names = [
      "Arjun", "Priya", "Rahul", "Anita", "Vikram", "Sneha", "Aditya", "Kavya",
      "Rohan", "Meera", "Amit", "Nisha", "Karan", "Pooja", "Sanjay", "Divya"
    ];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    const memberId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Hire the employee
    hireEmployee(
      memberId, 
      randomName, 
      role.name, 
      actualMonthlySalary, 
      department,
      role.roleId
    );
    
    const impactedSectors = role.sectors || [];
    gainClarityXP(10, 'hiring employee');
    addGameEvent({
      id: `hire_success_${Date.now()}`,
      type: 'achievement',
      title: 'New Team Member',
      description: `🎉 Hired ${randomName} as ${role.name} for ₹${actualMonthlySalary.toLocaleString()}/month (${experience}% experience). Will boost ${impactedSectors.join(', ')} sectors.`,
      timestamp: new Date()
    });
  };

  const { currentWeek } = useWealthSprintGame();

  // Progress bar component
  const ProgressBar = ({ percentage }: { percentage: number }) => {
    const blocks = 10;
    const filledBlocks = Math.round((percentage / 100) * blocks);
    
    return (
      <div className="flex items-center gap-2">
        <div className="flex">
          {Array.from({ length: blocks }).map((_, i) => (
            <span
              key={i}
              className={`text-sm ${i < filledBlocks ? 'text-gray-800' : 'text-gray-400'}`}
            >
              ▰
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-600">{percentage}%</span>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-auto" 
      style={{ 
        backgroundColor: 'rgba(229, 222, 202, 0.15)',
        backdropFilter: 'blur(5px)'
      }}
    >
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-20 px-6 py-4 border-b shadow-sm" style={{ backgroundColor: 'rgba(229, 222, 202, 0.9)', borderBottomColor: '#d0c9b5' }}>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-800">Elite Team</div>
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <Button
                onClick={() => setSidebarOpen(true)}
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <MenuIcon />
                <span>Departments</span>
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:bg-gray-100"
            >
              <CloseIcon />
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Department Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full w-80 z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          backgroundColor: 'rgba(229, 222, 202, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="p-6 pt-24">
          <div className="space-y-3">
            {Object.entries(DEPARTMENTS).map(([deptName, dept]) => {
              const IconComponent = dept.icon;
              return (
                <button
                  key={deptName}
                  onClick={() => {
                    setSelectedDepartment(deptName);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    selectedDepartment === deptName
                      ? 'bg-white/20 text-gray-800 font-semibold shadow-md'
                      : 'text-gray-700 hover:bg-white/10 hover:text-gray-900'
                  }`}
                >
                  <div style={{ color: dept.color }}>
                    <IconComponent />
                  </div>
                  <span className="text-base">{deptName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Department Roles */}
      <div className="p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {DEPARTMENTS[selectedDepartment as keyof typeof DEPARTMENTS]?.roles.map((role: {roleId: string, name: string, baseSalary: number, sectors: string[]}, index: number) => {
            // Generate consistent data using role ID as seed
            const seedValue = role.roleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const experience = (seedValue % 8) + 3; // 3-10 scale
            const monthlySalary = Math.floor(role.baseSalary / 12);
            const adjustedSalary = Math.floor(monthlySalary * (1 + experience / 10));
            const impactScore = ((seedValue * 7) % 40) + 60; // 60-100 range
            const impactLevel = impactScore >= 80 ? 'High' : impactScore >= 70 ? 'Medium' : 'Low';
            const isAlreadyHired = activeTeamMembers.some(member => member.roleId === role.roleId);
            const departmentColor = DEPARTMENTS[selectedDepartment as keyof typeof DEPARTMENTS].color;

            // Format salary in K format (₹X.XK/mo)
            const formatSalary = (amount: number): string => {
              if (amount >= 1000) {
                return `₹${Math.round(amount / 1000)}K/mo`;
              }
              return `₹${amount}/mo`;
            };

            return (
              <Card
                key={role.roleId}
                className="border-0 transition-all duration-200 hover:shadow-xl"
                style={{ 
                  backgroundColor: 'rgba(242, 236, 219, 0.1)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px'
                }}
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* Role Title */}
                    <div className="mb-4">
                      <h3 
                        className="text-xl font-bold leading-tight" 
                        style={{ color: departmentColor }}
                      >
                        {role.name}
                      </h3>
                    </div>

                    {/* Metrics Row 1 */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ExperienceIcon />
                        <span className="text-sm text-gray-800 font-medium">Experience: {experience}/10</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ImpactIcon />
                        <span className="text-sm text-gray-800 font-medium">Impact: {impactLevel}</span>
                      </div>
                    </div>

                    {/* Metrics Row 2 */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <SalaryIcon />
                        <span className="text-sm text-gray-800 font-medium">Salary: {formatSalary(adjustedSalary)}</span>
                      </div>
                    </div>

                    {/* Expertise */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DomainsIcon />
                        <span className="text-sm text-gray-800 font-medium">Expertise:</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {role.sectors.join(', ')}
                      </div>
                    </div>

                    {/* Hire Button */}
                    <div className="flex justify-end pt-3">
                      <Button
                        onClick={() => handleHireEmployee(role, selectedDepartment)}
                        disabled={isAlreadyHired}
                        className="px-6 py-2 text-sm font-normal text-white transition-all duration-200 hover:shadow-md"
                        style={{ 
                          backgroundColor: isAlreadyHired ? '#666' : '#2e7d32',
                          border: 'none',
                          borderRadius: '8px'
                        }}
                      >
                        {isAlreadyHired ? '✓ Hired' : 'Hire Now'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}