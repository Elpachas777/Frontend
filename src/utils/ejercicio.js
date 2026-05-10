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

export function crear({ formData, setErrores, setMensaje, onGuardado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await api.guardarEjercicio(formData);
      setMensaje(res);
      onGuardado();
    } catch (error) {
      setMensaje(error.response.data);
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
  { formData, setErrores, setMensaje, onGuardado },
) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const actualizado = await api.actualizar(id_ejercicio, formData);
      setMensaje(actualizado);
      onGuardado();
    } catch (error) {
      setMensaje(error.response.data);
    }
  };

  return {
    handleSubmit,
  };
}

export async function asignarEjercicio({ id_ejercicio }, { id }) {
  try {
    const data = { id }
    await api.asignarEjercicio(id_ejercicio, data)
  } catch (error) {
    console.log(error.response.data)
  }
}
