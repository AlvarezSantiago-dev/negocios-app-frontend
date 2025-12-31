import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import MoneyInput from "@/components/MoneyInput";
import { formatMoney } from "../services/dashboardService";

export function CierreModal({ open, onClose, onConfirm, resumen }) {
  const [form, setForm] = useState({
    efectivo: "",
    mp: "",
    transferencia: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({ efectivo: "", mp: "", transferencia: "" });
      setError("");
    }
  }, [open]);

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
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>Cierre de Caja</DialogTitle>
            </DialogHeader>

            <p className="mt-2 text-sm text-gray-600">
              Declarás el dinero con el que terminás el día.
              <br />
              Este monto quedará registrado como referencia histórica.
            </p>

            <div className="mt-4 space-y-4">
              {[
                {
                  key: "efectivo",
                  tooltip: "Dinero físico declarado al cierre.",
                },
                {
                  key: "mp",
                  tooltip: "Saldo declarado de Mercado Pago.",
                },
                {
                  key: "transferencia",
                  tooltip: "Saldo bancario declarado al finalizar el día.",
                },
              ].map((f) => (
                <div key={f.key} className="flex items-center gap-2">
                  <MoneyInput
                    value={form[f.key]}
                    placeholder={`${f.key} declarado`}
                    onChange={(v) => setForm({ ...form, [f.key]: v })}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>{f.tooltip}</TooltipContent>
                  </Tooltip>
                </div>
              ))}

              <div className="text-right font-semibold text-gray-700">
                Total declarado:{" "}
                <span className="text-red-600">${formatMoney(total)}</span>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}
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
