import { useEffect, useState } from "react";
import { crearCuento } from "../utils/ejercicio";
import MostrarEjercicio from "./MostrarEjercicio";
import Previsualizar from "./PevCuento";

function Cuento({ ejercicio, contenido, handleObjectChange }) {
  const [cuento, setCuento] = useState(null);
  const [silaba, setSilaba] = useState(null);
  const [canvasState, setCanvas] = useState(null);

  const handlePrevisualizar = () => {
    setCanvas(true);
  };

  useEffect(() => {
    if (!contenido) return;
    setSilaba(contenido.silaba);
    setCuento(contenido.cuento);
  }, []);

  useEffect(() => {
    const contenido = {
      silaba,
      cuento,
      modificado: cuento ? crearCuento(silaba, cuento) : "",
    };

    handleObjectChange("contenido", contenido);
  }, [cuento, silaba]);

  return (
    <>
      <div className="modal-field">
        <label>Silaba</label>
        <input
          type="text"
          name="silaba"
          placeholder="Ej. Ca, Pe, Mi, Bo"
          value={silaba}
          onChange={(e) => setSilaba(e.currentTarget.value)}
        />
      </div>

      <div className="modal-field">
        <textarea
          rows={3}
          name="cuento"
          placeholder="Ej. Había una vez una dulce niña que quería mucho a su madre y a su abuela..."
          value={cuento}
          onChange={(e) => setCuento(e.currentTarget.value)}
        ></textarea>
      </div>

      <div className="modal-field">
        <button
          type="button"
          className="btn-prev"
          onClick={handlePrevisualizar}
        >
          Previsualizar
        </button>
      </div>

      {canvasState && (
        <Previsualizar
          onCerrar={() => {
            setCanvas(false);
          }}
        >
          <MostrarEjercicio ejercicio={ejercicio} />
        </Previsualizar>
      )}
    </>
  );
}

export default Cuento;
