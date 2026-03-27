import { useState } from "react";
import Swal from "sweetalert2";
import Tabla from "../components/Tabla";

let ejerciciosMock = [
  { id: 1, ejercicio: "Memoria visual" },
  { id: 2, ejercicio: "Encuentra la palabra" },
  { id: 3, ejercicio: "Ordena la secuencia" },
];

const swalStyles = {
  customClass: {
    popup: "swal-popup",
    title: "swal-title",
    htmlContainer: "swal-text",
    confirmButton: "swal-confirm-btn",
    cancelButton: "swal-cancel-btn",
  },
  buttonsStyling: false,
};

const obtenerEjercicios = async () => [...ejerciciosMock];

const borrarEjercicio = async (id) => {
  ejerciciosMock = ejerciciosMock.filter((item) => item.id !== id);
  return {
    tipo: "success",
    mensaje: "El ejercicio se eliminó correctamente.",
  };
};

function cardStyle(width = "min(640px, 92vw)") {
  return {
    width,
    background: "#ffffff",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
    boxSizing: "border-box",
  };
}

function titleStyle() {
  return {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "2rem",
    fontWeight: 900,
    color: "#112133",
    textAlign: "center",
  };
}

function fieldWrapStyle() {
  return {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "18px",
  };
}

function inputStyle() {
  return {
    width: "100%",
    height: "54px",
    padding: "0 16px",
    borderRadius: "16px",
    border: "1.5px solid #d7e3d4",
    fontSize: "1rem",
    boxSizing: "border-box",
    outline: "none",
  };
}

function actionRowCenter() {
  return {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    marginTop: "20px",
    flexWrap: "wrap",
  };
}

async function confirmarCancelacion(onCerrar, texto = "Se perderán los cambios no guardados.") {
  const resultado = await Swal.fire({
    title: "¿Cancelar?",
    text: texto,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, cancelar",
    cancelButtonText: "Seguir editando",
    reverseButtons: true,
    ...swalStyles,
  });

  if (resultado.isConfirmed) {
    onCerrar();
  }
}

function CrearEjercicio({ onCerrar, setActualizado }) {
  const [ejercicio, setEjercicio] = useState("");

  const guardar = async (e) => {
    e.preventDefault();

    if (!ejercicio.trim()) {
      await Swal.fire({
        title: "Falta el nombre",
        text: "Escribe el nombre del ejercicio.",
        icon: "warning",
        confirmButtonText: "Entendido",
        ...swalStyles,
      });
      return;
    }

    const confirmacion = await Swal.fire({
      title: "¿Crear ejercicio?",
      text: "Se agregará un nuevo ejercicio de ejemplo.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, crear",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      ...swalStyles,
    });

    if (!confirmacion.isConfirmed) return;

    const siguienteId =
      ejerciciosMock.length > 0
        ? Math.max(...ejerciciosMock.map((item) => item.id)) + 1
        : 1;

    ejerciciosMock = [
      ...ejerciciosMock,
      {
        id: siguienteId,
        ejercicio: ejercicio.trim(),
      },
    ];

    setActualizado((prev) => !prev);
    onCerrar();

    await Swal.fire({
      title: "Ejercicio creado",
      text: "El ejercicio se agregó correctamente.",
      icon: "success",
      confirmButtonText: "Aceptar",
      ...swalStyles,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={cardStyle()}>
        <h2 style={titleStyle()}>Crear nuevo ejercicio</h2>

        <form onSubmit={guardar}>
          <div style={fieldWrapStyle()}>
            <label>Nombre del ejercicio</label>
            <input
              style={inputStyle()}
              placeholder="Ej. Sopa de letras"
              value={ejercicio}
              onChange={(e) => setEjercicio(e.target.value)}
            />
          </div>

          <div style={actionRowCenter()}>
            <button
              type="button"
              className="cancelar-btn"
              onClick={() => confirmarCancelacion(onCerrar)}
            >
              Cancelar
            </button>

            <button type="submit" className="guardar-btn">
              Guardar ejercicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditarEjercicio({ onCerrar, setActualizado, filaSeleccionada }) {
  const [ejercicio, setEjercicio] = useState(filaSeleccionada?.ejercicio ?? "");

  const guardar = async (e) => {
    e.preventDefault();

    if (!ejercicio.trim()) {
      await Swal.fire({
        title: "Falta el nombre",
        text: "Escribe el nombre del ejercicio.",
        icon: "warning",
        confirmButtonText: "Entendido",
        ...swalStyles,
      });
      return;
    }

    const confirmacion = await Swal.fire({
      title: "¿Guardar cambios?",
      text: "Se actualizará el ejercicio.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      ...swalStyles,
    });

    if (!confirmacion.isConfirmed) return;

    ejerciciosMock = ejerciciosMock.map((item) =>
      item.id === filaSeleccionada.id
        ? { ...item, ejercicio: ejercicio.trim() }
        : item
    );

    setActualizado((prev) => !prev);
    onCerrar();

    await Swal.fire({
      title: "Ejercicio actualizado",
      text: "Los cambios se guardaron correctamente.",
      icon: "success",
      confirmButtonText: "Aceptar",
      ...swalStyles,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={cardStyle()}>
        <h2 style={titleStyle()}>Editar ejercicio</h2>

        <form onSubmit={guardar}>
          <div style={fieldWrapStyle()}>
            <label>ID</label>
            <input style={inputStyle()} value={filaSeleccionada?.id ?? ""} readOnly />
          </div>

          <div style={fieldWrapStyle()}>
            <label>Nombre del ejercicio</label>
            <input
              style={inputStyle()}
              value={ejercicio}
              onChange={(e) => setEjercicio(e.target.value)}
            />
          </div>

          <div style={actionRowCenter()}>
            <button
              type="button"
              className="cancelar-btn"
              onClick={() => confirmarCancelacion(onCerrar)}
            >
              Cancelar
            </button>

            <button type="submit" className="guardar-btn">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VerEjercicio({ onCerrar, filaSeleccionada }) {
  return (
    <div className="modal-overlay">
      <div className="modal" style={cardStyle("min(560px, 92vw)")}>
        <h2 style={titleStyle()}>Detalle del ejercicio</h2>

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #d9e2ec",
            borderRadius: "18px",
            padding: "20px",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <strong>ID:</strong> {filaSeleccionada?.id}
          </div>
          <div>
            <strong>Ejercicio:</strong> {filaSeleccionada?.ejercicio}
          </div>
        </div>

        <div style={actionRowCenter()}>
          <button className="cancelar-btn" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function Ejercicios() {
  return (
    <Tabla
      Crear={CrearEjercicio}
      obtenerDatos={obtenerEjercicios}
      titulo="ejercicios"
      Ver={VerEjercicio}
      Borrar={borrarEjercicio}
      Editar={EditarEjercicio}
    />
  );
}

export default Ejercicios;
