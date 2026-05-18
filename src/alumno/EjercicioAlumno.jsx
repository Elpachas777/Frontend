import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as alumnoApi from "../api/alumno.api";
import * as respuestaApi from "../api/respuesta.api";
import EjercicioPlayer from "../docente/EjercicioPlayer";
import EjercicioPalabraPlayer from "./EjercicioPalabraPlayer";
import "./EjercicioAlumno.css";

/**
 * Devuelve el label legible para el badge según id_tipo.
 *  1 = Cuento, 2 = Oración, 3 = Palabra revuelta
 */
function nombreTipo(idTipo) {
  switch (idTipo) {
    case 1:
      return "Cuento";
    case 2:
      return "Oración";
    case 3:
      return "Palabra revuelta";
    default:
      return "Ejercicio";
  }
}

function EjercicioAlumno() {
  const { idAlumno } = useParams();
  const navigate = useNavigate();

  const [alumno, setAlumno] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [ejercicioActivo, setEjercicioActivo] = useState(null);
  const [silabasDificiles, setSilabasDificiles] = useState([]);

  const cargarDatos = useCallback(
    async ({ mostrarCarga = false } = {}) => {
      try {
        if (mostrarCarga) {
          setCargando(true);
        }

        setError(null);

        const data = await alumnoApi.obtenerEjerciciosAlumno(idAlumno);

        setAlumno(data.alumno);
        setEjercicios(data.ejercicios || []);

        try {
          const dificiles =
            await respuestaApi.obtenerSilabasDificiles(idAlumno);
          setSilabasDificiles(dificiles.silabas || []);
        } catch {
          setSilabasDificiles([]);
        }
      } catch {
        setError(
          "No se encontró un alumno con ese ID. Verifica e intenta de nuevo.",
        );
      } finally {
        if (mostrarCarga) {
          setCargando(false);
        }
      }
    },
    [idAlumno],
  );

  useEffect(() => {
    cargarDatos({ mostrarCarga: true });
  }, [cargarDatos]);

  const handleCerrarPlayer = async () => {
    setEjercicioActivo(null);
    await cargarDatos();
  };

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
          <span className="ea-logo-trazo">bando</span>
        </div>
        <button
          className="ea-btn-inicio"
          onClick={() => navigate("/")}
          title="Volver al inicio"
        >
          Inicio
        </button>
      </div>

      <div className="ea-content">
        <div className="ea-welcome">
          <h1>
            Hola,{" "}
            <span className="ea-nombre">{alumno?.nombre || idAlumno}</span>
          </h1>
          <p>Estos son tus ejercicios asignados. ¡Elige uno para comenzar!</p>
        </div>

        {silabasDificiles.length > 0 && (
          <div className="ea-dificiles">
            <h2 className="ea-dificiles-title">Sílabas para practicar más</h2>
            <p className="ea-dificiles-sub">
              Estas son las sílabas en las que tu precisión es menor. ¡Sigue
              practicando!
            </p>

            <div className="ea-dificiles-grid">
              {silabasDificiles.map((s) => (
                <div className="ea-dificil-card" key={s.silaba}>
                  <span className="ea-dificil-silaba">{s.silaba}</span>
                  <span className="ea-dificil-precision">
                    {Number(s.precision || 0).toFixed(1)}%
                  </span>
                  <span className="ea-dificil-intentos">
                    {s.intentos} intento{s.intentos === 1 ? "" : "s"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {ejercicios.length === 0 ? (
          <div className="ea-empty">
            <p>No tienes ejercicios pendientes por el momento.</p>
            <p>Cuando tu docente asigne uno nuevo, aparecerá aquí.</p>
          </div>
        ) : (
          <div className="ea-grid">
            {ejercicios.map((ej) => {
              const vencido = ej.vencido;
              const noIniciado = ej.no_iniciado;
              return (
                <button
                  key={ej.id_ejercicio}
                  className={`ea-card${vencido ? " ea-card--vencido" : ""}${noIniciado ? " ea-card--no-iniciado" : ""}`}
                  onClick={() => {
                    if (vencido || noIniciado) return;
                    setEjercicioActivo(ej);
                  }}
                  disabled={vencido || noIniciado}
                >
                  <span className="ea-card-badge">{nombreTipo(ej.id_tipo)}</span>
                  {vencido && (
                    <span className="ea-card-vencido-badge">Vencido</span>
                  )}
                  {noIniciado && !vencido && (
                    <span className="ea-card-pronto-badge">Próximamente</span>
                  )}
                  <span className="ea-card-title">{ej.titulo}</span>
                  {ej.fecha_final && (
                    <span className="ea-card-fecha">
                      {vencido ? "Venció" : "Vence"}:{" "}
                      {new Date(ej.fecha_final).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {!vencido && !noIniciado && (
                    <span className="ea-card-cta">Comenzar →</span>
                  )}
                  {vencido && (
                    <span className="ea-card-cta ea-card-cta--disabled">
                      No disponible
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/*
        Dispatch del player según el tipo de ejercicio:
        - id_tipo 3 (Palabra revuelta) → player especializado con sílabas
          revueltas como pista.
        - Cualquier otro tipo (1, 2) → player estándar.
      */}
      {ejercicioActivo &&
        (ejercicioActivo.id_tipo === 3 ? (
          <EjercicioPalabraPlayer
            ejercicio={ejercicioActivo}
            idIngreso={idAlumno}
            onCerrar={handleCerrarPlayer}
          />
        ) : (
          <EjercicioPlayer
            ejercicio={ejercicioActivo}
            idIngreso={idAlumno}
            onCerrar={handleCerrarPlayer}
          />
        ))}
    </div>
  );
}

export default EjercicioAlumno;