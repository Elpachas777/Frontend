import { useEffect, useState } from "react";
import axios from "../utils/axios.js";

function useAuth() {
  const [autentificado, setAutentificado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const vertificar = async () => {
      try {
        const respuesta = await axios.get("/autentificado");
        if (respuesta) setAutentificado(true);
      } catch (error) {
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
