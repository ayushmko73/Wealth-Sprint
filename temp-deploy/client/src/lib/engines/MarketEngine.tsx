import { Stock, Bond, BankAccount } from '../types/financialTypes';

export interface MarketConditions {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  volatility: 'low' | 'medium' | 'high';
  interestRate: number;
  inflationRate: number;
  economicGrowth: number;
  timestamp: Date;
}

export class MarketEngine {
  private static instance: MarketEngine;
  private currentConditions: MarketConditions;
  private priceHistory: Map<string, number[]> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.currentConditions = {
      sentiment: 'neutral',
      volatility: 'medium',
      interestRate: 6.5,
      inflationRate: 4.2,
      economicGrowth: 6.8,
      timestamp: new Date(),
    };
  }

  static getInstance(): MarketEngine {
    if (!MarketEngine.instance) {
      MarketEngine.instance = new MarketEngine();
    }
    return MarketEngine.instance;
  }

  // Start real-time market updates
  startMarketUpdates(updateCallback: (stocks: Stock[], bonds: Bond[]) => void) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Update every 30 seconds in game
    this.updateInterval = setInterval(() => {
      this.updateMarketConditions();
      // This would trigger stock/bond price updates
    }, 30000);
  }

  stopMarketUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Update market conditions based on various factors
  private updateMarketConditions() {
    const sentimentChange = (Math.random() - 0.5) * 0.3;
    const volatilityChange = (Math.random() - 0.5) * 0.2;
    const interestRateChange = (Math.random() - 0.5) * 0.1;

    // Update sentiment
    const sentimentScore = this.getSentimentScore() + sentimentChange;
    if (sentimentScore > 0.3) {
      this.currentConditions.sentiment = 'bullish';
    } else if (sentimentScore < -0.3) {
      this.currentConditions.sentiment = 'bearish';
    } else {
      this.currentConditions.sentiment = 'neutral';
    }

    // Update volatility
    const volatilityScore = this.getVolatilityScore() + volatilityChange;
    if (volatilityScore > 0.4) {
      this.currentConditions.volatility = 'high';
    } else if (volatilityScore < 0.2) {
      this.currentConditions.volatility = 'low';
    } else {
      this.currentConditions.volatility = 'medium';
    }

    // Update interest rate
    this.currentConditions.interestRate = Math.max(3.0, Math.min(12.0, 
      this.currentConditions.interestRate + interestRateChange));

    this.currentConditions.timestamp = new Date();
  }

  // Calculate new stock price based on market conditions
  calculateStockPrice(stock: Stock): number {
    const basePrice = stock.currentPrice;
    const sentiment = this.getSentimentMultiplier();
    const volatility = this.getVolatilityMultiplier();
    const sectorInfluence = this.getSectorInfluence(stock.sector);
    
    // Random price movement between -10% to +10%
    const randomChange = (Math.random() - 0.5) * 0.2;
    
    // Apply all factors
    const priceChange = randomChange * sentiment * volatility * sectorInfluence;
    const newPrice = basePrice * (1 + priceChange);
    
    // Store price history
    this.updatePriceHistory(stock.code, newPrice);
    
    return Math.max(0.1, newPrice); // Ensure price doesn't go below 0.1
  }

  // Calculate bond yield based on market conditions
  calculateBondYield(bond: Bond): number {
    const baseYield = bond.currentYield;
    const interestRateInfluence = this.currentConditions.interestRate / 100;
    const creditRiskAdjustment = this.getCreditRiskAdjustment(bond.rating);
    
    // Government bonds are affected by interest rates
    if (bond.type === 'government') {
      return Math.max(0.01, baseYield + interestRateInfluence * 0.3);
    }
    
    // Corporate bonds add credit risk
    return Math.max(0.01, baseYield + interestRateInfluence * 0.5 + creditRiskAdjustment);
  }

  // Calculate bank account interest rates
  calculateBankInterestRate(accountType: string): number {
    const baseRate = this.currentConditions.interestRate / 100;
    
    switch (accountType) {
      case 'savings':
        return baseRate * 0.6; // 60% of base rate
      case 'fixed_deposit':
        return baseRate * 0.9; // 90% of base rate
      case 'current':
        return baseRate * 0.1; // 10% of base rate
      default:
        return baseRate * 0.5;
    }
  }

  // Generate market events
  generateMarketEvent(): {
    type: 'bull_run' | 'bear_market' | 'sector_boom' | 'interest_rate_change' | 'inflation_news';
    title: string;
    description: string;
    impact: {
      stocks?: number;
      bonds?: number;
      sector?: string;
      duration: number; // in game days
    };
  } | null {
    // Only generate events 10% of the time
    if (Math.random() > 0.1) return null;

    const eventTypes = [
      {
        type: 'bull_run' as const,
        title: 'Market Rally Begins',
        description: 'Strong economic indicators drive market optimism',
        impact: { stocks: 0.15, duration: 7 }
      },
      {
        type: 'bear_market' as const,
        title: 'Market Correction',
        description: 'Concerns over economic slowdown affect investor confidence',
        impact: { stocks: -0.12, duration: 5 }
      },
      {
        type: 'sector_boom' as const,
        title: 'Tech Sector Surge',
        description: 'Technology stocks outperform on innovation news',
        impact: { stocks: 0.08, sector: 'technology', duration: 3 }
      },
      {
        type: 'interest_rate_change' as const,
        title: 'RBI Rate Cut',
        description: 'Reserve Bank reduces interest rates to stimulate growth',
        impact: { bonds: -0.05, stocks: 0.03, duration: 14 }
      },
      {
        type: 'inflation_news' as const,
        title: 'Inflation Concerns Rise',
        description: 'Rising commodity prices fuel inflation worries',
        impact: { bonds: -0.03, stocks: -0.02, duration: 10 }
      }
    ];

    return eventTypes[Math.floor(Math.random() * eventTypes.length)];
  }

  // Helper methods
  private getSentimentScore(): number {
    switch (this.currentConditions.sentiment) {
      case 'bullish': return 0.5;
      case 'bearish': return -0.5;
      default: return 0;
    }
  }

  private getVolatilityScore(): number {
    switch (this.currentConditions.volatility) {
      case 'high': return 0.8;
      case 'low': return 0.2;
      default: return 0.5;
    }
  }

  private getSentimentMultiplier(): number {
    switch (this.currentConditions.sentiment) {
      case 'bullish': return 1.2;
      case 'bearish': return 0.8;
      default: return 1.0;
    }
  }

  private getVolatilityMultiplier(): number {
    switch (this.currentConditions.volatility) {
      case 'high': return 1.5;
      case 'low': return 0.5;
      default: return 1.0;
    }
  }

  private getSectorInfluence(sector: string): number {
    // Some sectors perform better in certain conditions
    const sectorMultipliers: Record<string, number> = {
      technology: this.currentConditions.sentiment === 'bullish' ? 1.1 : 0.9,
      healthcare: 1.0, // Generally stable
      finance: this.currentConditions.interestRate > 7 ? 1.1 : 0.9,
      consumer: this.currentConditions.economicGrowth > 6 ? 1.1 : 0.9,
      energy: Math.random() > 0.5 ? 1.2 : 0.8, // Highly volatile
      manufacturing: this.currentConditions.economicGrowth > 5 ? 1.1 : 0.9,
    };

    return sectorMultipliers[sector] || 1.0;
  }

  private getCreditRiskAdjustment(rating: string): number {
    const riskAdjustments: Record<string, number> = {
      'AAA': 0.001,
      'AA': 0.002,
      'A': 0.005,
      'BBB': 0.010,
      'BB': 0.020,
      'B': 0.035,
      'CCC': 0.050,
    };

    return riskAdjustments[rating] || 0.025;
  }

  private updatePriceHistory(code: string, price: number) {
    if (!this.priceHistory.has(code)) {
      this.priceHistory.set(code, []);
    }
    
    const history = this.priceHistory.get(code)!;
    history.push(price);
    
    // Keep only last 100 prices
    if (history.length > 100) {
      history.shift();
    }
  }

  // Public getters
  getMarketConditions(): MarketConditions {
    return { ...this.currentConditions };
  }

  getPriceHistory(code: string): number[] {
    return this.priceHistory.get(code) || [];
  }

  getMarketTrend(code: string): 'up' | 'down' | 'stable' {
    const history = this.getPriceHistory(code);
    if (history.length < 2) return 'stable';
    
    const recent = history.slice(-5);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const oldest = recent[0];
    
    if (avg > oldest * 1.02) return 'up';
    if (avg < oldest * 0.98) return 'down';
    return 'stable';
  }
}

export default MarketEngine;