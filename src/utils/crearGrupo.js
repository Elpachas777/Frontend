import { crearGrupo } from "../api/grupo.api";

function crear({ formData, setMensaje, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const respuesta = await crearGrupo(formData);
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

export default crear;
