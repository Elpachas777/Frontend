import { useCallback, useEffect, useState } from "react";
import "../RolAdmin/RolAdmin.css";
import "../components/Tabla.css";
import AgregarAlumnos from "./AgregarAlumno";
import { listarAlumnos } from "../utils/grupos";

function VerGrupo({ grupo, onCerrar, onGuardado }) {
  const [alumnos, setAlumnos] = useState([]);
  const [mostrar, setMostrar] = useState(null);
  const [eliminar, setEliminar] = useState(null);

  const cargar = useCallback(async () => {
    const alumnosArreglo = await listarAlumnos(grupo);
    setAlumnos(alumnosArreglo);
  }, [grupo]);

  useEffect(() => {
    cargar();
    onGuardado();
  }, [cargar]);

  return (
    <>
      <div className="modal-overlay modal-overlay--top">
        <div
          className="modal-card modal-card--wide"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Grupo {grupo.nombre}</h2>
            <button type="button" className="modal-close" onClick={onCerrar}>
              ✕
            </button>
          </div>

          <div className="grupo-info-row">
            <div className="grupo-info-item">
              <span className="docente-mid-label">Nombre</span>
              <span className="docente-mid-value">{grupo.nombre}</span>
            </div>
            <div className="grupo-info-item">
              <span className="docente-mid-label">Turno</span>
              <span className="docente-mid-value">{grupo.turno}</span>
            </div>
          </div>

          <h3 className="grupo-alumnos-title">Alumnos del grupo</h3>

          <div className="tabla-wrap">
            <table className="tabla">
              <thead>
                <tr>
                  <th>id de acceso</th>
                  <th>nombre</th>
                  <th>apellidos</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.length > 0 ? (
                  alumnos.map((alumno) => (
                    <tr key={alumno.id}>
                      <td>{alumno.id}</td>
                      <td>{alumno.nombres}</td>
                      <td>{alumno.apellidos}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2}>
                      <div className="tabla-empty">
                        <span className="tabla-empty-icon">🌱</span>
                        <h3>Sin alumnos</h3>
                        <p>Este grupo no tiene alumnos asignados.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="modal-actions" style={{ marginTop: "20px" }}>
            <button
              type="button"
              className="modal-btn-save"
              onClick={() => setMostrar(true)}
            >
              Agregar Alumnos
            </button>
            <button
              type="button"
              className="modal-btn-delete"
              onClick={() => setEliminar(true)}
            >
              Eliminar Alumnos
            </button>
          </div>
        </div>
      </div>

      {mostrar && (
        <AgregarAlumnos
          grupoId={grupo.id}
          grupoNombre={grupo.nombre}
          onCerrar={() => setMostrar(null)}
          onGuardado={() => cargar()}
        />
      )}

      {eliminar && (
        <AgregarAlumnos
          grupoId={grupo.id}
          grupoNombre={grupo.nombre}
          onCerrar={() => setEliminar(null)}
          onGuardado={() => cargar()}
          guardar = {false}
        />
      )}
    </>
  );
}

export default VerGrupo;
