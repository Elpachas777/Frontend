import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as respuestaApi from "../api/respuesta.api";

// ============================================================================
// Helpers
// ============================================================================

const COLORES = {
  primario: [60, 130, 50],       // verde principal
  primarioTexto: [255, 255, 255],
  acento: [123, 192, 67],         // verde claro
  gris: [120, 120, 120],
  texto: [40, 40, 40],
  separador: [220, 220, 220],
  fondoTabla: [245, 250, 240],
};

const colorPorPuntaje = (p) => {
  if (p >= 80) return [95, 191, 95];
  if (p >= 60) return [215, 201, 72];
  if (p >= 40) return [232, 154, 60];
  return [227, 88, 88];
};

function formatearFecha(fecha) {
  if (!fecha) return "—";
  const d = new Date(fecha);
  if (isNaN(d)) return String(fecha);
  return d.toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sanitizarNombreArchivo(nombre) {
  return String(nombre || "alumno")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 40);
}

// ============================================================================
// Dibujos manuales (gráficas como SVG vectorial dentro del PDF)
// ============================================================================

/**
 * Dibuja una gráfica de barras directamente en el canvas del PDF.
 * data = [{ name: string, value: number }]
 */
function dibujarBarras(doc, data, { x, y, w, h, titulo }) {
  if (!data || data.length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(...COLORES.gris);
    doc.text("Sin datos para graficar", x + w / 2, y + h / 2, {
      align: "center",
    });
    return;
  }

  // Título
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORES.texto);
  doc.text(titulo, x, y - 3);

  // Marco
  const padding = { top: 14, right: 8, bottom: 26, left: 30 };
  const innerX = x + padding.left;
  const innerY = y + padding.top;
  const innerW = w - padding.left - padding.right;
  const innerH = h - padding.top - padding.bottom;

  // Eje Y (0, 25, 50, 75, 100)
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORES.gris);
  doc.setDrawColor(...COLORES.separador);
  doc.setLineWidth(0.2);

  for (let i = 0; i <= 4; i++) {
    const v = i * 25;
    const py = innerY + innerH - (innerH * v) / 100;
    doc.line(innerX, py, innerX + innerW, py);
    doc.text(`${v}`, innerX - 3, py + 1.5, { align: "right" });
  }

  // Barras
  const cantidad = data.length;
  const espacio = innerW / cantidad;
  const anchoBarra = Math.min(espacio * 0.6, 30);

  data.forEach((item, idx) => {
    const valor = Math.max(0, Math.min(100, Number(item.value) || 0));
    const altura = (innerH * valor) / 100;
    const bx = innerX + idx * espacio + (espacio - anchoBarra) / 2;
    const by = innerY + innerH - altura;

    const [r, g, b] = colorPorPuntaje(valor);
    doc.setFillColor(r, g, b);
    doc.rect(bx, by, anchoBarra, altura, "F");

    // Label X (rotado si el texto es largo)
    doc.setFontSize(8);
    doc.setTextColor(...COLORES.texto);
    const label =
      item.name.length > 12 ? item.name.slice(0, 11) + "…" : item.name;
    doc.text(label, bx + anchoBarra / 2, innerY + innerH + 5, {
      align: "center",
    });

    // Valor encima de la barra
    doc.setFontSize(7);
    doc.setTextColor(...COLORES.texto);
    doc.text(`${valor.toFixed(1)}%`, bx + anchoBarra / 2, by - 1.5, {
      align: "center",
    });
  });
}

/**
 * Dibuja una gráfica de línea con la evolución temporal.
 * data = [{ fecha: Date|string, value: number, label?: string }]
 */
function dibujarLinea(doc, data, { x, y, w, h, titulo }) {
  if (!data || data.length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(...COLORES.gris);
    doc.text("Sin datos suficientes para graficar evolución", x + w / 2, y + h / 2, {
      align: "center",
    });
    return;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORES.texto);
  doc.text(titulo, x, y - 3);

  const padding = { top: 14, right: 8, bottom: 26, left: 30 };
  const innerX = x + padding.left;
  const innerY = y + padding.top;
  const innerW = w - padding.left - padding.right;
  const innerH = h - padding.top - padding.bottom;

  // Eje Y
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORES.gris);
  doc.setDrawColor(...COLORES.separador);
  doc.setLineWidth(0.2);

  for (let i = 0; i <= 4; i++) {
    const v = i * 25;
    const py = innerY + innerH - (innerH * v) / 100;
    doc.line(innerX, py, innerX + innerW, py);
    doc.text(`${v}`, innerX - 3, py + 1.5, { align: "right" });
  }

  // Puntos en X (uniformemente espaciados, no por tiempo real para simplificar)
  const cantidad = data.length;
  if (cantidad === 1) {
    // Único punto: dibujarlo en el centro
    const valor = Math.max(0, Math.min(100, Number(data[0].value) || 0));
    const px = innerX + innerW / 2;
    const py = innerY + innerH - (innerH * valor) / 100;
    doc.setFillColor(...COLORES.primario);
    doc.circle(px, py, 1.6, "F");
    doc.setFontSize(7);
    doc.setTextColor(...COLORES.texto);
    doc.text(`${valor.toFixed(1)}%`, px, py - 3, { align: "center" });
    doc.text(formatearFecha(data[0].fecha).split(" ")[0], px, innerY + innerH + 5, {
      align: "center",
    });
    return;
  }

  const dx = innerW / (cantidad - 1);
  const puntos = data.map((d, i) => {
    const valor = Math.max(0, Math.min(100, Number(d.value) || 0));
    return {
      x: innerX + i * dx,
      y: innerY + innerH - (innerH * valor) / 100,
      valor,
      fecha: d.fecha,
    };
  });

  // Línea
  doc.setDrawColor(...COLORES.primario);
  doc.setLineWidth(0.6);
  for (let i = 1; i < puntos.length; i++) {
    doc.line(puntos[i - 1].x, puntos[i - 1].y, puntos[i].x, puntos[i].y);
  }

  // Puntos + labels
  puntos.forEach((p, i) => {
    doc.setFillColor(...COLORES.primario);
    doc.circle(p.x, p.y, 1.4, "F");

    // Valor encima
    doc.setFontSize(7);
    doc.setTextColor(...COLORES.texto);
    doc.text(`${p.valor.toFixed(0)}%`, p.x, p.y - 2.5, { align: "center" });

    // Fecha solo en algunos para no saturar
    const mostrarFecha =
      cantidad <= 6 ||
      i === 0 ||
      i === puntos.length - 1 ||
      i % Math.ceil(cantidad / 5) === 0;

    if (mostrarFecha) {
      const f = formatearFecha(p.fecha).split(" ")[0];
      doc.setFontSize(7);
      doc.setTextColor(...COLORES.gris);
      doc.text(f, p.x, innerY + innerH + 5, { align: "center" });
    }
  });
}

// ============================================================================
// Generación del PDF
// ============================================================================

/**
 * Genera y descarga el PDF del alumno.
 *
 * @param {Object} alumno  - { id_ingreso, nombres, grupo }
 * @param {Object} datos   - datos ya cargados en el componente:
 *   {
 *     eficaciaGlobal: number,
 *     ejercicios: [{ id_ejercicio, titulo, mejor_puntaje, total_intentos, fecha_mejor_intento }],
 *     silabasDificiles: [{ silaba, precision, intentos }]
 *   }
 */
export async function generarReporteAlumno(alumno, datos) {
  const { eficaciaGlobal, ejercicios, silabasDificiles } = datos;

  // 1) Pedimos el detalle (histórico completo) de cada ejercicio.
  //    Esto nos da todos los intentos con todas las sílabas.
  const detallesPorEjercicio = await Promise.all(
    ejercicios.map(async (ej) => {
      try {
        const det = await respuestaApi.obtenerResultadosAlumnoEjercicio(
          alumno.id_ingreso,
          ej.id_ejercicio,
        );
        return { ejercicio: ej, detalle: det };
      } catch (err) {
        console.error("Error cargando detalle ejercicio", ej.id_ejercicio, err);
        return { ejercicio: ej, detalle: null };
      }
    }),
  );

  // Construir la línea temporal: cada intento de cada ejercicio en orden cronológico.
  const lineaTemporal = [];
  detallesPorEjercicio.forEach(({ ejercicio, detalle }) => {
    if (!detalle?.intentos) return;
    detalle.intentos.forEach((intento) => {
      lineaTemporal.push({
        fecha: intento.fecha,
        value: intento.promedio,
        label: ejercicio.titulo,
      });
    });
  });
  lineaTemporal.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  // ============================================================
  // Crear el documento
  // ============================================================
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const margenIzq = 14;
  const margenDer = 14;
  const anchoUtil = doc.internal.pageSize.getWidth() - margenIzq - margenDer;

  let cursorY = 0;

  // ============================================================
  // Header
  // ============================================================
  doc.setFillColor(...COLORES.primario);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 22, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...COLORES.primarioTexto);
  doc.text("SilaTrazo · Reporte del alumno", margenIzq, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Generado el ${formatearFecha(new Date())}`,
    doc.internal.pageSize.getWidth() - margenDer,
    13,
    { align: "right" },
  );

  cursorY = 30;

  // ============================================================
  // Datos generales
  // ============================================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLORES.texto);
  doc.text("Datos generales", margenIzq, cursorY);
  cursorY += 2;
  doc.setDrawColor(...COLORES.acento);
  doc.setLineWidth(0.5);
  doc.line(margenIzq, cursorY, margenIzq + 40, cursorY);
  cursorY += 6;

  const filasGenerales = [
    ["Nombre", alumno.nombres || "—"],
    ["ID de acceso", alumno.id_ingreso || "—"],
    ["Grupo", alumno.grupo || "—"],
    ["Eficacia global", `${Number(eficaciaGlobal || 0).toFixed(2)}%`],
    ["Ejercicios con resultados", String(ejercicios.length)],
  ];

  autoTable(doc, {
    startY: cursorY,
    head: [],
    body: filasGenerales,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 1.5, textColor: COLORES.texto },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50, textColor: COLORES.gris },
      1: { cellWidth: "auto" },
    },
    margin: { left: margenIzq, right: margenDer },
  });

  cursorY = doc.lastAutoTable.finalY + 10;

  // ============================================================
  // Sílabas con mayor dificultad
  // ============================================================
  if (silabasDificiles && silabasDificiles.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...COLORES.texto);
    doc.text("Sílabas con mayor dificultad", margenIzq, cursorY);
    cursorY += 2;
    doc.setDrawColor(...COLORES.acento);
    doc.line(margenIzq, cursorY, margenIzq + 65, cursorY);
    cursorY += 6;

    autoTable(doc, {
      startY: cursorY,
      head: [["Sílaba", "Precisión", "Intentos"]],
      body: silabasDificiles.map((s) => [
        s.silaba.toUpperCase(),
        `${Number(s.precision).toFixed(2)}%`,
        String(s.intentos),
      ]),
      theme: "striped",
      headStyles: {
        fillColor: COLORES.primario,
        textColor: COLORES.primarioTexto,
        fontStyle: "bold",
        fontSize: 10,
      },
      bodyStyles: { fontSize: 10, textColor: COLORES.texto },
      alternateRowStyles: { fillColor: COLORES.fondoTabla },
      margin: { left: margenIzq, right: margenDer },
    });

    cursorY = doc.lastAutoTable.finalY + 10;
  }

  // ============================================================
  // Detalle de cada ejercicio (histórico completo)
  // ============================================================
  if (detallesPorEjercicio.length > 0) {
    // Salto de página si no cabe el título + algo de tabla.
    if (cursorY > 240) {
      doc.addPage();
      cursorY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...COLORES.texto);
    doc.text("Detalle de ejercicios (histórico completo)", margenIzq, cursorY);
    cursorY += 2;
    doc.setDrawColor(...COLORES.acento);
    doc.line(margenIzq, cursorY, margenIzq + 90, cursorY);
    cursorY += 8;

    detallesPorEjercicio.forEach(({ ejercicio, detalle }) => {
      // Si quedan menos de ~60 mm, salto de página
      if (cursorY > 230) {
        doc.addPage();
        cursorY = 20;
      }

      // Título del ejercicio
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...COLORES.texto);
      doc.text(`Ejercicio: ${ejercicio.titulo}`, margenIzq, cursorY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLORES.gris);
      doc.text(
        `Mejor puntaje: ${Number(ejercicio.mejor_puntaje || 0).toFixed(
          2,
        )}%   |   Total de intentos: ${ejercicio.total_intentos || 0}`,
        margenIzq,
        cursorY + 5,
      );
      cursorY += 10;

      if (!detalle || !detalle.intentos || detalle.intentos.length === 0) {
        doc.setFontSize(9);
        doc.setTextColor(...COLORES.gris);
        doc.text("Sin intentos registrados.", margenIzq, cursorY);
        cursorY += 8;
        return;
      }

      // Reagrupamos las respuestas por intento+silaba para la tabla.
      // Para no hacer otro fetch usamos `detalle.intentos` (no trae sílabas por intento,
      // solo por consolidado), así que hacemos una tabla por intento con su promedio y
      // luego mostramos el consolidado de sílabas que sí viene en el detalle.
      //
      // Tabla 1: lista de intentos (cronológica ascendente)
      const intentosAsc = [...detalle.intentos].sort(
        (a, b) => new Date(a.fecha) - new Date(b.fecha),
      );

      autoTable(doc, {
        startY: cursorY,
        head: [["#", "Fecha del intento", "Promedio"]],
        body: intentosAsc.map((intento, i) => [
          String(i + 1),
          formatearFecha(intento.fecha),
          `${Number(intento.promedio).toFixed(2)}%`,
        ]),
        theme: "grid",
        headStyles: {
          fillColor: COLORES.acento,
          textColor: COLORES.primarioTexto,
          fontStyle: "bold",
          fontSize: 9,
        },
        bodyStyles: { fontSize: 9, textColor: COLORES.texto },
        columnStyles: {
          0: { halign: "center", cellWidth: 12 },
          1: { cellWidth: 60 },
          2: { halign: "right" },
        },
        margin: { left: margenIzq, right: margenDer },
      });

      cursorY = doc.lastAutoTable.finalY + 4;

      // Tabla 2: precisión por sílaba (consolidado de todos los intentos)
      if (detalle.silabas && detalle.silabas.length > 0) {
        if (cursorY > 250) {
          doc.addPage();
          cursorY = 20;
        }
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(...COLORES.gris);
        doc.text("Precisión por sílaba (consolidado):", margenIzq, cursorY);
        cursorY += 3;

        autoTable(doc, {
          startY: cursorY,
          head: [["Sílaba", "Precisión promedio", "Intentos"]],
          body: detalle.silabas
            .slice()
            .sort((a, b) => a.precision_promedio - b.precision_promedio)
            .map((s) => [
              s.silaba.toUpperCase(),
              `${Number(s.precision_promedio).toFixed(2)}%`,
              String(s.intentos),
            ]),
          theme: "striped",
          headStyles: {
            fillColor: COLORES.primario,
            textColor: COLORES.primarioTexto,
            fontSize: 9,
            fontStyle: "bold",
          },
          bodyStyles: { fontSize: 9, textColor: COLORES.texto },
          alternateRowStyles: { fillColor: COLORES.fondoTabla },
          columnStyles: {
            0: { halign: "center" },
            1: { halign: "right" },
            2: { halign: "center" },
          },
          margin: { left: margenIzq, right: margenDer },
        });

        cursorY = doc.lastAutoTable.finalY + 10;
      } else {
        cursorY += 4;
      }
    });
  }

  // ============================================================
  // Página final con las dos gráficas
  // ============================================================
  doc.addPage();
  cursorY = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLORES.texto);
  doc.text("Rendimiento general", margenIzq, cursorY);
  cursorY += 2;
  doc.setDrawColor(...COLORES.acento);
  doc.line(margenIzq, cursorY, margenIzq + 50, cursorY);
  cursorY += 10;

  // Gráfica de barras
  const datosBarras = ejercicios.map((e) => ({
    name: e.titulo,
    value: e.mejor_puntaje,
  }));

  dibujarBarras(doc, datosBarras, {
    x: margenIzq,
    y: cursorY,
    w: anchoUtil,
    h: 90,
    titulo: "Mejor puntaje por ejercicio",
  });
  cursorY += 100;

  // Gráfica de evolución temporal
  dibujarLinea(doc, lineaTemporal, {
    x: margenIzq,
    y: cursorY,
    w: anchoUtil,
    h: 90,
    titulo: "Evolución cronológica de intentos",
  });

  // ============================================================
  // Footer en cada página
  // ============================================================
  const totalPaginas = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORES.gris);
    doc.text(
      `Página ${i} de ${totalPaginas}`,
      doc.internal.pageSize.getWidth() - margenDer,
      doc.internal.pageSize.getHeight() - 8,
      { align: "right" },
    );
    doc.text(
      `Alumno: ${alumno.nombres || ""} · ID ${alumno.id_ingreso || ""}`,
      margenIzq,
      doc.internal.pageSize.getHeight() - 8,
    );
  }

  // ============================================================
  // Descarga
  // ============================================================
  const fecha = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const nombreLimpio = sanitizarNombreArchivo(alumno.nombres);
  const filename = `reporte-${nombreLimpio}-${fecha}.pdf`;

  doc.save(filename);
}