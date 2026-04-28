import * as tf from "@tensorflow/tfjs";
import * as fabric from "fabric";
import { useEffect, useRef, useState } from "react";
import { dividirCanvas, predecir } from "../utils/modelo";
import "./Modal.css";

function Canvas({ onCerrar }) {
  const [modelo, setModelo] = useState(null);
  const canvaRef = useRef(null);
  const [canvasState, setCanvas] = useState(null);

  useEffect(() => {
    const cargarModelo = async () => {
      const modeloCargado = await tf.loadGraphModel("/model/model.json");
      setModelo(modeloCargado);
    };

    cargarModelo();
  }, []);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvaRef.current, {
      height: 200,
      width: 200,
      isDrawingMode: true,
    });

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 10;
    canvas.freeDrawingBrush.color = "black";

    setCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const handlePredecir = async () => {
    const letras = dividirCanvas(canvaRef.current);
    const resultadoIzq = predecir(modelo, letras[0]);
    const resultadoDer = predecir(modelo, letras[1]);
    document.getElementById("resultado").innerHTML =
      resultadoIzq + resultadoDer;
  };

  return (
    <div className="modal-overlay">
      <div className="modal form-wrap">
        <canvas ref={canvaRef} style={{ border: "1px solid black" }}></canvas>
        <canvas
          id="canvas28"
          style={{ border: "1px solid black" }}
          height={28}
          width={28}
          hidden
        ></canvas>
        <div className="modal-botones">
          <br />
          <button type="button" onClick={handlePredecir}>
            Terminar Ejercicio
          </button>
          <button type="button" onClick={() => canvasState.clear()}>
            Limpíar Canvas
          </button>
          <button type="button" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
        <div id="resultado"></div>
      </div>
    </div>
  );
}

export default Canvas;
