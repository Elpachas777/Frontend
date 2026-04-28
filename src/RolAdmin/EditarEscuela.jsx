import { useState } from "react";
import { getEscuelas, saveEscuelas } from "./mockData";
import "./RolAdmin.css";

const PHONE_REGEX = /^\+?[\d\s\-\(\)]{7,20}$/;
const GMAPS_REGEX = /^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|goo\.gl\/maps|maps\.app\.goo\.gl)/i;

function EditarEscuela({ escuela, onCerrar, onGuardado }) {
  const [form, setForm] = useState({
    nombre: escuela.nombre,
    logo: escuela.logo || "",
    ubicacion: escuela.ubicacion || "",
    director: escuela.director,
    contacto: escuela.contacto,
    contacto2: escuela.contacto2 || "",
  });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((prev) => ({ ...prev, logo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!form.ubicacion.trim()) {
      e.ubicacion = "La URL de Google Maps es obligatoria.";
    } else if (!GMAPS_REGEX.test(form.ubicacion.trim())) {
      e.ubicacion = "Debe ser un enlace válido de Google Maps.";
    }
    if (!form.director.trim()) e.director = "El director a cargo es obligatorio.";
    if (!form.contacto.trim()) {
      e.contacto = "El número de contacto es obligatorio.";
    } else if (!PHONE_REGEX.test(form.contacto.trim())) {
      e.contacto = "Solo se permiten dígitos, espacios y guiones.";
    }
    if (form.contacto2.trim() && !PHONE_REGEX.test(form.contacto2.trim())) {
      e.contacto2 = "Solo se permiten dígitos, espacios y guiones.";
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length > 0) { setErrores(errs); return; }

    const escuelas = getEscuelas();
    const actualizadas = escuelas.map((es) =>
      es.id === escuela.id ? { ...es, ...form } : es
    );
    saveEscuelas(actualizadas);
    onGuardado();
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-card modal-card--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar escuela</h2>
          <button type="button" className="modal-close" onClick={onCerrar}>✕</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Nombre *</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} />
            {errores.nombre && <span className="modal-error">{errores.nombre}</span>}
          </div>
          <div className="modal-field">
            <label>Logo</label>
            <input type="file" accept="image/*" onChange={handleLogo} />
            {form.logo && (
              <img src={form.logo} alt="logo" className="logo-preview" />
            )}
          </div>
          <div className="modal-field">
            <label>Ubicación — URL de Google Maps *</label>
            <input
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              placeholder="https://www.google.com/maps/place/..."
            />
            {errores.ubicacion && <span className="modal-error">{errores.ubicacion}</span>}
          </div>
          <div className="modal-field">
            <label>Director a cargo *</label>
            <input name="director" value={form.director} onChange={handleChange} />
            {errores.director && <span className="modal-error">{errores.director}</span>}
          </div>
          <div className="modal-field">
            <label>Número de contacto *</label>
            <input name="contacto" value={form.contacto} onChange={handleChange} />
            {errores.contacto && <span className="modal-error">{errores.contacto}</span>}
          </div>
          <div className="modal-field">
            <label>Número adicional</label>
            <input name="contacto2" value={form.contacto2} onChange={handleChange} />
            {errores.contacto2 && <span className="modal-error">{errores.contacto2}</span>}
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

export default EditarEscuela;
