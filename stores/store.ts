import { create } from "zustand";
import { persist } from "zustand/middleware";

interface gameIdStore {
  gameId: string;
  setGameId: (gameId: string) => void;
}
type player = "player1" | "player2" | "";

export type ImageState = "normal" | "blurred" | "selected";

interface imageSelectionStore {
  isSelected: boolean;
  isBothSelected: boolean;
  selectedImageId: string;
  setIsSelected: () => void;
  setIsBothSelected: () => void;
  setSelectedImageId: (id: string) => void;
}

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

export const useImageSelectionStore = create<imageSelectionStore>()(
  persist(
    (set) => ({
      isBothSelected: false,
      isSelected: false,
      selectedImageId: "",
      setIsBothSelected: () => {
        set({ isBothSelected: true });
      },
      setIsSelected: () => {
        set({ isSelected: true });
      },
      setSelectedImageId: (id) => set({ selectedImageId: id }),
    }),
    { name: "image-selection-store" }
  )
);
