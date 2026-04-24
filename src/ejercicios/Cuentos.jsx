import { useState } from "react";
import sustituir from "../utils/sustituir";
import MostrarEjercicio from "./MostrarEjercicio";
import Previsualizar from "./PevCuento";

function CrearCuentos() {
  const col = 80;
  const row = 40;

  const [ejercicio, setEjercicio] = useState(null);
  const [canvasState, setCanvas] = useState(null);

  const handlePrevisualizar = () => {
    const ejercicioNuevo = sustituir();
    setEjercicio(ejercicioNuevo);
    setCanvas(true);
  };

  return (
    <div>
      <br />
      <p>Escribe o copia el cuento</p>

      <label>Titulo</label>
      <input type="text" id="titulo" />
      <br />

      <label>Silaba</label>
      <input type="text" id="silaba" />
      <br />
      <br />

      <textarea cols={col} rows={row} id="cuento"></textarea>
      <br />
      <button onClick={handlePrevisualizar}>Previsualizar</button>
      {canvasState && (
        <Previsualizar
          onCerrar={() => {
            setCanvas(false);
          }}
        >
          <MostrarEjercicio ejercicio={ejercicio} />
        </Previsualizar>
      )}
    </div>
  );
}

export default CrearCuentos;
