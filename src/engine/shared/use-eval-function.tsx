import { GameTextLine } from "../game/GameText";
import { useStoryStore } from "./game-state";

export const useEvalFunction = (functionName: string, args: any[]) => {
    const story = useStoryStore((state) => state.story);
    if (!story) {
        return null;
    }
    const { output, error } = story.EvaluateFunction(functionName, args, true);
    if (error) {
        console.error(error);
        return null;
    }
    const lines = (output as string).split("\n").map((line, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: ...
        <GameTextLine key={`line-${index}`} text={line} />
    ));
    return <div>{lines}</div>;
};
