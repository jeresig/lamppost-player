import type { GameState, Widget } from "../shared/types";

const Line = ({ line }: { line: string | Widget }) => {
    if (typeof line === "string") {
        // biome-ignore lint/security/noDangerouslySetInnerHtml: ...
        return <p dangerouslySetInnerHTML={{ __html: line }} />;
    }
    return null; //<WidgetComponent {...line} />;
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
                <Line key={i} line={line} />
            ))}
        </>
    );
}
