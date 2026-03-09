import { useState, useEffect } from 'react';
import api from './services/api';
import TopBar from './components/TopBar';
import RollingMachine from './components/RollingMachine';
import RightPanel from './components/RightPanel';
import StartScreen from './components/StartScreen';


function App() {
    const [characters, setCharacters] = useState([]);
    const [players, setPlayers] = useState([]);
    const [gameId, setGameId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/characters').then(res => setCharacters(res.data));
        api.get('/players').then(res => setPlayers(res.data));
    }, []);

    const handleNewGame = async () => {
        setLoading(true);
        try {
            const res = await api.post('/game/create');
            setGameId(res.data.id);
            console.log(gameId);
        } catch (err) {
            console.error('Failed to create game:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!gameId) {
        return <StartScreen onNewGame={handleNewGame} loading={loading} />;
    }

    return (
        <div>
            <TopBar />
            <div style={{ display: 'flex' }}>
                <RollingMachine characters={characters} players={players} gameId={gameId} />
                <RightPanel gameId={gameId} />
            </div>
        </div>
    );
}

export default App;