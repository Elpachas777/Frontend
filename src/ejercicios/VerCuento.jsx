function VerCuento({ contenido }) {
  const silabas = Array.isArray(contenido?.segmentos)
    ? contenido.segmentos.filter((s) => s.tipo === "silaba")
    : [];

  return (
    <>
      <div className="contenedor">
        <strong>Cuento</strong>
        <div className="contenedor-valor">
          {contenido?.texto || contenido?.cuento || "Sin contenido"}
        </div>
      </div>

      {silabas.length > 0 && (
        <div className="contenedor">
          <strong>Sílabas a trazar ({silabas.length})</strong>

          <div className="contenedor-oracion">
            {silabas.map((item, index) => (
              <span key={`${item.silaba}-${index}`}>{item.silaba}</span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default VerCuento;