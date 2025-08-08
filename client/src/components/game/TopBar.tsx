import React from 'react';
import { Menu, Calendar, Clock, Heart, Brain, Scale, Zap, TrendingUp } from 'lucide-react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { useAudio } from '../../lib/stores/useAudio';

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { currentWeek, currentDay, playerStats, advanceTime } = useWealthSprintGame();
  const { toggleMute, isMuted } = useAudio();

  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    if (value >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="border-b border-gray-200 p-4 flex items-center justify-between" style={{backgroundColor: '#75746E'}}>
      {/* Left side - Menu and Time */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#3a3a3a]" />
              <span className="text-sm font-medium text-[#3a3a3a]">
                Week {currentWeek}, Day {currentDay}
              </span>
            </div>
            
            <div className="flex items-center gap-2 bg-[#f5f0e6] px-3 py-1 rounded-lg">
              <Clock size={14} className="text-[#d4af37]" />
              <span className="text-xs text-gray-600">Auto 24× Speed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center - Player Stats */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Brain size={16} className={getStatColor(playerStats.logic)} />
          <span className="text-sm font-medium">Logic: {playerStats.logic}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Heart size={16} className={getStatColor(playerStats.emotion)} />
          <span className="text-sm font-medium">Emotion: {playerStats.emotion}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Scale size={16} className={getStatColor(playerStats.karma)} />
          <span className="text-sm font-medium">Karma: {playerStats.karma}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className={getStatColor(100 - playerStats.stress)} />
          <span className="text-sm font-medium">Stress: {playerStats.stress}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Zap size={16} className={getStatColor(playerStats.energy)} />
          <span className="text-sm font-medium">Energy: {playerStats.energy}</span>
        </div>
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMute}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
        
        <div className="text-sm text-[#3a3a3a]">
          <span className="font-medium">Wealth Sprint</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
