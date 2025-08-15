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
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Globe,
  Zap
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

const ProfessionalStockMarket: React.FC = () => {
  const { financialData, updateFinancialData, addGameEvent } = useWealthSprintGame();
  
  // State management
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
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
      price: 2846.88,
      change: 19.23,
      changePercent: 0.68,
      volatility: 'medium',
      risk: 'Medium',
      trend: [2800, 2820, 2850, 2865, 2846.88],
      volume: 2410000,
      marketCap: 19250000
    },
    {
      code: 'TCS',
      name: 'Tata Consultancy Services',
      sector: 'IT',
      price: 4173.20,
      change: 40.56,
      changePercent: 0.98,
      volatility: 'low',
      risk: 'Low',
      trend: [4200, 4180, 4160, 4150, 4173.20],
      volume: 2420000,
      marketCap: 15120000
    },
    {
      code: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      sector: 'Banking',
      price: 1557.03,
      change: -7.94,
      changePercent: -0.51,
      volatility: 'low',
      risk: 'Low',
      trend: [1560, 1570, 1580, 1575, 1557.03],
      volume: 3970000,
      marketCap: 11890000
    },
    {
      code: 'INFY',
      name: 'Infosys Ltd',
      sector: 'IT',
      price: 1647.37,
      change: -2.32,
      changePercent: -0.14,
      volatility: 'low',
      risk: 'Low',
      trend: [1680, 1670, 1650, 1640, 1647.37],
      volume: 1370000,
      marketCap: 6980000
    },
    {
      code: 'ICICIBANK',
      name: 'ICICI Bank Ltd',
      sector: 'Banking',
      price: 1148.81,
      change: 2.35,
      changePercent: 0.20,
      volatility: 'medium',
      risk: 'Medium',
      trend: [1090, 1100, 1115, 1120, 1148.81],
      volume: 4500000,
      marketCap: 7890000
    }
  ]);

  // Live price updates
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
      charges.stampDuty = tradeValue * 0.00003; // 0.003% on buy value
    }

    // 5. SEBI Charges
    charges.sebiCharges = tradeValue * 0.000001; // ₹1 per ₹1 crore

    // 6. GST on brokerage + exchange charges
    charges.gst = (charges.brokerage + charges.exchangeCharges) * 0.18;

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
            stocks: Math.max(0, financialData.investments.stocks - tradeValue)
          }
        });

        const profit = (stock.price - holding.avgPrice) * quantity;
        addGameEvent({
          id: `stock_sell_${Date.now()}`,
          type: 'financial',
          title: profit >= 0 ? '📈 Stock Sold - Profit!' : '📉 Stock Sold - Loss',
          description: `Sold ${quantity} shares of ${stock.code} for ₹${tradeValue.toLocaleString()} (${profit >= 0 ? 'Profit' : 'Loss'}: ₹${Math.abs(profit).toFixed(2)})`,
          impact: { duration: 1, effects: {} }
        });
      }
    }

    // Reset quantity for this stock
    setQuantities(prev => ({ ...prev, [stockCode]: 1 }));
  };

  const getSectorColor = (sector: string) => {
    switch (sector) {
      case 'Banking': return 'from-blue-500 to-blue-600';
      case 'IT': return 'from-purple-500 to-purple-600';
      case 'Oil & Gas': return 'from-orange-500 to-orange-600';
      case 'Telecom': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSectorIcon = (sector: string) => {
    switch (sector) {
      case 'Banking': return DollarSign;
      case 'IT': return Zap;
      case 'Oil & Gas': return Globe;
      case 'Telecom': return Activity;
      default: return BarChart3;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Compact Professional Market Tracker */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg border-b border-blue-500">
        <div className="px-4 py-3">
          {/* Compact Header Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-white bg-opacity-20 p-1.5 rounded">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">NSE Live Market Tracker</h2>
                <p className="text-blue-100 text-xs">Real-time prices • 9:15 AM - 3:30 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white px-2 py-1 text-xs font-semibold animate-pulse">
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></div>
                LIVE
              </Badge>
              <div className="text-right text-white text-xs">
                <div className="text-blue-200">Status</div>
                <div className="font-semibold">OPEN</div>
              </div>
            </div>
          </div>
          
          {/* Compact Market Summary */}
          <div className="flex items-center justify-between bg-white bg-opacity-15 rounded-lg px-3 py-1.5 mb-2">
            <div className="flex items-center gap-4 text-white text-sm">
              <div className="flex items-center gap-1">
                <span className="text-blue-200">NIFTY:</span>
                <span className="font-bold">19,674.25</span>
                <span className="text-green-300 text-xs">+0.64%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-200">SENSEX:</span>
                <span className="font-bold">66,230.15</span>
                <span className="text-green-300 text-xs">+0.64%</span>
              </div>
            </div>
            <div className="text-white text-xs">
              <span className="text-blue-200">Updated:</span>
              <span className="ml-1 font-medium">{new Date().toLocaleTimeString().slice(0, 5)}</span>
            </div>
          </div>
          
          {/* Streamlined Ticker */}
          <div className="overflow-hidden bg-white bg-opacity-10 rounded-lg py-1.5">
            <div className="flex animate-scroll whitespace-nowrap">
              {stocks.concat(stocks).map((stock, index) => (
                <div key={`${stock.code}-${index}`} className="inline-flex items-center mx-4">
                  <span className="font-bold text-white text-sm mr-2">{stock.code}</span>
                  <span className="text-blue-100 font-medium mr-2 text-sm">₹{stock.price.toFixed(2)}</span>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                    stock.changePercent >= 0 
                      ? 'bg-green-500 text-green-100' 
                      : 'bg-red-500 text-red-100'
                  }`}>
                    {stock.changePercent >= 0 ? '▲' : '▼'}{Math.abs(stock.changePercent).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stock Cards Container */}
      <div className="p-4">
        {/* Professional Stock Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stocks.map((stock) => {
          const holding = portfolioHoldings.find(h => h.code === stock.code);
          const isSelected = selectedStock === stock.code;
          const quantity = quantities[stock.code] || 1;
          const tradeType = tradeTypes[stock.code] || 'delivery';
          const tradeValue = stock.price * quantity;
          const charges = calculateTradingCharges(tradeValue, tradeType === 'delivery', true);
          const SectorIcon = getSectorIcon(stock.sector);
          
          return (
            <Card 
              key={stock.code} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden"
            >
              <CardContent className="p-0">
                {/* Stock Header with Sector Gradient */}
                <div className={`bg-gradient-to-r ${getSectorColor(stock.sector)} text-white p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                        <SectorIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{stock.name}</h3>
                        <p className="text-white text-opacity-80 text-sm">({stock.code}) • {stock.sector}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white text-opacity-80">Quantity</div>
                      <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-0">
                        {holding ? `${holding.quantity} shares` : '0 shares'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Price Information */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Current Price</div>
                      <div className="text-2xl font-bold text-slate-900">₹{stock.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Day Change</div>
                      <div className={`text-lg font-bold flex items-center gap-1 ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.changePercent >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {stock.changePercent >= 0 ? '+' : ''}₹{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-green-700 font-medium">52W High</div>
                      <div className="text-green-800 font-bold">₹{(stock.price * 1.2).toFixed(2)}</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-red-700 font-medium">52W Low</div>
                      <div className="text-red-800 font-bold">₹{(stock.price * 0.8).toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm bg-slate-50 p-3 rounded-lg">
                    <div>
                      <span className="text-slate-600">Volume:</span>
                      <span className="ml-2 font-medium text-slate-900">{(stock.volume / 100000).toFixed(1)}L</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Market Cap:</span>
                      <span className="ml-2 font-medium text-slate-900">₹{(stock.marketCap / 10000).toFixed(0)}K Cr</span>
                    </div>
                  </div>

                  {/* Trading Section Toggle */}
                  <Button
                    onClick={() => setSelectedStock(isSelected ? null : stock.code)}
                    className={`w-full ${isSelected ? 'bg-slate-600 hover:bg-slate-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium`}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isSelected ? 'Hide Trading Panel' : `Trade ${stock.code}`}
                  </Button>

                  {/* Compact Trading Panel */}
                  {isSelected && (
                    <div className="mt-3 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                      {/* Compact Trading Header */}
                      <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-3 py-2 border-b">
                        <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          Trade {stock.code}
                        </h4>
                      </div>

                      <div className="p-3 space-y-3">
                        {/* Compact Configuration Row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">Trade Type</label>
                            <select 
                              value={tradeType} 
                              onChange={(e) => setTradeTypes(prev => ({ ...prev, [stock.code]: e.target.value as any }))}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="delivery">Delivery (Hold)</option>
                              <option value="intraday">Intraday (Same Day)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">Quantity</label>
                            <Input
                              type="number"
                              value={quantity}
                              onChange={(e) => setQuantities(prev => ({ ...prev, [stock.code]: Math.max(1, parseInt(e.target.value) || 1) }))}
                              className="w-full px-2 py-1.5 border-slate-300 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              min="1"
                            />
                          </div>
                        </div>

                        {/* Compact Price Summary */}
                        <div className="bg-slate-50 p-2.5 rounded border">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Price per Share:</span>
                              <span className="font-semibold">₹{stock.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Trade Value:</span>
                              <span className="font-semibold">₹{tradeValue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                              <span>Total Charges:</span>
                              <span className="font-semibold">₹{charges.total.toFixed(2)}</span>
                            </div>
                            <div></div>
                          </div>
                          <hr className="my-1.5" />
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between text-green-700 bg-green-50 px-1.5 py-1 rounded">
                              <span className="font-medium">Final Buy:</span>
                              <span className="font-bold">₹{(tradeValue + charges.total).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-red-700 bg-red-50 px-1.5 py-1 rounded">
                              <span className="font-medium">Final Sell:</span>
                              <span className="font-bold">₹{(tradeValue - charges.total).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Compact Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => handleTrade(stock.code, true)}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 text-sm"
                            disabled={financialData.bankBalance < (tradeValue + charges.total)}
                          >
                            Buy ₹{(tradeValue + charges.total).toLocaleString()}
                          </Button>
                          <Button
                            onClick={() => handleTrade(stock.code, false)}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 text-sm"
                            disabled={!holding || holding.quantity < quantity}
                          >
                            Sell ₹{(tradeValue - charges.total).toLocaleString()}
                          </Button>
                        </div>

                        {/* Collapsible Charges Breakdown */}
                        <details className="group">
                          <summary className="cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1.5 py-1">
                            <Calculator className="w-3 h-3" />
                            <span>Charges Breakdown ({tradeType})</span>
                            <div className="ml-auto w-3 h-3 transition-transform group-open:rotate-180">▼</div>
                          </summary>
                          <div className="mt-2 bg-slate-50 p-2 rounded border text-xs">
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Brokerage:</span>
                                <span>₹{charges.brokerage.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">STT:</span>
                                <span>₹{charges.stt.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Exchange:</span>
                                <span>₹{charges.exchangeCharges.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">GST:</span>
                                <span>₹{charges.gst.toFixed(2)}</span>
                              </div>
                            </div>
                            <hr className="my-1.5" />
                            <div className="flex justify-between font-semibold">
                              <span>Total:</span>
                              <span>₹{charges.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </details>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalStockMarket;