import { verDocentes } from "../api/docente.api";

export async function obtenerDocentes() {
  try {
    const docentes = await verDocentes();
    return docentes;
  } catch (error) {
    return [];
  }
}
