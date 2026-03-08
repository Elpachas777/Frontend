import { useState } from "react";
import "./Confirmar.css";
import Mensaje from "./Mensaje";

function Confirmar({ onCerrar, filaSeleccionada, Borrar, setActualizado }) {
  const [mensaje, setMensaje] = useState(null);

  const handleBorrar = async (event) => {
    event.preventDefault();

    try {
      const respuesta = await Borrar(filaSeleccionada.id);
      setMensaje(respuesta);
      setActualizado((prev) => !prev);
    } catch (error) {
      setMensaje(error.response.data);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal form-wrap crear-docente">
        {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
        <h1 className="title">
          ¿Esta seguro de que desea eliminar este elemento?
        </h1>
        <div className="modal-botones">
          <button
            className="guardar-btn"
            name="guardar"
            onClick={handleBorrar}
            style={{ marginTop: "20px" }}
          >
            Eliminar
          </button>
          <button
            type="button"
            className="cancelar-btn"
            onClick={onCerrar}
            style={{ marginTop: "20px" }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirmar;
