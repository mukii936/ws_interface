import { create } from 'zustand';

export interface UpdateJobOne {
    label: string;
    grade: string;
}

export interface UpdateJobTwo {
    label: string;
    grade: string;
}

export interface UpdateMoney {
    cash: number;
    bank: number;
}

export interface UpdateWeapon {
  weaponName: string;
  clipAmmoCount: number;
  ammoCount: number;
}

export interface playerInfo {
    playerCount: number;
}

interface InfoHudStore {
  updateJobOne: UpdateJobOne;
  setUpdateJobOne: (data: UpdateJobOne) => void;

  updateJobTwo: UpdateJobTwo;
  setUpdateJobTwo: (data: UpdateJobTwo) => void;

  updateMoney: UpdateMoney;
  setUpdateMoney: (data: UpdateMoney) => void;

  updateWeapon: UpdateWeapon;
  setUpdateWeapon: (data: UpdateWeapon) => void;

  playerInfo: playerInfo;
  setPlayerInfo: (data: playerInfo) => void;
}

const useInfoHudStore = create<InfoHudStore>((set) => ({
  updateJobOne: { label: '', grade: '' },
  setUpdateJobOne: (data) => set({ updateJobOne: data }),

  updateJobTwo: { label: '', grade: '' },
  setUpdateJobTwo: (data) => set({ updateJobTwo: data }),

  updateMoney: { cash: 0, bank: 0 },
  setUpdateMoney: (data) => set({ updateMoney: data }),

  updateWeapon: { weaponName: '', clipAmmoCount: 0, ammoCount: 0 },
  setUpdateWeapon: (data) => set({ updateWeapon: data }),

  playerInfo: { playerCount: 0 },
  setPlayerInfo: (data) => set({ playerInfo: data }),
}));

export default useInfoHudStore;
