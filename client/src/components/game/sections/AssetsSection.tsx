import React, { useState, useEffect } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { TrendingUp, TrendingDown, Home, Car, Briefcase, Smartphone, Laptop, Building } from 'lucide-react';

const formatMoney = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  } else {
    return `₹${amount.toLocaleString()}`;
  }
};

const AssetsSection: React.FC = () => {
  const { financialData, purchasedItems, storeItems } = useWealthSprintGame();
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'liabilities'>('overview');

  // Convert purchased store items to assets with detailed information
  const assets = (purchasedItems || []).map(purchasedItem => {
    const storeItem = (storeItems || []).find(item => item.id === purchasedItem.storeItemId);
    if (!storeItem) return null;

    return {
      id: purchasedItem.id,
      name: storeItem.name,
      category: storeItem.category,
      value: storeItem.price,
      monthlyIncome: storeItem.monthlyIncome,
      purchaseDate: new Date(purchasedItem.purchaseDate),
      description: storeItem.description,
      image: storeItem.image,
      roi: ((storeItem.monthlyIncome * 12) / storeItem.price * 100)
    };
  }).filter(Boolean);

  // Sample liabilities data (you can replace with actual data)
  const liabilities = [
    {
      id: 'liability_1',
      name: 'Home Loan',
      amount: 4500000,
      monthlyEMI: 35000,
      interestRate: 8.5,
      remainingMonths: 180,
      description: 'Housing loan for property investment',
      icon: '🏠'
    },
    {
      id: 'liability_2',
      name: 'Vehicle Loan',
      amount: 800000,
      monthlyEMI: 18000,
      interestRate: 9.2,
      remainingMonths: 36,
      description: 'Auto loan for personal vehicle',
      icon: '🚗'
    }
  ];

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
  const netWorth = totalAssets - totalLiabilities;
  const totalMonthlyIncome = assets.reduce((sum, asset) => sum + asset.monthlyIncome, 0);
  const totalMonthlyEMI = liabilities.reduce((sum, liability) => sum + liability.monthlyEMI, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Real Estate': return <Home size={20} />;
      case 'Transport': return <Car size={20} />;
      case 'Tech': return <Laptop size={20} />;
      case 'Business': return <Briefcase size={20} />;
      default: return <Building size={20} />;
    }
  };

  return (
    <div 
      className="min-h-screen p-4"
      style={{ backgroundColor: '#faf8f3' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#3a3a3a' }}>
          Assets & Liabilities
        </h1>
        <div 
          className="px-4 py-2 rounded-xl font-semibold"
          style={{ 
            backgroundColor: netWorth >= 0 ? '#22C55E' : '#EF4444',
            color: '#ffffff'
          }}
        >
          Net Worth: {formatMoney(netWorth)}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {['overview', 'assets', 'liabilities'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className="px-4 py-2 rounded-xl font-medium capitalize transition-all"
            style={{
              backgroundColor: activeTab === tab ? '#4F9CF9' : '#ffffff',
              color: activeTab === tab ? '#ffffff' : '#3a3a3a',
              border: '1px solid #e8dcc6'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className="rounded-xl p-6"
              style={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e8dcc6',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={24} style={{ color: '#22C55E' }} />
                <h3 className="font-semibold" style={{ color: '#3a3a3a' }}>Total Assets</h3>
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: '#3a3a3a' }}>
                {formatMoney(totalAssets)}
              </div>
              <div className="text-sm" style={{ color: '#9333EA' }}>
                Monthly Income: {formatMoney(totalMonthlyIncome)}
              </div>
            </div>

            <div 
              className="rounded-xl p-6"
              style={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e8dcc6',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown size={24} style={{ color: '#EF4444' }} />
                <h3 className="font-semibold" style={{ color: '#3a3a3a' }}>Total Liabilities</h3>
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: '#3a3a3a' }}>
                {formatMoney(totalLiabilities)}
              </div>
              <div className="text-sm" style={{ color: '#EF4444' }}>
                Monthly EMI: {formatMoney(totalMonthlyEMI)}
              </div>
            </div>

            <div 
              className="rounded-xl p-6"
              style={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e8dcc6',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Building size={24} style={{ color: '#4F9CF9' }} />
                <h3 className="font-semibold" style={{ color: '#3a3a3a' }}>Net Worth</h3>
              </div>
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: netWorth >= 0 ? '#22C55E' : '#EF4444' }}
              >
                {formatMoney(netWorth)}
              </div>
              <div className="text-sm" style={{ color: '#666' }}>
                Assets - Liabilities
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          {assets.length === 0 ? (
            <div 
              className="rounded-xl p-8 text-center"
              style={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e8dcc6'
              }}
            >
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#3a3a3a' }}>
                No Assets Yet
              </h3>
              <p style={{ color: '#666' }}>
                Start building your wealth by purchasing assets from the Store section
              </p>
            </div>
          ) : (
            assets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-xl p-4"
                style={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e8dcc6',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Asset Icon */}
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: '#faf8f3', border: '1px solid #e8dcc6' }}
                  >
                    {asset.image}
                  </div>

                  {/* Asset Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: '#3a3a3a' }}>
                          {asset.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getCategoryIcon(asset.category)}
                          <span className="text-sm" style={{ color: '#666' }}>
                            {asset.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl" style={{ color: '#3a3a3a' }}>
                          {formatMoney(asset.value)}
                        </div>
                        <div className="text-sm" style={{ color: '#22C55E' }}>
                          {asset.roi.toFixed(1)}% ROI
                        </div>
                      </div>
                    </div>

                    <p className="text-sm mb-3" style={{ color: '#666' }}>
                      {asset.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div 
                        className="px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{ backgroundColor: '#ffffff', color: '#9333EA', border: '1px solid #e8dcc6' }}
                      >
                        +{formatMoney(asset.monthlyIncome)}/month
                      </div>
                      <div className="text-sm" style={{ color: '#666' }}>
                        Purchased: {asset.purchaseDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Liabilities Tab */}
      {activeTab === 'liabilities' && (
        <div className="space-y-4">
          {liabilities.map((liability) => (
            <div
              key={liability.id}
              className="rounded-xl p-4"
              style={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e8dcc6',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div className="flex items-start gap-4">
                {/* Liability Icon */}
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: '#faf8f3', border: '1px solid #e8dcc6' }}
                >
                  {liability.icon}
                </div>

                {/* Liability Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: '#3a3a3a' }}>
                        {liability.name}
                      </h3>
                      <div className="text-sm" style={{ color: '#666' }}>
                        {liability.interestRate}% Interest Rate
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl" style={{ color: '#EF4444' }}>
                        {formatMoney(liability.amount)}
                      </div>
                      <div className="text-sm" style={{ color: '#666' }}>
                        Outstanding
                      </div>
                    </div>
                  </div>

                  <p className="text-sm mb-3" style={{ color: '#666' }}>
                    {liability.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div 
                      className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ backgroundColor: '#ffffff', color: '#EF4444', border: '1px solid #e8dcc6' }}
                    >
                      -{formatMoney(liability.monthlyEMI)}/month
                    </div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      {liability.remainingMonths} months remaining
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetsSection;