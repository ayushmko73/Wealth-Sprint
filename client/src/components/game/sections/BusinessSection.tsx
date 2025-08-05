import React, { useState, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { industrySectors } from '@/lib/data/industrySectors';
import FastFoodChainsPage from '../sectors/FastFoodChainsPage';
import HealthcarePage from '../sectors/HealthcarePage';
import EcommercePage from '../sectors/EcommercePage';
import TechStartupPage from '../sectors/TechStartupPage';

export default function BusinessSection() {
  const { 
    purchasedSectors,
    playerStats,
    financialData
  } = useWealthSprintGame();
  
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [, forceUpdate] = useState({});

  // Force re-render every 5 seconds to reflect fast food changes
  React.useEffect(() => {
    const updateInterval = setInterval(() => {
      forceUpdate({});
    }, 5000);
    return () => clearInterval(updateInterval);
  }, []);

  // Handle sector-specific page navigation
  if (selectedSector === 'fast_food') {
    return <FastFoodChainsPage onBack={() => setSelectedSector(null)} />;
  }
  if (selectedSector === 'healthcare') {
    return <HealthcarePage onBack={() => setSelectedSector(null)} />;
  }
  if (selectedSector === 'ecommerce') {
    return <EcommercePage onBack={() => setSelectedSector(null)} />;
  }
  if (selectedSector === 'tech_startups') {
    return <TechStartupPage onBack={() => setSelectedSector(null)} />;
  }

  // Get actual Fast Food Chain revenue from saved cities data
  const getFastFoodRevenue = () => {
    try {
      const saved = localStorage.getItem('fastFoodCities');
      if (saved) {
        const cities = JSON.parse(saved);
        const expandedCities = cities.filter((city: any) => city.expanded);
        
        if (expandedCities.length === 0) return 0;
        
        // Calculate quality-adjusted revenue for each expanded city
        let totalRevenue = 0;
        expandedCities.forEach((city: any) => {
          let adjustedRevenue = city.monthlyRevenue;
          if (city.quality < 50) {
            adjustedRevenue *= 0.8; // 20% reduction for poor quality
          } else if (city.quality > 70) {
            adjustedRevenue *= 1.2; // 20% increase for high quality
          }
          totalRevenue += adjustedRevenue; // Show gross revenue, not net profit
        });
        
        return Math.max(0, Math.round(totalRevenue));
      }
    } catch (error) {
      console.warn('Failed to load fast food revenue:', error);
    }
    return 20000; // Default fallback revenue
  };

  // Get actual Healthcare revenue from saved facilities data
  const getHealthcareRevenue = () => {
    try {
      const saved = localStorage.getItem('healthcareFacilities');
      if (saved) {
        const facilities = JSON.parse(saved);
        const establishedFacilities = facilities.filter((facility: any) => facility.established);
        
        if (establishedFacilities.length === 0) return 0;
        
        let totalRevenue = 0;
        establishedFacilities.forEach((facility: any) => {
          let adjustedRevenue = facility.monthlyRevenue;
          if (facility.qualityOfCare < 60) {
            adjustedRevenue *= 0.7;
          } else if (facility.qualityOfCare > 85) {
            adjustedRevenue *= 1.3;
          }
          totalRevenue += adjustedRevenue;
        });
        
        return Math.max(0, Math.round(totalRevenue));
      }
    } catch (error) {
      console.warn('Failed to load healthcare revenue:', error);
    }
    return 30000;
  };

  // Get actual E-commerce revenue from saved channels data
  const getEcommerceRevenue = () => {
    try {
      const saved = localStorage.getItem('ecommerceChannels');
      if (saved) {
        const channels = JSON.parse(saved);
        const activeChannels = channels.filter((channel: any) => channel.active);
        
        if (activeChannels.length === 0) return 0;
        
        let totalRevenue = 0;
        activeChannels.forEach((channel: any) => {
          let adjustedRevenue = channel.monthlyRevenue;
          if (channel.competitionLevel > 80) {
            adjustedRevenue *= 0.85;
          } else if (channel.competitionLevel < 50) {
            adjustedRevenue *= 1.2;
          }
          totalRevenue += adjustedRevenue;
        });
        
        return Math.max(0, Math.round(totalRevenue));
      }
    } catch (error) {
      console.warn('Failed to load ecommerce revenue:', error);
    }
    return 25000;
  };

  // Get actual Tech Startup revenue from saved products data
  const getTechStartupRevenue = () => {
    try {
      const saved = localStorage.getItem('techStartupProducts');
      if (saved) {
        const products = JSON.parse(saved);
        const launchedProducts = products.filter((product: any) => product.launched);
        
        if (launchedProducts.length === 0) return 0;
        
        let totalRevenue = 0;
        launchedProducts.forEach((product: any) => {
          let adjustedRevenue = product.monthlyRevenue;
          if (product.marketFit < 50) {
            adjustedRevenue *= 0.6;
          } else if (product.marketFit > 80) {
            adjustedRevenue *= 1.4;
          }
          totalRevenue += adjustedRevenue;
        });
        
        return Math.max(0, Math.round(totalRevenue));
      }
    } catch (error) {
      console.warn('Failed to load tech startup revenue:', error);
    }
    return 40000;
  };

  // Generate business metrics for purchased sectors
  const getBusinessMetrics = (sectorId: string) => {
    const baseMetrics = {
      'fast_food': {
        progressRate: 15,
        revenueMultiplier: 5000,
        satisfactionBase: 75,
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      },
      'tech_startups': {
        progressRate: 8,
        revenueMultiplier: 12000,
        satisfactionBase: 65,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      'ecommerce': {
        progressRate: 12,
        revenueMultiplier: 8000,
        satisfactionBase: 70,
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      },
      'healthcare': {
        progressRate: 6,
        revenueMultiplier: 15000,
        satisfactionBase: 80,
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      }
    };

    const metrics = baseMetrics[sectorId as keyof typeof baseMetrics];
    if (!metrics) return null;

    // Get actual revenue for each sector
    if (sectorId === 'fast_food') {
      const actualRevenue = getFastFoodRevenue();
      const expandedCities = JSON.parse(localStorage.getItem('fastFoodCities') || '[]').filter((city: any) => city.expanded);
      const progress = Math.min(100, (expandedCities.length / 5) * 100);
      
      return {
        progress: Math.round(progress),
        monthlyRevenue: actualRevenue,
        customerSatisfaction: 75 + Math.floor(Math.random() * 15),
        color: metrics.color,
        bgColor: metrics.bgColor,
        borderColor: metrics.borderColor
      };
    }

    if (sectorId === 'healthcare') {
      const actualRevenue = getHealthcareRevenue();
      const establishedFacilities = JSON.parse(localStorage.getItem('healthcareFacilities') || '[]').filter((facility: any) => facility.established);
      const progress = Math.min(100, (establishedFacilities.length / 5) * 100);
      
      return {
        progress: Math.round(progress),
        monthlyRevenue: actualRevenue,
        customerSatisfaction: 80 + Math.floor(Math.random() * 15),
        color: metrics.color,
        bgColor: metrics.bgColor,
        borderColor: metrics.borderColor
      };
    }

    if (sectorId === 'ecommerce') {
      const actualRevenue = getEcommerceRevenue();
      const activeChannels = JSON.parse(localStorage.getItem('ecommerceChannels') || '[]').filter((channel: any) => channel.active);
      const progress = Math.min(100, (activeChannels.length / 5) * 100);
      
      return {
        progress: Math.round(progress),
        monthlyRevenue: actualRevenue,
        customerSatisfaction: 70 + Math.floor(Math.random() * 20),
        color: metrics.color,
        bgColor: metrics.bgColor,
        borderColor: metrics.borderColor
      };
    }

    if (sectorId === 'tech_startups') {
      const actualRevenue = getTechStartupRevenue();
      const launchedProducts = JSON.parse(localStorage.getItem('techStartupProducts') || '[]').filter((product: any) => product.launched);
      const progress = Math.min(100, (launchedProducts.length / 5) * 100);
      
      return {
        progress: Math.round(progress),
        monthlyRevenue: actualRevenue,
        customerSatisfaction: 65 + Math.floor(Math.random() * 25),
        color: metrics.color,
        bgColor: metrics.bgColor,
        borderColor: metrics.borderColor
      };
    }

    // Calculate progress based on how long sector has been owned (simulate time)
    const daysSinceOwned = Math.floor(Math.random() * 30) + 1;
    const progress = Math.min(100, daysSinceOwned * metrics.progressRate / 10);

    // Calculate revenue based on progress and player stats
    const revenue = Math.floor(metrics.revenueMultiplier * (progress / 100) * (1 + playerStats.clarityXP / 200));

    // Calculate satisfaction with some randomness
    const satisfaction = Math.max(40, Math.min(100, 
      metrics.satisfactionBase + 
      (progress / 5) - 
      (playerStats.loopScore / 2) + 
      (Math.random() * 20 - 10)
    ));

    return {
      progress: Math.round(progress),
      monthlyRevenue: revenue,
      customerSatisfaction: Math.round(satisfaction),
      color: metrics.color,
      bgColor: metrics.bgColor,
      borderColor: metrics.borderColor
    };
  };

  const getSatisfactionEmoji = (satisfaction: number) => {
    if (satisfaction >= 80) return '😊';
    if (satisfaction >= 60) return '😐';
    if (satisfaction >= 40) return '😕';
    return '😞';
  };

  const getSatisfactionColor = (satisfaction: number) => {
    if (satisfaction >= 80) return 'text-green-600';
    if (satisfaction >= 60) return 'text-yellow-600';
    if (satisfaction >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-orange-500';
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

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          Business Portfolio
        </h1>
        <p className="text-gray-600 mb-4">
          Manage your active business sectors and track their performance
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <Badge className="flex items-center gap-2 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
            <Building2 className="h-4 w-4" />
            {purchasedSectors.length} Active Sectors
          </Badge>
          <Badge className="flex items-center gap-2 bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
            <DollarSign className="h-4 w-4" />
            Total Revenue: ₹{purchasedSectors.reduce((total, sectorId) => {
              const metrics = getBusinessMetrics(sectorId);
              return total + (metrics?.monthlyRevenue || 0);
            }, 0).toLocaleString()}/month
          </Badge>
        </div>
      </div>

      {/* No Sectors Message */}
      {purchasedSectors.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Business Sectors Yet</h3>
            <p className="text-gray-500 mb-6">
              Purchase sectors from the "Industry Sectors" tab to start building your business empire.
            </p>
            <Button variant="outline">
              Go to Sectors
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Business Sectors Grid */}
      {purchasedSectors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedSectors.map((sectorId) => {
            const sector = industrySectors.find(s => s.id === sectorId);
            const metrics = getBusinessMetrics(sectorId);
            
            if (!sector || !metrics) return null;

            return (
              <Card 
                key={sectorId}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer border-l-4 ${metrics.borderColor} ${metrics.bgColor}`}
                onClick={(e) => handleSectorClick(sectorId, e)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${metrics.bgColor} ${metrics.borderColor} border-2 flex items-center justify-center`}>
                        <span className="text-2xl">{sector.icon}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{sector.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          Active
                        </Badge>
                      </div>
                    </div>
                    <div className={`p-2 rounded-full ${metrics.color} hover:shadow-lg active:scale-95 transition-all duration-150 group`}>
                      <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-0.5 group-active:translate-x-1 transition-transform duration-150" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Progress</span>
                      <span className="font-bold">{metrics.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${metrics.color} transition-all duration-300`}
                        style={{ width: `${metrics.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Monthly Revenue */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Monthly Revenue</span>
                    </div>
                    <span className="text-lg font-bold text-green-700">
                      ₹{(metrics.monthlyRevenue / 1000).toFixed(1)}k
                    </span>
                  </div>

                  {/* Customer Satisfaction */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-800">Customer Satisfaction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getSatisfactionEmoji(metrics.customerSatisfaction)}</span>
                      <span className={`font-bold ${getSatisfactionColor(metrics.customerSatisfaction)}`}>
                        {metrics.customerSatisfaction}%
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <TrendingUp className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-blue-800 font-medium">
                        {metrics.progress > 75 ? 'Excellent' : 
                         metrics.progress > 50 ? 'Good' : 
                         metrics.progress > 25 ? 'Growing' : 'Starting'}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <Building2 className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-purple-800 font-medium">
                        {metrics.progress > 50 ? 'Established' : 'Developing'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {purchasedSectors.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Portfolio Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {purchasedSectors.length}
                </p>
                <p className="text-sm text-blue-800">Active Sectors</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  ₹{(purchasedSectors.reduce((total, sectorId) => {
                    const metrics = getBusinessMetrics(sectorId);
                    return total + (metrics?.monthlyRevenue || 0);
                  }, 0) / 1000).toFixed(1)}k
                </p>
                <p className="text-sm text-green-800">Monthly Revenue</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {Math.round(purchasedSectors.reduce((total, sectorId) => {
                    const metrics = getBusinessMetrics(sectorId);
                    return total + (metrics?.progress || 0);
                  }, 0) / purchasedSectors.length) || 0}%
                </p>
                <p className="text-sm text-yellow-800">Avg Progress</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(purchasedSectors.reduce((total, sectorId) => {
                    const metrics = getBusinessMetrics(sectorId);
                    return total + (metrics?.customerSatisfaction || 0);
                  }, 0) / purchasedSectors.length) || 0}%
                </p>
                <p className="text-sm text-purple-800">Avg Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}