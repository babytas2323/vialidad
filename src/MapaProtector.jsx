import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L, { latLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CallesVialidad from './CallesVialidad';
import GuiaViva from './GuiaViva';
import { iconoRadar, obtenerIcono, puntosInteres } from './utils/iconosMapa';

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

  let mensaje = '';
  if (posicion) {
    const [lat, lng] = posicion;
    mensaje = `Emergencia: necesito ayuda. Mi ubicación es https://www.google.com/maps?q=${lat},${lng}`;
  }


  
 const activarPanico = async () => {
  if (!posicion) {
    alert('📍 Ubicación no disponible. No se puede enviar el mensaje.');
    return;
  }

  const [lat, lng] = posicion;
  const enlaceMapa = `https://www.google.com/maps?q=${lat},${lng}`;
  const mensaje = `🚨 Emergencia: necesito ayuda.\nMi ubicación es:\n${enlaceMapa}`;

  try {
    // 🧭 1️⃣ Intentar usar la API de compartir (Android, iOS, navegadores modernos)
    if (navigator.share) {
      await navigator.share({
        title: 'Emergencia 🚨',
        text: mensaje,
        url: enlaceMapa,
      });
      console.log('Mensaje de emergencia compartido exitosamente.');
    } else {
      // 💬 2️⃣ Si no está disponible, abrir WhatsApp como respaldo
      const numero = '5217761125973'; // número de contacto
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    }
  } catch (error) {
    console.error('Error al compartir o enviar mensaje:', error);

    // 3️⃣ Fallback final: copiar al portapapeles si todo falla
    try {
      await navigator.clipboard.writeText(mensaje);
      alert('⚠️ No se pudo enviar automáticamente, pero el mensaje se copió al portapapeles.');
    } catch {
      alert('Error al copiar mensaje. Verifica tu conexión o permisos.');
    }
  }
};



  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {posicion ? (
        <>
          <MapContainer
            center={posicion}
            zoom={18}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', zIndex: 1 }}
            whenCreated={(mapInstance) => { mapaRef.current = mapInstance; }}
          >
       <TileLayer attribution="&copy; Google Maps" url="https://mt1.google.com/vt/lyrs=s,r&x={x}&y={y}&z={z}" subdomains={['mt0', 'mt1', 'mt2', 'mt3']}  maxZoom={21} />
           {/*<TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={22} />*/}

            {geojsonCalles && <CallesVialidad datos={geojsonCalles} />}

            <Marker position={posicion} icon={iconoRadar}>
              <Popup>
                {ubicacionManual
                  ? '📍 Ubicación de respaldo (Tetela de Ocampo)'
                  : latLng(posicion).toString()}
              </Popup>
            </Marker>

            {puntosInteres.map((punto, index) => (
              <Marker
                key={index}
                position={[punto.lat, punto.lng]}
                icon={obtenerIcono(punto.tipo)}
              >
                <Popup>{punto.nombre}</Popup>{/** llama el nombre de iconosMapa.js*/}
              </Marker>
            ))}
          </MapContainer>

          {geojsonCalles && (
            <GuiaViva posicion={posicion} geojsonCalles={geojsonCalles} />
          )}
        </>
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
          backgroundColor: '#d30909ff',
          color: 'white',
          padding: '0.8em',
          borderRadius: '50%',
          fontSize: '1.2em',
          border: '3px solid white',
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
