// generarPDFGuia.js
const { jsPDF } = require("jspdf");
require("jspdf-autotable"); // importante: esto habilita doc.autoTable

function formatFecha(f) {
  return new Date(f).toLocaleDateString("es-AR");
}
function formatHora(h) {
  return new Date(h).toLocaleTimeString("es-AR");
}

function encabezado(doc, titulo) {
  doc.setFillColor(53, 121, 166);
  doc.rect(0, 0, 210, 28, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(titulo, 14, 20);
  doc.setFontSize(10);
  doc.text(
    `Generado el ${formatFecha(Date.now())} a las ${formatHora(Date.now())}`,
    196,
    20,
    { align: "right" }
  );
  doc.setTextColor(0, 0, 0);
}

function seccion(doc, titulo, y) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(53, 121, 166);
  doc.text(titulo, 14, y);
  doc.setDrawColor(53, 121, 166);
  doc.line(14, y + 2, 196, y + 2);
  doc.setTextColor(0, 0, 0);
}

function generarPDFGuia() {
  const doc = new jsPDF();
  encabezado(doc, "📘 Guía de Usuario - Sistema de Gestión");

  let y = 35;

  const secciones = [
    {
      titulo: "🌟 1. Dashboard Principal",
      contenido: "Resumen general del día y accesos rápidos.",
    },
    {
      titulo: "🔹 1.1 Bienvenida",
      contenido:
        "Saludo personalizado y fecha actual.\nBotón Refrescar: actualiza todos los datos del día.",
    },
    {
      titulo: "🔹 1.2 KPIs del Día",
      contenido:
        "Vendido hoy, Ganancia hoy, Ventas hoy, Stock crítico.\nLos KPIs se actualizan automáticamente.",
    },
    {
      titulo: "🔹 1.3 Alerta de Stock Bajo",
      contenido:
        "Si hay productos con stock ≤ mínimo, alerta visual y notificación.",
    },
    {
      titulo: "💼 2. Página de Caja",
      contenido: "Gestión de apertura, cierre y movimientos del día.",
    },
    {
      titulo: "🔹 2.1 KPIs de Caja",
      contenido: "Total Caja, Efectivo, Mercado Pago, Transferencias.",
    },
    {
      titulo: "🔹 2.2 Botones Principales",
      contenido:
        "Abrir Caja, Cerrar Caja, Nuevo Movimiento, Refrescar resumen.",
    },
    {
      titulo: "🔹 2.3 Movimientos de Caja",
      contenido: "Registro de ingresos y egresos manuales.",
    },
    {
      titulo: "🔹 2.4 Cierre del Día",
      contenido: "Resumen detallado de ventas y movimientos.",
    },
    {
      titulo: "🟢 3. Apertura de Caja",
      contenido: "Ingresar montos iniciales y abrir caja.",
    },
    {
      titulo: "🔴 4. Cierre de Caja",
      contenido: "Declarar montos finales y cerrar caja.",
    },
    {
      titulo: "✍ 5. Formulario de Movimientos",
      contenido: "Crear o editar ingresos/egresos manuales.",
    },
    {
      titulo: "📊 6. Flujo de Trabajo Típico",
      contenido:
        "1️⃣ Abrir caja → 2️⃣ Registrar ventas → 3️⃣ Registrar movimientos → 4️⃣ Consultar KPIs → 5️⃣ Cerrar caja.",
    },
    {
      titulo: "📦 7. Otras Secciones",
      contenido:
        "Products.jsx, Ventas.jsx, Login.jsx: gestión de productos, ventas y usuarios.",
    },
  ];

  secciones.forEach((sec) => {
    seccion(doc, sec.titulo, y);
    y += 8;

    // ✅ ahora sí funciona en Node
    doc.autoTable({
      startY: y + 2,
      body: [[sec.contenido]],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2, halign: "left" },
      tableWidth: 180,
    });

    y = doc.lastAutoTable.finalY + 10;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.setFontSize(10);
  doc.text("Sistema de Gestión — Guía Automática", 105, 287, {
    align: "center",
  });

  doc.save("Guia_Usuario_Sistema.pdf");
  console.log("PDF generado: Guia_Usuario_Sistema.pdf");
}

generarPDFGuia();
