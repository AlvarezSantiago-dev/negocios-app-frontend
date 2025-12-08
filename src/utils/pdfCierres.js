// src/utils/pdfCierres.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Helpers de formato (hora / fecha en Argentina, moneda)
 */
const TZ = "America/Argentina/Buenos_Aires";

const formatFechaArg = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("es-AR", {
    timeZone: TZ,
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
};

const formatHoraArg = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleTimeString("es-AR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const money = (n) =>
  Number(n ?? 0).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * Encabezado corporativo simple (color + título)
 */
function drawHeader(doc, titulo) {
  doc.setFillColor(20, 90, 140);
  doc.rect(0, 0, 210, 30, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(titulo, 14, 20);

  // fecha generación (alineada a la derecha)
  doc.setFontSize(9);
  doc.text(
    `Generado: ${formatFechaArg(Date.now())} ${formatHoraArg(Date.now())}`,
    196,
    20,
    { align: "right" }
  );

  doc.setTextColor(0, 0, 0);
}

/**
 * Util: dibuja una etiqueta de campo/valor de forma compacta
 */
function drawKeyValueRow(doc, x, y, key, value) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(key, x, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(String(value), x + 60, y);
}

/**
 * Página nueva con header ya dibujado
 */
function nuevaPaginaConHeader(doc, titulo) {
  doc.addPage();
  drawHeader(doc, titulo);
}

/**
 * Generador principal — Exporta PDF y hace doc.save
 */
export function generarPDFCierreIndividual(cierre) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // Título
  drawHeader(doc, "Cierre de Caja - Informe Diario");

  // ------- Resumen principal (tarjeta) -------
  const startY = 40;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Resumen del Cierre", 14, startY);

  const resumen = [
    ["Fecha de cierre:", formatFechaArg(cierre.fecha)],
    ["Hora de cierre:", formatHoraArg(cierre.cierreHora ?? cierre.fecha)],
    ["Usuario:", cierre.usuario || "desconocido"],
    ["Apertura total:", `$ ${money(cierre.apertura)}`],
    ["Total vendido:", `$ ${money(cierre.totalVendido)}`],
    ["Ganancia total:", `$ ${money(cierre.gananciaTotal)}`],
    ["Ingresos (total):", `$ ${money(cierre.ingresos)}`],
    ["Egresos (total):", `$ ${money(cierre.egresos)}`],
    ["Saldo final (caja):", `$ ${money(cierre.total)}`],
    ["Cantidad de ventas:", cierre.cantidadVentas ?? 0],
  ];

  autoTable(doc, {
    startY: startY + 6,
    head: [],
    body: resumen,
    theme: "plain",
    styles: { fontSize: 10 },
    margin: { left: 14, right: 14 },
    tableLineWidth: 0,
    didDrawCell: (data) => {
      // dejamos sin nada extra
    },
  });

  let y = doc.lastAutoTable.finalY + 8;

  // ------- Totales por método (pequeñas tarjetas) -------
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Totales por método", 14, y);
  y += 6;

  const boxW = (210 - 28) / 3; // ancho por tarjeta
  const boxH = 16;
  const baseX = 14;

  // Efectivo
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(baseX, y, boxW - 4, boxH, 3, 3, "F");
  doc.setFontSize(10);
  doc.setTextColor(25, 25, 25);
  doc.text("Efectivo", baseX + 4, y + 6.5);
  doc.setFont("helvetica", "bold");
  doc.text(`$ ${money(cierre.efectivo)}`, baseX + 4, y + 12);

  // MP
  const x2 = baseX + boxW;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(x2, y, boxW - 4, boxH, 3, 3, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Mercado Pago", x2 + 4, y + 6.5);
  doc.setFont("helvetica", "bold");
  doc.text(`$ ${money(cierre.mp)}`, x2 + 4, y + 12);

  // Transferencia
  const x3 = baseX + boxW * 2;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(x3, y, boxW - 4, boxH, 3, 3, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Transferencias", x3 + 4, y + 6.5);
  doc.setFont("helvetica", "bold");
  doc.text(`$ ${money(cierre.transferencia)}`, x3 + 4, y + 12);

  y += boxH + 10;

  // ------- Movimientos (opcional breve) -------
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Movimientos (resumen)", 14, y);
  y += 6;

  // Construir una tabla simple de resumen de movimientos por tipo
  const movimientosResumen = [
    ["Concepto", "Valor"],
    ["Apertura total", `$ ${money(cierre.apertura)}`],
    ["Ingresos (total)", `$ ${money(cierre.ingresos)}`],
    [
      "Egresos (total)",
      `$ ${money.egresos ? money(cierre.egresos) : money(cierre.egresos)}`,
    ],
  ];

  autoTable(doc, {
    startY: y,
    head: [movimientosResumen[0]],
    body: movimientosResumen.slice(1),
    theme: "grid",
    headStyles: { fillColor: [53, 121, 166], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 10;

  // ------- Detalle de ventas (puede ser largo) -------
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Detalle de Ventas", 14, y);
  y += 6;

  if (!Array.isArray(cierre.ventas) || cierre.ventas.length === 0) {
    doc.setFontSize(10);
    doc.text("No hubo ventas en este período.", 14, y + 6);
    y += 12;
  } else {
    // Para cada venta, imprimimos encabezado + lista de productos
    for (let i = 0; i < cierre.ventas.length; i++) {
      const v = cierre.ventas[i];

      // Revisar si queda espacio, si no -> nueva página
      if (y > 260) {
        nuevaPaginaConHeader(doc, "Cierre de Caja - Informe Diario");
        y = 36;
      }

      // Encabezado venta
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(
        `Venta ${i + 1} — ${formatHoraArg(v.hora)} — $ ${money(v.total)}`,
        14,
        y
      );
      y += 6;

      // Método y detalle breve
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Método: ${String(v.metodo ?? "-")}`, 14, y);
      y += 6;

      // Productos: generar una tabla pequeña con columnas (Nombre, Cant, Precio, Total)
      const prodBody = (v.productos || []).map((p) => {
        const cantidad = Number(p.cantidad ?? 0);
        const precio = Number(p.precio ?? 0);
        const totalProducto = cantidad * precio;
        return [
          String(p.nombre ?? "(sin nombre)"),
          cantidad % 1 === 0 ? String(cantidad) : cantidad.toFixed(2),
          `$ ${money(precio)}`,
          `$ ${money(totalProducto)}`,
        ];
      });

      autoTable(doc, {
        startY: y,
        head: [["Producto", "Cant.", "Precio", "Total"]],
        body: prodBody,
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [230, 230, 230], textColor: 0 },
        margin: { left: 16, right: 14 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { halign: "center", cellWidth: 18 },
          2: { halign: "right", cellWidth: 28 },
          3: { halign: "right", cellWidth: 28 },
        },
        didDrawPage: (data) => {},
      });

      y = doc.lastAutoTable.finalY + 8;

      // Separador
      doc.setDrawColor(200, 200, 200);
      doc.line(14, y, 196, y);
      y += 8;
    }
  }

  // ------- Totales agregados (reafirmar cifras) -------
  if (y > 240) {
    // nueva página si falta espacio
    nuevaPaginaConHeader(doc, "Cierre de Caja - Informe Diario");
    y = 36;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Totales finales", 14, y);
  y += 6;

  const totalesFinales = [
    ["Apertura (total)", `$ ${money(cierre.apertura)}`],
    ["Total vendido", `$ ${money(cierre.totalVendido)}`],
    ["Ganancia total", `$ ${money(cierre.gananciaTotal)}`],
    ["Ingresos (total)", `$ ${money(cierre.ingresos)}`],
    ["Egresos (total)", `$ ${money(cierre.egresos)}`],
    ["Saldo final (caja)", `$ ${money(cierre.total)}`],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Campo", "Valor"]],
    body: totalesFinales,
    theme: "grid",
    headStyles: { fillColor: [53, 121, 166], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { left: 14, right: 14 },
  });

  // Pie
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(9);
  doc.text("Sistema de Caja — Reporte automático", 105, 290, {
    align: "center",
  });

  // Nombre archivo con fecha + hora
  const filename = `cierre-${formatFechaArg(cierre.fecha)}-${formatHoraArg(
    cierre.cierreHora ?? cierre.fecha
  ).replace(/:/g, "-")}.pdf`;

  doc.save(filename);
}
