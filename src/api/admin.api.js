import axios from "../utils/axios.js";

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

      const respuesta = await axios.post(
        "http://localhost:4000/crearAdmin",
        datos
      );

      console.log(respuesta);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleSubmit,
  };
}
