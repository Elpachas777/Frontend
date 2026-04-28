import "./Alumnos.css";
import Tabla from "../components/Tabla";
import { borrarAlumno } from "../api/alumno.api";
import CrearAlumno from "./CrearAlumno";
import EditarAlumno from "./EditarAlumno";
import VerAlumnoDetalle from "./VerAlumnoDetalle";
import { verGrupo } from "../api/grupo.api";

function VerAlumnos({ onCerrar, id, filaSeleccionada }) {
  const grupoId = filaSeleccionada?.id ?? id;
  const nombreGrupo = filaSeleccionada?.nombre || "Sin nombre";

  return (
    <div className="modal-overlay modal-overlay--wide">
      <div className="tabla-modal">
        <div className="detalle-grupo-header">
          <div>
            <h2>Detalle del grupo</h2>
            <p className="detalle-grupo-nombre">{nombreGrupo}</p>
          </div>

          <button
            type="button"
            className="cancelar-btn cancelar-btn--detalle"
            onClick={onCerrar}
          >
            Cerrar
          </button>
        </div>

        {grupoId ? (
          <Tabla
            Crear={CrearAlumno}
            obtenerDatos={verGrupo}
            titulo="alumnos"
            Borrar={borrarAlumno}
            Editar={EditarAlumno}
            Ver={VerAlumnoDetalle}
            id={grupoId}
            ocultarColumnas={["correo"]}
          />
        ) : (
          <div className="detalle-grupo-error">
            No se pudo obtener el ID del grupo.
          </div>
        )}
      </div>
    </div>
  );
}

export default VerAlumnos;