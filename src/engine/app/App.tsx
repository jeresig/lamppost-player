import { useQueryState } from "nuqs";
import { useEffect } from "preact/hooks";
import { Helmet, HelmetProvider } from "react-helmet-async";

import screens from "../../story/screens";
import settings from "../../story/settings";
import { useStoryStore } from "../shared/game-state";
import { useSavedGamesStore } from "../shared/saved-games";
import Contents from "./Contents";
import Header from "./Header";

const App = () => {
    const [page, setPage] = useQueryState("page", {
        scroll: true,
        history: "push",
        defaultValue: screens[0].id,
    });
    const loadStoryData = useStoryStore((state) => state.loadStoryData);
    const getMostRecentSavedGame = useSavedGamesStore(
        (state) => state.getMostRecentSavedGame,
    );
    const loadSavedGame = useStoryStore((state) => state.loadSavedGame);
    const startNewGame = useStoryStore((state) => state.startNewGame);
    const gameState = useStoryStore((state) => state.gameState);
    const loading = gameState.length === 0;

    useEffect(() => {
        async function init() {
            await loadStoryData();
            const mostRecentSavedGame = getMostRecentSavedGame();
            if (mostRecentSavedGame) {
                loadSavedGame(mostRecentSavedGame);
                setPage("game");
            } else {
                startNewGame();
            }
        }
        init();
    }, [
        loadStoryData,
        getMostRecentSavedGame,
        loadSavedGame,
        startNewGame,
        setPage,
    ]);

    return (
        <HelmetProvider>
            <Helmet titleTemplate={`${settings.gameName}: %s`}>
                {settings.favicon && <link rel="icon" type="image/x-icon" href={settings.favicon} />}
            </Helmet>
            <Header page={page} setPage={setPage} loading={loading} />
            <Contents page={page} setPage={setPage} loading={loading} />
        </HelmetProvider>
    );
};

export default App;
