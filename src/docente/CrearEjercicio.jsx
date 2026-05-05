import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
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

function CrearEjercicio({ onCerrar, setActualizado }) {
  const [tipos, setTipos] = useState([]);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);

  const { formData, handleChange } = useFormData(USUARIOS.EJERCICIO);
  const { handleSubmit } = crear({
    formData,
    setErrores,
    setMensaje,
  });

  const cargar = useCallback(async () => {
    const tiposArreglo = await listarTipos();
    setTipos(tiposArreglo);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div
        className="modal-card modal-card--wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <button type="button" className="modal-close" onClick={onCerrar}>
            ✕
          </button>{" "}
        </div>
        <form className="modal-form">
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
            <label>Tipo de ejercicio</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange}>
              <option value="">Seleccione el tipo de ejercicio</option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <Selector tipo={formData.tipo} ejercicio={formData} />

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
