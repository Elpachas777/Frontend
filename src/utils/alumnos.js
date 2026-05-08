import * as api from "../api/alumno.api";

function validar(formData) {
  const e = {};
  if (!formData.nombres) e.nombre = "El nombre es obligatorio.";
  if (!formData.apellidos) e.apellidos = "Los apellidos son obligatorios";
  return e;
}

export async function listar() {
  try {
    const alumnos = await api.listar();
    return alumnos;
  } catch (error) {
    return [];
  }
}

export function actualizar(
  { id },
  { formData, setErrores, setMensaje, onGuardado },
) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errores = validar(formData);

    if (Object.keys(errores).length > 0) {
      setErrores(errores);
      return;
    }
    try {
      const respuesta = await api.actualizar(id, formData);
      setMensaje(respuesta);
      onGuardado();
    } catch (error) {
      setMensaje(error.response.data);
    }
  };

  return {
    handleSubmit,
  };
}
