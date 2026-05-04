import { useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";

const urlBack = import.meta.env.VITE_URL_BACKEND;

export function useIniciarSesion({ formData, setAutentificado, setMensaje }) {
  const navigate = useNavigate();

  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@ipn\.mx$/;
    return regex.test(correo);
  };

  const validarContraseña = (password) => {
    // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

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

const PREVIEW_PASSWORDS = {
  docente: "Docente123$",
  director: "Director123$",
  admin: "Admin123$",
};
