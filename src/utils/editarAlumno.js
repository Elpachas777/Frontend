import { editarAlumno } from "../api/alumno.api";

function editar({ filaSeleccionada, formData, setActualizado, setMensaje }) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const respuesta = await editarAlumno(filaSeleccionada.id, formData);
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

export default editar;
