import React, { useState } from 'react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { useTeamManagement } from '../../lib/stores/useTeamManagement';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, DollarSign, User, Star, Users, TrendingUp, Briefcase, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { formatIndianCurrency } from '../../lib/utils';

interface Candidate {
  id: string;
  name: string;
  age: number;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  salary: number;
  experienceYears: number;
  education: string;
  position: string;
  previousCompanies: string[];
  skills: string[];
}

interface Department {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  candidates: Candidate[];
}

const DEPARTMENTS: Department[] = [
  {
    id: 'finance',
    name: 'Finance & Strategy',
    icon: <DollarSign size={24} />,
    color: '#d4af37',
    candidates: [
      {
        id: 'aarav_mehta',
        name: 'Aarav Mehta',
        age: 34,
        impact: 'High',
        description: 'Improves investment returns.',
        salary: 10000,
        experienceYears: 6,
        education: 'MBA in Finance from IIM',
        position: 'Financial Advisor',
        previousCompanies: ['HDFC Bank', 'ICICI Securities'],
        skills: ['Portfolio Management', 'Risk Assessment', 'Financial Planning', 'Investment Strategy']
      },
      {
        id: 'arjun_malhotra',
        name: 'Arjun Malhotra',
        age: 28,
        impact: 'Medium',
        description: 'Reduces losses in risky deals.',
        salary: 8000,
        experienceYears: 4,
        education: 'CA with Risk Management Certification',
        position: 'Risk Analyst',
        previousCompanies: ['Kotak Mahindra', 'Axis Bank'],
        skills: ['Risk Assessment', 'Data Analysis', 'Financial Modeling']
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Sales & Marketing',
    icon: <TrendingUp size={24} />,
    color: '#e74c3c',
    candidates: [
      {
        id: 'meera_iyer',
        name: 'Meera Iyer',
        age: 31,
        impact: 'High',
        description: 'Drives brand growth and customer acquisition.',
        salary: 9000,
        experienceYears: 7,
        education: 'MBA in Marketing from XLRI',
        position: 'Marketing Director',
        previousCompanies: ['Unilever', 'P&G'],
        skills: ['Brand Strategy', 'Digital Marketing', 'Customer Analytics', 'Campaign Management']
      },
      {
        id: 'rohan_kapoor',
        name: 'Rohan Kapoor',
        age: 29,
        impact: 'Medium',
        description: 'Increases sales conversion rates.',
        salary: 7500,
        experienceYears: 5,
        education: 'BBA with Sales Certification',
        position: 'Sales Manager',
        previousCompanies: ['Reliance', 'Tata Group'],
        skills: ['Sales Strategy', 'Client Relations', 'Team Leadership']
      }
    ]
  },
  {
    id: 'operations',
    name: 'Operations & Technology',
    icon: <Briefcase size={24} />,
    color: '#3498db',
    candidates: [
      {
        id: 'priya_singh',
        name: 'Priya Singh',
        age: 26,
        impact: 'High',
        description: 'Optimizes operational efficiency.',
        salary: 8500,
        experienceYears: 4,
        education: 'B.Tech in Computer Science',
        position: 'Operations Manager',
        previousCompanies: ['Amazon', 'Flipkart'],
        skills: ['Process Optimization', 'Project Management', 'Data Analytics']
      }
    ]
  }
];

interface SimpleTeamHiringProps {
  onClose: () => void;
}

const SimpleTeamHiring: React.FC<SimpleTeamHiringProps> = ({ onClose }) => {
  const { financialData, updateFinancialData } = useWealthSprintGame();
  const { addTeamMember, teamMembers } = useTeamManagement();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const handleHire = (candidate: Candidate) => {
    // Check if candidate is already hired
    if (teamMembers.some(member => member.id === candidate.id)) {
      toast.error('This candidate has already been hired!');
      return;
    }

    // Check if player has enough money
    const hiringCost = candidate.salary * 12; // Annual salary as hiring cost
    if (financialData.bankBalance < hiringCost) {
      toast.error(`Insufficient funds! You need ${formatIndianCurrency(hiringCost)} to hire this candidate`);
      return;
    }

    // Hire the candidate
    updateFinancialData({
      bankBalance: financialData.bankBalance - hiringCost,
      monthlyExpenses: financialData.monthlyExpenses + candidate.salary
    });

    addTeamMember({
      id: candidate.id,
      name: 'Team Member',
      role: 'Team Member',
      avatar: '👤',
      stats: {
        loyalty: 80,
        impact: candidate.impact === 'High' ? 90 : candidate.impact === 'Medium' ? 70 : 50,
        energy: 100,
        mood: 'motivated' as const
      },
      salary: candidate.salary,
      joinDate: new Date(),
      skills: [candidate.description],
      achievements: [],
      personality: {
        type: 'Professional',
        motivationTriggers: ['Recognition', 'Growth'],
        weakSpots: ['Overwork']
      },
      emotionalTrait: 'Dedicated professional',
      loopVulnerability: 'none' as const,
      clarityContribution: candidate.impact === 'High' ? 8 : candidate.impact === 'Medium' ? 6 : 4,
      hiddenDynamics: {
        trustWithFounder: 75,
        creativeFulfillment: 80,
        burnoutRisk: 20,
        isHidingStruggles: false
      }
    });

    toast.success(`Successfully hired ${candidate.position}!`);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const isAlreadyHired = (candidateId: string) => {
    return teamMembers.some(member => member.id === candidateId);
  };

  // If no department is selected, show department selection
  if (!selectedDepartment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0ead6] to-[#f8f4e8] p-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Users className="text-[#d4af37] mr-2" size={24} />
          <h1 className="text-2xl font-bold text-[#3a3a3a]">Elite Team Hiring</h1>
        </div>



        {/* Department Selection */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#3a3a3a] mb-4">Select Department:</h2>
        </div>

        {/* Department Cards */}
        <div className="space-y-4">
          {DEPARTMENTS.map((department) => (
            <Card 
              key={department.id} 
              className="bg-white hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedDepartment(department.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${department.color}20`, color: department.color }}
                    >
                      {department.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#3a3a3a] text-lg">{department.name}</h3>
                      <p className="text-gray-600 text-sm">{department.candidates.length} candidates available</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Team Members */}
        {teamMembers.length > 0 && (
          <div className="mt-8">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Your Team ({teamMembers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{member.role}</span>
                      <span className="text-gray-600">{formatIndianCurrency(member.salary)}/mo</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Show candidates for selected department
  const department = DEPARTMENTS.find(d => d.id === selectedDepartment);
  if (!department) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0ead6] to-[#f8f4e8] p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedDepartment(null)}
          className="mr-3"
        >
          <ArrowLeft size={20} />
        </Button>
        <div 
          className="mr-2"
          style={{ color: department.color }}
        >
          {department.icon}
        </div>
        <h1 className="text-2xl font-bold text-[#3a3a3a]">{department.name}</h1>
      </div>



      {/* Candidates Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#3a3a3a] mb-4">Select Candidate:</h2>
      </div>

      {/* Candidate Cards */}
      <div className="space-y-4">
        {department.candidates.map((candidate) => {
          const alreadyHired = isAlreadyHired(candidate.id);
          
          return (
            <Card key={candidate.id} className="bg-gray-100">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-[#3a3a3a]">{candidate.position}</h3>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">{candidate.age} • {candidate.education}</p>
                      <p className="text-sm font-medium text-blue-600 mb-1">Position: {candidate.position}</p>
                      <p className="text-sm text-gray-600 mb-2">Previous Companies: {candidate.previousCompanies.join(', ')}</p>
                      <p className="text-gray-600 text-sm mb-3">{candidate.description}</p>
                      
                      {/* Skills */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {candidate.skills.map((skill, index) => {
                          const colors = [
                            'bg-blue-100 text-blue-800 border-blue-300',
                            'bg-green-100 text-green-800 border-green-300', 
                            'bg-purple-100 text-purple-800 border-purple-300',
                            'bg-orange-100 text-orange-800 border-orange-300',
                            'bg-pink-100 text-pink-800 border-pink-300',
                            'bg-indigo-100 text-indigo-800 border-indigo-300'
                          ];
                          const colorClass = colors[index % colors.length];
                          return (
                            <Badge key={index} className={`text-xs ${colorClass}`}>
                              {skill}
                            </Badge>
                          );
                        })}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <DollarSign size={14} className="text-green-600" />
                          <span className="font-medium">{formatIndianCurrency(candidate.salary)}/mo</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-500" />
                          <span>{candidate.experienceYears} years exp</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleHire(candidate)}
                    disabled={alreadyHired || financialData.bankBalance < candidate.salary * 12}
                    className={`${
                      alreadyHired 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white px-4 py-2`}
                  >
                    {alreadyHired ? 'Hired' : 'Hire Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleTeamHiring;