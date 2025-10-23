import type React from "react";
import type { TransitionStatus } from "react-transition-state";

export type SavedGame = {
    id: string;
    title: string;
    steps: number;
    date: string;
    gameState: GameState[];
    storyData: string;
};

export type Widget = {
    type: string;
    input: Record<string, string>;
    output?: Record<string, string>;
};

export type GameState = {
    id: string;
    lines: Array<string | Widget>;
    tags: Record<string, string>;
    choices: Array<string | Widget>;
    selectedChoice?: number;
};

export type ScreenProps = {
    page: string;
    setPage: (page: string) => void;
    loading: boolean;
};

export type Screen = {
    id: string;
    title: string;
    component: "History" | "Game" | ((props: ScreenProps) => React.ReactNode);
};

export type Settings = {
    enableDarkMode?: boolean | "toggle";
    defaultTheme?: string;
    loadStory: () => Promise<{ inkVersion: number }>;
    defaultSaveName?: (currentState: GameState) => string;
    stickyTags?: string[];
    gameName: string;
    shortGameName?: string;
    favicon?: string;
    widgets?: Record<string, Record<string, any>>;
};

export type WidgetChoiceProps = {
    input: Record<string, string>;
    onCompletion: ({
        output,
        variables,
    }: {
        output?: Record<string, string>;
        variables?: Record<string, string>;
    }) => void;
    autoFocus: boolean;
    disabled: boolean;
};

export type WidgetGameTextProps = {
    input: Record<string, string>;
};

export type WidgetHistoryProps = {
    input: Record<string, string>;
    output?: Record<string, string>;
};

export type WidgetHeaderProps = {
    currentState: GameState;
    transitionStatus: TransitionStatus | undefined;
};

export type WidgetKnotProps = {
    currentState: GameState;
    transitionStatus: TransitionStatus | undefined;
};

export type WidgetKeyProps = {
    currentState: GameState;
};

export type WidgetRegistry = {
    type: string;
    log?: (props: WidgetHistoryProps) => string;
    history?: (props: WidgetHistoryProps) => React.ReactNode;
    gameText?: (props: WidgetGameTextProps) => React.ReactNode;
    gameChoice?: (props: WidgetChoiceProps) => React.ReactNode;
    header?: (props: WidgetHeaderProps) => React.ReactNode;
    knot?: (props: WidgetKnotProps) => React.ReactNode;
    preload?: () => Promise<any>;
    key?: (props: WidgetKeyProps) => string | null;
};
