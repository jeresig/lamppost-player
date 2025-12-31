import type { GameState } from "../shared/types";
import { historyWidgets, processTextLineWidgets } from "../shared/widgets";

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

        return (
            <p>
                <strong>
                    &raquo;{" "}
                    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: We want to render the HTML */}
                    <span dangerouslySetInnerHTML={{ __html: processedText }} />
                </strong>
            </p>
        );
    }

    const Widget = historyWidgets.get(choice.type);
    if (Widget) {
        return <Widget input={choice.input} output={choice.output} />;
    }
    return null;
}
