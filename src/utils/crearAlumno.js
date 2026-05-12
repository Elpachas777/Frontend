import * as api from "../api/alumno.api";
import mensaje from "./mensajes";

function validar(formData) {
  const e = {};
  if (!formData.nombre) e.nombre = "El nombre es obligatorio.";
  if (!formData.apellidos) e.apellidos = "Los apellidos son obligatorios.";
  return e;
}

function crear({ formData, setErrores, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errores = validar(formData);

    if (Object.keys(errores).length > 0) {
      setErrores(errores);
      return;
    }

    try {
      const respuesta = await api.crear(formData);
      await mensaje("Alumno creado", respuesta);
      onGuardado();
    } catch (error) {
      const { data } = error.response;
      await mensaje("Error al registrar al alumno", data);
    }
  };

  return { handleSubmit };
}

export default crear;
