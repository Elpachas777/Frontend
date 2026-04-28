import { useState, useRef, useEffect } from "react";
import "./EjercicioPlayer.css";

function DrawingCanvas({ silaba }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#1e2e22";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * (canvas.width / rect.width),
      y: (src.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    drawing.current = true;
    lastPos.current = getPos(e);
  };

  const draw = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => { drawing.current = false; };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="ep-canvas-col">
      <span className="ep-canvas-hint">{silaba}</span>
      <canvas
        ref={canvasRef}
        width={220}
        height={220}
        className="ep-canvas"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      <button type="button" className="ep-clear-btn" onClick={clear}>Borrar</button>
    </div>
  );
}

function EjercicioPlayer({ ejercicio, onCerrar }) {
  const [indice, setIndice] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const palabras = ejercicio?.palabras || [];
  const total = palabras.length;
  const actual = palabras[indice];
  const progreso = total > 0 ? (indice / total) * 100 : 0;

  const handleSiguiente = () => {
    if (indice + 1 >= total) {
      setTerminado(true);
    } else {
      setIndice((i) => i + 1);
    }
  };

  if (!ejercicio || total === 0) {
    return (
      <div className="ep-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
        <div className="ep-card ep-card--center">
          <p className="ep-empty-msg">Este ejercicio no tiene palabras configuradas aún.</p>
          <button className="ep-btn-secondary" onClick={onCerrar}>Cerrar</button>
        </div>
      </div>
    );
  }

  if (terminado) {
    return (
      <div className="ep-overlay">
        <div className="ep-card ep-card--center ep-card--done">
          
          <h2 className="ep-done-title">¡Muchas gracias por jugar!</h2>
          <p className="ep-done-sub">Has completado todas las sílabas del ejercicio.</p>
          <button className="ep-btn" onClick={onCerrar}>Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ep-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="ep-card">
        <button className="ep-close" onClick={onCerrar} aria-label="Cerrar">✕</button>

        <div className="ep-progress-wrap">
          <div className="ep-progress-track">
            <div className="ep-progress-fill" style={{ width: `${progreso}%` }} />
          </div>
          <span className="ep-progress-label">{indice + 1} / {total}</span>
        </div>

        <p className="ep-sentence">{ejercicio.texto}</p>

        <p className="ep-syllable-label">
          {actual.silabas.join(" - ")}
        </p>

        <div className="ep-canvases" key={indice}>
          {actual.silabas.map((sil, i) => (
            <DrawingCanvas key={i} silaba={sil} />
          ))}

          <span className="ep-arrow">→</span>
        </div>

        <div className="ep-actions">
          <button className="ep-btn" onClick={handleSiguiente}>
            {indice + 1 >= total ? "Finalizar" : "Siguiente →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EjercicioPlayer;
