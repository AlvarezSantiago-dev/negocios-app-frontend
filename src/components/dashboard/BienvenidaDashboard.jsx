import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, CalendarDays } from "lucide-react";
import useCajaStore from "../../store/useCajaStore";
import { AperturaModal } from "@/components/AperturaModal";
import { CierreModal } from "@/components/CierreModal";
import { AnularCierreModal } from "./AnularCierreModal";

export default function BienvenidaDashboard({ fechaActual }) {
  const {
    resumen,
    abrirCaja,
    cerrarCaja,
    fetchCaja,
    loading,
    loadingCierre,
    cerrando,
    anularCierre,
  } = useCajaStore();

  const [modalApertura, setModalApertura] = useState(false);
  const [modalCierre, setModalCierre] = useState(false);
  const [modalAnular, setModalAnular] = useState(false);

  // 🔹 Cargar resumen de caja al montar
  useEffect(() => {
    fetchCaja();
  }, []);

  // Determinar estado del botón y mensaje según el resumen
  const estadoCaja = () => {
    if (resumen?.abierta)
      return { color: "green", texto: "Abierta ✅", boton: "Cerrar Caja" };
    if (resumen?.aperturaHoy && resumen?.cierreHoy)
      return { color: "red", texto: "Cerrada ✅ (cerrada hoy)", boton: null };
    if (!resumen?.abierta && resumen?.aperturaHoy && !resumen?.cierreHoy)
      return {
        color: "yellow",
        texto: "Cerrada ⚠ (pendiente cierre)",
        boton: "Cerrar Caja",
      };
    return { color: "blue", texto: "Cerrada ❌", boton: "Abrir Caja" };
  };

  const { color, texto, boton } = estadoCaja();

  const handleApertura = async (montos) => {
    await abrirCaja(montos);
    setModalApertura(false);
  };

  const handleCierre = async (montos) => {
    await cerrarCaja(montos);
    setModalCierre(false);
  };
  const handleAnularCierre = async (motivo) => {
    await anularCierre(resumen.cierreId, motivo);
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
                color === "green"
                  ? "bg-green-500 animate-ping"
                  : color === "red"
                  ? "bg-red-500"
                  : color === "yellow"
                  ? "bg-yellow-500 animate-ping"
                  : "bg-gray-400"
              }`}
            />
            <span
              className={`${
                color === "green"
                  ? "text-green-600"
                  : color === "red"
                  ? "text-red-600"
                  : color === "yellow"
                  ? "text-yellow-600"
                  : "text-blue-600"
              }`}
            >
              Estado de caja: {texto}
            </span>
          </span>

          {boton && (
            <button
              onClick={() =>
                boton === "Abrir Caja"
                  ? setModalApertura(true)
                  : setModalCierre(true)
              }
              disabled={loading || loadingCierre || cerrando}
              className={`relative overflow-hidden px-6 py-2 rounded-2xl font-bold text-white shadow-lg transition-all duration-300
                ${
                  boton === "Abrir Caja"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
            >
              <span className="relative flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                {loadingCierre || cerrando ? "Cerrando..." : boton}
              </span>
            </button>
          )}
        </div>
      </motion.div>
      {resumen?.cierreHoy && (
        <button
          onClick={() => setModalAnular(true)}
          className="text-sm text-red-600 border border-red-300 px-3 py-1 rounded-xl hover:bg-red-50 transition"
        >
          ⚠️ Anular cierre del día
        </button>
      )}
      <AnularCierreModal
        open={modalAnular}
        onClose={() => setModalAnular(false)}
        onConfirm={handleAnularCierre}
      />

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
