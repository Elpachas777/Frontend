import { useState } from "react";
import EjercicioPlayer from "../docente/EjercicioPlayer";

function cleanWord(w) {
  return w.replace(/[.,!?;:"""'']/g, "").toLowerCase();
}

function Oracion({ ejercicio }) {
  const [texto, setTexto] = useState("");
  const [palabrasObj, setPalabrasObj] = useState([]);
  const [previewing, setPreviewing] = useState(false);

  const tokens = texto.trim() ? texto.trim().split(/\s+/) : [];
  const togglePalabra = (rawWord) => {
    const key = cleanWord(rawWord);
    if (!key) return;
    const existe = palabrasObj.find((p) => p.key === key);
    if (existe) {
      setPalabrasObj((prev) => prev.filter((p) => p.key !== key));
    } else {
      setPalabrasObj((prev) => [
        ...prev,
        { key, palabra: key, silabas: [key], raw: rawWord },
      ]);
    }
  };

  const updateSilabas = (key, valor) => {
    const silabas = valor
      .split("-")
      .map((s) => s.trim())
      .filter(Boolean);
    setPalabrasObj((prev) =>
      prev.map((p) => (p.key === key ? { ...p, silabas } : p)),
    );
  };

  const ejercicioPreview = {
    id: 0,
    ejercicio: ejercicio.titulo,
    texto,
    palabras: palabrasObj.map(({ palabra, silabas }) => ({ palabra, silabas })),
  };

  if (previewing) {
    return (
      <EjercicioPlayer
        ejercicio={ejercicioPreview}
        onCerrar={() => setPreviewing(false)}
      />
    );
  }

  return (
    <>
      <div className="modal-field">
        <label>Texto de la oración</label>
        <textarea
          placeholder="Ej. El perro estaba por el parque con un gato jugando con una pelota"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
        />
      </div>

      {tokens.length > 0 && (
        <div>
          <p>Haz clic en las palabras que el alumno practicará:</p>
          <div className="visualizador-palabras">
            {tokens.map((word, i) => {
              const key = cleanWord(word);
              const selected = palabrasObj.some((p) => p.key === key);
              return (
                <span
                  className={selected ? "activo" : ""}
                  key={i}
                  onClick={() => togglePalabra(word)}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {palabrasObj.length > 0 && (
        <div>
          <p>Define las sílabas separadas por guión:</p>
          <div className="visualiza-palabras">
            {palabrasObj.map((p) => (
              <div className="palabra" key={p.key}>
                <span>{p.palabra}</span>
                <input
                  value={p.silabas.join("-")}
                  onChange={(e) => updateSilabas(p.key, e.target.value)}
                />
                <span className="palabra-separada">
                  → {p.silabas.join(" · ")}
                </span>
              </div>
            ))}
          </div>

          <div className="modal-field">
            <button
              type="button"
              className="btn-prev"
              onClick={() => setPreviewing(true)}
            >
              Vista previa
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Oracion;
