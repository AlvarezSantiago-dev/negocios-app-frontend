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

function formatMoney(value) {
  if (!value) return "";
  return new Intl.NumberFormat("es-AR").format(value);
}

function parseMoney(value) {
  return Number(value.replace(/\./g, ""));
}

export default function MovimientoFormModal({
  open,
  onClose,
  onSave,
  initialData = null,
  cajaAbierta = false,
}) {
  const [form, setForm] = useState({
    tipo: "",
    monto: "",
    motivo: "",
    metodo: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ tipo: "", monto: "", motivo: "", metodo: "" });
  }, [initialData]);

  const handleMontoChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setForm({ ...form, monto: formatMoney(raw) });
  };

  const submit = () => {
    if (!cajaAbierta) return;
    onSave({
      ...form,
      monto: Number(form.monto || 0),
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
          {/* Tipo */}
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

          {/* Monto */}
          <div className="grid gap-1">
            <Label>Monto</Label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="$ 0"
              value={form.monto}
              onChange={handleMontoChange}
              disabled={!cajaAbierta}
            />
          </div>

          {/* Motivo */}
          <div className="grid gap-1">
            <Label>Motivo</Label>
            <Input
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              disabled={!cajaAbierta}
            />
          </div>

          {/* Método */}
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
