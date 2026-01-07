import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Wallet, Sun, Moon, Cloud } from "lucide-react";
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
      return {
        color: "green",
        texto: "Abierta",
        boton: "Cerrar Caja",
        emoji: "✅",
      };
    if (resumen?.aperturaHoy && resumen?.cierreHoy)
      return {
        color: "blue",
        texto: "Cerrada (hoy)",
        boton: null,
        emoji: "🔒",
      };
    if (!resumen?.abierta && resumen?.aperturaHoy && !resumen?.cierreHoy)
      return {
        color: "yellow",
        texto: "Pendiente cierre",
        boton: "Cerrar Caja",
        emoji: "⚠️",
      };
    return {
      color: "red",
      texto: "Cerrada",
      boton: "Abrir Caja",
      emoji: "❌",
    };
  };

  const { color, texto, boton, emoji } = estadoCaja();

  const handleApertura = async (montos) => {
    await abrirCaja(montos);
    setModalApertura(false);
  };

  const handleCierre = async (montos) => {
    await cerrarCaja(montos);
    setModalCierre(false);
  };

  const handleAnularCierre = async (motivo) => {
    const cierreId = resumen?.cierreHoy?._id;
    if (!cierreId) {
      console.error("No hay cierre activo para anular");
      return;
    }
    await anularCierre(cierreId, motivo);
  };

  // Obtener saludo según la hora
  const getSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return { texto: "Buenos días", icon: Sun };
    if (hora < 20) return { texto: "Buenas tardes", icon: Cloud };
    return { texto: "Buenas noches", icon: Moon };
  };

  const saludo = getSaludo();
  const SaludoIcon = saludo.icon;

  const colorSchemes = {
    green: {
      bg: "from-green-500 to-emerald-600",
      text: "text-green-600",
      badge: "bg-green-100 text-green-700",
      pulse: "bg-green-500",
    },
    blue: {
      bg: "from-blue-500 to-cyan-600",
      text: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
      pulse: "bg-blue-500",
    },
    yellow: {
      bg: "from-yellow-500 to-orange-600",
      text: "text-yellow-600",
      badge: "bg-yellow-100 text-yellow-700",
      pulse: "bg-yellow-500",
    },
    red: {
      bg: "from-red-500 to-pink-600",
      text: "text-red-600",
      badge: "bg-red-100 text-red-700",
      pulse: "bg-red-500",
    },
  };

  const scheme = colorSchemes[color];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-100"
      >
        {/* Fondo decorativo con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50" />

        {/* Contenido */}
        <div className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Izquierda - Saludo */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <SaludoIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {saludo.texto} 👋
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Calendar className="w-4 h-4" />
                    <p className="text-sm capitalize">{fechaActual}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Derecha - Estado de Caja */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              {/* Badge de estado */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl ${scheme.badge} shadow-md`}
              >
                <div className="relative">
                  <div
                    className={`w-3 h-3 rounded-full ${scheme.pulse} ${
                      color === "green" || color === "yellow"
                        ? "animate-pulse"
                        : ""
                    }`}
                  />
                  <div
                    className={`absolute inset-0 w-3 h-3 rounded-full ${scheme.pulse} animate-ping opacity-75`}
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Estado de Caja
                  </p>
                  <p className={`font-bold ${scheme.text}`}>
                    {emoji} {texto}
                  </p>
                </div>
              </motion.div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-2">
                {boton && (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      boton === "Abrir Caja"
                        ? setModalApertura(true)
                        : setModalCierre(true)
                    }
                    disabled={loading || loadingCierre || cerrando}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all bg-gradient-to-r ${
                      boton === "Abrir Caja"
                        ? "from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : "from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Wallet className="w-5 h-5" />
                    {loadingCierre || cerrando ? "Cerrando..." : boton}
                  </motion.button>
                )}

                {/* Botón anular cierre */}
                {resumen?.cierreHoy?._id && !resumen?.abierta && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setModalAnular(true)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium underline"
                  >
                    Anular cierre del día
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Decoración de ondas */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      </motion.div>

      {/* Modales */}
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
