import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown, Play, Pause, RefreshCw, BarChart3, Activity } from 'lucide-react';
import { formatIndianCurrency } from '../../lib/utils';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  high52Week: number;
  low52Week: number;
  lastUpdated: Date;
}

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

const StockMarketTicker: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [tickerSpeed, setTickerSpeed] = useState(50);
  const tickerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with realistic Indian stock data
  const initializeStocks = (): StockData[] => {
    return [
      {
        symbol: 'RELIANCE',
        name: 'Reliance Industries',
        price: 2847.50,
        change: 23.75,
        changePercent: 0.84,
        volume: 5420000,
        marketCap: 19250000000000,
        sector: 'Oil & Gas',
        high52Week: 3024.90,
        low52Week: 2220.30,
        lastUpdated: new Date()
      },
      {
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        price: 4156.80,
        change: -15.20,
        changePercent: -0.36,
        volume: 2890000,
        marketCap: 15180000000000,
        sector: 'IT Services',
        high52Week: 4592.25,
        low52Week: 3311.00,
        lastUpdated: new Date()
      },
      {
        symbol: 'INFY',
        name: 'Infosys Limited',
        price: 1789.45,
        change: 8.90,
        changePercent: 0.50,
        volume: 3650000,
        marketCap: 7450000000000,
        sector: 'IT Services',
        high52Week: 1953.90,
        low52Week: 1351.65,
        lastUpdated: new Date()
      },
      {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank',
        price: 1712.30,
        change: -12.45,
        changePercent: -0.72,
        volume: 4230000,
        marketCap: 12890000000000,
        sector: 'Banking',
        high52Week: 1794.50,
        low52Week: 1363.55,
        lastUpdated: new Date()
      },
      {
        symbol: 'ICICIBANK',
        name: 'ICICI Bank',
        price: 1245.80,
        change: 18.60,
        changePercent: 1.52,
        volume: 6780000,
        marketCap: 8750000000000,
        sector: 'Banking',
        high52Week: 1257.35,
        low52Week: 912.45,
        lastUpdated: new Date()
      },
      {
        symbol: 'BHARTIARTL',
        name: 'Bharti Airtel',
        price: 1598.25,
        change: -7.80,
        changePercent: -0.49,
        volume: 2150000,
        marketCap: 9320000000000,
        sector: 'Telecom',
        high52Week: 1619.90,
        low52Week: 900.55,
        lastUpdated: new Date()
      },
      {
        symbol: 'ITC',
        name: 'ITC Limited',
        price: 456.70,
        change: 3.25,
        changePercent: 0.72,
        volume: 8950000,
        marketCap: 5680000000000,
        sector: 'FMCG',
        high52Week: 491.85,
        low52Week: 398.40,
        lastUpdated: new Date()
      },
      {
        symbol: 'SBIN',
        name: 'State Bank of India',
        price: 789.45,
        change: 11.30,
        changePercent: 1.45,
        volume: 12450000,
        marketCap: 7030000000000,
        sector: 'Banking',
        high52Week: 912.25,
        low52Week: 543.15,
        lastUpdated: new Date()
      }
    ];
  };

  const initializeIndices = (): MarketIndex[] => {
    return [
      {
        name: 'NIFTY 50',
        value: 22785.45,
        change: 125.80,
        changePercent: 0.56
      },
      {
        name: 'SENSEX',
        value: 75124.30,
        change: -89.25,
        changePercent: -0.12
      },
      {
        name: 'BANK NIFTY',
        value: 48956.75,
        change: 234.60,
        changePercent: 0.48
      }
    ];
  };

  // Simulate real-time price updates
  const updateStockPrices = () => {
    setStocks(prevStocks => 
      prevStocks.map(stock => {
        // Random price fluctuation between -2% to +2%
        const changePercent = (Math.random() - 0.5) * 4;
        const priceChange = stock.price * (changePercent / 100);
        const newPrice = Math.max(stock.price + priceChange, 1);
        
        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(priceChange.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          volume: stock.volume + Math.floor(Math.random() * 100000),
          lastUpdated: new Date()
        };
      })
    );

    setMarketIndices(prevIndices =>
      prevIndices.map(index => {
        const changePercent = (Math.random() - 0.5) * 2;
        const change = index.value * (changePercent / 100);
        
        return {
          ...index,
          value: parseFloat((index.value + change).toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2))
        };
      })
    );
  };

  useEffect(() => {
    setStocks(initializeStocks());
    setMarketIndices(initializeIndices());
  }, []);

  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(updateStockPrices, 3000); // Update every 3 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive]);

  const formatVolume = (volume: number): string => {
    if (volume >= 10000000) return `${(volume / 10000000).toFixed(1)}Cr`;
    if (volume >= 100000) return `${(volume / 100000).toFixed(1)}L`;
    return volume.toLocaleString();
  };

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1000000000000) return `₹${(marketCap / 1000000000000).toFixed(2)}T`;
    if (marketCap >= 10000000000) return `₹${(marketCap / 10000000000).toFixed(2)}K Cr`;
    return formatIndianCurrency(marketCap);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeBgColor = (change: number) => {
    if (change > 0) return 'bg-green-50 border-green-200';
    if (change < 0) return 'bg-red-50 border-red-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Market Indices Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Market Indices
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLive(!isLive)}
                className={isLive ? 'border-green-500 text-green-700' : 'border-gray-400'}
              >
                {isLive ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                {isLive ? 'Live' : 'Paused'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={updateStockPrices}
                className="border-blue-400 text-blue-700"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {marketIndices.map((index, i) => (
              <div key={i} className={`p-3 rounded-lg border ${getChangeBgColor(index.change)}`}>
                <div className="text-sm font-medium text-gray-700">{index.name}</div>
                <div className="text-xl font-bold text-gray-900">
                  {index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className={`text-sm flex items-center gap-1 ${getChangeColor(index.change)}`}>
                  {index.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {index.change > 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stock Ticker */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Real-Time Stock Ticker
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Scrolling Ticker */}
          <div className="overflow-hidden bg-gray-900 rounded-lg mb-4">
            <div 
              ref={tickerRef}
              className="flex items-center whitespace-nowrap ticker-scroll"
            >
              {stocks.map((stock, index) => (
                <div key={index} className="inline-flex items-center mx-6 text-white">
                  <span className="font-bold text-green-400">{stock.symbol}</span>
                  <span className="mx-2">₹{stock.price.toFixed(2)}</span>
                  <span className={stock.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stocks.map((stock, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${getChangeBgColor(stock.change)} ${
                  selectedStock?.symbol === stock.symbol ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedStock(stock)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {stock.symbol}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getChangeColor(stock.change)}`}
                      >
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-sm text-gray-800 truncate">
                        {stock.name}
                      </div>
                      <div className="text-xs text-gray-600">{stock.sector}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-gray-900">
                        ₹{stock.price.toFixed(2)}
                      </div>
                      <div className={`text-sm flex items-center gap-1 ${getChangeColor(stock.change)}`}>
                        {stock.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stock.change >= 0 ? '+' : ''}₹{stock.change.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Vol: {formatVolume(stock.volume)}</div>
                      <div>MCap: {formatMarketCap(stock.marketCap)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stock View */}
      {selectedStock && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{selectedStock.name} ({selectedStock.symbol})</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedStock(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Current Price</div>
                <div className="text-xl font-bold">₹{selectedStock.price.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Day Change</div>
                <div className={`text-lg font-semibold ${getChangeColor(selectedStock.change)}`}>
                  {selectedStock.change >= 0 ? '+' : ''}₹{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">52W High</div>
                <div className="text-lg font-semibold text-green-600">₹{selectedStock.high52Week.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">52W Low</div>
                <div className="text-lg font-semibold text-red-600">₹{selectedStock.low52Week.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Volume</div>
                <div className="font-semibold">{formatVolume(selectedStock.volume)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Market Cap</div>
                <div className="font-semibold">{formatMarketCap(selectedStock.marketCap)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Sector</div>
                <div className="font-semibold">{selectedStock.sector}</div>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              Last updated: {selectedStock.lastUpdated.toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes ticker-scroll {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .ticker-scroll {
            animation: ticker-scroll 60s linear infinite;
          }
        `
      }} />
    </div>
  );
};

export default StockMarketTicker;