import React from 'react';
import { X, BarChart3, TrendingUp, Shield, Building, Users, Handshake, Target, Package, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'cashflow', label: 'Cashflow Statement', icon: TrendingUp },
  { id: 'stocks', label: 'Stocks', icon: TrendingUp },
  { id: 'bonds', label: 'Bonds', icon: Shield },
  { id: 'bank', label: 'Bank', icon: Building },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'business_deals', label: 'Business Deals', icon: Handshake },
  { id: 'strategy_hub', label: 'Strategy Hub', icon: Target },
  { id: 'assets', label: 'Assets', icon: Package },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeSection, onSectionChange }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#3a3a3a]">Wealth Sprint</h2>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-2
                  ${activeSection === item.id 
                    ? 'bg-[#d4af37] text-white' 
                    : 'text-[#3a3a3a] hover:bg-gray-100'
                  }
                `}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
