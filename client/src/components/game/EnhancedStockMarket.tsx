import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useWealthSprintGame } from '../../lib/stores/useWealthSprintGame';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  ShoppingCart,
  Calculator,
  Activity
} from 'lucide-react';

interface Stock {
  code: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volatility: 'low' | 'medium' | 'high';
  risk: 'Low' | 'Medium' | 'High';
  trend: number[];
  volume: number;
  marketCap: number;
}

interface StockHolding {
  code: string;
  quantity: number;
  avgPrice: number;
  purchaseDate: Date;
}

interface TradingCharges {
  brokerage: number;
  exchangeCharges: number;
  stt: number;
  gst: number;
  sebiCharges: number;
  stampDuty: number;
  dpCharges: number;
  total: number;
}

const EnhancedStockMarket: React.FC = () => {
  const { financialData, updateFinancialData, addGameEvent } = useWealthSprintGame();
  
  // State management
  const [expandedStock, setExpandedStock] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [tradeTypes, setTradeTypes] = useState<Record<string, 'delivery' | 'intraday'>>({});
  const [portfolioHoldings, setPortfolioHoldings] = useState<StockHolding[]>([]);
  const [marketMode, setMarketMode] = useState<'bull' | 'bear' | 'neutral'>('neutral');
  const [isLiveMode, setIsLiveMode] = useState(true);

  // Enhanced Indian stocks with realistic data
  const [stocks, setStocks] = useState<Stock[]>([
    {
      code: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      sector: 'Oil & Gas',
      price: 2850,
      change: 45,
      changePercent: 1.6,
      volatility: 'medium',
      risk: 'Medium',
      trend: [2800, 2820, 2850, 2865, 2850],
      volume: 2340000,
      marketCap: 19250000
    },
    {
      code: 'TCS',
      name: 'Tata Consultancy Services',
      sector: 'IT',
      price: 4150,
      change: -80,
      changePercent: -1.9,
      volatility: 'low',
      risk: 'Low',
      trend: [4200, 4180, 4160, 4150, 4150],
      volume: 1890000,
      marketCap: 15120000
    },
    {
      code: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      sector: 'Banking',
      price: 1580,
      change: 25,
      changePercent: 1.6,
      volatility: 'low',
      risk: 'Low',
      trend: [1560, 1570, 1580, 1575, 1580],
      volume: 3450000,
      marketCap: 11890000
    },
    {
      code: 'INFY',
      name: 'Infosys Ltd',
      sector: 'IT',
      price: 1650,
      change: -20,
      changePercent: -1.2,
      volatility: 'low',
      risk: 'Low',
      trend: [1680, 1670, 1650, 1640, 1650],
      volume: 2190000,
      marketCap: 6980000
    },
    {
      code: 'ICICIBANK',
      name: 'ICICI Bank Ltd',
      sector: 'Banking',
      price: 1125,
      change: 35,
      changePercent: 3.2,
      volatility: 'medium',
      risk: 'Medium',
      trend: [1090, 1100, 1115, 1120, 1125],
      volume: 4230000,
      marketCap: 7890000
    },
    {
      code: 'BHARTIARTL',
      name: 'Bharti Airtel Ltd',
      sector: 'Telecom',
      price: 865,
      change: 12,
      changePercent: 1.4,
      volatility: 'medium',
      risk: 'Medium',
      trend: [850, 855, 860, 862, 865],
      volume: 1670000,
      marketCap: 4890000
    }
  ]);

  // Real-time market simulation
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setStocks(prevStocks => prevStocks.map(stock => {
        const volatilityMultiplier = stock.volatility === 'high' ? 0.05 : 
                                   stock.volatility === 'medium' ? 0.03 : 0.02;
        
        const marketMultiplier = marketMode === 'bull' ? 1.2 : 
                               marketMode === 'bear' ? 0.8 : 1.0;
        
        const randomChange = (Math.random() - 0.5) * volatilityMultiplier * marketMultiplier;
        const newPrice = Math.max(stock.price * (1 + randomChange), 1);
        const priceChange = newPrice - stock.price;
        const changePercent = (priceChange / stock.price) * 100;
        
        // Update trend
        const newTrend = [...stock.trend.slice(1), newPrice];
        
        // Update volume randomly
        const volumeChange = (Math.random() - 0.5) * 0.3;
        const newVolume = Math.max(stock.volume * (1 + volumeChange), 1000);

        return {
          ...stock,
          price: Math.round(newPrice * 100) / 100,
          change: Math.round(priceChange * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
          trend: newTrend,
          volume: Math.round(newVolume)
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveMode, marketMode]);

  // Calculate Indian trading charges
  const calculateTradingCharges = (tradeValue: number, isDelivery: boolean, isBuy: boolean): TradingCharges => {
    const charges = {
      brokerage: 0,
      exchangeCharges: 0,
      stt: 0,
      gst: 0,
      sebiCharges: 0,
      stampDuty: 0,
      dpCharges: 0,
      total: 0
    };

    // 1. Brokerage Charges
    if (isDelivery) {
      charges.brokerage = 0; // Most discount brokers offer ₹0 for delivery
    } else {
      charges.brokerage = Math.min(20, tradeValue * 0.0003); // ₹20 or 0.03% whichever is lower
    }

    // 2. Exchange Transaction Charges
    if (isDelivery) {
      charges.exchangeCharges = tradeValue * 0.00325 / 100; // ₹325 per ₹1 crore
    } else {
      charges.exchangeCharges = tradeValue * 0.035 / 100; // ₹3500 per ₹1 crore
    }

    // 3. STT (Securities Transaction Tax)
    if (isDelivery) {
      if (!isBuy) {
        charges.stt = tradeValue * 0.001; // 0.1% on sell value for delivery
      }
    } else {
      charges.stt = tradeValue * 0.00025; // 0.025% on sell value for intraday
    }

    // 4. Stamp Duty
    if (isBuy) {
      if (isDelivery) {
        charges.stampDuty = tradeValue * 0.00015; // 0.015% for delivery buy
      } else {
        charges.stampDuty = tradeValue * 0.00003; // 0.003% for intraday buy
      }
    }

    // 5. SEBI Charges
    charges.sebiCharges = tradeValue * 0.000001; // ₹10 per ₹1 crore

    // 6. GST (18% on brokerage + exchange charges)
    charges.gst = (charges.brokerage + charges.exchangeCharges) * 0.18;

    // 7. DP Charges (only for delivery sell)
    if (isDelivery && !isBuy) {
      charges.dpCharges = 15.93; // Approx ₹13.5 + GST
    }

    // Calculate total
    charges.total = charges.brokerage + charges.exchangeCharges + charges.stt + 
                   charges.gst + charges.sebiCharges + charges.stampDuty + charges.dpCharges;

    return charges;
  };

  const handleTrade = (stockCode: string, isBuy: boolean) => {
    const stock = stocks.find(s => s.code === stockCode);
    const quantity = quantities[stockCode] || 1;
    const tradeType = tradeTypes[stockCode] || 'delivery';
    
    if (!stock || quantity <= 0) return;

    const tradeValue = stock.price * quantity;
    const charges = calculateTradingCharges(tradeValue, tradeType === 'delivery', isBuy);
    const totalCost = isBuy ? tradeValue + charges.total : tradeValue - charges.total;

    if (isBuy) {
      if (financialData.bankBalance >= totalCost) {
        // Buy stock
        const existingHolding = portfolioHoldings.find(h => h.code === stock.code);
        if (existingHolding) {
          const totalQuantity = existingHolding.quantity + quantity;
          const totalValue = (existingHolding.avgPrice * existingHolding.quantity) + tradeValue;
          const newAvgPrice = totalValue / totalQuantity;
          
          setPortfolioHoldings(prev => prev.map(h => 
            h.code === stock.code 
              ? { ...h, quantity: totalQuantity, avgPrice: newAvgPrice }
              : h
          ));
        } else {
          setPortfolioHoldings(prev => [...prev, {
            code: stock.code,
            quantity: quantity,
            avgPrice: stock.price,
            purchaseDate: new Date()
          }]);
        }

        updateFinancialData({ 
          bankBalance: financialData.bankBalance - totalCost,
          investments: {
            ...financialData.investments,
            stocks: financialData.investments.stocks + tradeValue
          }
        });

        addGameEvent({
          id: `stock_buy_${Date.now()}`,
          type: 'financial',
          title: '📈 Stock Purchase Successful',
          description: `Bought ${quantity} shares of ${stock.code} for ₹${tradeValue.toLocaleString()} (Charges: ₹${charges.total.toFixed(2)})`,
          impact: { duration: 1, effects: {} }
        });
      } else {
        addGameEvent({
          id: `insufficient_funds_${Date.now()}`,
          type: 'warning',
          title: '❌ Insufficient Funds',
          description: `Need ₹${totalCost.toLocaleString()} but only have ₹${financialData.bankBalance.toLocaleString()}`,
          impact: { duration: 1, effects: {} }
        });
      }
    } else {
      // Sell stock
      const holding = portfolioHoldings.find(h => h.code === stock.code);
      if (holding && holding.quantity >= quantity) {
        setPortfolioHoldings(prev => prev.map(h => 
          h.code === stock.code 
            ? { ...h, quantity: h.quantity - quantity }
            : h
        ).filter(h => h.quantity > 0));

        updateFinancialData({ 
          bankBalance: financialData.bankBalance + totalCost,
          investments: {
            ...financialData.investments,
            stocks: Math.max(0, financialData.investments.stocks - (holding.avgPrice * quantity))
          }
        });

        const profit = (stock.price - holding.avgPrice) * quantity - charges.total;
        addGameEvent({
          id: `stock_sell_${Date.now()}`,
          type: 'financial',
          title: '💰 Stock Sale Completed',
          description: `Sold ${quantity} shares of ${stock.code} for ${profit >= 0 ? 'profit' : 'loss'} of ₹${Math.abs(profit).toLocaleString()}`,
          impact: { duration: 1, effects: {} }
        });
      }
    }

    // Reset quantity for this stock
    setQuantities(prev => ({ ...prev, [stockCode]: 1 }));
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
      {/* Future Content Space */}
      <div className="h-12"></div>
      
      {/* Real-Time Stock Ticker */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6 overflow-hidden relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            <h3 className="text-gray-800 font-semibold">Real-Time Stock Ticker</h3>
          </div>
          <Badge className={`${isLiveMode ? 'bg-green-600' : 'bg-gray-600'} text-white animate-pulse`}>
            {isLiveMode ? 'LIVE' : 'PAUSED'}
          </Badge>
        </div>
        
        {/* Scrolling ticker */}
        <div className="overflow-hidden">
          <div className="flex animate-scroll whitespace-nowrap">
            {stocks.concat(stocks).map((stock, index) => (
              <div key={`${stock.code}-${index}`} className="inline-flex items-center mx-8 text-gray-800">
                <span className="font-bold text-blue-600 mr-2">{stock.code}</span>
                <span className="text-gray-800 mr-2">₹{stock.price.toFixed(2)}</span>
                <span className={`flex items-center gap-1 ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.changePercent >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stock.changePercent >= 0 ? '+' : ''}₹{stock.change.toFixed(2)} 
                  ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>





      {/* Stock Cards with Trading Interface */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Live Stock Market</h2>
        </div>
        
        {stocks.map((stock) => {
          const TrendIcon = getTrendIcon(stock.trend);
          const holding = portfolioHoldings.find(h => h.code === stock.code);
          const isExpanded = expandedStock === stock.code;
          const quantity = quantities[stock.code] || 1;
          const tradeType = tradeTypes[stock.code] || 'delivery';
          const tradeValue = stock.price * quantity;
          const charges = calculateTradingCharges(tradeValue, tradeType === 'delivery', true);
          
          return (
            <Card key={stock.code} className={`${stock.changePercent >= 0 ? 'bg-blue-50' : 'bg-red-50'} border-l-4 ${stock.changePercent >= 0 ? 'border-l-blue-500' : 'border-l-red-500'}`}>
              <CardContent className="p-4">
                {/* Stock Info Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-bold text-lg">{stock.name} ({stock.code})</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{stock.sector}</span>
                        {holding && (
                          <Badge variant="secondary" className="text-xs">
                            Holding: {holding.quantity} shares
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedStock(isExpanded ? null : stock.code)}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Trade
                  </Button>
                </div>

                {/* Price Info Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Current Price</div>
                    <div className="font-bold text-xl">₹{stock.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Day Change</div>
                    <div className={`font-semibold ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.changePercent >= 0 ? '+' : ''}₹{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">52W High</div>
                    <div className="font-medium text-green-600">₹{(stock.price * 1.2).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">52W Low</div>
                    <div className="font-medium text-red-600">₹{(stock.price * 0.8).toFixed(2)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Volume:</span>
                    <span className="ml-1 font-medium">{(stock.volume / 100000).toFixed(1)}L</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Market Cap:</span>
                    <span className="ml-1 font-medium">₹{(stock.marketCap / 10000).toFixed(0)}K Cr</span>
                  </div>
                  <div className={`${getTrendColor(stock.trend)}`}>
                    <span className="text-gray-600">Sector:</span>
                    <span className="ml-1 font-medium">{stock.sector}</span>
                  </div>
                </div>

                {/* Expandable Trading Section */}
                {isExpanded && (
                  <div className="mt-4 p-4 bg-white rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <ShoppingCart className="w-4 h-4" />
                      <h4 className="font-semibold">Trade {stock.code}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Trading Form */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Trade Type:</label>
                          <select 
                            value={tradeType} 
                            onChange={(e) => setTradeTypes(prev => ({ ...prev, [stock.code]: e.target.value as any }))}
                            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                          >
                            <option value="delivery">Delivery (Hold)</option>
                            <option value="intraday">Intraday (Same Day)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Quantity:</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              value={quantity}
                              onChange={(e) => setQuantities(prev => ({ ...prev, [stock.code]: Math.max(1, parseInt(e.target.value) || 1) }))}
                              className="flex-1"
                              min="1"
                            />
                            <span className="text-sm text-gray-600">shares</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm bg-gray-50 p-3 rounded">
                          <div className="flex justify-between">
                            <span>Price per Share:</span>
                            <span className="font-medium">₹{stock.price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Trade Value:</span>
                            <span className="font-medium">₹{tradeValue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>Total Charges:</span>
                            <span className="font-medium">₹{charges.total.toFixed(2)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Final Buy Price:</span>
                            <span>₹{(tradeValue + charges.total).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Final Sell Price:</span>
                            <span>₹{(tradeValue - charges.total).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleTrade(stock.code, true)}
                            className="bg-green-600 hover:bg-green-700 text-white flex-1 font-semibold"
                            disabled={financialData.bankBalance < (tradeValue + charges.total)}
                          >
                            Buy ₹{(tradeValue + charges.total).toLocaleString()}
                          </Button>
                          <Button
                            onClick={() => handleTrade(stock.code, false)}
                            className="bg-red-600 hover:bg-red-700 text-white flex-1 font-semibold"
                            disabled={!holding || holding.quantity < quantity}
                          >
                            Sell ₹{(tradeValue - charges.total).toLocaleString()}
                          </Button>
                        </div>
                      </div>

                      {/* Charges Breakdown */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calculator className="w-4 h-4" />
                          <h4 className="font-medium">Charges Breakdown ({tradeType})</h4>
                        </div>
                        <div className="space-y-2 text-sm bg-gray-50 p-3 rounded">
                          <div className="flex justify-between">
                            <span>Brokerage:</span>
                            <span>₹{charges.brokerage.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Exchange Charges:</span>
                            <span>₹{charges.exchangeCharges.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>STT:</span>
                            <span>₹{charges.stt.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>GST (18%):</span>
                            <span>₹{charges.gst.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>SEBI Charges:</span>
                            <span>₹{charges.sebiCharges.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Stamp Duty:</span>
                            <span>₹{charges.stampDuty.toFixed(2)}</span>
                          </div>
                          {charges.dpCharges > 0 && (
                            <div className="flex justify-between">
                              <span>DP Charges:</span>
                              <span>₹{charges.dpCharges.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total Charges:</span>
                            <span>₹{charges.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>


    </div>
  );
};

export default EnhancedStockMarket;