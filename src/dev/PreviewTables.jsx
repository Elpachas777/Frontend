import { useState } from "react";
import Tabla from "../components/Tabla";

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

const alumnosMock = [
  {
    id: 1,
    nombre: "Carlos Ruiz",
    boleta: "20230001",
    correo: "carlos@alumno.com",
    grupo: "3CV1",
  },
  {
    id: 2,
    nombre: "Fernanda Díaz",
    boleta: "20230002",
    correo: "fernanda@alumno.com",
    grupo: "3CV1",
  },
  {
    id: 3,
    nombre: "Diego Torres",
    boleta: "20230003",
    correo: "diego@alumno.com",
    grupo: "4CM2",
  },
];

const gruposMock = [
  {
    id: 1,
    nombre: "3CV1",
    carrera: "Ing. Sistemas",
    semestre: 3,
  },
  {
    id: 2,
    nombre: "4CM2",
    carrera: "Ing. Computación",
    semestre: 4,
  },
  {
    id: 3,
    nombre: "5AV1",
    carrera: "Ing. IA",
    semestre: 5,
  },
];

const alumnosPorGrupo = {
  1: [
    {
      id: 1,
      nombre: "Carlos Ruiz",
      boleta: "20230001",
      correo: "carlos@alumno.com",
    },
    {
      id: 2,
      nombre: "Fernanda Díaz",
      boleta: "20230002",
      correo: "fernanda@alumno.com",
    },
  ],
  2: [
    {
      id: 3,
      nombre: "Diego Torres",
      boleta: "20230003",
      correo: "diego@alumno.com",
    },
    {
      id: 4,
      nombre: "Sofía Pérez",
      boleta: "20230004",
      correo: "sofia@alumno.com",
    },
  ],
  3: [
    {
      id: 5,
      nombre: "Miguel Herrera",
      boleta: "20230005",
      correo: "miguel@alumno.com",
    },
  ],
};

const obtenerDocentesMock = async () => docentesMock;
const obtenerAlumnosMock = async () => alumnosMock;
const obtenerGruposMock = async () => gruposMock;
const borrarMock = async () => ({ ok: true });

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

function PreviewCrearGrupo({ onCerrar }) {
  return (
    <div className="modal-overlay">
      <div className="modal" style={modalStyle()}>
        <h2 style={titleStyle()}>Crear nuevo grupo</h2>

        <div style={formGridStyle()}>
          <div style={fieldStyle()}>
            <label>Nombre del grupo</label>
            <input style={inputStyle()} placeholder="Ej. 3CV1" />
          </div>

          <div style={fieldStyle()}>
            <label>Semestre</label>
            <input style={inputStyle()} placeholder="Ej. 3" />
          </div>

          <div style={{ ...fieldStyle(), gridColumn: "1 / -1" }}>
            <label>Carrera</label>
            <input style={inputStyle()} placeholder="Ej. Ing. Sistemas" />
          </div>
        </div>

        <div style={actionsStyle()}>
          <button className="cancelar-btn" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="guardar-btn" onClick={onCerrar}>
            Guardar grupo
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewEditarGrupo({ onCerrar, id, nombre, carrera, semestre }) {
  return (
    <div className="modal-overlay">
      <div className="modal" style={modalStyle()}>
        <h2 style={titleStyle()}>Editar grupo</h2>

        <div style={formGridStyle()}>
          <div style={fieldStyle()}>
            <label>ID</label>
            <input style={inputStyle()} value={id ?? ""} readOnly />
          </div>

          <div style={fieldStyle()}>
            <label>Semestre</label>
            <input style={inputStyle()} defaultValue={semestre ?? ""} />
          </div>

          <div style={fieldStyle()}>
            <label>Nombre del grupo</label>
            <input style={inputStyle()} defaultValue={nombre ?? ""} />
          </div>

          <div style={fieldStyle()}>
            <label>Carrera</label>
            <input style={inputStyle()} defaultValue={carrera ?? ""} />
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

function PreviewVerGrupo({ onCerrar, id, nombre, carrera, semestre }) {
  const alumnos = alumnosPorGrupo[id] || [];

  return (
    <div className="modal-overlay">
      <div
        className="modal"
        style={{
          width: "min(940px, 94vw)",
          maxWidth: "940px",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "22px",
            fontSize: "2.2rem",
            fontWeight: 900,
            color: "#0f172a",
            textAlign: "center",
          }}
        >
          Detalle del grupo
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #d9e2ec",
              borderRadius: "16px",
              padding: "18px",
              minWidth: 0,
            }}
          >
            <strong style={{ display: "block", marginBottom: "8px" }}>
              Grupo
            </strong>
            <div>{nombre}</div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #d9e2ec",
              borderRadius: "16px",
              padding: "18px",
              minWidth: 0,
            }}
          >
            <strong style={{ display: "block", marginBottom: "8px" }}>
              Carrera
            </strong>
            <div>{carrera}</div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #d9e2ec",
              borderRadius: "16px",
              padding: "18px",
              minWidth: 0,
            }}
          >
            <strong style={{ display: "block", marginBottom: "8px" }}>
              Semestre
            </strong>
            <div>{semestre}</div>
          </div>
        </div>

        <h3
          style={{
            marginTop: 0,
            marginBottom: "16px",
            fontSize: "1.2rem",
            color: "#1e293b",
          }}
        >
          Alumnos del grupo
        </h3>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
            borderRadius: "20px",
            border: "1px solid #dfe7dc",
            background: "#ffffff",
            boxSizing: "border-box",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: "0",
              borderCollapse: "separate",
              borderSpacing: 0,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    background: "#5cad6b",
                    color: "#ffffff",
                    textAlign: "left",
                    padding: "18px 20px",
                    fontSize: "1rem",
                    fontWeight: 800,
                    borderTopLeftRadius: "20px",
                  }}
                >
                  id
                </th>
                <th
                  style={{
                    background: "#5cad6b",
                    color: "#ffffff",
                    textAlign: "left",
                    padding: "18px 20px",
                    fontSize: "1rem",
                    fontWeight: 800,
                  }}
                >
                  nombre
                </th>
                <th
                  style={{
                    background: "#5cad6b",
                    color: "#ffffff",
                    textAlign: "left",
                    padding: "18px 20px",
                    fontSize: "1rem",
                    fontWeight: 800,
                  }}
                >
                  boleta
                </th>
                <th
                  style={{
                    background: "#5cad6b",
                    color: "#ffffff",
                    textAlign: "left",
                    padding: "18px 20px",
                    fontSize: "1rem",
                    fontWeight: 800,
                    borderTopRightRadius: "20px",
                  }}
                >
                  correo
                </th>
              </tr>
            </thead>

            <tbody>
              {alumnos.map((alumno, index) => (
                <tr
                  key={alumno.id}
                  style={{
                    background: index % 2 === 0 ? "#f3f8ef" : "#ffffff",
                  }}
                >
                  <td
                    style={{
                      padding: "18px 20px",
                      borderBottom: "1px solid #e6eee1",
                    }}
                  >
                    {alumno.id}
                  </td>
                  <td
                    style={{
                      padding: "18px 20px",
                      borderBottom: "1px solid #e6eee1",
                    }}
                  >
                    {alumno.nombre}
                  </td>
                  <td
                    style={{
                      padding: "18px 20px",
                      borderBottom: "1px solid #e6eee1",
                    }}
                  >
                    {alumno.boleta}
                  </td>
                  <td
                    style={{
                      padding: "18px 20px",
                      borderBottom: "1px solid #e6eee1",
                    }}
                  >
                    {alumno.correo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "24px",
          }}
        >
          <button
            className="cancelar-btn"
            onClick={onCerrar}
            style={{
              minWidth: "220px",
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   MODALES DE ALUMNOS
========================= */

function PreviewCrearAlumno({ onCerrar }) {
  return (
    <div className="modal-overlay">
      <div className="modal" style={modalStyle()}>
        <h2 style={titleStyle()}>Crear nuevo alumno</h2>

        <div style={formGridStyle()}>
          <div style={fieldStyle()}>
            <label>Nombre</label>
            <input style={inputStyle()} placeholder="Ej. Carlos Ruiz" />
          </div>

          <div style={fieldStyle()}>
            <label>Boleta</label>
            <input style={inputStyle()} placeholder="Ej. 20230001" />
          </div>

          <div style={fieldStyle()}>
            <label>Correo</label>
            <input style={inputStyle()} placeholder="Ej. correo@alumno.com" />
          </div>

          <div style={fieldStyle()}>
            <label>Grupo</label>
            <input style={inputStyle()} placeholder="Ej. 3CV1" />
          </div>
        </div>

        <div style={actionsStyle()}>
          <button className="cancelar-btn" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="guardar-btn" onClick={onCerrar}>
            Guardar alumno
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewEditarAlumno({ onCerrar, id, nombre, boleta, correo, grupo }) {
  return (
    <div className="modal-overlay">
      <div className="modal" style={modalStyle()}>
        <h2 style={titleStyle()}>Editar alumno</h2>

        <div style={formGridStyle()}>
          <div style={fieldStyle()}>
            <label>ID</label>
            <input style={inputStyle()} value={id ?? ""} readOnly />
          </div>

          <div style={fieldStyle()}>
            <label>Boleta</label>
            <input style={inputStyle()} defaultValue={boleta ?? ""} />
          </div>

          <div style={fieldStyle()}>
            <label>Nombre</label>
            <input style={inputStyle()} defaultValue={nombre ?? ""} />
          </div>

          <div style={fieldStyle()}>
            <label>Grupo</label>
            <input style={inputStyle()} defaultValue={grupo ?? ""} />
          </div>

          <div style={{ ...fieldStyle(), gridColumn: "1 / -1" }}>
            <label>Correo</label>
            <input style={inputStyle()} defaultValue={correo ?? ""} />
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

function PreviewVerAlumno({ onCerrar, id, nombre, boleta, correo, grupo }) {
  return (
    <div className="modal-overlay">
      <div className="modal" style={modalStyle("min(640px, 92vw)")}>
        <h2 style={titleStyle()}>Detalle del alumno</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
          }}
        >
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "14px",
            }}
          >
            <strong>ID</strong>
            <div style={{ marginTop: "6px" }}>{id}</div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "14px",
            }}
          >
            <strong>Boleta</strong>
            <div style={{ marginTop: "6px" }}>{boleta}</div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "14px",
            }}
          >
            <strong>Nombre</strong>
            <div style={{ marginTop: "6px" }}>{nombre}</div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "14px",
            }}
          >
            <strong>Grupo</strong>
            <div style={{ marginTop: "6px" }}>{grupo}</div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "14px",
              gridColumn: "1 / -1",
            }}
          >
            <strong>Correo</strong>
            <div style={{ marginTop: "6px" }}>{correo}</div>
          </div>
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
  return (
    <Tabla
      Crear={PreviewCrearAlumno}
      obtenerDatos={obtenerAlumnosMock}
      titulo="alumnos"
      Ver={PreviewVerAlumno}
      Borrar={borrarMock}
      Editar={PreviewEditarAlumno}
    />
  );
}

export function PreviewGrupos() {
  return (
    <Tabla
      Crear={PreviewCrearGrupo}
      obtenerDatos={obtenerGruposMock}
      titulo="grupo"
      Ver={PreviewVerGrupo}
      Borrar={borrarMock}
      Editar={PreviewEditarGrupo}
    />
  );
}