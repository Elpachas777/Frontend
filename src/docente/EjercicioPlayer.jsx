import * as tf from "@tensorflow/tfjs";
import { useEffect, useMemo, useRef, useState } from "react";
import Canvas from "../components/Canvas";
import "./EjercicioPlayer.css";
import { dividirCanvasPorCantidad, predecir } from "../utils/modelo";
import mensaje from "../utils/mensajes";
import { useEffect, useRef, useState } from "react";
import * as respuestaApi from "../api/respuesta.api";
import Canvas from "../components/Canvas";
import mensaje from "../utils/mensajes";
import { dividirCanvas, predecir } from "../utils/modelo";
import "./EjercicioPlayer.css";

function limpiarSilaba(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

function EjercicioPlayer({
  ejercicio,
  idIngreso,
  onCerrar,
  soloVistaPrevia = false,
}) {
  const canvaRef = useRef([]);
  const intentoRef = useRef([]);

  const [indice, setIndice] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const [modelo, setModelo] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [resumen, setResumen] = useState(null);

  const contenido = ejercicio?.contenido || {};
  const esCuento = Array.isArray(contenido.segmentos);

  const palabras = contenido?.palabras || [];
  const total = esCuento ? 1 : palabras.length;
  const actual = esCuento ? null : palabras[indice];
  const progreso = esCuento ? 100 : total > 0 ? (indice / total) * 100 : 0;

  const huecosCuento = useMemo(() => {
    if (!esCuento) return [];

    return contenido.segmentos
      .filter((segmento) => segmento.tipo === "silaba")
      .map((segmento, index) => ({
        ...segmento,
        index,
      }));
  }, [esCuento, contenido.segmentos]);

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
  }, [indice, ejercicio?.id_ejercicio]);

  const crearClave = (origen, indiceSilaba, silaba) => {
    return `${origen}-${indiceSilaba}-${limpiarSilaba(silaba)}`;
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

  const guardarPrediccion = ({ clave, silaba, puntaje, prediccion }) => {
    const index = intentoRef.current.findIndex((r) => r.clave === clave);

    const nueva = {
      clave,
      silaba,
      puntaje,
      prediccion,
    };

    if (index >= 0) {
      intentoRef.current[index] = nueva;
    } else {
      intentoRef.current.push(nueva);
    }
  };

  const predecirSilaba = ({ canvas, silaba, clave }) => {
    if (!modelo) {
      throw new Error("El modelo aún está cargando.");
    }

    const silabaLimpia = limpiarSilaba(silaba);

    if (!silabaLimpia) {
      throw new Error("La sílaba esperada está vacía.");
    }

    if (!canvas) {
      throw new Error(`No se encontró el canvas de la sílaba ${silaba}.`);
    }

    if (!canvasTieneTrazo(canvas)) {
      throw new Error(
        `Dibuja la sílaba ${silaba.toUpperCase()} antes de avanzar.`,
      );
    }

    const tensores = dividirCanvasPorCantidad(canvas, silabaLimpia.length);

    if (!tensores.length) {
      throw new Error(`No se pudo leer el trazo de ${silaba.toUpperCase()}.`);
    }

    const predicciones = tensores.map((tensor) => predecir(modelo, tensor));
    const textoPredicho = predicciones.map((p) => p.letra).join("");

    const letrasEsperadas = silabaLimpia.split("");

    const puntaje =
      letrasEsperadas.reduce((acc, letra, index) => {
        const prediccion = predicciones[index];

        if (!prediccion) return acc;

        return (
          acc +
          (prediccion.letra === letra ? Number(prediccion.porcentaje || 0) : 0)
        );
      }, 0) / letrasEsperadas.length;

    guardarPrediccion({
      clave,
      silaba: silabaLimpia,
      puntaje,
      prediccion: textoPredicho,
    });

    return {
      texto: textoPredicho,
      porcentaje: puntaje,
    };
  };

  const handlePredecir = async (canvas, silaba, indiceSilaba) => {
    try {
      const resultado = predecirSilaba({ canvas, silaba, clave });

      await mensaje(
        `Resultado: ${resultado.texto} - ${resultado.porcentaje.toFixed(2)}%`,
        {
          tipo: "info",
          mensaje: "Sigue así",
        },
      );
    } catch (error) {
      await mensaje("No se pudo predecir", {
        tipo: "error",
        mensaje: error.message || "Intenta de nuevo.",
      });
    }
  };

  const predecirFaltantesOracion = () => {
    const silabasActuales = actual?.silabas || [];

    silabasActuales.forEach((silaba, indiceSilaba) => {
      const clave = crearClave(`oracion-${indice}`, indiceSilaba, silaba);
      const yaExiste = intentoRef.current.some((r) => r.clave === clave);

      if (!yaExiste) {
        predecirSilaba(
          canvaRef.current[indiceSilaba]?.getImage(),
          silaba,
          indiceSilaba,
        );
      }
    });
  };

  const guardarIntento = async () => {
    const respuestas = intentoRef.current.map((r) => ({
      silaba: r.silaba,
      puntaje: r.puntaje,
      prediccion: r.prediccion,
    }));

    if (respuestas.length === 0) {
      throw new Error("No hay respuestas para guardar.");
    }

    if (soloVistaPrevia) {
      const promedio =
        respuestas.reduce((acc, item) => acc + Number(item.puntaje || 0), 0) /
        respuestas.length;

      setResumen({
        promedio,
        guardadas: respuestas.length,
      });

      setTerminado(true);
      return;
    }

    if (!idIngreso || !ejercicio?.id_ejercicio) {
      throw new Error("Falta el ID del alumno o del ejercicio.");
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

      if (esCuento) {
        predecirFaltantesCuento();
        await guardarIntento();
        return;
      }

      predecirFaltantesOracion();

      if (indice + 1 >= total) {
        await guardarIntento();
      } else {
        setIndice((i) => i + 1);
      }
    } catch (error) {
      mensaje("No se puede avanzar", {
        tipo: "error",
        mensaje:
          error.message || "Revisa que todas las sílabas estén dibujadas.",
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
            Este ejercicio no tiene sílabas configuradas aún.
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
      <div className={esCuento ? "ep-card ep-card--story" : "ep-card"}>
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
            {esCuento ? "Cuento" : `${indice + 1} / ${total}`}
          </span>
        </div>

        <p className="ep-sentence">{ejercicio.titulo}</p>

        {esCuento ? (
          <div className="ep-story">
            {contenido.segmentos.map((segmento, index) => {
              if (segmento.tipo === "texto") {
                return (
                  <span className="ep-story-text" key={`texto-${index}`}>
                    {segmento.texto}
                  </span>
                );
              }

              <div className="modal-actions">
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
          </>
        )}

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
