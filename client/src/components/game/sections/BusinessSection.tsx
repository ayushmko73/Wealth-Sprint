import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  TrendingUp,
  DollarSign,
  Users,
  ArrowRight,
  Target,
  Star,
  Activity,
  BarChart3
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { industrySectors } from '@/lib/data/industrySectors';
import FastFoodChainsPageNew from '../sectors/FastFoodChainsPageNew';
import TechStartupsPageNew from '../sectors/TechStartupsPageNew';
import EcommercePageNew from '../sectors/EcommercePageNew';
import HealthcarePageNew from '../sectors/HealthcarePageNew';

export default function BusinessSection() {
  const { 
    purchasedSectors,
    playerStats,
    financialData
  } = useWealthSprintGame();
  
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Handle sector-specific page navigation
  if (selectedSector === 'fast_food') {
    return <FastFoodChainsPageNew onBack={() => setSelectedSector(null)} />;
  }
  if (selectedSector === 'tech_startups') {
    return <TechStartupsPageNew onBack={() => setSelectedSector(null)} />;
  }
  if (selectedSector === 'ecommerce') {
    return <EcommercePageNew onBack={() => setSelectedSector(null)} />;
  }
  if (selectedSector === 'healthcare') {
    return <HealthcarePageNew onBack={() => setSelectedSector(null)} />;
  }

  // Generate business metrics for purchased sectors using real data
  const getBusinessMetrics = (sectorId: string) => {
    const baseMetrics = {
      'fast_food': {
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      },
      'tech_startups': {
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      'ecommerce': {
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      },
      'healthcare': {
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      }
    };

    const styleMetrics = baseMetrics[sectorId as keyof typeof baseMetrics];
    if (!styleMetrics) return null;

    // Get real business sector data from the centralized store
    const businessSector = financialData.businessSectors.find(s => s.sectorId === sectorId);
    
    if (!businessSector) {
      // If no business sector data exists, return minimal data
      return {
        progress: 0,
        monthlyRevenue: 0,
        customerSatisfaction: 50,
        color: styleMetrics.color,
        bgColor: styleMetrics.bgColor,
        borderColor: styleMetrics.borderColor
      };
    }

    // Calculate real metrics from business sector data
    let progress = 0;
    let customerSatisfaction = 50;
    
    if (sectorId === 'fast_food') {
      // Calculate progress based on number of active components
      const totalComponents = businessSector.activeCities.length + 
                            businessSector.activeMenuTypes.length + 
                            businessSector.activePricingStrategies.length + 
                            businessSector.activeLogisticsModels.length;
      progress = Math.min(100, totalComponents * 10); // 10% per component
      
      // Calculate satisfaction based on investment and components
      const baselineScore = 50;
      const investmentBonus = Math.min(30, businessSector.totalInvested / 50000); // Max 30 points from investment
      const componentBonus = totalComponents * 5; // 5 points per component
      customerSatisfaction = Math.min(100, baselineScore + investmentBonus + componentBonus);
    }

    return {
      progress: Math.round(progress),
      monthlyRevenue: businessSector.monthlyRevenue,
      customerSatisfaction: Math.round(customerSatisfaction),
      color: styleMetrics.color,
      bgColor: styleMetrics.bgColor,
      borderColor: styleMetrics.borderColor
    };
  };

  const handleSectorClick = (sectorId: string, event: React.MouseEvent) => {
    // Add click animation effect
    const target = event.currentTarget as HTMLElement;
    target.style.transform = 'scale(0.95)';
    setTimeout(() => {
      target.style.transform = 'scale(1)';
    }, 150);
    
    // Navigate to detailed sector management page
    console.log(`Navigate to detailed view for sector: ${sectorId}`);
    setSelectedSector(sectorId);
  };

  // Category definitions for horizontal menu
  const categories = [
    { id: 'all', label: 'All Business', icon: Star },
    { id: 'food', label: 'Food & Beverage', icon: Building2 },
    { id: 'tech', label: 'Technology', icon: TrendingUp },
    { id: 'health', label: 'Healthcare', icon: Activity },
    { id: 'retail', label: 'Retail', icon: Target }
  ];

  const getCategoryForSector = (sectorId: string) => {
    const categoryMap: Record<string, string> = {
      'fast_food': 'food',
      'tech_startups': 'tech',
      'ecommerce': 'retail',
      'healthcare': 'health'
    };
    return categoryMap[sectorId] || 'all';
  };

  const filteredSectors = activeCategory === 'all' 
    ? purchasedSectors 
    : purchasedSectors.filter(sectorId => getCategoryForSector(sectorId) === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Blue Header - Inspired by Bonds/Stock Market/Banking sections */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="px-4 py-4">
          {/* Main Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-15 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Business Portfolio</h1>
                <p className="text-blue-200 text-sm">Manage active sectors • Track performance • Optimize growth</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-15 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 text-white text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Revenue: ₹{((financialData.businessRevenue || 0) / 1000).toFixed(1)}k/mo</span>
              </div>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-blue-200 text-xs">Active Sectors</div>
                <div className="text-white font-bold text-lg">{purchasedSectors.length}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Total Revenue</div>
                <div className="text-green-300 font-bold text-lg">₹{((financialData.businessRevenue || 0) / 1000).toFixed(1)}k</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Avg Progress</div>
                <div className="text-yellow-300 font-bold text-lg">{purchasedSectors.length > 0 ? Math.round(purchasedSectors.reduce((total, sectorId) => {
                  const metrics = getBusinessMetrics(sectorId);
                  return total + (metrics?.progress || 0);
                }, 0) / purchasedSectors.length) : 0}%</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Portfolio Value</div>
                <div className="text-orange-300 font-bold text-lg">₹{(purchasedSectors.length * 2).toFixed(0)}L</div>
              </div>
            </div>
          </div>

          {/* Horizontal Categories Menu - Blue background with white text */}
          <div className="bg-blue-700 rounded-lg p-1">
            <div className="flex overflow-x-auto scrollbar-hide gap-1">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                const sectorCount = activeCategory === 'all' 
                  ? purchasedSectors.length 
                  : purchasedSectors.filter(sectorId => getCategoryForSector(sectorId) === category.id).length;
                
                return (
                  <Button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    variant="ghost"
                    size="sm"
                    className={`flex-shrink-0 transition-all duration-200 ${
                      isActive 
                        ? 'bg-white text-blue-800 hover:bg-white hover:text-blue-800' 
                        : 'bg-transparent text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.label}
                    {sectorCount > 0 && (
                      <Badge className={`ml-2 text-xs ${isActive ? 'bg-blue-600 text-white' : 'bg-white bg-opacity-20 text-blue-100'}`}>
                        {sectorCount}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-6">
        {/* No Sectors Message */}
        {purchasedSectors.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Business Sectors</h3>
            <p className="text-gray-600 mb-6">
              Purchase sectors from the "Industry Sectors" tab to start building your business empire.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Target className="w-4 h-4 mr-2" />
              Browse Sectors
            </Button>
          </div>
        )}

        {/* Business Sectors Grid */}
        {filteredSectors.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              {activeCategory === 'all' ? 'All Business Sectors' : `${categories.find(c => c.id === activeCategory)?.label} Sectors`} ({filteredSectors.length})
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSectors.map((sectorId) => {
                const sector = industrySectors.find(s => s.id === sectorId);
                const metrics = getBusinessMetrics(sectorId);
                
                if (!sector || !metrics) return null;

                return (
                  <Card 
                    key={sectorId}
                    className="bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:shadow-xl hover:scale-105 cursor-pointer transition-all duration-300"
                    onClick={(e) => handleSectorClick(sectorId, e)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-3xl">{sector.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{sector.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600 text-white text-xs px-2 py-0.5">
                              Active
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {metrics.progress}% Complete
                            </Badge>
                          </div>
                        </div>
                        <div className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <Progress value={metrics.progress} className="h-2" />
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <div className="text-green-700 text-xs">Monthly Revenue</div>
                          <div className="text-green-800 font-bold">₹{(metrics.monthlyRevenue / 1000).toFixed(1)}k</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-blue-700 text-xs">Satisfaction</div>
                          <div className="text-blue-800 font-bold">{metrics.customerSatisfaction}%</div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSectorClick(sectorId, e);
                          }}
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Manage Sector
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Show message when category filter has no results */}
        {purchasedSectors.length > 0 && filteredSectors.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">📊</div>
            <p className="text-gray-500">No sectors in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}