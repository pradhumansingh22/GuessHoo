import { create } from "zustand";
import { persist } from "zustand/middleware";

interface gameIdStore {
  gameId: string;
  setGameId: (gameId: string) => void;
}

export const useGameIdStore = create<gameIdStore>()(
  persist(
    (set) => ({
      gameId: "",
      setGameId: () => set((gameId) => gameId),
    }),
    { name: "gameId-storage" }
  )
);
