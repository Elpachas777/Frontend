import { useEffect, useState } from "react";
import axios from "../utils/axios.js";

function useCredenciales() {
  const [credencial, setCredencial] = useState({});

  useEffect(() => {
    const vertificar = async () => {
      try {
        const respuesta = await axios.get("/credenciales");
        if (respuesta) setCredencial(respuesta.data);
      } catch (error) {
        setCredencial({ rol: "", nombre: "" });
      }
    };

    vertificar();
  }, []);

  return {
    credencial,
  };
}

export default useCredenciales;
