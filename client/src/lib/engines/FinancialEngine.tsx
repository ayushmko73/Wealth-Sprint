import { FinancialData } from "../types/GameTypes";

export function calculateNetWorth(financialData: FinancialData): number {
  return financialData.totalAssets - financialData.totalLiabilities;
}

export function checkFinancialIndependence(financialData: FinancialData): boolean {
  return financialData.sideIncome >= financialData.monthlyExpenses;
}

export function calculateCashflow(financialData: FinancialData): number {
  return financialData.mainIncome + financialData.sideIncome - financialData.monthlyExpenses;
}

export function generateStockPrice(basePrice: number, volatility: number): number {
  const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
  const change = basePrice * (volatility / 100) * randomFactor;
  return Math.max(1, basePrice + change);
}

export function calculatePortfolioValue(stocks: any[], holdings: any[]): number {
  return holdings.reduce((total, holding) => {
    const stock = stocks.find(s => s.code === holding.code);
    if (stock) {
      return total + (stock.price * holding.quantity);
    }
    return total;
  }, 0);
}

export function calculateBondValue(bond: any, investment: number, timeElapsed: number): number {
  const yearlyReturn = investment * (bond.interestRate / 100);
  return investment + (yearlyReturn * timeElapsed);
}

export function calculateLoanEMI(principal: number, rate: number, tenure: number): number {
  const monthlyRate = rate / (12 * 100);
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
}

export function calculateTaxLiability(income: number, deductions: number = 0): number {
  const taxableIncome = Math.max(0, income - deductions);
  
  // Simplified Indian tax slabs
  let tax = 0;
  if (taxableIncome > 250000) {
    tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
  }
  if (taxableIncome > 500000) {
    tax += Math.min(taxableIncome - 500000, 500000) * 0.20;
  }
  if (taxableIncome > 1000000) {
    tax += (taxableIncome - 1000000) * 0.30;
  }
  
  return Math.round(tax);
}

export function generateMarketSentiment(): number {
  // Returns a value between -1 (very bearish) and 1 (very bullish)
  return (Math.random() - 0.5) * 2;
}

export function applyMarketSentiment(price: number, sentiment: number): number {
  const sentimentFactor = 1 + (sentiment * 0.1); // Max 10% impact
  return price * sentimentFactor;
}
