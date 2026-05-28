import { useState } from "react";
import EjercicioPlayer from "../docente/EjercicioPlayer";
import VerCuento from "./VerCuento";
import VerOracion from "./VerOracion";

function Visualizador({ tipo, ejercicio, onCerrar }) {
  const [previewing, setPreviewing] = useState(false);

  const ejercicios = {
    1: <VerCuento contenido={ejercicio.contenido} />,
    2: <VerOracion contenido={ejercicio.contenido} />,
  };

  if (previewing) {
    return (
      <EjercicioPlayer
        ejercicio={ejercicio}
        soloVistaPrevia
        onCerrar={() => setPreviewing(false)}
      />
    );
  }

  return (
    <>
      {ejercicios[tipo]}

      <div className="modal-field">
        <button type="button" className="modal-btn-cancel" onClick={onCerrar}>
          Cerrar
        </button>

        <button
          type="button"
          className="modal-btn-save"
          onClick={() => setPreviewing(true)}
        >
          Vista previa del ejercicio
        </button>
      </div>
    </>
  );
}

export default Visualizador;
