import "./Alumnos.css";
import Tabla from "../components/Tabla";
import { borrarAlumno } from "../api/alumno.api";
import CrearAlumno from "./CrearAlumno";
import EditarAlumno from "./EditarAlumno";
import { verGrupo } from "../api/grupo.api";

function Alumnos({ onCerrar, id }) {
  return (
    <div className="modal-overlay">
      <Tabla
        Crear={CrearAlumno}
        obtenerDatos={verGrupo}
        titulo={"alumnos"}
        Borrar={borrarAlumno}
        Editar={EditarAlumno}
        id={id}
      >
        <button
          type="button"
          className="cancelar-btn"
          onClick={onCerrar}
          style={{ marginTop: "20px" }}
        >
          Cancelar
        </button>
      </Tabla>
    </div>
  );
}

export default Alumnos;
