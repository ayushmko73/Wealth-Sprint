import React, { useState, useEffect } from 'react';
import { useTeamManagement } from '../../lib/stores/useTeamManagement';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, User, Star, TrendingUp, Award, Zap } from 'lucide-react';
// Import type from the team management store since we don't have shared types
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  stats?: {
    loyalty?: number;
    impact?: number;
    energy?: number;
    mood?: string;
  };
  salary?: number;
  skills?: string[];
  experienceYears?: number;
}

interface SkillNode {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  category: 'core' | 'technical' | 'leadership' | 'soft';
  prerequisites: string[];
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

interface SkillTreeVisualizationProps {
  onClose: () => void;
}

const SkillTreeVisualization: React.FC<SkillTreeVisualizationProps> = ({ onClose }) => {
  const { teamMembers } = useTeamManagement();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [skillTrees, setSkillTrees] = useState<Record<string, SkillNode[]>>({});

  // Generate skill tree based on team member's current skills
  const generateSkillTree = (member: TeamMember): SkillNode[] => {
    const baseSkills = member.skills || [];
    const skillNodes: SkillNode[] = [];
    
    // Core Skills (always unlocked)
    skillNodes.push(
      {
        id: 'communication',
        name: 'Communication',
        level: baseSkills.includes('Communication') ? 3 : 1,
        maxLevel: 5,
        category: 'core',
        prerequisites: [],
        description: 'Effective team communication and collaboration',
        icon: <User size={16} />,
        unlocked: true
      },
      {
        id: 'problem_solving',
        name: 'Problem Solving',
        level: 2,
        maxLevel: 5,
        category: 'core',
        prerequisites: [],
        description: 'Analytical thinking and solution development',
        icon: <Zap size={16} />,
        unlocked: true
      }
    );

    // Technical Skills (based on role)
    if (member.role.toLowerCase().includes('developer') || member.role.toLowerCase().includes('technology')) {
      skillNodes.push(
        {
          id: 'programming',
          name: 'Programming',
          level: baseSkills.some((s: string) => ['React', 'Node.js', 'Python', 'JavaScript'].includes(s)) ? 4 : 2,
          maxLevel: 5,
          category: 'technical',
          prerequisites: ['problem_solving'],
          description: 'Software development and coding expertise',
          icon: <TrendingUp size={16} />,
          unlocked: true
        },
        {
          id: 'system_design',
          name: 'System Design',
          level: baseSkills.includes('System Design') ? 3 : 1,
          maxLevel: 5,
          category: 'technical',
          prerequisites: ['programming'],
          description: 'Architecture and scalable system planning',
          icon: <Award size={16} />,
          unlocked: baseSkills.includes('System Design')
        },
        {
          id: 'database_management',
          name: 'Database Management',
          level: baseSkills.includes('Database Design') ? 3 : 1,
          maxLevel: 5,
          category: 'technical',
          prerequisites: ['programming'],
          description: 'Data storage and optimization',
          icon: <Star size={16} />,
          unlocked: baseSkills.includes('Database Design')
        }
      );
    }

    // Marketing Skills
    if (member.role.toLowerCase().includes('marketing') || member.role.toLowerCase().includes('sales')) {
      skillNodes.push(
        {
          id: 'digital_marketing',
          name: 'Digital Marketing',
          level: baseSkills.includes('Digital Marketing') ? 4 : 2,
          maxLevel: 5,
          category: 'technical',
          prerequisites: ['communication'],
          description: 'Online marketing strategies and campaigns',
          icon: <TrendingUp size={16} />,
          unlocked: true
        },
        {
          id: 'analytics',
          name: 'Analytics',
          level: baseSkills.includes('Analytics') ? 3 : 1,
          maxLevel: 5,
          category: 'technical',
          prerequisites: ['digital_marketing'],
          description: 'Data analysis and performance tracking',
          icon: <Star size={16} />,
          unlocked: baseSkills.includes('Analytics')
        },
        {
          id: 'brand_strategy',
          name: 'Brand Strategy',
          level: baseSkills.includes('Brand Strategy') ? 4 : 1,
          maxLevel: 5,
          category: 'leadership',
          prerequisites: ['digital_marketing'],
          description: 'Brand positioning and strategic planning',
          icon: <Award size={16} />,
          unlocked: baseSkills.includes('Brand Strategy')
        }
      );
    }

    // Financial Skills
    if (member.role.toLowerCase().includes('financial') || member.role.toLowerCase().includes('finance')) {
      skillNodes.push(
        {
          id: 'financial_planning',
          name: 'Financial Planning',
          level: baseSkills.includes('Financial Planning') ? 4 : 2,
          maxLevel: 5,
          category: 'technical',
          prerequisites: ['problem_solving'],
          description: 'Strategic financial management and forecasting',
          icon: <TrendingUp size={16} />,
          unlocked: true
        },
        {
          id: 'risk_assessment',
          name: 'Risk Assessment',
          level: baseSkills.includes('Risk Assessment') ? 3 : 1,
          maxLevel: 5,
          category: 'technical',
          prerequisites: ['financial_planning'],
          description: 'Risk analysis and mitigation strategies',
          icon: <Star size={16} />,
          unlocked: baseSkills.includes('Risk Assessment')
        },
        {
          id: 'investment_strategy',
          name: 'Investment Strategy',
          level: baseSkills.includes('Investment Strategy') ? 4 : 1,
          maxLevel: 5,
          category: 'leadership',
          prerequisites: ['financial_planning', 'risk_assessment'],
          description: 'Portfolio management and investment decisions',
          icon: <Award size={16} />,
          unlocked: baseSkills.includes('Investment Strategy')
        }
      );
    }

    // Leadership Skills (unlocked for senior roles)
    const isLeader = member.role.toLowerCase().includes('lead') || 
                    member.role.toLowerCase().includes('director') || 
                    member.role.toLowerCase().includes('manager');
    
    skillNodes.push(
      {
        id: 'team_leadership',
        name: 'Team Leadership',
        level: baseSkills.includes('Team Leadership') ? 3 : (isLeader ? 2 : 1),
        maxLevel: 5,
        category: 'leadership',
        prerequisites: ['communication'],
        description: 'Leading and motivating team members',
        icon: <Award size={16} />,
        unlocked: isLeader
      },
      {
        id: 'strategic_thinking',
        name: 'Strategic Thinking',
        level: isLeader ? 2 : 1,
        maxLevel: 5,
        category: 'leadership',
        prerequisites: ['team_leadership'],
        description: 'Long-term planning and vision development',
        icon: <Star size={16} />,
        unlocked: isLeader
      }
    );

    return skillNodes;
  };

  useEffect(() => {
    const trees: Record<string, SkillNode[]> = {};
    teamMembers.forEach(member => {
      trees[member.id] = generateSkillTree(member);
    });
    setSkillTrees(trees);
  }, [teamMembers]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-500';
      case 'technical': return 'bg-green-500';
      case 'leadership': return 'bg-purple-500';
      case 'soft': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getSkillLevelColor = (level: number, maxLevel: number) => {
    const percentage = level / maxLevel;
    if (percentage >= 0.8) return 'text-green-600';
    if (percentage >= 0.6) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (!selectedMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0ead6] to-[#f8f4e8] p-2 sm:p-4">
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
          <TrendingUp className="text-[#d4af37] mr-2" size={24} />
          <h1 className="text-2xl font-bold text-[#3a3a3a]">Team Skill Trees</h1>
        </div>


        {/* Team Member Selection */}
        {teamMembers.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#3a3a3a] mb-4">Select Team Member:</h2>
            {teamMembers.map((member) => (
              <Card 
                key={member.id} 
                className="bg-white hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#3a3a3a] text-lg">{member.name}</h3>
                        <p className="text-gray-600 text-sm">{member.role}</p>
                        <p className="text-blue-600 text-sm">{member.skills?.length || 0} skills acquired</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Impact: {member.stats?.impact || 'N/A'}</div>
                      <div className="text-sm text-gray-500">Experience: {(member as any).experienceYears || 'New'} years</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white">
            <CardContent className="p-4 sm:p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Team Members</h3>
              <p className="text-gray-500">Hire team members first to view their skill trees.</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  const memberSkills = skillTrees[selectedMember.id] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0ead6] to-[#f8f4e8] p-2 sm:p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedMember(null)}
          className="mr-3"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <User className="text-blue-600" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#3a3a3a]">{selectedMember.name}</h1>
          <p className="text-gray-600">{selectedMember.role}</p>
        </div>
      </div>

      {/* Skill Tree Visualization */}
      <div className="space-y-6">
        {/* Core Skills */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              Core Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {memberSkills.filter(skill => skill.category === 'core').map((skill) => (
                <div key={skill.id} className={`p-2 sm:p-3 rounded-lg border-2 ${skill.unlocked ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {skill.icon}
                      <span className={`font-medium ${skill.unlocked ? 'text-blue-800' : 'text-gray-500'}`}>
                        {skill.name}
                      </span>
                    </div>
                    <Badge variant={skill.unlocked ? 'default' : 'secondary'} className="text-xs">
                      {skill.unlocked ? 'Unlocked' : 'Locked'}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span className={getSkillLevelColor(skill.level, skill.maxLevel)}>
                        Level {skill.level}/{skill.maxLevel}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${skill.unlocked ? 'bg-blue-500' : 'bg-gray-400'}`}
                        style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{skill.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Skills */}
        {memberSkills.some(skill => skill.category === 'technical') && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                Technical Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {memberSkills.filter(skill => skill.category === 'technical').map((skill) => (
                  <div key={skill.id} className={`p-2 sm:p-3 rounded-lg border-2 ${skill.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {skill.icon}
                        <span className={`font-medium ${skill.unlocked ? 'text-green-800' : 'text-gray-500'}`}>
                          {skill.name}
                        </span>
                      </div>
                      <Badge variant={skill.unlocked ? 'default' : 'secondary'} className="text-xs">
                        {skill.unlocked ? 'Unlocked' : 'Locked'}
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span className={getSkillLevelColor(skill.level, skill.maxLevel)}>
                          Level {skill.level}/{skill.maxLevel}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${skill.unlocked ? 'bg-green-500' : 'bg-gray-400'}`}
                          style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{skill.description}</p>
                    {skill.prerequisites.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Requires: {skill.prerequisites.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leadership Skills */}
        {memberSkills.some(skill => skill.category === 'leadership') && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                Leadership Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {memberSkills.filter(skill => skill.category === 'leadership').map((skill) => (
                  <div key={skill.id} className={`p-2 sm:p-3 rounded-lg border-2 ${skill.unlocked ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {skill.icon}
                        <span className={`font-medium ${skill.unlocked ? 'text-purple-800' : 'text-gray-500'}`}>
                          {skill.name}
                        </span>
                      </div>
                      <Badge variant={skill.unlocked ? 'default' : 'secondary'} className="text-xs">
                        {skill.unlocked ? 'Unlocked' : 'Locked'}
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span className={getSkillLevelColor(skill.level, skill.maxLevel)}>
                          Level {skill.level}/{skill.maxLevel}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${skill.unlocked ? 'bg-purple-500' : 'bg-gray-400'}`}
                          style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{skill.description}</p>
                    {skill.prerequisites.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Requires: {skill.prerequisites.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SkillTreeVisualization;