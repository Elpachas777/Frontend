import * as fabric from "fabric";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import "./Canvas.css";

const Canvas = forwardRef(({ silaba = "" }, ref) => {
  const canvaRef = useRef(null);
  const fabricRef = useRef(null);

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

  useImperativeHandle(ref, () => ({
    clear: () => fabricRef.current.clear(),
    getImage: () => canvaRef.current,
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
