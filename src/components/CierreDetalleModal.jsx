import * as Dialog from "@radix-ui/react-dialog";
import { generarPDFCierreIndividual } from "../utils/pdfCierres";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  User,
  ShoppingCart,
  CreditCard,
  Smartphone,
  Banknote,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Download,
} from "lucide-react";

export default function CierreDetalleModal({ cierre, onClose }) {
  const [pdfCooldown, setPdfCooldown] = useState(false);
  const [countdown, setCountdown] = useState(0);

  if (!cierre) return null;

  const formatMoney = (n) =>
    (n ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 2 });

  const formatHora = (f) => new Date(f).toLocaleTimeString("es-AR");
  const formatFecha = (f) =>
    new Date(f).toLocaleDateString("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const handlePDF = async () => {
    if (pdfCooldown) return;

    setPdfCooldown(true);
    setCountdown(30);

    await generarPDFCierreIndividual(cierre);

    Swal.fire({
      icon: "success",
      title: "PDF generado",
      text: "El documento se descargó correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });

    setTimeout(() => onClose(), 2000);
  };

  useEffect(() => {
    if (!pdfCooldown) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPdfCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pdfCooldown]);

  const isAnulado = cierre.estado === "anulado";

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl h-[70vh] overflow-hidden bg-white rounded-3xl shadow-2xl z-50 flex flex-col">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="flex flex-col h-full"
          >
            {/* HEADER con gradiente */}
            <div
              className={`relative px-6 py-4 flex-shrink-0 ${
                isAnulado
                  ? "bg-gradient-to-r from-red-500 via-pink-500 to-red-600"
                  : "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700"
              } text-white`}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  {isAnulado ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : (
                    <FileText className="w-8 h-8" />
                  )}
                </div>
                <div className="flex-1">
                  <Dialog.Title className="text-2xl font-bold mb-1">
                    {isAnulado ? "⚠️ Cierre Anulado" : "Detalle de Cierre"}
                  </Dialog.Title>
                  <div className="flex flex-wrap items-center gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="capitalize">
                        {formatFecha(cierre.fecha)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatHora(cierre.cierreHora)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{cierre.usuario}</span>
                    </div>
                  </div>
                  {isAnulado && cierre.anuladoMotivo && (
                    <div className="mt-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                      <p className="text-sm font-semibold">
                        Motivo de anulación:
                      </p>
                      <p className="text-sm opacity-90">
                        {cierre.anuladoMotivo}
                      </p>
                      <p className="text-xs opacity-75 mt-1">
                        Anulado por: {cierre.anuladoPor || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
              {/* RESUMEN EN CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      Saldo Final
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    ${formatMoney(cierre.total)}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      Ganancia Neta
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    ${formatMoney(cierre.gananciaNeta)}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ShoppingCart className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      Total Vendido
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    ${formatMoney(cierre.totalVendido)}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <ShoppingCart className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      Cantidad Ventas
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {cierre.cantidadVentas}
                  </p>
                </motion.div>
              </div>

              {/* DETALLES FINANCIEROS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* INGRESOS Y EGRESOS */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Movimientos
                  </h3>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">
                        Apertura:
                      </span>
                      <span className="font-bold text-gray-900">
                        ${formatMoney(cierre.apertura)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Ingresos:
                      </span>
                      <span className="font-bold text-green-600">
                        ${formatMoney(cierre.ingresos)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-600 font-medium flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" />
                        Egresos:
                      </span>
                      <span className="font-bold text-red-600">
                        ${formatMoney(cierre.egresos)}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-semibold">
                          Ganancia Total:
                        </span>
                        <span className="font-bold text-blue-600 text-lg">
                          ${formatMoney(cierre.gananciaTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MÉTODOS DE PAGO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    Métodos de Pago
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Banknote className="w-5 h-5 text-green-600" />
                          </div>
                          <span className="font-medium text-gray-700">
                            Efectivo
                          </span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                          ${formatMoney(cierre.efectivo)}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Smartphone className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-700">
                            Mercado Pago
                          </span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                          ${formatMoney(cierre.mp)}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <CreditCard className="w-5 h-5 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-700">
                            Transferencias
                          </span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                          ${formatMoney(cierre.transferencia)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* VENTAS DEL DÍA */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-orange-600" />
                  Ventas del Día ({cierre.ventas?.length || 0})
                </h3>
                {!cierre.ventas || cierre.ventas.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">
                      No hubo ventas en este período.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2">
                    {cierre.ventas.map((v, idx) => (
                      <motion.div
                        key={v.idVenta}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <ShoppingCart className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                Venta #{idx + 1}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatHora(v.hora)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              ${formatMoney(v.total)}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                v.metodo === "efectivo"
                                  ? "bg-green-100 text-green-700"
                                  : v.metodo === "mp"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {v.metodo}
                            </span>
                          </div>
                        </div>

                        {/* Productos */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Productos:
                          </p>
                          <ul className="space-y-1">
                            {v.productos?.map((p, i) => (
                              <li
                                key={i}
                                className="text-sm text-gray-600 flex justify-between"
                              >
                                <span>
                                  {p.nombre}{" "}
                                  <span className="text-gray-400">
                                    ×{p.cantidad}
                                  </span>
                                </span>
                                <span className="font-medium text-gray-900">
                                  ${formatMoney(p.precio)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER con botones */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center gap-3 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePDF}
                disabled={pdfCooldown}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${
                  pdfCooldown
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                }`}
              >
                <Download className="w-5 h-5" />
                {pdfCooldown ? `Espera ${countdown}s` : "Descargar PDF"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg bg-gray-300 hover:bg-gray-400 text-gray-800 transition-all"
              >
                <X className="w-5 h-5" />
                Cerrar
              </motion.button>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
