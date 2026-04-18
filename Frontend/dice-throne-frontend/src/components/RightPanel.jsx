import { useState, useEffect } from 'react';
import api from '../services/api';

function CharacterCard({ character, size = 'normal', isWinner = false, onClick }) {
    const isSmall = size === 'small';
    return (
        <div
            onClick={onClick}
            style={{
                flex: 1,
                backgroundColor: '#111827',
                borderRadius: '6px',
                overflow: 'hidden',
                border: isWinner ? '2px solid #facc15' : '1px solid #4b5563',
                display: 'flex',
                flexDirection: 'column',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'border-color 0.2s, transform 0.15s',
                transform: isWinner ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isWinner ? '0 0 10px rgba(250, 204, 21, 0.4)' : 'none'
            }}
        >
            {character.heroImageUrl && (
                <img
                    src={character.heroImageUrl}
                    alt={character.name}
                    style={{
                        width: '100%',
                        height: isSmall ? '50px' : '80px',
                        objectFit: 'cover',
                        opacity: 0.85
                    }}
                />
            )}
            <p style={{
                color: '#facc15',
                fontWeight: '700',
                fontSize: isSmall ? '0.65rem' : '0.8rem',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '4px 2px',
                margin: 0
            }}>
                {character.name}
            </p>
            {isWinner && (
                <p style={{
                    color: '#facc15',
                    fontSize: '0.55rem',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    margin: '0 0 4px 0',
                    fontWeight: '900'
                }}>
                    🏆 Winner
                </p>
            )}
        </div>
    );
}

function GameBox({ gameId, draws, onSelectWinner, winnerId }) {
    const size = draws.length > 2 ? 'small' : 'normal';
    const latest = draws.reduce((a, b) =>
        new Date(a.timestamp) > new Date(b.timestamp) ? a : b
    );

    return (
        <div style={{
            backgroundColor: '#374151',
            borderRadius: '8px',
            padding: '10px',
            border: '1px solid #4b5563'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
            }}>
                <span style={{
                    color: '#ca8a04',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Game #{gameId}
                </span>
                <span style={{
                    color: '#6b7280',
                    fontSize: '0.65rem'
                }}>
                    {new Date(latest.timestamp).toLocaleDateString()}
                </span>
            </div>

            <div style={{
                display: 'flex',
                gap: '6px',
                alignItems: 'stretch'
            }}>
                {draws.map((draw) => (
                    <CharacterCard
                        key={draw.id}
                        character={draw.character}
                        size={size}
                        isWinner={winnerId === draw.character.id}
                        onClick={() => onSelectWinner(gameId, draw.character.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default function RightPanel() {
    const [groupedGames, setGroupedGames] = useState([]);
    const [winners, setWinners] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/draw/history')
            .then(res => {
                const grouped = res.data.reduce((acc, draw) => {
                    const gameId = draw.game.id;
                    if (!acc[gameId]) acc[gameId] = [];
                    acc[gameId].push(draw);
                    return acc;
                }, {});

                const initialWinners = {};
                for (const [gameId, draws] of Object.entries(grouped)) {
                    const winnerId = draws[0]?.game?.winner_id;
                    if (winnerId && winnerId !== 0) {
                        initialWinners[gameId] = winnerId;
                    }
                }
                setWinners(initialWinners);

                const sorted = Object.entries(grouped).sort((a, b) => {
                    const latestA = Math.max(...a[1].map(d => new Date(d.timestamp)));
                    const latestB = Math.max(...b[1].map(d => new Date(d.timestamp)));
                    return latestB - latestA;
                });

                setGroupedGames(sorted);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSelectWinner = async (gameId, characterId) => {
        try {
            await api.put('/game/save', null, {
                params: {
                    gameId: gameId,
                    winnerId: characterId,
                    gameStatus: 'FINISHED'
                }
            });
            setWinners(prev => ({ ...prev, [gameId]: characterId }));
        } catch (error) {
            console.error('Failed to save winner:', error);
        }
    };

    return (
        <div style={{
            width: '15%',
            minWidth: '200px',
            backgroundColor: '#1f2937',
            borderLeft: '2px solid #ca8a04',
            height: '94vh',
            overflowY: 'auto',
            padding: '20px'
        }}>
            <h3 style={{
                color: '#facc15',
                fontSize: '1.2rem',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '20px',
                textAlign: 'center'
            }}>
                Recent Games
            </h3>

            {loading ? (
                <p style={{ color: '#9ca3af', textAlign: 'center' }}>Loading...</p>
            ) : groupedGames.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center', fontSize: '0.9rem' }}>
                    No games yet
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {groupedGames.map(([gameId, draws]) => (
                        <GameBox
                            key={gameId}
                            gameId={gameId}
                            draws={draws}
                            winnerId={winners[gameId]}
                            onSelectWinner={handleSelectWinner}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}