import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import JsBarcode from "jsbarcode";
import { generarPdfEtiquetas } from "@/utils/generarPdfEtiquetas";
import { useEffect, useRef, useState } from "react";
//var global jsBarcode
const CANTIDAD_ETIQUETAS = 10;

export default function PrintBarcodeModal({ open, onClose, product }) {
  const [cantidad, setCantidad] = useState(10);
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

        {/* selector */}
        <div className="flex items-center gap-3">
          <span>Cantidad:</span>
          <Select
            value={String(cantidad)}
            onValueChange={(v) => setCantidad(Number(v))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 etiquetas</SelectItem>
              <SelectItem value="20">20 etiquetas</SelectItem>
              <SelectItem value="30">30 etiquetas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* hoja A4 */}
        <div className="print-preview">
          <div ref={sheetRef} className="print-sheet">
            {Array.from({ length: CANTIDAD_ETIQUETAS }).map((_, i) => (
              <div key={i} className="label">
                <div className="name">{product.nombre}</div>
                <svg />
                <div className="price">${product.precioVenta}</div>
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
