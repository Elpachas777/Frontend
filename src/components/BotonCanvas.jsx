import { useRef, useState } from "react";
import Canvas from "./Canvas";

function BotonCanvas({ Texto = "__" }) {
  const canvaRef = useRef();
  const [mostrarCanvas, setCanvas] = useState(false);
  const handleMostrar = () => {
    setCanvas(true);
  };

  return (
    <>
      <button type="button" onClick={handleMostrar}>
        {Texto}
      </button>
      {mostrarCanvas && (
        <div>
          <Canvas ref={canvaRef} />
          <button type="button" onClick={() => canvaRef.current.clear()}>
            limpiar
          </button>
        </div>
      )}
    </>
  );
}

export default BotonCanvas;
