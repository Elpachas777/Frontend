import * as api from "../api/grupo.api";

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
  { setErrores, onGuardado },
) {
  try {
    const data = {
      grupo: grupoNombre,
      alumnos: alumnosSelect
    }

    await api.agregar(grupoId, data);
    onGuardado();
  } catch (error) {
    console.log(error.response.data);
  }
}

export async function eliminarAlumno(id, { alumnosSelect, setErrores, onGuardado }) {
  try {
    const data = alumnosSelect.map((alumno) => ({
      id_ingreso: alumno.id
    }))

    await api.eliminarAlumno(id, data)
    onGuardado()
  } catch (error) {
    console.log(error.response.data)
  }

}

export async function listarAlumnos({ id }) {
  try {
    const lista = await api.listarAlumnos(id)
    return lista
  } catch (error) {
    console.log(error.response.data)
    return []
  }
}