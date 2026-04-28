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
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { correo, password } = formData;

    // Validar correo
    if (!validarCorreo(correo)) {
      setMensaje({
        tipo: "error",
        mensaje: "El correo debe terminar en @ipn.mx"
      });
      return;
    }

    // Validar contraseña
    if (!validarContraseña(password)) {
      setMensaje({
        tipo: "error",
        mensaje: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)"
      });
      return;
    }

    const previewMode = import.meta.env.DEV || import.meta.env.VITE_PREVIEW_MODE === "true";

    // Simulación temporal: verificar credenciales específicas
    if (correo === "docente@ipn.mx" && password === "Docente123$") {
      const usuario = {
        nombre: "Docente IPN",
        rol: "docente",
        foto: null,
      };
      localStorage.setItem("frontend_user", JSON.stringify(usuario));
      setAutentificado(true);
      navigate("/preview/docente/alumnos");
      return;
    }

    if (correo === "director@ipn.mx" && password === "Director123$") {
      const usuario = {
        nombre: "Director IPN",
        rol: "director",
        foto: null,
      };
      localStorage.setItem("frontend_user", JSON.stringify(usuario));
      setAutentificado(true);
      navigate("/preview/docente/alumnos");
      return;
    }

    // Si no coincide, mostrar mensaje de error
    setMensaje({
      tipo: "error",
      mensaje: "El correo no está registrado, contacta a soporte"
    });
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

export async function verificarContraseña(password) {
  const previewMode =
    import.meta.env.DEV || import.meta.env.VITE_PREVIEW_MODE === "true";

  if (previewMode) {
    try {
      const stored = JSON.parse(
        localStorage.getItem("frontend_user") || "null"
      );
      return password === PREVIEW_PASSWORDS[stored?.rol];
    } catch {
      return false;
    }
  }

  try {
    const res = await axios.post(`${urlBack}/verificarContraseña`, {
      password,
    });
    return res.data?.valido === true;
  } catch {
    return false;
  }
}
