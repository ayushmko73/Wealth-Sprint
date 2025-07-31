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
  CloseIcon,
  MenuIcon
} from '@/assets/icons';

// Department configuration with roles
const DEPARTMENTS = {
  "Executive": {
    color: "#2e7d32",
    emoji: "🔷",
    icon: ExecutiveIcon,
    roles: [
      { 
        name: "Chief Executive Officer (CEO)", 
        title: "Chief Executive Officer (CEO)",
        baseSalary: 2500000, 
        roleId: "ceo", 
        skills: ["Strategic Planning", "Leadership", "Vision"],
        experience: 9,
        impact: "High",
        initials: "CEO"
      },
      { 
        name: "Chief Operating Officer (COO)", 
        title: "Chief Operating Officer (COO)",
        baseSalary: 2200000, 
        roleId: "coo", 
        skills: ["Operations", "Logistics", "Management"],
        experience: 8,
        impact: "High", 
        initials: "COO"
      },
      { 
        name: "Chief Technology Officer (CTO)", 
        title: "Chief Technology Officer (CTO)",
        baseSalary: 2400000, 
        roleId: "cto", 
        skills: ["Technology", "Innovation", "AI"],
        experience: 9,
        impact: "High",
        initials: "CTO"
      },
      { 
        name: "Chief Strategy Officer (CSO)", 
        title: "Chief Strategy Officer (CSO)",
        baseSalary: 2100000, 
        roleId: "cso", 
        skills: ["Strategy", "Analytics", "Planning"],
        experience: 8,
        impact: "High",
        initials: "CSO"
      },
      { 
        name: "Chief Growth Officer (CGO)", 
        title: "Chief Growth Officer (CGO)",
        baseSalary: 2000000, 
        roleId: "cgo", 
        skills: ["Growth", "Expansion", "Markets"],
        experience: 7,
        impact: "Medium",
        initials: "CGO"
      },
    ]
  },
  "Sales & Marketing": {
    color: "#d32f2f",
    emoji: "🔶",
    icon: SalesMarketingIcon,
    roles: [
      { 
        name: "Marketing Director", 
        title: "Marketing Director",
        baseSalary: 1500000, 
        roleId: "marketing_director", 
        skills: ["Digital Marketing", "Campaigns", "Branding"],
        experience: 8,
        impact: "High",
        initials: "MD"
      },
      { 
        name: "Sales Head", 
        title: "Sales Head",
        baseSalary: 1400000, 
        roleId: "sales_head", 
        skills: ["Sales", "Client Relations", "Revenue"],
        experience: 7,
        impact: "High",
        initials: "SH"
      },
      { 
        name: "Brand Manager", 
        title: "Brand Manager",
        baseSalary: 1200000, 
        roleId: "brand_manager", 
        skills: ["Brand Strategy", "Creative", "Design"],
        experience: 6,
        impact: "Medium",
        initials: "BM"
      },
      { 
        name: "Social Media Strategist", 
        title: "Social Media Strategist",
        baseSalary: 1000000, 
        roleId: "social_media_strategist", 
        skills: ["Social Media", "Content", "Engagement"],
        experience: 6,
        impact: "Medium",
        initials: "SMS"
      },
      { 
        name: "Customer Acquisition Lead", 
        title: "Customer Acquisition Lead",
        baseSalary: 1300000, 
        roleId: "customer_acquisition_lead", 
        skills: ["Lead Generation", "Conversion", "Growth"],
        experience: 7,
        impact: "High",
        initials: "CAL"
      },
    ]
  },
  "Financial Management": {
    color: "#1976d2",
    emoji: "💰",
    icon: FinancialIcon,
    roles: [
      { 
        name: "Chief Financial Officer (CFO)", 
        title: "Chief Financial Officer (CFO)",
        baseSalary: 2000000, 
        roleId: "cfo", 
        skills: ["Financial Planning", "Budgeting", "Investment"],
        experience: 8,
        impact: "High",
        initials: "CFO"
      },
      { 
        name: "Financial Analyst", 
        title: "Financial Analyst",
        baseSalary: 1100000, 
        roleId: "financial_analyst", 
        skills: ["Analysis", "Reporting", "Forecasting"],
        experience: 6,
        impact: "Medium",
        initials: "FA"
      },
      { 
        name: "Investment Manager", 
        title: "Investment Manager",
        baseSalary: 1600000, 
        roleId: "investment_manager", 
        skills: ["Portfolio Management", "Risk", "Returns"],
        experience: 7,
        impact: "High",
        initials: "IM"
      },
      { 
        name: "Budget Controller", 
        title: "Budget Controller",
        baseSalary: 1200000, 
        roleId: "budget_controller", 
        skills: ["Budget Control", "Cost Management", "Optimization"],
        experience: 6,
        impact: "Medium",
        initials: "BC"
      },
      { 
        name: "Accountant", 
        title: "Accountant",
        baseSalary: 900000, 
        roleId: "accountant", 
        skills: ["Accounting", "Tax", "Compliance"],
        experience: 5,
        impact: "Medium",
        initials: "ACC"
      },
    ]
  },
  "Consultant": {
    color: "#7b1fa2",
    emoji: "📈",
    icon: ConsultantIcon,
    roles: [
      { 
        name: "Business Consultant", 
        title: "Business Consultant",
        baseSalary: 1400000, 
        roleId: "business_consultant", 
        skills: ["Business Strategy", "Process", "Efficiency"],
        experience: 7,
        impact: "High",
        initials: "BC"
      },
      { 
        name: "Startup Advisor", 
        title: "Startup Advisor",
        baseSalary: 1300000, 
        roleId: "startup_advisor", 
        skills: ["Startups", "Scaling", "Innovation"],
        experience: 8,
        impact: "High",
        initials: "SA"
      },
      { 
        name: "Strategy Consultant", 
        title: "Strategy Consultant",
        baseSalary: 1500000, 
        roleId: "strategy_consultant", 
        skills: ["Strategic Planning", "Market Entry", "Growth"],
        experience: 8,
        impact: "High",
        initials: "SC"
      },
      { 
        name: "Market Research Expert", 
        title: "Market Research Expert",
        baseSalary: 1200000, 
        roleId: "market_research_expert", 
        skills: ["Market Analysis", "Consumer Insights", "Trends"],
        experience: 6,
        impact: "Medium",
        initials: "MRE"
      },
      { 
        name: "Operational Analyst", 
        title: "Operational Analyst",
        baseSalary: 1100000, 
        roleId: "operational_analyst", 
        skills: ["Operations", "Data Analysis", "Performance"],
        experience: 6,
        impact: "Medium",
        initials: "OA"
      },
    ]
  },
  "Product Design": {
    color: "#0288d1",
    emoji: "🧠",
    icon: ProductDesignIcon,
    roles: [
      { 
        name: "Head of Product", 
        title: "Head of Product",
        baseSalary: 1800000, 
        roleId: "head_of_product", 
        skills: ["Product Strategy", "Roadmap", "Vision"],
        experience: 8,
        impact: "High",
        initials: "HOP"
      },
      { 
        name: "UX/UI Designer", 
        title: "UX/UI Designer",
        baseSalary: 1300000, 
        roleId: "ux_ui_designer", 
        skills: ["User Experience", "Interface Design", "Prototyping"],
        experience: 7,
        impact: "High",
        initials: "UXD"
      },
      { 
        name: "Product Manager", 
        title: "Product Manager",
        baseSalary: 1500000, 
        roleId: "product_manager", 
        skills: ["Product Development", "Requirements", "Launch"],
        experience: 7,
        impact: "High",
        initials: "PM"
      },
      { 
        name: "Innovation Specialist", 
        title: "Innovation Specialist",
        baseSalary: 1400000, 
        roleId: "innovation_specialist", 
        skills: ["Innovation", "Research", "Emerging Tech"],
        experience: 7,
        impact: "Medium",
        initials: "IS"
      },
      { 
        name: "Prototype Architect", 
        title: "Prototype Architect",
        baseSalary: 1600000, 
        roleId: "prototype_architect", 
        skills: ["Prototyping", "Architecture", "Development"],
        experience: 8,
        impact: "High",
        initials: "PA"
      },
    ]
  },
  "Legal & Compliance": {
    color: "#5d4037",
    emoji: "⚖️",
    icon: LegalIcon,
    roles: [
      { 
        name: "Chief Legal Officer (CLO)", 
        title: "Chief Legal Officer (CLO)",
        baseSalary: 1900000, 
        roleId: "clo", 
        skills: ["Legal Strategy", "Compliance", "Risk Management"],
        experience: 9,
        impact: "High",
        initials: "CLO"
      },
      { 
        name: "Corporate Lawyer", 
        title: "Corporate Lawyer",
        baseSalary: 1600000, 
        roleId: "corporate_lawyer", 
        skills: ["Corporate Law", "Contracts", "Mergers"],
        experience: 8,
        impact: "High",
        initials: "CL"
      },
      { 
        name: "Regulatory Compliance Officer", 
        title: "Regulatory Compliance Officer",
        baseSalary: 1300000, 
        roleId: "regulatory_compliance_officer", 
        skills: ["Regulatory", "Compliance", "Audits"],
        experience: 7,
        impact: "Medium",
        initials: "RCO"
      },
      { 
        name: "IP & Trademark Specialist", 
        title: "IP & Trademark Specialist",
        baseSalary: 1400000, 
        roleId: "ip_trademark_specialist", 
        skills: ["Intellectual Property", "Patents", "Trademarks"],
        experience: 7,
        impact: "Medium",
        initials: "ITS"
      },
      { 
        name: "Contract Manager", 
        title: "Contract Manager",
        baseSalary: 1200000, 
        roleId: "contract_manager", 
        skills: ["Contract Management", "Negotiations", "Legal Review"],
        experience: 6,
        impact: "Medium",
        initials: "CM"
      },
    ]
  },
  "Human Resources": {
    color: "#e64a19",
    emoji: "👥",
    icon: HumanResourcesIcon,
    roles: [
      { 
        name: "HR Manager", 
        title: "HR Manager",
        baseSalary: 1400000, 
        roleId: "hr_manager", 
        skills: ["HR Strategy", "People Management", "Culture"],
        experience: 7,
        impact: "High",
        initials: "HRM"
      },
      { 
        name: "Talent Acquisition Specialist", 
        title: "Talent Acquisition Specialist",
        baseSalary: 1200000, 
        roleId: "talent_acquisition_specialist", 
        skills: ["Recruitment", "Talent Sourcing", "Hiring"],
        experience: 6,
        impact: "Medium",
        initials: "TAS"
      },
      { 
        name: "People Experience Lead", 
        title: "People Experience Lead",
        baseSalary: 1300000, 
        roleId: "people_experience_lead", 
        skills: ["Employee Experience", "Engagement", "Retention"],
        experience: 7,
        impact: "High",
        initials: "PEL"
      },
      { 
        name: "Learning & Development Head", 
        title: "Learning & Development Head",
        baseSalary: 1350000, 
        roleId: "learning_development_head", 
        skills: ["Training", "Development", "Skills"],
        experience: 7,
        impact: "Medium",
        initials: "LDH"
      },
      { 
        name: "Payroll & Benefits Coordinator", 
        title: "Payroll & Benefits Coordinator",
        baseSalary: 1000000, 
        roleId: "payroll_benefits_coordinator", 
        skills: ["Payroll", "Benefits", "Compensation"],
        experience: 5,
        impact: "Medium",
        initials: "PBC"
      },
    ]
  },
};

interface ModernTeamHiringDashboardProps {
  onClose: () => void;
}

export default function ModernTeamHiringDashboard({ onClose }: ModernTeamHiringDashboardProps) {
  const { 
    teamMembers, 
    financialData, 
    hireEmployee, 
    addGameEvent,
    gainClarityXP 
  } = useWealthSprintGame();

  const [selectedDepartment, setSelectedDepartment] = useState<string>("Executive");
  const [showMenuOverlay, setShowMenuOverlay] = useState(false);
  const [showMenuButton, setShowMenuButton] = useState(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  
  const activeTeamMembers = teamMembers.filter(member => member.isActive);

  // Auto-hide menu button on scroll and close menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowMenuButton(false);
      
      // Close menu overlay if it's open
      if (showMenuOverlay) {
        setShowMenuOverlay(false);
      }
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setShowMenuButton(true);
      }, 1500); // 1.5 seconds
    };

    // Add scroll listener to the main container
    const mainContainer = document.querySelector('div[style*="overflow-auto"]');
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [showMenuOverlay]);

  // Close menu overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (showMenuOverlay && menuOverlayRef.current && !menuOverlayRef.current.contains(event.target as Node)) {
        setShowMenuOverlay(false);
      }
    };

    if (showMenuOverlay) {
      // Use capture phase to ensure we catch the event before other handlers
      document.addEventListener('mousedown', handleClickOutside as EventListener, true);
      document.addEventListener('touchstart', handleClickOutside as EventListener, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside as EventListener, true);
      document.removeEventListener('touchstart', handleClickOutside as EventListener, true);
    };
  }, [showMenuOverlay]);

  const handleHireEmployee = (role: any, department: string) => {
    const monthlySalary = Math.floor(role.baseSalary / 12);
    
    if (financialData.bankBalance < monthlySalary) {
      addGameEvent(`❌ Insufficient Balance to hire ${role.name}. Need ₹${monthlySalary.toLocaleString()}/month.`);
      return;
    }

    // Generate random experience based on the predefined role experience
    const baseExperience = role.experience || 5;
    const experience = Math.max(3, Math.min(10, baseExperience + Math.floor(Math.random() * 3) - 1));
    const actualMonthlySalary = Math.floor(monthlySalary * (0.8 + (experience / 10) * 0.4));
    
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
      department
    );
    
    const impactedSectors = role.skills || [];
    gainClarityXP(10);
    addGameEvent(`🎉 Hired ${randomName} as ${role.name} for ₹${actualMonthlySalary.toLocaleString()}/month (${experience}/10 experience). Will boost ${impactedSectors.slice(0, 2).join(', ')} sectors.`);
  };

  // Employee Card Component
  const EmployeeCard = ({ role, department }: { role: any; department: any }) => {
    const monthlySalary = Math.floor(role.baseSalary / 12);
    const isAlreadyHired = activeTeamMembers.some(member => member.roleId === role.roleId);
    
    // Format salary in K format (₹280K/mo)
    const formatSalary = (amount: number): string => {
      if (amount >= 100000) {
        return `₹${Math.round(amount / 1000)}K/mo`;
      }
      return `₹${amount}/mo`;
    };

    return (
      <Card
        className="border-0 transition-all duration-300 hover:shadow-2xl hover:scale-105"
        style={{ 
          backgroundColor: 'rgba(242, 236, 219, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent className="p-6">
          <div className="flex">
            {/* Left Side - 70% */}
            <div className="flex-1 pr-4">
              {/* Department Header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{department.emoji}</span>
                <span className="text-sm font-medium text-gray-600">{selectedDepartment}</span>
              </div>

              {/* Employee Name & Title */}
              <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">
                {role.title}
              </h3>

              {/* Experience */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">⭐</span>
                <span className="text-sm text-gray-700">Experience: {role.experience}/10</span>
              </div>

              {/* Impact */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">📈</span>
                <span className="text-sm text-gray-700">Impact: {role.impact}</span>
              </div>

              {/* Salary */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">💰</span>
                <span className="text-sm text-gray-700">Salary: {formatSalary(monthlySalary)}</span>
              </div>

              {/* Expertise Tags */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">🏷️</span>
                  <span className="text-sm text-gray-700">Expertise:</span>
                </div>
                <div className="text-xs text-gray-600 line-clamp-2">
                  {role.skills.join(', ')}
                </div>
              </div>
            </div>

            {/* Right Side - 30% */}
            <div className="flex flex-col items-center justify-between w-32">
              {/* Profile Photo / Initials */}
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-sm mb-3"
                style={{ backgroundColor: department.color }}
              >
                {role.initials}
              </div>

              {/* Hire Button */}
              <Button
                onClick={() => handleHireEmployee(role, selectedDepartment)}
                disabled={isAlreadyHired}
                className="px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:shadow-lg rounded-lg"
                style={{ 
                  backgroundColor: isAlreadyHired ? '#666' : '#2e7d32',
                  border: 'none',
                  width: '100%'
                }}
              >
                {isAlreadyHired ? '✓ Hired' : 'Hire Now'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-auto" 
      style={{ 
        backgroundColor: 'rgba(229, 222, 202, 0.15)',
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Top Navigation Bar */}
      <header 
        className="sticky top-0 z-20 px-6 py-4 border-b shadow-sm" 
        style={{ 
          backgroundColor: 'rgba(229, 222, 202, 0.9)', 
          borderBottomColor: '#d0c9b5' 
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Elite Team</h1>
            <p className="text-sm text-gray-600">Build your dream team to achieve financial independence</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Menu Button with auto-hide on scroll */}
            <Button
              onClick={() => setShowMenuOverlay(true)}
              variant="ghost"
              size="sm"
              className={`text-gray-700 hover:bg-gray-100 p-2 transition-all duration-300 ${
                showMenuButton ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <MenuIcon />
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:bg-gray-100 p-2"
            >
              <CloseIcon />
            </Button>
          </div>
        </div>
      </header>

      {/* Menu Overlay Panel */}
      {showMenuOverlay && (
        <>
          {/* Backdrop - clickable area to close menu */}
          <div 
            className="fixed inset-0 z-30 bg-black bg-opacity-20"
            onClick={() => setShowMenuOverlay(false)}
          />
          
          {/* Menu Panel */}
          <div 
            ref={menuOverlayRef}
            className="fixed right-0 top-0 h-full w-80 z-40 transform transition-transform duration-300 ease-in-out shadow-2xl"
            style={{ 
              backgroundColor: 'rgba(229, 222, 202, 0.05)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="p-6 pt-20">
              <div className="space-y-4">
                {[
                  "Executive",
                  "Sales & Marketing", 
                  "Financial Management",
                  "Consultant",
                  "Product Design",
                  "Legal & Compliance",
                  "Human Resources"
                ].map((deptName) => {
                  const dept = DEPARTMENTS[deptName];
                  if (!dept) return null;
                  
                  return (
                    <button
                      key={deptName}
                      onClick={() => {
                        setSelectedDepartment(deptName);
                        setShowMenuOverlay(false);
                      }}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                        selectedDepartment === deptName
                          ? 'bg-white/30 font-semibold shadow-md'
                          : 'hover:bg-white/20'
                      }`}
                      style={{ 
                        color: '#1a1a1a', 
                        opacity: 1,
                        fontSize: '16px',
                        fontWeight: selectedDepartment === deptName ? '600' : '500',
                        textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                      }}
                    >
                      <span className="text-lg">{dept.emoji}</span>
                      <span>{deptName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Department Tabs */}
      <div 
        className="sticky top-[73px] z-10 px-6 py-3 border-b"
        style={{ 
          backgroundColor: 'rgba(229, 222, 202, 0.9)', 
          borderBottomColor: '#d0c9b5' 
        }}
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Object.entries(DEPARTMENTS).map(([deptName, dept]) => (
            <button
              key={deptName}
              onClick={() => setSelectedDepartment(deptName)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedDepartment === deptName
                  ? 'text-white shadow-lg'
                  : 'text-gray-700 bg-white/50 hover:bg-white/70'
              }`}
              style={{
                backgroundColor: selectedDepartment === deptName ? dept.color : undefined
              }}
            >
              <span>{dept.emoji}</span>
              <span>{deptName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Employee Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {DEPARTMENTS[selectedDepartment]?.roles.map((role) => (
            <EmployeeCard 
              key={role.roleId} 
              role={role} 
              department={DEPARTMENTS[selectedDepartment]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}