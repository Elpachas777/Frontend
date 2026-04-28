import { useEffect, useState } from "react";
import { verAlumno } from "../api/alumno.api";
import Mensaje from "../components/Mensaje";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import editar from "../utils/editarAlumno";
import "./CrearAlumno.css";

function EditarAlumno({ onCerrar, setActualizado, filaSeleccionada }) {
  const [mensaje, setMensaje] = useState(null);
  const { formData, setFormData, handleChange } = useFormData(
    USUARIOS.ALUMNO_EDITAR,
  );
  const { handleSubmit } = editar({
    filaSeleccionada,
    formData,
    setActualizado,
    setMensaje,
  });

  useEffect(() => {
    const obtenerDocente = async () => {
      try {
        const { id } = filaSeleccionada;
        const alumno = await verAlumno(id);

        if (alumno.tipo) {
          setMensaje(alumno);
          return;
        }

        setFormData(alumno);
      } catch (error) {
        setMensaje(error);
      }
    };

    obtenerDocente();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal form-wrap crear-ejercicio">
        {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
        <h1 className="title">Editar alumno</h1>

        <form
          className="areas"
          onSubmit={handleSubmit}
          style={{ flexDirection: "column" }}
        >
          <div className="area">
            <label htmlFor="nombre">Nombre del alumno</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              placeholder={filaSeleccionada.nombres}
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
              placeholder={filaSeleccionada.apellidos}
            />
          </div>

          <div className="modal-botones">
            <button
              type="submit"
              className="guardar-btn"
              style={{ marginTop: "20px" }}
            >
              Guardar alumno
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

export default EditarAlumno;
