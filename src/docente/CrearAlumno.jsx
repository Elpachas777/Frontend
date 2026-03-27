import useFormData from "../hooks/useFormData";
import crear from "../utils/crearAlumno";
import "./CrearAlumno.css";
import { USUARIOS } from "../enums/tipoUsuarios";
import { useState } from "react";
import Mensaje from "../components/Mensaje";

function CrearAlumno({ onCerrar, setActualizado, id }) {
  const [mensaje, setMensaje] = useState(null);
  const { formData, handleChange } = useFormData(USUARIOS.ALUMNO);
  const { handleSubmit } = crear({ formData, setActualizado, id, setMensaje });

  return (
    <div className="modal-overlay">
      <div className="modal form-wrap crear-ejercicio">
        {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
        <h1 className="title">Crear nuevo alumno</h1>
        <form
          className="areas"
          onSubmit={handleSubmit}
          style={{ flexDirection: "column" }}
        >
          <div className="area">
            <label htmlFor="ombre">Nombre del alumno</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
            />
          </div>

          <div className="area">
            <label htmlFor="apellidos">Apellidos del alumno</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              required
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Apellidos"
            />
          </div>

          <div className="modal-botones">
            <button
              type="submit"
              className="guardar-btn"
              name="guardar"
              style={{ marginTop: "20px" }}
            >
              Crear alumno
            </button>
            <button
              type="button"
              className="cancelar-btn"
              onClick={onCerrar}
              style={{ marginTop: "20px" }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearAlumno;
