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
 * Encabezado corporativo moderno con gradiente simulado
 */
function drawHeader(doc, titulo, isAnulado = false) {
  // Fondo principal con colores más vibrantes
  if (isAnulado) {
    // Rojo para anulados
    doc.setFillColor(220, 38, 38);
  } else {
    // Azul-púrpura para activos
    doc.setFillColor(37, 99, 235);
  }
  doc.rect(0, 0, 210, 35, "F");

  // Línea decorativa inferior
  if (isAnulado) {
    doc.setFillColor(239, 68, 68);
  } else {
    doc.setFillColor(147, 51, 234);
  }
  doc.rect(0, 30, 210, 5, "F");

  // Título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(titulo, 14, 18);

  // Subtítulo si es anulado
  if (isAnulado) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("*** DOCUMENTO ANULADO ***", 14, 26);
  }

  // fecha generación (alineada a la derecha)
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generado: ${formatFechaArg(Date.now())} ${formatHoraArg(Date.now())}`,
    196,
    isAnulado ? 26 : 22,
    { align: "right" }
  );

  doc.setTextColor(0, 0, 0);
}

/**
 * Página nueva con header ya dibujado
 */
function nuevaPaginaConHeader(doc, titulo, isAnulado = false) {
  doc.addPage();
  drawHeader(doc, titulo, isAnulado);
}

/**
 * Generador principal — Exporta PDF y hace doc.save
 */
export function generarPDFCierreIndividual(cierre) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const isAnulado = cierre.estado === "anulado";

  // Título con detección de anulado
  drawHeader(doc, "Cierre de Caja - Informe Diario", isAnulado);

  // ------- Banner de advertencia si está anulado -------
  let startY = 45;
  if (isAnulado) {
    doc.setFillColor(254, 226, 226); // bg-red-100
    doc.roundedRect(14, startY, 182, 20, 3, 3, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(185, 28, 28); // text-red-700
    doc.text("CIERRE ANULADO", 105, startY + 7, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      `Motivo: ${cierre.anuladoMotivo || "No especificado"}`,
      105,
      startY + 12,
      { align: "center" }
    );
    doc.text(`Anulado por: ${cierre.anuladoPor || "N/A"}`, 105, startY + 16, {
      align: "center",
    });

    startY += 26;
    doc.setTextColor(0, 0, 0);
  }

  // ------- Resumen principal -------
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235); // text-blue-600
  doc.text("RESUMEN DEL CIERRE", 14, startY);
  doc.setTextColor(0, 0, 0);

  const resumen = [
    ["Fecha de cierre:", formatFechaArg(cierre.fecha)],
    ["Hora de cierre:", formatHoraArg(cierre.cierreHora ?? cierre.fecha)],
    ["Usuario:", cierre.usuario || "desconocido"],
    ["Apertura total:", `$ ${money(cierre.apertura)}`],
    ["Total vendido:", `$ ${money(cierre.totalVendido)}`],
    ["Ganancia total:", `$ ${money(cierre.gananciaTotal)}`],
    [
      "Ganancia neta:",
      `$ ${money(
        cierre.gananciaNeta ?? cierre.gananciaTotal - cierre.egresos
      )}`,
    ],
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
    styles: { fontSize: 10, cellPadding: 2 },
    margin: { left: 14, right: 14 },
    tableLineWidth: 0,
    alternateRowStyles: { fillColor: [249, 250, 251] },
  });

  let y = doc.lastAutoTable.finalY + 10;

  // ------- Totales por método (tarjetas coloridas) -------
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(147, 51, 234); // text-purple-600
  doc.text("TOTALES POR METODO DE PAGO", 14, y);
  doc.setTextColor(0, 0, 0);
  y += 8;

  const boxW = (210 - 28) / 3;
  const boxH = 18;
  const baseX = 14;

  // Efectivo - Verde
  doc.setFillColor(209, 250, 229); // bg-green-100
  doc.roundedRect(baseX, y, boxW - 4, boxH, 3, 3, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(21, 128, 61); // text-green-700
  doc.text("EFECTIVO", baseX + 4, y + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`$ ${money(cierre.efectivo)}`, baseX + 4, y + 13);

  // MP - Azul
  const x2 = baseX + boxW;
  doc.setFillColor(219, 234, 254); // bg-blue-100
  doc.roundedRect(x2, y, boxW - 4, boxH, 3, 3, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(29, 78, 216); // text-blue-700
  doc.text("MERCADO PAGO", x2 + 4, y + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`$ ${money(cierre.mp)}`, x2 + 4, y + 13);

  // Transferencia - Púrpura
  const x3 = baseX + boxW * 2;
  doc.setFillColor(243, 232, 255); // bg-purple-100
  doc.roundedRect(x3, y, boxW - 4, boxH, 3, 3, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(126, 34, 206); // text-purple-700
  doc.text("TRANSFERENCIAS", x3 + 4, y + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`$ ${money(cierre.transferencia)}`, x3 + 4, y + 13);

  doc.setTextColor(0, 0, 0);
  y += boxH + 12;

  // ------- Movimientos (opcional breve) -------
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129); // text-green-500
  doc.text("RESUMEN DE MOVIMIENTOS", 14, y);
  doc.setTextColor(0, 0, 0);
  y += 6;

  // Construir una tabla simple de resumen de movimientos por tipo
  const movimientosResumen = [
    ["Concepto", "Valor"],
    ["Apertura total", `$ ${money(cierre.apertura)}`],
    ["Ingresos (total)", `$ ${money(cierre.ingresos)}`],
    ["Egresos (total)", `$ ${money(cierre.egresos)}`],
  ];

  autoTable(doc, {
    startY: y,
    head: [movimientosResumen[0]],
    body: movimientosResumen.slice(1),
    theme: "grid",
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontSize: 10,
      fontStyle: "bold",
    },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 14, right: 14 },
    alternateRowStyles: { fillColor: [249, 250, 251] },
  });

  y = doc.lastAutoTable.finalY + 12;

  // ------- Detalle de ventas (puede ser largo) -------
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(249, 115, 22); // text-orange-500
  doc.text("DETALLE DE VENTAS", 14, y);
  doc.setTextColor(0, 0, 0);
  y += 8;

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
        nuevaPaginaConHeader(doc, "Cierre de Caja - Informe Diario", isAnulado);
        y = 45;
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
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: {
          fillColor: [249, 115, 22],
          textColor: 255,
          fontSize: 9,
          fontStyle: "bold",
        },
        margin: { left: 16, right: 14 },
        alternateRowStyles: { fillColor: [254, 243, 199] }, // bg-orange-100
        columnStyles: {
          0: { cellWidth: 80 },
          1: { halign: "center", cellWidth: 18 },
          2: { halign: "right", cellWidth: 28 },
          3: { halign: "right", cellWidth: 28 },
        },
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
    nuevaPaginaConHeader(doc, "Cierre de Caja - Informe Diario", isAnulado);
    y = 45;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(147, 51, 234); // text-purple-600
  doc.text("TOTALES FINALES", 14, y);
  doc.setTextColor(0, 0, 0);
  y += 6;

  const totalesFinales = [
    ["Apertura (total)", `$ ${money(cierre.apertura)}`],
    ["Total vendido", `$ ${money(cierre.totalVendido)}`],
    ["Ganancia total", `$ ${money(cierre.gananciaTotal)}`],
    [
      "Ganancia neta",
      `$ ${money(
        cierre.gananciaNeta ?? cierre.gananciaTotal - cierre.egresos
      )}`,
    ],
    ["Ingresos (total)", `$ ${money(cierre.ingresos)}`],
    ["Egresos (total)", `$ ${money(cierre.egresos)}`],
    ["Saldo final (caja)", `$ ${money(cierre.total)}`],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Campo", "Valor"]],
    body: totalesFinales,
    theme: "grid",
    headStyles: {
      fillColor: [147, 51, 234],
      textColor: 255,
      fontSize: 10,
      fontStyle: "bold",
    },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 14, right: 14 },
    alternateRowStyles: { fillColor: [249, 250, 251] },
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
