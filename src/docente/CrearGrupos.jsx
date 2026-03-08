import { useState } from "react";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import crear from "../utils/crearGrupo";
import "./CrearGrupos.css";
import Mensaje from "../components/Mensaje";

function CrearGrupos({ onCerrar, setActualizado }) {
  const [mensaje, setMensaje] = useState(null);
  const { formData, handleChange } = useFormData(USUARIOS.GRUPO);
  const { handleSubmit } = crear({ formData, setActualizado, setMensaje });

  return (
    <div className="modal-overlay">
      <div className="modal form-wrap crear-ejercicio">
        {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
        <h1 className="title">Crear nuevo grupo</h1>

        <form
          className="areas"
          onSubmit={handleSubmit}
          style={{ flexDirection: "column" }}
        >
          <div className="area">
            <label htmlFor="nombre">Nombre del grupo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ejemplo: 3C, 2B, 5A"
              required
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="area">
            <label htmlFor="turno">Turno</label>
            <select
              id="turno"
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
          </div>

          <div className="modal-botones">
            <button
              type="submit"
              className="guardar-btn"
              style={{ marginTop: "20px" }}
            >
              Crear grupo
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

export default CrearGrupos;
