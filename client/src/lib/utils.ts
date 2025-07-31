import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIndianCurrency(amount: number): string {
  if (amount < 1000) {
    return `₹${amount}`;
  } else if (amount < 100000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  } else if (amount < 10000000) {
    return `₹${(amount / 100000).toFixed(1)}La`;
  } else if (amount < 1000000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount < 100000000000) {
    return `₹${(amount / 1000000000).toFixed(1)}B`;
  } else {
    return `₹${(amount / 100000000000).toFixed(1)}T`;
  }
}

const getLocalStorage = (key: string): any =>
  JSON.parse(window.localStorage.getItem(key) || "null");
const setLocalStorage = (key: string, value: any): void =>
  window.localStorage.setItem(key, JSON.stringify(value));

export { getLocalStorage, setLocalStorage };
