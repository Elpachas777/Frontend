import { useEffect, useState } from "react";
import { verDocente } from "../api/docente.api";
import Mensaje from "../components/Mensaje";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import editar from "../utils/editarDocente";
import "./Registro.css";
function EditarDocente({ onCerrar, setActualizado, filaSeleccionada }) {
  const [mensaje, setMensaje] = useState(null);
  const { formData, setFormData, handleChange } = useFormData(USUARIOS.DOCENTE);
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
        const docente = await verDocente(id);

        if (docente.tipo) {
          setMensaje(docente);
          return;
        }

        setFormData(docente);
      } catch (error) {
        setMensaje(error);
      }
    };

    obtenerDocente();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal form-wrap crear-docente">
        {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
        <h1 className="title">Crear nuevo docente</h1>
        <form
          className="areas"
          onSubmit={handleSubmit}
          style={{ flexDirection: "column" }}
        >
          <div className="fields-container">
            <div className="left-column">
              <div className="area">
                <label htmlFor="nombres">Nombre completo</label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  required
                  placeholder={formData.nombres}
                  value={formData.nombres}
                  onChange={handleChange}
                />
              </div>
              <div className="area">
                <label htmlFor="escuela">Escuela</label>
                <input
                  type="text"
                  id="escuela"
                  name="escuela"
                  required
                  placeholder={formData.escuela}
                  value={formData.escuela}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="right-column">
              <div className="area">
                <label htmlFor="apellidos">Apellidos</label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  required
                  placeholder={formData.apellidos}
                  value={formData.apellidos}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-botones">
              <button
                type="submit"
                className="guardar-btn"
                name="guardar"
                style={{ marginTop: "20px" }}
              >
                Guardar docente
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
          </div>
        </form>
      </div>
    </div>
  );
}
export default EditarDocente;
