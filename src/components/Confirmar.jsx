import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Confirmar({ onCerrar, filaSeleccionada, Borrar, setActualizado }) {
  const handleBorrar = async () => {
    const resultado = await MySwal.fire({
      title: "¿Eliminar elemento?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
      buttonsStyling: false,
    });

    if (!resultado.isConfirmed) {
      onCerrar();
      return;
    }

    try {
      const respuesta = await Borrar(filaSeleccionada.id);

      setActualizado((prev) => !prev);

      await MySwal.fire({
        title: "Eliminado",
        text: respuesta?.mensaje || "El elemento fue eliminado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        allowOutsideClick: false,
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
        buttonsStyling: false,
      });

      onCerrar();
    } catch (error) {
      await MySwal.fire({
        title: "Error",
        text:
          error?.response?.data?.mensaje ||
          "No se pudo eliminar el elemento.",
        icon: "error",
        confirmButtonText: "Aceptar",
        allowOutsideClick: false,
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
        buttonsStyling: false,
      });

      onCerrar();
    }
  };

  handleBorrar();

  return null;
}

export default Confirmar;