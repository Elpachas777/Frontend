import { registrarDocente } from "../api/docente.api";

function validar(formData) {
  const e = {};
  if (!formData.nombres) e.nombre = "El nombre es obligatorio.";
  if (!formData.apellidos) e.apellidos = "Los apellidos son obligatorios";
  if (!formData.escuela) e.escuela = "Selecciona una escuela.";
  if (!formData.correo) e.correo = "El correo es obligatorio";
  return e;
}

function registrar({ formData, setErrores, setMensaje }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errores = validar(formData);

    if (!errores) {
      setErrores(errores);
      return;
    }

    try {
      const datos = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        escuela: formData.escuela,
        correo: formData.correo,
        password: formData.password,
      };

      const respuesta = await registrarDocente(datos);

      setMensaje(respuesta);
    } catch (error) {
      setMensaje(error.response.data);
    }
  };

  return {
    handleSubmit,
  };
}

export default registrar;
