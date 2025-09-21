import { create } from "zustand";
import { persist } from "zustand/middleware";

import settings from "../../story/settings";
import type { SavedGame } from "./types";

export const useSavedGamesStore = create<{
    savedGames: SavedGame[];
    getMostRecentSavedGame: () => SavedGame | null;
    setSavedGames: (savedGames: SavedGame[]) => void;
    addSavedGame: (savedGame: SavedGame) => void;
    deleteSavedGame: (savedGameId: string) => void;
}>()(
    persist(
        (set, get) => ({
            savedGames: [],
            getMostRecentSavedGame: () =>
                get().savedGames[get().savedGames.length - 1],
            setSavedGames: (savedGames: SavedGame[]) => set({ savedGames }),
            addSavedGame: (savedGame: SavedGame) =>
                set({ savedGames: [...(get().savedGames || []), savedGame] }),
            deleteSavedGame: (savedGameId: string) =>
                set({
                    savedGames: get().savedGames?.filter(
                        (savedGame) => savedGame.id !== savedGameId,
                    ),
                }),
        }),
        { name: `${settings.gameName}-savedGames` },
    ),
);
