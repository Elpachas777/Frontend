import { useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";

export function useIniciarSesion({ formData, setAutentificado, setMensaje }) {
  const navigate = useNavigate();
  const urlBack = import.meta.env.VITE_URL_BACKEND;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const respuesta = await axios.post(`${urlBack}/iniciarSesion`, formData);

      if (respuesta) {
        setAutentificado(true);
        navigate("/inicio");
      }
    } catch (error) {
      setMensaje(error.response.data);
    }
  };

  return {
    handleSubmit,
  };
}

export function useCorreoContraseña({ formData, setMensaje }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const respuesta = await axios.post(`${urlBack}/recuperar`, formData);
      setMensaje(respuesta.data);
    } catch (error) {
      setMensaje(error.response.data);
    }
  };

  return {
    handleSubmit,
  };
}

export function useRecuperarContraseña({ formData, setMensaje }, token) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { password } = formData;
      const { confirmar } = formData;

      if (password !== confirmar) {
        setMensaje({ tipo: "error", mensaje: "Las contraseñas no coinciden" });
        return;
      }

      const respuesta = await axios.post(`${urlBack}/recuperarContra`, {
        token,
        password,
      });
      setMensaje(respuesta.data);
    } catch (error) {
      setMensaje(error.response.data);
    }
  };

  return {
    handleSubmit,
  };
}

export async function cerrarSesion({ setAutentificado }) {
  try {
    const respuesta = await axios.get(`${urlBack}/cerrar`);
    if (respuesta.data === "ok") setAutentificado(false);
  } catch (error) {
    console.log(error);
  }
}
