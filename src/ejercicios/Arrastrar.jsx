import { useState } from "react";
import BotonCanvas from "../components/BotonCanvas";

function Arrastrar() {
  const [elementos, setElementos] = useState(["Man", "za", "na"]);
  const [indice, setIndice] = useState(null); 

  const handleDrop = (index) => {
    const reOrden = [...elementos];
    const elemento = reOrden[indice];

    reOrden.splice(indice, 1);
    reOrden.splice(index, 0, elemento);

    setElementos(reOrden);
    setIndice(null);
  };

  return (
    <div style={{ display: "flex" }}>
      {elementos.map((elemento, index) => (
        <div
          key={index}
          draggable
          onDragStart={() => setIndice(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(index)}
          style={{
            padding: "10px",
            margin: "5px",
            background: "lightblue",
            cursor: "grab",
          }}
        >
          <BotonCanvas Texto={elemento} />
        </div>
      ))}
    </div>
  );
}

export default Arrastrar;
