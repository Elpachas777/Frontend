import Swal from "sweetalert2";
import "./VerAlumnoDetalle.css";

function VerAlumnoDetalle({ alumno, onCerrar }) {
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
    <div
      className="vad-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div className="vad-card">
        <button className="vad-close" onClick={onCerrar} aria-label="Cerrar">
          ✕
        </button>

        <div className="vad-header">
          <div className="vad-info-block">
            <div className="vad-foto-placeholder">
              <span>👤</span>
            </div>
            <div className="vad-info-text">
              <div className="vad-info-row">
                <span>Nombre</span>
                <strong>{alumno.nombres || "—"}</strong>
              </div>
              <div className="vad-info-row">
                <span>Grupo</span>
                <strong>{alumno.grupo || "—"}</strong>
              </div>
            </div>

            <div className="vad-id-block">
              <span>ID:</span>
              <strong>{alumno.id_ingreso || "—"}</strong>
            </div>
          </div>

          {/*<div className="vad-silabas-wrap">
            <p className="vad-silabas-title">
              4 vocales que más se le dificultan
            </p>
            <div className="vad-silabas-grid">
              {silabas.map((s, i) => (
                <div key={i} className="vad-silaba">
                  {s}
                </div>
              ))}
            </div>
          </div>*/}
        </div>

        <div className="vad-body">
          {/*<BarChart ejercicios={ejercicios} />*/}
          <button className="vad-pdf-btn" onClick={handlePDF}>
            Generar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerAlumnoDetalle;
