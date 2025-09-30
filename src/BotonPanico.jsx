import React from 'react';

function BotonPanico() {
  const activarPanico = () => {
    if (!navigator.geolocation) {
      alert('Geolocalización no disponible en este dispositivo.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mensaje = `Emergencia: necesito ayuda. Mi ubicación es https://www.google.com/maps?q=${latitude},${longitude}`;
        const numero = '7761125973'; // ← Reemplaza con el número de emergencia
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
      },
      (error) => {
        alert('No se pudo obtener la ubicación. Activa los permisos de ubicación en tu navegador y sistema.');
      }
    );
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#ffffff',
      flexDirection: 'column',
    }}>
      <h2 style={{ marginBottom: '1em', color: '#1976d2' }}>
        🛡️ Activador de Protección
      </h2>
      <button
        onClick={activarPanico}
        style={{
          backgroundColor: '#2eee08ff',
          color: 'white',
          padding: '1em 2em',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.2em',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
      >
        🚨 Botón de Pánico
      </button>
    </div>
  );
}

export default BotonPanico;
