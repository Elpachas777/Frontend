import Tabla from "../components/Tabla";
import { eliminarDocente, verDocentes } from "../api/docente.api";
import Registro from "./Registro";
import EditarDocente from "./EditarDocente";

function Docentes() {
  return (
    <Tabla
      Crear={Registro}
      obtenerDatos={verDocentes}
      titulo={"docentes"}
      Borrar={eliminarDocente}
      Editar={EditarDocente}
    />
  );
}

export default Docentes;
