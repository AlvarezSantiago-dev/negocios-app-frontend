import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DollarSign, Smartphone, CreditCard, CheckCircle } from "lucide-react";
import MoneyInput from "@/components/MoneyInput";
import { formatMoney } from "../services/dashboardService";

/**
 * Props:
 * - open
 * - onClose
 * - onConfirm({ efectivo, mp, transferencia })
 * - lastCierre? -> SOLO referencia visual
 */
export function AperturaModal({ open, onClose, onConfirm, lastCierre }) {
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

  const inputs = [
    {
      key: "efectivo",
      placeholder: "Efectivo inicial",
      icon: DollarSign,
      color: "green",
    },
    {
      key: "mp",
      placeholder: "Mercado Pago inicial",
      icon: Smartphone,
      color: "blue",
    },
    {
      key: "transferencia",
      placeholder: "Transferencias iniciales",
      icon: CreditCard,
      color: "purple",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Apertura de Caja
                </DialogTitle>
                <p className="text-green-50 text-sm mt-1">
                  Declará el dinero disponible al comenzar el día
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {lastCierre && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border-2 border-blue-100 bg-blue-50 p-4"
              >
                <div className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-blue-600">💡</span>
                  Referencia del último cierre
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Efectivo</p>
                    <p className="font-bold text-green-600">
                      ${formatMoney(lastCierre.efectivo || 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Mercado Pago</p>
                    <p className="font-bold text-blue-600">
                      ${formatMoney(lastCierre.mp || 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Transferencias</p>
                    <p className="font-bold text-purple-600">
                      ${formatMoney(lastCierre.transferencia || 0)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              {inputs.map((input, index) => {
                const Icon = input.icon;
                return (
                  <motion.div
                    key={input.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`p-3 rounded-xl bg-${input.color}-100`}>
                      <Icon className={`w-6 h-6 text-${input.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <MoneyInput
                        value={form[input.key]}
                        placeholder={input.placeholder}
                        onChange={(v) => setForm({ ...form, [input.key]: v })}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-700">
                  Total inicial:
                </span>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${formatMoney(total)}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-gray-50 flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                onClick={save}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Abrir Caja
              </Button>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
