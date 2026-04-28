import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SideBar from "../components/SideBar";

function getStoredUser() {
  try {
    const s = localStorage.getItem("frontend_user");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function PreviewLayout({ credencial = null, children }) {
  const navigate = useNavigate();
  const usuario = getStoredUser();
  const basePath =
    credencial === "admin"
      ? "/preview/admin"
      : credencial === "docente"
      ? "/preview/docente"
      : "";

  const handleCerrarSesion = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#7bc043",
    });
    if (!result.isConfirmed) return;
    localStorage.removeItem("frontend_user");
    navigate("/preview/login", { replace: true });
  };

  if (!credencial) {
    return <>{children}</>;
  }

  return (
    <div className="private-layout">
      <SideBar
        credencial={credencial}
        basePath={basePath}
        onCerrarSesion={handleCerrarSesion}
        usuario={usuario}
      />

      <main className="private-main private-main--preview">
        {children}
      </main>
    </div>
  );
}

export default PreviewLayout;