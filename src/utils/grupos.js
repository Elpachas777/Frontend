import * as api from "../api/grupo.api";

export async function listar() {
  try {
    const grupos = await api.listar();
    return grupos;
  } catch (error) {
    return [];
  }
}
