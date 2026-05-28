import { useEffect, useState } from "react";
import EjercicioPalabraPlayer from "../alumno/EjercicioPalabraPlayer";

const TILDE_REGEX = /[áéíóúÁÉÍÓÚàèìòùäëïöüâêîôû]/;

function obtenerSilabasValidas(valor) {
  return valor
    .split("-")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length === 2);
}

function tieneSilabasInvalidas(valor) {
  return valor
    .split("-")
    .map((s) => s.trim())
    .filter(Boolean)
    .some((s) => s.length !== 2);
}

function PalabraRevuelta({ ejercicio, contenido, handleObjectChange }) {
  const [palabras, setPalabras] = useState([
    { palabra: "", silabasRaw: "" },
  ]);
  const [previewing, setPreviewing] = useState(false);
  const [errorTilde, setErrorTilde] = useState("");

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
      .map(({ palabra, silabasRaw }) => {
        const palabraLimpia = palabra.trim().toLowerCase();
        const silabas = obtenerSilabasValidas(silabasRaw);

        return {
          palabra: palabraLimpia,
          silabas,
          tieneInvalidas: tieneSilabasInvalidas(silabasRaw),
        };
      })
      .filter((p) => p.palabra && p.silabas.length > 0 && !p.tieneInvalidas)
      .map(({ palabra, silabas }) => ({ palabra, silabas }));

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

  const actualizarSilabasRaw = (i, valor) => {
    if (TILDE_REGEX.test(valor)) {
      setErrorTilde("Las sílabas no pueden contener tildes (acentos).");
      return;
    }
    setErrorTilde(
      tieneSilabasInvalidas(valor)
        ? "Las sílabas deben tener exactamente 2 letras. No se aceptan sílabas de 1 letra ni de más de 2 letras."
        : "",
    );
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

  if (previewing) {
    const palabrasParaPreview = palabras
      .map(({ palabra, silabasRaw }) => {
        const palabraLimpia = palabra.trim().toLowerCase();
        const silabas = obtenerSilabasValidas(silabasRaw);

        return {
          palabra: palabraLimpia,
          silabas,
          tieneInvalidas: tieneSilabasInvalidas(silabasRaw),
        };
      })
      .filter((p) => p.palabra && p.silabas.length > 0 && !p.tieneInvalidas)
      .map(({ palabra, silabas }) => ({ palabra, silabas }));

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
    obtenerSilabasValidas(raw);

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
        {errorTilde && (
          <p
            style={{
              color: "#c62828",
              background: "#fff5f5",
              border: "1px solid #f5c6c6",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: "0.88rem",
              marginBottom: 10,
              width: "100%",
            }}
          >
             {errorTilde}
          </p>
        )}
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
                  style={errorTilde ? { borderColor: "#c62828" } : {}}
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