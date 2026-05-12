import { useCallback, useEffect, useState } from "react";
import "../components/Tabla.css";
import { obtenerDocentes } from "../utils/docentes";
import { obtenerEscuelas } from "../utils/escuela";
import { getDocFoto } from "../utils/logoCache";
import CrearDocente from "./CrearDocente";
import EditarDocente from "./EditarDocente";
import "./RolAdmin.css";
import VerDocente from "./VerDocente";

function DocentesAdmin() {
  const [docentes, setDocentes] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEscuela, setFiltroEscuela] = useState("");
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarVer, setMostrarVer] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);

  const cargar = useCallback(async () => {
    const docentesArreglo = await obtenerDocentes();
    const escuelasArreglo = await obtenerEscuelas();

    setDocentes(docentesArreglo);
    setEscuelas(escuelasArreglo);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const docentesFiltrados = docentes.filter((docente) => {
    const matchNombre = docente.nombre
      .toLowerCase()
      .includes(filtroNombre.toLowerCase());
    const matchEscuela =
      filtroEscuela === "" || docente.escuela.id === Number(filtroEscuela);
    return matchNombre && matchEscuela;
  });

  return (
    <section className="tabla-container">
      <div className="tabla-decor tabla-decor--one" />
      <div className="tabla-decor tabla-decor--two" />

      <div className="tabla-hero">
        <div className="tabla-hero-copy">
          <h1>Lista de docentes</h1>
          <p>Administra fácilmente a los docentes registrados.</p>
        </div>
        <button className="crear-btn" onClick={() => setMostrarCrear(true)}>
          + Crear nuevo docente
        </button>
      </div>

      <div className="admin-filtros">
        <div className="admin-filtro-grupo">
          <label>Filtrar por nombre</label>
          <input
            type="text"
            placeholder="Escribe el nombre..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
        </div>
        <div className="admin-filtro-grupo">
          <label>Filtrar por escuela</label>
          <select
            value={filtroEscuela}
            onChange={(e) => setFiltroEscuela(e.target.value)}
          >
            <option value="">Todas</option>
            {escuelas.map((escuela) => (
              <option key={escuela.id} value={escuela.id}>
                {escuela.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tabla-wrap">
        <table className="tabla">
          <thead>
            <tr>
              <th>id</th>
              <th>foto</th>
              <th>nombre</th>
              <th>escuela</th>
              <th>correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docentesFiltrados.length > 0 ? (
              docentesFiltrados.map((docente) => (
                <tr key={docente.id}>
                  <td>{docente.id}</td>
                  <td>
                    {(() => {
                      const src = docente.foto || getDocFoto(docente.correo);
                      return src
                        ? <img src={src} alt={docente.nombre} className="escuela-logo-thumb" />
                        : <span className="tabla-sin-foto">Sin foto</span>;
                    })()}
                  </td>
                  <td>{docente.nombre}</td>
                  <td>{docente.escuela.nombre}</td>
                  <td>{docente.correo}</td>
                  <td className="acciones">
                    <button
                      type="button"
                      className="btn btn-ver"
                      onClick={() => {
                        setSeleccionado(docente);
                        setMostrarVer(true);
                      }}
                    >
                      Ver
                    </button>
                    <button
                      type="button"
                      className="btn btn-editar"
                      onClick={() => {
                        setSeleccionado(docente);
                        setMostrarEditar(true);
                      }}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <div className="tabla-empty">
                    <span className="tabla-empty-icon">🌱</span>
                    <h3>Sin resultados</h3>
                    <p>No se encontraron docentes con esos filtros.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarVer && seleccionado && (
        <VerDocente
          docente={seleccionado}
          onCerrar={() => {
            setMostrarVer(false);
            setSeleccionado(null);
          }}
          onGuardado={() => {
            cargar();
          }}
          onEliminado={() => {
            setMostrarVer(false);
            setSeleccionado(null);
            cargar();
          }}
        />
      )}

      {mostrarCrear && (
        <CrearDocente
          escuelas={escuelas}
          onCerrar={() => setMostrarCrear(false)}
          onGuardado={() => {
            setMostrarCrear(false);
            cargar();
          }}
        />
      )}

      {mostrarEditar && seleccionado && (
        <EditarDocente
          docente={seleccionado}
          escuelas={escuelas}
          onCerrar={() => {
            setMostrarEditar(false);
            setSeleccionado(null);
          }}
          onGuardado={() => {
            cargar();
          }}
        />
      )}
    </section>
  );
}

export default DocentesAdmin;
