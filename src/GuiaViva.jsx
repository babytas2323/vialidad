import { useEffect, useState, useRef } from 'react';

function GuiaViva({ posicion, geojsonCalles }) {
  const [guiaActiva, setGuiaActiva] = useState(false);
  const [instruccion, setInstruccion] = useState('');
  const [visible, setVisible] = useState(false);

  // Variables en memoria para evitar repetir mensajes (sin localStorage)
  const cruceAnterior = useRef('');
  const ultimoMensaje = useRef(0);
  // New ref to track the current street
  const calleActual = useRef('');
 
  const UMBRAL_METROS =0.00005;

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
    if (ahora - ultimoMensaje.current < 5000) return; // Espera 5 segundos

    const calles = detectarCallesCercanas(posicion, geojsonCalles);
    
    // Check if we've left a street
    if (calleActual.current && calles.length === 0) {
      // We were on a street and now we're not
      const mensajeSalida = `Has salido de ${calleActual.current}.`;
      setInstruccion(mensajeSalida);
      setVisible(false);
      setTimeout(() => setVisible(true), 50); // animación
      
      // Voice and vibration notification
      speechSynthesis.speak(new SpeechSynthesisUtterance(mensajeSalida));
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      
      // Reset current street
      calleActual.current = '';
      ultimoMensaje.current = ahora;
      return;
    }
    
    // If we're not on any street, do nothing further
    if (calles.length === 0) return;

    // Update current street
    const claveCruce = calles.sort().join('|');
    
    // Check if we're entering a new street
    let nuevaCalle = '';
    if (calles.length === 1) {
      // Single street
      nuevaCalle = calles[0];
    }
    
    // Notify if we're entering a street after being off the street
    if (!calleActual.current && nuevaCalle) {
      const segmento = geojsonCalles.features.find(f => f.properties.name === nuevaCalle);
      const sentido = segmento?.properties?.sentido || '';
      const mensajeEntrada = `Has entrado a ${nuevaCalle}. ${interpretarSentido(sentido)}`;
      
      setInstruccion(mensajeEntrada);
      setVisible(false);
      setTimeout(() => setVisible(true), 50); // animación
      
      // Voice and vibration notification
      speechSynthesis.speak(new SpeechSynthesisUtterance(mensajeEntrada));
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      
      // Update current street
      calleActual.current = nuevaCalle;
      cruceAnterior.current = claveCruce;
      ultimoMensaje.current = ahora;
      return;
    }
    
    // Update current street for single streets
    if (calles.length === 1) {
      calleActual.current = calles[0];
    } else {
      // At intersection - clear current street
      calleActual.current = '';
    }
    
    // Skip if we're still on the same street/intersection
    if (cruceAnterior.current === claveCruce) return;

    cruceAnterior.current = claveCruce;
    ultimoMensaje.current = ahora;

    let texto = '';
    if (calles.length === 1) {
      const segmento = geojsonCalles.features.find(f => f.properties.name === calles[0]);
      const sentido = segmento?.properties?.sentido || '';
      texto = `Estás en ${calles[0]}. ${interpretarSentido(sentido)}`;
    } else {
      texto = `Cruce entre ${calles.slice(0, 2).join(' y ')}.`;
    }

    setInstruccion(texto);
    setVisible(false);
    setTimeout(() => setVisible(true), 50); // animación

    // Voz y vibración
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
            border: '3px solid #ffffff',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease',
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%)'}
        >
          🎙️
        </button>
      )}

      {guiaActiva && (
        <div style={{
          position: 'fixed',
          top: '1em',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#fff',
          padding: '1em',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          zIndex: 9999,
          fontSize: '1em',
          maxWidth: '90%',
          textAlign: 'center',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
        }}>
          {instruccion}
        </div>
      )}
    </>
  );
}

export default GuiaViva;