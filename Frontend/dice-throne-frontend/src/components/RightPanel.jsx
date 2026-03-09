import { useState, useEffect } from 'react';
import api from '../services/api';

function CharacterCard({ character, size = 'normal' }) {
    const isSmall = size === 'small';
    return (
        <div style={{
            flex: 1,
            backgroundColor: '#111827',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid #4b5563',
            display: 'flex',
            flexDirection: 'column'
        }}>
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
        </div>
    );
}

function GameBox({ gameId, draws }) {
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
                    />
                ))}
            </div>
        </div>
    );
}

export default function RightPanel() {
    const [groupedGames, setGroupedGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/draw/history')
            .then(res => {
                // Grupuj po game.id
                const grouped = res.data.reduce((acc, draw) => {
                    const gameId = draw.game.id;
                    if (!acc[gameId]) acc[gameId] = [];
                    acc[gameId].push(draw);
                    return acc;
                }, {});

                // Posortuj gry od najnowszej
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
                        <GameBox key={gameId} gameId={gameId} draws={draws} />
                    ))}
                </div>
            )}
        </div>
    );
}