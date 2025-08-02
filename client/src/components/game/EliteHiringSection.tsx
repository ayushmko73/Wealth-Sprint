import React, { useState, useMemo } from 'react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  DollarSign, 
  Heart, 
  TrendingUp, 
  Users, 
  X,
  ArrowLeft 
} from 'lucide-react';
import { toast } from 'sonner';

interface Role {
  name: string;
  salary: number;
  impact: 'Low' | 'Medium' | 'High';
  description: string;
  education: string;
  skills: string[];
  experienceYears: number;
  previousCompanies: string[];
  personalNote: string;
}

interface Department {
  name: string;
  icon: React.ReactNode;
  roles: Role[];
}

interface Candidate {
  name: string;
  age: number;
  role: Role;
}

// Pool of unique candidate names
const CANDIDATE_NAMES = [
  "Aarav Mehta",
  "Rohan Kapoor", 
  "Neha Verma",
  "Ananya Sharma",
  "Karan Joshi",
  "Ishita Rao",
  "Siddharth Bansal",
  "Meera Iyer",
  "Arjun Malhotra",
  "Pooja Nair",
  "Vikram Sethi",
  "Tanvi Kulkarni",
  "Rajesh Gupta",
  "Priya Singh"
];

const DEPARTMENTS: Department[] = [
  {
    name: 'Finance & Strategy',
    icon: <DollarSign size={20} className="text-[#d4af37]" />,
    roles: [
      {
        name: 'Financial Advisor',
        salary: 10000,
        impact: 'High',
        description: 'Improves investment returns.',
        education: 'MBA in Finance from IIM',
        skills: ['Portfolio Management', 'Risk Assessment', 'Financial Planning', 'Investment Strategy'],
        experienceYears: 6,
        previousCompanies: ['HDFC Bank', 'ICICI Securities'],
        personalNote: 'Passionate about optimizing wealth growth and reducing financial risks for clients.'
      },
      {
        name: 'Risk Analyst',
        salary: 8000,
        impact: 'Medium',
        description: 'Reduces losses in risky deals.',
        education: 'CA with Risk Management Certification',
        skills: ['Risk Modeling', 'Data Analysis', 'Compliance', 'Market Research'],
        experienceYears: 4,
        previousCompanies: ['Kotak Mahindra', 'Axis Bank'],
        personalNote: 'Dedicated to identifying and mitigating financial risks through comprehensive analysis.'
      }
    ]
  },
  {
    name: 'Mental Wellness',
    icon: <Heart size={20} className="text-red-500" />,
    roles: [
      {
        name: 'Mental Wellness Coach',
        salary: 7000,
        impact: 'High',
        description: 'Reduces stress over time.',
        education: 'MSc Psychology with Wellness Coaching Certification',
        skills: ['Stress Management', 'Counseling', 'Mindfulness', 'Team Building'],
        experienceYears: 5,
        previousCompanies: ['Apollo Hospitals', 'Fortis Healthcare'],
        personalNote: 'Committed to enhancing workplace well-being and mental health for sustainable productivity.'
      },
      {
        name: 'Productivity Mentor',
        salary: 5000,
        impact: 'Medium',
        description: 'Boosts peace and focus.',
        education: 'MBA in HR with Productivity Training Certification',
        skills: ['Time Management', 'Process Optimization', 'Training', 'Performance Coaching'],
        experienceYears: 3,
        previousCompanies: ['TCS', 'Infosys'],
        personalNote: 'Focused on maximizing team efficiency through proven productivity methodologies.'
      }
    ]
  },
  {
    name: 'Operations & Growth',
    icon: <TrendingUp size={20} className="text-green-600" />,
    roles: [
      {
        name: 'Operations Manager',
        salary: 9000,
        impact: 'Medium',
        description: 'Speeds up business deals.',
        education: 'MBA in Operations Management',
        skills: ['Process Management', 'Vendor Relations', 'Quality Control', 'Team Leadership'],
        experienceYears: 7,
        previousCompanies: ['Flipkart', 'Amazon India'],
        personalNote: 'Expert in streamlining operations and accelerating business processes for maximum efficiency.'
      },
      {
        name: 'Marketing Lead',
        salary: 12000,
        impact: 'High',
        description: 'Increases customer reach.',
        education: 'MBA in Marketing with Digital Certification',
        skills: ['Digital Marketing', 'Brand Strategy', 'Customer Acquisition', 'Campaign Management'],
        experienceYears: 8,
        previousCompanies: ['Zomato', 'Paytm'],
        personalNote: 'Passionate about building brand presence and driving customer growth through innovative marketing strategies.'
      }
    ]
  }
];

interface EliteHiringSectionProps {
  onClose?: () => void;
}

const EliteHiringSection: React.FC<EliteHiringSectionProps> = ({ onClose }) => {
  const { financialData, updateFinancialData, playerStats, updatePlayerStats } = useWealthSprintGame();
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Generate unique names for roles
  const candidateNames = useMemo(() => {
    const allRoles = DEPARTMENTS.flatMap(dept => dept.roles);
    const shuffledNames = [...CANDIDATE_NAMES].sort(() => Math.random() - 0.5);
    const nameMap = new Map();
    
    allRoles.forEach((role, index) => {
      const candidateName = shuffledNames[index % shuffledNames.length];
      const age = 25 + Math.floor(Math.random() * 15); // 25-39 years old
      nameMap.set(role.name, { name: candidateName, age });
    });
    
    return nameMap;
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRoleClick = (role: Role) => {
    const candidateInfo = candidateNames.get(role.name);
    if (candidateInfo) {
      setSelectedCandidate({
        name: candidateInfo.name,
        age: candidateInfo.age,
        role: role
      });
    }
  };

  const handleHire = (candidate: Candidate, departmentName: string) => {
    if (financialData.bankBalance < candidate.role.salary) {
      toast.error(`Insufficient funds! You need ₹${candidate.role.salary.toLocaleString()} to hire ${candidate.name}.`);
      return;
    }

    // Deduct hiring cost
    updateFinancialData({
      bankBalance: financialData.bankBalance - candidate.role.salary,
      monthlyExpenses: financialData.monthlyExpenses + candidate.role.salary
    });

    // Apply role benefits based on impact
    const statBonus = candidate.role.impact === 'High' ? 5 : candidate.role.impact === 'Medium' ? 3 : 1;
    
    if (departmentName === 'Mental Wellness') {
      updatePlayerStats({
        emotion: Math.min(100, playerStats.emotion + statBonus),
        logic: Math.min(100, playerStats.logic + Math.floor(statBonus / 2))
      });
    } else if (departmentName === 'Finance & Strategy') {
      updatePlayerStats({
        logic: Math.min(100, playerStats.logic + statBonus),
        karma: Math.min(100, playerStats.karma + Math.floor(statBonus / 2))
      });
    } else if (departmentName === 'Operations & Growth') {
      updatePlayerStats({
        karma: Math.min(100, playerStats.karma + statBonus),
        emotion: Math.min(100, playerStats.emotion + Math.floor(statBonus / 2))
      });
    }

    setSelectedCandidate(null);
    toast.success(`Successfully hired ${candidate.name}! They will start contributing immediately.`);
  };

  // Resume Modal
  if (selectedCandidate) {
    return (
      <>
        {/* Background Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF4E6] rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            {/* Resume Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#3a3a3a] text-center" style={{ fontFamily: 'serif' }}>
                {selectedCandidate.name}
              </h2>
              <p className="text-center text-gray-600 mt-1">
                Age: {selectedCandidate.age} • {selectedCandidate.role.education}
              </p>
            </div>

            {/* Resume Content */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-[#3a3a3a] mb-2">Position</h3>
                <p className="text-gray-700">{selectedCandidate.role.name}</p>
                <p className="text-sm text-gray-600">₹{selectedCandidate.role.salary.toLocaleString()} per month</p>
              </div>

              <div>
                <h3 className="font-bold text-[#3a3a3a] mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.role.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#3a3a3a] mb-2">Experience</h3>
                <p className="text-gray-700">{selectedCandidate.role.experienceYears} years of professional experience</p>
              </div>

              <div>
                <h3 className="font-bold text-[#3a3a3a] mb-2">Previous Companies</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {selectedCandidate.role.previousCompanies.map((company, index) => (
                    <li key={index}>{company}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[#3a3a3a] mb-2">Personal Note</h3>
                <p className="text-gray-700 italic">"{selectedCandidate.role.personalNote}"</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-medium text-[#3a3a3a]">Impact Level</div>
                    <Badge className={`${getImpactColor(selectedCandidate.role.impact)} text-xs`}>
                      {selectedCandidate.role.impact}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Monthly Salary</div>
                    <div className="font-bold text-[#3a3a3a]">₹{selectedCandidate.role.salary.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <Button
                onClick={() => setSelectedCandidate(null)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => handleHire(selectedCandidate, selectedDepartment?.name || '')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={financialData.bankBalance < selectedCandidate.role.salary}
              >
                Hire Now
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Department Selection View
  if (!selectedDepartment) {
    return (
      <div className="min-h-screen bg-[#FAF4E6] p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <ArrowLeft size={20} />
              </Button>
            )}
          </div>
          <h1 className="text-2xl font-bold text-[#3a3a3a] text-center flex-1" style={{ fontFamily: 'serif' }}>
            Elite Team
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Horizontal Scrolling Departments */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {DEPARTMENTS.map((department) => (
            <div
              key={department.name}
              onClick={() => setSelectedDepartment(department)}
              className="min-w-[280px] bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                {department.icon}
                <h2 className="text-xl font-bold text-black">
                  {department.name}
                </h2>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {department.roles.length} available positions
              </p>
              <div className="space-y-2">
                {department.roles.slice(0, 2).map((role) => (
                  <div key={role.name} className="text-sm">
                    <div className="font-medium text-[#3a3a3a]">{role.name}</div>
                    <div className="text-gray-500">₹{role.salary.toLocaleString()}/mo</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Roles View for Selected Department (Bond Investment Style)
  return (
    <div className="min-h-screen bg-[#FAF4E6] p-4">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDepartment(null)}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          {selectedDepartment.icon}
        </div>
        <h1 className="text-xl font-bold text-[#3a3a3a] text-center flex-1" style={{ fontFamily: 'serif' }}>
          {selectedDepartment.name}
        </h1>
        <div className="w-10"></div>
      </div>

      {/* Purchase Roles Card - Similar to Bond Investment */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={20} className="text-[#d4af37]" />
          <h2 className="text-xl font-bold text-[#3a3a3a]">Hire Team Members</h2>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Bank Balance: ₹{financialData.bankBalance.toLocaleString()}
        </p>

        <div className="space-y-3">
          <p className="font-medium text-[#3a3a3a] mb-3">Select Candidate:</p>
          
          {selectedDepartment.roles.map((role) => {
            const candidateInfo = candidateNames.get(role.name);
            return (
              <div
                key={role.name}
                onClick={() => handleRoleClick(role)}
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-sm transition-shadow bg-[#FAF4E6]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-gray-600" />
                      <h3 className="font-bold text-[#3a3a3a]">
                        {candidateInfo?.name || 'Loading...'}
                      </h3>
                      <Badge className={`text-xs ${getImpactColor(role.impact)}`}>
                        {role.impact} Risk
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{role.description}</p>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Salary: ₹{role.salary.toLocaleString()}/mo</span>
                      <span>Experience: {role.experienceYears} years</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EliteHiringSection;