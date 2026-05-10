import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { eliminarDocente } from "../api/docente.api";
import "../components/Tabla.css";
import { comprobarContraseña } from "../utils/admin";
import { modificarHabilitado } from "../utils/docentes";
import { IconEye, IconEyeOff } from "./EyeIcons";
import "./RolAdmin.css";
import VerGrupoAdmin from "./VerGrupoAdmin";

function VerDocente({ docente, onCerrar, onGuardado, onEliminado }) {
  const [habilitado, setHabilitado] = useState(docente.habilitado);
  const [grupoViendoId, setGrupoViendoId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const gruposDocente = docente.grupos ?? [];

  const handleToggleHabilitado = async () => {
    if (habilitado) {
      const result = await Swal.fire({
        title: "¿Inhabilitar docente?",
        html: '<p style="margin:0">Si inhabilita este usuario <strong>sus grupos estarán en pausa</strong> y no podrá el docente acceder a su cuenta.</p>',
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, inhabilitar",
        confirmButtonColor: "#e74c3c",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });
      if (!result.isConfirmed) return;
      await modificarHabilitado(docente.id, false);
      setHabilitado(false);
    } else {
      const result = await Swal.fire({
        title: "¿Habilitar docente?",
        html: "El docente podrá volver a iniciar sesión y sus grupos estarán activos nuevamente.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, habilitar",
        confirmButtonColor: "#7bc043",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });
      if (!result.isConfirmed) return;
      await modificarHabilitado(docente.id, true);
      setHabilitado(true);
    }
    onGuardado();
  };

  const handleEliminar = async () => {
    const result = await Swal.fire({
      title: "Eliminar permanentemente",
      html: "Esta acción <strong>no se puede deshacer</strong>. Ingresa la contraseña del administrador para confirmar.",
      icon: "error",
      input: "password",
      inputPlaceholder: "Contraseña del administrador",
      inputAttributes: { autocapitalize: "off", autocorrect: "off" },
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#e74c3c",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
      preConfirm: async (value) => {
        if (!value) {
          Swal.showValidationMessage("Ingresa la contraseña para confirmar.");
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

    await eliminarDocente(docente.id);

    await Swal.fire({
      title: "Eliminado",
      text: "El docente fue eliminado permanentemente.",
      icon: "success",
      timer: 1600,
      showConfirmButton: false,
    });

    onEliminado();
  };

  return (
    <>
      <div className="modal-overlay">
        <div
          className="modal-card modal-card--perfil"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <h2>Perfil del docente</h2>
            <button type="button" className="modal-close" onClick={onCerrar}>
              ✕
            </button>
          </div>

          {/* Top: foto + info + grupos */}
          <div className="docente-panel-top">
            <div className="docente-panel-left">
              <div className="docente-foto">
                {docente.foto ? (
                  <img src={docente.foto} alt={docente.nombre} />
                ) : (
                  <span>👤</span>
                )}
              </div>
            </div>

            <div className="docente-panel-info">
              <span className="docente-info-escuela">
                {docente.escuela.nombre}
              </span>
              <span className="docente-info-nombre">{docente.nombre}</span>
              <span className="docente-info-correo">{docente.correo}</span>
            </div>

            <div className="docente-panel-grupos">
              <p className="docente-grupos-title">Grupos asignados:</p>
              {gruposDocente.length > 0 ? (
                gruposDocente.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className="docente-grupo-btn"
                    onClick={() => setGrupoViendoId(g.id)}
                  >
                    📚 {g.nombre}
                  </button>
                ))
              ) : (
                <span className="docente-grupo-btn-empty">
                  Sin grupos asignados
                </span>
              )}
            </div>
          </div>

          {/* Mid: contraseña, fecha, estado */}
          <div className="docente-panel-mid">
            <div className="docente-mid-item">
              <span className="docente-mid-label">Contraseña</span>
              <div className="docente-password-row">
                <span className="docente-mid-value">
                  {showPassword
                    ? docente.password || "—"
                    : docente.password
                      ? "••••••••"
                      : "—"}
                </span>
                {docente.password && (
                  <button
                    type="button"
                    className="password-eye password-eye--inline"
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                )}
              </div>
            </div>
            <div className="docente-mid-item">
              <span className="docente-mid-label">Ingresado desde el</span>
              <span className="docente-mid-value">
                {new Date(docente.fechaIngreso).toLocaleDateString("es-MX") ||
                  "—"}
              </span>
            </div>
            <div className="docente-mid-item">
              <span className="docente-mid-label">Estado</span>
              <span
                className={`docente-estado-badge ${
                  habilitado
                    ? "docente-estado-badge--activo"
                    : "docente-estado-badge--inactivo"
                }`}
              >
                {habilitado ? "● Activo" : "● Inactivo"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="docente-panel-actions">
            <div>
              <button
                type="button"
                className={`docente-btn-toggle ${
                  habilitado
                    ? "docente-btn-toggle--inhabilitar"
                    : "docente-btn-toggle--habilitar"
                }`}
                onClick={handleToggleHabilitado}
              >
                {habilitado ? "Inhabilitar" : "Habilitar"}
              </button>
            </div>
            <button
              type="button"
              className="docente-btn-eliminar-perm"
              onClick={handleEliminar}
            >
              Eliminar permanentemente
            </button>
          </div>
        </div>
      </div>

      {grupoViendoId !== null && (
        <VerGrupoAdmin
          grupoId={grupoViendoId}
          onCerrar={() => setGrupoViendoId(null)}
        />
      )}
    </>
  );
}

export default VerDocente;
