import { useState } from "react";
import { getDocentes, saveDocentes, nextId } from "./mockData";
import "./RolAdmin.css";
import { IconEye, IconEyeOff } from "./EyeIcons";

const CORREO_REGEX = /^[^\s@]+@ipn\.mx$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function CrearDocente({ escuelas, onCerrar, onGuardado }) {
  const [form, setForm] = useState({ nombre: "", escuela: "", correo: "", password: "", foto: "" });
  const [errores, setErrores] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((prev) => ({ ...prev, foto: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!form.escuela) e.escuela = "Selecciona una escuela.";
    if (!CORREO_REGEX.test(form.correo)) e.correo = "El correo debe terminar en @ipn.mx";
    if (!PASSWORD_REGEX.test(form.password))
      e.password = "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial (@$!%*?&).";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length > 0) { setErrores(errs); return; }

    const docentes = getDocentes();
    const nuevo = {
      id: nextId(docentes),
      nombre: form.nombre,
      escuela: form.escuela,
      correo: form.correo,
      password: form.password,
      foto: form.foto,
      habilitado: true,
      fechaIngreso: new Date().toISOString().split("T")[0],
      grupos: [],
    };
    saveDocentes([...docentes, nuevo]);
    onGuardado();
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Crear docente</h2>
          <button type="button" className="modal-close" onClick={onCerrar}>✕</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Foto</label>
            <div className="foto-upload-row">
              {form.foto && (
                <img src={form.foto} alt="preview" className="foto-upload-preview" />
              )}
              <input type="file" accept="image/*" onChange={handleFoto} />
            </div>
          </div>
          <div className="modal-field">
            <label>Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre completo"
            />
            {errores.nombre && <span className="modal-error">{errores.nombre}</span>}
          </div>
          <div className="modal-field">
            <label>Escuela</label>
            <select name="escuela" value={form.escuela} onChange={handleChange}>
              <option value="">Selecciona una escuela</option>
              {escuelas.map((e) => (
                <option key={e.id} value={e.nombre}>{e.nombre}</option>
              ))}
            </select>
            {errores.escuela && <span className="modal-error">{errores.escuela}</span>}
          </div>
          <div className="modal-field">
            <label>Correo</label>
            <input
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="nombre@ipn.mx"
              type="email"
            />
            {errores.correo && <span className="modal-error">{errores.correo}</span>}
          </div>
          <div className="modal-field">
            <label>Contraseña</label>
            <div className="password-input-wrap">
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                className="password-eye"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {errores.password && <span className="modal-error">{errores.password}</span>}
          </div>
          <div className="modal-actions">
            <button type="button" className="modal-btn-cancel" onClick={onCerrar}>Cancelar</button>
            <button type="submit" className="modal-btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearDocente;
