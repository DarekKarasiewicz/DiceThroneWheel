import DataBackup from './DataBackup';

export default function StartScreen({ onNewGame, loading, onStats }) {
    return (
        <div className="scroll-y" style={{
            height: '100%',
            backgroundColor: '#111827',
            display: 'flex'
        }}>
        {/* margin: auto centruje treść, a gdy się nie mieści (telefon w poziomie) - można przewinąć */}
        <div style={{
            margin: 'auto',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(20px, 5vh, 40px)'
        }}>
            {/* Logo */}
            <div style={{ textAlign: 'center' }}>
                <h1 style={{
                    color: '#facc15',
                    fontSize: 'clamp(2.2rem, 10vw, 4rem)',
                    fontWeight: '900',
                    letterSpacing: 'clamp(2px, 1vw, 6px)',
                    textTransform: 'uppercase',
                    margin: 0,
                    textShadow: '0 0 30px rgba(202, 138, 4, 0.5)'
                }}>
                    Dice Throne
                </h1>
                <p style={{
                    color: '#9ca3af',
                    fontSize: '1rem',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    marginTop: '8px'
                }}>
                    May the best roll win
                </p>
            </div>

            {/* Divider */}
            <div style={{
                width: '200px',
                height: '2px',
                backgroundColor: '#ca8a04'
            }} />

            {/* New Game Button */}
            <button
                onClick={onNewGame}
                disabled={loading}
                style={{
                    padding: '16px 48px',
                    backgroundColor: loading ? '#374151' : '#ca8a04',
                    color: loading ? '#9ca3af' : '#111827',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1.1rem',
                    fontWeight: '900',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    transition: 'all 0.2s ease',
                    boxShadow: loading ? 'none' : '0 0 20px rgba(202, 138, 4, 0.4)'
                }}
                onMouseEnter={e => {
                    if (!loading) e.target.style.backgroundColor = '#facc15';
                }}
                onMouseLeave={e => {
                    if (!loading) e.target.style.backgroundColor = '#ca8a04';
                }}
            >
                {loading ? 'Creating game...' : '⚔ New Game'}
            </button>

            {/* Statistics Button */}
            <button
                onClick={onStats}
                style={{
                    padding: '12px 36px',
                    backgroundColor: 'transparent',
                    color: '#ca8a04',
                    border: '2px solid #ca8a04',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                    e.target.style.backgroundColor = '#ca8a04';
                    e.target.style.color = '#111827';
                }}
                onMouseLeave={e => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#ca8a04';
                }}
            >
                📊 Statistics
            </button>

            <DataBackup />
        </div>
        </div>
    );
}