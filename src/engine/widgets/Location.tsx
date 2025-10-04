import type { GameState, WidgetKnotProps, WidgetRegistry } from "../shared/types";

const key = ({ currentState }: { currentState: GameState }) => {
    return currentState.tags.Location || null;
}

function Location({ currentState, transitionStatus }: WidgetKnotProps) {
    const location = currentState.tags.Location;

    if (!location) {
        return null;
    }

    const hasHeaderImage = currentState.tags.Image;

    return (
        <h1
            style={
                hasHeaderImage
                    ? {
                        position: "absolute",
                        bottom: 0,
                        left: "var(--bs-card-spacer-x)",
                        marginBottom: 0,
                    }
                    : {
                        marginLeft: "var(--bs-card-spacer-x)",
                        display: "inline-block",
                    }
            }
            className={`fs-3 bg-body bg-opacity-75 p-2 rounded-top transitioned ${transitionStatus || ""}`}
        >
            {location}
        </h1>
    );
}

export const locationWidget = {
    type: "location",
    header: Location,
    key,
} satisfies WidgetRegistry;
