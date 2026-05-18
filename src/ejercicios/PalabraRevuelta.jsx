import { useEffect, useState } from "react";
import EjercicioPalabraPlayer from "../alumno/EjercicioPalabraPlayer";

/**
 * Formulario para el docente: ejercicios de tipo "Palabra revuelta".
 *
 * El docente captura varias palabras y las separa en sílabas con guiones.
 * El alumno verá, al resolver: las sílabas DESORDENADAS arriba como pista
 * y los canvases en el ORDEN CORRECTO debajo.
 *
 * Nota técnica: mantenemos el texto literal del input ("ma-pa", "ma-",
 * "-ma-pa") en estado mientras el docente está escribiendo, para que no
 * se borren los guiones intermedios al teclear. Solo cuando publicamos
 * al form padre (handleObjectChange) limpiamos los vacíos.
 */
function PalabraRevuelta({ ejercicio, contenido, handleObjectChange }) {
  // palabras = lista de { palabra, silabasRaw } donde silabasRaw es el
  // texto crudo que está escribiendo el docente, sin recortar.
  const [palabras, setPalabras] = useState([
    { palabra: "", silabasRaw: "" },
  ]);

  const [previewing, setPreviewing] = useState(false);

  // Cargar contenido inicial si viene de edición
  useEffect(() => {
    if (!contenido) return;
    if (contenido.palabras && Array.isArray(contenido.palabras)) {
      setPalabras(
        contenido.palabras.map((p) => ({
          palabra: p.palabra || "",
          silabasRaw: (p.silabas || []).join("-"),
        })),
      );
    }
  }, []);

  // Sincronizar con el form padre cuando cambian las palabras
  useEffect(() => {
    const palabrasValidas = palabras
      .map(({ palabra, silabasRaw }) => ({
        palabra: palabra.trim().toLowerCase(),
        silabas: silabasRaw
          .split("-")
          .map((s) => s.trim())
          .filter(Boolean),
      }))
      .filter((p) => p.palabra && p.silabas.length > 0);

    handleObjectChange("contenido", {
      tipo: "palabra_revuelta",
      palabras: palabrasValidas,
    });
  }, [palabras]);

  const actualizarPalabra = (i, valor) => {
    setPalabras((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, palabra: valor } : p)),
    );
  };

  // IMPORTANTE: guardamos el texto literal que escribe el docente.
  // Si filtráramos vacíos aquí, no podría escribir "ma-" porque al
  // teclear el guion el último elemento (vacío tras split) se eliminaría.
  const actualizarSilabasRaw = (i, valor) => {
    setPalabras((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, silabasRaw: valor } : p)),
    );
  };

  const agregarPalabra = () => {
    setPalabras((prev) => [...prev, { palabra: "", silabasRaw: "" }]);
  };

  const eliminarPalabra = (i) => {
    if (palabras.length === 1) return;
    setPalabras((prev) => prev.filter((_, idx) => idx !== i));
  };

  // Si el docente quiere previsualizar, renderizamos el mismo player que
  // verá el alumno, con el contenido que está editando.
  if (previewing) {
    const palabrasParaPreview = palabras
      .map(({ palabra, silabasRaw }) => ({
        palabra: palabra.trim().toLowerCase(),
        silabas: silabasRaw
          .split("-")
          .map((s) => s.trim())
          .filter(Boolean),
      }))
      .filter((p) => p.palabra && p.silabas.length > 0);

    const ejercicioPreview = {
      ...(ejercicio || {}),
      // Asegúrate de que el preview tenga al menos un titulo visible
      titulo: ejercicio?.titulo || "Vista previa",
      contenido: {
        tipo: "palabra_revuelta",
        palabras: palabrasParaPreview,
      },
    };

    return (
      <EjercicioPalabraPlayer
        ejercicio={ejercicioPreview}
        idIngreso={null}
        onCerrar={() => setPreviewing(false)}
      />
    );
  }

  // Helper visual para mostrar las sílabas ya divididas
  const silabasDivididas = (raw) =>
    raw
      .split("-")
      .map((s) => s.trim())
      .filter(Boolean);

  return (
    <>
      <div className="modal-field">
        <p style={{ marginBottom: 8 }}>
          Agrega las palabras que el alumno trabajará. Para cada palabra,
          escribe su división silábica separada con guiones (ej.{" "}
          <code>si-lla</code>).
        </p>
        <p
          style={{
            fontSize: "0.85em",
            color: "#666",
            marginTop: 0,
            marginBottom: 12,
          }}
        >
          El alumno verá las sílabas revueltas como pista y deberá trazar cada
          una en su canvas correspondiente (en el orden correcto).
        </p>
      </div>

      <div className="visualiza-palabras">
        {palabras.map((p, i) => {
          const divididas = silabasDivididas(p.silabasRaw);
          return (
            <div className="palabra" key={i}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <label
                  style={{
                    fontSize: "0.85em",
                    color: "#555",
                    marginBottom: 4,
                  }}
                >
                  Palabra #{i + 1}
                </label>
                <input
                  type="text"
                  placeholder="Ej. silla"
                  value={p.palabra}
                  onChange={(e) => actualizarPalabra(i, e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <label
                  style={{
                    fontSize: "0.85em",
                    color: "#555",
                    marginBottom: 4,
                  }}
                >
                  Sílabas (separadas con guion)
                </label>
                <input
                  type="text"
                  placeholder="Ej. si-lla"
                  value={p.silabasRaw}
                  onChange={(e) => actualizarSilabasRaw(i, e.target.value)}
                />
              </div>

              <span className="palabra-separada">
                → {divididas.length > 0 ? divididas.join(" · ") : "—"}
              </span>

              <button
                type="button"
                onClick={() => eliminarPalabra(i)}
                disabled={palabras.length === 1}
                title="Eliminar esta palabra"
                style={{
                  background: "transparent",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  padding: "4px 8px",
                  cursor: palabras.length === 1 ? "not-allowed" : "pointer",
                  color: palabras.length === 1 ? "#aaa" : "#c62828",
                }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      <div className="modal-field" style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          className="btn-prev"
          onClick={agregarPalabra}
        >
          + Agregar palabra
        </button>

        <button
          type="button"
          className="btn-prev"
          onClick={() => setPreviewing(true)}
        >
          Previsualizar
        </button>
      </div>
    </>
  );
}

export default PalabraRevuelta;