import { useState, useEffect, useCallback } from "react";
import "../components/Tabla.css";
import "./RolAdmin.css";
import { getDocentes, getEscuelas } from "./mockData";
import CrearDocente from "./CrearDocente";
import EditarDocente from "./EditarDocente";
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

  const cargar = useCallback(() => {
    setDocentes(getDocentes());
    setEscuelas(getEscuelas());
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const docentesFiltrados = docentes.filter((d) => {
    const matchNombre = d.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const matchEscuela = filtroEscuela === "" || d.escuela === filtroEscuela;
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
            {escuelas.map((e) => (
              <option key={e.id} value={e.nombre}>{e.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="tabla-wrap">
        <table className="tabla">
          <thead>
            <tr>
              <th>id</th>
              <th>nombre</th>
              <th>escuela</th>
              <th>correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docentesFiltrados.length > 0 ? (
              docentesFiltrados.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.nombre}</td>
                  <td>{d.escuela}</td>
                  <td>{d.correo}</td>
                  <td className="acciones">
                    <button
                      type="button"
                      className="btn btn-ver"
                      onClick={() => { setSeleccionado(d); setMostrarVer(true); }}
                    >Ver</button>
                    <button
                      type="button"
                      className="btn btn-editar"
                      onClick={() => { setSeleccionado(d); setMostrarEditar(true); }}
                    >Editar</button>
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
          onCerrar={() => { setMostrarVer(false); setSeleccionado(null); }}
          onEliminado={() => { setMostrarVer(false); setSeleccionado(null); cargar(); }}
        />
      )}

      {mostrarCrear && (
        <CrearDocente
          escuelas={escuelas}
          onCerrar={() => setMostrarCrear(false)}
          onGuardado={() => { setMostrarCrear(false); cargar(); }}
        />
      )}

      {mostrarEditar && seleccionado && (
        <EditarDocente
          docente={seleccionado}
          escuelas={escuelas}
          onCerrar={() => { setMostrarEditar(false); setSeleccionado(null); }}
          onGuardado={() => { setMostrarEditar(false); setSeleccionado(null); cargar(); }}
        />
      )}
    </section>
  );
}

export default DocentesAdmin;
