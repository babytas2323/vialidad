import L from 'leaflet';

// Íconos personalizados con Bootstrap
export const iconoRadar = L.divIcon({
  className: 'radar-icon',
  iconSize: [20, 20],
});

export const iconoEstacionamiento = L.divIcon({
  html: `
    <div style="background-color: #e74607ff; border: 0px solid white; border-radius: 50%; width: 23px; height: 23px; display: flex; align-items: center; justify-content: center;">
      <i class="bi bi-p-circle" style="font-size: 16px; color: white;"></i>
    </div>`,
  className: '', iconSize: [32, 32],
});

export const iconoComida = L.divIcon({
  html: `
    <div style="background-color: #fd7d04ff; border: 2px solid white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
      <i class="bi bi-fork-knife" style="font-size: 15px; color: white;"></i>
    </div>`,
  className: '', iconSize: [32, 32],
});

// Función para obtener el ícono según el tipo
export const obtenerIcono = (tipo) => {
  switch (tipo) {
    case 'estacionamiento': return iconoEstacionamiento;
    case 'comida': return iconoComida;
    default: return iconoRadar;
  }
};

// Puntos de interés directamente en el archivo
export const puntosInteres = [
  
   {
     tipo: 'comida', nombre: 'Tacos El Güero', lat: 19.817743, lng: -97.806093,
   
   }, 
  { 
    tipo: 'estacionamiento', nombre: 'Estacionamiento Central', lat: 19.818452, lng:-97.806462,
    imagen: 'https://oem.com.mx/elsoldepuebla/img/22356789/1742926488/BASE_LANDSCAPE/480/image.webp',

     
  },
  { 
    tipo: 'estacionamiento', nombre: 'Estacionamiento Parque', lat:  19.817251, lng: -97.806827,
     
  },
  {
     tipo: 'estacionamiento', nombre: 'Estacionamiento norte', lat:  19.817253, lng: -97.806802,
     
  }, 
  { 
    tipo: 'estacionamiento', nombre: 'Estacionamiento noreste', lat:  19.817292, lng: -97.806702 ,
    
  },

];
