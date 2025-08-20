import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  DollarSign,
  Star,
  Lock,
  Unlock,
  CheckCircle,
  TrendingUp,
  Users,
  Building,
  Target
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { industrySectors, getUnlockedSectors } from '@/lib/data/industrySectors';

export default function IndustrySectorsSection() {
  const { 
    playerStats, 
    financialData,
    purchasedSectors,
    purchaseSector
  } = useWealthSprintGame();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Calculate unlocked sectors based on player progress
  const unlockedSectors = getUnlockedSectors(
    playerStats.clarityXP, 
    purchasedSectors.length,
    playerStats.loopScore
  );

  const handleSectorPurchase = (sectorId: string) => {
    const sector = industrySectors.find(s => s.id === sectorId);
    if (!sector) return;

    const isUnlocked = unlockedSectors.some(s => s.id === sectorId);
    if (!isUnlocked) return;

    if (purchasedSectors.includes(sectorId)) return;

    purchaseSector(sectorId);
  };

  const getUnlockRequirementsText = (sector: any) => {
    const missing = [];
    if (playerStats.clarityXP < sector.unlockRequirements.clarityXP) {
      missing.push(`${sector.unlockRequirements.clarityXP} Clarity XP`);
    }
    if (playerStats.loopScore > sector.unlockRequirements.maxLoopScore) {
      missing.push(`Max ${sector.unlockRequirements.maxLoopScore} Loop Score`);
    }
    return missing.join(', ');
  };

  // Category definitions for horizontal menu
  const categories = [
    { id: 'all', label: 'All Sectors', icon: Star },
    { id: 'tech', label: 'Technology', icon: TrendingUp },
    { id: 'business', label: 'Business', icon: Building },
    { id: 'consumer', label: 'Consumer', icon: Users },
    { id: 'market', label: 'Markets', icon: Target }
  ];

  const getCategoryForSector = (sectorId: string) => {
    const categoryMap: Record<string, string> = {
      'tech_startups': 'tech',
      'fast_food': 'consumer', 
      'ecommerce': 'business',
      'healthcare': 'business',
      'real_estate': 'market',
      'manufacturing': 'business'
    };
    return categoryMap[sectorId] || 'business';
  };

  const filteredSectors = activeCategory === 'all' 
    ? industrySectors 
    : industrySectors.filter(sector => getCategoryForSector(sector.id) === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Blue Header - Inspired by Bonds/Stock Market/Banking sections */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="px-4 py-4">
          {/* Main Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-15 rounded-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Industry Sectors</h1>
                <p className="text-blue-200 text-sm">Build your business empire • Multiple sector opportunities</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-15 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 text-white text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Balance: ₹{(financialData.bankBalance / 100000).toFixed(1)}L</span>
              </div>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-blue-200 text-xs">Owned Sectors</div>
                <div className="text-white font-bold text-lg">{purchasedSectors.length}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Available</div>
                <div className="text-green-300 font-bold text-lg">{unlockedSectors.length}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Total Value</div>
                <div className="text-yellow-300 font-bold text-lg">₹{(purchasedSectors.length * 2).toFixed(0)}L</div>
              </div>
            </div>
          </div>

          {/* Horizontal Categories Menu - Blue background with white text */}
          <div className="bg-blue-700 rounded-lg p-1">
            <div className="flex overflow-x-auto scrollbar-hide gap-1">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
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
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-6">
        {/* Purchased Sectors Grid */}
        {purchasedSectors.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              My Portfolio ({purchasedSectors.length} sectors)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchasedSectors.map((sectorId) => {
                const sector = industrySectors.find(s => s.id === sectorId);
                if (!sector) return null;
                
                return (
                  <Card key={`owned-${sector.id}`} className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">{sector.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-800">{sector.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600 text-white text-xs px-2 py-0.5">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Owned
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-green-700 line-clamp-2 mb-2">
                        {sector.description}
                      </p>
                      <div className="bg-green-200 rounded p-2">
                        <div className="text-xs text-green-800">Investment: ₹2L • Status: Active</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Sectors Grid */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Available Opportunities ({filteredSectors.length} sectors)
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSectors.map((sector, index) => {
              const isUnlocked = unlockedSectors.some(s => s.id === sector.id);
              const isPurchased = purchasedSectors.includes(sector.id);

              // Skip purchased sectors in this section
              if (isPurchased) return null;

              return (
                <Card 
                  key={sector.id}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    isUnlocked 
                      ? 'hover:shadow-xl hover:scale-105 border-blue-200 bg-gradient-to-br from-white to-blue-50' 
                      : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
                  }`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {isUnlocked ? (
                      <Badge className="bg-blue-600 text-white">
                        <Unlock className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-300 text-gray-600">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4 pt-12">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{sector.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{sector.name}</h4>
                        <p className="text-xs text-gray-500">Sector Investment</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {sector.description}
                    </p>

                    {/* Investment Details */}
                    <div className={`rounded-lg p-3 mb-4 ${
                      isUnlocked ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Investment:</span>
                          <div className="font-bold text-blue-700">₹2.00 Lakh</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Potential ROI:</span>
                          <div className="font-bold text-green-600">15-25%</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {isUnlocked ? (
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                        size="sm"
                        onClick={() => handleSectorPurchase(sector.id)}
                        disabled={financialData.bankBalance < 200000}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Invest ₹2 Lakh
                      </Button>
                    ) : (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-2">
                          Requirements: {getUnlockRequirementsText(sector)}
                        </p>
                        <Button variant="outline" size="sm" disabled className="w-full">
                          <Lock className="h-4 w-4 mr-2" />
                          Locked
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredSectors.filter(s => !purchasedSectors.includes(s.id)).length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">🎯</div>
              <p className="text-gray-500">No sectors available in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}