import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Tabla from "../components/Tabla";
import { verificarContraseña } from "../api/sesion.api";

const docentesMock = [
  {
    id: 1,
    nombres: "Ana",
    apellidos: "López",
    correo: "ana@escuela.com",
    escuela: "ESCOM",
  },
  {
    id: 2,
    nombres: "Luis",
    apellidos: "Martínez",
    correo: "luis@escuela.com",
    escuela: "UPIICSA",
  },
  {
    id: 3,
    nombres: "María",
    apellidos: "Hernández",
    correo: "maria@escuela.com",
    escuela: "ESIME",
  },
];

let alumnosMock = [
  { id: 1, nombre: "Carlos Ruiz",    idUnico: "CR3CV1-01", grupo: "3CV1" },
  { id: 2, nombre: "Fernanda Díaz",  idUnico: "FD3CV1-02", grupo: "3CV1" },
  { id: 3, nombre: "Diego Torres",   idUnico: "DT4CM2-01", grupo: "4CM2" },
  { id: 4, nombre: "Sofía Pérez",    idUnico: "SP4CM2-02", grupo: "4CM2" },
  { id: 5, nombre: "Miguel Herrera", idUnico: "MH5AV1-01", grupo: "5AV1" },
];

let gruposMock = [
  { id: 1, nombre: "3CV1", turno: "Matutino",   materia: "Matemáticas" },
  { id: 2, nombre: "4CM2", turno: "Vespertino",  materia: "Física" },
  { id: 3, nombre: "5AV1", turno: "Mixto",       materia: "Programación" },
];
let nextGrupoId = 4;

let alumnosPorGrupo = {
  1: [
    { id: 1, nombre: "Carlos Ruiz",    idUnico: "CR3CV1-01" },
    { id: 2, nombre: "Fernanda Díaz",  idUnico: "FD3CV1-02" },
  ],
  2: [
    { id: 3, nombre: "Diego Torres",   idUnico: "DT4CM2-01" },
    { id: 4, nombre: "Sofía Pérez",    idUnico: "SP4CM2-02" },
  ],
  3: [
    { id: 5, nombre: "Miguel Herrera", idUnico: "MH5AV1-01" },
  ],
};
let nextAlumnoId = 6;

const obtenerDocentesMock = async () => docentesMock;
const obtenerAlumnosMock  = async () => [...alumnosMock];
const obtenerGruposMock   = async () => [...gruposMock];
const borrarMock          = async () => ({ ok: true });

function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toUpperCase();
}

function generarIniciales(nombreCompleto) {
  return normalizarTexto(nombreCompleto)
    .split(/\s+/)
    .filter(Boolean)
    .map((palabra) => palabra[0])
    .join("");
}

function generarCodigoBase(nombreCompleto, grupo) {
  const iniciales    = generarIniciales(nombreCompleto);
  const grupoLimpio  = normalizarTexto(grupo).replace(/\s/g, "");
  return `${iniciales}${grupoLimpio}`;
}

function generarCodigoVisible(codigoBase, numeroLista) {
  return `${codigoBase}-${String(numeroLista).padStart(2, "0")}`;
}

function modalStyle(width = "min(720px, 92vw)") {
  return {
    width,
    background: "#ffffff",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  };
}

function titleStyle() {
  return {
    marginTop: 0,
    marginBottom: "18px",
    fontSize: "2rem",
    fontWeight: 800,
    color: "#0f172a",
    textAlign: "center",
  };
}

function formGridStyle() {
  return {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  };
}

function fieldStyle() {
  return {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };
}

function inputStyle() {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    boxSizing: "border-box",
  };
}

function actionsStyle() {
  return {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "22px",
  };
}

function ModalDummy({ onCerrar }) {
  return (
    <div className="modal-overlay">
      <div className="modal" style={modalStyle("420px")}>
        <h2 style={{ marginTop: 0, marginBottom: "10px", textAlign: "center" }}>
          Vista previa
        </h2>
        <p style={{ marginBottom: "18px", textAlign: "center" }}>
          Esta acción es solo visual en modo diseño.
        </p>
        <div style={actionsStyle()}>
          <button className="guardar-btn" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   MODALES DE GRUPOS
========================= */

function PreviewCrearGrupo({ onCerrar, setActualizado }) {
  const [nombre, setNombre] = useState("");
  const [turno, setTurno] = useState("");
  const [materia, setMateria] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    await new Promise((r) => setTimeout(r, 600));

    gruposMock.push({ id: nextGrupoId++, nombre, turno, materia });

    if (setActualizado) setActualizado((prev) => !prev);
    await Swal.fire({
      title: "Grupo creado",
      text: `El grupo "${nombre}" fue creado correctamente.`,
      icon: "success",
      timer: 1800,
      showConfirmButton: false,
    });
    setCargando(false);
    onCerrar();
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={modalStyle()}>
        <h2 style={titleStyle()}>Crear nuevo grupo</h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div style={fieldStyle()}>
              <label>Nombre del grupo</label>
              <input
                style={inputStyle()}
                placeholder="Ej. 3CV1"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div style={fieldStyle()}>
              <label>Turno</label>
              <select
                style={inputStyle()}
                value={turno}
                onChange={(e) => setTurno(e.target.value)}
                required
              >
                <option value="">Selecciona un turno</option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Mixto">Mixto</option>
              </select>
            </div>

            <div style={fieldStyle()}>
              <label>Materia</label>
              <input
                style={inputStyle()}
                placeholder="Ej. Matemáticas"
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={actionsStyle()}>
            <button
              type="button"
              className="cancelar-btn"
              onClick={onCerrar}
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="guardar-btn"
              disabled={cargando}
            >
              {cargando ? "Guardando..." : "Guardar grupo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PreviewEditarGrupo({ onCerrar, filaSeleccionada }) {
  const [nombre, setNombre] = useState(filaSeleccionada?.nombre ?? "");
  const [turno, setTurno] = useState(filaSeleccionada?.turno ?? "");
  const [materia, setMateria] = useState(filaSeleccionada?.materia ?? "");

  return (
    <div className="modal-overlay">
      <div className="modal" style={modalStyle()}>
        <h2 style={titleStyle()}>Editar grupo</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={fieldStyle()}>
            <label>Nombre del grupo</label>
            <input
              style={inputStyle()}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div style={fieldStyle()}>
            <label>Turno</label>
            <select
              style={inputStyle()}
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
            >
              <option value="">Selecciona un turno</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Mixto">Mixto</option>
            </select>
          </div>

          <div style={fieldStyle()}>
            <label>Materia</label>
            <input
              style={inputStyle()}
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
            />
          </div>
        </div>

        <div style={actionsStyle()}>
          <button className="cancelar-btn" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="guardar-btn" onClick={onCerrar}>
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewVerGrupo({ onCerrar, id, filaSeleccionada }) {
  const nombre  = filaSeleccionada?.nombre  ?? "";
  const turno   = filaSeleccionada?.turno   ?? "";
  const materia = filaSeleccionada?.materia ?? "";

  const [listaAlumnos, setListaAlumnos] = useState(
    () => alumnosPorGrupo[id] ? [...alumnosPorGrupo[id]] : []
  );
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroBoleta, setFiltroBoleta] = useState("");

  const alumnosFiltrados = listaAlumnos.filter((alumno) => {
    const nombreCoincide = alumno.nombre
      .toLowerCase()
      .includes(filtroNombre.toLowerCase());
    const idCoincide = (alumno.idUnico ?? "")
      .toLowerCase()
      .includes(filtroBoleta.toLowerCase());
    return nombreCoincide && idCoincide;
  });

  return (
    <>
      <div className="modal-overlay">
        <div
          className="modal"
          style={{
            // ===== CAMBIO: panel más grande =====
            width: "min(1280px, 98vw)",
            maxWidth: "1280px",
            maxHeight: "90vh",
            background: "#ffffff",
            borderRadius: "24px",
            padding: "36px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.16)",
            boxSizing: "border-box",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "28px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "2.4rem",
                  fontWeight: 900,
                  color: "#0f172a",
                }}
              >
                Detalle del grupo
              </h2>

            </div>

            <button
              className="cancelar-btn"
              onClick={onCerrar}
              style={{
                minWidth: "180px",
                padding: "14px 18px",
              }}
            >
              Cerrar
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #d9e2ec",
                borderRadius: "18px",
                padding: "20px",
                minWidth: 0,
              }}
            >
              <strong style={{ display: "block", marginBottom: "10px" }}>
                Grupo
              </strong>
              <div>{nombre}</div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #d9e2ec",
                borderRadius: "18px",
                padding: "20px",
                minWidth: 0,
              }}
            >
              <strong style={{ display: "block", marginBottom: "10px" }}>
                Turno
              </strong>
              <div>{turno}</div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #d9e2ec",
                borderRadius: "18px",
                padding: "20px",
                minWidth: 0,
              }}
            >
              <strong style={{ display: "block", marginBottom: "10px" }}>
                Materia
              </strong>
              <div>{materia}</div>
            </div>

          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginTop: "8px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#1e293b" }}>
                Alumnos del grupo
              </h3>
              <span
                style={{
                  background: "#eef8e5",
                  color: "#3a6e28",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  border: "1px solid #c4e0a8",
                }}
              >
                {listaAlumnos.length} inscritos
              </span>
            </div>

            
          </div>

          {/* ===== NUEVO: filtros ===== */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontWeight: 600, color: "#334155" }}>
                Filtrar por nombre
              </label>
              <input
                type="text"
                placeholder="Escribe el nombre..."
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontWeight: 600, color: "#334155" }}>
                Filtrar por ID Único
              </label>
              <input
                type="text"
                placeholder="Escribe el ID Único..."
                value={filtroBoleta}
                onChange={(e) => setFiltroBoleta(e.target.value)}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div
            style={{
              width: "100%",
              overflowX: "auto",
              borderRadius: "22px",
              border: "1px solid #dfe7dc",
              background: "#ffffff",
              boxSizing: "border-box",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "760px",
                borderCollapse: "separate",
                borderSpacing: 0,
              }}
            >
              <thead>
                <tr>
                  <th style={headerCellStyle(true, false)}>ID</th>
                  <th style={headerCellStyle(false, false)}>NOMBRE</th>
                  <th style={headerCellStyle(false, false)}>ID ÚNICO</th>
                  <th style={{ ...headerCellStyle(false, true), textAlign: "center" }}>ACCIÓN</th>
                </tr>
              </thead>

              <tbody>
                {alumnosFiltrados.map((alumno, index) => (
                  <tr
                    key={alumno.id}
                    style={{
                      background: index % 2 === 0 ? "#f3f8ef" : "#ffffff",
                    }}
                  >
                    <td style={bodyCellStyle()}>{alumno.id}</td>
                    <td style={bodyCellStyle()}>{alumno.nombre}</td>
                    <td style={{ ...bodyCellStyle(), fontFamily: "monospace", fontSize: "0.88rem" }}>{alumno.idUnico}</td>

                    {/* ===== NUEVO: botón Ver ===== */}
                    <td style={{ ...bodyCellStyle(), textAlign: "center" }}>
                      <button
                        type="button"
                        className="btn btn-ver"
                        onClick={() =>
                          setAlumnoSeleccionado({
                            ...alumno,
                            grupo: nombre,
                          })
                        }
                        style={{ minWidth: "110px" }}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {mostrarCrear && (
        <PreviewCrearAlumno
          onCerrar={() => setMostrarCrear(false)}
          grupoInicial={nombre}
          grupoId={id}
          onAlumnoCreado={(nuevo) =>
            setListaAlumnos((prev) => [...prev, nuevo])
          }
        />
      )}

      {alumnoSeleccionado && (
        <PreviewVerAlumno
          onCerrar={() => setAlumnoSeleccionado(null)}
          filaSeleccionada={alumnoSeleccionado}
        />
      )}
    </>
  );
}

function headerCellStyle(isFirst, isLast) {
  return {
    background: "#5cad6b",
    color: "#ffffff",
    textAlign: "left",
    padding: "18px 20px",
    fontSize: "1rem",
    fontWeight: 800,
    borderTopLeftRadius: isFirst ? "20px" : undefined,
    borderTopRightRadius: isLast ? "20px" : undefined,
  };
}

function bodyCellStyle() {
  return {
    padding: "18px 20px",
    borderBottom: "1px solid #e6eee1",
    verticalAlign: "middle",
  };
}

function actionBtnStyle(color) {
  return {
    padding: "10px 14px",
    borderRadius: "14px",
    border: "none",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    background: color,
  };
}

/* =========================
   MODALES DE ALUMNOS
========================= */

function PreviewCrearAlumno({
  onCerrar,
  setActualizado,
  grupoInicial = "",
  grupoId = null,
  onAlumnoCreado,
}) {
  const esPreFilled = Boolean(grupoInicial);
  const [nombre, setNombre] = useState("");
  const [grupoSelec, setGrupoSelec] = useState("");
  const [cargando, setCargando] = useState(false);

  const resolverGrupo = () => {
    if (esPreFilled) return { id: grupoId, nombre: grupoInicial };
    const encontrado = gruposMock.find((g) => g.nombre === grupoSelec);
    return encontrado
      ? { id: encontrado.id, nombre: encontrado.nombre }
      : { id: null, nombre: "" };
  };

  const idPreview = (() => {
    const { id: gId, nombre: gNombre } = resolverGrupo();
    if (!nombre.trim() || gId == null) return "Sin asignar";
    const consecutivo = (alumnosPorGrupo[gId]?.length ?? 0) + 1;
    const codigoBase = generarCodigoBase(nombre, gNombre);
    return generarCodigoVisible(codigoBase, consecutivo);
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    await new Promise((r) => setTimeout(r, 500));

    const { id: gId, nombre: gNombre } = resolverGrupo();

    let idUnico = "Sin asignar";
    if (gId != null) {
      const consecutivo = (alumnosPorGrupo[gId]?.length ?? 0) + 1;
      const codigoBase  = generarCodigoBase(nombre, gNombre);
      idUnico = generarCodigoVisible(codigoBase, consecutivo);
    }

    const nuevo = { id: nextAlumnoId++, nombre, idUnico };

    alumnosMock.push({ ...nuevo, grupo: gNombre || "Sin asignar" });

    if (gId != null) {
      if (!alumnosPorGrupo[gId]) alumnosPorGrupo[gId] = [];
      alumnosPorGrupo[gId].push(nuevo);
    }

    if (setActualizado) setActualizado((prev) => !prev);
    if (onAlumnoCreado) onAlumnoCreado(nuevo);

    await Swal.fire({
      title: "Alumno registrado",
      text:
        idUnico === "Sin asignar"
          ? `${nombre} fue registrado sin grupo.`
          : `${nombre} registrado con ID: ${idUnico}`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
    setCargando(false);
    onCerrar();
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={modalStyle()}>
        <h2 style={titleStyle()}>Crear nuevo alumno</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={fieldStyle()}>
              <label>Nombre completo</label>
              <input
                style={inputStyle()}
                placeholder="Ej. Carlos Ruiz"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div style={fieldStyle()}>
              <label>Grupo</label>
              {esPreFilled ? (
                <input
                  style={{ ...inputStyle(), background: "#f1f5f9", color: "#64748b" }}
                  value={grupoInicial}
                  readOnly
                />
              ) : (
                <select
                  style={inputStyle()}
                  value={grupoSelec}
                  onChange={(e) => setGrupoSelec(e.target.value)}
                >
                  <option value="">Sin grupo</option>
                  {gruposMock.map((g) => (
                    <option key={g.id} value={g.nombre}>
                      {g.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div style={fieldStyle()}>
              <label>ID Único</label>
              <input
                style={{
                  ...inputStyle(),
                  background: "#f1f5f9",
                  color: idPreview === "Sin asignar" ? "#94a3b8" : "#1e293b",
                  fontFamily: "monospace",
                  fontWeight: idPreview !== "Sin asignar" ? 700 : 400,
                }}
                value={idPreview}
                readOnly
              />
            </div>
          </div>

          <div style={actionsStyle()}>
            <button
              type="button"
              className="cancelar-btn"
              onClick={onCerrar}
              disabled={cargando}
            >
              Cancelar
            </button>
            <button type="submit" className="guardar-btn" disabled={cargando}>
              {cargando ? "Guardando..." : "Guardar alumno"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PreviewEditarAlumno({ onCerrar, filaSeleccionada, onGuardado }) {
  const [nombre, setNombre] = useState(filaSeleccionada?.nombre ?? "");
  const [grupo, setGrupo] = useState(filaSeleccionada?.grupo ?? "Sin asignar");

  const idPreview = (() => {
    if (grupo === "Sin asignar" || !nombre.trim()) return "Sin asignar";

    // Group unchanged and already has a valid ID — keep it
    if (
      grupo === (filaSeleccionada?.grupo ?? "Sin asignar") &&
      filaSeleccionada?.idUnico &&
      filaSeleccionada.idUnico !== "Sin asignar"
    ) {
      return filaSeleccionada.idUnico;
    }

    // Group changed (or was "Sin asignar") — generate new ID
    const grupoObj = gruposMock.find((g) => g.nombre === grupo);
    if (!grupoObj) return "Sin asignar";

    const existentes = (alumnosPorGrupo[grupoObj.id] ?? []).filter(
      (a) => a.id !== filaSeleccionada?.id
    ).length;
    const codigoBase = generarCodigoBase(nombre, grupo);
    return generarCodigoVisible(codigoBase, existentes + 1);
  })();

  const handleGuardar = () => {
    const grupoAnterior = filaSeleccionada?.grupo ?? "Sin asignar";

    // Remove from old group in alumnosPorGrupo
    if (grupoAnterior !== "Sin asignar") {
      const oldObj = gruposMock.find((g) => g.nombre === grupoAnterior);
      if (oldObj && alumnosPorGrupo[oldObj.id]) {
        alumnosPorGrupo[oldObj.id] = alumnosPorGrupo[oldObj.id].filter(
          (a) => a.id !== filaSeleccionada.id
        );
      }
    }

    // Add to new group in alumnosPorGrupo
    if (grupo !== "Sin asignar") {
      const newObj = gruposMock.find((g) => g.nombre === grupo);
      if (newObj) {
        if (!alumnosPorGrupo[newObj.id]) alumnosPorGrupo[newObj.id] = [];
        const yaExiste = alumnosPorGrupo[newObj.id].some(
          (a) => a.id === filaSeleccionada.id
        );
        if (!yaExiste) {
          alumnosPorGrupo[newObj.id].push({
            id: filaSeleccionada.id,
            nombre,
            idUnico: idPreview,
          });
        }
      }
    }

    // Update alumnosMock
    const idx = alumnosMock.findIndex((a) => a.id === filaSeleccionada.id);
    if (idx !== -1) {
      alumnosMock[idx] = {
        ...alumnosMock[idx],
        nombre,
        grupo,
        idUnico: idPreview,
      };
    }

    if (onGuardado) onGuardado();
    onCerrar();
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={modalStyle()}>
        <h2 style={titleStyle()}>Editar alumno</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={fieldStyle()}>
            <label>Nombre</label>
            <input
              style={inputStyle()}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div style={fieldStyle()}>
            <label>Grupo</label>
            <select
              style={inputStyle()}
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
            >
              <option value="Sin asignar">Sin asignar</option>
              {gruposMock.map((g) => (
                <option key={g.id} value={g.nombre}>{g.nombre}</option>
              ))}
            </select>
          </div>

          <div style={fieldStyle()}>
            <label>ID Único</label>
            <input
              style={{
                ...inputStyle(),
                background: "#f1f5f9",
                color: idPreview === "Sin asignar" ? "#94a3b8" : "#1e293b",
                fontFamily: "monospace",
                fontWeight: idPreview !== "Sin asignar" ? 700 : 400,
              }}
              value={idPreview}
              readOnly
            />
          </div>
        </div>

        <div style={actionsStyle()}>
          <button className="cancelar-btn" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="guardar-btn" onClick={handleGuardar}>
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewVerAlumno({ onCerrar, filaSeleccionada }) {
  const nombre  = filaSeleccionada?.nombre  ?? "";
  const idUnico = filaSeleccionada?.idUnico ?? "Sin asignar";
  const grupo   = filaSeleccionada?.grupo   ?? "Sin asignar";

  const card = (label, value, mono = false) => (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "14px",
      }}
    >
      <strong style={{ fontSize: "0.82rem", color: "#64748b", textTransform: "uppercase" }}>
        {label}
      </strong>
      <div style={{ marginTop: "6px", fontFamily: mono ? "monospace" : "inherit" }}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal" style={modalStyle("min(560px, 92vw)")}>
        <h2 style={titleStyle()}>Detalle del alumno</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {card("Nombre", nombre)}
          {card("Grupo", grupo)}
          {card("ID Único", idUnico, true)}
        </div>

        <div style={actionsStyle()}>
          <button className="cancelar-btn" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   EXPORTS
========================= */

export function PreviewDocentes() {
  return (
    <Tabla
      Crear={ModalDummy}
      obtenerDatos={obtenerDocentesMock}
      titulo="docentes"
      Borrar={borrarMock}
      Editar={ModalDummy}
    />
  );
}

export function PreviewAlumnos() {
  const [lista, setLista] = useState(() => [...alumnosMock]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroId, setFiltroId] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("Todos");
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [alumnoVer, setAlumnoVer] = useState(null);
  const [alumnoEditar, setAlumnoEditar] = useState(null);

  const refrescar = () => setLista([...alumnosMock]);

  const listaFiltrada = lista
    .filter((a) => {
      const matchNombre = a.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      const matchId = (a.idUnico ?? "").toLowerCase().includes(filtroId.toLowerCase());
      const matchGrupo =
        filtroGrupo === "Todos" || a.grupo === filtroGrupo;
      return matchNombre && matchId && matchGrupo;
    })
    .sort((a, b) => {
      const aSin = a.grupo === "Sin asignar" ? 0 : 1;
      const bSin = b.grupo === "Sin asignar" ? 0 : 1;
      return aSin - bSin;
    });

  const handleEliminar = async (alumno) => {
    const result = await Swal.fire({
      title: "Confirmación requerida",
      html: "Ingresa la contraseña de tu usuario para eliminar el alumno.",
      icon: "warning",
      input: "password",
      inputPlaceholder: "Contraseña",
      inputAttributes: { autocapitalize: "off", autocorrect: "off" },
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
      preConfirm: async (value) => {
        if (!value) {
          Swal.showValidationMessage("Debes ingresar tu contraseña para confirmar.");
          return false;
        }
        const esValida = await verificarContraseña(value);
        if (!esValida) {
          Swal.showValidationMessage("Esa no es la contraseña correcta. Inténtalo de nuevo.");
          return false;
        }
        return value;
      },
    });

    if (!result.isConfirmed || !result.value) return;

    const idx = alumnosMock.findIndex((a) => a.id === alumno.id);
    if (idx !== -1) alumnosMock.splice(idx, 1);

    for (const gId of Object.keys(alumnosPorGrupo)) {
      const aIdx = alumnosPorGrupo[gId].findIndex((a) => a.id === alumno.id);
      if (aIdx !== -1) { alumnosPorGrupo[gId].splice(aIdx, 1); break; }
    }

    refrescar();

    await Swal.fire({
      title: "Eliminado",
      text: "Alumno eliminado correctamente.",
      icon: "success",
      timer: 1600,
      showConfirmButton: false,
    });
  };

  return (
    <section className="tabla-container">
      <div className="tabla-decor tabla-decor--one" />
      <div className="tabla-decor tabla-decor--two" />

      <div className="tabla-hero">
        <div className="tabla-hero-copy">
          <h1>Lista de alumnos</h1>
          <p>Consulta y organiza a tus alumnos de forma sencilla.</p>
        </div>
        <div className="ejercicios-header">
          <button className="crear-btn" onClick={() => setMostrarCrear(true)}>
            + Crear nuevo alumno
          </button>
        </div>
      </div>

      <div style={{ padding: "0 32px 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
        <div style={fieldStyle()}>
          <label style={{ fontWeight: 600, color: "#334155" }}>Filtrar por nombre</label>
          <input
            type="text"
            placeholder="Escribe el nombre..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            style={inputStyle()}
          />
        </div>
        <div style={fieldStyle()}>
          <label style={{ fontWeight: 600, color: "#334155" }}>Filtrar por ID Único</label>
          <input
            type="text"
            placeholder="Escribe el ID..."
            value={filtroId}
            onChange={(e) => setFiltroId(e.target.value)}
            style={inputStyle()}
          />
        </div>
        <div style={fieldStyle()}>
          <label style={{ fontWeight: 600, color: "#334155" }}>Filtrar por grupo</label>
          <select
            value={filtroGrupo}
            onChange={(e) => setFiltroGrupo(e.target.value)}
            style={inputStyle()}
          >
            <option value="Todos">Todos</option>
            <option value="Sin asignar">Sin asignar</option>
            {gruposMock.map((g) => (
              <option key={g.id} value={g.nombre}>{g.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="tabla-wrap">
        <table className="tabla">
          <thead>
            <tr>
              <th>nombre</th>
              <th>idUnico</th>
              <th>grupo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaFiltrada.length > 0 ? (
              listaFiltrada.map((alumno) => (
                <tr key={alumno.id}>
                  <td>{alumno.nombre}</td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>{alumno.idUnico}</td>
                  <td>{alumno.grupo}</td>
                  <td className="acciones">
                    <button type="button" className="btn btn-ver" onClick={() => setAlumnoVer(alumno)}>Ver</button>
                    <button type="button" className="btn btn-editar" onClick={() => setAlumnoEditar(alumno)}>Editar</button>
                    <button type="button" className="btn btn-eliminar" onClick={() => handleEliminar(alumno)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>
                  <div className="tabla-empty">
                    <span className="tabla-empty-icon">🌱</span>
                    <h3>Aún no hay registros</h3>
                    <p>Cuando agregues un nuevo alumno, aparecerá aquí.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarCrear && (
        <PreviewCrearAlumno
          onCerrar={() => setMostrarCrear(false)}
          onAlumnoCreado={() => refrescar()}
        />
      )}

      {alumnoVer && (
        <PreviewVerAlumno
          onCerrar={() => setAlumnoVer(null)}
          filaSeleccionada={alumnoVer}
        />
      )}

      {alumnoEditar && (
        <PreviewEditarAlumno
          onCerrar={() => setAlumnoEditar(null)}
          filaSeleccionada={alumnoEditar}
          onGuardado={() => refrescar()}
        />
      )}
    </section>
  );
}

export function PreviewGrupos() {
  const sinGrupo = alumnosMock.filter((a) => a.grupo === "Sin asignar").length;

  return (
    <>
      {sinGrupo > 0 && (
        <div
          style={{
            margin: "18px auto 0",
            width: "min(1120px, calc(100% - 48px))",
            background: "#fff1f1",
            border: "1.5px solid #fca5a5",
            borderRadius: "16px",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#b91c1c",
            fontWeight: 700,
            fontSize: "0.97rem",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>⚠️</span>
          Hay {sinGrupo} alumno{sinGrupo > 1 ? "s" : ""} sin grupo. Asígnales uno desde el panel de alumnos.
        </div>
      )}
      <Tabla
        Crear={PreviewCrearGrupo}
        obtenerDatos={obtenerGruposMock}
        titulo="grupo"
        Ver={PreviewVerGrupo}
        Borrar={borrarMock}
        Editar={PreviewEditarGrupo}
      />
    </>
  );
}