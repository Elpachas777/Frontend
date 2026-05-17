function getAll(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function save(key, id, base64) {
  if (!id || !base64) return;
  const cache = getAll(key);
  cache[id] = base64;
  localStorage.setItem(key, JSON.stringify(cache));
}

function get(key, id) {
  if (!id) return null;
  return getAll(key)[id] || null;
}

// Escuelas — keyed by nombre
export const saveLogo = (nombre, base64) =>
  save("escuela_logos", nombre, base64);
export const getLogo = (nombre) => get("escuela_logos", nombre);

// Docentes — keyed by correo
export const saveDocFoto = (correo, base64) =>
  save("docente_fotos", correo, base64);
export const getDocFoto = (correo) => get("docente_fotos", correo);
