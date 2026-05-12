import * as api from "../api/grupo.api";
import mensaje from "./mensajes";

export async function listar() {
  try {
    const grupos = await api.listar();
    return grupos;
  } catch (error) {
    return [];
  }
}

export async function agregar(
  { grupoId, grupoNombre, alumnosSelect },
  { onGuardado },
) {
  try {
    const data = {
      grupo: grupoNombre,
      alumnos: alumnosSelect,
    };

    const respuesta = await api.agregar(grupoId, data);

    await mensaje("Alumnos agregados con exito", respuesta);
    onGuardado();
  } catch (error) {
    console.log(error?.response?.data || error.message);

    if (setErrores) {
      setErrores(error?.response?.data || {});
    }

    throw error;
  }
}

export async function eliminarAlumno(
  id,
  { alumnosSelect, setErrores, onGuardado },
) {
  try {
    const data = alumnosSelect.map((alumno) => ({
      id_ingreso: alumno.id,
    }));

    const respuesta = await api.eliminarAlumno(id, data);
    await mensaje("Alumno eliminado del grupo con exito", respuesta);
    onGuardado();
  } catch (error) {
    const { data } = error.response;
    await mensaje("Error al eliminar al alumno del grupo", data);
  }
}

export async function listarAlumnos({ id }) {
  try {
    const lista = await api.listarAlumnos(id);
    return lista;
  } catch (error) {
    console.log(error.response.data);
    return [];
  }
}
