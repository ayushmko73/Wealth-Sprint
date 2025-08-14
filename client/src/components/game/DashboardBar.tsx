import React from 'react';
import CompactDashboard from './CompactDashboard';

const DashboardBar: React.FC = () => {
  return (
    <div className="w-full h-full bg-white">
      <CompactDashboard />
    </div>
  );
};

export default DashboardBar;