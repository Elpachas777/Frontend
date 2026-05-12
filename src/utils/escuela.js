import * as api from "../api/escuela.api";
import { saveLogo } from "./logoCache";
const PHONE_REGEX = /^\+?[\d\s\-\(\)]{7,20}$/;

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

export function registrarEscuela({
  formData,
  setErrores,
  setMensaje,
  onGuardado,
}) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errores = validar(formData);

    if (Object.keys(errores).length > 0) {
      setErrores(errores);
      return;
    }

    try {
      const { logo_muestra, ...datos } = formData;

      const respuesta = await api.crear(datos);
      saveLogo(formData.nombre, logo_muestra);
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

export async function obtenerEscuelas() {
  try {
    const escuelas = await api.listar();
    return escuelas;
  } catch (error) {
    return [];
  }
}

export function actualizar(
  { id },
  { formData, setErrores, setMensaje, onGuardado },
) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errores = await validar(formData);

    if (Object.keys(errores).length > 0) {
      setErrores(errores);
      return;
    }

    try {
      const { logo_muestra, ...datos } = formData;

      const respuesta = await api.actualizar(id, datos);
      saveLogo(formData.nombre, logo_muestra);
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
