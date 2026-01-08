import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  User,
  ShoppingCart,
  FileText,
  Loader2,
  Eye,
} from "lucide-react";
import { fetchUltimosCierres } from "../services/cajaService";
import CierreDetalleModal from "../components/CierreDetalleModal";
import { formatMoney } from "../services/dashboardService";

export default function HistorialCierres() {
  const [cierres, setCierres] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchUltimosCierres();
        setCierres(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatFecha = (f) => {
    // Parsear la fecha asumiendo timezone Argentina
    const fecha = new Date(f);

    // Formatear con timezone Argentina explícito
    return fecha.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Argentina/Buenos_Aires",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Cargando historial...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Historial de Cierres
          </h1>
          <p className="text-gray-600">
            Consulta todos los cierres de caja realizados
          </p>
        </motion.div>

        {/* EMPTY STATE */}
        {cierres.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="p-6 bg-gray-100 rounded-full mb-4">
              <FileText className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay cierres registrados
            </h3>
            <p className="text-gray-500 max-w-md">
              Los cierres de caja aparecerán aquí una vez que se registren
            </p>
          </motion.div>
        ) : (
          <>
            {/* RESUMEN */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8" />
                  <div>
                    <p className="text-sm opacity-90">
                      Total de Cierres Activos
                    </p>
                    <p className="text-3xl font-bold">
                      {cierres.filter((c) => c.estado !== "anulado").length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8" />
                  <div>
                    <p className="text-sm opacity-90">Total Acumulado</p>
                    <p className="text-3xl font-bold">
                      $
                      {formatMoney(
                        cierres
                          .filter((c) => c.estado !== "anulado")
                          .reduce((acc, c) => acc + (c.total || 0), 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* GRID DE CIERRES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cierres.map((cierre, i) => (
                <motion.div
                  key={cierre._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  onClick={() => setSelected(cierre)}
                  className="cursor-pointer bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
                >
                  {/* Header del Card */}
                  <div
                    className={`h-2 ${
                      cierre.estado === "anulado"
                        ? "bg-gradient-to-r from-red-500 to-pink-500"
                        : "bg-gradient-to-r from-blue-500 to-purple-500"
                    }`}
                  />

                  <div className="p-6 space-y-4">
                    {/* Fecha y Badge Anulado */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-5 h-5" />
                        <p className="text-sm font-medium capitalize">
                          {formatFecha(cierre.fecha)}
                        </p>
                      </div>
                      {cierre.estado === "anulado" && (
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700 border border-red-300">
                          ANULADO
                        </span>
                      )}
                    </div>

                    {/* Total */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Total del Día
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        ${formatMoney(cierre.total)}
                      </p>
                    </div>

                    {/* Detalles */}
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <ShoppingCart className="w-4 h-4" />
                          <span className="text-sm">Ventas</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {cierre.cantidadVentas}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">Ganancia Neta</span>
                        </div>
                        <span className="font-semibold text-green-600">
                          ${formatMoney(cierre.gananciaNeta)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="text-sm">Usuario</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {cierre.usuario}
                        </span>
                      </div>
                    </div>

                    {/* Botón Ver Detalle */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all"
                    >
                      <Eye className="w-5 h-5" />
                      Ver Detalle
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* MODAL */}
        {selected && (
          <CierreDetalleModal
            cierre={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}
