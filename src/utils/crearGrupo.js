import Swal from "sweetalert2";
import { crearGrupo } from "../api/grupo.api";
import mensaje from "./mensajes";

function crear({ formData, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await crearGrupo({
        ...formData,
        nombre: String(formData.nombre || "")
          .trim()
          .toUpperCase(),
      });

      await Swal.fire({
        icon: "success",
        title: "¡Grupo creado!",
        text: "El grupo se registró correctamente.",
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      onGuardado();
    } catch (error) {
      const { data } = error.response;
      await mensaje("Error al crear el grupo", data);
    }
  };

  return { handleSubmit };
}

export default crear;
