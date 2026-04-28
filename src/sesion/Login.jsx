import { useState } from "react";
import { Link } from "react-router-dom";
import { useIniciarSesion } from "../api/sesion.api";
import Mensaje from "../components/Mensaje";
import { DATOS } from "../enums/datosUsuarios";
import useFormData from "../hooks/useFormData";
import "./Login.css";

function Login({ setAutentificado }) {
  const [mensaje, setMensaje] = useState(null);
  const { formData, handleChange } = useFormData(DATOS.docente_login);
  const { handleSubmit } = useIniciarSesion({
    formData,
    setAutentificado,
    setMensaje,
  });

  return (
    <div className="form-wrap">
      {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
      <h1 className="title">Iniciar sesión</h1>
      <form
        className="areas"
        onSubmit={handleSubmit}
        style={{ flexDirection: "column" }}
      >
        <div className="area">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            placeholder="tu@correo.com"
            required
            onChange={handleChange}
          />
        </div>

        <div className="area">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            requireder
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="corner-btn"
          name="iniciar"
          style={{ position: "static", marginTop: "20px" }}
        >
          Iniciar sesión
        </button>
      </form>

      <div className="login-links">
        <Link to="/Recuperar">¿Olvidaste tu contraseña?</Link>
      </div>
    </div>
  );
}

export default Login;
