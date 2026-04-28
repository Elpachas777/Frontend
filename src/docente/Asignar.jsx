import { useState } from "react";
import Swal from "sweetalert2";
import { getEjerciciosMock } from "./Ejercicios";
import { GRUPOS_MOCK } from "../RolAdmin/mockData";
import "./Asignar.css";

// { [ejercicioId]: { [grupoId]: { asignado, realizado, porcentaje } } }
const asignacionesState = {
  1: {
    1: { asignado: true, realizado: true, porcentaje: 80 },
    3: { asignado: true, realizado: true, porcentaje: 65 },
  },
};

function getEstado(ejId, grupoId) {
  return asignacionesState[ejId]?.[grupoId] ?? { asignado: false, realizado: false, porcentaje: 0 };
}

function Asignar() {
  const [ejercicioId, setEjercicioId] = useState("");
  const [, tick] = useState(0);
  const rerender = () => tick((n) => n + 1);

  const ejercicios = getEjerciciosMock();
  const ejercicioActual = ejercicios.find((e) => e.id === Number(ejercicioId));

  const handleAsignar = async (grupo) => {
    const confirm = await Swal.fire({
      title: "¿Asignar ejercicio?",
      html: `¿Asignar <strong>${ejercicioActual?.ejercicio}</strong> al grupo <strong>${grupo.nombre}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, asignar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#7bc043",
      cancelButtonColor: "#6c757d",
    });
    if (!confirm.isConfirmed) return;

    if (!asignacionesState[ejercicioId]) asignacionesState[ejercicioId] = {};
    asignacionesState[ejercicioId][grupo.id] = { asignado: true, realizado: false, porcentaje: 0 };
    rerender();

    await Swal.fire({
      icon: "success",
      title: "¡Asignado!",
      text: `"${ejercicioActual?.ejercicio}" asignado al grupo ${grupo.nombre}.`,
      timer: 1800,
      showConfirmButton: false,
    });
  };

  const handleReasignar = async (grupo, estado) => {
    const confirm = await Swal.fire({
      title: "¿Reasignar ejercicio?",
      html: estado.realizado
        ? `El grupo <strong>${grupo.nombre}</strong> ya realizó este ejercicio (${estado.porcentaje}%). ¿Deseas reasignarlo y reiniciar los resultados?`
        : `¿Deseas reasignar <strong>${ejercicioActual?.ejercicio}</strong> al grupo <strong>${grupo.nombre}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, reasignar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#6c757d",
    });
    if (!confirm.isConfirmed) return;

    if (!asignacionesState[ejercicioId]) asignacionesState[ejercicioId] = {};
    asignacionesState[ejercicioId][grupo.id] = { asignado: true, realizado: false, porcentaje: 0 };
    rerender();

    await Swal.fire({
      icon: "success",
      title: "Reasignado",
      text: `Ejercicio reasignado al grupo ${grupo.nombre}. Resultados anteriores reiniciados.`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleVerResultados = async (grupo, estado) => {
    await Swal.fire({
      title: `Resultados · ${grupo.nombre}`,
      html: `
        <p style="margin:0 0 6px"><strong>Ejercicio:</strong> ${ejercicioActual?.ejercicio}</p>
        <p style="margin:0 0 14px"><strong>Desempeño:</strong> ${estado.porcentaje}%</p>
        <div style="background:#e8f5e9;border-radius:12px;height:18px;overflow:hidden">
          <div style="height:100%;width:${estado.porcentaje}%;background:#4caf50;border-radius:12px"></div>
        </div>
      `,
      confirmButtonText: "Cerrar",
      confirmButtonColor: "#7bc043",
    });
  };

  return (
    <section className="asignar-container">
      <div className="asignar-decor asignar-decor--one" />
      <div className="asignar-decor asignar-decor--two" />

      <div className="asignar-hero">
        <div>
          <h1>Asignar ejercicio</h1>
          <p>Selecciona un ejercicio y gestiona su asignación por grupo.</p>
        </div>
      </div>

      <div className="asignar-select-row">
        <label htmlFor="ej-select">Asignar ejercicio</label>
        <select
          id="ej-select"
          className="asignar-select"
          value={ejercicioId}
          onChange={(e) => setEjercicioId(e.target.value)}
        >
          <option value="">— Selecciona un ejercicio —</option>
          {ejercicios.map((ej) => (
            <option key={ej.id} value={ej.id}>
              Ejercicio {ej.id}: "{ej.ejercicio}"
            </option>
          ))}
        </select>
      </div>

      {ejercicioId ? (
        <div className="asignar-card">
          <div className="asignar-card-header">
            <span>Grupo</span>
            <span>Estado</span>
            <span>Acciones</span>
          </div>

          {GRUPOS_MOCK.map((grupo) => {
            const estado = getEstado(Number(ejercicioId), grupo.id);
            return (
              <div key={grupo.id} className="asignar-row">
                <span className="asignar-grupo-nombre">{grupo.nombre}</span>

                <div className="asignar-status-cell">
                  {estado.asignado && estado.realizado ? (
                    <div className="asignar-status asignar-status--realizado">
                      <span>Realizado</span>
                      <div className="asignar-progress">
                        <div
                          className="asignar-progress-bar"
                          style={{ width: `${estado.porcentaje}%` }}
                        />
                      </div>
                      <span className="asignar-pct">{estado.porcentaje}%</span>
                    </div>
                  ) : estado.asignado ? (
                    <div className="asignar-status asignar-status--pendiente">
                      <span>Asignado · pendiente</span>
                    </div>
                  ) : (
                    <div className="asignar-status asignar-status--sin">
                      <span>Sin realizar</span>
                    </div>
                  )}
                </div>

                <div className="asignar-acciones">
                  {estado.asignado && estado.realizado && (
                    <button
                      type="button"
                      className="btn btn-ver"
                      onClick={() => handleVerResultados(grupo, estado)}
                    >
                      Ver resultados
                    </button>
                  )}
                  {estado.asignado ? (
                    <button
                      type="button"
                      className="btn btn-eliminar"
                      onClick={() => handleReasignar(grupo, estado)}
                    >
                      Reasignar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-ver"
                      onClick={() => handleAsignar(grupo)}
                    >
                      Asignar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="asignar-empty">
        
          <p>Selecciona un ejercicio para ver el estado por grupo.</p>
        </div>
      )}
    </section>
  );
}

export default Asignar;
