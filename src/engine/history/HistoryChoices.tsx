import type { GameState } from "../shared/types";
import {
    historyWidgets,
    processTextLineWidgets,
    textLineWidgets,
} from "../shared/widgets";

export default function HistoryChoices({
    currentState,
}: {
    currentState: GameState;
}) {
    if (currentState.selectedChoice == null) {
        return null;
    }

    const { choice } = currentState.choices[currentState.selectedChoice];

    if (typeof choice === "string") {
        let processedText = choice;

        for (const processTextLine of processTextLineWidgets.values()) {
            processedText = processTextLine({
                line: processedText,
                context: "history-choice",
            });
        }

        let contents = (
            // biome-ignore lint/security/noDangerouslySetInnerHtml: ...
            <span dangerouslySetInnerHTML={{ __html: processedText }} />
        );

        for (const TextLine of textLineWidgets.values()) {
            contents = <TextLine context="history-choice">{contents}</TextLine>;
        }

        return (
            <p>
                <strong>&raquo; {contents}</strong>
            </p>
        );
    }

    const Widget = historyWidgets.get(choice.type);
    if (Widget) {
        return <Widget input={choice.input} output={choice.output} />;
    }
    return null;
}
