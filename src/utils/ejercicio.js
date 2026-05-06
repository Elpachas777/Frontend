import * as api from "../api/ejercicio.api";

export function crearCuento(silaba, cuento) {
  let ejercicio = cuento;

  if (silaba) {
    ejercicio = cuento
      .toLowerCase()
      .replaceAll(silaba.toLowerCase(), "<Canvas>");
  }
  return ejercicio;
}

export function crear({ formData, setErrores, setMensaje }) {
  const handleSubmit = async (event, json) => {
    event.preventDefault();

    try {
      const res = await api.guardarEjercicio(formData);
      setMensaje(res);
    } catch (error) {
      console.log(error);
    }
  };

  return { handleSubmit };
}

export async function listarTipos() {
  try {
    const tipos = await api.listarTipos();
    return tipos;
  } catch (error) {
    return [];
  }
}

export async function listar() {
  try {
    const ejercicios = await api.listar();
    return ejercicios;
  } catch (error) {
    return [];
  }
}

export function actualizar(
  { id_ejercicio },
  { formData, setErrores, setMensaje },
) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const actualizado = await api.actualizar(id_ejercicio, formData);
      setMensaje(actualizado);
    } catch (error) {
      setMensaje(error.data);
    }
  };

  return {
    handleSubmit,
  };
}
