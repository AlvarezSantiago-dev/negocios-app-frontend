// src/components/VentaFormModal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useState } from "react";
import { ahoraArgISO } from "@/utils/fecha";

/**
 * Props:
 * - open
 * - onClose
 * - onSave(data) -> data: { items: [{ productoId, cantidad }], metodoPago, fecha }
 * - initialData -> venta object (as returned by backend), populated productoId
 *
 * Nota: este modal edita solo items existentes (no agrega nuevos productos).
 */
export default function VentaFormModal({ open, onClose, onSave, initialData }) {
  const [items, setItems] = useState([]); // { productoId: {...}, cantidad, originalCantidad, precioVenta, subtotal }
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [fecha, setFecha] = useState("");
  const [errors, setErrors] = useState({}); // keyed by productoId
  const [saving, setSaving] = useState(false);

  // Inicializar el formulario cuando cambie initialData
  useEffect(() => {
    if (initialData && initialData.items) {
      const mapped = initialData.items.map((it) => {
        const prod = it.productoId || {};
        return {
          productoId: {
            _id: prod._id ?? prod, // soporta id o objeto
            nombre: prod.nombre,
            precioVenta: it.precioVenta ?? prod.precioVenta,
            stock: prod.stock ?? 0,
          },
          cantidad: Number(it.cantidad ?? 1),
          originalCantidad: Number(it.cantidad ?? 1),
          precioVenta: it.precioVenta ?? prod.precioVenta ?? 0,
          subtotal: Number(
            it.subtotal ??
              (it.precioVenta ?? prod.precioVenta ?? 0) * (it.cantidad ?? 1)
          ),
        };
      });
      setItems(mapped);
      setMetodoPago(initialData.metodoPago ?? "efectivo");
      setFecha(
        initialData.fecha
          ? new Date(initialData.fecha).toISOString().slice(0, 16)
          : ahoraArgISO()
      );
      setErrors({});
    } else {
      setItems([]);
      setMetodoPago("efectivo");
      setFecha(ahoraArgISO());
      setErrors({});
    }
  }, [initialData, open]);

  // total live
  const total = useMemo(
    () =>
      items.reduce(
        (acc, it) =>
          acc + Number(it.precioVenta || 0) * Number(it.cantidad || 0),
        0
      ),
    [items]
  );

  // helper: update cantidad with validation (max = stock + originalCantidad)
  // helper: update cantidad with validation (max = stock + originalCantidad)
  const updateCantidad = (idx, value) => {
    const parsed = Number(value);
    if (isNaN(parsed) || parsed < 0) return;

    const copy = [...items];
    const it = copy[idx];
    if (!it) return;

    // compatibilidad: originalCantidad u originalQuantity
    const original = Number(it.originalCantidad ?? it.originalQuantity ?? 0);

    // stock actual del producto
    const stockActual = Number(it.productoId?.stock ?? 0);

    // máximo permitido = stock disponible + lo que originalmente tenía esta venta
    const maxAllowed = stockActual + original;

    // bloquea excedente
    if (parsed > maxAllowed) {
      it.cantidad = maxAllowed;
    } else {
      it.cantidad = parsed;
    }

    // recalcular subtotal
    const precioUnitario = Number(
      it.precioVenta ?? it.productoId?.precioVenta ?? 0
    );
    it.subtotal = it.cantidad * precioUnitario;

    setItems(copy);
  };

  const submit = async () => {
    // frontend validation: no item has error
    const hasError = Object.values(errors).some((e) => e);
    if (hasError) return;

    // build payload
    const payload = {
      items: items.map((it) => ({
        productoId: it.productoId._id,
        cantidad: Number(it.cantidad),
      })),
      metodoPago,
      fecha: fecha ? new Date(fecha).toISOString() : undefined,
    };

    try {
      setSaving(true);
      await onSave(payload);
      // onSave should close modal from parent, but we also clear
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Venta" : "Nueva Venta"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-2">
          {/* items list */}
          <div className="grid gap-3">
            {items.map((it, idx) => (
              <div
                key={it.productoId._id}
                className="grid grid-cols-3 gap-3 items-center"
              >
                <div className="col-span-1">
                  <div className="text-sm font-medium">
                    {it.productoId.nombre}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Precio: ${it.precioVenta}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Stock actual: {it.productoId.stock}
                  </div>
                </div>

                <div className="col-span-1">
                  <Label className="text-xs">Cantidad</Label>
                  <Input
                    type="number"
                    min={1}
                    value={it.cantidad}
                    onChange={(e) => updateCantidad(idx, e.target.value)}
                  />
                  {errors[it.productoId._id] && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors[it.productoId._id]}
                    </div>
                  )}
                </div>

                <div className="col-span-1 text-right">
                  <div className="text-sm font-semibold">${it.subtotal}</div>
                  <div className="text-xs text-muted-foreground">
                    Original: {it.originalCantidad}
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="p-4 text-sm text-muted-foreground">
                No hay items para editar en esta venta.
              </div>
            )}
          </div>

          {/* método y fecha */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Método de pago</Label>
              <select
                value={metodoPago}
                className="w-full border p-2 rounded"
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="efectivo">Efectivo</option>
                <option value="mp">Mercado Pago</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>

            <div>
              <Label>Fecha</Label>
              <Input
                type="datetime-local"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
          </div>

          {/* total */}
          <div className="flex justify-between items-center mt-2 p-2 bg-white/60 rounded">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-xl font-bold">${total}</div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={submit}
            disabled={saving || Object.values(errors).some(Boolean)}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
