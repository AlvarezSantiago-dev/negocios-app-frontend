import React from "react";
import { motion } from "framer-motion";
import { Wallet, CreditCard, Smartphone, DollarSign } from "lucide-react";

export default function CajaResumenCard({ resumen }) {
  const metodos = [
    {
      label: "Efectivo",
      value: resumen?.efectivo || 0,
      icon: Wallet,
      color: "green",
    },
    {
      label: "MercadoPago",
      value: resumen?.mp || 0,
      icon: Smartphone,
      color: "blue",
    },
    {
      label: "Transferencia",
      value: resumen?.transferencia || 0,
      icon: CreditCard,
      color: "purple",
    },
  ];

  const total = resumen?.total || 0;

  const colorSchemes = {
    green: "from-green-500 to-emerald-500",
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Resumen de Caja</h2>
      </div>

      <div className="space-y-4">
        {metodos.map((metodo, idx) => (
          <motion.div
            key={metodo.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg bg-gradient-to-br ${
                  colorSchemes[metodo.color]
                }`}
              >
                <metodo.icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-700">{metodo.label}</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              ${metodo.value.toLocaleString()}
            </span>
          </motion.div>
        ))}

        {/* Total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-7 h-7" />
              <span className="text-lg font-semibold">Total en Caja</span>
            </div>
            <span className="text-3xl font-bold">
              ${total.toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
