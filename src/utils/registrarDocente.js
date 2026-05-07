function validar(formData) {
  const e = {};
  if (!formData.nombres) e.nombre = "El nombre es obligatorio.";
  if (!formData.apellidos) e.apellidos = "Los apellidos son obligatorios";
  if (!formData.escuela) e.escuela = "Selecciona una escuela.";
  if (!formData.correo) e.correo = "El correo es obligatorio";
  return e;
}

function registrar({ formData, setErrores, setMensaje, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errores = validar(formData);

    if (Object.keys(errores).length > 0) {
      setErrores(errores);
      return;
    }

    try {
      const datos = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        escuela: formData.escuela,
        correo: formData.correo,
        contraseña: formData.password,
      };
      const respuesta = await registrarDocente(datos);
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

export default registrar;
