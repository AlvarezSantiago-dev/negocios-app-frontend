import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generarPdfEtiquetas } from "@/utils/generarPdfEtiquetas";
import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";
import { formatMoney } from "@/services/dashboardService";
//var global jsBarcode
const CANTIDAD_ETIQUETAS = 10;

export default function PrintBarcodeModal({ open, onClose, product }) {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (!open || !product) return;

    const timeout = setTimeout(() => {
      const svgs = sheetRef.current?.querySelectorAll("svg");
      if (!svgs) return;

      svgs.forEach((svg) => {
        svg.innerHTML = "";
        JsBarcode(svg, product.codigoBarras, {
          format: "CODE128",
          width: 1.5,
          height: 40,
          margin: 0,
          displayValue: false,
        });
      });
    }, 50); // ⬅️ CLAVE

    return () => clearTimeout(timeout);
  }, [open, product]);

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Imprimir etiquetas</DialogTitle>
        </DialogHeader>

        {/* hoja A4 */}
        <div className="print-preview">
          <div ref={sheetRef} className="print-sheet">
            {Array.from({ length: CANTIDAD_ETIQUETAS }).map((_, i) => (
              <div key={i} className="label">
                <div className="name">{product.nombre}</div>
                <svg />
                <div className="price">${formatMoney(product.precioVenta)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={() => generarPdfEtiquetas(product)}>
            Descargar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
