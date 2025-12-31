import settings from "../../story/settings";
import type {
    ScreenProps,
    WidgetChoiceProps,
    WidgetGameTextProps,
    WidgetHandleStoryLoadProps,
    WidgetHeaderProps,
    WidgetHistoryProps,
    WidgetKeyProps,
    WidgetKnotProps,
    WidgetProcessTextLineProps,
    WidgetRegistry,
    WidgetTextLineProps,
    WidgetToastFn,
} from "./types";

export const logWidgets = new Map<
    string,
    (props: WidgetHistoryProps) => string
>();
export const toastWidgets = new Map<string, WidgetToastFn>();
export const screenWidgets = new Map<
    string,
    (props: ScreenProps) => React.ReactNode
>();
export const historyWidgets = new Map<
    string,
    (props: WidgetHistoryProps) => React.ReactNode
>();
export const gameTextWidgets = new Map<
    string,
    (props: WidgetGameTextProps) => React.ReactNode
>();
export const gameChoiceWidgets = new Map<
    string,
    (props: WidgetChoiceProps) => React.ReactNode
>();
export const headerWidgets = new Map<
    string,
    (props: WidgetHeaderProps) => React.ReactNode
>();
export const knotWidgets = new Map<
    string,
    (props: WidgetKnotProps) => React.ReactNode
>();
export const preloadWidgets = new Map<string, () => Promise<any>>();
export const keyWidgets = new Map<
    string,
    (props: WidgetKeyProps) => string | null
>();
export const processTextLineWidgets = new Map<
    string,
    (props: WidgetProcessTextLineProps) => string
>();
export const textLineWidgets = new Map<
    string,
    (props: WidgetTextLineProps) => React.ReactNode
>();
export const handleStoryLoadWidgets = new Map<
    string,
    (props: WidgetHandleStoryLoadProps) => void
>();

export const registerWidget = (widget: WidgetRegistry) => {
    if (widget.log) {
        logWidgets.set(widget.type, widget.log);
    }
    if (widget.toast) {
        toastWidgets.set(widget.type, widget.toast);
    }
    if (widget.screen) {
        screenWidgets.set(widget.type, widget.screen);
    }
    if (widget.history) {
        historyWidgets.set(widget.type, widget.history);
    }
    if (widget.gameText) {
        gameTextWidgets.set(widget.type, widget.gameText);
    }
    if (widget.gameChoice) {
        gameChoiceWidgets.set(widget.type, widget.gameChoice);
    }
    if (widget.header) {
        headerWidgets.set(widget.type, widget.header);
    }
    if (widget.knot) {
        knotWidgets.set(widget.type, widget.knot);
    }
    if (widget.preload) {
        preloadWidgets.set(widget.type, widget.preload);
    }
    if (widget.key) {
        keyWidgets.set(widget.type, widget.key);
    }
    if (widget.processTextLine) {
        processTextLineWidgets.set(widget.type, widget.processTextLine);
    }
    if (widget.textLine) {
        textLineWidgets.set(widget.type, widget.textLine);
    }
    if (widget.handleStoryLoad) {
        handleStoryLoadWidgets.set(widget.type, widget.handleStoryLoad);
    }
};

export const getWidgetSettings = (widget: string) => {
    return (settings as any).widgets?.[widget] as
        | Record<string, any>
        | undefined;
};
