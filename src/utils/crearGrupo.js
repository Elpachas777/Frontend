import Swal from "sweetalert2";
import { crearGrupo } from "../api/grupo.api";

function crear({ formData, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await crearGrupo({
        ...formData,
        nombre: String(formData.nombre || "").trim().toUpperCase(),
      });

      await Swal.fire({
        title: "¡Grupo creado!",
        text: "El grupo fue registrado correctamente.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        confirmButtonColor: "#7bc043",
      });

      onGuardado();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.mensaje ?? "No se pudo crear el grupo.",
        icon: "error",
        confirmButtonColor: "#7bc043",
      });
    }
  };

  return { handleSubmit };
}

export default crear;