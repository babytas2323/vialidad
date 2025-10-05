import { useEffect, useState } from 'react';

function GuiaViva({ posicion, geojsonCalles }) {
  const [guiaActiva, setGuiaActiva] = useState(false);
  const [nombreAnterior, setNombreAnterior] = useState(null);
  const [instruccion, setInstruccion] = useState('');

  function interpretarSentido(sentido) {
    const s = sentido.toLowerCase();
    if (s === 'norte-sur') return 'Avanza hacia el sur.';
    if (s === 'sur-norte') return 'Avanza hacia el norte.';
    if (s === 'poniente-oriente') return 'Avanza hacia el oriente.';
    if (s === 'oriente-poniente') return 'Avanza hacia el poniente.';
    if (s === 'doble sentido') return 'Puedes avanzar en ambas direcciones.';
    return 'Sentido vial no definido.';
  }

  function distanciaAPunto(pos, a, b) {
    const [x, y] = [pos[1], pos[0]];
    const [x1, y1] = a;
    const [x2, y2] = b;
    const A = x - x1, B = y - y1, C = x2 - x1, D = y2 - y1;
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = len_sq !== 0 ? dot / len_sq : -1;
    let xx, yy;
    if (param < 0) { xx = x1; yy = y1; }
    else if (param > 1) { xx = x2; yy = y2; }
    else { xx = x1 + param * C; yy = y1 + param * D; }
    const dx = x - xx, dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function encontrarSegmento(pos, geojson) {
    let mejor = null, distanciaMin = Infinity;
    geojson.features.forEach((feature) => {
      const coords = feature.geometry.coordinates;
      const nombre = feature.properties.name || 'Calle sin nombre';
      const sentido = feature.properties.sentido || 'desconocido';
      for (let i = 0; i < coords.length - 1; i++) {
        const a = coords[i], b = coords[i + 1];
        const distancia = distanciaAPunto(pos, a, b);
        if (distancia < distanciaMin) {
          distanciaMin = distancia;
          mejor = { nombre, sentido };
        }
      }
    });
    return mejor;
  }

  useEffect(() => {
    if (!guiaActiva || !posicion || !geojsonCalles) return;

    const segmento = encontrarSegmento(posicion, geojsonCalles);
    if (!segmento) return;

    if (segmento.nombre !== nombreAnterior) {
      setNombreAnterior(segmento.nombre);

      const texto = `Estás en ${segmento.nombre}. ${interpretarSentido(segmento.sentido)}`;
      setInstruccion(texto);

      const utterance = new SpeechSynthesisUtterance(texto);
      speechSynthesis.speak(utterance);
    }
  }, [posicion, geojsonCalles, guiaActiva]);

  return (
    <>
      {!guiaActiva && (
        <button
          onClick={() => {
            setGuiaActiva(true);
            const texto = 'Guía activada. Te acompañaré en el camino.';
            const utterance = new SpeechSynthesisUtterance(texto);
            speechSynthesis.speak(utterance);
          }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '52px',
            height: '52px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '50%',
            fontSize: '1.5em',
            border: '3px solid #ffffffff',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          🎙️
        </button>
      )}

      {guiaActiva && (
        <div style={{
          position: 'fixed',
          top: '1em',
          left: '1em',
          backgroundColor: '#fff',
          padding: '1em',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          zIndex: 9999,
          fontSize: '1em',
          maxWidth: '300px',
        }}>
          {instruccion}
        </div>
      )}
    </>
  );
}

export default GuiaViva;
