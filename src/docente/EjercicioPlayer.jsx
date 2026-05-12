import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";
import Canvas from "../components/Canvas";
import "./EjercicioPlayer.css";
import { dividirCanvas, predecir } from "../utils/modelo";
import mensaje from "../utils/mensajes";
import * as respuestaApi from "../api/respuesta.api";

function EjercicioPlayer({ ejercicio, idIngreso, onCerrar }) {
  const canvaRef = useRef([]);
  const [indice, setIndice] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const [modelo, setModelo] = useState();
  const [guardando, setGuardando] = useState(false);
  const [resumen, setResumen] = useState(null);

  // Acumulador de predicciones del intento actual.
  // Cada entrada: { silaba, puntaje }
  const intentoRef = useRef([]);

  const palabras = ejercicio.contenido.palabras || [];
  const total = palabras.length;
  const actual = palabras[indice];
  const progreso = total > 0 ? (indice / total) * 100 : 0;

  useEffect(() => {
    const cargarModelo = async () => {
      const modeloCargado = await tf.loadGraphModel("/model/model.json");
      setModelo(modeloCargado);
    };

    cargarModelo();
  }, []);

  useEffect(() => {
    canvaRef.current = [];
  }, [indice]);

  const guardarIntento = async () => {
    if (!idIngreso || !ejercicio?.id_ejercicio) {
      // Sin id no podemos persistir; aún así marcamos como terminado.
      setTerminado(true);
      return;
    }

    const respuestas = intentoRef.current;
    if (respuestas.length === 0) {
      setTerminado(true);
      return;
    }

    try {
      setGuardando(true);
      const res = await respuestaApi.registrarIntento({
        idIngreso,
        idEjercicio: ejercicio.id_ejercicio,
        respuestas,
      });
      setResumen({
        promedio: res.promedio,
        guardadas: res.guardadas,
      });
    } catch (err) {
      console.error("No se pudo guardar el intento:", err);
      mensaje("No se pudo guardar tu intento", {
        tipo: "error",
        mensaje: "Ocurrió un error al guardar",
      });
    } finally {
      setGuardando(false);
      setTerminado(true);
    }
  };

  const handleSiguiente = () => {
    if (indice + 1 >= total) {
      // Último: guardamos todo el intento de una sola vez.
      guardarIntento();
    } else {
      setIndice((i) => i + 1);
    }
  };

  const handlePredecir = (canvas, silaba) => {
    const letras = dividirCanvas(canvas);
    const resultadoIzq = predecir(modelo, letras[0]);
    const resultadoDer = predecir(modelo, letras[1]);

    const porcentajeTotal =
      (resultadoIzq.porcentaje + resultadoDer.porcentaje) / 2;

    // Acumulamos en el intento. Si la misma sílaba se predijo antes en este
    // intento (el alumno volvió a tocar Predecir), sobrescribimos con la nueva.
    const previo = intentoRef.current.findIndex((r) => r.silaba === silaba);
    const nueva = { silaba, puntaje: porcentajeTotal };
    if (previo >= 0) {
      intentoRef.current[previo] = nueva;
    } else {
      intentoRef.current.push(nueva);
    }

    mensaje(
      "Resultado: " +
        resultadoIzq.letra +
        resultadoDer.letra +
        " - " +
        porcentajeTotal.toFixed(2) +
        "%",
      {
        tipo: "info",
        mensaje: "Sigue asi",
      },
    );
  };

  if (!ejercicio || total === 0) {
    return (
      <div
        className="ep-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) onCerrar();
        }}
      >
        <div className="ep-card ep-card--center">
          <p className="ep-empty-msg">
            Este ejercicio no tiene palabras configuradas aún.
          </p>
          <button className="ep-btn-secondary" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (terminado) {
    return (
      <div className="ep-overlay">
        <div className="ep-card ep-card--center ep-card--done">
          <h2 className="ep-done-title">¡Muchas gracias por jugar!</h2>
          <p className="ep-done-sub">
            Has completado todas las sílabas del ejercicio.
          </p>
          {resumen && (
            <p className="ep-done-sub">
              Tu promedio en este intento:{" "}
              <strong>{resumen.promedio.toFixed(2)}%</strong>
            </p>
          )}
          <button className="ep-btn" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="ep-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div className="ep-card">
        <button className="ep-close" onClick={onCerrar} aria-label="Cerrar">
          ✕
        </button>

        <div className="ep-progress-wrap">
          <div className="ep-progress-track">
            <div
              className="ep-progress-fill"
              style={{ width: `${progreso}%` }}
            />
          </div>
          <span className="ep-progress-label">
            {indice + 1} / {total}
          </span>
        </div>

        <p className="ep-sentence">{ejercicio.titulo}</p>
        <p className="ep-sentence">{ejercicio.contenido.texto}</p>
        <p className="ep-syllable-label">{actual.silabas.join(" - ")}</p>

        <div className="ep-canvases">
          {actual.silabas.map((sil, i) => (
            <div key={`${indice}-${i}`}>
              <Canvas silaba={sil} ref={(cr) => (canvaRef.current[i] = cr)} />
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-save"
                  onClick={() =>
                    handlePredecir(canvaRef.current[i].getImage(), sil)
                  }
                >
                  Predecir
                </button>
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => canvaRef.current[i].clear()}
                >
                  limpiar
                </button>
              </div>
            </div>
          ))}
          <span className="ep-arrow">→</span>
        </div>

        <div className="ep-actions">
          <button
            type="button"
            className="ep-btn"
            onClick={handleSiguiente}
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : indice + 1 >= total
              ? "Finalizar"
              : "Siguiente →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EjercicioPlayer;