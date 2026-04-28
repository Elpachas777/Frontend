import { guardarEjercicio } from "../api/ejercicio.api";

function obtenerDatos() {
  const titulo = document.getElementById("titulo").value;
  const fechaInicio = document.getElementById("fi").value;
  const fechaFinal = document.getElementById("ff").value;

  return { titulo, fechaInicio, fechaFinal };
}

export function crearCuento() {
  const datos = obtenerDatos();

  const cuento = document.getElementById("cuento").value;
  const silaba = document.getElementById("silaba").value;

  let ejercicio = cuento;

  if (silaba) {
    ejercicio = cuento
      .toLowerCase()
      .replaceAll(silaba.toLowerCase(), "<Canvas>");
  }

  const json = JSON.stringify({
    titulo: datos.titulo,
    fecha_inicio: datos.fechaInicio,
    fecha_final: datos.fechaFinal,
    contenido: {
      silaba,
      cuento,
      ejercicio,
    },
    tipo: 1,
  });

  return JSON.parse(json);
}

export function guardar() {
  const handleSubmit = async (event, json) => {
    event.preventDefault();
    try {
      console.log(json);
      await guardarEjercicio(json);
    } catch (error) {
      console.log(error);
    }
  };

  return { handleSubmit };
}
