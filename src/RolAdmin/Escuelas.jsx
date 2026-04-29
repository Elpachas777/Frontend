import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { verificarContraseña } from "../api/sesion.api";
import "../components/Tabla.css";
import CrearEscuela from "./CrearEscuela";
import EditarEscuela from "./EditarEscuela";
import "./RolAdmin.css";
import VerEscuela from "./VerEscuela";
import { getEscuelas, saveEscuelas } from "./mockData";

function Escuelas() {
  const [escuelas, setEscuelas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroDirector, setFiltroDirector] = useState("");
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarVer, setMostrarVer] = useState(false);
  const [seleccionada, setSeleccionada] = useState(null);

  const cargar = useCallback(() => {
    setEscuelas(getEscuelas());
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleEliminar = async (escuela) => {
    const result = await Swal.fire({
      title: "Confirmación requerida",
      html: "Ingresa la contraseña del administrador para eliminar la escuela.",
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
        const valida = await verificarContraseña(value);
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

    const actualizadas = escuelas.filter((e) => e.id !== escuela.id);
    saveEscuelas(actualizadas);
    setEscuelas(actualizadas);

    await Swal.fire({
      title: "Eliminada",
      text: "Escuela eliminada correctamente.",
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
          <h1>Lista de escuelas</h1>
          <p>Gestiona las escuelas registradas en el sistema.</p>
        </div>
        <button className="crear-btn" onClick={() => setMostrarCrear(true)}>
          + Crear nueva escuela
        </button>
      </div>

      <div className="tabla-filtros">
        <input
          className="tabla-filtro-input"
          type="text"
          placeholder="Buscar por escuela..."
          value={filtroNombre}
          onChange={(ev) => setFiltroNombre(ev.target.value)}
        />
        <input
          className="tabla-filtro-input"
          type="text"
          placeholder="Buscar por director..."
          value={filtroDirector}
          onChange={(ev) => setFiltroDirector(ev.target.value)}
        />
      </div>

      <div className="tabla-wrap">
        <table className="tabla">
          <thead>
            <tr>
              <th>id</th>
              <th>logo</th>
              <th>nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const n = filtroNombre.toLowerCase();
              const d = filtroDirector.toLowerCase();
              const filtradas = escuelas.filter(
                (e) =>
                  (!n || e.nombre?.toLowerCase().includes(n)) &&
                  (!d || e.director?.toLowerCase().includes(d)),
              );
              return filtradas.length > 0 ? (
                filtradas.map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>
                      {e.logo ? (
                        <img
                          src={e.logo}
                          alt={e.nombre}
                          className="escuela-logo-thumb"
                        />
                      ) : (
                        <span className="escuela-logo-empty">🏫</span>
                      )}
                    </td>
                    <td>{e.nombre}</td>
                    <td className="acciones">
                      <button
                        type="button"
                        className="btn btn-ver"
                        onClick={() => {
                          setSeleccionada(e);
                          setMostrarVer(true);
                        }}
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        className="btn btn-editar"
                        onClick={() => {
                          setSeleccionada(e);
                          setMostrarEditar(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-eliminar"
                        onClick={() => handleEliminar(e)}
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
                      <h3>Sin escuelas registradas</h3>
                      <p>Crea la primera escuela para comenzar.</p>
                    </div>
                  </td>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>

      {mostrarVer && seleccionada && (
        <VerEscuela
          escuela={seleccionada}
          onCerrar={() => {
            setMostrarVer(false);
            setSeleccionada(null);
          }}
        />
      )}

      {mostrarCrear && (
        <CrearEscuela
          onCerrar={() => setMostrarCrear(false)}
          onGuardado={() => {
            setMostrarCrear(false);
            cargar();
          }}
        />
      )}

      {mostrarEditar && seleccionada && (
        <EditarEscuela
          escuela={seleccionada}
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

export default Escuelas;
