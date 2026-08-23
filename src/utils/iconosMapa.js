import L from 'leaflet';
import geojsonData from '../data/puntosInteres.json'; // Asegúrate de que el archivo tenga extensión .json

// Convertir GeoJSON a array plano de puntos
export const puntosInteres = geojsonData.features.map((feature) => ({
  tipo: feature.properties.tipo,
  nombre: feature.properties.nombre,
  lat: feature.geometry.coordinates[1],
  lng: feature.geometry.coordinates[0],
  categoria: feature.properties.categoria,
  imagen: feature.properties.imagen,
  horario: feature.properties.horario,

  telefono: feature.properties.telefono,
  whatsapp: feature.properties.whatsapp,
  facebook: feature.properties.facebook,
  instagram: feature.properties.instagram,
  tiktok: feature.properties.tiktok,

  accesible: feature.properties.accesible,
  mostrarHorario: feature.properties.mostrarHorario,
  mostrarContacto: feature.properties.mostrarContacto,
  busqueda: feature.properties.busqueda
}));

// Función para crear íconos con estilo común
const crearIcono = (bgColor, iconClass) => L.divIcon({
  html: `
    <div style="
      background: ${bgColor};
      width: 35px;
      height: 35px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 16px rgba(0,0,0,0.35);
      border: 3px solid white;
      transition: transform 0.2s ease;
      cursor: pointer;
    ">
      <i class="${iconClass}" style="
        font-size: 18px; 
        color: white; 
        transform: rotate(45deg);
        text-shadow: 0 1px 4px rgba(0,0,0,0.4);
      "></i>
    </div>
  `,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Íconos personalizados
export const iconoRadar = L.divIcon({ className: 'radar-icon', iconSize: [15, 15] });
export const iconoEstacionamiento = crearIcono('#e74607ff', 'bi bi-p-circle');
export const iconoComida = crearIcono('#fd7d04ff', 'bi bi-fork-knife');
export const iconoNoEstacionamiento = crearIcono('#e70404ff', 'bi bi-sign-no-parking');
export const iconoDiscapacitado = crearIcono('#0804e7ff', 'bi bi-person-wheelchair');
export const iconoIglesia = crearIcono('#041887ff', 'fas fa-church');
export const iconoHospital = crearIcono('#e74404ff', 'fa-solid fa-hospital');
export const iconoParqueCentro = crearIcono('#008d18ff', 'fa-solid fa-tree');


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