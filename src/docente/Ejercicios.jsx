import { useState } from "react";
import Swal from "sweetalert2";
import Tabla from "../components/Tabla";
import EjercicioPlayer from "./EjercicioPlayer";

let ejerciciosMock = [
  {
    id: 1,
    ejercicio: "Memoria visual",
    texto: "El perro estaba por el parque con un gato jugando con una pelota",
    palabras: [
      { palabra: "perro", silabas: ["pe", "rro"] },
      { palabra: "gato", silabas: ["ga", "to"] },
      { palabra: "pelota", silabas: ["pe", "lo", "ta"] },
    ],
  },
  { id: 2, ejercicio: "Encuentra la palabra", texto: "", palabras: [] },
  { id: 3, ejercicio: "Ordena la secuencia", texto: "", palabras: [] },
];

export function getEjerciciosMock() {
  return [...ejerciciosMock];
}

const obtenerEjercicios = async () => [...ejerciciosMock];

const borrarEjercicio = async (id) => {
  ejerciciosMock = ejerciciosMock.filter((item) => item.id !== id);
  return { tipo: "success", mensaje: "El ejercicio se eliminó correctamente." };
};

function cardStyle(width = "min(720px, 92vw)") {
  return {
    width,
    background: "#ffffff",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
    boxSizing: "border-box",
  };
}

function titleStyle() {
  return {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "2rem",
    fontWeight: 900,
    color: "#112133",
    textAlign: "center",
  };
}

function fieldWrapStyle() {
  return { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" };
}

function inputStyle(extra = {}) {
  return {
    width: "100%",
    height: "54px",
    padding: "0 16px",
    borderRadius: "16px",
    border: "1.5px solid #d7e3d4",
    fontSize: "1rem",
    boxSizing: "border-box",
    outline: "none",
    ...extra,
  };
}

function labelStyle() {
  return { fontWeight: 600, color: "#334155", fontSize: "0.95rem" };
}

function actionRowCenter() {
  return { display: "flex", justifyContent: "center", gap: "14px", marginTop: "20px", flexWrap: "wrap" };
}

async function confirmarCancelacion(onCerrar) {
  const res = await Swal.fire({
    title: "¿Cancelar?",
    text: "Se perderán los cambios no guardados.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, cancelar",
    cancelButtonText: "Seguir editando",
    reverseButtons: true,
  });
  if (res.isConfirmed) onCerrar();
}

function cleanWord(w) {
  return w.replace(/[.,!?;:"""'']/g, "").toLowerCase();
}

/* ─── Crear ejercicio ────────────────────────────────────────── */

function CrearEjercicio({ onCerrar, setActualizado }) {
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [palabrasObj, setPalabrasObj] = useState([]);
  const [previewing, setPreviewing] = useState(false);

  const tokens = texto.trim() ? texto.trim().split(/\s+/) : [];

  const togglePalabra = (rawWord) => {
    const key = cleanWord(rawWord);
    if (!key) return;
    const existe = palabrasObj.find((p) => p.key === key);
    if (existe) {
      setPalabrasObj((prev) => prev.filter((p) => p.key !== key));
    } else {
      setPalabrasObj((prev) => [
        ...prev,
        { key, palabra: key, silabas: [key], raw: rawWord },
      ]);
    }
  };

  const updateSilabas = (key, valor) => {
    const silabas = valor
      .split("-")
      .map((s) => s.trim())
      .filter(Boolean);
    setPalabrasObj((prev) =>
      prev.map((p) => (p.key === key ? { ...p, silabas } : p))
    );
  };

  const ejercicioPreview = {
    id: 0,
    ejercicio: titulo,
    texto,
    palabras: palabrasObj.map(({ palabra, silabas }) => ({ palabra, silabas })),
  };

  const guardar = async () => {
    if (!titulo.trim()) {
      await Swal.fire({ title: "Falta el título", icon: "warning", confirmButtonText: "Entendido" });
      return;
    }
    if (!texto.trim()) {
      await Swal.fire({ title: "Falta el texto", icon: "warning", confirmButtonText: "Entendido" });
      return;
    }
    if (palabrasObj.length === 0) {
      await Swal.fire({
        title: "Sin palabras seleccionadas",
        text: "Haz clic en al menos una palabra del texto para que el alumno la practique.",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "¿Crear ejercicio?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, crear",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });
    if (!confirm.isConfirmed) return;

    const nextId =
      ejerciciosMock.length > 0
        ? Math.max(...ejerciciosMock.map((e) => e.id)) + 1
        : 1;

    ejerciciosMock = [
      ...ejerciciosMock,
      {
        id: nextId,
        ejercicio: titulo.trim(),
        texto: texto.trim(),
        palabras: palabrasObj.map(({ palabra, silabas }) => ({ palabra, silabas })),
      },
    ];

    setActualizado((prev) => !prev);
    onCerrar();

    await Swal.fire({
      title: "Ejercicio creado",
      icon: "success",
      timer: 1800,
      showConfirmButton: false,
    });
  };

  if (previewing) {
    return (
      <EjercicioPlayer
        ejercicio={ejercicioPreview}
        onCerrar={() => setPreviewing(false)}
      />
    );
  }

  return (
    <div className="modal-overlay">
      <div
        className="modal"
        style={{ ...cardStyle("min(740px, 94vw)"), maxHeight: "90vh", overflowY: "auto" }}
      >
        <h2 style={titleStyle()}>Crear nuevo ejercicio</h2>

        {/* Título */}
        <div style={fieldWrapStyle()}>
          <label style={labelStyle()}>Título del ejercicio</label>
          <input
            style={inputStyle()}
            placeholder='Ej. "El perro y el gato"'
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        {/* Texto / oración */}
        <div style={fieldWrapStyle()}>
          <label style={labelStyle()}>Texto de la oración</label>
          <textarea
            style={{
              ...inputStyle({ height: "auto", padding: "12px 16px" }),
              resize: "vertical",
              minHeight: "80px",
            }}
            placeholder="Ej. El perro estaba por el parque con un gato jugando con una pelota"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={3}
          />
        </div>

        {/* Clickable words */}
        {tokens.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ ...labelStyle(), marginBottom: "10px" }}>
              Haz clic en las palabras que el alumno practicará:
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                padding: "16px",
                background: "#f5fbf2",
                borderRadius: "16px",
                border: "1.5px solid #c5e89a",
              }}
            >
              {tokens.map((word, i) => {
                const key = cleanWord(word);
                const selected = palabrasObj.some((p) => p.key === key);
                return (
                  <span
                    key={i}
                    onClick={() => togglePalabra(word)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "999px",
                      cursor: "pointer",
                      background: selected ? "#7bc043" : "#e2e8f0",
                      color: selected ? "#fff" : "#334155",
                      fontWeight: selected ? 700 : 400,
                      fontSize: "1rem",
                      userSelect: "none",
                      transition: "background 0.15s, color 0.15s",
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Syllable definition for selected words */}
        {palabrasObj.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ ...labelStyle(), marginBottom: "10px" }}>
              Define las sílabas separadas por guión:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {palabrasObj.map((p) => (
                <div
                  key={p.key}
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span
                    style={{
                      minWidth: "90px",
                      fontWeight: 800,
                      color: "#2d5a1e",
                      fontSize: "0.98rem",
                    }}
                  >
                    {p.palabra}
                  </span>
                  <input
                    style={{ ...inputStyle({ height: "44px", flex: 1 }), flex: 1 }}
                    value={p.silabas.join("-")}
                    placeholder="pe-rro"
                    onChange={(e) => updateSilabas(p.key, e.target.value)}
                  />
                  <span style={{ fontSize: "0.82rem", color: "#8faa88" }}>
                    → {p.silabas.join(" · ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="cancelar-btn"
            onClick={() => confirmarCancelacion(onCerrar)}
          >
            Cancelar
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            {palabrasObj.length > 0 && (
              <button
                type="button"
                style={{
                  padding: "12px 22px",
                  borderRadius: "16px",
                  border: "1.5px solid #7bc043",
                  background: "#eef8e5",
                  color: "#2d5a1e",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                }}
                onClick={() => setPreviewing(true)}
              >
                Vista previa
              </button>
            )}
            <button type="button" className="guardar-btn" onClick={guardar}>
              Guardar ejercicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Editar ejercicio ───────────────────────────────────────── */

function EditarEjercicio({ onCerrar, setActualizado, filaSeleccionada }) {
  const [ejercicio, setEjercicio] = useState(filaSeleccionada?.ejercicio ?? "");

  const guardar = async (e) => {
    e.preventDefault();
    if (!ejercicio.trim()) {
      await Swal.fire({ title: "Falta el nombre", icon: "warning", confirmButtonText: "Entendido" });
      return;
    }
    const confirm = await Swal.fire({
      title: "¿Guardar cambios?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });
    if (!confirm.isConfirmed) return;

    ejerciciosMock = ejerciciosMock.map((item) =>
      item.id === filaSeleccionada.id ? { ...item, ejercicio: ejercicio.trim() } : item
    );
    setActualizado((prev) => !prev);
    onCerrar();
    await Swal.fire({ title: "Ejercicio actualizado", icon: "success", confirmButtonText: "Aceptar" });
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={cardStyle()}>
        <h2 style={titleStyle()}>Editar ejercicio</h2>
        <form onSubmit={guardar}>
          <div style={fieldWrapStyle()}>
            <label style={labelStyle()}>ID</label>
            <input style={inputStyle()} value={filaSeleccionada?.id ?? ""} readOnly />
          </div>
          <div style={fieldWrapStyle()}>
            <label style={labelStyle()}>Nombre del ejercicio</label>
            <input style={inputStyle()} value={ejercicio} onChange={(e) => setEjercicio(e.target.value)} />
          </div>
          <div style={actionRowCenter()}>
            <button type="button" className="cancelar-btn" onClick={() => confirmarCancelacion(onCerrar)}>
              Cancelar
            </button>
            <button type="submit" className="guardar-btn">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Ver ejercicio ──────────────────────────────────────────── */

function VerEjercicio({ onCerrar, filaSeleccionada }) {
  const [previewing, setPreviewing] = useState(false);
  const ej = filaSeleccionada;

  if (previewing) {
    return <EjercicioPlayer ejercicio={ej} onCerrar={() => setPreviewing(false)} />;
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={cardStyle("min(600px, 92vw)")}>
        <h2 style={titleStyle()}>Detalle del ejercicio</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #d9e2ec",
              borderRadius: "14px",
              padding: "14px 18px",
            }}
          >
            <strong style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase" }}>ID</strong>
            <div style={{ marginTop: "4px" }}>{ej?.id}</div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #d9e2ec",
              borderRadius: "14px",
              padding: "14px 18px",
            }}
          >
            <strong style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase" }}>Nombre</strong>
            <div style={{ marginTop: "4px" }}>{ej?.ejercicio}</div>
          </div>

          {ej?.texto && (
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #d9e2ec",
                borderRadius: "14px",
                padding: "14px 18px",
              }}
            >
              <strong style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase" }}>Texto</strong>
              <div style={{ marginTop: "4px", lineHeight: 1.6 }}>{ej.texto}</div>
            </div>
          )}

          {ej?.palabras?.length > 0 && (
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #d9e2ec",
                borderRadius: "14px",
                padding: "14px 18px",
              }}
            >
              <strong style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase" }}>
                Palabras ({ej.palabras.length})
              </strong>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {ej.palabras.map((p, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#eef8e5",
                      border: "1.5px solid #b5e68a",
                      borderRadius: "10px",
                      padding: "6px 14px",
                      fontWeight: 700,
                      color: "#2d5a1e",
                      fontSize: "0.9rem",
                    }}
                  >
                    {p.silabas.join(" - ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
          <button className="cancelar-btn" onClick={onCerrar}>Cerrar</button>
          {ej?.texto && (
            <button className="guardar-btn" onClick={() => setPreviewing(true)}>
              Vista previa del ejercicio
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */

function Ejercicios() {
  return (
    <Tabla
      Crear={CrearEjercicio}
      obtenerDatos={obtenerEjercicios}
      titulo="ejercicios"
      Ver={VerEjercicio}
      Borrar={borrarEjercicio}
      Editar={EditarEjercicio}
      ocultarColumnas={["texto", "palabras"]}
    />
  );
}

export default Ejercicios;
