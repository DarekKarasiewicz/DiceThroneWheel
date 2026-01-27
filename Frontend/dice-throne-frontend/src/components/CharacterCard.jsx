import React from 'react';


export default function CharacterCard({ character }) {
  if (!character) {
    return (
      <div style={{ 
        width: '290px', 
        height: '380px', 
        backgroundColor: '#1f2937', 
        borderRadius: '12px'
      }} />
    );
  }

  return (
    <div 
      style={{
        display: 'inline-block',
        width: '290px',      
        height: '380px',     
        position: 'relative',
        borderRadius: '12px',
        border: '3px solid #374151',
        backgroundColor: '#111827',
        overflow: 'hidden',
        boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
        margin: '0 5px' // Mały odstęp między kartami (łącznie z szerokością da 300px)
      }}
    >
      {/* Tło karty */}
      <div 
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(http://localhost:8080${character.backGroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Postać PNG */}
        <img 
          src={`http://localhost:8080${character.heroImageUrl}`}
          alt={character.name}
          style={{
            width: '120%',
            height: '110%',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.8))'
          }}
        />
      </div>
      
      {/* Nazwa postaci */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'rgba(0,0,0,0.85)', 
        padding: '10px',
        borderTop: '2px solid #374151'
      }}>
        <p style={{ 
          fontSize: '14px', 
          fontWeight: '900', 
          color: '#facc15', 
          margin: 0, 
          textAlign: 'center', 
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {character.name}
        </p>
      </div>
    </div>
  );
}