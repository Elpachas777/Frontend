import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import { useRegistrarAdmin } from "../api/admin.api";
import "./Recuperar.css";
function RegistrarAdmin() {
  const { formData, handleChange } = useFormData(USUARIOS.DOCENTE);
  const { handleSubmit } = useRegistrarAdmin({ formData });
  return (
    <div className="form-wrap recuperar-form">
      <h1 className="title">Registrar Administrador</h1>
      <form
        className="areas"
        style={{ flexDirection: "column" }}
        onSubmit={handleSubmit}
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
                value={formData.correo}
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
                value={formData.confirmar}
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
                value={formData.apellidos}
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
                value={formData.password}
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
              Registrar administrador
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegistrarAdmin;
