import "./Grupos.css";
import CrearGrupos from "./CrearGrupos";
import { borrarGrupo, verGrupos } from "../api/grupo.api";
import Tabla from "../components/Tabla";
import EditarGrupo from "./EditarGrupo";
import verAlumnos from "./VerAlumnos";
function Grupos() {
  return (
    <Tabla
      Crear={CrearGrupos}
      obtenerDatos={verGrupos}
      titulo={"grupo"}
      Ver={verAlumnos}
      Borrar={borrarGrupo}
      Editar={EditarGrupo}
    />
  );
}

export default Grupos;
