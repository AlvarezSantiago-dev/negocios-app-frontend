import { motion } from "framer-motion";

export default function MovimientosTable({ data = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur rounded-2xl shadow-md border border-white/40 p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Últimos movimientos
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500">No hay movimientos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-gray-600 font-medium">Tipo</th>
                <th className="py-2 text-gray-600 font-medium">Monto</th>
                <th className="py-2 text-gray-600 font-medium">Método</th>
                <th className="py-2 text-gray-600 font-medium">Hora</th>
              </tr>
            </thead>

            <tbody>
              {data.map((m, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 capitalize">{m.tipo}</td>
                  <td className="py-3 font-medium">$ {m.monto}</td>
                  <td className="py-3 capitalize">{m.metodo}</td>
                  <td className="py-3">
                    {new Date(m.fecha).toLocaleTimeString("es-AR", {
                      timeZone: "America/Argentina/Buenos_Aires",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
