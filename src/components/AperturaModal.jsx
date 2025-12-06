import { useState } from "react";
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

export function AperturaModal({ open, onClose, onConfirm }) {
  const [form, setForm] = useState({ efectivo: "", mp: "", transferencia: "" });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = () => {
    onConfirm({
      efectivo: Number(form.efectivo || 0),
      mp: Number(form.mp || 0),
      transferencia: Number(form.transferencia || 0),
    });
    onClose();
  };

  const total =
    Number(form.efectivo || 0) +
    Number(form.mp || 0) +
    Number(form.transferencia || 0);

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
              <DialogTitle>Apertura de Caja</DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="efectivo"
                  placeholder="Efectivo inicial"
                  value={form.efectivo}
                  onChange={handle}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Dinero físico inicial en la caja.
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="mp"
                  placeholder="MercadoPago inicial"
                  value={form.mp}
                  onChange={handle}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Saldo inicial recibido por Mercado Pago.
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="transferencia"
                  placeholder="Transferencia inicial"
                  value={form.transferencia}
                  onChange={handle}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Saldo inicial recibido por transferencias bancarias.
                  </TooltipContent>
                </Tooltip>
              </div>

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
