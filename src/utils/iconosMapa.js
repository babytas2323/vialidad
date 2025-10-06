import L from 'leaflet';

// Íconos personalizados con Bootstrap
export const iconoRadar = L.divIcon({
  className: 'radar-icon',
  iconSize: [20, 20],
});

export const iconoEstacionamiento = L.divIcon({
  html: `
    <div style="background-color: #e74607ff; border: 0px solid white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
      <i class="bi bi-p-circle" style="font-size: 20px; color: white;"></i>
    </div>`,
  className: '', iconSize: [32, 32],
});

export const iconoComida = L.divIcon({
  html: `
    <div style="background-color: #fd7d04ff; border: 2px solid white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
      <i class="bi bi-fork-knife" style="font-size: 20px; color: white;"></i>
    </div>`,
  className: '', iconSize: [32, 32],
});
export const iconoNoEstacionamiento = L.divIcon({
  html: `
        <div style="background-color: #e70404ff; border: 1px solid white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
      <i class="bi bi-sign-no-parking" style="font-size: 20px; color: white;"></i>
    </div>`,
  className: '', iconSize: [32, 32],
});
export const iconoDiscapacitado = L.divIcon({
  html: `
        <div style="background-color: #0804e7ff; border: 1px solid white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
      <i class="bi bi-person-wheelchair" style="font-size: 20px; color: white;"></i>
    </div>`,
  className: '', iconSize: [32, 32],
});

// Función para obtener el ícono según el tipo
export const obtenerIcono = (tipo) => {
  switch (tipo) {
    case 'estacionamiento': return iconoEstacionamiento;
    case 'comida': return iconoComida;
    case 'no-estacionamiento': return iconoNoEstacionamiento;
     case 'discapacitado': return iconoDiscapacitado;
    default: return iconoRadar;
  }
};

// Puntos de interés directamente en el archivo
export const puntosInteres = [

  { tipo: 'comida', nombre: 'Tacos El Güero', lat: 19.817743, lng: -97.806093, },

  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817251, lng: -97.806827 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817253, lng: -97.806802 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817259, lng: -97.806779 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817263, lng: -97.806755 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817267, lng: -97.806730 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817274, lng: -97.806706 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817284, lng: -97.806681 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817292, lng: -97.806657 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817300, lng: -97.806632 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817308, lng: -97.806608 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817315, lng: -97.806583 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817322, lng: -97.806559 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817330, lng: -97.806534 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817337, lng: -97.806510 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817344, lng: -97.806485 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817352, lng: -97.806461 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817359, lng: -97.806436 },
  { tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat: 19.817366, lng: -97.806412 },

  { tipo: 'no-estacionamiento', nombre: 'Prohibido Esatacionarse', lat: 19.819182, lng: -97.807557 }, 
  { tipo: 'discapacitado', nombre: 'Personas con Discapacidad', lat: 19.819158, lng: -97.807552 }, 









];
