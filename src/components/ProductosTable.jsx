// ProductosTable.jsx - Modernizado
import { Pencil, Trash2, Package, TrendingUp, AlertCircle } from "lucide-react";
import { formatMoney } from "@/services/dashboardService";
import { motion } from "framer-motion";

export default function ProductosTable({
  products,
  loading,
  onDelete,
  onEdit,
  nounSingular = "producto",
  nounPlural = "productos",
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
          <p className="text-gray-500">Cargando {nounPlural}...</p>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 bg-gray-100 rounded-full mb-4">
          <Package className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No hay {nounPlural}
        </h3>
        <p className="text-gray-500 max-w-sm">
          Comienza agregando tu primer {nounSingular} al inventario
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
              {nounSingular}
            </th>
            <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
              Compra
            </th>
            <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
              Venta
            </th>
            <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
              Stock
            </th>
            <th className="p-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wide">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, i) => {
            const esPeso = p.tipo === "peso";
            const unidadStock = esPeso ? "kg" : "u";
            const hasVariants = Array.isArray(p.variants) && p.variants.length;

            const toNumOrUndefined = (x) => {
              if (x === undefined || x === null || x === "") return undefined;
              const n = Number(x);
              return Number.isFinite(n) ? n : undefined;
            };

            const getEffectivePrice = (variant, field, baseValue) => {
              const override = toNumOrUndefined(variant?.[field]);
              return override === undefined ? Number(baseValue || 0) : override;
            };

            const compraPrices = hasVariants
              ? p.variants.map((v) =>
                  getEffectivePrice(v, "precioCompra", p.precioCompra)
                )
              : [Number(p.precioCompra || 0)];

            const variantsForVentaPrice = hasVariants
              ? (() => {
                  const conStock = p.variants.filter(
                    (v) => Number(v?.stock || 0) > 0
                  );
                  return conStock.length ? conStock : p.variants;
                })()
              : [];

            const ventaPrices = hasVariants
              ? variantsForVentaPrice.map((v) =>
                  getEffectivePrice(v, "precioVenta", p.precioVenta)
                )
              : [Number(p.precioVenta || 0)];

            const compraMin = Math.min(...compraPrices);
            const compraMax = Math.max(...compraPrices);
            const ventaMin = Math.min(...ventaPrices);
            const ventaMax = Math.max(...ventaPrices);

            const compraVariante = hasVariants && compraMin !== compraMax;
            const ventaVariante = hasVariants && ventaMin !== ventaMax;

            const stockVisible = hasVariants
              ? p.variants.reduce((acc, v) => acc + Number(v?.stock || 0), 0)
              : Number(p.stock || 0);

            const stockMinimoVisible = hasVariants
              ? p.variants.reduce(
                  (acc, v) => acc + Number(v?.stockMinimo || 0),
                  0
                )
              : Number(p.stockMinimo || 0);

            const stockBajo = stockVisible <= stockMinimoVisible;
            const stockMedio =
              stockVisible <= stockMinimoVisible * 2 && !stockBajo;

            return (
              <motion.tr
                key={p._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
              >
                {/* PRODUCTO */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{p.nombre}</p>
                      <p className="text-xs text-gray-500">
                        {p.codigoBarras || "Sin código"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* PRECIO COMPRA */}
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      ${formatMoney(compraMin)}
                      {compraVariante ? ` - $${formatMoney(compraMax)}` : ""}
                    </span>
                    <span className="text-xs text-gray-500">
                      {compraVariante
                        ? "Costo (según variante)"
                        : "Costo unitario"}
                    </span>
                  </div>
                </td>

                {/* PRECIO VENTA + PACKS */}
                <td className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        ${formatMoney(ventaMin)}
                        {ventaVariante ? ` - $${formatMoney(ventaMax)}` : ""}
                      </span>
                      <span className="text-xs text-gray-500">
                        / {esPeso ? "kg" : "u"}
                      </span>
                    </div>

                    {Array.isArray(p.packs) && p.packs.length > 0 && (
                      <div className="space-y-1">
                        {p.packs.map((pack, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs"
                          >
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                              Pack x{pack.unidades}
                            </span>
                            <span className="font-semibold text-gray-700">
                              ${formatMoney(pack.precioVentaPack)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                {/* STOCK */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {stockBajo && (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <span
                        className={`font-bold text-lg ${
                          stockBajo
                            ? "text-red-600"
                            : stockMedio
                            ? "text-orange-500"
                            : "text-green-600"
                        }`}
                      >
                        {esPeso
                          ? Number(stockVisible).toFixed(3)
                          : Number(stockVisible).toFixed(0)}{" "}
                        {unidadStock}
                      </span>
                      {stockBajo && (
                        <p className="text-xs text-red-600 font-medium">
                          ¡Stock crítico!
                        </p>
                      )}
                      {stockMedio && (
                        <p className="text-xs text-orange-500">Stock bajo</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* ACCIONES */}
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEdit(p)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                      title="Editar producto"
                    >
                      <Pencil className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDelete(p._id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
