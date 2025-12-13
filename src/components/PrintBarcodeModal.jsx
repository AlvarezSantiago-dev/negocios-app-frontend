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
import { useEffect, useRef, useState } from "react";

export default function PrintBarcodeModal({ open, onClose, product }) {
  const [cantidad, setCantidad] = useState(10);
  const sheetRef = useRef(null);

  useEffect(() => {
    if (!product || !sheetRef.current) return;

    const svgs = sheetRef.current.querySelectorAll("svg");
    svgs.forEach((svg) => {
      JsBarcode(svg, product.codigoBarras, {
        format: "EAN13",
        width: 2,
        height: 60,
        displayValue: false,
      });
    });
  }, [product, cantidad]);

  const imprimir = () => {
    window.print();
  };

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
        <div ref={sheetRef} className="print-sheet">
          {Array.from({ length: cantidad }).map((_, i) => (
            <div key={i} className="label">
              <div className="name">{product.nombre}</div>
              <svg />
              <div className="price">${product.precioVenta}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={imprimir}>Imprimir</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
