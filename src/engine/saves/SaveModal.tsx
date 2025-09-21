import DownloadIcon from "bootstrap-icons/icons/download.svg?react";
import SaveIcon from "bootstrap-icons/icons/save.svg?react";
import { useRef } from "preact/hooks";
import Button from "react-bootstrap/button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/modal";

import settings from "../../story/settings";
import { useStoryStore } from "../shared/game-state";
import { useSavedGamesStore } from "../shared/saved-games";

/**
 * Check to see if the current page is in a cross-origin iframe.
 */
const isInCrossOriginIframe = () => {
    try {
        return window.self.location.origin !== window.top?.location.origin;
    } catch (_e) {
        // If there's an error, assume we're in a cross-origin iframe as
        // we don't have access to the top window.
        return true;
    }
};

/**
 * Safari and Firefox do not allow storing to localStorage when
 * inside a cross-origin iframe.
 */
const disallowsCrossOriginSaves = () => {
    return (
        (navigator.userAgent.includes("Safari") &&
            !navigator.userAgent.includes("Chrome")) ||
        navigator.userAgent.includes("Firefox")
    );
};

export function SaveModal({
    show,
    handleClose,
    onSave,
}: {
    show: boolean;
    handleClose: () => void;
    onSave?: () => void;
}) {
    const saveNameRef = useRef<HTMLInputElement>(null);
    const story = useStoryStore((state) => state.story);
    const gameState = useStoryStore((state) => state.gameState);
    const addSavedGame = useSavedGamesStore((state) => state.addSavedGame);
    const localSaveOnly =
        isInCrossOriginIframe() && disallowsCrossOriginSaves();
    const currentState = useStoryStore((state) => state.currentState);
    const { shortGameName, gameName } = settings;

    const handleSave = () => {
        if (!gameState || !story) {
            return;
        }
        addSavedGame({
            id: crypto.randomUUID(),
            title: saveNameRef.current?.value ?? "",
            steps: gameState.length,
            date: new Date().toLocaleString(),
            gameState: gameState,
            storyData: story.state.toJson(),
        });
        onSave?.();
        handleClose();
    };

    const downloadJSON = () => {
        if (!gameState || !story) {
            return;
        }
        const blob = new Blob(
            [
                JSON.stringify({
                    id: crypto.randomUUID(),
                    title: saveNameRef.current?.value ?? "",
                    steps: gameState.length,
                    date: new Date().toLocaleString(),
                    gameState: gameState,
                    storyData: story.state.toJson(),
                }),
            ],
            { type: "application/json" },
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${shortGameName || gameName}-save-${new Date().toISOString()}.json`;
        a.click();
        onSave?.();
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Save Game</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label htmlFor="saveName">
                    <strong>Save Name</strong>
                </Form.Label>
                <Form.Control
                    ref={saveNameRef}
                    type="text"
                    id="saveName"
                    aria-describedby="saveNameHelpBlock"
                    value={
                        saveNameRef.current?.value ??
                        (currentState && settings.defaultSaveName
                            ? settings.defaultSaveName(currentState)
                            : "Untitled Save")
                    }
                />
                <br />
                {!localSaveOnly && (
                    <>
                        <p>
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                disabled={localSaveOnly}
                            >
                                <SaveIcon className="bi bi-save" /> Save to
                                Browser Storage
                            </Button>
                        </p>
                        <p>
                            You can save your game to your browser's local
                            storage. This is the recommended way to save your
                            game. Warning: If you clear your browser's storage,
                            you will lose your saves.
                        </p>
                        <hr />
                    </>
                )}
                <p>
                    {localSaveOnly
                        ? "Download a file to save your game to your disk."
                        : "Alternatively, you can download a file to save your game to your disk."}
                </p>
                <p>
                    <Button
                        variant={localSaveOnly ? "primary" : "secondary"}
                        onClick={downloadJSON}
                    >
                        <DownloadIcon className="bi bi-download" /> Export Save
                        File
                    </Button>
                </p>
            </Modal.Body>
        </Modal>
    );
}
