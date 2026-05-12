import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../utils/axios.js";

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
      console.log("Error al iniciar sesión:", error);

      // Caso especial: cuenta no verificada (403). Usamos Swal con un
      // mensaje más prominente porque es algo que el usuario debe atender.
      if (error?.response?.status === 403) {
        const datos = error.response.data || {};
        await Swal.fire({
          icon: "warning",
          title: "Cuenta no verificada",
          text:
            datos.mensaje ||
            "Tu cuenta aún no ha sido verificada. Habla con tu técnico para habilitarla.",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#7bc043",
        });
        return;
      }

      setMensaje(
        mensajeError(
          error,
          "No se pudo conectar con el backend. Contacta a tu técnico que revise CORS o Railway.",
        ),
      );
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
        mensajeError(
          error,
          "No se pudo enviar el correo de recuperación.",
        ),
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
      setMensaje(
        mensajeError(
          error,
          "No se pudo recuperar la contraseña.",
        ),
      );
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