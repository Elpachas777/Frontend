import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";
import Canvas from "../components/Canvas";
import "./EjercicioPlayer.css";
import { dividirCanvas, predecir } from "../utils/modelo";
import mensaje from "../utils/mensajes";
import * as respuestaApi from "../api/respuesta.api";

function EjercicioPlayer({ ejercicio, idIngreso, onCerrar }) {
  const canvaRef = useRef([]);
  const intentoRef = useRef([]);

  const [indice, setIndice] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const [modelo, setModelo] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [resumen, setResumen] = useState(null);

  const palabras = ejercicio?.contenido?.palabras || [];
  const total = palabras.length;
  const actual = palabras[indice];
  const progreso = total > 0 ? (indice / total) * 100 : 0;

  useEffect(() => {
    const cargarModelo = async () => {
      try {
        const modeloCargado = await tf.loadGraphModel("/model/model.json");
        setModelo(modeloCargado);
      } catch (error) {
        console.error("Error al cargar modelo:", error);
        mensaje("No se pudo cargar el modelo", {
          tipo: "error",
          mensaje: "Recarga la página e intenta de nuevo.",
        });
      }
    };

    cargarModelo();
  }, []);

  useEffect(() => {
    canvaRef.current = [];
  }, [indice]);

  const crearClave = (indicePalabra, indiceSilaba, silaba) => {
    return `${indicePalabra}-${indiceSilaba}-${silaba}`;
  };

  const canvasTieneTrazo = (canvas) => {
    if (!canvas) return false;

    const ctx = canvas.getContext("2d");
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 0; i < img.length; i += 4) {
      if (img[i + 3] > 20) {
        return true;
      }
    }

    return false;
  };

  const guardarPrediccion = ({ clave, silaba, puntaje }) => {
    const index = intentoRef.current.findIndex((r) => r.clave === clave);

    const nueva = {
      clave,
      silaba,
      puntaje,
    };

    if (index >= 0) {
      intentoRef.current[index] = nueva;
    } else {
      intentoRef.current.push(nueva);
    }
  };

  const predecirSilaba = (canvas, silaba, indiceSilaba) => {
    if (!modelo) {
      throw new Error("El modelo aún está cargando.");
    }

    if (!canvas) {
      throw new Error(`No se encontró el canvas de la sílaba ${silaba}.`);
    }

    if (!canvasTieneTrazo(canvas)) {
      throw new Error(`Dibuja la sílaba ${silaba.toUpperCase()} antes de avanzar.`);
    }

    const letras = dividirCanvas(canvas);
    const resultadoIzq = predecir(modelo, letras[0]);
    const resultadoDer = predecir(modelo, letras[1]);

    const porcentajeTotal =
      (Number(resultadoIzq.porcentaje || 0) +
        Number(resultadoDer.porcentaje || 0)) /
      2;

    const clave = crearClave(indice, indiceSilaba, silaba);

    guardarPrediccion({
      clave,
      silaba,
      puntaje: porcentajeTotal,
    });

    return {
      texto: `${resultadoIzq.letra}${resultadoDer.letra}`,
      porcentaje: porcentajeTotal,
    };
  };

  const handlePredecir = (canvas, silaba, indiceSilaba) => {
    try {
      const resultado = predecirSilaba(canvas, silaba, indiceSilaba);

      mensaje(`Resultado: ${resultado.texto} - ${resultado.porcentaje.toFixed(2)}%`, {
        tipo: "info",
        mensaje: "Sigue así",
      });
    } catch (error) {
      mensaje("No se pudo predecir", {
        tipo: "error",
        mensaje: error.message || "Intenta de nuevo.",
      });
    }
  };

  const predecirFaltantesActuales = () => {
    const silabasActuales = actual?.silabas || [];

    silabasActuales.forEach((silaba, indiceSilaba) => {
      const clave = crearClave(indice, indiceSilaba, silaba);
      const yaExiste = intentoRef.current.some((r) => r.clave === clave);

      if (!yaExiste) {
        predecirSilaba(canvaRef.current[indiceSilaba]?.getImage(), silaba, indiceSilaba);
      }
    });
  };

  const guardarIntento = async () => {
    if (!idIngreso || !ejercicio?.id_ejercicio) {
      throw new Error("Falta el ID del alumno o del ejercicio.");
    }

    const respuestas = intentoRef.current.map((r) => ({
      silaba: r.silaba,
      puntaje: r.puntaje,
    }));

    if (respuestas.length === 0) {
      throw new Error("No hay respuestas para guardar.");
    }

    const res = await respuestaApi.registrarIntento({
      idIngreso,
      idEjercicio: ejercicio.id_ejercicio,
      respuestas,
    });

    setResumen({
      promedio: Number(res.promedio || 0),
      guardadas: res.guardadas,
    });

    setTerminado(true);
  };

  const handleSiguiente = async () => {
    try {
      setGuardando(true);

      // Predice automáticamente lo que falte antes de avanzar.
      predecirFaltantesActuales();

      if (indice + 1 >= total) {
        await guardarIntento();
      } else {
        setIndice((i) => i + 1);
      }
    } catch (error) {
      mensaje("No se puede avanzar", {
        tipo: "error",
        mensaje: error.message || "Revisa que todas las sílabas estén dibujadas.",
      });
    } finally {
      setGuardando(false);
    }
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
              <strong>{Number(resumen.promedio || 0).toFixed(2)}%</strong>
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
            <div key={`${indice}-${i}-${sil}`}>
              <Canvas silaba={sil} ref={(cr) => (canvaRef.current[i] = cr)} />

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-save"
                  disabled={!modelo || guardando}
                  onClick={() =>
                    handlePredecir(canvaRef.current[i]?.getImage(), sil, i)
                  }
                >
                  Predecir
                </button>

                <button
                  type="button"
                  className="modal-btn-cancel"
                  disabled={guardando}
                  onClick={() => canvaRef.current[i]?.clear()}
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
            disabled={!modelo || guardando}
          >
            {!modelo
              ? "Cargando modelo..."
              : guardando
              ? "Procesando..."
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