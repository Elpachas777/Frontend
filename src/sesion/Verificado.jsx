import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

/**
 * Página a la que el backend redirige tras verificar el correo del docente.
 * Muestra un SweetAlert de confirmación y lleva al usuario directamente
 * al Login. No requiere clicks adicionales.
 *
 * La ruta /verificado se registra en Publico.jsx y el backend redirige
 * aquí desde GET /verificar?token=... cuando la verificación es exitosa.
 */
function Verificado() {
  const navigate = useNavigate();
  // Evita doble disparo del Swal en StrictMode (React monta dos veces en dev).
  const yaDisparado = useRef(false);

  useEffect(() => {
    if (yaDisparado.current) return;
    yaDisparado.current = true;

    Swal.fire({
      icon: "success",
      title: "¡Cuenta verificada!",
      text: "Tu correo ha sido confirmado correctamente. Ya puedes iniciar sesión.",
      confirmButtonText: "Ir al inicio de sesión",
      confirmButtonColor: "#7bc043",
      allowOutsideClick: false,
      allowEscapeKey: false,
      timer: 5000,           // se cierra solo a los 5 segundos si el usuario no hace nada
      timerProgressBar: true,
    }).then(() => {
      navigate("/Login");
    });
  }, [navigate]);

  // Pantalla intermedia mientras aparece el alert (apenas se ve un segundo)
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f7f1",
      }}
    >
      <p style={{ color: "#555", fontSize: "1.1em" }}>
        Verificando tu cuenta...
      </p>
    </div>
  );
}

export default Verificado;