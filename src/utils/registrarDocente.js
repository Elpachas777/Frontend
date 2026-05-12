import * as api from "../api/docente.api";
import { saveDocFoto } from "./logoCache";
import mensaje from "./mensajes";

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#\-])[A-Za-z\d@$!%*?&_#\-]{8,}$/;

function validar(formData) {
  const e = {};
  if (!formData.nombres) e.nombre = "El nombre es obligatorio.";
  if (!formData.apellidos) e.apellidos = "Los apellidos son obligatorios.";
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

function registrar({ formData, foto, setErrores, onGuardado }) {
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
      const respuesta = await api.crear(datos);
      saveDocFoto(formData.correo, foto);
      await mensaje("Docente creado", respuesta);
      onGuardado();
    } catch (error) {
      mensaje("Error al registrar el docente", error.response.data);
    }
  };

  return { handleSubmit };
}

export default registrar;
