import React from 'react';

const StoreSection: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1E8' }}>
      <div className="text-center">
        <div className="text-4xl mb-4">🏪</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#8B4513' }}>
          Store Section
        </h2>
        <p style={{ color: '#A0522D' }}>
          Store functionality has been removed.
        </p>
      </div>
    </div>
  );
};

export default StoreSection;