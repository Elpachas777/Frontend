import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useRecuperarContraseña } from "../api/sesion.api";
import "../components/button.css";
import Mensaje from "../components/Mensaje";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import "./RecuperarContra.css";

// Validación: mínimo 8 caracteres, al menos una mayúscula, un número y
// un carácter especial. Mismas reglas que registroDocente.
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#\-])[A-Za-z\d@$!%*?&_#\-]{8,}$/;

function RecuperarContra() {
  const [mensaje, setMensaje] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState({});
  const [searhParams] = useSearchParams();
  const { formData, handleChange } = useFormData(USUARIOS.CONTRASEÑA);
  const { handleSubmit: handleSubmitOriginal } = useRecuperarContraseña(
    { formData, setMensaje },
    searhParams.get("token"),
  );

  // Validamos antes de delegar al submit original (que hace la petición).
  const handleSubmit = (event) => {
    event.preventDefault();
    const errores = {};

    if (!formData.password) {
      errores.password = "La contraseña es obligatoria.";
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      errores.password =
        "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial (@$!%*?&_#-).";
    }

    if (!formData.confirmar) {
      errores.confirmar = "Confirma tu contraseña.";
    } else if (formData.password !== formData.confirmar) {
      errores.confirmar = "Las contraseñas no coinciden.";
    }

    setErroresValidacion(errores);

    if (Object.keys(errores).length > 0) {
      return;
    }

    // Si pasa la validación local, dejamos que el flujo original
    // mande la petición al backend.
    handleSubmitOriginal(event);
  };

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
              <p
                style={{
                  fontSize: "0.85em",
                  color: "#666",
                  margin: "8px 0 0",
                }}
              >
                Debe tener al menos 8 caracteres, una mayúscula, un número y un
                carácter especial.
              </p>
            </div>

            <form className="reset-form" onSubmit={handleSubmit} noValidate>
              <div className="reset-field">
                <label htmlFor="password">Nueva contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password || ""}
                  onChange={handleChange}
                  aria-invalid={Boolean(erroresValidacion.password)}
                />
                {erroresValidacion.password && (
                  <span
                    style={{
                      color: "#c62828",
                      fontSize: "0.85em",
                      marginTop: 4,
                      display: "block",
                    }}
                  >
                    {erroresValidacion.password}
                  </span>
                )}
              </div>

              <div className="reset-field">
                <label htmlFor="confirmar">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmar"
                  name="confirmar"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmar || ""}
                  onChange={handleChange}
                  aria-invalid={Boolean(erroresValidacion.confirmar)}
                />
                {erroresValidacion.confirmar && (
                  <span
                    style={{
                      color: "#c62828",
                      fontSize: "0.85em",
                      marginTop: 4,
                      display: "block",
                    }}
                  >
                    {erroresValidacion.confirmar}
                  </span>
                )}
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