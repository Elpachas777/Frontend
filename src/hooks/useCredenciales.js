import { useEffect, useState } from "react";
import axios from "../utils/axios.js";

function useCredenciales() {
  const [credencial, setCredencial] = useState("");
  const urlBack = import.meta.env.VITE_URL_BACKEND;

  useEffect(() => {
    const vertificar = async () => {
      try {
        const respuesta = await axios.get(`${urlBack}/credenciales`);
        if (respuesta) setCredencial(respuesta.data.rol);
      } catch (error) {
        console.log(error.response.data);
        setCredencial("");
      }
    };

    vertificar();
  }, []);

  return {
    credencial,
  };
}

export default useCredenciales;
