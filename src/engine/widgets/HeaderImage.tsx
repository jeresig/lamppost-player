import Card from "react-bootstrap/Card";

import type { GameState, WidgetRegistry } from "../shared/types";
import { getWidgetSettings } from "../shared/widgets";

function HeaderImage({ currentState }: { currentState: GameState }) {
    const headerImages = getWidgetSettings("headerImage");
    const imageSrc =
        headerImages?.[currentState.tags.Image as keyof typeof headerImages];
    if (!imageSrc) {
        return null;
    }
    return (
        <Card.Img src={imageSrc} alt={currentState.tags.Image} variant="top" />
    );
}

export const preload = async () => {
    const headerImages = getWidgetSettings("headerImage");

    if (!headerImages) {
        return;
    }

    return Promise.all(
        Object.values(headerImages).map((headerImage) => {
            return new Promise((resolve) => {
                const headerImg = new Image();
                headerImg.src = headerImage;
                headerImg.onload = resolve;
            });
        }),
    );
};

export const headerImageWidget = {
    type: "header-image",
    header: HeaderImage,
    preload,
} satisfies WidgetRegistry;
