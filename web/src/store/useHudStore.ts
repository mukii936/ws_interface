import { create } from 'zustand';

export interface StatusData {
    show: boolean;
    health: number;
    armor: number;
    hunger: number;
    thirst: number;
    stress: number;
    oxygen: number;
    playerid: number;
}

export interface CarData {
    show: boolean;
    speed: number;
    fuel: number;
    engine: number;
    gear: number;
    light: number;
    rpmPercent: number;
    seatbelt: boolean;
    doorOpen: boolean;
}

export interface StreetInfo {
    streetName: string;
    streetLabel: string;
}

export interface EditMode {
    editMode: boolean;
}

export interface HudColors {
    health: string;
    armor: string;
    hunger: string;
    thirst: string;
    stress: string;
    oxygen: string;
}

export interface CarHudColors {
    colors: string;
}

export interface NotifyColors {
    colors: string;
}

export interface HudType {
    type: 'Wave' | 'Hex' | 'HexBox';
}

interface HudStore {
    statusData: StatusData;
    setStatusData: (data: StatusData) => void;

    carData: CarData;
    setCarData: (data: CarData) => void;

    streetInfo: StreetInfo;
    setStreetInfo: (data: StreetInfo) => void;

    editMode: EditMode;
    setEditMode: (data: EditMode) => void;

    hudColors: HudColors;
    setHudColor: (key: keyof HudColors, color: string) => void;

    carHudColors: CarHudColors;
    setCarHudColor: (color: string) => void;

    notifyColors: NotifyColors;
    setNotifyColors: (color: string) => void;

    hudType: HudType;
    setHudType: (data: HudType) => void;

    resetHudSettings: () => void;
    resetHudPositions: () => void;
}

const loadHudColors = (): HudColors => {
    const saved = localStorage.getItem("hudColors");
    if (saved) return JSON.parse(saved);

    return {
        health: "#EE2D2D",
        armor: "#EE2D2D",
        hunger: "#EE2D2D",
        thirst: "#EE2D2D",
        stress: "#EE2D2D",
        oxygen: "#EE2D2D",
    };
};

const loadHudType = (): HudType => {
    const saved = localStorage.getItem("hudType");
    if (saved) return JSON.parse(saved);

    return { type: "Wave" };
};

const loadCarHudColors = (): CarHudColors => {
    const saved = localStorage.getItem("carHudColors");
    if (saved) return JSON.parse(saved);
    return { colors: "#EE2D2D" };
};

const loadNotifyColors = (): NotifyColors => {
    const saved = localStorage.getItem("notifyColors");
    if (saved) return JSON.parse(saved);
    return { colors: "#EE2D2D" };
};


const useHudStore = create<HudStore>((set) => ({
    statusData: { show: false, health: 0, armor: 0, hunger: 0, thirst: 0, stress: 0, oxygen: 0, playerid: 0 },
    setStatusData: (data) => set({ statusData: data }),

    carData: { show: false, speed: 0, fuel: 0, rpmPercent: 0, engine: 0, light: 0, seatbelt: false, doorOpen: false, gear: 0 },
    setCarData: (data) => set({ carData: data }),

    streetInfo: { streetName: '', streetLabel: '' },
    setStreetInfo: (data) => set({ streetInfo: data }),

    editMode: { editMode: false },
    setEditMode: (data) => set({ editMode: data }),

    carHudColors: loadCarHudColors(),
    setCarHudColor: (color) => set(() => { const updated = { colors: color }; localStorage.setItem("carHudColors", JSON.stringify(updated)); return { carHudColors: updated }; }),

    notifyColors: loadNotifyColors(),
    setNotifyColors: (color) => set(() => { const updated = { colors: color }; localStorage.setItem("notifyColors", JSON.stringify(updated)); return { notifyColors: updated }; }),

    hudColors: loadHudColors(),
    setHudColor: (key, color) =>
        set((state) => {
            const updated = { ...state.hudColors, [key]: color };
            localStorage.setItem("hudColors", JSON.stringify(updated));
            return { hudColors: updated };
        }),

    hudType: loadHudType(),
    setHudType: (data) =>
        set(() => {
            localStorage.setItem("hudType", JSON.stringify(data));
            return { hudType: data };
        }),

    resetHudSettings: () =>
        set(() => {
            localStorage.removeItem("hudColors");
            localStorage.removeItem("hudType");

            return {
                hudColors: {
                    health: "#EE2D2D",
                    armor: "#EE2D2D",
                    hunger: "#EE2D2D",
                    thirst: "#EE2D2D",
                    stress: "#EE2D2D",
                    oxygen: "#EE2D2D",
                },
                hudType: { type: "Wave" },
            };
        }),

    resetHudPositions: () => {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("hud_pos_")) {
                localStorage.removeItem(key);
            }
        });
    }
}));

export default useHudStore;
