import { Link, useSearchParams } from "react-router-dom";
import "./RecuperarContra.css";
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
      <div className="reset-card">
        {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
        <h1 className="reset-title">Restablecer contraseña</h1>
        <p className="reset-subtitle">Ingrese una nueva contraseña</p>

        <form className="reset-form" onSubmit={handleSubmit}>
          <label htmlFor="password" className="reset-label">
            Nueva contraseña
          </label>
          <input
            className="reset-input"
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            required
            value={formData.setPassword}
            onChange={handleChange}
          />

          <label htmlFor="confirmar" className="reset-label">
            Confirmar contraseña
          </label>
          <input
            className="reset-input"
            type="password"
            id="confirmar"
            name="confirmar"
            placeholder="Repite tu contraseña"
            required
            value={formData.confirmar}
            onChange={handleChange}
          />

          <button type="submit" className="reset-btn">
            Guardar nueva contraseña
          </button>
        </form>

        <div className="reset-links">
          <Link to="/Login">Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default RecuperarContra;
