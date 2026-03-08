import { useEffect, useState } from "react";
import axios from "../utils/axios.js";

function useCredenciales() {
  const [credencial, setCredencial] = useState("");

  useEffect(() => {
    const vertificar = async () => {
      try {
        const respuesta = await axios.get("http://localhost:4000/credenciales");
        if (respuesta) setCredencial(respuesta.data);
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
