import Cuento from "./Cuento";
import Oracion from "./Oracion";

function Selector({ tipo, ejercicio }) {
  const ejercicios = {
    Oración: <Oracion ejercicio={ejercicio} />,
    Cuento: <Cuento />,
  };

  return <>{ejercicios[tipo] || <></>}</>;
}

export default Selector;
