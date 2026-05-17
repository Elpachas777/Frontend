import { useState } from "react";
import { DATOS } from "../enums/datosUsuarios";

function useFormData(tipo) {
  const [formData, setFormData] = useState(DATOS[tipo]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      foto: file,
      fotoPreview: URL.createObjectURL(file),
    }));
  };

  const handleObjectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleFileChange,
    handleObjectChange,
  };
}

export default useFormData;
