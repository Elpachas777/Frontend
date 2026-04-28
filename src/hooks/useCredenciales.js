import { useEffect, useState } from "react";
import axios from "../utils/axios.js";

function getStoredUser() {
  try {
    const stored = localStorage.getItem("frontend_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function useCredenciales() {
  const [credencial, setCredencial] = useState("");
  const [usuario, setUsuario] = useState(() => getStoredUser() || {});
  const urlBack = import.meta.env.VITE_URL_BACKEND;

  useEffect(() => {
    const vertificar = async () => {
      try {
        const respuesta = await axios.get(`${urlBack}/credenciales`);
        if (respuesta?.data) {
          setCredencial(respuesta.data);
          return;
        }
      } catch (error) {
        console.log(error.response?.data ?? error.message);
      }

      const stored = getStoredUser();
      if (stored?.rol) {
        setCredencial(stored.rol);
        setUsuario(stored);
      }
    };

    vertificar();
  }, []);

  return {
    credencial,
    usuario,
  };
}

export default useCredenciales;
