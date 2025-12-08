import * as Dialog from "@radix-ui/react-dialog";
import { generarPDFCierreIndividual } from "../utils/pdfCierres";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

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

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        <Dialog.Content
          className="
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-[92%] max-w-2xl max-h-[90vh] overflow-y-auto
          bg-white rounded-2xl shadow-2xl p-6 border
        "
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Header */}
            <Dialog.Title className="text-3xl font-bold text-gray-900 mb-4">
              Cierre del {formatFecha(cierre.fecha)}
            </Dialog.Title>

            {/* Resumen general */}
            <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm bg-gray-50 p-4 rounded-xl border">
              <p>
                <b>Apertura total:</b> ${formatMoney(cierre.apertura)}
              </p>
              <p>
                <b>Total vendido:</b> ${formatMoney(cierre.totalVendido)}
              </p>
              <p>
                <b>Ganancia:</b> ${formatMoney(cierre.gananciaTotal)}
              </p>
              <p>
                <b>Ingresos:</b> ${formatMoney(cierre.ingresos)}
              </p>
              <p>
                <b>Egresos:</b> ${formatMoney(cierre.egresos)}
              </p>
              <p>
                <b>Saldo final:</b> ${formatMoney(cierre.total)}
              </p>
              <p>
                <b>Ventas:</b> {cierre.cantidadVentas}
              </p>
              <p>
                <b>Cierre Hora:</b> {formatHora(cierre.cierreHora)}
              </p>
              <p>
                <b>Usuario:</b> {cierre.usuario}
              </p>
            </div>

            {/* Métodos */}
            <h3 className="text-xl font-semibold mt-8 mb-2">
              Totales por método
            </h3>
            <div className="grid grid-cols-3 gap-4 text-gray-700 text-sm">
              <div className="p-4 bg-gray-50 border rounded-xl">
                <b>Efectivo:</b> ${formatMoney(cierre.efectivo)}
              </div>
              <div className="p-4 bg-gray-50 border rounded-xl">
                <b>Mercado Pago:</b> ${formatMoney(cierre.mp)}
              </div>
              <div className="p-4 bg-gray-50 border rounded-xl">
                <b>Transferencias:</b> ${formatMoney(cierre.transferencia)}
              </div>
            </div>

            {/* Ventas */}
            <h3 className="text-xl font-semibold mt-8 mb-3">Ventas del día</h3>
            <div className="space-y-4">
              {cierre.ventas.length === 0 ? (
                <p className="text-gray-500">No hubo ventas.</p>
              ) : (
                cierre.ventas.map((v) => (
                  <div
                    key={v.idVenta}
                    className="p-4 rounded-xl bg-white border shadow-sm"
                  >
                    <p>
                      <b>Hora:</b> {formatHora(v.hora)}
                    </p>
                    <p>
                      <b>Total:</b> ${formatMoney(v.total)}
                    </p>
                    <p>
                      <b>Método:</b> {v.metodo}
                    </p>

                    <div className="mt-2">
                      <p className="font-semibold">Productos:</p>
                      <ul className="text-sm pl-4 mt-1">
                        {v.productos.map((p, i) => (
                          <li key={i}>
                            {p.nombre} ×{p.cantidad} — ${formatMoney(p.precio)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePDF}
                disabled={pdfCooldown}
                className={`px-4 py-2 rounded-xl font-semibold shadow ${
                  pdfCooldown
                    ? "bg-gray-400 text-gray-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {pdfCooldown ? `PDF listo en ${countdown}s` : "Generar PDF"}
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl font-semibold shadow bg-gray-300 text-gray-800 hover:bg-gray-400"
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
