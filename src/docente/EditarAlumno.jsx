import { useEffect, useState } from "react";
import Mensaje from "../components/Mensaje";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import "../RolAdmin/RolAdmin.css";
import { actualizar } from "../utils/alumnos";

function EditarAlumno({ alumno, onCerrar, onGuardado }) {
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);

  const { formData, setFormData, handleChange } = useFormData(
    USUARIOS.ALUMNO_EDITAR,
  );

  useEffect(() => {
    setFormData((prev) => {
      const nuevo = { ...prev };

      Object.keys(prev).forEach((key) => {
        if (key in alumno) {
          nuevo[key] = alumno[key];
        }
      });

      return nuevo;
    });
  }, [alumno, setFormData]);

  const { handleSubmit } = actualizar(alumno, {
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
          <h2>Editar alumno</h2>
          <button type="button" className="modal-close" onClick={onCerrar}>
            ✕
          </button>
        </div>

        {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Nombre</label>
            <input
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
            />
            {errores.nombres && (
              <span className="modal-error">{errores.nombres}</span>
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

export default EditarAlumno;
