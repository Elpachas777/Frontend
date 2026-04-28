import React from "react";
import BotonCanvas from "../components/BotonCanvas";

export default function MostrarEjercicio(cuento) {
  const { titulo, contenido } = cuento.ejercicio;
  const segmentos = contenido.ejercicio.split("<Canvas>");

  return (
    <div>
      <p>{titulo}</p>

      {segmentos.map((texto, posicion) => (
        <React.Fragment key={posicion}>
          {texto}
          {posicion < segmentos.length - 1 && <BotonCanvas />}
        </React.Fragment>
      ))}
    </div>
  );
}
