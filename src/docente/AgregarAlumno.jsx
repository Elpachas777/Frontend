import { useCallback, useEffect, useState } from "react";
import "sweetalert2/dist/sweetalert2.min.css";
import "../components/Tabla.css";
import "../RolAdmin/RolAdmin.css";
import { listar } from "../utils/alumnos";
import { agregar, eliminarAlumno, listarAlumnos } from "../utils/grupos";

function AgregarAlumnos({
  grupoId,
  grupoNombre,
  onCerrar,
  onGuardado,
  guardar = true,
}) {
  const [alumnos, setAlumnos] = useState([]);
  const [errores, setErrores] = useState({});
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroApellidos, setFiltroApellidos] = useState("");
  const [alumnosSelect, setAlumnosSelect] = useState([]);

  const cargar = useCallback(async () => {
    const alumnosArreglo = await listar();

    const alumnosSinGrupo = alumnosArreglo.filter(
      (alumno) => !alumno.grupo || alumno.grupo.trim() === "",
    );

    setAlumnos(alumnosSinGrupo);
  }, []);

  const eliminar = useCallback(async () => {
    const alumnosGrupo = await listarAlumnos({ id: grupoId });
    setAlumnos(alumnosGrupo);
  }, [grupoId]);

  const handleChange = (alumno) => {
    setAlumnosSelect((prev) =>
      prev.some((item) => item.id === alumno.id)
        ? prev.filter((item) => item.id !== alumno.id)
        : [...prev, { id: alumno.id, apellidos: alumno.apellidos }],
    );
  };

  const handleClick = async () => {
    if (alumnosSelect.length === 0) {
      setErrores({ general: "Selecciona al menos un alumno." });
      return;
    }

    await agregar({ grupoId, grupoNombre, alumnosSelect }, { onGuardado });

    setAlumnosSelect([]);
    cargar();
  };
  const handleEliminar = async () => {
    await eliminarAlumno(grupoId, { alumnosSelect, setErrores, onGuardado });
    eliminar();
  };

  useEffect(() => {
    if (guardar) {
      cargar();
    } else {
      eliminar();
    }
  }, [guardar, cargar, eliminar]);

  return (
    <div className="modal-overlay modal-overlay--top">
      <section className="tabla-container">
        <div className="tabla-decor tabla-decor--one" />
        <div className="tabla-decor tabla-decor--two" />

        <div className="tabla-hero">
          <div className="tabla-hero-copy">
            <h1>Lista de alumnos</h1>
            <p>Agrega los alumnos que desees al grupo</p>
          </div>
        </div>

        <div className="tabla-filtros">
          <input
            name="filtro-alumno"
            className="tabla-filtro-input"
            type="text"
            placeholder="Buscar por nombre..."
            value={filtroNombre}
            onChange={(ev) => setFiltroNombre(ev.target.value)}
          />
          <input
            name="filtro-apellido"
            className="tabla-filtro-input"
            type="text"
            placeholder="Buscar por apellidos..."
            value={filtroApellidos}
            onChange={(ev) => setFiltroApellidos(ev.target.value)}
          />
        </div>

        <div className="tabla-wrap">
          <table className="tabla">
            <thead>
              <tr>
                <th>Seleccionar</th>
                <th>id</th>
                <th>nombre</th>
                <th>apellidos</th>
                {guardar && <th>grupo</th>}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const n = filtroNombre.toLowerCase();
                const a = filtroApellidos.toLowerCase();
                const filtradas = alumnos.filter(
                  (alumno) =>
                    (!n || alumno.nombres?.toLowerCase().includes(n)) &&
                    (!a || alumno.apellidos?.toLowerCase().includes(a)),
                );
                return filtradas.length > 0 ? (
                  filtradas.map((alumno) => (
                    <tr key={alumno.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={alumnosSelect.some(
                            (item) => item.id === alumno.id,
                          )}
                          onChange={() =>
                            handleChange({
                              id: alumno.id,
                              apellidos: alumno.apellidos,
                            })
                          }
                        ></input>
                      </td>
                      <td>{alumno.id}</td>
                      <td>{alumno.nombres}</td>
                      <td>{alumno.apellidos}</td>
                      {guardar && <td>{alumno.grupo || ""}</td>}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={guardar ? 5 : 4}>
                      <div className="tabla-empty">
                        <span className="tabla-empty-icon">🌱</span>
                        <h3>Sin alumnos disponibles</h3>
                        <p>Crea otros alumnos para agregar.</p>
                      </div>
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>
        <div className="modal-actions" style={{ marginTop: "20px" }}>
          {guardar ? (
            <button
              type="button"
              className="modal-btn-save"
              onClick={handleClick}
            >
              Agregar Alumno
            </button>
          ) : (
            <button
              type="button"
              className="modal-btn-delete"
              onClick={handleEliminar}
            >
              Eliminar Alumno
            </button>
          )}
          <button type="button" className="modal-btn-cancel" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </section>
    </div>
  );
}

export default AgregarAlumnos;
