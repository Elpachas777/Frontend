import axios from "../utils/axios.js";

const urlBack = import.meta.env.VITE_URL_BACKEND;

export function useRegistrarAdmin({ formData }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const datos = {
        nombres: formData.nombres,
        apellido: formData.apellidos,
        correo: formData.correo,
        password: formData.password,
      };

      await axios.post(`${urlBack}/crearAdmin`, datos);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleSubmit,
  };
}

export const verificarContraseña = async (data) => {
  const res = await axios.post(`${urlBack}/verificarPassword`, data, {
    withCredentials: true,
  });

  console.log(res.data);
  return res.data;
};
