import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StockCriticoCard({ productos = [] }) {
  const [hoverInfo, setHoverInfo] = useState(false);
  const navigate = useNavigate();

  const getRowColor = (stock, min) => {
    if (stock < min) return "bg-red-100 text-red-700";
    if (stock === min) return "bg-yellow-100 text-yellow-700";
    return "";
  };

  return (
    <motion.div
      className="rounded-2xl shadow-md bg-white p-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-500" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Stock crítico</h2>
        </div>

        {/* Botón Ir al Inventario */}
        <Button
          onClick={() => navigate("/productos")}
          className="flex items-center gap-2 bg-[#63b0cd] hover:bg-[#559bb4]"
        >
          <PackageSearch size={18} />
          Ir al inventario
        </Button>
      </div>

      {/* Tooltip Info */}
      <div
        className="flex items-center gap-1 mb-3 text-gray-600 cursor-pointer relative"
        onMouseEnter={() => setHoverInfo(true)}
        onMouseLeave={() => setHoverInfo(false)}
      >
        <Info size={16} />
        <span className="text-sm">¿Qué significan los colores?</span>

        <AnimatePresence>
          {hoverInfo && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute top-6 left-0 w-60 bg-white shadow-lg border p-3 rounded-lg text-sm z-20"
            >
              <p>
                <span className="font-semibold text-red-600">Rojo:</span> Stock
                crítico (por debajo del mínimo)
              </p>
              <p className="mt-1">
                <span className="font-semibold text-yellow-600">Amarillo:</span>{" "}
                Stock en advertencia (igual al mínimo)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabla */}
      {productos.length === 0 ? (
        <p className="text-gray-500">No hay productos en nivel crítico.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">Producto</th>
                <th className="py-2">Stock actual</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`border-b ${getRowColor(
                    p.stock,
                    p.stockMinimo
                  )} transition-colors`}
                >
                  <td className="py-3 font-medium text-gray-800">{p.nombre}</td>
                  <td className="py-3 font-semibold">{p.stock}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
