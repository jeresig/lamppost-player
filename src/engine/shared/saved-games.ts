import { create } from "zustand";
import { persist } from "zustand/middleware";

import settings from "../../story/settings";
import type { SavedGame } from "./types";

/**
 * Check to see if the current page is in a cross-origin iframe.
 */
const isInCrossOriginIframe = () => {
    try {
        return window.self.location.origin !== window.top?.location.origin;
    } catch (_e) {
        // If there's an error, assume we're in a cross-origin iframe as
        // we don't have access to the top window.
        return true;
    }
};

/**
 * Safari and Firefox do not allow storing to localStorage when
 * inside a cross-origin iframe.
 */
const disallowsCrossOriginSaves = () => {
    return (
        (navigator.userAgent.includes("Safari") &&
            !navigator.userAgent.includes("Chrome")) ||
        navigator.userAgent.includes("Firefox")
    );
};

export const useSavedGamesStore = create<{
    savedGames: SavedGame[];
    getMostRecentSavedGame: () => SavedGame | null;
    setSavedGames: (savedGames: SavedGame[]) => void;
    addSavedGame: (savedGame: SavedGame) => void;
    deleteSavedGame: (savedGameId: string) => void;
    canSaveInLocalStorage: () => boolean;
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
            canSaveInLocalStorage: () =>
                !isInCrossOriginIframe() && !disallowsCrossOriginSaves(),
        }),
        { name: `${settings.gameName}-savedGames` },
    ),
);
