import { useState } from "react";
import Button from "react-bootstrap/Button";
import BootstrapImage from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";

import type {
    GameState,
    WidgetKnotProps,
    WidgetRegistry,
} from "../shared/types";
import { getWidgetSettings } from "../shared/widgets";

const key = ({ currentState }: { currentState: GameState }) => {
    return currentState.tags.Portrait || null;
};

function Portrait({ currentState, transitionStatus }: WidgetKnotProps) {
    const [showPortraitModal, setShowPortraitModal] = useState(false);
    const portraits = getWidgetSettings("portrait");
    const portrait = currentState.tags.Portrait as keyof typeof portraits;
    const portraitSrc = portraits?.[portrait]?.small;

    if (!portraitSrc) {
        return null;
    }

    const alt = `Portrait of ${portrait}`;
    const largePortraitSrc = portraits?.[portrait].large;
    const portraitImg = (
        <BootstrapImage
            fluid
            thumbnail
            className={`float-end transitioned ${transitionStatus || ""}`}
            style={{ width: "30%", marginLeft: "16px", marginBottom: "16px" }}
            src={portraitSrc}
            alt={alt}
        />
    );

    if (!largePortraitSrc) {
        return portraitImg;
    }

    return (
        <>
            <a
                href={`?portrait=${portrait}`}
                onClick={(e) => {
                    setShowPortraitModal(true);
                    e.preventDefault();
                }}
            >
                {portraitImg}
            </a>
            <Modal
                show={showPortraitModal}
                onHide={() => setShowPortraitModal(false)}
                onClick={() => setShowPortraitModal(false)}
            >
                <Button
                    variant="close"
                    aria-label="Close"
                    style={{ position: "absolute", top: 8, right: 8 }}
                />
                <BootstrapImage fluid src={largePortraitSrc} alt={alt} />
            </Modal>
        </>
    );
}

const preload = async () => {
    const portraits = getWidgetSettings("portrait");

    if (!portraits) {
        return;
    }

    return Promise.all(
        Object.values(portraits).map(({ small }) => {
            return new Promise((resolve) => {
                const smallImg = new Image();
                smallImg.src = small;
                smallImg.onload = resolve;
            });
        }),
    );
};

export const portraitWidget = {
    type: "portrait",
    knot: Portrait,
    preload,
    key,
} satisfies WidgetRegistry;
