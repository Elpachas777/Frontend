import { useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import mensaje from "../utils/mensajes.js";

const mensajeError = (error, mensajeDefault) => {
  return (
    error?.response?.data || {
      tipo: "error",
      mensaje: mensajeDefault,
    }
  );
};

export function useIniciarSesion({ formData, setAutentificado, setMensaje }) {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const respuesta = await axios.post("/iniciarSesion", formData);

      if (respuesta?.data?.ok) {
        setAutentificado(true);
        navigate("/inicio");
      }
    } catch (error) {
      await mensaje("Error al iniciar sesión", error.response.data);
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
      const respuesta = await axios.post("/recuperar", formData);
      setMensaje(respuesta.data);
    } catch (error) {
      setMensaje(
        mensajeError(error, "No se pudo enviar el correo de recuperación."),
      );
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
        setMensaje({
          tipo: "error",
          mensaje: "Las contraseñas no coinciden",
        });
        return;
      }

      const respuesta = await axios.post("/recuperarContra", {
        token,
        password,
      });

      setMensaje(respuesta.data);
    } catch (error) {
      setMensaje(mensajeError(error, "No se pudo recuperar la contraseña."));
    }
  };

  return {
    handleSubmit,
  };
}

export async function cerrarSesion({ setAutentificado }) {
  try {
    const respuesta = await axios.get("/cerrar");

    if (respuesta.data === "ok") {
      setAutentificado(false);
    }
  } catch (error) {
    console.log("Error al cerrar sesión:", error);
  }
}

const PREVIEW_PASSWORDS = {
  docente: "Docente123$",
  director: "Director123$",
  admin: "Admin123$",
};
