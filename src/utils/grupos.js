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
  { grupoId, alumnosId },
  { setErrores, onGuardado },
) {
  try {
    const agregado = await api.agregar(grupoId, alumnosId);
    console.log(agregado);
    onGuardado();
  } catch (error) {
    console.log(error.response.data);
  }
}
