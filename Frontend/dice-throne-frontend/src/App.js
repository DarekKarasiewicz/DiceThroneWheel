import { useState, useEffect } from 'react';
import api from './services/api';
import CharacterCard from './components/CharacterCard';

function App() {
  const [characters, setCharacters] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  
  const [isRolling, setIsRolling] = useState(false);
  const [sliderList, setSliderList] = useState([]);
  const [headerName, setHeaderName] = useState("Roll your hero");
  const [translateX, setTranslateX] = useState(0);
  const [drawnCharacter, setDrawnCharacter] = useState(null);

  // KARTA: 290px szerokości + 10px marginesów = 300px
  const CARD_WIDTH = 300; 
  const WINNER_INDEX = 40; 

  useEffect(() => {
    // Pobierz dane na starcie
    api.get('/characters').then(res => setCharacters(res.data));
    api.get('/players').then(res => {
      setPlayers(res.data);
      if (res.data.length > 0) setSelectedPlayerId(res.data[0].id);
    });
  }, []);

  const startDraw = async () => {
    if (isRolling || characters.length === 0 || !selectedPlayerId) return;

    try {
      setIsRolling(false);
      setTranslateX(0); // Resetuj pozycję
      setHeaderName("Rolling...");
      setDrawnCharacter(null);

      const response = await api.post('/draw');
      const character = response.data.character;

      // Generowanie listy (zwycięzca na pozycji 40)
      const generatedList = Array.from({ length: WINNER_INDEX + 15 }, () => 
        characters[Math.floor(Math.random() * characters.length)]
      );
      generatedList[WINNER_INDEX] = character;
      setSliderList(generatedList);

      // Mały timeout, aby React zdążył wyrenderować nową listę przed animacją
      setTimeout(() => {
        setIsRolling(true);
        
        // --- MATEMATYKA CELOWANIA ---
        // 1. Odległość do początku 40-stej karty
        const distanceToWinnerStart = WINNER_INDEX * CARD_WIDTH;
        // 2. Losowy punkt wewnątrz karty (np. od 50px do 250px), aby nie stało na linii
        const randomInnerOffset = Math.floor(Math.random() * 200) + 50;
        
        const totalMove = distanceToWinnerStart + randomInnerOffset;
        setTranslateX(totalMove);
      }, 50);

      // Koniec animacji (5 sekund trwania CSS + bufor)
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
      // POPRAWKA: Wysyłamy parametry jako query params, bo tego oczekuje Twój backend (@RequestParam)
      await api.post('/draw/save', null, {
        params: {
          characterId: drawnCharacter.id,
          playerId: selectedPlayerId
        }
      });
      alert(`Success! Character saved for player.`);
    } catch (error) {
      console.error(error);
      alert("Error while saving result.");
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#0b0e14', 
      minHeight: '100vh', 
      width: '100vw', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      
      <h1 style={{ 
        fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px', 
        color: '#facc15', textTransform: 'uppercase', letterSpacing: '4px'
      }}>
        {headerName}
      </h1>

      {/* WYBÓR GRACZA */}
      <div style={{ marginBottom: '30px' }}>
        <p style={{ color: '#9ca3af', textAlign: 'center', fontSize: '0.8rem', letterSpacing: '2px' }}>SELECT PLAYER</p>
        <select 
          value={selectedPlayerId} 
          onChange={(e) => setSelectedPlayerId(e.target.value)}
          disabled={isRolling}
          style={{
            backgroundColor: '#1f2937', color: 'white', border: '2px solid #ca8a04',
            padding: '10px 20px', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer', outline: 'none'
          }}
        >
          {players.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* MASZYNA LOSUJĄCA */}
      <div style={{ 
        position: 'relative', width: '85vw', height: '450px', 
        backgroundColor: 'rgba(31, 41, 55, 0.1)', borderTop: '3px solid #1f2937', 
        borderBottom: '3px solid #1f2937', overflow: 'hidden',
        display: 'flex', alignItems: 'center'
      }}>
        
        {/* CELOWNIK (STOI W MIEJSCU) */}
        <div style={{ 
          position: 'absolute', left: '50%', top: 0, bottom: 0, width: '4px', 
          backgroundColor: '#facc15', zIndex: 100, transform: 'translateX(-50%)'
        }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderTop: '30px solid #facc15' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderBottom: '30px solid #facc15' }} />
        </div>

        {/* EFEKT CIENIA BOCZNEGO */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none', background: 'linear-gradient(90deg, #0b0e14 0%, transparent 15%, transparent 85%, #0b0e14 100%)' }} />

        {/* TAŚMA (PRZESUWA SIĘ) */}
        <div 
          style={{
            whiteSpace: 'nowrap',
            position: 'absolute',
            left: '50%', // Startuje od środka celownika
            transform: `translateX(-${translateX}px)`, 
            transition: isRolling ? 'transform 5s cubic-bezier(0.1, 0, 0.1, 1)' : 'none',
            willChange: 'transform'
          }}
        >
          {sliderList.map((char, index) => (
            <div key={index} style={{ display: 'inline-block', width: `${CARD_WIDTH}px`, textAlign: 'center' }}>
              <CharacterCard character={char} />
            </div>
          ))}
        </div>
      </div>

      {/* PRZYCISKI */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
        <button 
          onClick={startDraw}
          disabled={isRolling}
          style={{ 
            padding: '20px 60px', backgroundColor: isRolling ? '#4b5563' : '#ca8a04', 
            color: 'black', fontWeight: '900', fontSize: '1.4rem', border: 'none', 
            cursor: isRolling ? 'not-allowed' : 'pointer', borderRadius: '12px',
            textTransform: 'uppercase', boxShadow: '0 10px 20px rgba(0,0,0,0.4)'
          }}
        >
          {isRolling ? "Good Luck!" : "Roll Hero"}
        </button>

        {drawnCharacter && !isRolling && (
          <button 
            onClick={saveDraw}
            style={{ 
              padding: '20px 60px', backgroundColor: '#16a34a', color: 'white', 
              fontWeight: '900', fontSize: '1.4rem', border: 'none', 
              cursor: 'pointer', borderRadius: '12px', textTransform: 'uppercase',
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

export default App;