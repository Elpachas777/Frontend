import Swal from "sweetalert2";

export default async function mensaje(titulo, { tipo, mensaje }) {
  await Swal.fire({
    icon: tipo,
    title: titulo,
    text: mensaje,
    confirmButtonText: "Entendido",
    confirmButtonColor: "#7bc043",
  });
}
