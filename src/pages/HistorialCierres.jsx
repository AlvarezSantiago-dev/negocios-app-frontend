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

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <motion.h1
        className="text-3xl font-bold text-gray-800"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Historial de Cierres
      </motion.h1>

      {cierres.length === 0 && (
        <p className="text-gray-500">No hay cierres registrados.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cierres.map((cierre) => (
          <motion.div
            key={cierre._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelected(cierre)}
            className="
              cursor-pointer border rounded-xl p-5 shadow-md
              bg-white hover:shadow-lg transition
            "
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg text-gray-800">
                {new Date(cierre.fecha).toLocaleDateString("es-AR")}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                Total: ${cierre.total}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {cierre.cantidadVentas} ventas • Usuario: {cierre.usuario}
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
