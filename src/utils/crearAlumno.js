import Swal from "sweetalert2";
import * as api from "../api/alumno.api";

function validar(formData) {
  const e = {};
  if (!formData.nombre) e.nombre = "El nombre es obligatorio.";
  if (!formData.apellidos) e.apellidos = "Los apellidos son obligatorios.";
  return e;
}

function crear({ formData, setErrores, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errores = validar(formData);

    if (Object.keys(errores).length > 0) {
      setErrores(errores);
      return;
    }

    try {
      await api.crear(formData);
      await Swal.fire({
        title: "¡Alumno creado!",
        text: "El alumno fue registrado correctamente.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        confirmButtonColor: "#7bc043",
      });
      onGuardado();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.mensaje ?? "No se pudo crear el alumno.",
        icon: "error",
        confirmButtonColor: "#7bc043",
      });
    }
  };

  return { handleSubmit };
}

export default crear;
