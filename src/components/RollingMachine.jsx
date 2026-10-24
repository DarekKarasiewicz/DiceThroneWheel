import { useState } from 'react';
import api from '../services/api';
import CharacterCard from './CharacterCard';

export default function RollingMachine({ characters, players, gameId, screen }) {
    const [selectedPlayerId, setSelectedPlayerId] = useState("");
    const [isRolling, setIsRolling] = useState(false);
    const [sliderList, setSliderList] = useState([]);
    const [headerName, setHeaderName] = useState("Roll your hero");
    const [drawnCharacter, setDrawnCharacter] = useState(null);
    const [innerOffset, setInnerOffset] = useState(0);

    const CARD_WIDTH = screen.cardWidth;
    const CARD_HEIGHT = Math.round((CARD_WIDTH - 10) * 380 / 290);
    const WINNER_INDEX = 40;
    const { isPhone } = screen;

    // Pozycja taśmy liczona z aktualnej szerokości karty, więc obrót ekranu jej nie psuje.
    // innerOffset to ułamek karty (0..1), w którym zatrzymał się celownik.
    const stripOffset = isRolling || drawnCharacter ? (WINNER_INDEX + innerOffset) * CARD_WIDTH : 0;

    const startDraw = async () => {
        if (isRolling || characters.length === 0 || !selectedPlayerId) return;

        try {
            setIsRolling(false);
            setHeaderName("Rolling...");
            setDrawnCharacter(null);

            const response = await api.post('/draw');
            const character = response.data.character;

            const generatedList = Array.from({ length: WINNER_INDEX + 15 }, () =>
                characters[Math.floor(Math.random() * characters.length)]
            );
            generatedList[WINNER_INDEX] = character;
            setSliderList(generatedList);

            setTimeout(() => {
                // Celownik zatrzymuje się w środkowej części zwycięskiej karty (jak wcześniej 50-250 px z 300)
                setInnerOffset((Math.floor(Math.random() * 200) + 50) / 300);
                setIsRolling(true);
            }, 50);

            setTimeout(() => {
                setIsRolling(false);
                setHeaderName(character.name);
                setDrawnCharacter(character);
            }, 5050);
        } catch (error) {
            console.error(error);
            setIsRolling(false);
        }
    };

    const saveDraw = async () => {
        if (!drawnCharacter || !selectedPlayerId) return;

        try {
            await api.post('/draw/save', null, {
                params: {
                    characterId: drawnCharacter.id,
                    playerId: selectedPlayerId,
                    gameId: gameId
                }
            });
            alert(`Success! Character saved for player.`);
        } catch (error) {
            console.error(error);
            alert("Error while saving result.");
        }
    };

    return (
        <div className={screen.isStacked ? undefined : 'scroll-y'} style={{
            backgroundColor: '#0b0e14',
            flex: screen.isStacked ? 'none' : 1,
            minWidth: 0,
            width: '100%',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: isPhone ? '16px 0 24px' : '24px 0 32px',
            fontFamily: 'sans-serif'
        }}>

            {/* marginTop/marginBottom: auto na pierwszym i ostatnim elemencie centrują treść w pionie
                bez ucinania jej, gdy ekran jest niski */}
            <h1 style={{
                fontSize: 'clamp(1.6rem, min(6vw, 9vh), 3.5rem)',
                fontWeight: '900',
                marginTop: 'auto',
                marginBottom: isPhone ? '12px' : '20px',
                padding: '0 12px',
                textAlign: 'center',
                color: '#facc15',
                textTransform: 'uppercase',
                letterSpacing: 'clamp(1px, 0.6vw, 4px)'
            }}>
                {headerName}
            </h1>

            {/* WYBÓR GRACZA */}
            <div style={{ marginBottom: isPhone ? '16px' : '30px', maxWidth: '92vw' }}>
                <p style={{ color: '#9ca3af', textAlign: 'center', fontSize: '0.8rem', letterSpacing: '2px' }}>
                    SELECT PLAYER
                </p>
                <select
                    value={selectedPlayerId}
                    onChange={(e) => setSelectedPlayerId(e.target.value)}
                    disabled={isRolling}
                    style={{
                        backgroundColor: '#1f2937',
                        color: 'white',
                        border: '2px solid #ca8a04',
                        padding: isPhone ? '8px 14px' : '10px 20px',
                        borderRadius: '8px',
                        fontSize: isPhone ? '1rem' : '1.2rem',
                        maxWidth: '100%',
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    <option value="">
                        {players.length > 0 ? '-- Select Player --' : '-- No players: use Import data --'}
                    </option>
                    {players.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            {/* MASZYNA LOSUJĄCA */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: `${CARD_HEIGHT + 70}px`,
                flex: 'none',
                backgroundColor: 'rgba(31, 41, 55, 0.1)',
                borderTop: '3px solid #1f2937',
                borderBottom: '3px solid #1f2937',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center'
            }}>

                {/* CELOWNIK */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    backgroundColor: '#facc15',
                    zIndex: 100,
                    transform: 'translateX(-50%)'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: `${isPhone ? 14 : 20}px solid transparent`,
                        borderRight: `${isPhone ? 14 : 20}px solid transparent`,
                        borderTop: `${isPhone ? 20 : 30}px solid #facc15`
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: `${isPhone ? 14 : 20}px solid transparent`,
                        borderRight: `${isPhone ? 14 : 20}px solid transparent`,
                        borderBottom: `${isPhone ? 20 : 30}px solid #facc15`
                    }} />
                </div>

                {/* CIEŃ BOCZNY */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 40,
                    pointerEvents: 'none',
                    background: 'linear-gradient(90deg, #0b0e14 0%, transparent 15%, transparent 85%, #0b0e14 100%)'
                }} />

                {/* TAŚMA */}
                <div
                    data-strip
                    style={{
                        whiteSpace: 'nowrap',
                        position: 'absolute',
                        left: '50%',
                        transform: `translateX(-${stripOffset}px)`,
                        transition: isRolling ? 'transform 5s cubic-bezier(0.1, 0, 0.1, 1)' : 'none',
                        willChange: 'transform'
                    }}
                >
                    {sliderList.map((char, index) => (
                        <div key={index} style={{
                            display: 'inline-block',
                            width: `${CARD_WIDTH}px`,
                            textAlign: 'center'
                        }}>
                            <CharacterCard character={char} width={CARD_WIDTH - 10} />
                        </div>
                    ))}
                </div>
            </div>

            {/* PRZYCISKI */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: isPhone ? '12px' : '20px',
                marginTop: isPhone ? '20px' : '40px',
                marginBottom: 'auto',
                padding: '0 12px'
            }}>
                <button
                    onClick={startDraw}
                    disabled={isRolling}
                    style={{
                        padding: isPhone ? '14px 28px' : screen.isCompact ? '16px 40px' : '20px 60px',
                        backgroundColor: isRolling ? '#4b5563' : '#ca8a04',
                        color: 'black',
                        fontWeight: '900',
                        fontSize: isPhone ? '1.05rem' : '1.4rem',
                        border: 'none',
                        cursor: isRolling ? 'not-allowed' : 'pointer',
                        borderRadius: '12px',
                        textTransform: 'uppercase',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.4)'
                    }}
                >
                    {isRolling ? "Good Luck!" : "Roll Hero"}
                </button>

                {drawnCharacter && !isRolling && (
                    <button
                        onClick={saveDraw}
                        style={{
                            padding: isPhone ? '14px 28px' : screen.isCompact ? '16px 40px' : '20px 60px',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            fontWeight: '900',
                            fontSize: isPhone ? '1.05rem' : '1.4rem',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '12px',
                            textTransform: 'uppercase',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
                            animation: 'pulse 1.5s infinite'
                        }}
                    >
                        Save Result
                    </button>
                )}
            </div>

            <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
        </div>
    );
}