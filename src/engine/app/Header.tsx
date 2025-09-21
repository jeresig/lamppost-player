import MoonIcon from "bootstrap-icons/icons/moon.svg?react";
import SaveIcon from "bootstrap-icons/icons/save.svg?react";
import SunIcon from "bootstrap-icons/icons/sun.svg?react";
import { useCallback, useEffect, useState } from "preact/hooks";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import screens from "../../story/screens";
import settings from "../../story/settings";
import { LoadModal } from "../saves/LoadModal";
import { NewGameModal } from "../saves/NewGameModal";
import { SaveModal } from "../saves/SaveModal";
import { useStoryStore } from "../shared/game-state";
import type { ScreenProps } from "../shared/types";

function Header(props: ScreenProps) {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const [theme, setTheme] = useState(
        document.documentElement.getAttribute("data-bs-theme") || "light",
    );
    const [expanded, setExpanded] = useState(false);
    const [showNewGameModal, setShowNewGameModal] = useState(false);
    const startNewGame = useStoryStore((state) => state.startNewGame);
    const gameState = useStoryStore((state) => state.gameState);

    const { shortGameName, gameName } = settings;
    const { page, setPage } = props;
    const gameIsWorthSaving = gameState && gameState.length > 1;

    const handlePageChange = useCallback(
        (page: string) => {
            return (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                setExpanded(false);
                setPage(page);
            };
        },
        [setPage],
    );

    const handleNewGame = useCallback(() => {
        setExpanded(false);
        if (!gameIsWorthSaving) {
            startNewGame();
        } else {
            setShowNewGameModal(true);
        }
    }, [startNewGame, gameIsWorthSaving]);

    const toggleTheme = useCallback(() => {
        setExpanded(false);
        setTheme(theme === "light" ? "dark" : "light");
    }, [theme]);

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", theme);
        window.localStorage.setItem(`${gameName}-theme`, theme);
    }, [theme]);

    return (
        <>
            <Navbar
                collapseOnSelect
                expanded={expanded}
                expand="lg"
                className="bg-body-tertiary justify-content-between"
                fixed="top"
            >
                <Container>
                    <Navbar.Brand href="/">{shortGameName || gameName}</Navbar.Brand>
                    <Navbar.Toggle
                        aria-controls="navbar"
                        onClick={() => setExpanded(!expanded)}
                    />
                    <Navbar.Collapse
                        id="navbar"
                        className="justify-content-end"
                    >
                        <Nav>
                            {screens.map((screen) => (
                                <Nav.Item key={screen.id} className="d-lg-none">
                                    <Nav.Link
                                        eventKey={screen.id}
                                        href={`?page=${screen.id}`}
                                        active={page === screen.id}
                                        onClick={handlePageChange(screen.id)}
                                    >
                                        {screen.title}
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                            {settings.enableDarkMode && (
                                <Nav.Item>
                                    <Nav.Link onClick={toggleTheme}>
                                        {theme === "dark" ? (
                                            <SunIcon className="bi bi-sun" />
                                        ) : (
                                            <MoonIcon className="bi bi-moon" />
                                        )}{" "}
                                        {theme === "dark"
                                            ? "Light Mode"
                                            : "Dark Mode"}
                                    </Nav.Link>
                                </Nav.Item>
                            )}
                            <Nav.Item>
                                <NavDropdown
                                    title={
                                        <>
                                            <SaveIcon className="bi bi-save" />{" "}
                                            Saves
                                        </>
                                    }
                                    id="game-dropdown"
                                >
                                    <NavDropdown.Item
                                        href=""
                                        onClick={handleNewGame}
                                        disabled={!gameIsWorthSaving}
                                    >
                                        Restart
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        href=""
                                        onClick={() => {
                                            setExpanded(false);
                                            setShowSaveModal(true);
                                        }}
                                        disabled={!gameIsWorthSaving}
                                    >
                                        Save Game
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        href=""
                                        onClick={() => {
                                            setExpanded(false);
                                            setShowLoadModal(true);
                                        }}
                                    >
                                        Load Game
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <SaveModal
                show={showSaveModal}
                handleClose={() => setShowSaveModal(false)}
            />
            <LoadModal
                show={showLoadModal}
                handleClose={() => setShowLoadModal(false)}
            />
            <NewGameModal
                show={showNewGameModal}
                handleClose={() => setShowNewGameModal(false)}
            />
        </>
    );
}

export default Header;
