import { useCallback } from "preact/hooks";
import Button from "react-bootstrap/Button";
import Placeholder from "react-bootstrap/Placeholder";

import { useStoryStore } from "../shared/game-state";
import { useSavedGamesStore } from "../shared/saved-games";
import type { Widget } from "../shared/types";
import { gameChoiceWidgets } from "../shared/widgets";

const handleAutoFocus = (element: HTMLButtonElement | null) => {
    element?.focus({ preventScroll: true });
};

const Choice = ({
    choice,
    onCompletion,
    autoFocus,
}: {
    choice: string | Widget;
    onCompletion: ({
        output,
        variables,
    }: {
        output?: Record<string, string>;
        variables?: Record<string, string>;
    }) => void;
    autoFocus: boolean;
}) => {
    const currentState = useStoryStore((state) => state.currentState);
    const story = useStoryStore((state) => state.story);

    if (!currentState || !story) {
        return null;
    }

    if (typeof choice === "string") {
        return (
            <Button
                ref={autoFocus ? handleAutoFocus : undefined}
                variant="light"
                className="text-start"
                onClick={() => onCompletion({})}
            >
                {choice}
            </Button>
        );
    }

    const Widget = gameChoiceWidgets.get(choice.type);
    if (Widget) {
        return (
            <Widget
                input={choice.input}
                onCompletion={onCompletion}
                autoFocus={autoFocus}
            />
        );
    }

    return null;
};

export default function GameChoices() {
    const currentState = useStoryStore((state) => state.currentState);
    const selectChoice = useStoryStore((state) => state.selectChoice);
    const deleteSavedGame = useSavedGamesStore((state) => state.deleteSavedGame);
    const addSavedGame = useSavedGamesStore((state) => state.addSavedGame);
    const localSaveOnly = useSavedGamesStore((state) => !state.canSaveInLocalStorage());

    const onCompletion = useCallback(
        (index: number) => {
            return ({
                output,
                variables,
            }: {
                output?: Record<string, string>;
                variables?: Record<string, string>;
            }) => {
                const results = selectChoice({ index, output, variables });

                if (results && !localSaveOnly) {
                    const { gameState, story } = results;

                    deleteSavedGame("autosave");
                    addSavedGame({
                        id: "autosave",
                        title: "Autosave",
                        steps: Math.max(gameState.length - 1, 1),
                        date: new Date().toLocaleString(),
                        gameState,
                        storyData: story.state.toJson(),
                    });
                }
            };
        },
        [selectChoice],
    );

    if (!currentState) {
        return (
            <>
                <p>
                    <Placeholder.Button
                        xs={5}
                        variant="light"
                        className="placeholder-wave"
                    />
                </p>
                <p>
                    <Placeholder.Button
                        xs={7}
                        variant="light"
                        className="placeholder-wave"
                    />
                </p>
                <p>
                    <Placeholder.Button
                        xs={6}
                        variant="light"
                        className="placeholder-wave"
                    />
                </p>
                <p>
                    <Placeholder.Button
                        xs={3}
                        variant="light"
                        className="placeholder-wave"
                    />
                </p>
            </>
        );
    }

    const choices = currentState.choices.map((choice, index) => (
        <Choice
            key={`choice-${currentState.id}-${index}`}
            autoFocus={index === 0}
            choice={choice}
            onCompletion={onCompletion(index)}
        />
    ));

    return <div className="d-grid gap-3">{choices}</div>;
}
