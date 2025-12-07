import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, CalendarDays } from "lucide-react";
import useDashboardStore from "../../store/useDashboardStore";
import { AperturaModal } from "@/components/AperturaModal";
import { CierreModal } from "@/components/CierreModal";
import useCajaStore from "../../store/useCajaStore";

export default function BienvenidaDashboard({ fechaActual }) {
  const { caja, actualizarCaja, syncDashboard } = useDashboardStore();
  const { resumen, abrirCaja, cerrarCaja, loading, loadingCierre, cerrando } =
    useCajaStore();

  const [modalApertura, setModalApertura] = useState(false);
  const [modalCierre, setModalCierre] = useState(false);

  // 🔹 Actualizamos caja al cargar
  useEffect(() => {
    actualizarCaja();
  }, []);

  const botonActivo = !resumen?.abierta && !resumen?.aperturaHoy;

  const handleApertura = async (montos) => {
    await abrirCaja(montos);
    await syncDashboard(); // sincroniza todo el dashboard
    setModalApertura(false);
  };

  const handleCierre = async (montos) => {
    await cerrarCaja(montos);
    await syncDashboard(); // sincroniza todo el dashboard
    setModalCierre(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/40 flex flex-col sm:flex-row justify-between items-center gap-6"
      >
        {/* Izquierda */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            <CalendarDays className="text-blue-600 w-9 h-9" /> ¡Bienvenido! 👋
          </h1>
          <p className="text-gray-600 text-sm mt-1 capitalize">{fechaActual}</p>
        </div>

        {/* Derecha */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span className="flex items-center gap-3 text-lg font-semibold">
            <span
              className={`w-4 h-4 rounded-full ${
                resumen?.abierta ? "bg-green-500 animate-ping" : "bg-red-500"
              }`}
            />
            <span
              className={`${
                resumen?.abierta ? "text-green-600" : "text-red-600"
              }`}
            >
              Estado de caja: {resumen?.abierta ? "Abierta ✅" : "Cerrada ❌"}
            </span>
          </span>

          <button
            onClick={() =>
              resumen?.abierta ? setModalCierre(true) : setModalApertura(true)
            }
            disabled={
              loading ||
              loadingCierre ||
              cerrando ||
              (!resumen?.abierta && resumen?.aperturaHoy)
            }
            className={`relative overflow-hidden px-6 py-2 rounded-2xl font-bold text-white shadow-lg transition-all duration-300
              ${
                resumen?.abierta
                  ? "bg-red-600 hover:bg-red-700"
                  : botonActivo
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            <span className="relative flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              {resumen?.abierta
                ? loadingCierre || cerrando
                  ? "Cerrando..."
                  : "Cerrar Caja"
                : "Abrir Caja"}
            </span>
          </button>
        </div>
      </motion.div>

      <AperturaModal
        open={modalApertura}
        onClose={() => setModalApertura(false)}
        onConfirm={handleApertura}
      />

      <CierreModal
        open={modalCierre}
        onClose={() => setModalCierre(false)}
        resumen={resumen}
        onConfirm={handleCierre}
      />
    </>
  );
}
