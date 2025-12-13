import jsPDF from "jspdf";
import barcodeToImage from "./barcodeToImage";

export function generarPdfEtiquetas(product) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const barcodeImg = barcodeToImage(product.codigoBarras);

  const startX = 10;
  const startY = 10;
  const labelW = 60;
  const labelH = 30;
  const gapX = 5;
  const gapY = 5;

  let x = startX;
  let y = startY;

  for (let i = 0; i < 10; i++) {
    doc.rect(x, y, labelW, labelH);

    doc.setFontSize(8);
    doc.text(product.nombre, x + labelW / 2, y + 5, {
      align: "center",
    });

    doc.addImage(barcodeImg, "PNG", x + 5, y + 7, labelW - 10, 15);

    doc.setFontSize(9);
    doc.text(`$${product.precioVenta}`, x + labelW / 2, y + labelH - 4, {
      align: "center",
    });

    x += labelW + gapX;
    if (x + labelW > 210) {
      x = startX;
      y += labelH + gapY;
    }
  }

  doc.save(`etiquetas-${product.nombre}.pdf`);
}
