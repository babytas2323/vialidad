import React from 'react';
import { GeoJSON } from 'react-leaflet';

// 🎨 Colores por dirección
const colores = {
  'sur-norte': '#f44336',
  'norte-sur': '#e91e63',
  'oriente-poniente': '#2196f3',
  'poniente-oriente': '#3f51b5',
  'doble-sentido': '#4caf50',
  'desconocido': '#eeb20dff',
};

// 📐 Función para calcular distancia entre dos puntos (Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// 📏 Función para calcular la longitud total de una línea
function calcularLongitud(coordenadas) {
  if (!coordenadas || coordenadas.length < 2) return 0;
  let longitudTotal = 0;
  for (let i = 0; i < coordenadas.length - 1; i++) {
    const [lon1, lat1] = coordenadas[i];
    const [lon2, lat2] = coordenadas[i + 1];
    longitudTotal += calcularDistancia(lat1, lon1, lat2, lon2);
  }
  return longitudTotal;
}

// 🎤 Función para hablar el nombre y sentido de la calle
function hablarCalle(nombre, sentido) {
  // Detener cualquier voz anterior
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  const sentidoTexto = {
    'sur-norte': 'Sentido sur a norte',
    'norte-sur': 'Sentido norte a sur',
    'oriente-poniente': 'Sentido oriente a poniente',
    'poniente-oriente': 'Sentido poniente a oriente',
    'doble-sentido': 'Doble sentido',
    'desconocido': 'Sentido desconocido',
  };

  const mensaje = `${nombre}. ${sentidoTexto[sentido] || 'Sentido desconocido'}`;
  
  if (window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(mensaje);
    utterance.lang = 'es-MX';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
}

// 🎨 Estilo visual por calle
function estiloCalle(feature) {
  const sentido = feature.properties.sentido || 'desconocido';
  return {
    color: colores[sentido] || '#000',
    weight: 4,
    dashArray: sentido === 'doble-sentido' ? '10,5' : '10,5',
  };
}

// 📍 Popup con diseño moderno + VOZ al hacer clic
function onEachFeature(feature, layer) {
  const nombre = feature.properties.name || 'Calle sin nombre';
  const tipo = feature.properties.highway || 'tipo desconocido';
  const sentido = feature.properties.sentido || 'desconocido';
  
  const coordenadas = feature.geometry.coordinates;
  const longitudMetros = calcularLongitud(coordenadas);
  
  let longitudTexto;
  if (longitudMetros >= 1000) {
    longitudTexto = (longitudMetros / 1000).toFixed(2) + ' km';
  } else {
    longitudTexto = Math.round(longitudMetros) + ' m';
  }

  // 🎤 ACTIVAR VOZ AL HACER CLIC EN LA CALLE
  layer.on('click', function() {
    hablarCalle(nombre, sentido);
  });

  const tipoIconos = {
    'primary': '🛣️',
    'secondary': '🛤️',
    'tertiary': '🛤️',
    'residential': '🏘️',
    'unclassified': '🛤️',
    'service': '🔧',
    'track': '🌾',
    'footway': '🚶',
    'path': '🚶',
  };
  const iconoTipo = tipoIconos[tipo] || '🛤️';

  const sentidoTexto = {
    'sur-norte': '⬆️ Sur-Norte',
    'norte-sur': '⬇️ Norte-Sur',
    'oriente-poniente': '⬅️ Oriente-Poniente',
    'poniente-oriente': '➡️ Poniente-Oriente',
    'doble-sentido': '⬌ Doble-sentido',
    'desconocido': '❓ Desconocido',
  };

  layer.bindPopup(`
    <div style="
      width: 260px;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
      margin: -6px -10px;
    ">
      <div style="
        background: ${colores[sentido] || '#4b5563'};
        padding: 14px 18px 12px;
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="
            font-size: 18px;
            font-weight: 700;
            color: white;
            text-align: center;
            text-shadow: 0 1px 3px rgba(0,0,0,0.2);
            flex: 1;
          ">${iconoTipo} ${nombre}</span>
        </div>
      </div>

      <div style="padding: 16px 18px 18px;">
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          background: #f8fafc;
          padding: 6px 12px;
          border-radius: 8px;
        ">
          <span style="font-size: 14px;">🚦</span>
          <span style="
            font-size: 13px;
            color: #475569;
            font-weight: 500;
          ">${tipo.replace('_', ' ').toUpperCase()}</span>
        </div>

        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 16px;
          margin-bottom: 6px;
        ">
          <div style="
            background: #eff6ff;
            border-radius: 8px;
            padding: 10px 12px;
            text-align: center;
          ">
            <div style="
              font-size: 12px;
              color: #6B7280;
              font-weight: 500;
              margin-bottom: 2px;
            ">📏 Longitud</div>
            <div style="
              font-size: 16px;
              font-weight: 700;
              color: #2563eb;
            ">${longitudTexto}</div>
          </div>

          <div style="
            background: #f8fafc;
            border-radius: 8px;
            padding: 10px 12px;
            text-align: center;
          ">
            <div style="
              font-size: 12px;
              color: #6B7280;
              font-weight: 500;
              margin-bottom: 2px;
            ">🧭 Sentido</div>
            <div style="
              font-size: 14px;
              font-weight: 600;
              color: #1e293b;
            ">${sentidoTexto[sentido] || sentido}</div>
          </div>
        </div>

        ${feature.id ? `
          <div style="
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              font-size: 11px;
              color: #94a3b8;
            ">🆔 ID</span>
            <span style="
              font-size: 12px;
              color: #64748b;
              font-family: monospace;
              background: #f1f5f9;
              padding: 2px 10px;
              border-radius: 4px;
            ">${feature.id}</span>
          </div>
        ` : ''}
      </div>
    </div>
  `);
}

// 🧩 Componente principal
function CallesVialidad({ datos }) {
  return (
    <GeoJSON
      data={datos}
      style={estiloCalle}
      onEachFeature={onEachFeature}
    />
  );
}

export default CallesVialidad;