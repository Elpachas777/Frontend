import { useState } from "react";
import Swal from "sweetalert2";
import "./VerAlumnoDetalle.css";

const SILABAS_POOL = ["ma","pa","ta","lla","ca","sa","ra","la","ba","fa","na","da","ga","ja","za","bla"];

function seededRand(seed, min, max) {
  const x = Math.abs(Math.sin(seed + 1) * 10000);
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
}

function getMockData(alumnoId) {
  const s = Number(alumnoId) || 1;
  const ejercicios = [1, 2, 3, 4].map((n) => {
    const total = 10;
    const correctas = seededRand(s * n * 17, 2, 10);
    const pct = Math.round((correctas / total) * 100);
    return { nombre: `Ejercicio ${n}`, correctas, total, pct };
  });
  const offset = s % (SILABAS_POOL.length - 4);
  const silabas = SILABAS_POOL.slice(offset, offset + 4);
  const desempeno = Math.round(ejercicios.reduce((a, e) => a + e.pct, 0) / ejercicios.length);
  return { ejercicios, silabas, desempeno };
}

function getBarColor(pct) {
  if (pct >= 80) return "#4caf50";
  if (pct >= 60) return "#ff9800";
  if (pct >= 40) return "#f44336";
  return "#ffeb3b";
}

const CHART_H = 180;

function BarChart({ ejercicios }) {
  const [tooltipIdx, setTooltipIdx] = useState(null);

  return (
    <div className="vad-chart-wrap">
      <div className="vad-yaxis">
        <span>100%</span>
        <span>50%</span>
        <span>0%</span>
      </div>

      <div className="vad-bars-area" style={{ height: CHART_H }}>
        <div className="vad-grid-line" style={{ top: 0 }} />
        <div className="vad-grid-line" style={{ top: "50%" }} />
        <div className="vad-grid-line" style={{ top: "100%" }} />

        <div className="vad-bars">
          {ejercicios.map((ej, i) => {
            const barH = Math.round((ej.pct / 100) * CHART_H);
            return (
              <div
                key={i}
                className="vad-bar-col"
                onMouseEnter={() => setTooltipIdx(i)}
                onMouseLeave={() => setTooltipIdx(null)}
              >
                <div className="vad-bar-wrapper" style={{ height: barH }}>
                  {tooltipIdx === i && (
                    <div className="vad-tooltip">
                      <strong>{ej.pct}%</strong> · {ej.correctas}/{ej.total}
                    </div>
                  )}
                  <div
                    className="vad-bar"
                    style={{ background: getBarColor(ej.pct) }}
                  />
                </div>
                <span className="vad-bar-label">{ej.nombre}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function VerAlumnoDetalle({ onCerrar, filaSeleccionada }) {
  const alumno = filaSeleccionada || {};
  const { ejercicios, silabas, desempeno } = getMockData(alumno.id);

  const handlePDF = async () => {
    await Swal.fire({
      icon: "info",
      title: "Próximamente",
      text: "La generación de PDF estará disponible con la integración del backend.",
      timer: 2200,
      showConfirmButton: false,
    });
  };

  return (
    <div className="vad-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="vad-card">
        <button className="vad-close" onClick={onCerrar} aria-label="Cerrar">✕</button>

        <div className="vad-header">
          <div className="vad-info-block">
            <div className="vad-foto-placeholder">
              {alumno.foto
                ? <img src={alumno.foto} alt="foto alumno" className="vad-foto" />
                : <span>👤</span>
              }
            </div>

            <div className="vad-info-text">
              <div className="vad-info-row">
                <span>Nombre</span>
                <strong>{alumno.nombre || "—"}</strong>
              </div>
              <div className="vad-info-row">
                <span>Grupo</span>
                <strong>{alumno.grupo || alumno.grupo_id || "—"}</strong>
              </div>
              <div className="vad-info-row">
                <span>Desempeño</span>
                <strong>{desempeno}%</strong>
              </div>
            </div>

            <div className="vad-id-block">
              <span>ID:</span>
              <strong>{alumno.idUnico || alumno.id || "—"}</strong>
            </div>
          </div>

          <div className="vad-silabas-wrap">
            <p className="vad-silabas-title">4 vocales que más se le dificultan</p>
            <div className="vad-silabas-grid">
              {silabas.map((s, i) => (
                <div key={i} className="vad-silaba">{s}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="vad-body">
          <BarChart ejercicios={ejercicios} />
          <button className="vad-pdf-btn" onClick={handlePDF}>Generar PDF</button>
        </div>
      </div>
    </div>
  );
}

export default VerAlumnoDetalle;
