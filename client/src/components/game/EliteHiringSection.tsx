import React, { useState } from 'react';
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
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

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

  // Department Selection View
  if (!selectedDepartment) {
    return (
      <div className="min-h-screen bg-[#FAF4E6] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Balance Info */}
        <div className="px-4 py-2 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Balance: <span className="font-semibold text-[#3a3a3a]">₹{financialData.bankBalance.toLocaleString()}</span></span>
            <span className="text-gray-600">Monthly: <span className="font-semibold text-[#3a3a3a]">₹{financialData.monthlyExpenses.toLocaleString()}</span></span>
          </div>
        </div>

        {/* Horizontal Scrolling Departments */}
        <div className="flex-1 p-4">
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
      </div>
    );
  }

  // Roles View for Selected Department
  return (
    <div className="min-h-screen bg-[#FAF4E6] flex flex-col">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
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

      {/* Roles List */}
      <div className="flex-1 p-4 space-y-4">
        {selectedDepartment.roles.map((role) => (
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
                    onClick={() => handleHire(role, selectedDepartment.name)}
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
    </div>
  );
};

export default EliteHiringSection;