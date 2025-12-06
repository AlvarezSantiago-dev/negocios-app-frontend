import * as Dialog from "@radix-ui/react-dialog";
import { generarPDFCierreIndividual } from "../utils/pdfCierres";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

export default function CierreDetalleModal({ cierre, onClose }) {
  const [pdfCooldown, setPdfCooldown] = useState(false);
  const [countdown, setCountdown] = useState(0);

  if (!cierre) return null;

  const handlePDF = async () => {
    if (pdfCooldown) return;

    setPdfCooldown(true);
    setCountdown(30); // 30 segundos de cooldown

    // Generar PDF
    await generarPDFCierreIndividual(cierre);

    // SweetAlert feedback
    Swal.fire({
      icon: "success",
      title: "PDF generado",
      text: "Se descargó correctamente. El modal se cerrará.",
      timer: 2000,
      showConfirmButton: false,
    });

    // Cierra el modal automáticamente después de 2 seg
    setTimeout(() => onClose(), 2000);
  };

  // Countdown dinámico
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

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white pb-3 border-b mb-4">
              <Dialog.Title className="text-2xl font-bold text-gray-800">
                Cierre del {new Date(cierre.fecha).toLocaleDateString("es-AR")}
              </Dialog.Title>
            </div>

            {/* Detalle general */}
            <div className="grid grid-cols-2 gap-3 text-gray-700">
              <p>
                <b>Efectivo:</b> ${cierre.efectivo}
              </p>
              <p>
                <b>Mercado Pago:</b> ${cierre.mp}
              </p>
              <p>
                <b>Transferencias:</b> ${cierre.transferencia}
              </p>
              <p>
                <b>Total:</b> ${cierre.total}
              </p>
              <p>
                <b>Ingresos:</b> ${cierre.ingresos}
              </p>
              <p>
                <b>Egresos:</b> ${cierre.egresos}
              </p>
              <p>
                <b>Ventas:</b> {cierre.cantidadVentas}
              </p>
              <p>
                <b>Usuario:</b> {cierre.usuario}
              </p>
            </div>

            {/* Ventas */}
            <h3 className="text-xl font-semibold mt-6 mb-3">Ventas del día</h3>
            <div className="space-y-3">
              {cierre.ventas.length === 0 ? (
                <p className="text-gray-500">No hubo ventas en este cierre.</p>
              ) : (
                cierre.ventas.map((v) => (
                  <motion.div
                    key={v.idVenta}
                    whileHover={{ scale: 1.01 }}
                    className="border rounded-lg p-4 shadow-sm bg-gray-50 hover:bg-white transition"
                  >
                    <p>
                      <b>Hora:</b>{" "}
                      {new Date(v.hora).toLocaleTimeString("es-AR")}
                    </p>
                    <p>
                      <b>Total:</b> ${v.total}
                    </p>
                    <p>
                      <b>Método:</b> {v.metodo}
                    </p>
                    <div className="mt-3">
                      <p className="font-semibold">Productos:</p>
                      <ul className="text-sm pl-4 mt-1">
                        {v.productos.map((p, i) => (
                          <li key={i}>
                            {p.nombre} ×{p.cantidad} — ${p.precio}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePDF}
                disabled={pdfCooldown}
                className={`px-4 py-2 rounded-lg shadow transition font-semibold
                  ${
                    pdfCooldown
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {pdfCooldown
                  ? `Generando PDF... (${countdown}s)`
                  : "Generar PDF"}
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg shadow bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
