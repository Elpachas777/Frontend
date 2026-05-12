const KEY = "escuela_logos";

function getAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
  catch { return {}; }
}

export function saveLogo(nombre, base64) {
  if (!nombre || !base64) return;
  const cache = getAll();
  cache[nombre] = base64;
  localStorage.setItem(KEY, JSON.stringify(cache));
}

export function getLogo(nombre) {
  if (!nombre) return null;
  return getAll()[nombre] || null;
}
