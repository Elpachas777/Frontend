import "./Registro.css";
import registrar from "../utils/registrarDocente";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import Mensaje from "../components/Mensaje";
import { useState } from "react";

function Registro({ onCerrar, setActualizado }) {
  const [mensaje, setMensaje] = useState(null);
  const { formData, handleChange } = useFormData(USUARIOS.DOCENTE);
  const { handleSubmit } = registrar({ formData, setActualizado, setMensaje });

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
                  placeholder="Tus nombres"
                  required
                  value={formData.nombres}
                  onChange={handleChange}
                />
              </div>

              <div className="area">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  placeholder="tu@correo.com"
                  required
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>
              <div className="area">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
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
                  placeholder="Tus apellidos"
                  required
                  value={formData.apellidos}
                  onChange={handleChange}
                />
              </div>
              <div className="area">
                <label htmlFor="escuela">Escuela</label>
                <input
                  type="text"
                  id="escuela"
                  name="escuela"
                  placeholder="Tu escuela"
                  required
                  value={formData.escuela}
                  onChange={handleChange}
                />
              </div>
              <div className="area">
                <label htmlFor="confirmar">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmar"
                  name="confirmar"
                  placeholder="Repite tu contraseña"
                  required
                  value={formData.confirmar}
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
                name="cancelar"
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
export default Registro;
