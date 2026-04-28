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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { formData, handleChange } = useFormData("docente_login");

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
            src="/img/Login.jpeg"
            alt="Ilustración de inicio de sesión"
          />
        </div>

        <div className="login-card">
          <div className="login-topbar">
            <button
              type="button"
              className="btn-secondary btn-secondary--blue"
              onClick={() => navigate("/")}
            >
              Volver
            </button>
          </div>

          {mensaje && (
            <div className="login-message">
              <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />
            </div>
          )}

          <div className="login-body">
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
                  placeholder="tu@ipn.mx"
                  required
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>

              <div className="login-field password-field">
                <label htmlFor="password">Contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
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
    </div>
  );
}

export default Login;
