import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Target, 
  ArrowUp,
  ArrowDown,
  Activity,
  Zap,
  Star,
  Building2,
  Users,
  Briefcase
} from 'lucide-react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { formatMoney } from '../../../lib/utils/formatMoney';

export default function NewDataSection() {
  const { financialData, playerStats } = useWealthSprintGame();
  const [activeCategory, setActiveCategory] = useState<string>('Analytics');

  // Sample data for the new section
  const categories = [
    { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'Performance', label: 'Performance', icon: TrendingUp },
    { id: 'Insights', label: 'Insights', icon: Target },
    { id: 'Reports', label: 'Reports', icon: Activity }
  ];

  const analyticsData = [
    {
      id: 1,
      title: 'Revenue Growth',
      value: '23.5%',
      change: '+5.2%',
      trend: 'up',
      description: 'Monthly revenue increase over last quarter'
    },
    {
      id: 2,
      title: 'Investment Returns',
      value: formatMoney(125000),
      change: '+12.8%',
      trend: 'up',
      description: 'Portfolio performance this month'
    },
    {
      id: 3,
      title: 'Cost Efficiency',
      value: '18.2%',
      change: '-3.1%',
      trend: 'down',
      description: 'Operational cost reduction'
    },
    {
      id: 4,
      title: 'Market Position',
      value: '4th',
      change: '+2 ranks',
      trend: 'up',
      description: 'Industry ranking improvement'
    }
  ];

  const performanceMetrics = [
    {
      id: 1,
      title: 'Business Efficiency',
      value: '87%',
      change: '+8%',
      trend: 'up',
      description: 'Overall business process efficiency'
    },
    {
      id: 2,
      title: 'Team Productivity',
      value: '92%',
      change: '+15%',
      trend: 'up',
      description: 'Employee performance metrics'
    },
    {
      id: 3,
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.3',
      trend: 'up',
      description: 'Average customer rating'
    },
    {
      id: 4,
      title: 'Market Share',
      value: '12.4%',
      change: '+2.1%',
      trend: 'up',
      description: 'Industry market share'
    }
  ];

  const insightsData = [
    {
      id: 1,
      title: 'Strategic Opportunities',
      value: '7',
      change: '+3',
      trend: 'up',
      description: 'New business opportunities identified'
    },
    {
      id: 2,
      title: 'Risk Assessment',
      value: 'Low',
      change: 'Stable',
      trend: 'neutral',
      description: 'Current risk level analysis'
    },
    {
      id: 3,
      title: 'Innovation Index',
      value: '78%',
      change: '+12%',
      trend: 'up',
      description: 'Innovation and R&D progress'
    },
    {
      id: 4,
      title: 'Competitive Advantage',
      value: 'Strong',
      change: '+15%',
      trend: 'up',
      description: 'Market positioning strength'
    }
  ];

  const reportsData = [
    {
      id: 1,
      title: 'Financial Summary',
      value: formatMoney(2450000),
      change: '+18.5%',
      trend: 'up',
      description: 'Total assets under management'
    },
    {
      id: 2,
      title: 'Quarterly Earnings',
      value: formatMoney(385000),
      change: '+22.3%',
      trend: 'up',
      description: 'Net profit this quarter'
    },
    {
      id: 3,
      title: 'Investment Portfolio',
      value: formatMoney(1850000),
      change: '+14.7%',
      trend: 'up',
      description: 'Total investment value'
    },
    {
      id: 4,
      title: 'Cash Flow',
      value: formatMoney(450000),
      change: '+9.2%',
      trend: 'up',
      description: 'Monthly cash flow positive'
    }
  ];

  const getCurrentData = () => {
    switch (activeCategory) {
      case 'Performance':
        return performanceMetrics;
      case 'Insights':
        return insightsData;
      case 'Reports':
        return reportsData;
      default:
        return analyticsData;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Blue Background with Maximum Width */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            {/* Title Section */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-15 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Business Intelligence Hub</h1>
                <p className="text-blue-200 text-sm">Advanced Analytics • Real-time Insights • Strategic Planning</p>
              </div>
            </div>
            
            {/* Status Info */}
            <div className="bg-white bg-opacity-15 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2 text-white text-sm">
                <Activity className="w-4 h-4" />
                <span>Live Data</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-blue-200 text-xs">Net Worth</div>
                <div className="text-white font-bold text-lg">{formatMoney(financialData.totalAssets)}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Growth Rate</div>
                <div className="text-green-300 font-bold text-lg">+23.4%</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Active Projects</div>
                <div className="text-white font-bold text-lg">12</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Success Rate</div>
                <div className="text-yellow-300 font-bold text-lg">87.5%</div>
              </div>
            </div>
          </div>

          {/* Menu - Horizontal Categories with Blue Background */}
          <div className="bg-blue-600 rounded-lg p-1">
            <div className="flex gap-1 overflow-x-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-white text-blue-800 shadow-md' 
                        : 'bg-transparent text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Data Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getCurrentData().map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800">{item.title}</CardTitle>
                  <div className="flex items-center gap-1">
                    {item.trend === 'up' && <ArrowUp className="w-4 h-4 text-green-600" />}
                    {item.trend === 'down' && <ArrowDown className="w-4 h-4 text-red-600" />}
                    {item.trend === 'neutral' && <Activity className="w-4 h-4 text-blue-600" />}
                    <span className={`text-sm font-medium ${
                      item.trend === 'up' ? 'text-green-600' : 
                      item.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                <p className="text-sm text-gray-600">{item.description}</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {activeCategory}
                  </Badge>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}