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
  CheckCircle
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

  // All sectors are now unlocked and available for purchase with money
  const unlockedSectors = industrySectors;

  const handleSectorPurchase = (sectorId: string) => {
    const sector = industrySectors.find(s => s.id === sectorId);
    if (!sector) return;

    // Check if already purchased
    if (purchasedSectors.includes(sectorId)) return;

    // Check if player has enough money (₹2L = 200,000)
    if (financialData.bankBalance < 200000) return;

    // Simple one-click purchase
    purchaseSector(sectorId);
  };

  const getUnlockRequirementsText = (sector: any) => {
    // Since all sectors are now unlockable with money only, return simple text
    return `Only ₹2L needed`;
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Industry Sectors</h1>
        <p className="text-gray-600 mb-4">
          Build your empire across multiple sectors. Each sector costs ₹2L to purchase.
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span>Bank Balance: ₹{(financialData.bankBalance / 100000).toFixed(1)}L</span>
          </div>
        </div>
      </div>

      {/* Purchased Sectors Section */}
      {purchasedSectors.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              My Sectors ({purchasedSectors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchasedSectors.map((sectorId) => {
                const sector = industrySectors.find(s => s.id === sectorId);
                if (!sector) return null;
                
                return (
                  <Card key={`owned-${sector.id}`} className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">{sector.icon}</div>
                        <div>
                          <h4 className="font-semibold text-green-800">{sector.name}</h4>
                          <p className="text-xs text-green-600">Owned</p>
                        </div>
                      </div>
                      <p className="text-sm text-green-700 line-clamp-2">
                        {sector.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Sectors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Available Sectors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industrySectors.map((sector, index) => {
              const isUnlocked = unlockedSectors.some(s => s.id === sector.id);
              const isPurchased = purchasedSectors.includes(sector.id);

              return (
                <Card 
                  key={sector.id}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    isPurchased 
                      ? 'opacity-50 bg-gray-100' 
                      : 'hover:shadow-xl hover:scale-105 border-green-200 bg-gradient-to-br from-white to-green-50'
                  }`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    {isPurchased ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Owned
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Unlock className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl">{sector.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{sector.name}</CardTitle>
                        <p className="text-xs text-gray-500">Sector {index + 1}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {sector.description}
                    </p>

                    {/* Action Button */}
                    <div className="pt-2">
                      {isPurchased ? (
                        <Button variant="outline" size="sm" disabled className="w-full">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Already Owned
                        </Button>
                      ) : isUnlocked ? (
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleSectorPurchase(sector.id)}
                          disabled={financialData.bankBalance < 200000}
                        >
                          <Briefcase className="h-4 w-4 mr-2" />
                          Buy for ₹2L
                        </Button>
                      ) : (
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleSectorPurchase(sector.id)}
                          disabled={financialData.bankBalance < 200000}
                        >
                          {financialData.bankBalance < 200000 ? (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Need ₹2L
                            </>
                          ) : (
                            <>
                              <Briefcase className="h-4 w-4 mr-2" />
                              Buy for ₹2L
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}