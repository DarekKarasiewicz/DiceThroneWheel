import { useState, useEffect } from 'react';
import api from '../services/api';
import TopBar, { topBarButtonStyle } from './TopBar';
import useScreen from '../hooks/useScreen';

function StatValue({ label, value, unit = '', highlight = false }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px 10px',
            backgroundColor: '#1f2937',
            borderRadius: '8px',
            flex: '1 1 90px',
            minWidth: '80px',
            border: highlight ? '1px solid #ca8a04' : '1px solid #374151'
        }}>
            <span style={{
                color: highlight ? '#facc15' : '#e5e7eb',
                fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
                fontWeight: '900',
                textAlign: 'center'
            }}>
                {value}{unit && <span style={{ fontSize: '0.6em', whiteSpace: 'nowrap' }}>{unit}</span>}
            </span>
            <span style={{
                color: '#9ca3af',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: '4px'
            }}>
                {label}
            </span>
        </div>
    );
}

function MiniCharacterCard({ character, label }) {
    if (!character) return null;
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#1f2937',
            borderRadius: '8px',
            padding: '8px 12px',
            border: '1px solid #374151'
        }}>
            {character.heroImageUrl && (
                <img
                    src={character.heroImageUrl}
                    alt={character.name}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #ca8a04'
                    }}
                />
            )}
            <div>
                <p style={{
                    color: '#facc15',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {character.name}
                </p>
                <p style={{
                    color: '#9ca3af',
                    fontSize: '0.65rem',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {label}
                </p>
            </div>
        </div>
    );
}

function ProgressBar({ value, max, color = '#ca8a04' }) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (
        <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#374151',
            borderRadius: '3px',
            overflow: 'hidden'
        }}>
            <div style={{
                width: `${pct}%`,
                height: '100%',
                backgroundColor: color,
                borderRadius: '3px',
                transition: 'width 0.6s ease'
            }} />
        </div>
    );
}

function PlayerCard({ stats, rank }) {
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

    return (
        <div style={{
            backgroundColor: '#111827',
            borderRadius: '12px',
            padding: 'clamp(14px, 3vw, 24px)',
            border: rank === 1 ? '2px solid #ca8a04' : '1px solid #374151',
            boxShadow: rank === 1 ? '0 0 20px rgba(202, 138, 4, 0.2)' : 'none'
        }}>
            {/* Header z imieniem gracza i najczęstszą postacią */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'clamp(10px, 2vw, 16px)',
                marginBottom: '20px'
            }}>
                <span style={{ fontSize: '2rem' }}>{medal}</span>

                {stats.mostPlayedCharacter?.heroImageUrl && (
                    <img
                        src={stats.mostPlayedCharacter.heroImageUrl}
                        alt={stats.mostPlayedCharacter.name}
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid #ca8a04',
                            boxShadow: '0 0 12px rgba(202, 138, 4, 0.3)'
                        }}
                    />
                )}

                <div style={{ flex: 1, minWidth: '120px' }}>
                    <h2 style={{
                        color: '#facc15',
                        fontSize: 'clamp(1.15rem, 4vw, 1.5rem)',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        margin: 0
                    }}>
                        {stats.playerName}
                    </h2>
                    {stats.mostPlayedCharacter && (
                        <p style={{
                            color: '#9ca3af',
                            fontSize: '0.7rem',
                            margin: '4px 0 0 0',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Main: {stats.mostPlayedCharacter.name} ({stats.mostPlayedCount}x)
                        </p>
                    )}
                </div>

                <div style={{ textAlign: 'right' }}>
                    <span style={{
                        color: '#facc15',
                        fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
                        fontWeight: '900'
                    }}>
                        {stats.winRate}%
                    </span>
                    <p style={{
                        color: '#9ca3af',
                        fontSize: '0.65rem',
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Win Rate
                    </p>
                </div>
            </div>

            {/* Główne statystyki */}
            <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '16px',
                flexWrap: 'wrap'
            }}>
                <StatValue label="Games" value={stats.totalGames} />
                <StatValue label="Wins" value={stats.totalWins} highlight />
                <StatValue label="Losses" value={stats.totalGames - stats.totalWins} />
                <StatValue label="Win Streak" value={stats.currentWinStreak} highlight={stats.currentWinStreak > 0} />
                <StatValue label="Best Streak" value={stats.longestWinStreak} />
                <StatValue
                    label="Avg per Win"
                    value={stats.avgGamesBetweenWins > 0 ? stats.avgGamesBetweenWins : '—'}
                    unit={stats.avgGamesBetweenWins > 0 ? ' games' : ''}
                />
            </div>

            {/* Postacie */}
            <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '16px',
                flexWrap: 'wrap'
            }}>
                <MiniCharacterCard
                    character={stats.mostPlayedCharacter}
                    label={`Most Played (${stats.mostPlayedCount}x)`}
                />
                <MiniCharacterCard
                    character={stats.luckyCharacter}
                    label={`Lucky Hero (${stats.luckyCharacterWins} wins)`}
                />
            </div>

            {/* Hero exploration */}
            <div style={{ marginTop: '8px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                }}>
                    <span style={{
                        color: '#9ca3af',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Hero Exploration
                    </span>
                    <span style={{
                        color: '#e5e7eb',
                        fontSize: '0.7rem',
                        fontWeight: '700'
                    }}>
                        {stats.uniqueHeroesPlayed}/{stats.totalHeroesAvailable} ({stats.heroExplorationRate}%)
                    </span>
                </div>
                <ProgressBar value={stats.uniqueHeroesPlayed} max={stats.totalHeroesAvailable} />
            </div>
        </div>
    );
}

export default function StatsPage({ onBack, onHome }) {
    const { isPhone } = useScreen();
    const [playerStats, setPlayerStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/stats/players')
            .then(res => {
                setPlayerStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load stats:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="scroll-y" style={{
            height: '100%',
            backgroundColor: '#0b0e14',
            color: 'white',
            fontFamily: 'sans-serif'
        }}>
            <TopBar onHome={onHome}>
                <button onClick={onBack} style={topBarButtonStyle(isPhone, 'primary')}>
                    ← Back
                </button>
            </TopBar>

            {/* Tytuł */}
            <div style={{
                textAlign: 'center',
                padding: isPhone ? '24px 16px 8px' : '40px 20px 20px'
            }}>
                <h1 style={{
                    color: '#facc15',
                    fontSize: 'clamp(1.6rem, 6vw, 2.5rem)',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: 'clamp(1px, 0.8vw, 4px)',
                    margin: 0
                }}>
                    Player Statistics
                </h1>
                <p style={{
                    color: '#9ca3af',
                    fontSize: '0.85rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginTop: '8px'
                }}>
                    Who reigns supreme?
                </p>
            </div>

            {/* Karty graczy */}
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: isPhone ? '12px' : '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                {loading ? (
                    <p style={{ color: '#9ca3af', textAlign: 'center', fontSize: '1.1rem' }}>
                        Loading stats...
                    </p>
                ) : playerStats.length === 0 ? (
                    <p style={{ color: '#9ca3af', textAlign: 'center', fontSize: '1.1rem' }}>
                        No games played yet. Start rolling!
                    </p>
                ) : (
                    playerStats.map((stats, index) => (
                        <PlayerCard key={stats.playerId} stats={stats} rank={index + 1} />
                    ))
                )}
            </div>
        </div>
    );
}
