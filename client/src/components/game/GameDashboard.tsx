import React, { useState, useEffect } from 'react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { useTeamManagement } from '../../lib/stores/useTeamManagement';
import { useAudio } from '../../lib/stores/useAudio';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { formatIndianCurrency } from '../../lib/utils';
import StartScreen from './components/StartScreen';
import GameplayContent from './components/GameplayContent';
import CyberModeButton from './components/CyberModeButton';

import DashboardBar from './DashboardBar';
import CompactDashboard from './CompactDashboard';
import InvestmentTable from './InvestmentTable';

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
  UserCog,
  Briefcase, 
  Target, 
  Settings,
  BarChart3,
  TreePine,
  ChevronLeft,
  ChevronRight,
  Heart,
  Brain,
  Scale,
  AlertTriangle,
  Star,
  Battery,
  Activity,
  Building2,
  ShoppingCart
} from 'lucide-react';
import WealthTracker from './WealthTracker';
import CashflowSection from './sections/CashflowSection';
import StocksSection from './sections/StocksSection';
import BondsSection from './sections/BondsSection';
import BankSection from './sections/BankSection';

import DealsSection from './sections/DealsSection';
import StrategyHubSection from './sections/StrategyHubSection';
import AssetsSection from './sections/AssetsSection';
import PerformanceAnalyticsSection from './sections/PerformanceAnalyticsSection';
import RevenueSection from './sections/RevenueSection';
import EnhancedTeamSection from './sections/EnhancedTeamSection';
import IndustrySectorsSection from './sections/IndustrySectorsSection';
import BusinessSection from './sections/BusinessSection';
import StrategyCardsSection from './sections/StrategyCardsSection';
import StoreSection from './sections/StoreSection';

import AdvancedTeamManagement from './AdvancedTeamManagement';
import { DecisionManager } from './decisions';

import ProfessionalStockMarket from './ProfessionalStockMarket';
import SageAI from './GorkAI';
import NewSettings from './NewSettings';

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

  // Auto time progression: 1 real day = 24 game days
  // This runs every 1 hour in real time = 1 game day
  // So 24 hours real time = 24 game days = 1 game day cycle
  useEffect(() => {
    const timeProgressionInterval = setInterval(() => {
      if (gameStarted) {
        advanceTime();
      }
    }, 3600000); // 3600000 ms = 1 hour real time = 1 game day

    return () => clearInterval(timeProgressionInterval);
  }, [gameStarted, advanceTime]);



  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'business', label: 'Business', icon: Building2 },
    { id: 'cashflow', label: 'Cashflow', icon: DollarSign },
    { id: 'stock_market', label: 'Stock Market', icon: TrendingUp },
    { id: 'bonds', label: 'Bonds', icon: PiggyBank },
    { id: 'revenue', label: '5-Year Revenue', icon: BarChart3 },
    { id: 'bank', label: 'Banking', icon: PiggyBank },
    { id: 'store', label: 'Store', icon: ShoppingCart },

    { id: 'advanced_team', label: 'Team Mgmt', icon: UserCog },
    { id: 'industry_sectors', label: 'Sectors', icon: Briefcase },
    { id: 'strategy_cards', label: 'Cards', icon: Target },
    { id: 'business_deals', label: 'Deals', icon: Briefcase },
    { id: 'strategy_hub', label: 'Strategy', icon: Target },
    { id: 'assets', label: 'Assets', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderMainContent = () => {
    switch (activeSection) {
      case 'business':
        return <BusinessSection />;
      case 'cashflow':
        return <CashflowSection />;
      case 'stock_market':
        return <ProfessionalStockMarket />;
      case 'bonds':
        return <BondsSection />;
      case 'revenue':
        return <RevenueSection />;
      case 'bank':
        return <BankSection />;
      case 'store':
        return <StoreSection />;

      case 'advanced_team':
        return (
          <AdvancedTeamManagement 
            onClose={() => setActiveSection('dashboard')}
            onNavigateToSectors={() => setActiveSection('industry_sectors')}
          />
        );
      case 'industry_sectors':
        return <IndustrySectorsSection />;
      case 'strategy_cards':
        return <StrategyCardsSection />;
      case 'business_deals':
        return <DealsSection />;
      case 'strategy_hub':
        return <StrategyHubSection />;
      case 'assets':
        return <AssetsSection />;
      case 'analytics':
        return <PerformanceAnalyticsSection />;
      case 'settings':
        return <NewSettings onClose={() => setActiveSection('dashboard')} />;
      default:
        return (
          <div className="space-y-6">
            <DashboardBar />
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
      <div className="min-h-screen bg-gradient-to-br from-[#d4af37] to-[#f0ead6] flex items-center justify-center p-4">
        <div className="text-center p-4 md:p-8 bg-[#f0ead6] rounded-lg shadow-2xl max-w-2xl w-full">
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
    <div className="h-screen bg-white flex flex-col">
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
        <div className="bg-white border-b border-gray-200 px-2 py-3">
          <div className="grid grid-cols-3 gap-2">
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
                  className={`flex flex-col items-center gap-1 h-auto py-2 px-2 min-h-16 ${
                    activeSection === item.id 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'hover:bg-green-100 hover:text-green-700'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-xs text-center leading-tight">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto mobile-scroll bg-white">
        <div className="p-1 bg-white h-full">
          {renderMainContent()}
        </div>
      </div>

      {/* Notification Center */}
      <NotificationCenter />
      
      {/* Sound Manager */}
      <SoundManager />
      
      {/* Sage AI Assistant */}
      <SageAI />
      
      {/* Decision System Manager */}
      <DecisionManager />
    </div>
  );
};

export default GameDashboard;
