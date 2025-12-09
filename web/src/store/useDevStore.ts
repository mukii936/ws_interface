import { create } from 'zustand';

export const useDevStore = create<{
  showLog: boolean;
  toggleLog: () => void;
}>((set) => ({
  showLog: false,
  toggleLog: () => set((state) => ({ showLog: !state.showLog })),
}));
