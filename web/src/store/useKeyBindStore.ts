import { create } from 'zustand';

export interface KeyBindsType {
  key: string;
  label: string;
}

export interface KeyBinds {
  keyBinds: { [key: string]: KeyBindsType };
}

interface KeyBindStore {
  keyBinds: KeyBinds;
  setKeyBinds: (data: KeyBinds) => void;
}

const useKeyBindStore= create<KeyBindStore>((set) => ({
  keyBinds: { keyBinds: {} },

  setKeyBinds: (data) => set({ keyBinds: data }), 
}));

export default useKeyBindStore;
