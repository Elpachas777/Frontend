import { useState } from "react";
import Swal from "sweetalert2";
import { eliminarDocente, reenviarVerificacion, verDocentes } from "../api/docente.api";
import Tabla from "../components/Tabla";
import EditarDocente from "./EditarDocente";
import Registro from "./Registro";

function BotonReenviar({ fila, onCambio }) {
  const [enviando, setEnviando] = useState(false);

  // Solo aparece para docentes pendientes de verificación.
  if (fila?.estado !== "Pendiente") return null;

  const handleClick = async () => {
    if (enviando) return;

    const confirm = await Swal.fire({
      title: "Reenviar correo de verificación",
      html: `¿Enviar nuevamente el correo de verificación a <strong>${fila.correo}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, reenviar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#7bc043",
      cancelButtonColor: "#6c757d",
    });

    if (!confirm.isConfirmed) return;

    try {
      setEnviando(true);
      const res = await reenviarVerificacion(fila.id);

      await Swal.fire({
        icon: "success",
        title: "Correo enviado",
        text: res?.mensaje || `Se reenvió el correo de verificación a ${fila.correo}.`,
        timer: 2200,
        showConfirmButton: false,
      });

      if (onCambio) onCambio();
    } catch (error) {
      const datos = error?.response?.data || {};
      await Swal.fire({
        icon: "error",
        title: "No se pudo reenviar",
        text:
          datos.mensaje ||
          "Ocurrió un error al reenviar el correo. Intenta de nuevo.",
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <button
      type="button"
      className="btn btn-reenviar"
      onClick={handleClick}
      disabled={enviando}
      title={`Reenviar correo de verificación a ${fila.correo}`}
    >
      {enviando ? "Enviando…" : "Reenviar correo"}
    </button>
  );
}

function Docentes() {
  return (
    <Tabla
      Crear={Registro}
      obtenerDatos={verDocentes}
      titulo={"docentes"}
      Borrar={eliminarDocente}
      Editar={EditarDocente}
      ocultarColumnas={["habilitado"]}
      AccionExtra={BotonReenviar}
    />
  );
}

export default Docentes;