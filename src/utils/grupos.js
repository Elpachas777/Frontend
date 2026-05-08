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
    console.log(alumnosSelect)
    const data = {
      grupo : grupoNombre,
      alumnos : alumnosSelect
    }
    
    const agregado = await api.agregar(grupoId, data);
    console.log(agregado);
    onGuardado();
  } catch (error) {
    console.log(error.response.data);
  }
}

export async function listarAlumnos({id}) {
  try {
    const lista = await api.listarAlumnos(id)
    return lista
  } catch (error) {
    console.log(error.response.data)
    return []
  }
}