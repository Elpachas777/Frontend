import Swal from "sweetalert2";

export default async function mensaje(titulo, { tipo, mensaje }) {
  await Swal.fire({
    title: titulo,
    text: mensaje,
    icon: tipo,
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