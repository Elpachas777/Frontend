import Cuento from "./Cuento";
import Oracion from "./Oracion";

function Selector({ ejercicio, handleObjectChange }) {
  const ejercicios = {
    1: <Cuento ejercicio={ejercicio} handleObjectChange={handleObjectChange} />,
    2: (
      <Oracion ejercicio={ejercicio} handleObjectChange={handleObjectChange} />
    ),
  };

  return <>{ejercicios[ejercicio.id_tipo]}</>;
}

export default Selector;
