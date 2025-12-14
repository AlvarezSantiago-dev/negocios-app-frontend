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

export function AperturaModal({ open, onClose, onConfirm }) {
  const [form, setForm] = useState({
    efectivo: "",
    mp: "",
    transferencia: "",
  });

  useEffect(() => {
    if (open) {
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>Apertura de Caja</DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              {["efectivo", "mp", "transferencia"].map((field) => (
                <div className="flex items-center gap-2" key={field}>
                  <MoneyInput
                    value={form[field]}
                    placeholder={`${field[0].toUpperCase()}${field.slice(
                      1
                    )} inicial`}
                    onChange={(v) => setForm({ ...form, [field]: v })}
                  />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {field === "efectivo"
                        ? "Dinero físico inicial en la caja."
                        : field === "mp"
                        ? "Saldo inicial recibido por Mercado Pago."
                        : "Saldo inicial recibido por transferencias bancarias."}
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}

              <div className="text-right font-semibold text-gray-700">
                Total inicial:{" "}
                <span className="text-blue-600">${formatMoney(total)}</span>
              </div>
            </div>

            <DialogFooter className="mt-4 flex justify-end gap-2">
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
