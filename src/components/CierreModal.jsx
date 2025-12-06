import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { formatMoney } from "../services/dashboardService";

export function CierreModal({ open, onClose, onConfirm, resumen }) {
  const [form, setForm] = useState({ efectivo: "", mp: "", transferencia: "" });
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const total = useMemo(() => {
    return (
      Number(form.efectivo || 0) +
      Number(form.mp || 0) +
      Number(form.transferencia || 0)
    );
  }, [form]);

  const save = async () => {
    if (resumen?.cierreHoy) {
      setError("Ya existe un cierre para hoy.");
      return;
    }

    setError("");
    try {
      await onConfirm({
        efectivo: Number(form.efectivo || 0),
        mp: Number(form.mp || 0),
        transferencia: Number(form.transferencia || 0),
      });
      onClose();
    } catch {
      setError("Error al cerrar la caja. Intenta nuevamente.");
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>Cierre de Caja</DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="efectivo"
                  placeholder="Efectivo declarado"
                  value={form.efectivo}
                  onChange={handle}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>Dinero físico declarado.</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="mp"
                  placeholder="MercadoPago declarado"
                  value={form.mp}
                  onChange={handle}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Saldo declarado por Mercado Pago.
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="transferencia"
                  placeholder="Transferencia declarada"
                  value={form.transferencia}
                  onChange={handle}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Saldo declarado por transferencias bancarias.
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="text-right font-semibold text-gray-700">
                Total declarado:{" "}
                <span className="text-red-600">${formatMoney(total)}</span>
              </div>

              {error && (
                <div className="text-red-600 text-sm mt-1">{error}</div>
              )}
            </div>

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={save}
                disabled={!resumen?.abierta || resumen?.cierreHoy}
              >
                Cerrar Caja
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
