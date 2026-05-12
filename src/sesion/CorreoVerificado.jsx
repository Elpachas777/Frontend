import { useNavigate } from "react-router-dom";
import "./CorreoVerificado.css";

function CorreoVerificado() {
  const navigate = useNavigate();

  return (
    <div className="cv-page">
      <div className="cv-card">
        <div className="cv-icon-wrap">
          <svg
            className="cv-check"
            viewBox="0 0 52 52"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle className="cv-check-circle" cx="26" cy="26" r="25" />
            <path
              className="cv-check-mark"
              d="M14 27 l8 8 l16 -18"
              fill="none"
            />
          </svg>
        </div>

        <h1 className="cv-title">¡Usuario verificado!</h1>
        <p className="cv-text">
          Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión
          en la plataforma con tu correo y contraseña.
        </p>

        <button
          type="button"
          className="cv-btn"
          onClick={() => navigate("/Login")}
        >
          Ir al inicio de sesión
        </button>
      </div>
    </div>
  );
}

export default CorreoVerificado;
