import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { eliminar } from "../api/grupo.api";
import "../components/Tabla.css";
import "../RolAdmin/RolAdmin.css";
import { comprobarContraseña } from "../utils/admin";
import { listar } from "../utils/grupos";
import CrearGrupos from "./CrearGrupos";
import EditarGrupo from "./EditarGrupo";
import VerGrupo from "./VerGrupo";

function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroTurno, setFiltroTurno] = useState("");
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarVer, setMostrarVer] = useState(false);
  const [seleccionada, setSeleccionada] = useState(null);

  const cargar = useCallback(async () => {
    const gruposArreglo = await listar();
    setGrupos(gruposArreglo);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleEliminar = async (grupo) => {
    const result = await Swal.fire({
      title: "Confirmación requerida",
      html: "Ingresa la contraseña del administrador para eliminar la grupo.",
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
    await eliminar(grupo.id);

    await Swal.fire({
      title: "Eliminada",
      text: "grupo eliminada correctamente.",
      icon: "success",
      timer: 1600,
      showConfirmButton: false,
    });
    cargar()
  };

  return (
    <section className="tabla-container">
      <div className="tabla-decor tabla-decor--one" />
      <div className="tabla-decor tabla-decor--two" />

      <div className="tabla-hero">
        <div className="tabla-hero-copy">
          <h1>Lista de grupos</h1>
          <p>Gestiona los grupos registrados en el sistema.</p>
        </div>
        <button className="crear-btn" onClick={() => setMostrarCrear(true)}>
          + Crear nuevo grupo
        </button>
      </div>

      <div className="tabla-filtros">
        <input
          name="filtro-grupo"
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
          value={filtroTurno}
          onChange={(ev) => setFiltroTurno(ev.target.value)}
        />
      </div>

      <div className="tabla-wrap">
        <table className="tabla">
          <thead>
            <tr>
              <th>id</th>
              <th>nombre</th>
              <th>turno</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const n = filtroNombre.toLowerCase();
              const t = filtroTurno.toLowerCase();
              const filtradas = grupos.filter(
                (grupo) =>
                  (!n || grupo.nombre?.toLowerCase().includes(n)) &&
                  (!t || grupo.turno?.toLowerCase().includes(t)),
              );
              return filtradas.length > 0 ? (
                filtradas.map((grupo) => (
                  <tr key={grupo.id}>
                    <td>{grupo.id}</td>
                    <td>{grupo.nombre}</td>
                    <td>{grupo.turno}</td>
                    <td className="acciones">
                      <button
                        type="button"
                        className="btn btn-ver"
                        onClick={() => {
                          setSeleccionada(grupo);
                          setMostrarVer(true);
                        }}
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        className="btn btn-editar"
                        onClick={() => {
                          setSeleccionada(grupo);
                          setMostrarEditar(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-eliminar"
                        onClick={() => handleEliminar(grupo)}
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
                      <h3>Sin grupos registradas</h3>
                      <p>Crea el primer grupo para comenzar.</p>
                    </div>
                  </td>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>

      {mostrarVer && seleccionada && (
        <VerGrupo
          grupo={seleccionada}
          onCerrar={() => {
            setMostrarVer(false);
            setSeleccionada(null);
          }}
          onGuardado={() => {
            cargar();
          }}
        />
      )}

      {mostrarCrear && (
        <CrearGrupos
          onCerrar={() => setMostrarCrear(false)}
          onGuardado={() => {
            cargar();
          }}
        />
      )}

      {mostrarEditar && seleccionada && (
        <EditarGrupo
          grupo={seleccionada}
          onCerrar={() => {
            setMostrarEditar(false);
            setSeleccionada(null);
          }}
          onGuardado={() => {
            cargar();
          }}
        />
      )}
    </section>
  );
}

export default Grupos;
