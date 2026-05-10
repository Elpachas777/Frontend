import {
  cambiarHabilitado,
  verDocentes,
  verificarContraseña,
} from "../api/docente.api";

export async function obtenerDocentes() {
  try {
    const docentes = await verDocentes();
    return docentes;
  } catch (error) {
    return [];
  }
}

export async function modificarHabilitado(id, habilitado) {
  try {
    const data = { habilitado: habilitado };
    const cambiar = await cambiarHabilitado(id, data);
  } catch (error) {
    return "";
  }
}

export async function comprobarContraseña(id, password) {
  try {
    const data = { contraseña: password };
    return await verificarContraseña(id, data);
  } catch (error) {
    return "";
  }
}
