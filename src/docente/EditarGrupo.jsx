import { useEffect, useState } from "react";
import Mensaje from "../components/Mensaje";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import "../RolAdmin/RolAdmin.css";
import { actualizar, agregar } from "../utils/editarGrupo";

function EditarGrupo({ grupo, onCerrar, onGuardado }) {
  const [mensaje, setMensaje] = useState(null);

  const {
    formData: grupoData,
    setFormData,
    handleChange: handleGrupo,
  } = useFormData(USUARIOS.GRUPO);

  const { formData: alumno, handleChange: handleAlumno } = useFormData(
    USUARIOS.ALUMNO,
  );

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
    formData: grupoData,
    setMensaje,
  });

  const { handleClick } = agregar({
    grupo,
    formData: alumno,
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
              placeholder={grupoData.nombre}
              value={grupoData.nombre}
              onChange={handleGrupo}
            />
          </div>

          <div className="modal-field">
            <label htmlFor="turno">Turno</label>
            <select
              id="turno"
              name="turno"
              required
              value={grupoData.turno}
              onChange={handleGrupo}
            >
              <option value="">{grupo.turno}</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Mixto">Mixto</option>
            </select>
          </div>

          <div className="divider">
            <span>Agregar alumno</span>
          </div>

          <div className="modal-field">
            <label htmlFor="nombrea">Nombre del alumno</label>
            <input
              type="text"
              id="nombrea"
              name="nombre"
              value={alumno.nombre}
              onChange={handleAlumno}
              placeholder="Nombre"
            />
          </div>

          <div className="modal-field">
            <label htmlFor="apellidos">Apellidos del alumno</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={alumno.apellidos}
              onChange={handleAlumno}
              placeholder="Apellidos"
            />
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
