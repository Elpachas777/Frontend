import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import "../components/button.css";
import useFormData from "../hooks/useFormData";
import { DATOS } from "../enums/datosUsuarios";
import { useIniciarSesion } from "../api/sesion.api";
import Mensaje from "../components/Mensaje";
import { useState } from "react";

function Login({ setAutentificado }) {
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();
  const { formData, handleChange } = useFormData(DATOS.docente_login);

  const { handleSubmit } = useIniciarSesion({
    formData,
    setAutentificado,
    setMensaje,
  });

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-illustration">
          <img
            src="/img/login.png"
            alt="Ilustración de inicio de sesión"
          />
        </div>

        <div className="login-card">
          {mensaje && (
            <div className="login-message">
              <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />
            </div>
          )}

          <div className="login-topbar">
            <button
              type="button"
              className="btn-secondary btn-secondary--blue"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
          </div>

          <div className="login-header">
            <h1>Iniciar sesión</h1>
            <p>Accede con tu correo y contraseña</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
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

            <div className="login-field">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="login-btn" name="iniciar">
              Iniciar sesión
            </button>
          </form>

          <div className="login-links">
            <Link to="/Recuperar">¿Olvidaste tu contraseña?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;