import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const [idAlumno, setIdAlumno] = useState("");

  const handleDocente = () => {
    navigate("/Login", { replace: true });
  };

  const handleComenzar = (e) => {
    e.preventDefault();
    const id = idAlumno.trim();
    if (!id) return;
    navigate(`/alumno/${id}`);
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

      <div className="landing-topbar">
        <button className="landing-button" onClick={handleDocente}>
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

          <form className="landing-card" onSubmit={handleComenzar}>
            <label htmlFor="id">ID de clase</label>
            <div className="landing-input-row">
              <input
                className="landing-input"
                type="text"
                id="id"
                placeholder="CR3CV4-09"
                value={idAlumno}
                onChange={(e) => setIdAlumno(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" className="landing-button landing-submit-btn">
                Comenzar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
