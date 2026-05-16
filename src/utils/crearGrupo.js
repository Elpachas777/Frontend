import { crearGrupo } from "../api/grupo.api";
import mensaje from "./mensajes";

function crear({ formData, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const respuesta = await crearGrupo({
        ...formData,
        nombre: String(formData.nombre || "")
          .trim()
          .toUpperCase(),
      });

      await mensaje("¡Grupo creado!", respuesta);
      onGuardado();
    } catch (error) {
      const { data } = error.response;
      await mensaje("Error al crear el grupo", data);
    }
  };

  return { handleSubmit };
}

export default crear;
