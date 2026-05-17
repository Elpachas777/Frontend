import { useEffect, useState } from "react";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import editar from "../utils/editarDocente";
import { IconEye, IconEyeOff } from "./EyeIcons";
import "./RolAdmin.css";

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function EditarDocente({ docente, escuelas, onCerrar, onGuardado }) {
  const [showAntigua, setShowAntigua] = useState(false);
  const [showNueva, setShowNueva] = useState(false);

  const [errores, setErrores] = useState({});

  const { formData, setFormData, handleChange, handleFileChange } = useFormData(
    USUARIOS.DOCENTE_EDITAR,
  );

  useEffect(() => {
    setFormData((prev) => {
      const nuevo = { ...prev };
      Object.keys(prev).forEach((key) => {
        if (key in docente) nuevo[key] = docente[key];
      });
      return nuevo;
    });
  }, []);

  const { handleSubmit } = editar(docente, {
    formData,
    setErrores,
    onGuardado,
  });

  return (
    <div className="modal-overlay">
      <div
        className="modal-card modal-card--wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Editar docente</h2>
          <button type="button" className="modal-close" onClick={onCerrar}>
            ✕
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Foto</label>
            <div className="foto-upload-row">
              {formData.foto && (
                <img
                  src={formData.fotoPreview || formData.foto}
                  alt="preview"
                  className="foto-upload-preview"
                />
              )}
              <input
                name="foto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Nombre */}
          <div className="modal-field">
            <label>Nombre</label>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
            {errores.nombre && (
              <span className="modal-error">{errores.nombre}</span>
            )}
          </div>

          <div className="modal-field">
            <label>Apellidos</label>
            <input
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
            />
            {errores.apellidos && (
              <span className="modal-error">{errores.apellidos}</span>
            )}
          </div>

          {/* Escuela */}
          <div className="modal-field">
            <label>Escuela</label>
            <select
              name="escuela"
              value={formData.escuela.id}
              onChange={handleChange}
            >
              <option value="">Selecciona una escuela</option>
              {escuelas.map((escuela) => (
                <option key={escuela.id} value={escuela.id}>
                  {escuela.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Correo */}
          <div className="modal-field">
            <label>Correo</label>
            <input
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              type="email"
            />
          </div>

          {/* Divider */}
          <div className="modal-seccion-label">
            Cambiar contraseña (opcional)
          </div>

          {/* Contraseña antigua */}
          <div className="modal-field">
            <label>Contraseña actual</label>
            <div className="password-input-wrap">
              <input
                name="passwordAntigua"
                value={formData.passwordAntigua}
                onChange={handleChange}
                type={showAntigua ? "text" : "password"}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-eye"
                onClick={() => setShowAntigua((p) => !p)}
              >
                {showAntigua ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {errores.passwordAntigua && (
              <span className="modal-error">{errores.passwordAntigua}</span>
            )}
          </div>

          {/* Contraseña nueva */}
          <div className="modal-field">
            <label>Contraseña nueva</label>
            <div className="password-input-wrap">
              <input
                name="passwordNueva"
                value={formData.passwordNueva}
                onChange={handleChange}
                type={showNueva ? "text" : "password"}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-eye"
                onClick={() => setShowNueva((p) => !p)}
              >
                {showNueva ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {errores.passwordNueva && (
              <span className="modal-error">{errores.passwordNueva}</span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn-cancel"
              onClick={onCerrar}
            >
              Cancelar
            </button>
            <button type="submit" className="modal-btn-save">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarDocente;
