import { useEffect, useState } from "react";
import Editor from "../ejercicios/Editor";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import { actualizar } from "../utils/ejercicio";

function getNowLocal() {
  const now = new Date();
  return new Date(now - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function toLocalInput(val) {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d)) return "";
  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function EditarEjercicio({ ejercicio, onCerrar, onGuardado }) {
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);

  const { formData, setFormData, handleChange, handleObjectChange } =
    useFormData(USUARIOS.EJERCICIO);

  useEffect(() => {
    setFormData((prev) => {
      const nuevo = { ...prev };

      Object.keys(prev).forEach((key) => {
        if (key in ejercicio) {
          nuevo[key] = ejercicio[key];
        }
      });
      return nuevo;
    });
  }, [ejercicio, setFormData]);

  const { handleSubmit } = actualizar(ejercicio, {
    formData,
    setErrores,
    setMensaje,
    onGuardado,
  });

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div
        className="modal-card modal-card--wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Editar ejercicio</h2>
          <button type="button" className="modal-close" onClick={onCerrar}>
            ✕
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Nombre del ejercicio</label>
            <input
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
            />
          </div>

          <div className="modal-field">
            <label>Fecha de Entrega</label>
            <input
              name="fecha_final"
              type="datetime-local"
              value={toLocalInput(formData.fecha_final)}
              min={toLocalInput(formData.fecha_inicio) || getNowLocal()}
              onChange={handleChange}
            />
          </div>

          <Editor formData={formData} handleObjectChange={handleObjectChange} />

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

export default EditarEjercicio;
