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

      {/* Topbar con btn esquina superior derecha */}
      <div className="landing-topbar">
        <button className="landing-button" onClick={handleClick}>
          ¿Eres docente?
        </button>
      </div>

      <div className="landing-content">
        <div className="landing-copy">
          <h1 className="landing-heading">
            <span className="landing-heading-sila">Sila</span><span className="landing-heading-trazo">Trazo</span>
          </h1>
          <p className="landing-copy-text">
            Para comenzar, ingresa el ID del estudiante que realizará el ejercicio.
          </p>

          <div className="landing-card">
            <label htmlFor="id">ID de clase</label>
            <div className="landing-input-row">
              <input
                className="landing-input"
                type="text"
                id="id"
                placeholder="CR3CV4-09"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
