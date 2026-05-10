import Cuento from "./Cuento";
import Oracion from "./Oracion";

function Editor({ formData, handleObjectChange }) {
  const ejercicios = {
    1: (
      <Cuento
        ejercicio={formData}
        contenido={formData.contenido}
        handleObjectChange={handleObjectChange}
      />
    ),
    2: (
      <Oracion
        ejercicio={formData}
        contenido={formData.contenido}
        handleObjectChange={handleObjectChange}
      />
    ),
  };

  return <>{ejercicios[Number(formData.id_tipo)]}</>;
}

export default Editor;
