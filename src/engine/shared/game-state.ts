import type { Story } from "inkjs";
import { create } from "zustand";

import settings from "../../story/settings";
import type { GameState, SavedGame, Widget } from "./types";
import { preloadWidgets } from "./widgets";

export const useStoryStore = create<{
    id: string;
    story: Story | null;
    storyJSON: { inkVersion: number } | null;
    Story: typeof Story | null;
    error: string | null;
    _initializing: boolean;
    gameState: GameState[];
    currentState: GameState | null;
    previousState: GameState | null;
    loadStoryData: () => Promise<void>;
    loadSavedGame: (savedGame: SavedGame) => void;
    startNewGame: () => void;
    selectChoice: ({
        index,
        output,
        variables,
    }: {
        index: number;
        output?: Record<string, string>;
        variables?: Record<string, string>;
    }) => { gameState: GameState[]; story: Story; error: string | null } | null;
}>((set, get) => ({
    id: "",
    story: null,
    storyJSON: null,
    Story: null,
    error: null,
    _initializing: false,
    gameState: [],
    currentState: null,
    previousState: null,
    loadStoryData: async () => {
        const { story, _initializing } = get();
        if (story || _initializing) {
            return;
        }
        set({ _initializing: true });
        const [storyJSON, { Story }] = await Promise.all([
            // Load the story data
            settings.loadStory(),

            // Load the inkjs library
            import("inkjs"),

            // Preload the widgets
            ...Array.from(preloadWidgets.values()).map((preloadWidget) =>
                preloadWidget?.(),
            ),
        ]);
        set({
            storyJSON,
            Story,
            id: crypto.randomUUID(),
            _initializing: false,
        });
    },
    startNewGame: () => {
        const { storyJSON, Story } = get();
        if (!storyJSON || !Story) {
            return;
        }
        const story = new Story(storyJSON);
        story.onError = (error) => {
            set({ error });
        };
        const newState = getStoryState({ story, currentState: null });
        if (newState) {
            set({
                id: crypto.randomUUID(),
                story,
                gameState: [newState],
                currentState: newState,
                previousState: null,
                error: null,
            });
        }
    },
    loadSavedGame: (savedGame: SavedGame) => {
        const { storyJSON, Story } = get();
        if (!storyJSON || !Story) {
            return;
        }
        const { gameState, storyData } = savedGame;
        const story = new Story(storyJSON);
        story.onError = (error) => {
            set({ error });
        };
        story.state.LoadJson(storyData);
        set({
            id: crypto.randomUUID(),
            story,
            gameState,
            currentState: gameState[gameState.length - 1],
            previousState: null,
            error: null,
        });
    },
    selectChoice: ({
        index,
        output,
        variables,
    }: {
        index: number;
        output?: Record<string, string>;
        variables?: Record<string, string>;
    }) => {
        const { story, currentState, gameState } = get();
        if (!story || !currentState) {
            return null;
        }

        currentState.selectedChoice = index;

        if (output) {
            const selectedChoice = currentState.choices[index];
            if (typeof selectedChoice !== "string") {
                selectedChoice.output = output;
            }
        }

        if (variables) {
            for (const [key, value] of Object.entries(variables)) {
                story.variablesState[key] = value;
            }
        }

        story.ChooseChoiceIndex(index);
        const newState = getStoryState({ story, currentState });
        if (newState) {
            const newGameState = [...(gameState || []), newState];
            set({
                gameState: newGameState,
                currentState: newState,
                previousState: currentState,
            });
            return {
                gameState: newGameState,
                story,
                error: get().error,
            };
        }
        return null;
    },
}));

const parseWidget = (line: string) => {
    if (line.includes("!widget:")) {
        const type = /!widget:([\w-]+)/.exec(line)?.[1];
        if (!type) {
            return line;
        }
        const input: Record<string, string> = {};
        const regex = /([\w-]+)="((?:[^"\\]|\\.)*)"/g;

        do {
            const match = regex.exec(line);
            if (match) {
                input[match[1]] = match[2];
            } else {
                break;
            }
            // biome-ignore lint/correctness/noConstantCondition: ...
        } while (true);

        return {
            type,
            input,
        } satisfies Widget;
    }
    return line;
};

const getStoryState = ({
    story,
    currentState,
}: {
    story: Story | null;
    currentState: GameState | null;
}) => {
    if (!story || !story.canContinue) {
        return null;
    }

    const lines: Array<string | Widget> = [];
    const tags: Record<string, string> = {};

    if (currentState && settings.stickyTags) {
        for (const tag of settings.stickyTags) {
            if (currentState.tags[tag]) {
                tags[tag] = currentState.tags[tag];
            }
        }
    }

    while (story.canContinue) {
        const textLine = story.Continue();
        if (textLine) {
            const trimmedTextLine = textLine.trim();
            if (trimmedTextLine) {
                const result = parseWidget(trimmedTextLine);
                lines.push(result);
            }
        }
        if (story.currentTags) {
            for (const tag of story.currentTags) {
                const [key, value] = tag.split(":").map((t) => t.trim());
                if (value === "None") {
                    delete tags[key];
                } else {
                    tags[key] = value;
                }
            }
        }
    }

    return {
        id: crypto.randomUUID(),
        lines,
        tags,
        choices: story.currentChoices.map((choice) => parseWidget(choice.text)),
    } satisfies GameState;
};
