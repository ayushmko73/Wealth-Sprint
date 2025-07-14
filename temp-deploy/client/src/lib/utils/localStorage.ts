// localStorage utility functions for game save/load system

export const SAVE_KEY = 'wealth_sprint_save';
export const SETTINGS_KEY = 'wealth_sprint_settings';

export interface SaveData {
  phase: string;
  currentWeek: number;
  currentDay: number;
  playerStats: any;
  financialData: any;
  activeScenarios: any[];
  completedScenarios: any[];
  teamMembers: any[];
  stocks: any[];
  bonds: any[];
  bankAccounts: any[];
  businessDeals: any[];
  gameEvents: any[];
  savedAt: string;
}

export interface SettingsData {
  theme: 'light' | 'dark' | 'cyber';
  soundEnabled: boolean;
  musicEnabled: boolean;
  gameSpeed: 'slow' | 'normal' | 'fast';
}

/**
 * Save data to localStorage with error handling
 */
export function saveToLocalStorage<T>(key: string, data: T): boolean {
  try {
    const jsonString = JSON.stringify(data);
    localStorage.setItem(key, jsonString);
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
}

/**
 * Load data from localStorage with error handling
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const jsonString = localStorage.getItem(key);
    if (!jsonString) {
      return null;
    }
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Delete data from localStorage
 */
export function deleteFromLocalStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to delete from localStorage:', error);
    return false;
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get the size of localStorage data in bytes
 */
export function getLocalStorageSize(): number {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
}

/**
 * Export all game data as JSON
 */
export function exportGameData(): string {
  const saveData = loadFromLocalStorage<SaveData>(SAVE_KEY);
  const settingsData = loadFromLocalStorage<SettingsData>(SETTINGS_KEY);
  
  const exportData = {
    save: saveData,
    settings: settingsData,
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import game data from JSON
 */
export function importGameData(jsonString: string): boolean {
  try {
    const importData = JSON.parse(jsonString);
    
    // Validate the data structure
    if (!importData.save || !importData.settings) {
      throw new Error('Invalid import data format');
    }
    
    // Save the imported data
    const saveSuccess = saveToLocalStorage(SAVE_KEY, importData.save);
    const settingsSuccess = saveToLocalStorage(SETTINGS_KEY, importData.settings);
    
    return saveSuccess && settingsSuccess;
  } catch (error) {
    console.error('Failed to import game data:', error);
    return false;
  }
}

/**
 * Clear all game data
 */
export function clearAllGameData(): boolean {
  try {
    deleteFromLocalStorage(SAVE_KEY);
    deleteFromLocalStorage(SETTINGS_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear game data:', error);
    return false;
  }
}