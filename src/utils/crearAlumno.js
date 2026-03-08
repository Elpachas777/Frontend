import { registrarAlumno } from "../api/alumno.api";
import { agregarAlumno } from "../api/grupo.api";

function crear({ formData, setActualizado, id, setMensaje }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    var respuesta;
    try {
      if (!id) {
        respuesta = await registrarAlumno(formData);
      } else {
        respuesta = await agregarAlumno(id, formData);
      }

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

export default crear;
