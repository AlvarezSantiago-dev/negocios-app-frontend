import { useEffect, useState } from "react";
import { fetchUltimosCierres } from "../services/cajaService";
import CierreDetalleModal from "../components/CierreDetalleModal";
import { motion } from "framer-motion";

export default function HistorialCierres() {
  const [cierres, setCierres] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await fetchUltimosCierres();
      setCierres(data || []);
    })();
  }, []);

  const formatMoney = (n) =>
    (n ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 2 });

  const formatFecha = (f) =>
    new Date(f).toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <motion.h1
        className="text-4xl font-extrabold text-gray-900 tracking-tight"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Historial de Cierres
      </motion.h1>

      {cierres.length === 0 && (
        <p className="text-gray-600 text-lg">No hay cierres registrados.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cierres.map((cierre) => (
          <motion.div
            key={cierre._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelected(cierre)}
            className="cursor-pointer rounded-2xl bg-white border shadow-md hover:shadow-xl transition p-6"
          >
            <p className="text-sm text-gray-500 mb-1">
              {formatFecha(cierre.fecha)}
            </p>

            <p className="text-xl font-bold text-gray-900 mb-2">
              Total del día: ${formatMoney(cierre.total)}
            </p>

            <div className="text-gray-700 text-sm space-y-1">
              <p>
                <b>Ventas:</b> {cierre.cantidadVentas}
              </p>
              <p>
                <b>Ganancia neta:</b> ${formatMoney(cierre.gananciaNeta)}
              </p>
              <p>
                <b>Usuario:</b> {cierre.usuario}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {selected && (
        <CierreDetalleModal
          cierre={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
