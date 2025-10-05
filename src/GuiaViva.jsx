import { useEffect, useState } from 'react';

function GuiaViva({ posicion, geojsonCalles }) {
  const [guiaActiva, setGuiaActiva] = useState(false);
  const [instruccion, setInstruccion] = useState('');

  const UMBRAL_METROS = 0.0001; // ~30 metros

  function interpretarSentido(sentido) {
    const s = sentido?.toLowerCase();
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

  function detectarCallesCercanas(pos, geojson) {
    const calles = new Set();
    geojson.features.forEach((feature) => {
      const coords = feature.geometry.coordinates;
      const nombre = feature.properties.name || 'Calle sin nombre';
      for (let i = 0; i < coords.length - 1; i++) {
        const a = coords[i], b = coords[i + 1];
        const distancia = distanciaAPunto(pos, a, b);
        if (distancia < UMBRAL_METROS) {
          calles.add(nombre);
        }
      }
    });
    return Array.from(calles);
  }

  useEffect(() => {
    if (!guiaActiva || !posicion || !geojsonCalles) return;

    const ahora = Date.now();
    const ultimo = parseInt(localStorage.getItem('ultimoMensaje') || '0');
    if (ahora - ultimo < 5000) return;

    const calles = detectarCallesCercanas(posicion, geojsonCalles);
    if (calles.length === 0) return;

    const claveCruce = calles.sort().join('|');
    const cruceAnterior = localStorage.getItem('cruceAnterior');
    if (cruceAnterior === claveCruce) return;

    localStorage.setItem('cruceAnterior', claveCruce);
    localStorage.setItem('ultimoMensaje', ahora.toString());

    let texto = '';
    if (calles.length === 1) {
      const segmento = geojsonCalles.features.find(f => f.properties.name === calles[0]);
      const sentido = segmento?.properties?.sentido || '';
      texto = `🕰️ Estás en ${calles[0]}. ${interpretarSentido(sentido)}`;
    } else {
      texto = `Cruce entre ${calles.slice(0, 2).join(' y ')}.`;
    }

    setInstruccion(texto);
    speechSynthesis.speak(new SpeechSynthesisUtterance(texto));
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }, [posicion, geojsonCalles, guiaActiva]);

  return (
    <>
      {!guiaActiva && (
        <button
          onClick={() => {
            setGuiaActiva(true);
            const texto = 'Guía activada. Te acompañaré en el camino.';
            speechSynthesis.speak(new SpeechSynthesisUtterance(texto));
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
