import settings from "../../story/settings";
import type {
    WidgetChoiceProps,
    WidgetGameTextProps,
    WidgetHeaderProps,
    WidgetHistoryProps,
    WidgetKeyProps,
    WidgetKnotProps,
    WidgetRegistry,
} from "./types";

export const logWidgets = new Map<
    string,
    (props: WidgetHistoryProps) => string
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

export const registerWidget = (widget: WidgetRegistry) => {
    if (widget.log) {
        logWidgets.set(widget.type, widget.log);
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
};

export const getWidgetSettings = (widget: string) => {
    return (settings as any).widgets?.[widget] as
        | Record<string, any>
        | undefined;
};
