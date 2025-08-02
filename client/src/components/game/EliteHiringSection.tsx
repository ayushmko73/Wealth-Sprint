import React from 'react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  DollarSign, 
  Heart, 
  TrendingUp, 
  Users, 
  X 
} from 'lucide-react';
import { toast } from 'sonner';

interface Role {
  name: string;
  salary: number;
  impact: 'Low' | 'Medium' | 'High';
  description: string;
}

interface Department {
  name: string;
  icon: React.ReactNode;
  roles: Role[];
}

const DEPARTMENTS: Department[] = [
  {
    name: 'Finance & Strategy',
    icon: <DollarSign size={20} className="text-[#d4af37]" />,
    roles: [
      {
        name: 'Financial Advisor',
        salary: 10000,
        impact: 'High',
        description: 'Improves investment returns.'
      },
      {
        name: 'Risk Analyst',
        salary: 8000,
        impact: 'Medium',
        description: 'Reduces losses in risky deals.'
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
        description: 'Reduces stress over time.'
      },
      {
        name: 'Productivity Mentor',
        salary: 5000,
        impact: 'Medium',
        description: 'Boosts peace and focus.'
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
        description: 'Speeds up business deals.'
      },
      {
        name: 'Marketing Lead',
        salary: 12000,
        impact: 'High',
        description: 'Increases customer reach.'
      }
    ]
  }
];

interface EliteHiringSectionProps {
  onClose?: () => void;
}

const EliteHiringSection: React.FC<EliteHiringSectionProps> = ({ onClose }) => {
  const { financialData, updateFinancialData, playerStats, updatePlayerStats } = useWealthSprintGame();

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

  const handleHire = (role: Role, departmentName: string) => {
    if (financialData.bankBalance < role.salary) {
      toast.error(`Insufficient funds! You need ₹${role.salary.toLocaleString()} to hire ${role.name}.`);
      return;
    }

    // Deduct hiring cost
    updateFinancialData({
      bankBalance: financialData.bankBalance - role.salary,
      monthlyExpenses: financialData.monthlyExpenses + role.salary
    });

    // Apply role benefits based on impact
    const statBonus = role.impact === 'High' ? 5 : role.impact === 'Medium' ? 3 : 1;
    
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

    toast.success(`Successfully hired ${role.name}! They will start contributing immediately.`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#FAF4E6] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Users size={24} className="text-[#3a3a3a]" />
            <h1 className="text-2xl font-bold text-[#3a3a3a]" style={{ fontFamily: 'serif' }}>
              Elite Hiring
            </h1>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X size={20} />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {DEPARTMENTS.map((department, deptIndex) => (
            <div key={department.name}>
              {/* Department Header */}
              <div className="flex items-center gap-3 mb-4">
                {department.icon}
                <h2 className="text-xl font-bold text-black">
                  {department.name}
                </h2>
              </div>

              {/* Roles */}
              <div className="space-y-3">
                {department.roles.map((role, roleIndex) => (
                  <Card key={role.name} className="bg-[#F5F0E6] border border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        {/* Left side - Role details */}
                        <div className="flex-1">
                          <h3 className="font-bold text-[#3a3a3a] mb-1">
                            {role.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            ₹{role.salary.toLocaleString()} per month
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              className={`text-xs px-2 py-1 rounded-full ${getImpactColor(role.impact)}`}
                            >
                              {role.impact}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {role.description}
                          </p>
                        </div>

                        {/* Right side - Hire button */}
                        <div className="ml-4">
                          <Button
                            onClick={() => handleHire(role, department.name)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
                            disabled={financialData.bankBalance < role.salary}
                          >
                            Hire Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Department divider */}
              {deptIndex < DEPARTMENTS.length - 1 && (
                <div className="border-t border-gray-200 mt-6"></div>
              )}
            </div>
          ))}
        </div>

        {/* Footer with current balance */}
        <div className="p-6 border-t border-gray-200 bg-[#F5F0E6]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Current Balance: <span className="font-semibold text-[#3a3a3a]">₹{financialData.bankBalance.toLocaleString()}</span>
            </p>
            <p className="text-sm text-gray-600">
              Monthly Expenses: <span className="font-semibold text-[#3a3a3a]">₹{financialData.monthlyExpenses.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliteHiringSection;