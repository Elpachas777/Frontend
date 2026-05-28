import * as api from "../api/alumno.api";
import mensaje from "./mensajes";

function validar(formData) {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const e = {};
  if (!formData.nombres) e.nombres = "El nombre es obligatorio.";
  else if (!regex.test(formData.nombres))
    e.nombres = "El nombre cuenta con caracteres invalidos";

  if (!formData.apellidos) e.apellidos = "Los apellidos son obligatorios.";
  else if (!regex.test(formData.apellidos))
    e.apellidos = "Los apellidos cuentan con caracteres invalidos";

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
      await mensaje("Alumno editado con exito", respuesta);
      onGuardado();
    } catch (error) {
      const { data } = error.response;
      await mensaje("Error al modificar al alumno", data);
    }
  };

  return {
    handleSubmit,
  };
}
