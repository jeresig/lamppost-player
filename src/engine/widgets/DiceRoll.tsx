import BootstrapImage from "react-bootstrap/Image";

import type {
    WidgetGameTextProps,
    WidgetHistoryProps,
    WidgetRegistry,
} from "../shared/types";
import { getWidgetSettings } from "../shared/widgets";

const getAlt = (input: Record<string, string>) => {
    return (
        input.alt ||
        `A ${input.die} die showing a ${input.value} on the top face.`
    );
};

function DiceRoll({ input }: WidgetGameTextProps) {
    const diceSettings = getWidgetSettings("dice-roll");
    const die = input.die as string;
    const value = input.value as string;
    const alt = input.alt as string;
    const diceSrc = diceSettings?.[die]?.[value] as string;

    if (!diceSrc) {
        return alt ? <p>{alt}</p> : null;
    }

    return (
        <p>
            <BootstrapImage
                fluid
                src={diceSrc}
                alt={getAlt({ die, value, alt })}
                className="dice-roll"
            />
        </p>
    );
}

function DiceRollHistory({ input }: WidgetHistoryProps) {
    return (
        <p>
            [<strong>Dice Roll:</strong> {getAlt(input)}]
        </p>
    );
}

const log = ({ input }: WidgetHistoryProps) => {
    return `<p>[<strong>Dice Roll:</strong> ${getAlt(input)}]</p>`;
};

export const preload = async () => {
    const diceSettings = getWidgetSettings("dice-roll");

    if (!diceSettings) {
        return;
    }

    return Promise.all(
        Object.values(diceSettings).flatMap((diceSize) => {
            return Object.values(diceSize).map((face) => {
                return new Promise((resolve) => {
                    const faceImg = new Image();
                    faceImg.src = face as string;
                    faceImg.onload = resolve;
                });
            });
        }),
    );
};

export const diceRollWidget = {
    type: "dice-roll",
    gameText: DiceRoll,
    history: DiceRollHistory,
    log,
    preload,
} satisfies WidgetRegistry;
