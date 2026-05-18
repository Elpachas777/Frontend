import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { reenviarVerificacion } from "../api/docente.api";
import "../components/Tabla.css";
import { obtenerDocentes } from "../utils/docentes";
import { obtenerEscuelas } from "../utils/escuela";
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
  const [reenviandoId, setReenviandoId] = useState(null);

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

  const handleReenviar = async (docente) => {
    if (reenviandoId) return;

    const confirm = await Swal.fire({
      title: "Reenviar correo de verificación",
      html: `¿Enviar nuevamente el correo de verificación a <strong>${docente.correo}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, reenviar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#7bc043",
      cancelButtonColor: "#6c757d",
    });

    if (!confirm.isConfirmed) return;

    try {
      setReenviandoId(docente.id);
      const res = await reenviarVerificacion(docente.id);

      await Swal.fire({
        icon: "success",
        title: "Correo enviado",
        text: res?.mensaje || `Se reenvió el correo a ${docente.correo}.`,
        timer: 2200,
        showConfirmButton: false,
      });

      await cargar();
    } catch (error) {
      const datos = error?.response?.data || {};
      await Swal.fire({
        icon: "error",
        title: "No se pudo reenviar",
        text:
          datos.mensaje ||
          "Ocurrió un error al reenviar el correo. Intenta de nuevo.",
      });
    } finally {
      setReenviandoId(null);
    }
  };

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
              <th>ID</th>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Escuela</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docentesFiltrados.length > 0 ? (
              docentesFiltrados.map((docente) => {
                const estado =
                  docente.estado ||
                  (docente.habilitado ? "Verificado" : "Pendiente");
                const verificado = estado === "Verificado";

                return (
                  <tr key={docente.id}>
                    <td>{docente.id}</td>
                    <td>
                      {docente.foto ? (
                        <img
                          src={docente.foto}
                          alt={docente.nombre}
                          className="escuela-logo-thumb"
                        />
                      ) : (
                        <span className="tabla-sin-foto">Sin foto</span>
                      )}
                    </td>
                    <td>{docente.nombre}</td>
                    <td>{docente.escuela.nombre}</td>
                    <td>{docente.correo}</td>
                    <td>
                      <span
                        className={`tabla-chip ${
                          verificado ? "tabla-chip--ok" : "tabla-chip--pend"
                        }`}
                      >
                        {verificado ? "✓ " : "● "}
                        {estado}
                      </span>
                    </td>
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
                      {!verificado && (
                        <button
                          type="button"
                          className="btn btn-reenviar"
                          onClick={() => handleReenviar(docente)}
                          disabled={reenviandoId === docente.id}
                          title={`Reenviar correo a ${docente.correo}`}
                        >
                          {reenviandoId === docente.id
                            ? "Enviando…"
                            : "Reenviar correo"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7}>
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
            setMostrarEditar(false);
            setSeleccionado(null);
            cargar();
          }}
        />
      )}
    </section>
  );
}

export default DocentesAdmin;