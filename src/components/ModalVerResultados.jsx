function ModalVerResultados({ datos, onCerrar }) {
  const { grupo, estado, ejercicio } = datos;
  const alumnos = estado.alumnos || [];
  const eficacia = Number(estado.eficacia || 0);

  const colorPorPuntaje = (p) => {
    if (p >= 80) return "#4caf50";
    if (p >= 60) return "#9bbf3f";
    if (p >= 40) return "#e89a3c";
    return "#e35858";
  };

  return (
    <div
      className="ver-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div className="ver-modal-card">
        <button
          type="button"
          className="ver-modal-close"
          onClick={onCerrar}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <h2 className="ver-modal-title">Resultados · {grupo.nombre}</h2>

        <div className="ver-modal-summary">
          <p>
            <strong>Ejercicio:</strong> {ejercicio?.titulo || "—"}
          </p>
          <p>
            <strong>Alumnos que resolvieron:</strong> {estado.resueltos}/
            {estado.total_alumnos}
          </p>
          <p>
            <strong>Eficacia grupal:</strong> {eficacia.toFixed(2)}%
          </p>

          <div className="ver-modal-bar">
            <div
              className="ver-modal-bar-fill"
              style={{
                width: `${eficacia}%`,
                background: colorPorPuntaje(eficacia),
              }}
            />
          </div>
        </div>

        <h3 className="ver-modal-subtitle">Detalle por alumno</h3>

        {alumnos.length === 0 ? (
          <p className="ver-modal-empty">
            Este grupo no tiene alumnos registrados.
          </p>
        ) : (
          <div className="ver-modal-tabla">
            <div className="ver-modal-tabla-head">
              <span>Alumno</span>
              <span>ID</span>
              <span>Estado</span>
              <span>Mejor puntaje</span>
            </div>
            {alumnos.map((a) => (
              <div className="ver-modal-tabla-row" key={a.id_alumno}>
                <span className="ver-modal-tabla-nombre">{a.nombre}</span>
                <span className="ver-modal-tabla-id">{a.id_ingreso}</span>
                <span>
                  {a.resuelto ? (
                    <span className="ver-modal-chip ver-modal-chip--ok">
                      ✓ Resuelto
                    </span>
                  ) : (
                    <span className="ver-modal-chip ver-modal-chip--pend">
                      Pendiente
                    </span>
                  )}
                </span>
                <span
                  style={{
                    color: a.resuelto
                      ? colorPorPuntaje(a.mejor_puntaje)
                      : "#bbb",
                    fontWeight: 600,
                  }}
                >
                  {a.resuelto ? `${a.mejor_puntaje.toFixed(2)}%` : "—"}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="ver-modal-actions">
          <button type="button" className="btn btn-ver" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
export default ModalVerResultados;
