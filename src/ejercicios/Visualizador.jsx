import { useState } from "react";
import EjercicioPlayer from "../docente/EjercicioPlayer";
import MostrarEjercicio from "./MostrarEjercicio";
import Previsualizar from "./PevCuento";
import VerCuento from "./VerCuento";
import VerOracion from "./VerOracion";

function Visualizador({ tipo, ejercicio, onCerrar }) {
  const [previewing, setPreviewing] = useState(false);

  const ejercicios = {
    1: <VerCuento contenido={ejercicio.contenido} />,
    2: <VerOracion contenido={ejercicio.contenido} />,
  };

  if (previewing) {
    switch (Number(tipo)) {
      case 1:
        return (
          <Previsualizar onCerrar={() => setPreviewing(false)}>
            <MostrarEjercicio ejercicio={ejercicio} />
          </Previsualizar>
        );
      case 2:
        return (
          <EjercicioPlayer
            ejercicio={ejercicio}
            onCerrar={() => setPreviewing(false)}
          ></EjercicioPlayer>
        );
    }
  }

  return (
    <>
      {ejercicios[tipo]}
      <div className="modal-field">
        <button type="button" className="modal-btn-cancel" onClick={onCerrar}>
          Cerrar
        </button>
        <button className="modal-btn-save" onClick={() => setPreviewing(true)}>
          Vista previa del ejercicio
        </button>
      </div>
    </>
  );
}

export default Visualizador;
