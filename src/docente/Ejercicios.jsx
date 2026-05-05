import { useState } from "react";
import Swal from "sweetalert2";
import Tabla from "../components/Tabla";
import "../RolAdmin/RolAdmin.css";
import CrearEjercicio from "./CrearEjercicio";
import EjercicioPlayer from "./EjercicioPlayer";
import "./Ejercicios.css";

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

/* ─── Editar ejercicio ───────────────────────────────────────── */

function EditarEjercicio({ onCerrar, setActualizado, filaSeleccionada }) {
  const [ejercicio, setEjercicio] = useState(filaSeleccionada?.ejercicio ?? "");

  const guardar = async (e) => {
    e.preventDefault();
    if (!ejercicio.trim()) {
      await Swal.fire({
        title: "Falta el nombre",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
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
      item.id === filaSeleccionada.id
        ? { ...item, ejercicio: ejercicio.trim() }
        : item,
    );
    setActualizado((prev) => !prev);
    onCerrar();
    await Swal.fire({
      title: "Ejercicio actualizado",
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={cardStyle()}>
        <h2 style={titleStyle()}>Editar ejercicio</h2>
        <form onSubmit={guardar}>
          <div style={fieldWrapStyle()}>
            <label style={labelStyle()}>ID</label>
            <input
              style={inputStyle()}
              value={filaSeleccionada?.id ?? ""}
              readOnly
            />
          </div>
          <div style={fieldWrapStyle()}>
            <label style={labelStyle()}>Nombre del ejercicio</label>
            <input
              style={inputStyle()}
              value={ejercicio}
              onChange={(e) => setEjercicio(e.target.value)}
            />
          </div>
          <div style={actionRowCenter()}>
            <button
              type="button"
              className="cancelar-btn"
              onClick={() => confirmarCancelacion(onCerrar)}
            >
              Cancelar
            </button>
            <button type="submit" className="guardar-btn">
              Guardar cambios
            </button>
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
    return (
      <EjercicioPlayer ejercicio={ej} onCerrar={() => setPreviewing(false)} />
    );
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
            <strong
              style={{
                fontSize: "0.78rem",
                color: "#64748b",
                textTransform: "uppercase",
              }}
            >
              ID
            </strong>
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
            <strong
              style={{
                fontSize: "0.78rem",
                color: "#64748b",
                textTransform: "uppercase",
              }}
            >
              Nombre
            </strong>
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
              <strong
                style={{
                  fontSize: "0.78rem",
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                Texto
              </strong>
              <div style={{ marginTop: "4px", lineHeight: 1.6 }}>
                {ej.texto}
              </div>
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
              <strong
                style={{
                  fontSize: "0.78rem",
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button className="cancelar-btn" onClick={onCerrar}>
            Cerrar
          </button>
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
