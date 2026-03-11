import { useEffect, useState } from "react";
import axios from "../utils/axios.js";

function useAuth() {
  const [autentificado, setAutentificado] = useState(false);
  const urlBack = import.meta.env.VITE_URL_BACKEND;

  useEffect(() => {
    const vertificar = async () => {
      try {
        const respuesta = await axios.get(`${urlBack}/autentificado`);
        if (respuesta) setAutentificado(true);
      } catch (error) {
        console.log(error.response.data);
        setAutentificado(false);
      }
    };

    vertificar();
  }, []);

  return {
    autentificado,
    setAutentificado,
  };
}

export default useAuth;
