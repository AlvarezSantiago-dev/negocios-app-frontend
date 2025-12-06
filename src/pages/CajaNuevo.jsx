// components/CajaNuevo.jsx
import { useState } from "react";
import Modal from "../components/ui/Modal";
import { crearMovimientoCaja } from "../services/cajaService";

export default function CajaNuevo({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    tipo: "",
    monto: "",
    motivo: "",
  });

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.tipo) return alert("Seleccioná tipo");
    if (!form.monto || Number(form.monto) <= 0) return alert("Monto inválido");
    if (!form.motivo.trim()) return alert("Motivo requerido");

    const res = await crearMovimientoCaja({
      tipo: form.tipo,
      monto: Number(form.monto),
      motivo: form.motivo,
      fecha: new Date(),
    });

    if (res?.statusCode !== 201) {
      return alert("Error al guardar movimiento");
    }

    onSave(); // recargar caja
    onClose(); // cerrar modal
  };

  return (
    <Modal open={open} onClose={onClose} title="Registrar movimiento">
      <div className="space-y-4">
        {/* Tipo */}
        <div>
          <label className="block mb-1 font-semibold">Tipo</label>
          <select
            name="tipo"
            className="w-full border rounded-lg p-2"
            value={form.tipo}
            onChange={handle}
          >
            <option value="">Seleccionar tipo...</option>
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>
        </div>

        {/* Monto */}
        <div>
          <label className="block mb-1 font-semibold">Monto</label>
          <input
            name="monto"
            type="number"
            className="w-full border rounded-lg p-2"
            value={form.monto}
            onChange={handle}
            placeholder="Ej: 1000"
          />
        </div>

        {/* Motivo */}
        <div>
          <label className="block mb-1 font-semibold">Motivo</label>
          <input
            name="motivo"
            className="w-full border rounded-lg p-2"
            value={form.motivo}
            onChange={handle}
            placeholder="Ej: Compra de mercadería"
          />
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          onClick={submit}
        >
          Guardar movimiento
        </button>
      </div>
    </Modal>
  );
}
