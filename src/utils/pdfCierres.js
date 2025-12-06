import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helpers
const formatFecha = (f) => new Date(f).toLocaleDateString("es-AR");
const formatHora = (h) => new Date(h).toLocaleTimeString("es-AR");
const money = (n) => (n ?? 0).toLocaleString("es-AR");

// --------------------------------------------
// 🔵 Encabezado corporativo
// --------------------------------------------
function encabezado(doc, titulo) {
  doc.setFillColor(53, 121, 166);
  doc.rect(0, 0, 210, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(titulo, 14, 18);

  doc.setFontSize(10);
  doc.text(
    `Generado el ${formatFecha(Date.now())} a las ${formatHora(Date.now())}`,
    196,
    18,
    { align: "right" }
  );

  doc.setTextColor(0, 0, 0);
}

// --------------------------------------------
// 🔵 Título de sección
// --------------------------------------------
function seccion(doc, titulo, y) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(53, 121, 166);
  doc.text(titulo, 14, y);

  doc.setDrawColor(53, 121, 166);
  doc.line(14, y + 2, 196, y + 2);

  doc.setTextColor(0, 0, 0);
}

// --------------------------------------------
// 📄 PDF INDIVIDUAL MUY PROFESIONAL
// --------------------------------------------
export function generarPDFCierreIndividual(cierre) {
  const doc = new jsPDF();

  encabezado(doc, "Cierre de Caja");

  // ------- Resumen general -------
  seccion(doc, "Resumen del Cierre", 40);

  const info = [
    ["Fecha", formatFecha(cierre.fecha)],
    ["Usuario", cierre.usuario || "desconocido"],
    ["Total", "$ " + money(cierre.total)],
    ["Ingresos", "$ " + money(cierre.ingresos)],
    ["Egresos", "$ " + money(cierre.egresos)],
    ["Efectivo", "$ " + money(cierre.efectivo)],
    ["Mercado Pago", "$ " + money(cierre.mp)],
    ["Transferencias", "$ " + money(cierre.transferencia)],
    ["Ventas Registradas", cierre.cantidadVentas],
  ];

  autoTable(doc, {
    startY: 48,
    head: [["Campo", "Valor"]],
    body: info,
    theme: "grid",
    styles: { fontSize: 11, halign: "left" },
    headStyles: { fillColor: [53, 121, 166], textColor: 255 },
  });

  let y = doc.lastAutoTable.finalY + 12;

  // ------- Detalle de ventas -------
  seccion(doc, "Detalle de Ventas", y);

  if (!cierre.ventas.length) {
    doc.text("No hubo ventas en este cierre.", 14, y + 15);
  } else {
    let posY = y + 15;

    cierre.ventas.forEach((v, index) => {
      // Encabezado de venta
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(
        `Venta ${index + 1} — ${formatHora(v.hora)} — $${money(v.total)}`,
        14,
        posY
      );
      posY += 6;

      // Método
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Método: ${v.metodo.toUpperCase()}`, 14, posY);
      posY += 6;

      // Productos
      doc.setFontSize(10);
      v.productos.forEach((p) => {
        // Determinar unidad: kg si cantidad <1, unidad si >=1
        const unidad = p.cantidad < 1 ? "kg" : "unidad";
        const cantidadStr = p.cantidad < 1 ? p.cantidad.toFixed(2) : p.cantidad;
        const precioUnitario = money(p.precio);
        const totalProducto = money(p.precio * p.cantidad);

        const linea = `• ${p.nombre} — ${cantidadStr} ${unidad} — $${precioUnitario}/${unidad} — Total: $${totalProducto}`;
        doc.text(linea, 18, posY);
        posY += 5;

        if (posY > 270) {
          doc.addPage();
          posY = 20;
        }
      });

      posY += 5;

      // Separador entre ventas
      doc.setDrawColor(200, 200, 200);
      doc.line(14, posY, 196, posY);
      posY += 8;
    });
  }

  // Pie
  doc.setFontSize(10);
  doc.text("Sistema de Caja — Reporte Automático", 105, 287, {
    align: "center",
  });

  doc.save(`cierre-${formatFecha(cierre.fecha)}.pdf`);
}
