import { useStoryStore } from "../shared/game-state";
import { headerWidgets } from "../shared/widgets";

export default function GameHeader() {
    const currentState = useStoryStore((state) => state.currentState);

    if (!currentState) {
        return null;
    }

    const widgets = Array.from(headerWidgets.values())
        .map((Widget, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: ...
            <Widget key={index} currentState={currentState} />
        ));

    return <div style={{ position: "relative" }}>{widgets}</div>;
}
