import { agregarAlumno, editarGrupo } from "../api/grupo.api";
import mensaje from "./mensajes";

export function actualizar({ id }, { formData, setMensaje, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const respuesta = await editarGrupo(id, formData);
      await mensaje("Grupo editado con exito", respuesta);
      onGuardado();
    } catch (error) {
      const { data } = error.response;
      await mensaje("Error al editar el grupo", data);
    }
  };

  return {
    handleSubmit,
  };
}

export function agregar({
  filaSeleccionada,
  formData,
  setActualizado,
  setMensaje,
}) {
  const handleClick = async (event) => {
    event.preventDefault();

    if (!formData.nombre || !formData.apellidos) return;

    try {
      const respuesta = await agregarAlumno(filaSeleccionada.id, formData);
      setActualizado((prev) => !prev);
      setMensaje(respuesta);
    } catch (error) {
      setMensaje(error.response.data);
    }
  };

  return {
    handleClick,
  };
}
