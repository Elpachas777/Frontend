import { useEffect, useState } from "react";
import Mensaje from "../components/Mensaje";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import "../RolAdmin/RolAdmin.css";
import { actualizar } from "../utils/editarGrupo";

function EditarGrupo({ grupo, onCerrar, onGuardado }) {
  const [mensaje, setMensaje] = useState(null);
  const { formData, setFormData, handleChange } = useFormData(USUARIOS.GRUPO);

  useEffect(() => {
    setFormData((prev) => {
      const nuevo = { ...prev };

      Object.keys(prev).forEach((key) => {
        if (key in grupo) {
          nuevo[key] = grupo[key];
        }
      });

      return nuevo;
    });
  }, []);

  const { handleSubmit } = actualizar(grupo, {
    formData,
    setMensaje,
  });

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="title">Editar grupo</h2>
          <button type="button" className="modal-close" onClick={onCerrar}>
            ✕
          </button>
        </div>
        {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label htmlFor="nombre">Nombre del grupo</label>
            <input
              type="text"
              name="nombre"
              required
              placeholder={formData.nombre}
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="modal-field">
            <label htmlFor="turno">Turno</label>
            <select
              id="turno"
              name="turno"
              required
              value={formData.turno}
              onChange={handleChange}
            >
              <option value="">{grupo.turno}</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Mixto">Mixto</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit" className="modal-btn-save">
              Guardar grupo
            </button>
            <button
              type="button"
              className="modal-btn-cancel"
              onClick={onCerrar}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarGrupo;
