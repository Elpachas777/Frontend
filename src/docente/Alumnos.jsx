import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { eliminar } from "../api/alumno.api";
import "../components/Tabla.css";
import "../RolAdmin/RolAdmin.css";
import { comprobarContraseña } from "../utils/admin";
import { listar } from "../utils/alumnos";
import CrearAlumno from "./CrearAlumno";
import EditarAlumno from "./EditarAlumno";
import VerAlumnoDetalle from "./VerAlumnoDetalle";

function Alumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroApellidos, setFiltroApellidos] = useState("");
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarVer, setMostrarVer] = useState(false);
  const [seleccionada, setSeleccionada] = useState(null);

  const cargar = useCallback(async () => {
    const alumnosArreglo = await listar();
    setAlumnos(alumnosArreglo);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleEliminar = async (alumno) => {
    const result = await Swal.fire({
      title: "Confirmación requerida",
      html: "Ingresa la contraseña del administrador para eliminar la alumno.",
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
          Swal.showValidationMessage("Ingresa tu contraseña para confirmar.");
          return false;
        }
        const valida = await comprobarContraseña(value);
        if (!valida) {
          Swal.showValidationMessage(
            "Contraseña incorrecta. Inténtalo de nuevo.",
          );
          return false;
        }
        return value;
      },
    });

    if (!result.isConfirmed) return;

    await eliminar(alumno.id);

    await Swal.fire({
      title: "Eliminada",
      text: "alumno eliminada correctamente.",
      icon: "success",
      timer: 1600,
      showConfirmButton: false,
    });
    cargar();
  };

  return (
    <section className="tabla-container">
      <div className="tabla-decor tabla-decor--one" />
      <div className="tabla-decor tabla-decor--two" />

      <div className="tabla-hero">
        <div className="tabla-hero-copy">
          <h1>Lista de alumnos</h1>
          <p>Gestiona los alumnos registrados en el sistema.</p>
        </div>
        <button className="crear-btn" onClick={() => setMostrarCrear(true)}>
          + Crear nuevo alumno
        </button>
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
              <th>id</th>
              <th>nombre</th>
              <th>apellidos</th>
              <th>Acciones</th>
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
                    <td>{alumno.id}</td>
                    <td>{alumno.nombres}</td>
                    <td>{alumno.apellidos}</td>
                    <td className="acciones">
                      <button
                        type="button"
                        className="btn btn-ver"
                        onClick={() => {
                          setSeleccionada(alumno);
                          setMostrarVer(true);
                        }}
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        className="btn btn-editar"
                        onClick={() => {
                          setSeleccionada(alumno);
                          setMostrarEditar(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-eliminar"
                        onClick={() => handleEliminar(alumno)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <div className="tabla-empty">
                      <span className="tabla-empty-icon">🌱</span>
                      <h3>Sin alumnos registradas</h3>
                      <p>Crea el primer alumno para comenzar.</p>
                    </div>
                  </td>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>

      {mostrarVer && seleccionada && (
        <VerAlumnoDetalle
          alumno={seleccionada}
          onCerrar={() => {
            setMostrarVer(false);
            setSeleccionada(null);
          }}
        />
      )}

      {mostrarCrear && (
        <CrearAlumno
          onCerrar={() => setMostrarCrear(false)}
          onGuardado={() => {
            setMostrarCrear(false);
            cargar();
          }}
        />
      )}

      {mostrarEditar && seleccionada && (
        <EditarAlumno
          alumno={seleccionada}
          onCerrar={() => {
            setMostrarEditar(false);
            setSeleccionada(null);
          }}
          onGuardado={() => {
            setMostrarEditar(false);
            setSeleccionada(null);
            cargar();
          }}
        />
      )}
    </section>
  );
}

export default Alumnos;