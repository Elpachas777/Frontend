function VerOracion({ contenido }) {
  return (
    <>
      <div className="contenedor">
        <strong>Texto</strong>
        <div className="contenedor-valor">{contenido.texto}</div>
      </div>

      {contenido.palabras.length > 0 && (
        <div className="contenedor">
          <strong>Palabras ({contenido.palabras.length})</strong>
          <div className="contenedor-oracion">
            {contenido.palabras.map((p, i) => (
              <span key={i}>{p.silabas.join(" - ")}</span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default VerOracion;
