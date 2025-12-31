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

/**
 * Props esperadas:
 * - open: boolean
 * - onClose: fn
 * - onConfirm: fn({ efectivo, mp, transferencia })
 * - lastCierre?: { efectivo, mp, transferencia }  // SOLO referencia visual
 */
export function AperturaModal({ open, onClose, onConfirm, lastCierre }) {
  const [form, setForm] = useState({
    efectivo: "",
    mp: "",
    transferencia: "",
  });

  useEffect(() => {
    if (open) {
      // Siempre se declara de cero (no se arrastran montos)
      setForm({ efectivo: "", mp: "", transferencia: "" });
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
    await onConfirm({
      efectivo: Number(form.efectivo || 0),
      mp: Number(form.mp || 0),
      transferencia: Number(form.transferencia || 0),
    });
    onClose();
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-6">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <DialogHeader>
              <DialogTitle>Apertura de Caja</DialogTitle>
            </DialogHeader>

            {/* TEXTO CLAVE (UX + contabilidad) */}
            <p className="mt-2 text-sm text-gray-600">
              Declarás el dinero disponible al comenzar el día.
              <br />
              Aunque sea el mismo dinero que ayer, debe confirmarse nuevamente.
            </p>

            {/* REFERENCIA VISUAL DEL ÚLTIMO CIERRE */}
            {lastCierre && (
              <div className="mt-3 rounded-md border bg-gray-50 p-3 text-sm text-gray-700">
                <div className="font-medium mb-1">
                  Referencia del último cierre
                </div>
                <div className="flex justify-between">
                  <span>Efectivo</span>
                  <span>${formatMoney(lastCierre.efectivo || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mercado Pago</span>
                  <span>${formatMoney(lastCierre.mp || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transferencias</span>
                  <span>${formatMoney(lastCierre.transferencia || 0)}</span>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-4">
              {/* EFECTIVO */}
              <div className="flex items-center gap-2">
                <MoneyInput
                  value={form.efectivo}
                  placeholder="Efectivo inicial (0 si no hay)"
                  onChange={(v) => setForm({ ...form, efectivo: v })}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Dinero físico disponible al iniciar el día.
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* MP */}
              <div className="flex items-center gap-2">
                <MoneyInput
                  value={form.mp}
                  placeholder="Mercado Pago inicial (0 si no hay)"
                  onChange={(v) => setForm({ ...form, mp: v })}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Saldo disponible en Mercado Pago al inicio del día.
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* TRANSFERENCIA */}
              <div className="flex items-center gap-2">
                <MoneyInput
                  value={form.transferencia}
                  placeholder="Transferencias iniciales (0 si no hay)"
                  onChange={(v) => setForm({ ...form, transferencia: v })}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Saldo bancario disponible al comenzar el día.
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="text-right font-semibold text-gray-700">
                Total inicial:{" "}
                <span className="text-blue-600">${formatMoney(total)}</span>
              </div>
            </div>

            <DialogFooter className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={save}>Abrir Caja</Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
