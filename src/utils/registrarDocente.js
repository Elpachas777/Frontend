import { registrarDocente } from "../api/docente.api";

function registrar({ formData, setActualizado, setMensaje }) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmar) {
      setMensaje({ tipo: "error", mensaje: "Las contraseñas no coinciden" });
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
      setActualizado((prev) => !prev);
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
