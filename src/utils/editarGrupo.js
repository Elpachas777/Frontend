import { agregarAlumno, editarGrupo } from "../api/grupo.api";

export function actualizar({ id }, { formData, setMensaje, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const respuesta = await editarGrupo(id, formData);
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
