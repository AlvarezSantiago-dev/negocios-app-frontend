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
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Smartphone,
  CreditCard,
  AlertCircle,
} from "lucide-react";
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
    monto: 0,
    motivo: "",
    metodo: "",
  });

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

  const submit = () => {
    if (!cajaAbierta) return;

    onSave({
      ...form,
      monto: Number(form.monto),
    });

    onClose();
  };

  const headerColor =
    form.tipo === "ingreso"
      ? "from-green-500 to-emerald-600"
      : form.tipo === "egreso"
      ? "from-red-500 to-pink-600"
      : "from-gray-500 to-gray-600";

  const HeaderIcon =
    form.tipo === "ingreso"
      ? TrendingUp
      : form.tipo === "egreso"
      ? TrendingDown
      : DollarSign;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header con gradiente dinámico */}
          <div className={`bg-gradient-to-r ${headerColor} p-6 text-white`}>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <HeaderIcon className="w-8 h-8" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  {initialData ? "Editar Movimiento" : "Nuevo Movimiento"}
                </DialogTitle>
                <p className="text-white/80 text-sm mt-1">
                  {cajaAbierta
                    ? "Registra ingresos o egresos de caja"
                    : "⚠️ La caja está cerrada"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {!cajaAbierta && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
              >
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">
                  La caja está cerrada. No se pueden registrar movimientos.
                </p>
              </motion.div>
            )}

            <div className="grid gap-5">
              {/* TIPO */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Tipo de Movimiento
                </Label>
                <Select
                  value={form.tipo}
                  onValueChange={(v) => setForm({ ...form, tipo: v })}
                  disabled={!cajaAbierta}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingreso">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span>Ingreso</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="egreso">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span>Egreso</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* MONTO */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Monto
                </Label>
                <MoneyInput
                  value={form.monto}
                  onChange={(value) => setForm({ ...form, monto: value })}
                  disabled={!cajaAbierta}
                />
              </div>

              {/* MOTIVO */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Motivo
                </Label>
                <Input
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                  disabled={!cajaAbierta}
                  placeholder="Ej: Pago de alquiler, Venta extra, etc."
                  className="h-12"
                />
              </div>

              {/* MÉTODO */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Método de Pago
                </Label>
                <Select
                  value={form.metodo}
                  onValueChange={(v) => setForm({ ...form, metodo: v })}
                  disabled={!cajaAbierta}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span>Efectivo</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="mp">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-blue-600" />
                        <span>Mercado Pago</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="transferencia">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                        <span>Transferencia</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-gray-50 flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <motion.div
              whileHover={{ scale: cajaAbierta ? 1.02 : 1 }}
              whileTap={{ scale: cajaAbierta ? 0.98 : 1 }}
              className="flex-1"
            >
              <Button
                onClick={submit}
                disabled={!cajaAbierta}
                className={`w-full ${
                  form.tipo === "ingreso"
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    : form.tipo === "egreso"
                    ? "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    : ""
                }`}
              >
                Guardar Movimiento
              </Button>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
