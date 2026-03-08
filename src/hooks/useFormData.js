import { useState } from "react";
import { DATOS } from "../enums/datosUsuarios";

function useFormData(tipo) {
  const [formData, setFormData] = useState(DATOS[tipo]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    formData,
    setFormData,
    handleChange,
  };
}

export default useFormData;
