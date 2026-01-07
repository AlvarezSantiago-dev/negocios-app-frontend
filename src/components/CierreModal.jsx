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
import {
  XCircle,
  DollarSign,
  Smartphone,
  CreditCard,
  AlertCircle,
  TrendingDown,
} from "lucide-react";
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
      // Pre-llenar con los valores actuales del resumen
      setForm({
        efectivo: resumen?.efectivo || "",
        mp: resumen?.mp || "",
        transferencia: resumen?.transferencia || "",
      });
      setError("");
    }
  }, [open, resumen]);

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

  const inputs = [
    {
      key: "efectivo",
      placeholder: "Efectivo declarado",
      icon: DollarSign,
      color: "green",
      expected: resumen?.efectivo || 0,
    },
    {
      key: "mp",
      placeholder: "Mercado Pago declarado",
      icon: Smartphone,
      color: "blue",
      expected: resumen?.mp || 0,
    },
    {
      key: "transferencia",
      placeholder: "Transferencias declaradas",
      icon: CreditCard,
      color: "purple",
      expected: resumen?.transferencia || 0,
    },
  ];

  const totalEsperado = resumen?.total || 0;
  const diferencia = total - totalEsperado;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header con gradiente rojo */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <XCircle className="w-8 h-8" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Cierre de Caja
                </DialogTitle>
                <p className="text-red-50 text-sm mt-1">
                  Declará el dinero con el que terminás el día
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {!resumen?.abierta && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
              >
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">
                  La caja no está abierta. No se puede realizar el cierre.
                </p>
              </motion.div>
            )}

            {resumen?.cierreHoy && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
              >
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <p className="text-sm text-yellow-700">
                  Ya existe un cierre registrado para hoy.
                </p>
              </motion.div>
            )}

            {/* Resumen esperado */}
            <div className="rounded-xl border-2 border-blue-100 bg-blue-50 p-4">
              <div className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Total en Caja (Sistema)
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {inputs.map((input) => (
                  <div key={input.key} className="text-center">
                    <p className="text-gray-600 capitalize">{input.key}</p>
                    <p className={`font-bold text-${input.color}-600`}>
                      ${formatMoney(input.expected)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200 text-center">
                <p className="text-gray-600 text-sm">Total Sistema</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${formatMoney(totalEsperado)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700">
                Montos Declarados al Cierre
              </p>
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

            {/* Total declarado y diferencia */}
            <div
              className={`rounded-xl p-4 border-2 ${
                Math.abs(diferencia) < 1
                  ? "bg-green-50 border-green-200"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-700">
                  Total Declarado:
                </span>
                <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  ${formatMoney(total)}
                </span>
              </div>
              {Math.abs(diferencia) >= 1 && (
                <div className="pt-2 border-t border-orange-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Diferencia:</span>
                    <span
                      className={`font-bold ${
                        diferencia > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {diferencia > 0 ? "+" : ""}$
                      {formatMoney(Math.abs(diferencia))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </div>

          <DialogFooter className="p-6 bg-gray-50 flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <motion.div
              whileHover={{ scale: resumen?.abierta ? 1.02 : 1 }}
              whileTap={{ scale: resumen?.abierta ? 0.98 : 1 }}
              className="flex-1"
            >
              <Button
                onClick={save}
                disabled={!resumen?.abierta || resumen?.cierreHoy}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              >
                Cerrar Caja
              </Button>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
