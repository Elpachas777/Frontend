import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as alumnoApi from "../api/alumno.api";
import EjercicioPlayer from "../docente/EjercicioPlayer";
import "./EjercicioAlumno.css";

function EjercicioAlumno() {
  const { idAlumno } = useParams();
  const navigate = useNavigate();
  const [alumno, setAlumno] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [ejercicioActivo, setEjercicioActivo] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await alumnoApi.obtenerEjerciciosAlumno(idAlumno);
        setAlumno(data.alumno);
        setEjercicios(data.ejercicios || []);
      } catch {
        setError("No se encontró un alumno con ese ID. Verifica e intenta de nuevo.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [idAlumno]);

  if (cargando) {
    return (
      <div className="ea-fullscreen">
        <div className="ea-spinner" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ea-fullscreen">
        <div className="ea-error-box">
          <span className="ea-error-icon">✕</span>
          <p>{error}</p>
          <button className="ea-btn-back" onClick={() => navigate("/")}>
            Regresar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ea-page">
      <div className="ea-overlay" />
      <div className="ea-decor" />

      <div className="ea-topbar">
        <div className="ea-logo">
          <span className="ea-logo-sila">Sila</span>
          <span className="ea-logo-trazo">Trazo</span>
        </div>
      </div>

      <div className="ea-content">
        <div className="ea-welcome">
          <h1>
            Hola, <span className="ea-nombre">{alumno?.nombre || idAlumno}</span>
          </h1>
          <p>Estos son tus ejercicios asignados. ¡Elige uno para comenzar!</p>
        </div>

        {ejercicios.length === 0 ? (
          <div className="ea-empty">
            <p>No tienes ejercicios asignados por el momento.</p>
            <p>Pide a tu docente que te asigne uno.</p>
          </div>
        ) : (
          <div className="ea-grid">
            {ejercicios.map((ej) => (
              <button
                key={ej.id_ejercicio}
                className="ea-card"
                onClick={() => setEjercicioActivo(ej)}
              >
                <span className="ea-card-badge">
                  {ej.id_tipo === 1 ? "Cuento" : "Oración"}
                </span>
                <span className="ea-card-title">{ej.titulo}</span>
                <span className="ea-card-cta">Comenzar →</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {ejercicioActivo && (
        <EjercicioPlayer
          ejercicio={ejercicioActivo}
          onCerrar={() => setEjercicioActivo(null)}
        />
      )}
    </div>
  );
}

export default EjercicioAlumno;
