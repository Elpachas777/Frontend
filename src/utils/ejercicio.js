import * as api from "../api/ejercicio.api";
import mensaje from "./mensajes";

const TILDE_REGEX = /[áéíóúÁÉÍÓÚàèìòùäëïöüâêîôû]/;

/**
 * Extrae todas las sílabas del contenido del ejercicio
 * y verifica si alguna tiene tilde.
 */
function contenidoTieneTilde(contenido) {
  if (!contenido) return false;

  // Cuento: sílabas dentro de ____()
  if (contenido.tipo === "cuento" && contenido.texto) {
    const matches = [...contenido.texto.matchAll(/_{2,}\(([^)]*)\)/g)];
    if (matches.some((m) => TILDE_REGEX.test(m[1]))) return true;
  }

  // Oracion y PalabraRevuelta: array de palabras con silabas[]
  if (Array.isArray(contenido.palabras)) {
    for (const p of contenido.palabras) {
      if (Array.isArray(p.silabas) && p.silabas.some((s) => TILDE_REGEX.test(s)))
        return true;
    }
  }

  return false;
}

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

    if (contenidoTieneTilde(formData.contenido)) {
      await import("sweetalert2").then(({ default: Swal }) =>
        Swal.fire({
          icon: "warning",
          title: "Sílabas con tilde",
          text: "Las sílabas no pueden contener tildes (acentos). Corrígelas antes de guardar.",
          confirmButtonText: "Entendido",
        }),
      );
      return;
    }

    try {
      await api.guardarEjercicio(formData);
      const { default: Swal } = await import("sweetalert2");
      await Swal.fire({
        icon: "success",
        title: "¡Ejercicio creado!",
        text: "El ejercicio se guardó correctamente.",
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      onGuardado();
    } catch (error) {
      const { data } = error.response;
      await mensaje("Error al crear el ejercicio", data);
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

    if (contenidoTieneTilde(formData.contenido)) {
      const { default: Swal } = await import("sweetalert2");
      await Swal.fire({
        icon: "warning",
        title: "Sílabas con tilde",
        text: "Las sílabas no pueden contener tildes (acentos). Corrígelas antes de guardar.",
        confirmButtonText: "Entendido",
      });
      return;
    }

    try {
      const dataActualizar = {
        titulo: formData.titulo,
        fecha_inicio: formData.fecha_inicio,
        fecha_final: formData.fecha_final,
        id_tipo: formData.id_tipo,
        contenido: formData.contenido,
      };

      await api.actualizar(id_ejercicio, dataActualizar);
      const { default: Swal } = await import("sweetalert2");
      await Swal.fire({
        icon: "success",
        title: "¡Ejercicio actualizado!",
        text: "Los cambios se guardaron correctamente.",
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      onGuardado();
    } catch (error) {
      const { data } = error.response;
      await mensaje("Error al editar el ejercicio", data);
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

export async function reasignarEjercicio({ id_ejercicio }, { id }) {
  try {
    const data = { id };
    await api.reasignarEjercicio(id_ejercicio, data);
  } catch (error) {
    console.log(
      error?.response?.data || {
        tipo: "error",
        mensaje: "No se pudo reasignar el ejercicio",
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