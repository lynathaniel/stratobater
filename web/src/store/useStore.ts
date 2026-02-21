import { create } from 'zustand';

export interface StoreState {
  root: string;
  scaleType: string;
  tuning: string[];
  showRoots: boolean;
  showTriads: boolean;
}

export const useStore = create<StoreState>(() => ({
  root: 'C',
  scaleType: 'major',
  tuning: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  showRoots: true,
  showTriads: false,
}));
