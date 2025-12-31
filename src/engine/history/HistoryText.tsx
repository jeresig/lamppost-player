import type { GameState, Widget } from "../shared/types";
import {
    historyWidgets,
    processTextLineWidgets,
    textLineWidgets,
} from "../shared/widgets";

const Line = ({ text }: { text: string | Widget }) => {
    if (typeof text === "string") {
        let processedText = text;

        for (const processTextLine of processTextLineWidgets.values()) {
            processedText = processTextLine({
                line: processedText,
                context: "history",
            });
        }

        let contents = (
            // biome-ignore lint/security/noDangerouslySetInnerHtml: ...
            <p dangerouslySetInnerHTML={{ __html: processedText }} />
        );

        for (const TextLine of textLineWidgets.values()) {
            contents = <TextLine context="history">{contents}</TextLine>;
        }

        return contents;
    }
    const Widget = historyWidgets.get(text.type);
    if (Widget) {
        return <Widget input={text.input} />;
    }
    return null;
};

export default function HistoryText({
    currentState,
}: {
    currentState: GameState;
}) {
    return (
        <>
            {currentState.lines.map((line, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: ...
                <Line key={i} text={line} />
            ))}
        </>
    );
}
