export const formatMoney = (amount: number): string => {
  if (amount >= 1_00_00_00_000) return `₹${(amount / 1_00_00_00_000).toFixed(1)}T`;
  if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(1)}B`;
  if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(1)}L`;
  return `₹${amount.toLocaleString()}`;
};

export const formatMoneyDetailed = (amount: number): string => {
  return `₹${amount.toLocaleString()}`;
};

export const formatMoneyShort = (amount: number): string => {
  if (amount >= 1_00_00_00_000) return `₹${(amount / 1_00_00_00_000).toFixed(1)}T`;
  if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(1)}B`;
  if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(1)}L`;
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)}k`;
  return `₹${amount}`;
};