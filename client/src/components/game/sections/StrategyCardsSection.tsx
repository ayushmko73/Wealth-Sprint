import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Shield, 
  Sword, 
  Heart, 
  Brain, 
  Star, 
  AlertTriangle, 
  CheckCircle,
  Users,
  TrendingUp,
  Target,
  Zap,
  Award,
  Lock
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { strategyCards, loopBosses, getAvailableStrategyCards } from '@/lib/data/industrySectors';

export default function StrategyCardsSection() {
  const { 
    playerStats,
    defeatLoopBoss,
    useStrategyCard,
    earnStrategyCard,
    addGameEvent
  } = useWealthSprintGame();

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedBoss, setSelectedBoss] = useState<string | null>(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showBossDetails, setShowBossDetails] = useState(false);

  const availableCards = getAvailableStrategyCards(playerStats, playerStats.defeatedBosses);
  const ownedCards = strategyCards.filter(card => playerStats.strategyCards.includes(card.id));
  const activeBosses = loopBosses.filter(boss => !playerStats.defeatedBosses.includes(boss.id));

  const getCardTypeColor = (type: string) => {
    const colors = {
      'reflection': 'bg-blue-100 text-blue-800 border-blue-200',
      'delegation': 'bg-green-100 text-green-800 border-green-200',
      'forgiveness': 'bg-purple-100 text-purple-800 border-purple-200',
      'humility': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'values': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCardTypeIcon = (type: string) => {
    const icons = {
      'reflection': Brain,
      'delegation': Users,
      'forgiveness': Heart,
      'humility': Shield,
      'values': Star
    };
    return icons[type as keyof typeof icons] || Brain;
  };

  const getBossTypeColor = (type: string) => {
    const colors = {
      'burnout': 'bg-red-100 text-red-800 border-red-300',
      'betrayal': 'bg-orange-100 text-orange-800 border-orange-300',
      'self_doubt': 'bg-purple-100 text-purple-800 border-purple-300',
      'ego': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'greed': 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const checkBossTriggered = (boss: any) => {
    const { triggerConditions } = boss;
    let triggered = true;

    if (triggerConditions.stress && playerStats.stress < triggerConditions.stress) triggered = false;
    if (triggerConditions.emotion && playerStats.emotion > triggerConditions.emotion) triggered = false;
    if (triggerConditions.karma && playerStats.karma > triggerConditions.karma) triggered = false;
    if (triggerConditions.loopScore && playerStats.loopScore < triggerConditions.loopScore) triggered = false;

    return triggered;
  };

  const handleUseCard = (cardId: string) => {
    const success = useStrategyCard(cardId);
    if (success) {
      addGameEvent({
        id: `strategy_card_used_${cardId}_${Date.now()}`,
        type: 'achievement',
        title: 'Strategy Card Applied',
        description: `Successfully used ${strategyCards.find(c => c.id === cardId)?.name}`,
        timestamp: new Date()
      });
    }
    setShowCardDetails(false);
  };

  const handleFightBoss = (bossId: string, cardId?: string) => {
    defeatLoopBoss(bossId, cardId);
    setShowBossDetails(false);
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Strategy Cards & Loop Bosses</h1>
        <p className="text-gray-600 mb-4">
          Convert emotional struggles into strategic advantages
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-blue-500" />
            <span>Cards Owned: {ownedCards.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Bosses Defeated: {playerStats.defeatedBosses.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span>Active Threats: {activeBosses.filter(boss => checkBossTriggered(boss)).length}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cards">My Cards</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="bosses">Loop Bosses</TabsTrigger>
          <TabsTrigger value="defeated">Victories</TabsTrigger>
        </TabsList>

        {/* Owned Strategy Cards */}
        <TabsContent value="cards" className="space-y-4">
          {ownedCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownedCards.map((card) => {
                const CardIcon = getCardTypeIcon(card.type);
                return (
                  <Card 
                    key={card.id}
                    className={`relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105 ${getCardTypeColor(card.type)}`}
                    onClick={() => {
                      setSelectedCard(card.id);
                      setShowCardDetails(true);
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardIcon className="h-5 w-5" />
                          <CardTitle className="text-lg">{card.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {card.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm">{card.description}</p>
                      
                      {/* Card Effects Preview */}
                      <div className="space-y-2">
                        {card.effects.playerStats && (
                          <div className="text-xs space-y-1">
                            {Object.entries(card.effects.playerStats).map(([stat, value]) => (
                              <div key={stat} className="flex justify-between">
                                <span className="capitalize">{stat}:</span>
                                <span className={value as number > 0 ? 'text-green-600' : 'text-red-600'}>
                                  {value as number > 0 ? '+' : ''}{value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {card.effects.teamBonus && (
                          <div className="text-xs flex justify-between">
                            <span>Team Bonus:</span>
                            <span className="text-blue-600">+{card.effects.teamBonus}%</span>
                          </div>
                        )}
                      </div>

                      <Button size="sm" className="w-full" onClick={(e) => {
                        e.stopPropagation();
                        handleUseCard(card.id);
                      }}>
                        Use Card
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Strategy Cards Yet</h3>
              <p className="text-gray-500">
                Earn cards by gaining Clarity XP, defeating loop bosses, and demonstrating emotional growth.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Available Cards to Unlock */}
        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableCards.filter(card => !playerStats.strategyCards.includes(card.id)).map((card) => {
              const CardIcon = getCardTypeIcon(card.type);
              const canUnlock = true; // They're available if they show up here
              
              return (
                <Card 
                  key={card.id}
                  className={`relative overflow-hidden ${canUnlock ? 'border-green-200 hover:shadow-lg cursor-pointer' : 'border-gray-200 opacity-75'}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardIcon className="h-5 w-5" />
                        <CardTitle className="text-lg">{card.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {card.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{card.description}</p>
                    
                    {/* Unlock Requirements */}
                    <div className="text-xs text-gray-500 space-y-1">
                      {card.unlockConditions.clarityXP && (
                        <div className="flex justify-between">
                          <span>Clarity XP Required:</span>
                          <span>{card.unlockConditions.clarityXP}</span>
                        </div>
                      )}
                      {card.unlockConditions.defeatedBosses && (
                        <div className="flex justify-between">
                          <span>Defeat Boss:</span>
                          <span>{card.unlockConditions.defeatedBosses[0]}</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full" 
                      onClick={() => {
                        earnStrategyCard(card.id);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Unlock Card
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Active Loop Bosses */}
        <TabsContent value="bosses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBosses.map((boss) => {
              const isTriggered = checkBossTriggered(boss);
              const counterCards = boss.counterCards.filter(cardId => 
                playerStats.strategyCards.includes(cardId)
              );
              
              return (
                <Card 
                  key={boss.id}
                  className={`relative overflow-hidden ${
                    isTriggered 
                      ? 'border-red-300 bg-gradient-to-br from-red-50 to-red-100' 
                      : 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{boss.name}</CardTitle>
                      <Badge className={getBossTypeColor(boss.type)}>
                        {boss.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    {isTriggered && (
                      <Badge className="bg-red-100 text-red-800 w-fit">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        ACTIVE THREAT
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{boss.description}</p>
                    
                    {/* Trigger Conditions */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Trigger Conditions:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {boss.triggerConditions.stress && (
                          <div className={`p-2 rounded ${playerStats.stress >= boss.triggerConditions.stress ? 'bg-red-100' : 'bg-gray-50'}`}>
                            Stress ≥ {boss.triggerConditions.stress} 
                            <span className="float-right">{playerStats.stress}</span>
                          </div>
                        )}
                        {boss.triggerConditions.emotion && (
                          <div className={`p-2 rounded ${playerStats.emotion <= boss.triggerConditions.emotion ? 'bg-red-100' : 'bg-gray-50'}`}>
                            Emotion ≤ {boss.triggerConditions.emotion}
                            <span className="float-right">{playerStats.emotion}</span>
                          </div>
                        )}
                        {boss.triggerConditions.karma && (
                          <div className={`p-2 rounded ${playerStats.karma <= boss.triggerConditions.karma ? 'bg-red-100' : 'bg-gray-50'}`}>
                            Karma ≤ {boss.triggerConditions.karma}
                            <span className="float-right">{playerStats.karma}</span>
                          </div>
                        )}
                        {boss.triggerConditions.loopScore && (
                          <div className={`p-2 rounded ${playerStats.loopScore >= boss.triggerConditions.loopScore ? 'bg-red-100' : 'bg-gray-50'}`}>
                            Loop Score ≥ {boss.triggerConditions.loopScore}
                            <span className="float-right">{playerStats.loopScore}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Counter Cards */}
                    {counterCards.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Available Counter Cards:</h4>
                        <div className="space-y-1">
                          {counterCards.map(cardId => {
                            const card = strategyCards.find(c => c.id === cardId);
                            return card ? (
                              <div key={cardId} className="flex justify-between items-center text-xs bg-green-50 p-2 rounded">
                                <span>{card.name}</span>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleFightBoss(boss.id, cardId)}
                                >
                                  Use
                                </Button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedBoss(boss.id);
                          setShowBossDetails(true);
                        }}
                      >
                        Details
                      </Button>
                      {isTriggered && (
                        <Button 
                          size="sm" 
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          onClick={() => handleFightBoss(boss.id)}
                        >
                          <Sword className="h-4 w-4 mr-2" />
                          Fight
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Defeated Bosses */}
        <TabsContent value="defeated" className="space-y-4">
          {playerStats.defeatedBosses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playerStats.defeatedBosses.map((bossId) => {
                const boss = loopBosses.find(b => b.id === bossId);
                if (!boss) return null;
                
                return (
                  <Card key={bossId} className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{boss.name}</CardTitle>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Defeated
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{boss.description}</p>
                      <div className="text-xs text-green-700">
                        ✓ Gained 100 Clarity XP<br/>
                        ✓ Reduced Loop Score by 30<br/>
                        ✓ Unlocked new Strategy Cards
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Victories Yet</h3>
              <p className="text-gray-500">
                Defeat your first loop boss to start building emotional resilience.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Card Details Modal */}
      <Dialog open={showCardDetails} onOpenChange={setShowCardDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCard && strategyCards.find(c => c.id === selectedCard)?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4">
              {/* Card details content */}
              <Button onClick={() => handleUseCard(selectedCard)}>
                Use This Card
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Boss Details Modal */}
      <Dialog open={showBossDetails} onOpenChange={setShowBossDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBoss && loopBosses.find(b => b.id === selectedBoss)?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedBoss && (
            <div className="space-y-4">
              {/* Boss details content */}
              <Button onClick={() => handleFightBoss(selectedBoss)}>
                Fight This Boss
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}