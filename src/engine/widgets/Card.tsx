import { useCallback, useEffect, useRef } from "react";

import type {
    WidgetChoiceProps,
    WidgetHistoryProps,
    WidgetRegistry,
} from "../shared/types";
import { getWidgetSettings } from "../shared/widgets";

const renderCardLogView = ({ input: { title } }: WidgetHistoryProps) => {
    return `<p>&raquo; <strong>${title}</strong></p>`;
};

function CardHistory({ input: { title } }: WidgetHistoryProps) {
    return (
        <p>
            &raquo; <strong>{title}</strong>
        </p>
    );
}

function Card({ input, onCompletion, autoFocus, disabled }: WidgetChoiceProps) {
    const { icon, title, description } = input;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const cardImages = getWidgetSettings("card");

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            if (disabled) {
                return;
            }
            onCompletion({});
        },
        [onCompletion, disabled],
    );

    useEffect(() => {
        if (autoFocus && !disabled) {
            buttonRef.current?.focus({ preventScroll: true });
        }
    }, [autoFocus, disabled]);

    if (icon && !cardImages) {
        return null;
    }

    const cardImage = cardImages?.[icon as keyof typeof cardImages];
    const Icon = cardImage;
    const height = "100px";

    return (
        <button
            type="button"
            ref={buttonRef}
            onClick={handleClick}
            disabled={disabled}
        >
            <div
                className="card position-relative overflow-hidden"
                style={{ height: height }}
            >
                <div className="d-flex flex-row">
                    {cardImage && (
                        <div className="">
                            {typeof cardImage === "string" ? (
                                <img
                                    src={cardImage}
                                    className="rounded-start"
                                    style={{ height, width: "auto" }}
                                    alt={title}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: "100%",
                                        height,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: "10px",
                                    }}
                                >
                                    <Icon
                                        className="img-fluid"
                                        style={{
                                            width: "100%",
                                            height,
                                            objectFit: "contain",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <div className="">
                        <div className="card-body">
                            <h5 className="card-title">{title}</h5>
                            {description && (
                                <p className="card-text text-muted text-body-secondary small">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
}

const preload = async () => {
    const cardImages = getWidgetSettings("card");

    if (!cardImages) {
        return;
    }

    return Promise.all(
        Object.values(cardImages).map((card) => {
            return new Promise((resolve) => {
                if (typeof card === "string") {
                    const cardImg = new Image();
                    cardImg.src = card;
                    cardImg.onload = () => resolve(undefined);
                } else {
                    resolve(undefined);
                }
            });
        }),
    );
};

export const cardWidget = {
    type: "card",
    log: renderCardLogView,
    history: CardHistory,
    gameChoice: Card,
    preload,
} satisfies WidgetRegistry;
