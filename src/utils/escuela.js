import * as api from "../api/escuela.api";
import { quitarFoto } from "./foto";
import mensaje from "./mensajes";
const PHONE_REGEX = /^\+?[\d\s\-\(\)]{7,20}$/;
const GOOGLE_MAPS_REGEX =
  /^https:\/\/(www\.)?(google\.(com|com\.\w+)|goo\.gl|maps\.app\.goo\.gl)(\/maps)?[\/\?].*$/i;

function validar(formData) {
  const e = {};
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  if (!formData.nombre) e.nombre = "El nombre es obligatorio.";
  else if (!regex.test(formData.nombre))
    e.nombre = "El nombre cuenta con caracteres invalidos";
  if (!formData.ubicacion) {
    e.ubicacion = "La URL de Google Maps es obligatoria.";
  } else if (!GOOGLE_MAPS_REGEX.test(formData.ubicacion)) {
    e.ubicacion = "Ingresa una URL válida de Google Maps (google.com/maps).";
  }
  if (!formData.director) e.director = "El director a cargo es obligatorio.";
  else if (!regex.test(formData.director))
    e.director = "El nombre del director cuenta con caracteres invalidos";
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
      const { foto, fotoPreview, ...datos } = formData;
      const data = new FormData();

      data.append("data", JSON.stringify(datos));
      data.append("foto", formData.foto);

      const respuesta = await api.crear(data);
      mensaje("¡Escuela creada!", respuesta);
      onGuardado();
    } catch (error) {
      const { data } = error.response;
      await mensaje("Error al crear la escuela", data);
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

export function actualizar({ id, foto }, { formData, setErrores, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errores = validar(formData);

    if (Object.keys(errores).length > 0) {
      setErrores(errores);
      return;
    }

    try {
      const data = new FormData();
      const datos = quitarFoto(formData);

      if (formData.foto !== foto) {
        data.append("foto", formData.foto);
      }

      data.append("data", JSON.stringify(datos));

      const respuesta = await api.actualizar(id, data);
      await mensaje("¡Escuela editada!", respuesta);
      onGuardado();
    } catch (error) {
      console.log(error);

      const { data } = error.response;
      await mensaje("Error al editar la información de la escuela", data);
    }
  };

  return {
    handleSubmit,
  };
}
