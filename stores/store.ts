import { create } from "zustand";
import { persist } from "zustand/middleware";

interface gameIdStore {
  gameId: string;
  setGameId: (gameId: string) => void;
}
type player = "player1" | "player2" | "";

interface playerStore {
  player: player;
  playerId: string;
  setPlayer: (player: player, playerId: string) => void;
}

export const useGameIdStore = create<gameIdStore>()(
  persist(
    (set) => ({
      gameId: "",
      setGameId: (gameId) => set({ gameId }),
    }),
    { name: "gameId-storage" }
  )
);

export const usePlayerStore = create<playerStore>()(
  persist(
    (set) => ({
      player: "",
      playerId: "",
      setPlayer: (player, playerId) => set({ player, playerId }),
    }),
    { name: "player-storage" }
  )
);
