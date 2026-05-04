import { useState } from "react";
import { DATOS } from "../enums/datosUsuarios";

function useFormData(tipo) {
  const [formData, setFormData] = useState(DATOS[tipo]);

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    if (type === "file") {
      const file = files[0];

      if (!file) return;

      setFormData((prev) => ({
        ...prev,
        [name]: file.name,
      }));

      const reader = new FileReader();

      reader.onload = (ev) => {
        setFormData((prev) => ({
          ...prev,
          [`${name}_muestra`]: ev.target.result,
        }));
      };
      reader.readAsDataURL(file);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    formData,
    setFormData,
    handleChange,
  };
}

export default useFormData;
