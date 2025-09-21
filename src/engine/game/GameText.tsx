import Placeholder from "react-bootstrap/Placeholder";

import { useStoryStore } from "../shared/game-state";
import type { Widget } from "../shared/types";
import { gameTextWidgets, knotWidgets } from "../shared/widgets";

const Line = ({ text }: { text: string | Widget }) => {
    const story = useStoryStore((state) => state.story);
    if (!story) {
        return null;
    }
    if (typeof text === "string") {
        // biome-ignore lint/security/noDangerouslySetInnerHtml: ...
        return <p dangerouslySetInnerHTML={{ __html: text }} />;
    }
    const Widget = gameTextWidgets.get(text.type);
    if (Widget) {
        return <Widget input={text.input} />;
    }
    return null;
};

export default function GameText() {
    const currentState = useStoryStore((state) => state.currentState);

    if (!currentState) {
        return (
            <div style={{ marginBottom: "1rem" }}>
                <Placeholder xs={12} className="placeholder-wave" />
                <Placeholder xs={12} className="placeholder-wave" />
                <Placeholder xs={5} className="placeholder-wave" />
                <Placeholder xs={12} className="placeholder-wave" />
                <Placeholder xs={12} className="placeholder-wave" />
                <Placeholder xs={12} className="placeholder-wave" />
                <Placeholder xs={7} className="placeholder-wave" />
            </div>
        );
    }

    const widgets = Array.from(knotWidgets.entries()).map(([type, Widget]) => (
        <Widget key={type} currentState={currentState} />
    ));

    const text = currentState.lines.map((line, index) => (
        <Line key={`line-${currentState.id}-${index}`} text={line} />
    ));

    return (
        <>
            {widgets}
            {text}
        </>
    );
}
