import { verEscuelas } from "../api/escuela.api";

export async function obtenerEscuelas() {
  try {
    const escuelas = await verEscuelas();
    return escuelas;
  } catch (error) {
    return [];
  }
}
