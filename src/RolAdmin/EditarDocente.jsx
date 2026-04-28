import { useState } from "react";
import { getDocentes, saveDocentes } from "./mockData";
import "./RolAdmin.css";
import { IconEye, IconEyeOff } from "./EyeIcons";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function EditarDocente({ docente, escuelas, onCerrar, onGuardado }) {
  const [form, setForm] = useState({
    nombre: docente.nombre,
    escuela: docente.escuela,
    correo: docente.correo,
    foto: docente.foto || "",
    passwordAntigua: "",
    passwordNueva: "",
  });
  const [errores, setErrores] = useState({});
  const [showAntigua, setShowAntigua] = useState(false);
  const [showNueva, setShowNueva] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((prev) => ({ ...prev, foto: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";

    const cambiandoPassword = form.passwordAntigua || form.passwordNueva;
    if (cambiandoPassword) {
      if (!form.passwordAntigua) {
        e.passwordAntigua = "Ingresa tu contraseña actual.";
      } else if (form.passwordAntigua !== (docente.password || "")) {
        e.passwordAntigua = "La contraseña actual no coincide.";
      }
      if (!form.passwordNueva) {
        e.passwordNueva = "Ingresa la nueva contraseña.";
      } else if (!PASSWORD_REGEX.test(form.passwordNueva)) {
        e.passwordNueva = "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial (@$!%*?&).";
      }
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length > 0) { setErrores(errs); return; }

    const cambiandoPassword = form.passwordAntigua && form.passwordNueva;
    const docentes = getDocentes();
    const actualizados = docentes.map((d) => {
      if (d.id !== docente.id) return d;
      return {
        ...d,
        nombre: form.nombre,
        escuela: form.escuela,
        correo: form.correo,
        foto: form.foto,
        ...(cambiandoPassword ? { password: form.passwordNueva } : {}),
      };
    });
    saveDocentes(actualizados);
    onGuardado();
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-card modal-card--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar docente</h2>
          <button type="button" className="modal-close" onClick={onCerrar}>✕</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>

          {/* Foto */}
          <div className="modal-field">
            <label>Foto</label>
            <input type="file" accept="image/*" onChange={handleFoto} />
            {form.foto && (
              <img src={form.foto} alt="preview" className="logo-preview" style={{ borderRadius: "50%" }} />
            )}
          </div>

          {/* Nombre */}
          <div className="modal-field">
            <label>Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} />
            {errores.nombre && <span className="modal-error">{errores.nombre}</span>}
          </div>

          {/* Escuela */}
          <div className="modal-field">
            <label>Escuela</label>
            <select name="escuela" value={form.escuela} onChange={handleChange}>
              <option value="">Selecciona una escuela</option>
              {escuelas.map((e) => (
                <option key={e.id} value={e.nombre}>{e.nombre}</option>
              ))}
            </select>
          </div>

          {/* Correo */}
          <div className="modal-field">
            <label>Correo</label>
            <input name="correo" value={form.correo} onChange={handleChange} type="email" />
          </div>

          {/* Divider */}
          <div className="modal-seccion-label">Cambiar contraseña (opcional)</div>

          {/* Contraseña antigua */}
          <div className="modal-field">
            <label>Contraseña actual</label>
            <div className="password-input-wrap">
              <input
                name="passwordAntigua"
                value={form.passwordAntigua}
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
            {errores.passwordAntigua && <span className="modal-error">{errores.passwordAntigua}</span>}
          </div>

          {/* Contraseña nueva */}
          <div className="modal-field">
            <label>Contraseña nueva</label>
            <div className="password-input-wrap">
              <input
                name="passwordNueva"
                value={form.passwordNueva}
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
            {errores.passwordNueva && <span className="modal-error">{errores.passwordNueva}</span>}
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

export default EditarDocente;
