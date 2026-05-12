import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";
import "../RolAdmin/RolAdmin.css";
import mensaje from "../utils/mensajes";
import { dividirCanvas, predecir } from "../utils/modelo";
import Canvas from "./Canvas";

function BotonCanvas({ Texto = "__" }) {
  const [modelo, setModelo] = useState();
  const canvaRef = useRef();
  const [mostrarCanvas, setCanvas] = useState(false);

  useEffect(() => {
    const cargarModelo = async () => {
      const modeloCargado = await tf.loadGraphModel("/model/model.json");
      setModelo(modeloCargado);
    };

    cargarModelo();
  }, []);

  const handlePredecir = (canvas) => {
    const letras = dividirCanvas(canvas);
    const resultadoIzq = predecir(modelo, letras[0]);
    const resultadoDer = predecir(modelo, letras[1]);

    const procentajeTotal =
      (resultadoIzq.porcentaje + resultadoDer.porcentaje) / 2;

    mensaje(
      "Resultado: " +
        resultadoIzq.letra +
        resultadoDer.letra +
        " - " +
        procentajeTotal.toFixed(2) +
        "%",
      {
        tipo: "info",
        mensaje: "Sigue asi",
      },
    );
  };

  return (
    <>
      <button type="button" onClick={() => setCanvas(true)}>
        {Texto}
      </button>
      {mostrarCanvas && (
        <div className="modal-overlay">
          <div
            className="modal-card modal-card--wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Escribe la silaba</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setCanvas(false)}
              >
                ✕
              </button>
            </div>

            <Canvas ref={canvaRef} />
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn-save"
                onClick={() => handlePredecir(canvaRef.current.getImage())}
              >
                Predecir
              </button>
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={() => canvaRef.current.clear()}
              >
                limpiar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BotonCanvas;
