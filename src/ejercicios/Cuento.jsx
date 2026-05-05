import { useState } from "react";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import { crear, crearCuento } from "../utils/ejercicio";
import MostrarEjercicio from "./MostrarEjercicio";
import Previsualizar from "./PevCuento";

function Cuento() {
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);

  const [palabrasObj, setPalabrasObj] = useState([]);
  const [previewing, setPreviewing] = useState(false);

  const { formData, handleChange } = useFormData(USUARIOS.EJERCICIO);

  const [ejercicio, setEjercicio] = useState(null);
  const [canvasState, setCanvas] = useState(null);
  const { handleSubmit } = crear({
    formData,
    setErrores,
    setMensaje,
  });

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
    <>
      <div className="modal-field">
        <label>Silaba</label>
        <input type="text" id="silaba" placeholder="Ej. Ca, Pe, Mi, Bo" />
      </div>

      <div className="modal-field">
        <textarea
          rows={3}
          id="cuento"
          placeholder="Ej. Había una vez una dulce niña que quería mucho a su madre y a su abuela..."
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
