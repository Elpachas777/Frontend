import { useEffect, useState } from "react";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import { actualizar } from "../utils/escuela";
import "./RolAdmin.css";

function EditarEscuela({ escuela, onCerrar, onGuardado }) {
  const [errores, setErrores] = useState({});

  const { formData, setFormData, handleChange, handleFileChange } = useFormData(
    USUARIOS.ESCUELA,
  );

  useEffect(() => {
    setFormData((prev) => {
      const nuevo = { ...prev };
      Object.keys(prev).forEach((key) => {
        if (key in escuela) nuevo[key] = escuela[key];
      });
      return nuevo;
    });
  }, []);

  const { handleSubmit } = actualizar(escuela, {
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
          <h2>Editar escuela</h2>
          <button type="button" className="modal-close" onClick={onCerrar}>
            ✕
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Nombre *</label>
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

          <div className="modal-field">
            <label>Ubicación — URL de Google Maps *</label>
            <input
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              placeholder="https://www.google.com/maps/place/..."
            />
            {errores.ubicacion && (
              <span className="modal-error">{errores.ubicacion}</span>
            )}
          </div>
          <div className="modal-field">
            <label>Director a cargo *</label>
            <input
              name="director"
              value={formData.director}
              onChange={handleChange}
            />
            {errores.director && (
              <span className="modal-error">{errores.director}</span>
            )}
          </div>
          <div className="modal-field">
            <label>Número de contacto *</label>
            <input
              name="contacto"
              value={formData.contacto}
              onChange={handleChange}
            />
            {errores.contacto && (
              <span className="modal-error">{errores.contacto}</span>
            )}
          </div>
          <div className="modal-field">
            <label>Número adicional</label>
            <input
              name="contacto_adicional"
              value={formData.contacto_adicional}
              onChange={handleChange}
            />
            {errores.contacto_adicional && (
              <span className="modal-error">{errores.contacto_adicional}</span>
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

export default EditarEscuela;
