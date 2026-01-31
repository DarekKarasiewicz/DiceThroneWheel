import { useState, useEffect } from 'react';
import api from '../services/api';

export default function RightPanel() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Pobierz historię ostatnich gier
        api.get('/draw/history')
            .then(res => {
                setHistory(res.data);
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
            ) : history.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center', fontSize: '0.9rem' }}>
                    No games yet
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {history.map((draw) => (
                        <div
                            key={draw.drawId}
                            style={{
                                backgroundColor: '#374151',
                                borderRadius: '8px',
                                padding: '12px',
                                border: '1px solid #4b5563'
                            }}
                        >
                            <p style={{
                                color: '#facc15',
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                marginBottom: '5px'
                            }}>
                                {draw.character.name}
                            </p>

                            <p style={{
                                color: '#9ca3af',
                                fontSize: '0.75rem',
                                marginBottom: '8px'
                            }}>
                                {new Date(draw.timestamp).toLocaleString()}
                            </p>

                            {draw.character.heroImageUrl && (
                                <img
                                    src={draw.character.heroImageUrl}
                                    alt={draw.character.name}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '6px',
                                        opacity: 0.8
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}