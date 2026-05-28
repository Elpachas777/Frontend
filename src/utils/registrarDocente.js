import * as api from "../api/docente.api";
import mensaje from "./mensajes";

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#\-])[A-Za-z\d@$!%*?&_#\-]{8,}$/;

function validar(formData) {
  const e = {};
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  if (!formData.nombres) e.nombre = "El nombre es obligatorio.";
  else if (!regex.test(formData.nombres))
    e.nombre = "El nombre cuenta con caracteres invalidos";

  if (!formData.apellidos) e.apellidos = "Los apellidos son obligatorios.";
  else if (!regex.test(formData.apellidos))
    e.apellidos = "Los apellidos cuentan con caracteres invalidos";

  if (!formData.escuela) e.escuela = "Selecciona una escuela.";
  if (!formData.correo) e.correo = "El correo es obligatorio.";
  if (!formData.password) {
    e.password = "La contraseña es obligatoria.";
  } else if (!PASSWORD_REGEX.test(formData.password)) {
    e.password =
      "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial (@$!%*?&_#-).";
  }
  return e;
}

function registrar({ formData, setErrores, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errores = validar(formData);

    if (Object.keys(errores).length > 0) {
      setErrores(errores);
      return;
    }

    try {
      const datos = new FormData();

      datos.append("nombres", formData.nombres);
      datos.append("apellidos", formData.apellidos);
      datos.append("escuela", formData.escuela);
      datos.append("foto", formData.foto);
      datos.append("correo", formData.correo);
      datos.append("contrasena", formData.password);

      const respuesta = await api.crear(datos);
      await mensaje("Docente creado", respuesta);
      onGuardado();
    } catch (error) {
      const { data } = error.response;
      mensaje("Error al registrar el docente", data);
    }
  };

  return { handleSubmit };
}

export default registrar;
