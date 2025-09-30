import React from 'react';
import { GeoJSON } from 'react-leaflet';

 

// 🎨 Colores por dirección
const colores = {
  'sur-norte': '#f44336',           // rojo
  'norte-sur': '#e91e63',           // rosa
  'oriente-poniente': '#2196f3',    // azul
  'poniente-oriente': '#3f51b5',    // azul oscuro
  'doble sentido': '#4caf50',       // verde
  'desconocido': '#9e9e9e',         // gris
};

// 🎨 Estilo visual por calle
function estiloCalle(feature) {
  const sentido = feature.properties.sentido || 'desconocido';

  return {
    color: colores[sentido] || '#000',
    weight: 4,
    dashArray: sentido === 'doble sentido' ? '5,5' : null,
  };
}


// 📍 Popup al hacer clic en cada calle
function onEachFeature(feature, layer) {
  const nombre = feature.properties.name || 'Calle sin nombre';
  const tipo = feature.properties.highway || 'tipo desconocido';
  const sentido = feature.properties.sentido || 'desconocido';

  layer.bindPopup(`
    🛣️ <strong>${nombre}</strong><br/>
    🚦 Tipo: ${tipo}<br/>
    🧭 Sentido: ${sentido}
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
