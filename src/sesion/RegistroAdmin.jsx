import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../utils/axios.js";
import useFormData from "../hooks/useFormData";
import { USUARIOS } from "../enums/tipoUsuarios";
import "./RegistroAdmin.css";
import "../components/button.css";

function RegistrarAdmin() {
  const navigate = useNavigate();
  const { formData, handleChange, setFormData } = useFormData(USUARIOS.DOCENTE);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.nombres || !formData.apellidos || !formData.correo || !formData.password || !formData.confirmar) {
      await Swal.fire({
        title: "Faltan datos",
        text: "Completa todos los campos antes de continuar.",
        icon: "warning",
        confirmButtonText: "Entendido",
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
        buttonsStyling: false,
      });
      return;
    }

    if (formData.password !== formData.confirmar) {
      await Swal.fire({
        title: "Contraseñas diferentes",
        text: "La contraseña y su confirmación deben coincidir.",
        icon: "warning",
        confirmButtonText: "Entendido",
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
        buttonsStyling: false,
      });
      return;
    }

    const confirmacion = await Swal.fire({
      title: "¿Registrar administrador?",
      text: "Se creará una nueva cuenta de administrador.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, registrar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
      buttonsStyling: false,
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const urlBack = import.meta.env.VITE_URL_BACKEND;

      const datos = {
        nombres: formData.nombres,
        apellido: formData.apellidos,
        correo: formData.correo,
        password: formData.password,
      };

      await axios.post(`${urlBack}/crearAdmin`, datos);

      await Swal.fire({
        title: "Administrador registrado",
        text: "La cuenta se creó correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
        buttonsStyling: false,
      });

      setFormData({
        nombres: "",
        apellidos: "",
        escuela: "",
        correo: "",
        password: "",
        confirmar: "",
      });

      navigate("/Login");
    } catch (error) {
      await Swal.fire({
        title: "No se pudo registrar",
        text:
          error?.response?.data?.mensaje ||
          "Ocurrió un error al crear el administrador.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
        buttonsStyling: false,
      });
    }
  };

  return (
    <div className="admin-register-page">
      <div className="admin-register-shell">
        <div className="admin-register-card">
          <div className="admin-register-topbar">
            <Link to="/Login" className="btn-secondary btn-secondary--blue">
              ← Volver al inicio de sesión
            </Link>
          </div>

          <div className="admin-register-body">
            <div className="admin-register-header">
              <span className="admin-register-badge">🛡️ Cuenta administrativa</span>
              <h1>Registrar administrador</h1>
              <p>
                Completa la información para crear una cuenta con permisos de administración.
              </p>
            </div>

            <form className="admin-register-form" onSubmit={handleSubmit}>
              <div className="admin-register-grid">
                <div className="admin-register-field">
                  <label htmlFor="nombres">Nombre completo</label>
                  <input
                    type="text"
                    id="nombres"
                    name="nombres"
                    placeholder="Tus nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-register-field">
                  <label htmlFor="apellidos">Apellidos</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    placeholder="Tus apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-register-field">
                  <label htmlFor="correo">Correo electrónico</label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    placeholder="tu@correo.com"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-register-field">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-register-field admin-register-field--full">
                  <label htmlFor="confirmar">Confirmar contraseña</label>
                  <input
                    type="password"
                    id="confirmar"
                    name="confirmar"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmar}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="admin-register-actions">
                <button type="submit" className="admin-register-btn">
                  Registrar administrador
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="admin-register-illustration">
          <img
            src="/img/Recuperar_link.jpeg"
            alt="Ilustración de registro de administrador"
          />
        </div>
      </div>
    </div>
  );
}

export default RegistrarAdmin;