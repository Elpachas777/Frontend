import "./Registro.css";
import registrar from "../utils/registrarDocente";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import Mensaje from "../components/Mensaje";
import { useState } from "react";
import Swal from "sweetalert2";

function Registro({ onCerrar, setActualizado }) {
  const [mensaje, setMensaje] = useState(null);
  const { formData, handleChange } = useFormData(USUARIOS.DOCENTE);
  const { handleSubmit } = registrar({ formData, setActualizado, setMensaje });

  const confirmarGuardar = async (e) => {
    e.preventDefault();

    const resultado = await Swal.fire({
      title: "¿Guardar docente?",
      text: "Se registrará un nuevo docente.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
      allowOutsideClick: false,
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
      buttonsStyling: false,
    });

    if (resultado.isConfirmed) {
      handleSubmit(e);
    }
  };

  const confirmarCancelar = async () => {
    const resultado = await Swal.fire({
      title: "¿Cancelar registro?",
      text: "Se perderán los cambios no guardados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Seguir editando",
      reverseButtons: true,
      focusCancel: true,
      allowOutsideClick: false,
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
      buttonsStyling: false,
    });

    if (resultado.isConfirmed) {
      onCerrar();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal form-wrap crear-docente">
        {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}

        <h1 className="title">Crear nuevo docente</h1>

        <form
          className="areas"
          onSubmit={confirmarGuardar}
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
              <button type="submit" className="guardar-btn" name="guardar">
                Guardar docente
              </button>

              <button
                type="button"
                className="cancelar-btn"
                name="cancelar"
                onClick={confirmarCancelar}
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