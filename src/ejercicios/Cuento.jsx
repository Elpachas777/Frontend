import { useEffect, useMemo, useState } from "react";
import EjercicioPlayer from "../docente/EjercicioPlayer";

const TILDE_REGEX = /[áéíóúÁÉÍÓÚàèìòùäëïöüâêîôû]/;

// Extrae solo el contenido dentro de paréntesis tipo ____(sílaba)
function silabasEnParentesis(texto) {
  const matches = [...texto.matchAll(/_{2,}\(([^)]*)\)/g)];
  return matches.map((m) => m[1]);
}

function limpiarSilaba(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

function parsearCuento(texto) {
  const segmentos = [];
  const regex = /_{2,}\(([A-Za-z]{2})\)/g;

  let ultimoIndice = 0;
  let match;
  let contador = 0;

  while ((match = regex.exec(texto)) !== null) {
    const textoAntes = texto.slice(ultimoIndice, match.index);

    if (textoAntes) {
      segmentos.push({
        tipo: "texto",
        texto: textoAntes,
      });
    }

    const silaba = limpiarSilaba(match[1]);

    if (silaba) {
      segmentos.push({
        tipo: "silaba",
        id: `silaba-${contador}`,
        silaba,
      });

      contador += 1;
    }

    ultimoIndice = regex.lastIndex;
  }

  const textoFinal = texto.slice(ultimoIndice);

  if (textoFinal) {
    segmentos.push({
      tipo: "texto",
      texto: textoFinal,
    });
  }

  return segmentos;
}

function Cuento({ ejercicio, contenido, handleObjectChange }) {
  const [texto, setTexto] = useState("");
  const [previewing, setPreviewing] = useState(false);
  const [errorTilde, setErrorTilde] = useState("");

  const handleTextoChange = (e) => {
    const valor = e.target.value;
    // Validar si alguna sílaba dentro de paréntesis tiene tilde
    const silabasActuales = silabasEnParentesis(valor);
    if (silabasActuales.some((s) => TILDE_REGEX.test(s))) {
      setErrorTilde(
        "Las sílabas entre paréntesis no pueden contener tildes (acentos).",
      );
    } else {
      setErrorTilde("");
    }
    setTexto(valor);
  };

  const segmentos = useMemo(() => parsearCuento(texto), [texto]);

  const silabas = useMemo(
    () => segmentos.filter((s) => s.tipo === "silaba"),
    [segmentos],
  );

  const contenidoActual = useMemo(
    () => ({
      tipo: "cuento",
      texto,
      segmentos,
      palabras: silabas.map((s) => ({
        palabra: s.silaba,
        silabas: [s.silaba],
      })),
    }),
    [texto, segmentos, silabas],
  );

  useEffect(() => {
    if (!contenido) return;

    if (contenido.texto) {
      setTexto(contenido.texto);
      return;
    }

    if (contenido.cuento) {
      setTexto(contenido.cuento);
    }
  }, []);

  useEffect(() => {
    handleObjectChange("contenido", contenidoActual);
  }, [contenidoActual]);

  return (
    <>
      <div className="modal-field">
        <label>Cuento con espacios para trazar</label>
        <textarea
          rows={5}
          name="cuento"
          placeholder="Ej. Fernan____(da), Per____(la) estaban en el par____(que) jugan____(do)."
          value={texto}
          onChange={handleTextoChange}
          style={errorTilde ? { borderColor: "#c62828" } : {}}
        />
        {errorTilde && (
          <p
            style={{
              color: "#c62828",
              background: "#fff5f5",
              border: "1px solid #f5c6c6",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: "0.88rem",
              marginTop: 6,
            }}
          >
            {errorTilde}
          </p>
        )}
      </div>

      <div className="modal-field">
        <small style={{ color: "#667763", lineHeight: 1.6 }}>
          Escribe los huecos usando guiones bajos y la sílaba entre paréntesis.
          Ejemplo: <strong>Fernan____(da)</strong>. En la vista del alumno, el
          hueco se convertirá en un canvas.
        </small>
      </div>

      {silabas.length > 0 && (
        <div className="modal-field">
          <label>Sílabas detectadas</label>

          <div className="visualizador-palabras">
            {silabas.map((item) => (
              <span className="activo" key={item.id}>
                {item.silaba}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="modal-field">
        <button
          type="button"
          className="btn-prev"
          onClick={() => setPreviewing(true)}
          disabled={silabas.length === 0 || Boolean(errorTilde)}
        >
          Previsualizar
        </button>
      </div>

      {previewing && (
        <EjercicioPlayer
          ejercicio={{
            ...ejercicio,
            contenido: contenidoActual,
          }}
          soloVistaPrevia
          onCerrar={() => setPreviewing(false)}
        />
      )}
    </>
  );
}

export default Cuento;
