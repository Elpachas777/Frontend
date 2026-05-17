import { editarDocente } from "../api/docente.api";
import { comprobarContraseña } from "./docentes";
import mensaje from "./mensajes";

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#\-])[A-Za-z\d@$!%*?&_#\-]{8,}$/;

async function validar(formData, id) {
  const e = {};

  const cambiandoPassword = formData.passwordAntigua || formData.passwordNueva;
  if (cambiandoPassword) {
    if (!formData.passwordAntigua) {
      e.passwordAntigua = "Ingresa tu contraseña actual.";
    } else if (!(await comprobarContraseña(id, formData.passwordAntigua))) {
      e.passwordAntigua = "La contraseña actual no coincide.";
    }
    if (!formData.passwordNueva) {
      e.passwordNueva = "Ingresa la nueva contraseña.";
    } else if (!PASSWORD_REGEX.test(formData.passwordNueva)) {
      e.passwordNueva =
        "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial (@$!%*?&_#-).";
    }
  }
  return e;
}

function editar({ id, foto }, { formData, setErrores, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errores = await validar(formData, id);

    if (Object.keys(errores).length > 0) {
      setErrores(errores);
      return;
    }

    setErrores([]);

    try {
      const datos = new FormData();

      if (formData.foto !== foto) {
        datos.append("foto", formData.foto);
      }

      datos.append(
        "usuario",
        JSON.stringify({
          nombres: formData.nombre,
          apellido: formData.apellidos,
        }),
      );

      datos.append("escuela", formData.escuela.id);
      datos.append(
        "docente",
        JSON.stringify({
          correo: formData.correo,
          contraseña: formData.passwordNueva,
        }),
      );
      const respuesta = await editarDocente(id, datos);
      mensaje("Docente editado", respuesta);
      onGuardado();
    } catch (error) {
      mensaje("Error", error.response.data);
    }
  };

  return { handleSubmit };
}

export default editar;
