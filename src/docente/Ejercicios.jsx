import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { eliminar } from "../api/ejercicio.api";
import "../RolAdmin/RolAdmin.css";
import { comprobarContraseña } from "../utils/admin";
import { listar } from "../utils/ejercicio";
import CrearEjercicio from "./CrearEjercicio";
import EditarEjercicio from "./EditarEjercicio";
import "./Ejercicios.css";
import VerEjercicio from "./VerEjercicio";

function Ejercicios() {
  const [ejercicios, setEjercicios] = useState([]);
  const [filtroTitulo, setFiltroTItulo] = useState("");
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarVer, setMostrarVer] = useState(false);
  const [seleccionada, setSeleccionada] = useState(null);

  const cargar = useCallback(async () => {
    const ejerciciosArreglo = await listar();
    setEjercicios(ejerciciosArreglo);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleEliminar = async (ejercicio) => {
    const result = await Swal.fire({
      title: "Confirmación requerida",
      html: "Ingresa la contraseña del administrador para eliminar el ejercicio.",
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
    await eliminar(ejercicio.id_ejercicio);

    await Swal.fire({
      title: "Eliminado",
      text: "Ejercicio eliminado correctamente.",
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
          <h1>Lista de ejercicios</h1>
          <p>Gestiona los ejercicios registrados en el sistema.</p>
        </div>
        <button className="crear-btn" onClick={() => setMostrarCrear(true)}>
          + Crear nuevo ejercicio
        </button>
      </div>

      <div className="tabla-filtros">
        <input
          name="filtro-grupo"
          className="tabla-filtro-input"
          type="text"
          placeholder="Buscar por titulo..."
          value={filtroTitulo}
          onChange={(ev) => setFiltroTItulo(ev.target.value)}
        />
      </div>

      <div className="tabla-wrap">
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Fecha de inicio</th>
              <th>Fecha de finalización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const n = filtroTitulo.toLowerCase();
              const filtradas = ejercicios.filter(
                (ejercicio) =>
                  !n || ejercicio.titulo?.toLowerCase().includes(n),
              );
              const formatearFecha = (valor) => {
                if (!valor) return "—";
                const fecha = new Date(valor);
                if (isNaN(fecha.getTime())) return "—";
                return fecha.toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
              };
              // Determinamos si la fecha de finalización ya pasó.
              // Comparamos a nivel "día completo" para que el día actual
              // todavía cuente como activo (no marca como vencido hasta el
              // día siguiente).
              const yaVencio = (valor) => {
                if (!valor) return false;
                const fecha = new Date(valor);
                if (isNaN(fecha.getTime())) return false;
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                fecha.setHours(0, 0, 0, 0);
                return fecha < hoy;
              };
              return filtradas.length > 0 ? (
                filtradas.map((ejercicio) => {
                  const vencido = yaVencio(ejercicio.fecha_final);
                  return (
                    <tr key={ejercicio.id_ejercicio}>
                      <td>{ejercicio.id_ejercicio}</td>
                      <td>{ejercicio.titulo}</td>
                      <td>{formatearFecha(ejercicio.fecha_inicio)}</td>
                      <td>
                        <span
                          style={
                            vencido
                              ? {
                                  color: "#c62828",
                                  fontWeight: 700,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                }
                              : undefined
                          }
                        >
                          {formatearFecha(ejercicio.fecha_final)}
                          {vencido && (
                            <span
                              style={{
                                background: "#ffebee",
                                color: "#c62828",
                                border: "1px solid #ef9a9a",
                                borderRadius: 999,
                                padding: "2px 10px",
                                fontSize: "0.75em",
                                fontWeight: 700,
                                letterSpacing: "0.02em",
                              }}
                            >
                              Vencido
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="acciones">
                      <button
                        type="button"
                        className="btn btn-ver"
                        onClick={() => {
                          setSeleccionada(ejercicio);
                          setMostrarVer(true);
                        }}
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        className="btn btn-editar"
                        onClick={() => {
                          setSeleccionada(ejercicio);
                          setMostrarEditar(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-eliminar"
                        onClick={() => handleEliminar(ejercicio)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>
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
        <VerEjercicio
          ejercicio={seleccionada}
          onCerrar={() => {
            setMostrarVer(false);
            setSeleccionada(null);
          }}
        />
      )}

      {mostrarCrear && (
        <CrearEjercicio
          onCerrar={() => setMostrarCrear(false)}
          onGuardado={() => {
            setMostrarCrear(false);
            cargar();
          }}
        />
      )}

      {mostrarEditar && seleccionada && (
        <EditarEjercicio
          ejercicio={seleccionada}
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

export default Ejercicios;