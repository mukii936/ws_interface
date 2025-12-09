import { create } from "zustand";

export const useLogStore = create<{
    logs: { type: "log" | "warn" | "error"; msg: string }[];
    add: (type: "log" | "warn" | "error", msg: string) => void;
    clear: () => void;
}>((set) => ({
    logs: [],
    add: (type, msg) =>
        set((s) => ({
            logs: [...s.logs, { type, msg }],
        })),
    clear: () => set({ logs: [] }),
}));
