import React from "react";
import { motion } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react";

export default function MovimientosCard({ movimientos = [] }) {
  const ultimosMovimientos = movimientos.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Últimos Movimientos</h2>
      </div>

      {ultimosMovimientos.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">
            No hay movimientos registrados
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Los movimientos de caja aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ultimosMovimientos.map((mov, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center justify-between p-4 rounded-xl border-l-4 transition-all hover:shadow-md ${
                mov.tipo === "ingreso"
                  ? "bg-green-50 border-green-500 hover:bg-green-100"
                  : "bg-red-50 border-red-500 hover:bg-red-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    mov.tipo === "ingreso"
                      ? "bg-green-200 text-green-700"
                      : "bg-red-200 text-red-700"
                  }`}
                >
                  {mov.tipo === "ingreso" ? (
                    <ArrowUpCircle className="w-5 h-5" />
                  ) : (
                    <ArrowDownCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 capitalize">
                    {mov.tipo}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {mov.metodo}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    mov.tipo === "ingreso" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {mov.tipo === "ingreso" ? "+" : "-"} $
                  {mov.monto.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(mov.fecha).toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {movimientos.length > 8 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <p className="text-sm text-gray-500">
            Mostrando 8 de {movimientos.length} movimientos
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
