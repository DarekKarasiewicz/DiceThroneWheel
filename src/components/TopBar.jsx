import DataBackup from './DataBackup';
import useScreen from '../hooks/useScreen';

const baseButtonStyle = {
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    whiteSpace: 'nowrap'
};

// Pasek u góry ekranu gry i statystyk. Klik w logo wraca do ekranu startowego.
export default function TopBar({ onHome, children }) {
    const { isPhone } = useScreen();

    return (
        <div style={{
            flex: 'none',
            minHeight: isPhone ? '52px' : '56px',
            backgroundColor: '#1f2937',
            borderBottom: '2px solid #ca8a04',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',           // bardzo wąski ekran: przyciski schodzą pod logo zamiast wystawać
            gap: isPhone ? '6px 10px' : '12px',
            padding: isPhone ? '6px 10px' : '8px 40px',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>

            {/* Logo/Title */}
            <button
                onClick={onHome}
                title="Back to start screen"
                style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#facc15',
                    fontSize: isPhone ? '0.95rem' : '1.5rem',
                    fontWeight: '900',
                    letterSpacing: isPhone ? '0.5px' : '2px',
                    textTransform: 'uppercase',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap'
                }}
            >
                Dice Throne
            </button>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: isPhone ? '6px' : '20px', alignItems: 'center', marginLeft: 'auto' }}>
                {children}
            </div>
        </div>
    );
}

export function topBarButtonStyle(isPhone, variant) {
    return {
        ...baseButtonStyle,
        padding: isPhone ? '6px 8px' : '8px 20px',
        fontSize: isPhone ? '0.65rem' : '0.9rem',
        letterSpacing: isPhone ? '0.5px' : '1px',
        ...(variant === 'primary'
            ? { backgroundColor: '#ca8a04', color: '#111827', border: '1px solid #ca8a04' }
            : { backgroundColor: 'transparent', color: '#ca8a04', border: '1px solid #ca8a04' })
    };
}

// Pasek ekranu gry: statystyki + eksport/import danych
export function GameTopBar({ onStats, onHome }) {
    const { isPhone } = useScreen();
    return (
        <TopBar onHome={onHome}>
            <button onClick={onStats} style={topBarButtonStyle(isPhone, 'primary')}>
                {isPhone ? 'Stats' : 'Statistics'}
            </button>
            <DataBackup buttonStyle={topBarButtonStyle(isPhone)} gap={isPhone ? '6px' : '20px'} short={isPhone} />
        </TopBar>
    );
}
