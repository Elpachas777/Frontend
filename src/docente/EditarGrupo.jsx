import useFormData from "../hooks/useFormData";
import { editar, agregar } from "../utils/editarGrupo";
import { USUARIOS } from "../enums/tipoUsuarios";
import Mensaje from "../components/Mensaje";
import { useState } from "react";

function EditarGrupo({ onCerrar, setActualizado, filaSeleccionada }) {
  const [mensaje, setMensaje] = useState(null);

  const { formData: grupo, handleChange: handleGrupo } = useFormData(
    USUARIOS.GRUPO
  );

  const { formData: alumno, handleChange: handleAlumno } = useFormData(
    USUARIOS.ALUMNO
  );

  const { handleSubmit } = editar({
    filaSeleccionada,
    formData: grupo,
    setActualizado,
    setMensaje,
  });

  const { handleClick } = agregar({
    filaSeleccionada,
    formData: alumno,
    setActualizado,
    setMensaje,
  });

  return (
    <div className="modal-overlay">
      <div className="modal form-wrap crear-ejercicio">
        {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
        <h1 className="title">Editar grupo</h1>

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
              required
              placeholder={filaSeleccionada.nombre}
              value={grupo.nombre}
              onChange={handleGrupo}
            />
          </div>

          <div className="area">
            <label htmlFor="turno">Turno</label>
            <select
              id="turno"
              name="turno"
              required
              value={grupo.turno}
              onChange={handleGrupo}
            >
              <option value="">{filaSeleccionada.turno}</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Mixto">Mixto</option>
            </select>
          </div>

          <div className="divider">
            <span>Agregar alumno</span>
          </div>

          <div className="area">
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

          <div className="area">
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

          <button
            type="button"
            className="guardar-btn"
            style={{ marginTop: "20px" }}
            onClick={handleClick}
          >
            Agregar alumno
          </button>

          <div className="modal-botones">
            <button
              type="submit"
              className="guardar-btn"
              style={{ marginTop: "20px" }}
            >
              Guardar grupo
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

export default EditarGrupo;
