import { useState } from "react";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import registrar from "../utils/registrarDocente";
import { IconEye, IconEyeOff } from "./EyeIcons";
import "./RolAdmin.css";

const CORREO_REGEX = /^[^\s@]+@ipn\.mx$/;
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function CrearDocente({ escuelas, onCerrar, onGuardado }) {
  const [errores, setErrores] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { formData, handleFileChange, handleChange } = useFormData(
    USUARIOS.DOCENTE,
  );

  const { handleSubmit } = registrar({
    formData,
    setErrores,
    onGuardado,
    onCerrar,
  });

  return (
    <div className="modal-overlay">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Crear docente</h2>
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
                  src={URL.createObjectURL(formData.foto)}
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
          <div className="modal-field">
            <label>Nombre <span style={{color:"#e53935"}}>*</span></label>
            <input
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              placeholder="Nombre completo"
            />
            {errores.nombre && (
              <span className="modal-error">{errores.nombre}</span>
            )}
          </div>
          <div className="modal-field">
            <label>Apellidos <span style={{color:"#e53935"}}>*</span></label>
            <input
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Apellidos completos"
            />
            {errores.apellidos && (
              <span className="modal-error">{errores.apellidos}</span>
            )}
          </div>
          <div className="modal-field">
            <label>Escuela <span style={{color:"#e53935"}}>*</span></label>
            <select
              name="escuela"
              value={formData.escuela}
              onChange={handleChange}
            >
              <option value="">Selecciona una escuela</option>
              {escuelas.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
            {errores.escuela && (
              <span className="modal-error">{errores.escuela}</span>
            )}
          </div>
          <div className="modal-field">
            <label>Correo <span style={{color:"#e53935"}}>*</span></label>
            <input
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="nombre@ipn.mx"
              type="email"
            />
            {errores.correo && (
              <span className="modal-error">{errores.correo}</span>
            )}
          </div>
          <div className="modal-field">
            <label>Contraseña <span style={{color:"#e53935"}}>*</span></label>
            <div className="password-input-wrap">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                className="password-eye"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            <span className="modal-hint">
              Mínimo 8 caracteres, una mayúscula, un número y un carácter
              especial.
            </span>
            {errores.password && (
              <span className="modal-error">{errores.password}</span>
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

export default CrearDocente;