import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Login", { replace: true });
  };

  return (
    <div className="landing-page">
      <video
        className="landing-video"
        src="/video/Landing.mp4"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        disablePictureInPicture
        onPause={(event) => event.target.play()}
      />

      <div className="landing-overlay" />
      <div className="landing-decor" />
      <div className="landing-decor small" />

      <div className="landing-content">
        <div className="landing-copy">
          <span className="landing-badge">Aprender y organizar</span>
          <h1 className="landing-heading">
            Una plataforma elegante para el aula moderna
          </h1>
          <p className="landing-copy-text">
            Gestiona grupos, alumnos y sesiones desde un solo lugar. Ingresa el
            ID de clase o inicia sesión como docente para empezar.
          </p>

          <div className="landing-card">
            <label htmlFor="id">ID de clase</label>
            <div className="landing-input-row">
              <input
                className="landing-input"
                type="text"
                id="id"
                placeholder="3BC"
              />
              <button className="landing-button" onClick={handleClick}>
                ¿Eres docente?
              </button>
            </div>
            <p className="landing-note">
              El video se reproduce en bucle sin controles ni volumen para una
              experiencia limpia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
