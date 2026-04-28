import { Link, useSearchParams } from "react-router-dom";
import "./RecuperarContra.css";
import "../components/button.css";
import useFormData from "../hooks/useFormData";
import { USUARIOS } from "../enums/tipoUsuarios";
import { useRecuperarContraseña } from "../api/sesion.api";
import { useState } from "react";
import Mensaje from "../components/Mensaje";

function RecuperarContra() {
  const [mensaje, setMensaje] = useState(null);
  const [searhParams] = useSearchParams();
  const { formData, handleChange } = useFormData(USUARIOS.CONTRASEÑA);
  const { handleSubmit } = useRecuperarContraseña(
    { formData, setMensaje },
    searhParams.get("token")
  );

  return (
    <div className="reset-page">
      <div className="reset-shell">

        {/* Panel formulario — izquierda */}
        <div className="reset-card">
          <div className="reset-topbar">
            <Link to="/login" className="btn-secondary btn-secondary--blue">
              ← Volver al inicio de sesión
            </Link>
          </div>

          {mensaje && (
            <div className="reset-message">
              <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />
            </div>
          )}

          <div className="reset-body">
            <div className="reset-header">
              <h1>Restablecer contraseña</h1>
              <p>Ingresa y confirma tu nueva contraseña.</p>
            </div>

            <form className="reset-form" onSubmit={handleSubmit}>
              <div className="reset-field">
                <label htmlFor="password">Nueva contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  value={formData.setPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="reset-field">
                <label htmlFor="confirmar">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmar"
                  name="confirmar"
                  placeholder="Repite tu contraseña"
                  required
                  value={formData.confirmar}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="reset-btn">
                Guardar nueva contraseña
              </button>
            </form>
          </div>
        </div>

        {/* Imagen — derecha */}
        <div className="reset-illustration">
          <img
            src="/img/Recuperar_link.jpeg"
            alt="Ilustración de restablecimiento de contraseña"
          />
        </div>

      </div>
    </div>
  );
}

export default RecuperarContra;
