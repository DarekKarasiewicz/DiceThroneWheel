import { useState, useEffect } from 'react';
import api from './services/api';
import { GameTopBar } from './components/TopBar';
import RollingMachine from './components/RollingMachine';
import RightPanel from './components/RightPanel';
import StartScreen from './components/StartScreen';
import StatsPage from './components/StatsPage';
import useScreen from './hooks/useScreen';


function App() {
    const [characters, setCharacters] = useState([]);
    const [players, setPlayers] = useState([]);
    const [gameId, setGameId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const [statsReturnPage, setStatsReturnPage] = useState('home');
    const screen = useScreen();

    useEffect(() => {
        api.get('/characters').then(res => setCharacters(res.data));
        api.get('/players').then(res => setPlayers(res.data));
    }, []);

    const handleNewGame = async () => {
        setLoading(true);
        try {
            const res = await api.post('/game/create');
            setGameId(res.data.id);
            setCurrentPage('game');
        } catch (err) {
            console.error('Failed to create game:', err);
        } finally {
            setLoading(false);
        }
    };

    const goHome = () => setCurrentPage('home');
    const openStats = (from) => () => {
        setStatsReturnPage(from);
        setCurrentPage('stats');
    };

    if (currentPage === 'stats') {
        return <StatsPage onBack={() => setCurrentPage(statsReturnPage)} onHome={goHome} />;
    }

    if (!gameId || currentPage === 'home') {
        return <StartScreen onNewGame={handleNewGame} loading={loading} onStats={openStats('home')} />;
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <GameTopBar onStats={openStats('game')} onHome={goHome} />
            {/* Szeroki ekran: maszyna + panel obok siebie; wąski: panel pod maszyną, całość się przewija */}
            <div
                className={screen.isStacked ? 'scroll-y' : undefined}
                style={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: screen.isStacked ? 'column' : 'row',
                    overflow: screen.isStacked ? undefined : 'hidden'
                }}
            >
                <RollingMachine characters={characters} players={players} gameId={gameId} screen={screen} />
                <RightPanel gameId={gameId} stacked={screen.isStacked} />
            </div>
        </div>
    );
}

export default App;
