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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import MoneyInput from "@/components/MoneyInput";

export default function MovimientoFormModal({
  open,
  onClose,
  onSave,
  initialData = null,
  cajaAbierta = false,
}) {
  const [form, setForm] = useState({
    tipo: "",
    monto: 0, // 👈 NUMBER REAL
    motivo: "",
    metodo: "",
  });

  /* ---------- sync edición ---------- */
  useEffect(() => {
    if (initialData) {
      setForm({
        tipo: initialData.tipo || "",
        monto: Number(initialData.monto || 0),
        motivo: initialData.motivo || "",
        metodo: initialData.metodo || "",
      });
    } else {
      setForm({
        tipo: "",
        monto: 0,
        motivo: "",
        metodo: "",
      });
    }
  }, [initialData]);

  /* ---------- submit ---------- */
  const submit = () => {
    if (!cajaAbierta) return;

    onSave({
      ...form,
      monto: Number(form.monto), // ✅ YA ES NÚMERO
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Movimiento" : "Nuevo Movimiento"}
          </DialogTitle>
        </DialogHeader>

        {!cajaAbierta && (
          <div className="text-sm text-red-600">
            La caja está cerrada. No se pueden registrar movimientos.
          </div>
        )}

        <div className="grid gap-4">
          {/* ---------- TIPO ---------- */}
          <div className="grid gap-1">
            <Label>Tipo</Label>
            <Select
              value={form.tipo}
              onValueChange={(v) => setForm({ ...form, tipo: v })}
              disabled={!cajaAbierta}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ingreso">Ingreso</SelectItem>
                <SelectItem value="egreso">Egreso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ---------- MONTO (CORREGIDO) ---------- */}
          <div className="grid gap-1">
            <Label>Monto</Label>
            <MoneyInput
              value={form.monto}
              onChange={(value) => setForm({ ...form, monto: value })}
              disabled={!cajaAbierta}
            />
          </div>

          {/* ---------- MOTIVO ---------- */}
          <div className="grid gap-1">
            <Label>Motivo</Label>
            <Input
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              disabled={!cajaAbierta}
            />
          </div>

          {/* ---------- MÉTODO ---------- */}
          <div className="grid gap-1">
            <Label>Método de pago</Label>
            <Select
              value={form.metodo}
              onValueChange={(v) => setForm({ ...form, metodo: v })}
              disabled={!cajaAbierta}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="mp">Mercado Pago</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={!cajaAbierta}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
