import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as respuestaApi from "../api/respuesta.api";
import { generarReporteAlumno } from "./pdfReporteAlumno";
import "./VerAlumnoDetalle.css";

function colorPorPuntaje(p) {
  if (p >= 80) return "#5fbf5f";
  if (p >= 60) return "#d7c948";
  if (p >= 40) return "#e89a3c";
  return "#e35858";
}

function VerAlumnoDetalle({ alumno, onCerrar }) {
  const [cargando, setCargando] = useState(true);
  const [eficaciaGlobal, setEficaciaGlobal] = useState(0);
  const [ejercicios, setEjercicios] = useState([]);
  const [silabasDificiles, setSilabasDificiles] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [detalleCargando, setDetalleCargando] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      try {
        const idIngreso = alumno?.id_ingreso;
        if (!idIngreso) {
          setCargando(false);
          return;
        }

        const [resultados, dificiles] = await Promise.all([
          respuestaApi.obtenerResultadosAlumno(idIngreso),
          respuestaApi.obtenerSilabasDificiles(idIngreso),
        ]);

        if (!activo) return;
        setEficaciaGlobal(resultados.eficacia_global || 0);
        setEjercicios(resultados.ejercicios || []);
        setSilabasDificiles(dificiles.silabas || []);
      } catch (err) {
        console.error("Error cargando resultados del alumno:", err);
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargar();
    return () => {
      activo = false;
    };
  }, [alumno?.id_ingreso]);

  const abrirDetalle = async (idEjercicio) => {
    try {
      setDetalleCargando(true);
      const data = await respuestaApi.obtenerResultadosAlumnoEjercicio(
        alumno.id_ingreso,
        idEjercicio,
      );
      setDetalle(data);
    } catch (err) {
      console.error("Error cargando detalle:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar el detalle del ejercicio",
      });
    } finally {
      setDetalleCargando(false);
    }
  };

  const [generandoPDF, setGenerandoPDF] = useState(false);

  const handlePDF = async () => {
    if (generandoPDF) return;
    if (!alumno?.id_ingreso) {
      await Swal.fire({
        icon: "warning",
        title: "Falta el ID del alumno",
        text: "No se puede generar el reporte sin el ID de acceso.",
      });
      return;
    }
    if (ejercicios.length === 0) {
      await Swal.fire({
        icon: "info",
        title: "Sin datos",
        text: "Este alumno aún no tiene ejercicios con resultados registrados.",
      });
      return;
    }

    try {
      setGenerandoPDF(true);
      await generarReporteAlumno(alumno, {
        eficaciaGlobal,
        ejercicios,
        silabasDificiles,
      });
    } catch (err) {
      console.error("Error generando PDF:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo generar el reporte. Intenta de nuevo.",
      });
    } finally {
      setGenerandoPDF(false);
    }
  };

  // Data para Recharts
  const dataGrafica = ejercicios.map((e) => ({
    name: e.titulo.length > 18 ? e.titulo.slice(0, 16) + "…" : e.titulo,
    fullTitle: e.titulo,
    puntaje: e.mejor_puntaje,
    id_ejercicio: e.id_ejercicio,
    intentos: e.total_intentos,
  }));

  return (
    <div
      className="vad-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div className="vad-card">
        <button className="vad-close" onClick={onCerrar} aria-label="Cerrar">
          ✕
        </button>

        <div className="vad-header">
          <div className="vad-info-block">
            <div className="vad-foto-placeholder">
              <span>👤</span>
            </div>
            <div className="vad-info-text">
              <div className="vad-info-row">
                <span>Nombre</span>
                <strong>{alumno.nombres || "—"}</strong>
              </div>
              <div className="vad-info-row">
                <span>Grupo</span>
                <strong>{alumno.grupo || "—"}</strong>
              </div>
              <div className="vad-info-row">
                <span>Eficacia global</span>
                <strong style={{ color: colorPorPuntaje(eficaciaGlobal) }}>
                  {cargando ? "…" : `${eficaciaGlobal.toFixed(2)}%`}
                </strong>
              </div>
            </div>

            <div className="vad-id-block">
              <span>ID:</span>
              <strong>{alumno.id_ingreso || "—"}</strong>
            </div>
          </div>

          {!cargando && silabasDificiles.length > 0 && (
            <div className="vad-silabas-wrap">
              <p className="vad-silabas-title">
                Sílabas que más se le dificultan
              </p>
              <div className="vad-silabas-grid">
                {silabasDificiles.map((s) => (
                  <div key={s.silaba} className="vad-silaba">
                    <span className="vad-silaba-texto">{s.silaba}</span>
                    <span className="vad-silaba-pct">
                      {s.precision.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="vad-body">
          {cargando ? (
            <p className="vad-empty">Cargando resultados…</p>
          ) : ejercicios.length === 0 ? (
            <p className="vad-empty">
              Este alumno aún no tiene resultados registrados.
            </p>
          ) : (
            <div className="vad-chart-wrap">
              <p className="vad-chart-title">
                Mejor puntaje por ejercicio (haz click en una barra para ver
                detalle)
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dataGrafica}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, _name, props) => [
                      `${value.toFixed(2)}%`,
                      props?.payload?.fullTitle || "Puntaje",
                    ]}
                    labelFormatter={() => ""}
                  />
                  <Bar
                    dataKey="puntaje"
                    cursor="pointer"
                    onClick={(d) => abrirDetalle(d.id_ejercicio)}
                  >
                    {dataGrafica.map((entry) => (
                      <Cell
                        key={entry.id_ejercicio}
                        fill={colorPorPuntaje(entry.puntaje)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <button
            className="vad-pdf-btn"
            onClick={handlePDF}
            disabled={generandoPDF || cargando}
          >
            {generandoPDF ? "Generando PDF…" : "Generar PDF"}
          </button>
        </div>
      </div>

      {detalle && (
        <DetalleEjercicioModal
          detalle={detalle}
          onCerrar={() => setDetalle(null)}
        />
      )}
      {detalleCargando && !detalle && (
        <div className="vad-loading-overlay">
          <div className="vad-spinner" />
        </div>
      )}
    </div>
  );
}

function DetalleEjercicioModal({ detalle, onCerrar }) {
  return (
    <div
      className="vad-detalle-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div className="vad-detalle-card">
        <button className="vad-close" onClick={onCerrar} aria-label="Cerrar">
          ✕
        </button>

        <h3 className="vad-detalle-title">Detalle por sílaba</h3>
        <p className="vad-detalle-sub">
          Precisión promedio de cada sílaba en este ejercicio
        </p>

        <div className="vad-silabas-table">
          <div className="vad-silabas-table-head">
            <span>Sílaba</span>
            <span>Precisión</span>
            <span>Intentos</span>
          </div>
          {detalle.silabas.length === 0 ? (
            <p className="vad-empty">Sin datos registrados.</p>
          ) : (
            detalle.silabas
              .slice()
              .sort((a, b) => a.precision_promedio - b.precision_promedio)
              .map((s) => (
                <div key={s.silaba} className="vad-silabas-row">
                  <span className="vad-silaba-celda">{s.silaba}</span>
                  <span
                    style={{
                      color: colorPorPuntaje(s.precision_promedio),
                      fontWeight: 600,
                    }}
                  >
                    {s.precision_promedio.toFixed(2)}%
                  </span>
                  <span>{s.intentos}</span>
                </div>
              ))
          )}
        </div>

        {detalle.intentos.length > 1 && (
          <>
            <h4 className="vad-detalle-sub-title">
              Intentos ({detalle.intentos.length})
            </h4>
            <div className="vad-intentos">
              {detalle.intentos.map((i, idx) => (
                <div className="vad-intento-row" key={i.id_intento}>
                  <span>
                    Intento {detalle.intentos.length - idx} —{" "}
                    {new Date(i.fecha).toLocaleString()}
                  </span>
                  <strong style={{ color: colorPorPuntaje(i.promedio) }}>
                    {i.promedio.toFixed(2)}%
                  </strong>
                </div>
              ))}
            </div>
          </>
        )}

        <button className="vad-pdf-btn" onClick={onCerrar}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default VerAlumnoDetalle;