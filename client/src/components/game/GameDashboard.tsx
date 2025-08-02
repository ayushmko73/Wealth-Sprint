import React, { useState, useEffect } from 'react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { useTeamManagement } from '../../lib/stores/useTeamManagement';
import { useAudio } from '../../lib/stores/useAudio';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { formatIndianCurrency } from '../../lib/utils';
import StartScreen from './components/StartScreen';
import GameplayContent from './components/GameplayContent';
import CyberModeButton from './components/CyberModeButton';
import ScenarioEngine from './ScenarioEngine';
import DashboardBar from './DashboardBar';
import InvestmentTable from './InvestmentTable';
import RevenueOverview from './RevenueOverview';
import SoundManager from './components/SoundManager';
import NotificationCenter from './NotificationCenter';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Menu, 
  X, 
  Home, 
  TrendingUp, 
  DollarSign, 
  PiggyBank, 
  Users, 
  Briefcase, 
  Target, 
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Heart,
  Brain,
  Scale,
  AlertTriangle,
  Star,
  Battery,
  Activity
} from 'lucide-react';
import TaskPanel from './TaskPanel';
import WealthTracker from './WealthTracker';
import CashflowSection from './sections/CashflowSection';
import StocksSection from './sections/StocksSection';
import BondsSection from './sections/BondsSection';
import BankSection from './sections/BankSection';

import BusinessDealsSection from './sections/BusinessDealsSection';
import StrategyHubSection from './sections/StrategyHubSection';
import AssetsSection from './sections/AssetsSection';
import SettingsSection from './sections/SettingsSection';
import RevenueSection from './sections/RevenueSection';
import EnhancedTeamSection from './sections/EnhancedTeamSection';
import IndustrySectorsSection from './sections/IndustrySectorsSection';
import StrategyCardsSection from './sections/StrategyCardsSection';
import EliteHiringSection from './EliteHiringSection';

import EnhancedStockMarket from './EnhancedStockMarket';
import SageAI from './GorkAI';

const GameDashboard: React.FC = () => {
  const { financialData, playerStats, currentWeek, currentDay, gameStarted, advanceTime } = useWealthSprintGame();
  const { initializeTeam } = useTeamManagement();
  const isMobile = useIsMobile();
  
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize team and audio
    initializeTeam();
    
    // Initialize audio automatically on game start
    const { initializeAudio, playBackgroundMusic } = useAudio.getState();
    initializeAudio();
    
    // Start background music automatically after a brief delay
    setTimeout(() => {
      playBackgroundMusic();
    }, 1000);
  }, [initializeTeam]);

  // Auto time progression at 24x speed - runs every 150 seconds (real time)
  // This equals 2.5 minutes real time = 1 in-game day (576x faster than real time)
  useEffect(() => {
    const timeProgressionInterval = setInterval(() => {
      if (gameStarted) {
        advanceTime();
      }
    }, 150000); // 150000 ms = 2.5 minutes = 1 in-game day

    return () => clearInterval(timeProgressionInterval);
  }, [gameStarted, advanceTime]);



  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'cashflow', label: 'Cashflow', icon: DollarSign },
    { id: 'stock_market', label: 'Stock Market', icon: TrendingUp },
    { id: 'bonds', label: 'Bonds', icon: PiggyBank },
    { id: 'revenue', label: '5-Year Revenue', icon: BarChart3 },
    { id: 'bank', label: 'Banking', icon: PiggyBank },
    { id: 'team_hiring', label: 'Elite Hiring', icon: Users },
    { id: 'industry_sectors', label: 'Sectors', icon: Briefcase },
    { id: 'strategy_cards', label: 'Cards', icon: Target },
    { id: 'business_deals', label: 'Deals', icon: Briefcase },
    { id: 'strategy_hub', label: 'Strategy', icon: Target },
    { id: 'assets', label: 'Assets', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderMainContent = () => {
    switch (activeSection) {
      case 'cashflow':
        return <CashflowSection />;
      case 'stock_market':
        return <EnhancedStockMarket />;
      case 'bonds':
        return <BondsSection />;
      case 'revenue':
        return <RevenueOverview />;
      case 'bank':
        return <BankSection />;
      case 'team_hiring':
        return <EliteHiringSection onClose={() => setActiveSection('dashboard')} />;
      case 'industry_sectors':
        return <IndustrySectorsSection />;
      case 'strategy_cards':
        return <StrategyCardsSection />;
      case 'business_deals':
        return <BusinessDealsSection />;
      case 'strategy_hub':
        return <StrategyHubSection />;
      case 'assets':
        return <AssetsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return (
          <div className="space-y-6">
            <DashboardBar />
            <ScenarioEngine />
          </div>
        );
    }
  };

  // Show start screen if game hasn't started yet
  if (!gameStarted) {
    return <StartScreen />;
  }

  // Check for financial independence
  if (financialData.sideIncome >= financialData.monthlyExpenses) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#d4af37] to-[#f5f0e6] flex items-center justify-center p-4">
        <div className="text-center p-4 md:p-8 bg-white rounded-lg shadow-2xl max-w-2xl w-full">
          <h1 className="text-2xl md:text-4xl font-bold text-[#3a3a3a] mb-4">
            🎉 Game Over – You have achieved Financial Independence!
          </h1>
          <p className="text-lg md:text-xl text-[#3a3a3a] mb-8">
            Your side income of ₹{financialData.sideIncome.toLocaleString()} now covers your monthly expenses of ₹{financialData.monthlyExpenses.toLocaleString()}.
          </p>
          <p className="text-base md:text-lg text-[#3a3a3a] mb-8">
            Do you want to continue to the next level of life mastery?
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              className="bg-[#d4af37] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#b8941f] transition-colors"
              onClick={() => {/* Handle challenge mode */}}
            >
              YES – Challenge Mode
            </button>
            <button 
              className="bg-[#3a3a3a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a2a2a] transition-colors"
              onClick={() => {/* Handle restart */}}
            >
              NO – Restart Journey
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e6] flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <h1 className="text-lg font-bold text-[#3a3a3a]">Wealth Sprint</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Week {currentWeek}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Day {currentDay}
          </Badge>
        </div>
      </div>

      {/* Enhanced Stats Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-green-600" />
              <span className="text-gray-600">{formatIndianCurrency(financialData.bankBalance)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-red-500" />
              <span className="text-gray-600">{playerStats.emotion}</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-blue-500" />
              <span className="text-gray-600">{playerStats.logic}</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale size={16} className="text-purple-500" />
              <span className="text-gray-600">{playerStats.karma}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">FI Progress</div>
            <div className={`font-semibold ${financialData.sideIncome >= financialData.monthlyExpenses ? 'text-green-600' : 'text-gray-600'}`}>
              {Math.round((financialData.sideIncome / financialData.monthlyExpenses) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu (Mobile) */}
      {menuOpen && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="grid grid-cols-3 gap-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveSection(item.id);
                    setMenuOpen(false);
                  }}
                  className="flex flex-col items-center gap-1 h-auto py-2"
                >
                  <Icon size={16} />
                  <span className="text-xs">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto mobile-scroll">
        <div className="p-4 pb-20">
          {renderMainContent()}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
        <div className="flex items-center justify-around">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveSection(item.id)}
                className="flex flex-col items-center gap-1 h-auto py-2 px-3"
              >
                <Icon size={16} />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* Notification Center */}
      <NotificationCenter />
      
      {/* Sound Manager */}
      <SoundManager />
      

      
      {/* Sage AI Assistant */}
      <SageAI />
    </div>
  );
};

export default GameDashboard;
