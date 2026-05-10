import Visualizador from "../ejercicios/Visualizador";
import "./VerEjercicio.css";

function VerEjercicio({ ejercicio, onCerrar }) {
  return (
    <div className="modal-overlay">
      <div
        className="modal-card modal-card--wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Ver ejercicio</h2>
          <button type="button" className="modal-close" onClick={onCerrar}>
            ✕
          </button>
        </div>

        <div className="contenido">
          <div className="contenedor">
            <strong>ID</strong>
            <div className="contenedor-valor">{ejercicio.id_ejercicio}</div>
          </div>

          <div className="contenedor">
            <strong>Titulo</strong>
            <div className="contenedor-valor">{ejercicio.titulo}</div>
          </div>

          <Visualizador tipo={ejercicio.id_tipo} ejercicio={ejercicio} onCerrar={onCerrar} />
        </div>
      </div>
    </div>
  );
}

export default VerEjercicio;
