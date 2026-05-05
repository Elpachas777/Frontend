import * as api from "../api/ejercicio.api";

function obtenerDatos() {
  const titulo = document.getElementById("titulo").value;
  const fechaInicio = document.getElementById("fi").value;
  const fechaFinal = document.getElementById("ff").value;

  return { titulo, fechaInicio, fechaFinal };
}

export function crearCuento() {
  const cuento = document.getElementById("cuento").value;
  const silaba = document.getElementById("silaba").value;

  let ejercicio = cuento;

  if (silaba) {
    ejercicio = cuento
      .toLowerCase()
      .replaceAll(silaba.toLowerCase(), "<Canvas>");
  }

  const json = JSON.stringify({
    contenido: {
      silaba,
      cuento,
      ejercicio,
    },
    tipo: 1,
  });

  return JSON.parse(json);
}

export function crear({ formData, setErrores, setMensaje }) {
  const handleSubmit = async (event, json) => {
    event.preventDefault();

    try {
      console.log(json);
      await api.guardarEjercicio(json);
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
