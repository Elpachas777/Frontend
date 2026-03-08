import { editarDocente } from "../api/docente.api";

function editar({ filaSeleccionada, formData, setActualizado, setMensaje }) {
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
      };
      const respuesta = await editarDocente(filaSeleccionada.id, datos);
      setActualizado((prev) => !prev);

      setMensaje(respuesta);
    } catch (error) {
      setMensaje({
        tipo: "error",
        mensaje: error?.response?.data?.mensaje || "Error al editar el docente",
      });
    }
  };

  return {
    handleSubmit,
  };
}

export default editar;
