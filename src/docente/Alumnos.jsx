import "./Alumnos.css";
import Tabla from "../components/Tabla";
import { borrarAlumno, verAlumnos } from "../api/alumno.api";
import CrearAlumno from "./CrearAlumno";
import EditarAlumno from "./EditarAlumno";

function Alumnos() {
  return (
    <Tabla
      Crear={CrearAlumno}
      obtenerDatos={verAlumnos}
      titulo={"alumnos"}
      Borrar={borrarAlumno}
      Editar={EditarAlumno}
    />
  );
}

export default Alumnos;
