import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  ShoppingCart,
  XCircle,
  Package,
  BarChart3,
  FileText,
} from "lucide-react";

export default function QuickActionsCard() {
  const navigate = useNavigate();

  const acciones = [
    {
      label: "Nueva Venta",
      icon: ShoppingCart,
      to: "/ventas",
      color: "from-blue-500 to-cyan-500",
      description: "Registrar venta",
    },
    {
      label: "Productos",
      icon: Package,
      to: "/productos",
      color: "from-purple-500 to-pink-500",
      description: "Gestionar inventario",
    },
    {
      label: "Caja",
      icon: Wallet,
      to: "/caja",
      color: "from-green-500 to-emerald-500",
      description: "Administrar caja",
    },
    {
      label: "Informes",
      icon: BarChart3,
      to: "/informes",
      color: "from-orange-500 to-red-500",
      description: "Ver estadísticas",
    },
    {
      label: "Cierres",
      icon: XCircle,
      to: "/cierres",
      color: "from-indigo-500 to-blue-500",
      description: "Historial cierres",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Accesos Rápidos
        </h2>
        <p className="text-sm text-gray-500">
          Accede rápidamente a las funciones principales
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {acciones.map((accion, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(accion.to)}
            className={`relative overflow-hidden p-4 rounded-xl bg-gradient-to-br ${accion.color} text-white shadow-md hover:shadow-xl transition-all group`}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                  <accion.icon className="w-6 h-6" />
                </div>
              </div>
              <p className="font-bold text-sm mb-1">{accion.label}</p>
              <p className="text-xs text-white/80">{accion.description}</p>
            </div>

            {/* Efecto de brillo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
