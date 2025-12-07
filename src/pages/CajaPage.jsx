import { useState, useEffect } from "react";
import useCajaStore from "../store/useCajaStore";
import MovimientosTable from "../components/MovimientosTable";
import MovimientoFormModal from "../components/MovimientoFormModal";
import { AperturaModal } from "@/components/AperturaModal";
import { CierreModal } from "@/components/CierreModal";

import { Button } from "@/components/ui/button";
import { Wallet, DollarSign, Smartphone, RefreshCcw, Info } from "lucide-react";
import { motion } from "framer-motion";
import { formatMoney } from "../services/dashboardService";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

function CajaKPI({ label, value, icon, color, tooltip }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-md border border-white/40 hover:shadow-lg transition"
    >
      <div className="flex justify-between items-center text-gray-700">
        <span className="flex items-center gap-1 font-medium">
          {icon} {label}
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
          )}
        </span>
        <span className="text-2xl font-bold" style={{ color }}>
          {value}
        </span>
      </div>
    </motion.div>
  );
}

export default function CajaPage() {
  const {
    resumen,
    movimientos,
    fetchCaja,
    crearMovimiento,
    editarMovimiento,
    eliminarMovimiento,
    abrirCaja,
    cerrarCaja,
    loading,
    loadingCierre,
    cerrando,
    cierreHoy,
    fetchCierreData,
  } = useCajaStore();

  const [modalMov, setModalMov] = useState(false);
  const [editing, setEditing] = useState(null);
  const [modalApertura, setModalApertura] = useState(false);
  const [modalCierre, setModalCierre] = useState(false);

  useEffect(() => {
    fetchCaja();
    fetchCierreData();
  }, []);

  const saveMovimiento = (data) => {
    if (editing) editarMovimiento(editing._id, data);
    else crearMovimiento(data);
    setEditing(null);
  };

  return (
    <TooltipProvider>
      <div className="p-6 space-y-8 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
        <motion.h2
          className="text-3xl font-bold text-gray-800"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Caja
        </motion.h2>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <CajaKPI
            label="Total Caja"
            value={`$${formatMoney(resumen?.total)}`}
            icon={<Wallet className="w-5 h-5 opacity-70" />}
            color="#1e40af"
            tooltip="Suma de efectivo, MP y transferencias."
          />
          <CajaKPI
            label="Efectivo"
            value={`$${formatMoney(resumen?.efectivo)}`}
            icon={<DollarSign className="w-5 h-5 opacity-70" />}
            color="#065f46"
            tooltip="Dinero físico en caja."
          />
          <CajaKPI
            label="Mercado Pago"
            value={`$${formatMoney(resumen?.mp)}`}
            icon={<Smartphone className="w-5 h-5 opacity-70" />}
            color="#0c4a6e"
            tooltip="Ventas recibidas por Mercado Pago."
          />
          <CajaKPI
            label="Transferencia"
            value={`$${formatMoney(resumen?.transferencia)}`}
            icon={<Smartphone className="w-5 h-5 opacity-70" />}
            color="#854d0e"
            tooltip="Ventas recibidas por transferencias bancarias."
          />
        </div>

        {/* Botones */}
        <motion.div
          className="flex flex-wrap gap-3 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button
            onClick={() => setModalApertura(true)}
            disabled={resumen?.aperturaHoy || loading}
          >
            Abrir Caja
          </Button>

          <Button
            variant="destructive"
            onClick={() => setModalCierre(true)}
            disabled={
              !resumen?.abierta ||
              resumen?.cierreHoy ||
              loadingCierre ||
              cerrando
            }
          >
            {loadingCierre || cerrando ? "Cerrando..." : "Cerrar Caja"}
          </Button>

          <Button variant="secondary" onClick={() => setModalMov(true)}>
            Nuevo Movimiento
          </Button>

          <Button
            variant="outline"
            onClick={fetchCaja}
            className="flex gap-2 items-center"
          >
            <RefreshCcw className="w-4 h-4" /> Refrescar
          </Button>
        </motion.div>

        {/* Movimientos */}
        <MovimientosTable
          data={movimientos}
          onEdit={(m) => {
            setEditing(m);
            setModalMov(true);
          }}
          onDelete={eliminarMovimiento}
        />

        {/* Cierre del día */}
        {cierreHoy && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white/70 shadow-md border border-white/40 rounded-xl p-4 mt-4">
              <h3 className="font-semibold mb-2">Cierre de hoy</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>Cantidad Ventas: {cierreHoy.cantidadVentas}</div>
                <div>Total: ${formatMoney(cierreHoy.total)}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Modales */}
        <MovimientoFormModal
          open={modalMov}
          initialData={editing}
          onClose={() => {
            setModalMov(false);
            setEditing(null);
          }}
          onSave={saveMovimiento}
        />

        <AperturaModal
          open={modalApertura}
          onClose={() => setModalApertura(false)}
          onConfirm={async (montos) => {
            await abrirCaja(montos);
            setModalApertura(false);
          }}
        />

        <CierreModal
          open={modalCierre}
          onClose={() => setModalCierre(false)}
          resumen={resumen}
          onConfirm={async (montos) => {
            await cerrarCaja(montos); // ahora recibe el objeto correctamente
            setModalCierre(false);
          }}
        />
      </div>
    </TooltipProvider>
  );
}
