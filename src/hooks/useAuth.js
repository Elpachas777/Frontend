import { useEffect, useState } from "react";
import axios from "../utils/axios.js";

function useAuth() {
  const [autentificado, setAutentificado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const urlBack = import.meta.env.VITE_URL_BACKEND;

  useEffect(() => {
    const vertificar = async () => {
      try {
        const respuesta = await axios.get(`${urlBack}/autentificado`);

        let autenticado = false;
        if (typeof respuesta?.data?.autenticado !== "undefined") {
          autenticado = respuesta.data.autenticado;
        } else if (typeof respuesta?.data === "boolean") {
          autenticado = respuesta.data;
        } else if (typeof respuesta?.data === "string") {
          autenticado = respuesta.data.toLowerCase() === "true";
        }

        setAutentificado(Boolean(autenticado));
      } catch (error) {
        console.log(error.response?.data ?? error.message);
        setAutentificado(false);
      } finally {
        setCargando(false);
      }
    };

    vertificar();
  }, []);

  return {
    autentificado,
    cargando,
    setAutentificado,
  };
}

export default useAuth;
