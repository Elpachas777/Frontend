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

      if (onGuardado) {
        await onGuardado();
      }
    } catch (error) {
      setMensaje(
        error?.response?.data || {
          tipo: "error",
          mensaje: "No se pudo crear el ejercicio",
        },
      );
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
      const dataActualizar = {
        titulo: formData.titulo,
        fecha_inicio: formData.fecha_inicio,
        fecha_final: formData.fecha_final,
        id_tipo: formData.id_tipo,
        contenido: formData.contenido,
      };

      const actualizado = await api.actualizar(id_ejercicio, dataActualizar);

      setMensaje(actualizado);

      if (onGuardado) {
        await onGuardado();
      }
    } catch (error) {
      setMensaje(
        error?.response?.data || {
          tipo: "error",
          mensaje: "No se pudo actualizar el ejercicio",
        },
      );
    }
  };

  return {
    handleSubmit,
  };
}

export async function asignarEjercicio({ id_ejercicio }, { id }) {
  try {
    const data = { id };

    await api.asignarEjercicio(id_ejercicio, data);
  } catch (error) {
    console.log(
      error?.response?.data || {
        tipo: "error",
        mensaje: "No se pudo asignar el ejercicio",
      },
    );
  }
}

export async function estadisticasAsignacion(idEjercicio) {
  try {
    const estadisticas = await api.estadisticasAsignacion(idEjercicio);
    return estadisticas;
  } catch (error) {
    console.log(
      error?.response?.data || {
        tipo: "error",
        mensaje: "No se pudieron cargar las estadísticas de asignación",
      },
    );

    return [];
  }
}