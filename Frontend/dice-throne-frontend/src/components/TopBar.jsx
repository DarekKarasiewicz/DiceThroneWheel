export default function TopBar() {
    return (
        <div style={{
            height: '6vh',
            backgroundColor: '#1f2937',
            borderBottom: '2px solid #ca8a04',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>

            {/* Logo/Title */}
            <h2 style={{
                color: '#facc15',
                fontSize: '1.5rem',
                fontWeight: '900',
                letterSpacing: '2px',
                textTransform: 'uppercase'
            }}>
                Dice Throne
            </h2>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '20px' }}>
                <button
                    disabled
                    style={{
                        padding: '8px 20px',
                        backgroundColor: '#374151',
                        color: '#9ca3af',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'not-allowed',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                >
                    History
                </button>

                <button
                    disabled
                    style={{
                        padding: '8px 20px',
                        backgroundColor: '#374151',
                        color: '#9ca3af',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'not-allowed',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                >
                    Statistics
                </button>

                <button
                    disabled
                    style={{
                        padding: '8px 20px',
                        backgroundColor: '#374151',
                        color: '#9ca3af',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'not-allowed',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                >
                    Login
                </button>
            </div>
        </div>
    );
}
