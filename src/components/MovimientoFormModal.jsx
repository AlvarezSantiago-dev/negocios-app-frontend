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

export default function MovimientoFormModal({
  open,
  onClose,
  onSave,
  initialData = null,
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

  const submit = () => {
    onSave(form);
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

        <div className="grid gap-4">
          {/* Tipo */}
          <div className="grid gap-1">
            <Label>Tipo</Label>
            <Select
              value={form.tipo}
              onValueChange={(v) => setForm({ ...form, tipo: v })}
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
              name="monto"
              type="number"
              value={form.monto}
              onChange={(e) => setForm({ ...form, monto: e.target.value })}
            />
          </div>

          {/* Motivo */}
          <div className="grid gap-1">
            <Label>Motivo</Label>
            <Input
              name="motivo"
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
            />
          </div>

          {/* Método */}
          <div className="grid gap-1">
            <Label>Método de pago</Label>
            <Select
              value={form.metodo}
              onValueChange={(v) => setForm({ ...form, metodo: v })}
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
          <Button onClick={submit}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
