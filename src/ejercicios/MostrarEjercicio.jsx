import React from "react";
import BotonCanvas from "../components/BotonCanvas";

export default function MostrarEjercicio({ ejercicio }) {
  const { titulo, contenido } = ejercicio;
  const segmentos = contenido.modificado.split("<Canvas>");

  return (
    <div>
      <p>{titulo}</p>

      {segmentos.map((texto, posicion) => (
        <React.Fragment key={posicion}>
          {texto}
          {posicion < segmentos.length - 1 && (
            <BotonCanvas Texto={contenido.silaba} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
