import React, { useState } from 'react';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart,
  Eye,
  LineChart,
  Shield,
  AlertCircle
} from 'lucide-react';

interface Stock {
  code: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volatility: string;
  risk: 'Low' | 'Medium' | 'High';
  trend: number[];
}

interface StockHolding {
  code: string;
  quantity: number;
  avgPrice: number;
  purchaseDate: Date;
}

const InvestmentTable: React.FC = () => {
  const { financialData, updateFinancialData, addGameEvent } = useWealthSprintGame();
  
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [portfolioHoldings, setPortfolioHoldings] = useState<StockHolding[]>([]);

  const buyStock = (code: string, qty: number) => {
    const stock = enhancedStocks.find(s => s.code === code);
    if (!stock) return;
    
    const existingHolding = portfolioHoldings.find(h => h.code === code);
    if (existingHolding) {
      const totalQuantity = existingHolding.quantity + qty;
      const totalValue = (existingHolding.avgPrice * existingHolding.quantity) + (stock.price * qty);
      const newAvgPrice = totalValue / totalQuantity;
      
      setPortfolioHoldings(prev => prev.map(h => 
        h.code === code 
          ? { ...h, quantity: totalQuantity, avgPrice: newAvgPrice }
          : h
      ));
    } else {
      setPortfolioHoldings(prev => [...prev, {
        code,
        quantity: qty,
        avgPrice: stock.price,
        purchaseDate: new Date()
      }]);
    }
  };

  const sellStock = (code: string, qty: number) => {
    setPortfolioHoldings(prev => prev.map(h => 
      h.code === code 
        ? { ...h, quantity: h.quantity - qty }
        : h
    ).filter(h => h.quantity > 0));
  };

  // Enhanced stock data with dummy 3-day trends and risk levels
  const enhancedStocks: Stock[] = [
    {
      code: 'RELIANCE',
      name: 'Reliance Industries',
      sector: 'Oil & Gas',
      price: 2850,
      change: 45,
      changePercent: 1.6,
      volatility: 'medium',
      risk: 'Medium',
      trend: [2800, 2820, 2850]
    },
    {
      code: 'INFY',
      name: 'Infosys',
      sector: 'IT',
      price: 1650,
      change: -20,
      changePercent: -1.2,
      volatility: 'low',
      risk: 'Low',
      trend: [1680, 1670, 1650]
    },
    {
      code: 'HDFCBANK',
      name: 'HDFC Bank',
      sector: 'Banking',
      price: 1580,
      change: 25,
      changePercent: 1.6,
      volatility: 'low',
      risk: 'Low',
      trend: [1560, 1570, 1580]
    }
  ];

  const selectedStockData = selectedStock ? enhancedStocks.find(s => s.code === selectedStock) : null;

  const handleTrade = () => {
    if (!selectedStockData || quantity <= 0) return;

    const tradeValue = selectedStockData.price * quantity;

    if (tradeType === 'buy') {
      if (financialData.bankBalance >= tradeValue) {
        buyStock(selectedStockData.code, quantity);
        updateFinancialData({ 
          bankBalance: financialData.bankBalance - tradeValue,
          totalAssets: financialData.totalAssets + tradeValue,
        });
        
        // Show success notification
        addGameEvent({
          id: `stock_buy_${Date.now()}`,
          type: 'financial',
          title: '📈 Stock Purchase Successful',
          description: `Bought ${quantity} shares of ${selectedStockData.code} for ₹${tradeValue.toLocaleString()}`,
          impact: { duration: 1, effects: {} }
        });
        
        setQuantity(1);
      } else {
        // Show insufficient funds notification
        addGameEvent({
          id: `insufficient_funds_${Date.now()}`,
          type: 'warning',
          title: '❌ Insufficient Funds',
          description: `Need ₹${tradeValue.toLocaleString()} but only have ₹${financialData.bankBalance.toLocaleString()}`,
          impact: { duration: 1, effects: {} }
        });
      }
    } else {
      const holding = portfolioHoldings.find(h => h.code === selectedStockData.code);
      if (holding && holding.quantity >= quantity) {
        sellStock(selectedStockData.code, quantity);
        updateFinancialData({ 
          bankBalance: financialData.bankBalance + tradeValue,
          totalAssets: financialData.totalAssets - (holding.avgPrice * quantity),
        });
        
        const profit = (selectedStockData.price - holding.avgPrice) * quantity;
        addGameEvent({
          id: `stock_sell_${Date.now()}`,
          type: 'financial',
          title: '💰 Stock Sale Completed',
          description: `Sold ${quantity} shares of ${selectedStockData.code} for ${profit >= 0 ? 'profit' : 'loss'} of ₹${Math.abs(profit).toLocaleString()}`,
          impact: { duration: 1, effects: {} }
        });
        
        setQuantity(1);
      }
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: number[]) => {
    const recentChange = trend[trend.length - 1] - trend[0];
    return recentChange >= 0 ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: number[]) => {
    const recentChange = trend[trend.length - 1] - trend[0];
    return recentChange >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatTrend = (trend: number[]) => {
    const change = ((trend[trend.length - 1] - trend[0]) / trend[0]) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#3a3a3a]">Stock Market - Enhanced Interface</h1>
        <Badge className="bg-[#d4af37] text-white">
          Live Market Data
        </Badge>
      </div>

      {/* Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart size={20} />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2">Symbol</th>
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2">Risk</th>
                  <th className="text-right py-3 px-2">Price</th>
                  <th className="text-right py-3 px-2">3-Day Trend</th>
                  <th className="text-center py-3 px-2">Quantity</th>
                  <th className="text-center py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {enhancedStocks.map((stock) => {
                  const TrendIcon = getTrendIcon(stock.trend);
                  const holding = portfolioHoldings.find(h => h.code === stock.code);
                  
                  return (
                    <tr 
                      key={stock.code} 
                      className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        selectedStock === stock.code ? 'bg-[#d4af37] bg-opacity-10' : ''
                      }`}
                      onClick={() => setSelectedStock(stock.code)}
                    >
                      <td className="py-4 px-2">
                        <div className="font-semibold text-[#3a3a3a]">{stock.code}</div>
                        <div className="text-sm text-gray-500">{stock.sector}</div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="font-medium">{stock.name}</div>
                        {holding && (
                          <div className="text-xs text-blue-600">
                            Holding: {holding.quantity} shares
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-2">
                        <Badge className={`text-xs ${getRiskColor(stock.risk)}`}>
                          {stock.risk}
                        </Badge>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="font-semibold">₹{stock.price.toFixed(2)}</div>
                        <div className={`text-sm ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className={`flex items-center justify-end gap-1 ${getTrendColor(stock.trend)}`}>
                          <TrendIcon size={16} />
                          <span className="text-sm font-medium">{formatTrend(stock.trend)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        {selectedStock === stock.code && (
                          <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                            min="1"
                            className="w-20 text-center"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </td>
                      <td className="py-4 px-2 text-center">
                        {selectedStock === stock.code && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTradeType('buy');
                                handleTrade();
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={financialData.bankBalance < stock.price * quantity}
                            >
                              Buy
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTradeType('sell');
                                handleTrade();
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white"
                              disabled={!holding || holding.quantity < quantity}
                            >
                              Sell
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Selected Stock Details */}
      {selectedStockData && (
        <Card className="border-2 border-[#d4af37]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye size={20} />
              {selectedStockData.name} ({selectedStockData.code}) - Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Current Price</div>
                <div className="text-xl font-bold text-[#3a3a3a]">₹{selectedStockData.price.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Day Change</div>
                <div className={`text-xl font-bold ${selectedStockData.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedStockData.changePercent >= 0 ? '+' : ''}{selectedStockData.changePercent.toFixed(2)}%
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Risk Level</div>
                <Badge className={getRiskColor(selectedStockData.risk)}>
                  {selectedStockData.risk}
                </Badge>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Trade Value</div>
                <div className="text-xl font-bold text-[#d4af37]">
                  ₹{(selectedStockData.price * quantity).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-800">Investment Tip</div>
                  <div className="text-sm text-blue-700">
                    {selectedStockData.risk === 'Low' && 
                      'This is a stable stock suitable for conservative investors. Lower risk, steady returns.'}
                    {selectedStockData.risk === 'Medium' && 
                      'Balanced risk-reward ratio. Good for moderate investors looking for growth.'}
                    {selectedStockData.risk === 'High' && 
                      'High volatility stock. Potential for big gains but also significant losses. Invest carefully.'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Summary */}
      {portfolioHoldings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              Your Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {portfolioHoldings.map((holding) => {
                const stock = enhancedStocks.find(s => s.code === holding.code);
                if (!stock) return null;
                
                const currentValue = stock.price * holding.quantity;
                const investedValue = holding.avgPrice * holding.quantity;
                const pnl = currentValue - investedValue;
                const pnlPercent = (pnl / investedValue) * 100;

                return (
                  <div key={holding.code} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold">{holding.code}</div>
                      <div className="text-sm text-gray-600">
                        {holding.quantity} shares @ ₹{holding.avgPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{currentValue.toLocaleString()}</div>
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
      )}
    </div>
  );
};

export default InvestmentTable;