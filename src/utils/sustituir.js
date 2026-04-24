export default function sustituir() {
  const titulo = document.getElementById("titulo").value;
  const cuento = document.getElementById("cuento").value;
  const silaba = document.getElementById("silaba").value;
  let nuevoCuento = cuento;

  if (silaba) {
    nuevoCuento = cuento
      .toLowerCase()
      .replaceAll(silaba.toLowerCase(), "<Canvas>");
  }

  const resultado = JSON.stringify({
    titulo: titulo,
    tipo: "cuento",
    texto: nuevoCuento,
  });

  console.log(resultado);
  //mandar luego a base de datos
  return JSON.parse(resultado);
}
