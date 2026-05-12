import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./Asignar.css";
import * as utilsEjercicios from "../utils/ejercicio";
import * as utilsGrupos from "../utils/grupos";

function Asignar() {
  const [ejercicios, setEjercicios] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [estadisticas, setEstadisticas] = useState([]);
  const [ejercicioId, setEjercicioId] = useState("");
  const [cargandoStats, setCargandoStats] = useState(false);
  const [modalVer, setModalVer] = useState(null);

  const ejercicioActual = ejercicios.find(
    (e) => e.id_ejercicio === Number(ejercicioId),
  );

  const estadisticasMap = useMemo(() => {
    const mapa = new Map();

    estadisticas.forEach((item) => {
      mapa.set(Number(item.id), item);
    });

    return mapa;
  }, [estadisticas]);

  const cargar = useCallback(async () => {
    const ejerciciosArreglo = await utilsEjercicios.listar();
    const gruposArreglo = await utilsGrupos.listar();

    setGrupos(gruposArreglo);
    setEjercicios(ejerciciosArreglo);
  }, []);

  const cargarEstadisticas = useCallback(async (idEjercicio) => {
    if (!idEjercicio) {
      setEstadisticas([]);
      return;
    }

    setCargandoStats(true);

    const data = await utilsEjercicios.estadisticasAsignacion(idEjercicio);

    setEstadisticas(data);
    setCargandoStats(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    cargarEstadisticas(ejercicioId);
  }, [ejercicioId, cargarEstadisticas]);

  const handleAsignar = async (grupo) => {
    const confirm = await Swal.fire({
      title: "¿Asignar ejercicio?",
      html: `¿Asignar <strong>${ejercicioActual?.titulo}</strong> al grupo <strong>${grupo.nombre}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, asignar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#7bc043",
      cancelButtonColor: "#6c757d",
    });

    if (!confirm.isConfirmed) return;

    await utilsEjercicios.asignarEjercicio(ejercicioActual, grupo);

    await cargar();
    await cargarEstadisticas(ejercicioId);

    await Swal.fire({
      icon: "success",
      title: "¡Asignado!",
      text: `"${ejercicioActual?.titulo}" asignado al grupo ${grupo.nombre}.`,
      timer: 1800,
      showConfirmButton: false,
    });
  };

  const handleReasignar = async (grupo, estado) => {
    const confirm = await Swal.fire({
      title: "¿Reasignar ejercicio?",
      html:
        estado.resueltos > 0
          ? `El grupo <strong>${grupo.nombre}</strong> ya tiene <strong>${estado.resueltos}/${estado.total_alumnos}</strong> alumnos con resultado. ¿Deseas reasignarlo?`
          : `¿Deseas reasignar <strong>${ejercicioActual?.titulo}</strong> al grupo <strong>${grupo.nombre}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, reasignar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#6c757d",
    });

    if (!confirm.isConfirmed) return;

    await utilsEjercicios.asignarEjercicio(ejercicioActual, grupo);

    await cargar();
    await cargarEstadisticas(ejercicioId);

    await Swal.fire({
      icon: "success",
      title: "Reasignado",
      text: `Ejercicio reasignado al grupo ${grupo.nombre}.`,
      timer: 1800,
      showConfirmButton: false,
    });
  };

  const handleVerResultados = (grupo, estado) => {
    setModalVer({
      grupo,
      estado,
      ejercicio: ejercicioActual,
    });
  };

  const asignado = (grupo, estado) => {
    if (estado) return estado.asignado;

    return grupo.ejercicios.some(
      (ejercicio) => ejercicio.id === Number(ejercicioId),
    );
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
          {ejercicios.map((ejercicio) => (
            <option key={ejercicio.id_ejercicio} value={ejercicio.id_ejercicio}>
              Ejercicio {ejercicio.id_ejercicio}: "{ejercicio.titulo}"
            </option>
          ))}
        </select>
      </div>

      {ejercicioId ? (
        <div className="asignar-card">
          <div className="asignar-card-header">
            <span>Grupo</span>
            <span>Estado</span>
            <span>Resueltos</span>
            <span>Eficacia grupal</span>
            <span>Acciones</span>
          </div>

          {grupos.map((grupo) => {
            const estado = estadisticasMap.get(Number(grupo.id)) || {
              id: grupo.id,
              nombre: grupo.nombre,
              asignado: asignado(grupo),
              total_alumnos: 0,
              resueltos: 0,
              eficacia: 0,
            };

            const pertenece = asignado(grupo, estado);
            const eficacia = Number(estado.eficacia || 0);
            const totalAlumnos = Number(estado.total_alumnos || 0);
            const resueltos = Number(estado.resueltos || 0);

            return (
              <div key={grupo.id} className="asignar-row">
                <span className="asignar-grupo-nombre">{grupo.nombre}</span>

                <div className="asignar-status-cell">
                  {pertenece && resueltos > 0 ? (
                    <div className="asignar-status asignar-status--realizado">
                      <span>
                        {resueltos === totalAlumnos
                          ? "Realizado"
                          : "Asignado · con avances"}
                      </span>
                    </div>
                  ) : pertenece ? (
                    <div className="asignar-status asignar-status--pendiente">
                      <span>Asignado · pendiente</span>
                    </div>
                  ) : (
                    <div className="asignar-status asignar-status--sin">
                      <span>Sin realizar</span>
                    </div>
                  )}
                </div>

                <div className="asignar-resueltos">
                  <strong>
                    {cargandoStats ? "..." : `${resueltos}/${totalAlumnos}`}
                  </strong>
                </div>

                <div className="asignar-eficacia">
                  <div className="asignar-eficacia-top">
                    <strong>
                      {cargandoStats ? "..." : `${eficacia.toFixed(2)}%`}
                    </strong>
                  </div>

                  <div className="asignar-progress">
                    <div
                      className="asignar-progress-bar"
                      style={{ width: `${eficacia}%` }}
                    />
                  </div>
                </div>

                <div className="asignar-acciones">
                  {pertenece && resueltos > 0 && (
                    <button
                      type="button"
                      className="btn btn-ver"
                      onClick={() => handleVerResultados(grupo, estado)}
                    >
                      Ver
                    </button>
                  )}

                  {pertenece ? (
                    <button
                      type="button"
                      className="btn btn-eliminar btn-reasignar"
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

      {modalVer && (
        <ModalVerResultados
          datos={modalVer}
          onCerrar={() => setModalVer(null)}
        />
      )}
    </section>
  );
}

function ModalVerResultados({ datos, onCerrar }) {
  const { grupo, estado, ejercicio } = datos;
  const alumnos = estado.alumnos || [];
  const eficacia = Number(estado.eficacia || 0);

  const colorPorPuntaje = (p) => {
    if (p >= 80) return "#4caf50";
    if (p >= 60) return "#9bbf3f";
    if (p >= 40) return "#e89a3c";
    return "#e35858";
  };

  return (
    <div
      className="ver-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div className="ver-modal-card">
        <button
          type="button"
          className="ver-modal-close"
          onClick={onCerrar}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <h2 className="ver-modal-title">Resultados · {grupo.nombre}</h2>

        <div className="ver-modal-summary">
          <p>
            <strong>Ejercicio:</strong> {ejercicio?.titulo || "—"}
          </p>
          <p>
            <strong>Alumnos que resolvieron:</strong> {estado.resueltos}/
            {estado.total_alumnos}
          </p>
          <p>
            <strong>Eficacia grupal:</strong> {eficacia.toFixed(2)}%
          </p>

          <div className="ver-modal-bar">
            <div
              className="ver-modal-bar-fill"
              style={{
                width: `${eficacia}%`,
                background: colorPorPuntaje(eficacia),
              }}
            />
          </div>
        </div>

        <h3 className="ver-modal-subtitle">Detalle por alumno</h3>

        {alumnos.length === 0 ? (
          <p className="ver-modal-empty">
            Este grupo no tiene alumnos registrados.
          </p>
        ) : (
          <div className="ver-modal-tabla">
            <div className="ver-modal-tabla-head">
              <span>Alumno</span>
              <span>ID</span>
              <span>Estado</span>
              <span>Mejor puntaje</span>
            </div>
            {alumnos.map((a) => (
              <div className="ver-modal-tabla-row" key={a.id_alumno}>
                <span className="ver-modal-tabla-nombre">{a.nombre}</span>
                <span className="ver-modal-tabla-id">{a.id_ingreso}</span>
                <span>
                  {a.resuelto ? (
                    <span className="ver-modal-chip ver-modal-chip--ok">
                      ✓ Resuelto
                    </span>
                  ) : (
                    <span className="ver-modal-chip ver-modal-chip--pend">
                      Pendiente
                    </span>
                  )}
                </span>
                <span
                  style={{
                    color: a.resuelto
                      ? colorPorPuntaje(a.mejor_puntaje)
                      : "#bbb",
                    fontWeight: 600,
                  }}
                >
                  {a.resuelto ? `${a.mejor_puntaje.toFixed(2)}%` : "—"}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="ver-modal-actions">
          <button type="button" className="btn btn-ver" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Asignar;