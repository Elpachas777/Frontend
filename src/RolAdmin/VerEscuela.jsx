import "./RolAdmin.css";
import { getLogo } from "../utils/logoCache";

function toEmbedUrl(url, nombre) {
  try {
    if (!url || !url.startsWith("http")) return nombre
      ? `https://maps.google.com/maps?q=${encodeURIComponent(nombre)}&output=embed`
      : null;

    if (url.includes("/embed")) return url;

    // /@lat,lng,zoom — handles decimal zoom (17z, 17.5z)
    const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),([\d.]+)/);
    if (coordMatch) {
      const [, lat, lng, zoom] = coordMatch;
      return `https://maps.google.com/maps?q=${lat},${lng}&z=${Math.round(zoom)}&output=embed`;
    }

    // /maps/place/NAME
    const placeMatch = url.match(/\/maps\/place\/([^/@?&]+)/);
    if (placeMatch) {
      const place = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
      return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
    }

    // ?q= param
    const u = new URL(url);
    const q = u.searchParams.get("q");
    if (q) return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;

    // Shortened URL (goo.gl / maps.app.goo.gl) — can't embed, use nombre fallback
    if (nombre)
      return `https://maps.google.com/maps?q=${encodeURIComponent(nombre)}&output=embed`;

    return null;
  } catch {
    return nombre
      ? `https://maps.google.com/maps?q=${encodeURIComponent(nombre)}&output=embed`
      : null;
  }
}

function VerEscuela({ escuela, onCerrar }) {
  const embedUrl = toEmbedUrl(escuela.ubicacion, escuela.nombre);
  const isMapUrl = /^https?:\/\//i.test(escuela.ubicacion || "");

  const { docentes } = escuela;

  return (
    <div className="modal-overlay">
      <div
        className="modal-card modal-card--escuela"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Detalle de la escuela</h2>
          <button type="button" className="modal-close" onClick={onCerrar}>
            ✕
          </button>
        </div>

        <div className="escuela-panel">
          {/* ── Left column ── */}
          <div className="escuela-panel-left">
            <div className="escuela-panel-logo">
              {(() => {
                const src = escuela.logo || getLogo(escuela.nombre);
                return src
                  ? <img src={src} alt={escuela.nombre} />
                  : <span className="escuela-logo-placeholder">🏫</span>;
              })()}
            </div>

            <div className="escuela-panel-info">
              <span className="escuela-info-nombre">{escuela.nombre}</span>

              <div className="escuela-info-fila">
                <span className="escuela-info-label">Director a cargo</span>
                <span>{escuela.director}</span>
              </div>

              <div className="escuela-info-fila">
                <span className="escuela-info-label">Contacto</span>
                <span>{escuela.contacto}</span>
              </div>

              {escuela.contacto_adicional && (
                <div className="escuela-info-fila">
                  <span className="escuela-info-label">Contacto #2</span>
                  <span>{escuela.contacto_adicional}</span>
                </div>
              )}

              <div className="escuela-info-fila">
                <span className="escuela-info-label">
                  Profesores ingresados
                </span>
                {docentes.length > 0 ? (
                  <ul className="escuela-profesores-list">
                    {docentes.map((docente) => (
                      <li key={docente.id}>{docente.nombre}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="escuela-sin-profesores">
                    Sin profesores registrados
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Right column: map ── */}
          <div className="escuela-panel-right">
            <span className="escuela-info-label">Ubicación</span>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="escuela-mapa"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación en Google Maps"
              />
            ) : isMapUrl ? (
              <div className="escuela-mapa-fallback">
                <p>Vista previa no disponible.</p>
                <a
                  href={escuela.ubicacion}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="escuela-mapa-link"
                >
                  Ver en Google Maps ↗
                </a>
              </div>
            ) : (
              <div className="escuela-mapa-fallback">
                <p>{escuela.ubicacion || "Sin ubicación registrada"}</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: "24px" }}>
          <button type="button" className="modal-btn-cancel" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerEscuela;
