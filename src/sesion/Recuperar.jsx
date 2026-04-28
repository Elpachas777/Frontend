import { Link } from "react-router-dom";
import "./Recuperar.css";
import "../components/button.css"; 
import useFormData from "../hooks/useFormData";
import { USUARIOS } from "../enums/tipoUsuarios";
import { useCorreoContraseña } from "../api/sesion.api";
import Mensaje from "../components/Mensaje";
import { useState } from "react";

function Recuperar() {
  const [mensaje, setMensaje] = useState(null);
  const { formData, handleChange } = useFormData(USUARIOS.RECUPERACION);
  const { handleSubmit } = useCorreoContraseña({ formData, setMensaje });

  return (
    <div className="recuperar-page">
      <div className="recuperar-shell">

        {/* Panel formulario — izquierda */}
        <div className="recuperar-card">
          <div className="recuperar-topbar">
            <Link
              to="/login"
              className="btn-secondary btn-secondary--blue"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>


          {mensaje && (
            <div className="recuperar-message">
              <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />
            </div>
          )}

          <div className="recuperar-body">
            <div className="recuperar-header">
              <h1>Recuperar contraseña</h1>
              <p>Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
            </div>

            <form className="recuperar-form" onSubmit={handleSubmit}>
              <div className="recuperar-field">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  placeholder="tu@correo.com"
                  required
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="recuperar-btn">
                Enviar enlace
              </button>
            </form>
          </div>
        </div>

        {/* Imagen — derecha */}
        <div className="recuperar-illustration">
          <img
            src="/img/Recuperar.jpeg"
            alt="Ilustración de recuperación de contraseña"
          />
        </div>

      </div>
    </div>
  );
}

export default Recuperar;
