import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CallesVialidad from './CallesVialidad';

const iconoRadar = L.divIcon({
  className: 'radar-icon',
  iconSize: [20, 20],
});

function MapaProtector() {
  const [posicion, setPosicion] = useState(null);
  const [ubicacionManual, setUbicacionManual] = useState(false);
  const [geojsonCalles, setGeojsonCalles] = useState(null);
  const mapaRef = useRef();

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nuevaPosicion = [position.coords.latitude, position.coords.longitude];
        setPosicion(nuevaPosicion);
        setUbicacionManual(false);

        if (mapaRef.current) {
          mapaRef.current.setView(nuevaPosicion, mapaRef.current.getZoom());
        }
      },
      () => {
        const respaldo = [19.0546, -97.8212]; // Tetela de Ocampo
        setPosicion(respaldo);
        setUbicacionManual(true);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    fetch('/callestetela.geojson')
      .then((res) => res.json())
      .then((data) => setGeojsonCalles(data));
      
  }, []);

  const activarPanico = () => {
    if (!posicion) {
      alert('Ubicación no disponible. No se puede enviar el mensaje.');
      return;
    }

    const [lat, lng] = posicion;
    const mensaje = `Emergencia: necesito ayuda. Mi ubicación es https://www.google.com/maps?q=${lat},${lng}`;
    const numero = '5217761125973';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {posicion ? (
        <MapContainer
          center={posicion}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          whenCreated={(mapInstance) => { mapaRef.current = mapInstance; }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geojsonCalles && <CallesVialidad datos={geojsonCalles} />}
          <Marker position={posicion} icon={iconoRadar}>
            <Popup>
              {ubicacionManual
                ? '📍 Ubicación de respaldo (Tetela de Ocampo)'
                : '📍 Aquí estás'}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.2em',
          color: '#555',
        }}>
          📍 Obteniendo ubicación...
        </div>
      )}

      <button
        onClick={activarPanico}
        style={{
          position: 'fixed',
          bottom: '1em',
          right: '1em',
          backgroundColor: '#d32f2f',
          color: 'white',
          padding: '0.8em',
          borderRadius: '50%',
          fontSize: '1.2em',
          border: 'none',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 9999,
          transition: 'transform 0.2s ease-in-out',
        }}
      >
        🚨
      </button>
    
<img
  src="/brujula.png"
  alt="Brújula"
  style={{
    position: 'fixed',
    bottom: '1em',
    left: '1em',
    width: '72px',
    height: '72px',
    zIndex: 9999,
  }}
/>

    </div>
  );
}

export default MapaProtector;
