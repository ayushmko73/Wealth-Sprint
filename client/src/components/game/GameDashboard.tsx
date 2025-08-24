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
import NewSettingsSection from './sections/NewSettingsSection';
import RevenueSection from './sections/RevenueSection';
import EnhancedTeamSection from './sections/EnhancedTeamSection';
import IndustrySectorsSection from './sections/IndustrySectorsSection';
import BusinessSection from './sections/BusinessSection';
import NewDataSection from './sections/NewDataSection';
import StoreSection from './sections/StoreSection';

import TeamManagementSection from './sections/TeamManagementSection';
import { DecisionManager } from './decisions';

import ProfessionalStockMarket from './ProfessionalStockMarket';
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

    { id: 'team_management', label: 'Team Mgmt', icon: UserCog },
    { id: 'industry_sectors', label: 'Sectors', icon: Briefcase },
    { id: 'data_hub', label: 'Data Hub', icon: BarChart3 },
    { id: 'business_deals', label: 'Deals', icon: Briefcase },
    { id: 'strategy_hub', label: 'Strategy', icon: Target },
    { id: 'assets', label: 'Assets', icon: TrendingUp },
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

      case 'team_management':
        return <TeamManagementSection />;
      case 'industry_sectors':
        return <IndustrySectorsSection />;
      case 'data_hub':
        return <NewDataSection />;
      case 'business_deals':
        return <DealsSection />;
      case 'strategy_hub':
        return <StrategyHubSection />;
      case 'assets':
        return <AssetsSection />;
      case 'settings':
        return <NewSettingsSection />;
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

  // Financial independence is now just a milestone, not game end
  // Game continues with new challenges and opportunities

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

      {/* Completely New Modern Navigation Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex">
          {/* Menu Overlay */}
          <div 
            className="flex-1" 
            onClick={() => setMenuOpen(false)}
          />
          
          {/* New Slide-in Menu Panel */}
          <div className="bg-white w-80 h-full shadow-2xl transform transition-all duration-300 ease-out">
            {/* Menu Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Navigation</h2>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="text-sm text-indigo-100">Select your destination</div>
            </div>
            
            {/* Menu Content */}
            <div className="h-full overflow-y-auto pb-20">
              {/* Primary Navigation Section */}
              <div className="p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Core Features</h3>
                <div className="space-y-2">
                  {navigationItems.slice(0, 6).map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          setMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          isActive ? 'bg-white/20' : 'bg-white'
                        }`}>
                          <Icon size={20} className={isActive ? 'text-white' : 'text-blue-600'} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-800'}`}>
                            {item.label}
                          </div>
                          <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                            {item.id === 'dashboard' && 'Overview & Analytics'}
                            {item.id === 'business' && 'Business Management'}
                            {item.id === 'cashflow' && 'Financial Flow'}
                            {item.id === 'stock_market' && 'Market Trading'}
                            {item.id === 'bonds' && 'Fixed Income'}
                            {item.id === 'revenue' && 'Revenue Analytics'}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Advanced Features Section */}
              <div className="p-4 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Advanced Tools</h3>
                <div className="space-y-2">
                  {navigationItems.slice(6).map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          setMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md' 
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          isActive ? 'bg-white/20' : 'bg-white'
                        }`}>
                          <Icon size={18} className={isActive ? 'text-white' : 'text-emerald-600'} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-800'}`}>
                            {item.label}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Quick Stats Section */}
              <div className="p-4 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg text-white">
                    <div className="text-xs text-blue-100">Balance</div>
                    <div className="font-bold text-sm">{formatIndianCurrency(financialData.bankBalance)}</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg text-white">
                    <div className="text-xs text-green-100">FI Progress</div>
                    <div className="font-bold text-sm">
                      {Math.round((financialData.sideIncome / financialData.monthlyExpenses) * 100)}%
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg text-white">
                    <div className="text-xs text-purple-100">Week</div>
                    <div className="font-bold text-sm">{currentWeek}</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-lg text-white">
                    <div className="text-xs text-orange-100">Karma</div>
                    <div className="font-bold text-sm">{playerStats.karma}</div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-gray-100 text-center">
                <div className="text-xs text-gray-400">Wealth Sprint v2.0</div>
                <div className="text-xs text-gray-500 mt-1">Build your financial future</div>
              </div>
            </div>
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
      
    </div>
  );
};

export default GameDashboard;
