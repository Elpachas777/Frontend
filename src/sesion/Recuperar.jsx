import { Link } from "react-router-dom";
import "./Recuperar.css";
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
    <div className="form-wrap recuperar-form">
      {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
      <h1 className="title">Recuperar contraseña</h1>
      <p className="subtitle">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer
        tu contraseña.
      </p>

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
            value={formData.correo}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="corner-btn"
          style={{ position: "static", marginTop: "20px" }}
        >
          Enviar enlace
        </button>
      </form>

      <div className="recuperar-links">
        <Link to="/Login">Volver al inicio de sesión</Link>
      </div>
    </div>
  );
}

export default Recuperar;
