import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { latLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CallesVialidad from './CallesVialidad';
import GuiaViva from './GuiaViva';
import { iconoRadar, obtenerIcono, puntosInteres } from './utils/iconosMapa';

function MapaProtector() {
  const [posicion, setPosicion] = useState(null);
  const [ubicacionManual, setUbicacionManual] = useState(false);
  const [geojsonCalles, setGeojsonCalles] = useState(null);
  const [busqueda, setBusqueda] = useState(''); // 🔹 Added search state
  const [resultados, setResultados] = useState([]); // 🔹 Added search results state
  const [mostrarBuscador, setMostrarBuscador] = useState(false); // 🔹 Added search toggle state
  const popupRefs = useRef({}); // 🔹 Added popup refs for search functionality
  const mapaRef = useRef();

  // 🔹 Filtros guardados en localStorage
  const filtrosGuardados = localStorage.getItem('filtrosMapa');
  const [filtroActivo, setFiltroActivo] = useState(
    filtrosGuardados
      ? JSON.parse(filtrosGuardados)
      : {
        estacionamiento: true,
        comida: true,
        'no-estacionamiento': true,
        discapacitado: true,
        iglesia: true,
        hospital: true,
        'parque-centro': true,
      }
  );

  // Ensure all point types are included in the filter
  useEffect(() => {
    // Get all unique point types from puntosInteres
    const tipos = [...new Set(puntosInteres.map(p => p.tipo))];

    // Check if any new types need to be added to the filter
    const filtroActualizado = { ...filtroActivo };
    let filtroModificado = false;

    tipos.forEach(tipo => {
      if (filtroActivo[tipo] === undefined) {
        filtroActualizado[tipo] = true;
        filtroModificado = true;
      }
    });

    if (filtroModificado) {
      setFiltroActivo(filtroActualizado);
      localStorage.setItem('filtrosMapa', JSON.stringify(filtroActualizado));
    }
  }, []);

  const actualizarFiltro = (tipo) => {
    const nuevoEstado = { ...filtroActivo, [tipo]: !filtroActivo[tipo] };
    setFiltroActivo(nuevoEstado);
    localStorage.setItem('filtrosMapa', JSON.stringify(nuevoEstado));
  };

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

  // 🔹 Normalizar texto: elimina acentos y pone en minúsculas
  const normalizar = (str) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  // 🔹 Búsqueda con autocomplete
  useEffect(() => {
    if (busqueda.trim() === '') {
      setResultados([]);
      return;
    }

    const texto = normalizar(busqueda);

    const coincidencias = puntosInteres
      .filter((p) => {
        // Solo incluir puntos con búsqueda activa
        if (p.busqueda !== 'activo') {
          return false;
        }

        const nombre = normalizar(p.nombre);
        const categoria = normalizar(p.categoria || '');
        return nombre.includes(texto) || categoria.includes(texto);
      })
      .slice(0, 5); // mostrar máximo 5 sugerencias

    setResultados(coincidencias);
  }, [busqueda]);

  // 🔹 Estado de horario (abierto/cerrado)
  const estaAbierto = (horario) => {
    if (!horario) return false;
    const ahora = new Date();
    const horaActual = ahora.getHours() + ahora.getMinutes() / 60;

    const [hA, mA] = horario.apertura.split(':').map(Number);
    const [hC, mC] = horario.cierre.split(':').map(Number);
    const horaApertura = hA + mA / 60;
    const horaCierre = hC + mC / 60;

    if (horaCierre > horaApertura) {
      return horaActual >= horaApertura && horaActual <= horaCierre;
    } else {
      return horaActual >= horaApertura || horaActual <= horaCierre;
    }
  };

  // 🔹 Generar contenido del popup
  const generarPopupHTML = (punto) => {
    const mostrarContacto = punto.mostrarContacto;
    const mostrarEstado = punto.mostrarHorario;
    const abiertoAhora = mostrarEstado ? estaAbierto(punto.horario) : false;

    return `
      <div style="
        width: 240px;
        font-family: sans-serif;
        background-color: #f8f8f8;
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      ">
        <img src="${punto.imagen}" alt="${punto.nombre}" style="
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
        "/>
        <h4 style="margin: 8px 0 4px; font-size: 16px; text-align: center;">${punto.nombre}</h4>
        <div style="font-size: 14px; color: #666; text-align: center;">${punto.categoria || ' '}</div>
        ${mostrarEstado && punto.horario
        ? `<div style="font-size: 14px; text-align: center; margin-top: 4px;">
                ${abiertoAhora
          ? '<span style="color: green;">🟢 Abierto ahora</span>'
          : '<span style="color: red;">🔴 Cerrado</span>'
        }
              </div>`
        : ''
      }
        ${punto.accesible
        ? `<div style="margin-top: 4px; font-size: 14px; text-align: center;">♿ Accesible</div>`
        : ''
      }
        ${mostrarContacto && punto.telefono && punto.whatsapp
        ? `<div style="
                margin-top: 10px;
                display: flex;
                justify-content: center;
                gap: 16px;
              ">
                <a href="tel:${punto.telefono}" style="text-decoration: none;">
                  <i class="bi bi-telephone-fill" style="
                    font-size: 22px;
                    color: white;
                    background-color: #2196f3;
                    padding: 8px;
                    border-radius: 50%;
                  "></i>
                </a>
                <a href="https://wa.me/${punto.whatsapp}" target="_blank" style="text-decoration: none;">
                  <i class="bi bi-whatsapp" style="
                    font-size: 22px;
                    color: white;
                    background-color: #25d366;
                    padding: 8px;
                    border-radius: 50%;
                  "></i>
                </a>
              </div>`
        : ''
      }
      </div>
    `;
  };

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
        const numero = ''; // número de contacto
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
        <MapContainer
          center={posicion}
          zoom={18}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          whenCreated={(mapInstance) => { mapaRef.current = mapInstance; }}
        >
          <TileLayer attribution="&copy; Google Maps" url="https://mt1.google.com/vt/lyrs=s,r&x={x}&y={y}&z={z}" subdomains={['mt0', 'mt1', 'mt2', 'mt3']} maxZoom={21} />
          {/*<TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={22} />*/}


          {geojsonCalles && <CallesVialidad datos={geojsonCalles} />}

          <Marker position={posicion} icon={iconoRadar}>
            <Popup>
              {ubicacionManual
                ? '📍 Ubicación de respaldo (Tetela de Ocampo)'
                : latLng(posicion).toString()}
            </Popup>
          </Marker>

          {puntosInteres
            .map((punto, index) => {
              const popupHTML = generarPopupHTML(punto);
              return (
                <Marker
                  key={index}
                  position={[punto.lat, punto.lng]}
                  icon={obtenerIcono(punto.tipo)}
                  ref={(ref) => {
                    if (ref) {
                      popupRefs.current[punto.nombre] = ref;
                    }
                  }}
                >
                  <Popup>
                    <div dangerouslySetInnerHTML={{ __html: popupHTML }} />
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      ) : (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.2em',
            color: '#555',
          }}
        >
          📍 Obteniendo ubicación...
        </div>
      )}

      {/* 🔍 Botón de búsqueda */}
      <button
        onClick={() => setMostrarBuscador(!mostrarBuscador)}
        style={{
          position: 'fixed',
          top: '1em',
          right: '1em',
          backgroundColor: '#1976d2',
          color: 'white',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          border: '2px solid #ffffff',
          fontSize: '1.8em',
          cursor: 'pointer',
          boxShadow: '0 6px 15px rgba(25, 118, 210, 0.4)',
          zIndex: 9999,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none',
          transform: 'scale(1)',
          fontWeight: 'bold',
          animation: 'pulse 2s infinite',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#1565c0';
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 8px 20px rgba(25, 118, 210, 0.6)';
          e.target.style.animation = 'none';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#1976d2';
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 6px 15px rgba(25, 118, 210, 0.4)';
          e.target.style.animation = 'pulse 2s infinite';
        }}
        onMouseDown={(e) => {
          e.target.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.target.style.transform = 'scale(1.1)';
        }}
      >
        🔍
      </button>
      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
            }
            70% {
              box-shadow: 0 0 0 12px rgba(25, 118, 210, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
            }
          }
        `}
      </style>

      {/* Panel de búsqueda con autocomplete */}
      {mostrarBuscador && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            width: '300px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: 9999,
            border: '1px solid #e0e0e0',
          }}
        >
          <input
            type="text"
            placeholder="Buscar lugares, categorías..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '30px',
              border: '2px solid #e0e0e0',
              fontSize: '16px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              background: '#f8f9fa',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#1976d2';
              e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.15)';
              e.target.style.background = 'white';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0';
              e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
              e.target.style.background = '#f8f9fa';
            }}
          />
          {resultados.length > 0 && (
            <ul
              style={{
                listStyle: 'none',
                margin: '15px 0 0 0',
                padding: '0',
                maxHeight: '250px',
                overflowY: 'auto',
                border: '1px solid #eee',
                borderRadius: '8px',
                marginTop: '10px',
              }}
            >
              {resultados.map((r, i) => (
                <li
                  key={i}
                  onClick={() => {
                    if (mapaRef.current && mapaRef.current.setView) {
                      mapaRef.current.setView([r.lat, r.lng], 19);
                    }

                    const marker = popupRefs.current[r.nombre];
                    if (marker && marker.openPopup) {
                      marker.openPopup();
                    }

                    setBusqueda('');
                    setResultados([]);
                    setMostrarBuscador(false);
                  }}
                  style={{
                    padding: '15px 20px',
                    cursor: 'pointer',
                    borderBottom: i < resultados.length - 1 ? '1px solid #eee' : 'none',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '8px',
                    margin: '5px 10px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e3f2fd';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{
                    fontSize: '20px',
                    marginRight: '15px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                  }}>
                    📍
                  </span>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      fontSize: '16px',
                      color: '#333',
                    }}>
                      {r.nombre}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#666',
                      marginTop: '3px',
                      fontStyle: 'italic',
                    }}>
                      {r.categoria}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 🚨 Botón de pánico */}
      <button
        onClick={activarPanico}
        style={{
          position: 'fixed',
          bottom: '1em',
          right: '1em',
          backgroundColor: '#e70707ff',
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

      {/* 🧭 Brújula */}
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

      {geojsonCalles && (
        <GuiaViva posicion={posicion} geojsonCalles={geojsonCalles} />
      )}
    </div>
  );
}

export default MapaProtector;