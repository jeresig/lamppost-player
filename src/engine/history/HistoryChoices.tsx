

import type { GameState } from "../shared/types";
import { historyWidgets } from "../shared/widgets";

export default function HistoryChoices({
    currentState,
}: {
    currentState: GameState;
}) {
    if (currentState.selectedChoice == null) {
        return null;
    }

    const choice = currentState.choices[currentState.selectedChoice];

    if (typeof choice === "string") {
        return (
            <p>
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: We want to render the HTML */}
                <strong>&raquo; <span dangerouslySetInnerHTML={{ __html: choice }} /></strong>
            </p>
        );
    }

    const Widget = historyWidgets.get(choice.type);
    if (Widget) {
        return <Widget input={choice.input} output={choice.output} />;
    }
    return null;
}
