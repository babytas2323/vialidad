import L from 'leaflet';
import geojsonData from '../data/puntosInteres.json'; // Asegúrate de que el archivo tenga extensión .json

// Convertir GeoJSON a array plano de puntos
export const puntosInteres = geojsonData.features.map((feature) => ({
  tipo: feature.properties.tipo,
  nombre: feature.properties.nombre,
  lat: feature.geometry.coordinates[1],
  lng: feature.geometry.coordinates[0]
}));

// Función para crear íconos con estilo común
const crearIcono = (bgColor, iconClass) => L.divIcon({
  html: `
    <div style="
      background-color: ${bgColor};
      border: 2px solid white;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;">
      <i class="${iconClass}" style="font-size: 20px; color: white;"></i>
    </div>`,
  className: '',
  iconSize: [32, 32],
});

// Íconos personalizados
export const iconoRadar = L.divIcon({ className: 'radar-icon', iconSize: [20, 20] });
export const iconoEstacionamiento = crearIcono('#e74607ff', 'bi bi-p-circle');
export const iconoComida = crearIcono('#fd7d04ff', 'bi bi-fork-knife');
export const iconoNoEstacionamiento = crearIcono('#e70404ff', 'bi bi-sign-no-parking');
export const iconoDiscapacitado = crearIcono('#0804e7ff', 'bi bi-person-wheelchair');
export const iconoIglesia = crearIcono('#0439e7ff', 'fas fa-church');
export const iconoHospital= crearIcono('#e74404ff', 'fa-solid fa-hospital'); 
export const iconoParqueCentro= crearIcono('#008d18ff', 'fa-solid fa-tree');  


// Función para obtener el ícono según el tipo
export const obtenerIcono = (tipo) => {
  switch (tipo.toLowerCase()) {
    case 'estacionamiento': return iconoEstacionamiento;
    case 'comida': return iconoComida;
    case 'no-estacionamiento': return iconoNoEstacionamiento;
    case 'discapacitado': return iconoDiscapacitado;
    case 'iglesia': return iconoIglesia;
    case 'hospital': return iconoHospital;
    case 'parque-centro': return iconoParqueCentro;

    default: return iconoRadar;
  }
};
