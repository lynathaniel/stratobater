import { create } from 'zustand';

export interface StoreState {
  root: string;
  scaleType: string;
  tuning: string[];
  showRoots: boolean;
  showTriads: boolean;
}

export interface StoreActions {
  setRoot: (root: string) => void;
  setScaleType: (scaleType: string) => void;
  setTuning: (tuning: string[]) => void;
  toggleShowRoots: () => void;
  toggleShowTriads: () => void;
}

export const useStore = create<StoreState & StoreActions>((set) => ({
  root: 'C',
  scaleType: 'major',
  tuning: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  showRoots: true,
  showTriads: false,
  setRoot: (root) => set({ root }),
  setScaleType: (scaleType) => set({ scaleType }),
  setTuning: (tuning) => set({ tuning }),
  toggleShowRoots: () => set((state) => ({ showRoots: !state.showRoots })),
  toggleShowTriads: () => set((state) => ({ showTriads: !state.showTriads })),
}));
