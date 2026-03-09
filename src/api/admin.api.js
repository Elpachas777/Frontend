import axios from "../utils/axios.js";

export function useRegistrarAdmin({ formData }) {
  const handleSubmit = async (event) => {
    const urlBack = import.meta.env.VITE_URL_BACKEND;
    event.preventDefault();
    try {
      const datos = {
        nombres: formData.nombres,
        apellido: formData.apellidos,
        correo: formData.correo,
        password: formData.password,
      };
      const respuesta = await axios.post(`${urlBack}/crearAdmin`, datos);

      console.log(respuesta);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleSubmit,
  };
}
