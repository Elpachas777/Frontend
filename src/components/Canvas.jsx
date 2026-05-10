import * as tf from "@tensorflow/tfjs";
import * as fabric from "fabric";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { dividirCanvas, predecir } from "../utils/modelo";
import "./Canvas.css";

const Canvas = forwardRef(({ silaba = "" }, ref) => {
  const [modelo, setModelo] = useState(null);
  const canvaRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    const cargarModelo = async () => {
      const modeloCargado = await tf.loadGraphModel("/model/model.json");
      setModelo(modeloCargado);
    };

    cargarModelo();
  }, []);

  useEffect(() => {
    if (!canvaRef.current) return;
    if (fabricRef.current) return;

    const canvas = new fabric.Canvas(canvaRef.current, {
      isDrawingMode: true,
    });

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 10;
    canvas.freeDrawingBrush.color = "black";

    fabricRef.current = canvas;

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  const handlePredecir = async () => {
    const letras = dividirCanvas(canvaRef.current);
    const resultadoIzq = predecir(modelo, letras[0]);
    const resultadoDer = predecir(modelo, letras[1]);
    document.getElementById("resultado").innerHTML =
      resultadoIzq + resultadoDer;
  };

  useImperativeHandle(ref, () => ({
    clear: () => fabricRef.current.clear(),
    getImage: () => canvasRef.current,
  }));

  return (
    <div className="canvas-col">
      {silaba && <span className="canvas-hint">{silaba}</span>}
      <div className="canvas-visualizacion">
        <canvas ref={canvaRef} height={200} width={200}></canvas>
      </div>
      <canvas id="canvas28" height={28} width={28} hidden></canvas>
    </div>
  );
});

export default Canvas;
