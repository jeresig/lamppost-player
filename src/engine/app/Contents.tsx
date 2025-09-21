import { useCallback } from "preact/hooks";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { Helmet } from "react-helmet-async";

import screens from "../../story/screens";
import { Game } from "../game/Game";
import History from "../history/History";
import type { ScreenProps } from "../shared/types";

const Contents = (props: ScreenProps) => {
    const { page, setPage, loading } = props;

    const handlePageChange = useCallback(
        (page: string) => {
            return (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                setPage(page);
            };
        },
        [setPage],
    );

    const pageTitle = screens.find((screen) => screen.id === page)?.title;

    return (
        <Container style={{ position: "relative" }}>
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>
            <Tab.Container defaultActiveKey="game">
                <Row>
                    <Col
                        className="d-none d-lg-block"
                        sm={3}
                        style={{
                            width: 163,
                            position: "fixed",
                            marginLeft: -143,
                        }}
                    >
                        <Nav variant="pills" className="flex-column">
                            {screens.map((screen) => (
                                <Nav.Item
                                    key={screen.id}
                                    style={{ textAlign: "right" }}
                                >
                                    <Nav.Link
                                        eventKey={screen.id}
                                        href={`?page=${screen.id}`}
                                        active={page === screen.id}
                                        onClick={handlePageChange(screen.id)}
                                        disabled={loading}
                                    >
                                        {screen.title}
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content>
                            {screens.map((screen) => (
                                <Tab.Pane
                                    key={screen.id}
                                    eventKey={screen.id}
                                    active={page === screen.id}
                                >
                                    {page === screen.id &&
                                        (screen.component === "Game" ? (
                                            <Game />
                                        ) : screen.component === "History" ? (
                                            <History />
                                        ) : (
                                            <screen.component {...props} />
                                        ))}
                                </Tab.Pane>
                            ))}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
};

export default Contents;
