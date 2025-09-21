import Card from "react-bootstrap/Card";

import GameChoices from "./GameChoices";
import GameHeader from "./GameHeader";
import GameText from "./GameText";

export function Game() {
    return (
        <div className="game-container">
            <Card>
                <GameHeader />
                <Card.Body>
                    <div className="clearfix">
                        <GameText />
                    </div>
                    <GameChoices />
                </Card.Body>
            </Card>
        </div>
    );
}
