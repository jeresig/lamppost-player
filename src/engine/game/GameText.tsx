import { memo } from "react";
import Placeholder from "react-bootstrap/Placeholder";
import type { TransitionStatus } from "react-transition-state";

import { useStoryStore } from "../shared/game-state";
import type { GameState, Widget } from "../shared/types";
import { gameTextWidgets } from "../shared/widgets";

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

function GameText({ currentState, transitionStatus, isMounted }: { currentState: GameState | null, transitionStatus: TransitionStatus | undefined, isMounted: boolean }) {
    if (!isMounted || !transitionStatus) {
        return null;
    }

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

    const text = currentState.lines.map((line, index) => (
        <Line key={`line-${currentState.id}-${index}`} text={line} />
    ));

    return (
        <div className={`transitioned ${transitionStatus}`}>
            {text}
        </div>
    );
}

export default memo(GameText);
