import { useEffect, useState } from "react";
import axios from "../utils/axios.js";

function useAuth() {
  const [autentificado, setAutentificado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificar = async () => {
      try {
        const respuesta = await axios.get("/autentificado");

        // Solo marcamos como autenticado si la respuesta es 2xx Y tiene datos
        // de usuario válidos. Antes se marcaba como autenticado por cualquier
        // respuesta truthy, lo cual dejaba al usuario "logueado" en un estado
        // inconsistente cuando el backend respondía vacío.
        if (
          respuesta?.status >= 200 &&
          respuesta?.status < 300 &&
          respuesta?.data &&
          respuesta.data.id
        ) {
          setAutentificado(true);
        } else {
          setAutentificado(false);
        }
      } catch (error) {
        // 401, error de red o backend caído → no autenticado.
        setAutentificado(false);
      } finally {
        setCargando(false);
      }
    };

    verificar();
  }, []);

  return {
    autentificado,
    cargando,
    setAutentificado,
  };
}

export default useAuth;