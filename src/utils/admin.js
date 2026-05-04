import { verificarContraseña } from "../api/admin.api";

export async function comprobarContraseña(password) {
  try {
    const data = { contraseña: password };
    const verificado = await verificarContraseña(data);

    return verificado;
  } catch (error) {
    return "";
  }
}
