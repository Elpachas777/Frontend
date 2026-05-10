import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Mensaje from "../components/Mensaje";
import Selector from "../ejercicios/Selector";
import { USUARIOS } from "../enums/tipoUsuarios";
import useFormData from "../hooks/useFormData";
import "../RolAdmin/RolAdmin.css";
import { crear, listarTipos } from "../utils/ejercicio";
import "./Ejercicios.css";

async function confirmarCancelacion(onCerrar) {
  const res = await Swal.fire({
    title: "¿Cancelar?",
    text: "Se perderán los cambios no guardados.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, cancelar",
    cancelButtonText: "Seguir editando",
    reverseButtons: true,
  });
  if (res.isConfirmed) onCerrar();
}

function CrearEjercicio({ onCerrar, onGuardado }) {
  const [tipos, setTipos] = useState([]);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);

  const { formData, handleChange, handleObjectChange } = useFormData(
    USUARIOS.EJERCICIO,
  );
  const { handleSubmit } = crear({
    formData,
    setErrores,
    setMensaje,
    onGuardado,
  });

  const cargar = useCallback(async () => {
    const tiposArreglo = await listarTipos();
    setTipos(tiposArreglo);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div className="modal-overlay">
      <div
        className="modal-card modal-card--wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Crear Ejercicio</h2>
          <button type="button" className="modal-close" onClick={onCerrar}>
            ✕
          </button>
        </div>
        {mensaje && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.mensaje} />}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Título del ejercicio</label>
            <input
              name="titulo"
              type="text"
              placeholder='Ej. "El perro y el gato"'
              value={formData.titulo}
              onChange={handleChange}
            />
          </div>

          <div className="modal-field">
            <label>Fecha de Inicio</label>
            <input
              name="fecha_inicio"
              type="datetime-local"
              value={formData.fecha_inicio}
              onChange={handleChange}
            />
          </div>

          <div className="modal-field">
            <label>Fecha de Entrega</label>
            <input
              name="fecha_final"
              type="datetime-local"
              value={formData.fecha_final}
              onChange={handleChange}
            />
          </div>

          <div className="modal-field">
            <label>Tipo de ejercicio</label>
            <select
              name="id_tipo"
              value={formData.id_tipo}
              onChange={handleChange}
            >
              <option value="">Seleccione el tipo de ejercicio</option>
              {tipos.map((tipo) => (
                <option key={tipo.id_tipo} value={tipo.id_tipo}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <Selector
            ejercicio={formData}
            handleObjectChange={handleObjectChange}
          />

          <div className="modal-field">
            <button type="submit" className="modal-btn-save">
              Guardar ejercicio
            </button>
            <button
              type="button"
              className="modal-btn-cancel"
              onClick={() => confirmarCancelacion(onCerrar)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearEjercicio;
