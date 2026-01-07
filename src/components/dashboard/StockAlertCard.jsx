import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Package, Info, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StockAlertCard({ productos = [] }) {
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();

  const productosCriticos = productos.filter((p) => p.stock < p.stockMinimo);
  const productosAdvertencia = productos.filter(
    (p) => p.stock === p.stockMinimo
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Stock Crítico</h2>
            <p className="text-sm text-gray-500">
              {productos.length} productos requieren atención
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/productos")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
        >
          <Package className="w-4 h-4" />
          Ver Inventario
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Info tooltip */}
      <div className="relative mb-4">
        <button
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Info className="w-4 h-4" />
          <span>¿Qué significan los colores?</span>
        </button>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-72 bg-gray-900 text-white p-4 rounded-xl shadow-2xl z-10"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm">
                    <strong>Crítico:</strong> Stock por debajo del mínimo
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">
                    <strong>Advertencia:</strong> Stock igual al mínimo
                  </span>
                </div>
              </div>
              <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-900 transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Productos */}
      {productos.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <Package className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-900 font-semibold mb-1">¡Todo en orden! 🎉</p>
          <p className="text-sm text-gray-500">
            No hay productos con stock crítico
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          {productos.map((producto, idx) => {
            const esCritico = producto.stock < producto.stockMinimo;
            const porcentaje = (producto.stock / producto.stockMinimo) * 100;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-xl border-l-4 transition-all ${
                  esCritico
                    ? "bg-red-50 border-red-500 hover:bg-red-100"
                    : "bg-yellow-50 border-yellow-500 hover:bg-yellow-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {producto.nombre}
                    </p>
                    <p className="text-sm text-gray-600">
                      Mínimo: {producto.stockMinimo} unidades
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-2xl font-bold ${
                        esCritico ? "text-red-600" : "text-yellow-600"
                      }`}
                    >
                      {producto.stock}
                    </p>
                    <p className="text-xs text-gray-500">en stock</p>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(porcentaje, 100)}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className={`h-full rounded-full ${
                      esCritico
                        ? "bg-gradient-to-r from-red-600 to-red-500"
                        : "bg-gradient-to-r from-yellow-600 to-yellow-500"
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
