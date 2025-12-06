// ProductosTable.js
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Info } from "lucide-react";
import { formatMoney } from "@/services/dashboardService";
import { motion } from "framer-motion";

export default function ProductosTable({
  products,
  loading,
  onDelete,
  onEdit,
}) {
  if (loading) return <p className="p-4 text-gray-500">Cargando...</p>;
  if (!products.length)
    return <p className="p-4 text-gray-500">No hay productos aún.</p>;

  const renderHeader = (label, tooltip) => (
    <th className="p-3 relative group">
      <div className="flex items-center gap-1">
        {label} <Info size={14} className="text-gray-400" />
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-48 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded px-2 py-1 text-center z-10">
        {tooltip}
      </div>
    </th>
  );

  return (
    <table className="w-full text-left rounded-lg">
      <thead>
        <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
          {renderHeader("Nombre", "Nombre del producto")}
          {renderHeader(
            "Compra",
            "Precio de compra por unidad (calculado automáticamente si es pack)"
          )}
          {renderHeader(
            "Venta",
            "Precio de venta por unidad que se cobra al cliente"
          )}
          {renderHeader(
            "Stock",
            "Cantidad disponible. Rojo indica stock crítico (igual o menor que mínimo)"
          )}
          <th className="p-3 w-32">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {products.map((p, i) => (
          <motion.tr
            key={p._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="border-t hover:bg-gray-50 transition-colors"
          >
            <td className="p-3 font-medium text-gray-700">{p.nombre}</td>
            <td className="p-3 text-gray-600">
              ${formatMoney(p.precioCompra)}
            </td>
            <td className="p-3 text-gray-600">${formatMoney(p.precioVenta)}</td>

            <td
              className={`p-3 font-semibold ${
                p.stock <= p.stockMinimo
                  ? "text-red-600"
                  : p.stock <= p.stockMinimo * 2
                  ? "text-orange-500"
                  : "text-gray-700"
              }`}
            >
              {p.stock}
            </td>

            <td className="p-3 flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => onEdit(p)}>
                <Pencil size={18} />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => onDelete(p._id)}
              >
                <Trash2 size={18} />
              </Button>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}
