import { editarDocente } from "../api/docente.api";
import { comprobarContraseña } from "./docentes";

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
    }
  }
  return e;
}

function editar({ id }, { formData, setErrores, setMensaje }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errores = await validar(formData, id);

    if (Object.keys(errores).length > 0) {
      setErrores(errores);
      return;
    }

    try {
      const datos = {
        usuario: {
          nombres: formData.nombre,
          apellido: formData.apellidos,
        },
        escuela: formData.escuela.id,
        docente: {
          correo: formData.correo,
          contraseña: formData.passwordNueva,
        },
      };
      console.log(datos);
      const respuesta = await editarDocente(id, datos);
      setMensaje(respuesta);
    } catch (error) {
      setMensaje(error.response.data);
    }
  };

  return {
    handleSubmit,
  };
}

export default editar;
