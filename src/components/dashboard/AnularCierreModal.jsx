import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export function AnularCierreModal({ open, onClose, onConfirm }) {
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!motivo.trim()) return;
    setLoading(true);
    await onConfirm(motivo);
    setLoading(false);
    setMotivo("");
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
        >
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertTriangle />
            <h2 className="text-lg font-bold">Anular cierre del día</h2>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Esta acción dejará el cierre sin efecto y permitirá volver a cerrar
            la caja. Quedará registrada para auditoría.
          </p>

          <textarea
            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            rows={4}
            placeholder="Motivo de la anulación (obligatorio)"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              disabled={!motivo || loading}
              onClick={handleConfirm}
              className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Anulando..." : "Confirmar anulación"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
