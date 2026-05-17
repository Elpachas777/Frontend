export function quitarFoto(formData) {
  const { foto, fotoPreview, ...datos } = formData;
  return datos;
}
