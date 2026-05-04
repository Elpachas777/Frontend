import { crearGrupo } from "../api/grupo.api";

function crear({ formData, setMensaje }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const respuesta = await crearGrupo(formData);
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
