import React, { useState } from 'react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { useTeamManagement } from '../../lib/stores/useTeamManagement';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, DollarSign, User, Star } from 'lucide-react';
import { toast } from 'sonner';
import { formatIndianCurrency } from '../../lib/utils';

interface Candidate {
  id: string;
  name: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  salary: number;
  experienceYears: number;
}

const CANDIDATES: Candidate[] = [
  {
    id: 'meera_iyer',
    name: 'Meera Iyer',
    impact: 'High',
    description: 'Improves investment returns.',
    salary: 10000,
    experienceYears: 6
  },
  {
    id: 'rohan_kapoor',
    name: 'Rohan Kapoor', 
    impact: 'Medium',
    description: 'Reduces losses in risky deals.',
    salary: 8000,
    experienceYears: 4
  },
  {
    id: 'aarav_mehta',
    name: 'Aarav Mehta',
    impact: 'High',
    description: 'Strategic planning and market analysis.',
    salary: 12000,
    experienceYears: 8
  },
  {
    id: 'priya_singh',
    name: 'Priya Singh',
    impact: 'Medium',
    description: 'Digital marketing and brand growth.',
    salary: 7500,
    experienceYears: 5
  }
];

interface SimpleTeamHiringProps {
  onClose: () => void;
}

const SimpleTeamHiring: React.FC<SimpleTeamHiringProps> = ({ onClose }) => {
  const { financialData, updateFinancialData } = useWealthSprintGame();
  const { addTeamMember, teamMembers } = useTeamManagement();

  const handleHire = (candidate: Candidate) => {
    // Check if candidate is already hired
    if (teamMembers.some(member => member.id === candidate.id)) {
      toast.error('This candidate has already been hired!');
      return;
    }

    // Check if player has enough money
    const hiringCost = candidate.salary * 12; // Annual salary as hiring cost
    if (financialData.bankBalance < hiringCost) {
      toast.error(`Insufficient funds! You need ${formatIndianCurrency(hiringCost)} to hire ${candidate.name}`);
      return;
    }

    // Hire the candidate
    updateFinancialData({
      bankBalance: financialData.bankBalance - hiringCost,
      monthlyExpenses: financialData.monthlyExpenses + candidate.salary
    });

    addTeamMember({
      id: candidate.id,
      name: candidate.name,
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

    toast.success(`Successfully hired ${candidate.name}!`);
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

  return (
    <div className="min-h-screen bg-[#F5F5DC] p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="mr-3"
        >
          <ArrowLeft size={20} />
        </Button>
        <DollarSign className="text-[#d4af37] mr-2" size={24} />
        <h1 className="text-2xl font-bold text-[#3a3a3a]">Finance & Strategy</h1>
      </div>

      {/* Bank Balance */}
      <div className="mb-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg">💰 Hire Team Members</CardTitle>
            <p className="text-gray-600">Bank Balance: {formatIndianCurrency(financialData.bankBalance)}</p>
          </CardHeader>
        </Card>
      </div>

      {/* Candidates Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#3a3a3a] mb-4">Select Candidate:</h2>
      </div>

      {/* Candidate Cards */}
      <div className="space-y-4">
        {CANDIDATES.map((candidate) => {
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
                        <h3 className="font-semibold text-[#3a3a3a]">{candidate.name}</h3>
                        <Badge className={`${getImpactColor(candidate.impact)} text-white text-xs px-2 py-1`}>
                          {candidate.impact} Impact
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{candidate.description}</p>
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
                    <span className="font-medium">{member.name}</span>
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
};

export default SimpleTeamHiring;