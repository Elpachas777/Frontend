import React from "react";
import BotonCanvas from "../components/BotonCanvas";

export default function MostrarEjercicio({ ejercicio }) {
  const { titulo, texto } = ejercicio;
  const segmentos = texto.split("<Canvas>");

  return (
    <div>
      <p>{titulo}</p>
      <p>
        {segmentos.map((texto, posicion) => (
          <React.Fragment key={posicion}>
            {texto}
            {posicion < segmentos.length - 1 && <BotonCanvas />}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}
