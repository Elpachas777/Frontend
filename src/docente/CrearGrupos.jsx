import { useState } from "react";
import Mensaje from "../components/Mensaje";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import "../RolAdmin/RolAdmin.css";
import crear from "../utils/crearGrupo";

function CrearGrupos({ onCerrar, onGuardado }) {
  const [mensaje, setMensaje] = useState(null);
  const { formData, handleChange, handleObjectChange } = useFormData(USUARIOS.GRUPO);
  const { handleSubmit } = crear({ formData, setMensaje, onGuardado });

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div
        className="modal-card modal-card--wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Crear grupo</h2>
          <button type="button" className="modal-close" onClick={onCerrar}>
            ✕
          </button>
        </div>

        {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Nombre del grupo</label>
           <input
              type="text"
              name="nombre"
              placeholder="Ejemplo: 5CV3"
              required
              value={formData.nombre}
              onChange={(e) => handleObjectChange("nombre", e.target.value.toUpperCase())}
            />
          </div>

          <div className="modal-field">
            <label htmlFor="turno">Turno</label>
            <select
              name="turno"
              required
              value={formData.turno}
              onChange={handleChange}
            >
              <option value="">Selecciona una categoría</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Mixto">Mixto</option>
            </select>

            <div className="modal-field">
              <button type="submit" className="modal-btn-save">
                Guardar
              </button>
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={onCerrar}
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearGrupos;
