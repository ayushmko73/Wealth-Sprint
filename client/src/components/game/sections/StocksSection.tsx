import React, { useState } from 'react';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Chart } from '../../ui/chart';
import { TrendingUp, TrendingDown, DollarSign, Activity, Eye } from 'lucide-react';

const StocksSection: React.FC = () => {
  const { financialData, updateFinancialData } = useWealthSprintGame();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [tradeQuantity, setTradeQuantity] = useState<number>(1);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  // Sample stocks data for now
  const stocks = [
    { code: 'AAPL', name: 'Apple Inc.', price: 150.00, change: 2.5, changePercent: 1.69, sector: 'Technology' },
    { code: 'GOOGL', name: 'Alphabet Inc.', price: 2500.00, change: -15.0, changePercent: -0.60, sector: 'Technology' },
    { code: 'MSFT', name: 'Microsoft Corp.', price: 300.00, change: 5.0, changePercent: 1.69, sector: 'Technology' },
  ];

  const selectedStockData = selectedStock ? stocks.find(s => s.code === selectedStock) : null;
  const portfolioValue = financialData.totalAssets;

  const handleTrade = () => {
    if (!selectedStockData || tradeQuantity <= 0) return;

    const tradeValue = selectedStockData.price * tradeQuantity;

    if (tradeType === 'buy') {
      if (financialData.bankBalance >= tradeValue) {
        updateFinancialData({ 
          bankBalance: financialData.bankBalance - tradeValue,
          totalAssets: financialData.totalAssets + tradeValue,
        });
      }
    } else {
      updateFinancialData({ 
        bankBalance: financialData.bankBalance + tradeValue,
        totalAssets: financialData.totalAssets - tradeValue,
      });
    }
    
    setTradeQuantity(1);
  };

  const getVolatilityColor = (volatility: string) => {
    switch (volatility) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'very_high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const portfolioData = {
    labels: stocks.map(s => s.code),
    datasets: [
      {
        label: 'Portfolio Value',
        data: stocks.map(s => s.price / 100), // Scaled down for visualization
        backgroundColor: ['#d4af37', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-[#3a3a3a]">Stock Market</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Activity size={16} />
            <span className="text-sm">Market Sentiment: </span>
            <Badge className={marketSentiment >= 0 ? 'bg-green-500' : 'bg-red-500'}>
              {marketSentiment >= 0 ? 'Bullish' : 'Bearish'}
            </Badge>
          </div>
          <div className="text-sm font-medium">
            Portfolio Value: ₹{portfolioValue.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Watchlist */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Watchlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stocks.map((stock) => (
                <button
                  key={stock.code}
                  onClick={() => setSelectedStock(stock.code)}
                  className={`w-full p-3 rounded-lg text-left hover:bg-gray-50 transition-colors ${
                    selectedStock === stock.code ? 'bg-[#d4af37] text-white' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{stock.code}</div>
                      <div className="text-sm opacity-70">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{stock.price.toFixed(2)}</div>
                      <div className={`text-sm ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`${getVolatilityColor(stock.volatility)} text-white text-xs`}>
                      {stock.volatility.toUpperCase()}
                    </Badge>
                    <span className="text-xs opacity-70">{stock.sector}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stock Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye size={20} />
              {selectedStockData ? `${selectedStockData.name} (${selectedStockData.code})` : 'Select a stock'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedStockData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="text-2xl font-bold">₹{selectedStockData.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Change</p>
                    <p className={`text-lg font-semibold ${selectedStockData.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedStockData.changePercent >= 0 ? '+' : ''}{selectedStockData.changePercent.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Market Cap</p>
                    <p className="text-lg font-semibold">₹{(selectedStockData.marketCap / 10000000).toFixed(1)}Cr</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">P/E Ratio</p>
                    <p className="text-lg font-semibold">{selectedStockData.peRatio.toFixed(1)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">52W High</p>
                    <p className="font-semibold">₹{selectedStockData.high52w.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">52W Low</p>
                    <p className="font-semibold">₹{selectedStockData.low52w.toFixed(2)}</p>
                  </div>
                </div>

                {/* Trading Interface */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Trade</h3>
                  <div className="flex gap-4 items-end">
                    <div className="flex gap-2">
                      <Button
                        variant={tradeType === 'buy' ? 'default' : 'outline'}
                        onClick={() => setTradeType('buy')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Buy
                      </Button>
                      <Button
                        variant={tradeType === 'sell' ? 'default' : 'outline'}
                        onClick={() => setTradeType('sell')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Sell
                      </Button>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Quantity</label>
                      <Input
                        type="number"
                        value={tradeQuantity}
                        onChange={(e) => setTradeQuantity(Number(e.target.value))}
                        min="1"
                        className="w-24"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Value</p>
                      <p className="font-semibold">₹{(selectedStockData.price * tradeQuantity).toFixed(2)}</p>
                    </div>
                    <Button onClick={handleTrade} className="bg-[#d4af37] hover:bg-[#b8941f]">
                      {tradeType === 'buy' ? 'Buy' : 'Sell'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Select a stock from the watchlist to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Portfolio */}
      {portfolioHoldings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolioHoldings.map((holding) => {
                  const stock = stocks.find(s => s.code === holding.code);
                  const currentValue = stock ? stock.price * holding.quantity : 0;
                  const investedValue = holding.avgPrice * holding.quantity;
                  const pnl = currentValue - investedValue;
                  const pnlPercent = (pnl / investedValue) * 100;

                  return (
                    <div key={holding.code} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{holding.code}</div>
                        <div className="text-sm text-gray-600">{holding.quantity} shares @ ₹{holding.avgPrice.toFixed(2)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{currentValue.toFixed(2)}</div>
                        <div className={`text-sm ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {pnl >= 0 ? '+' : ''}₹{pnl.toFixed(2)} ({pnlPercent.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Chart type="doughnut" data={portfolioData} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StocksSection;
