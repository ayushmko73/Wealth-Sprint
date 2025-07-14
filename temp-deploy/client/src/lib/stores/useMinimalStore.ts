import { create } from 'zustand';

interface MinimalGameState {
  gameStarted: boolean;
  startGame: () => void;
}

export const useMinimalStore = create<MinimalGameState>((set) => ({
  gameStarted: false,
  startGame: () => set({ gameStarted: true }),
}));