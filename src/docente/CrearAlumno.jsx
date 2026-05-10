import { useState } from "react";
import Mensaje from "../components/Mensaje";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import "../RolAdmin/RolAdmin.css";
import crear from "../utils/crearAlumno";

const GMAPS_REGEX =
  /^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|goo\.gl\/maps|maps\.app\.goo\.gl)/i;

function CrearAlumno({ onCerrar, onGuardado }) {
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);

  const { formData, handleChange } = useFormData(USUARIOS.ALUMNO);
  const { handleSubmit } = crear({
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
          <h2>Crear alumno</h2>
          <button type="button" className="modal-close" onClick={onCerrar}>
            ✕
          </button>
        </div>
        {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Nombre</label>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre del alumno"
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
              placeholder="Apellidos del alumno"
            />
            {errores.apellidos && (
              <span className="modal-error">{errores.apellidos}</span>
            )}
          </div>
          <div className="modal-field">
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

export default CrearAlumno;
