import { useState } from "react";
import Canvas from "./Canvas";

function BotonCanvas() {
  const [mostrarCanvas, setCanvas] = useState(false);
  const handleMostrar = () => {
    setCanvas(true);
  };

  return (
    <>
      <button onClick={handleMostrar}>__</button>
      {mostrarCanvas && <Canvas onCerrar={() => setCanvas(false)} />}
    </>
  );
}

export default BotonCanvas;
