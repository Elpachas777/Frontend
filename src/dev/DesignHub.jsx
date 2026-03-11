import { Link } from "react-router-dom";

const pages = [
  { to: "/preview/landing", label: "Landing", desc: "Pantalla inicial" },
  { to: "/preview/login", label: "Login", desc: "Inicio de sesión" },
  { to: "/preview/registro", label: "Registro docente", desc: "Alta de docente" },
  { to: "/preview/registro-admin", label: "Registro admin", desc: "Alta de administrador" },
  { to: "/preview/recuperar", label: "Recuperar", desc: "Solicitud de enlace" },
  { to: "/preview/restablecer", label: "Restablecer", desc: "Nueva contraseña" },
  { to: "/preview/admin/docentes", label: "Docentes", desc: "Vista privada admin" },
  { to: "/preview/docente/alumnos", label: "Alumnos", desc: "Vista privada docente" },
  { to: "/preview/docente/grupos", label: "Grupos", desc: "Vista privada docente" },
];

function DesignHub() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#2563eb",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: "0.82rem",
          }}
        >
          Desarrollo
        </p>
        <h1 style={{ marginTop: "10px", marginBottom: "10px", color: "#0f172a" }}>
          Panel de navegación para diseño
        </h1>
        <p style={{ marginTop: 0, color: "#475569", lineHeight: 1.6 }}>
          Desde aquí puedes entrar directo a cada pantalla sin depender del flujo de autenticación.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          {pages.map((page) => (
            <Link
              key={page.to}
              to={page.to}
              style={{
                textDecoration: "none",
                border: "1px solid #dbe3f0",
                borderRadius: "16px",
                padding: "18px",
                color: "inherit",
                background: "#f8fbff",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
              }}
            >
              <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
                {page.label}
              </div>
              <div style={{ color: "#64748b", fontSize: "0.95rem" }}>{page.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DesignHub;
