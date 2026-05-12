import Swal from "sweetalert2";
import * as api from "../api/escuela.api";
import { saveLogo } from "./logoCache";
const PHONE_REGEX = /^\+?[\d\s\-\(\)]{7,20}$/;
const URL_REGEX = /^https?:\/\/.+\..+/;

function validar(formData) {
  const e = {};
  if (!formData.nombre) e.nombre = "El nombre es obligatorio.";
  if (!formData.ubicacion) {
    e.ubicacion = "La URL de Google Maps es obligatoria.";
  }
  if (!formData.director) e.director = "El director a cargo es obligatorio.";
  if (!formData.contacto) {
    e.contacto = "El número de contacto es obligatorio.";
  } else if (!PHONE_REGEX.test(formData.contacto)) {
    e.contacto = "Solo se permiten dígitos, espacios y guiones.";
  }
  if (
    formData.contacto_adicional &&
    !PHONE_REGEX.test(formData.contacto_adicional)
  ) {
    e.contacto_adicional = "Solo se permiten dígitos, espacios y guiones.";
  }
  return e;
}

export function registrarEscuela({ formData, setErrores, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errores = validar(formData);

    if (Object.keys(errores).length > 0) {
      setErrores(errores);
      return;
    }

    try {
      const { logo_muestra, ...datos } = formData;
      await api.crear(datos);
      saveLogo(formData.nombre, logo_muestra);
      await Swal.fire({
        title: "¡Escuela creada!",
        text: "La escuela fue registrada correctamente.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        confirmButtonColor: "#7bc043",
      });
      onGuardado();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.mensaje ?? "No se pudo crear la escuela.",
        icon: "error",
        confirmButtonColor: "#7bc043",
      });
    }
  };

  return {
    handleSubmit,
  };
}

export async function obtenerEscuelas() {
  try {
    const escuelas = await api.listar();
    return escuelas;
  } catch (error) {
    return [];
  }
}

export function actualizar({ id }, { formData, setErrores, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errores = validar(formData);

    if (Object.keys(errores).length > 0) {
      setErrores(errores);
      return;
    }

    try {
      const { logo_muestra, ...datos } = formData;
      await api.actualizar(id, datos);
      saveLogo(formData.nombre, logo_muestra);
      await Swal.fire({
        title: "¡Escuela editada!",
        text: "Los cambios fueron guardados correctamente.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        confirmButtonColor: "#7bc043",
      });
      onGuardado();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error?.response?.data?.mensaje ?? "No se pudo actualizar la escuela.",
        icon: "error",
        confirmButtonColor: "#7bc043",
      });
    }
  };

  return {
    handleSubmit,
  };
}
