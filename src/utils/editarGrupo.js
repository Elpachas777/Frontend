import { agregarAlumno, editarGrupo } from "../api/grupo.api";

export function editar({
  filaSeleccionada,
  formData,
  setActualizado,
  setMensaje,
}) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const respuesta = await editarGrupo(filaSeleccionada.id, formData);
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
