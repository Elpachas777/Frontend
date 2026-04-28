import { useState } from "react";
import { crearCuento, guardar } from "../utils/ejercicio";
import MostrarEjercicio from "./MostrarEjercicio";
import Previsualizar from "./PevCuento";

function CrearCuentos() {
  const col = 80;
  const row = 40;

  const [ejercicio, setEjercicio] = useState(null);
  const [canvasState, setCanvas] = useState(null);
  const { handleSubmit } = guardar();

  const guardarEjercicio = () => {
    const ejercicioNuevo = crearCuento();
    setEjercicio(ejercicioNuevo);
    return ejercicioNuevo;
  };

  const handlePrevisualizar = () => {
    guardarEjercicio();
    setCanvas(true);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          guardarEjercicio();
          handleSubmit(e, ejercicio);
        }}
      >
        <p>Escribe o copia el cuento</p>

        <label for="titulo">Titulo</label>
        <input type="text" id="titulo" />
        <br />

        <label for="silaba">Silaba</label>
        <input type="text" id="silaba" />
        <br />
        <br />

        <label for="fi">Fecha Inicio</label>
        <input type="datetime-local" id="fi" />
        <br />
        <br />

        <label for="ff">Fecha Final</label>
        <input type="datetime-local" id="ff" />
        <br />
        <br />

        <textarea cols={col} rows={row} id="cuento"></textarea>
        <br />

        <button type="button" onClick={handlePrevisualizar}>
          Previsualizar
        </button>

        {canvasState && (
          <Previsualizar
            onCerrar={() => {
              setCanvas(false);
            }}
          >
            <MostrarEjercicio ejercicio={ejercicio} />
          </Previsualizar>
        )}
      </form>
    </div>
  );
}

export default CrearCuentos;
