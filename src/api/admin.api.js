import axios from "../utils/axios.js";

export function useRegistrarAdmin({ formData }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const datos = {
        nombres: formData.nombres,
        apellido: formData.apellidos,
        correo: formData.correo,
        contraseña: formData.password,
      };

      await axios.post("/crearAdmin", datos);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleSubmit,
  };
}

export const verificarContraseña = async (data) => {
  const res = await axios.post("/verificarPassword", data);

  console.log(res.data);
  return res.data;
};
