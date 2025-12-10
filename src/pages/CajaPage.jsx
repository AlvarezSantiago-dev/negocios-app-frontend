import { useState, useEffect } from "react";
import useCajaStore from "../store/useCajaStore";
import MovimientosTable from "../components/MovimientosTable";
import MovimientoFormModal from "../components/MovimientoFormModal";
import { AperturaModal } from "@/components/AperturaModal";
import { CierreModal } from "@/components/CierreModal";
import VentasTable from "../components/VentasTable";
import VentaFormModal from "../components/VentaFormModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { Wallet, DollarSign, Smartphone, RefreshCcw, Info } from "lucide-react";
import { motion } from "framer-motion";
import { formatMoney } from "../services/dashboardService";

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
          {tooltip && Tooltip && TooltipTrigger && TooltipContent && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
          )}
        </span>
        <span className="text-2xl font-bold" style={{ color }}>
          {value || "$0"}
        </span>
      </div>
    </motion.div>
  );
}

export default function CajaPage() {
  const {
    ventas = [],
    resumen = {},
    allmovimientos = [],
    fetchCaja,
    crearMovimiento,
    editarMovimiento,
    eliminarMovimiento,
    abrirCaja,
    cerrarCaja,
    loading = false,
    loadingCierre = false,
    cerrando = false,
    cierreHoy,
    fetchCierreData,
    eliminarVenta,
    editarVenta,
    fetchVentas,
  } = useCajaStore();

  const [modalVenta, setModalVenta] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);
  const [modalMov, setModalMov] = useState(false);
  const [editing, setEditing] = useState(null);
  const [modalApertura, setModalApertura] = useState(false);
  const [modalCierre, setModalCierre] = useState(false);

  useEffect(() => {
    if (fetchCaja) fetchCaja();
    if (fetchVentas) fetchVentas();
    if (fetchCierreData) fetchCierreData();
  }, [fetchCaja, fetchCierreData]);

  const saveMovimiento = (data) => {
    if (!data) return;
    if (editing && editarMovimiento) editarMovimiento(editing._id, data);
    else if (crearMovimiento) crearMovimiento(data);
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
            value={`$${formatMoney(resumen?.total || 0)}`}
            icon={<Wallet className="w-5 h-5 opacity-70" />}
            color="#1e40af"
            tooltip="Suma de efectivo, MP y transferencias."
          />
          <CajaKPI
            label="Efectivo"
            value={`$${formatMoney(resumen?.efectivo || 0)}`}
            icon={<DollarSign className="w-5 h-5 opacity-70" />}
            color="#065f46"
            tooltip="Dinero físico en caja."
          />
          <CajaKPI
            label="Mercado Pago"
            value={`$${formatMoney(resumen?.mp || 0)}`}
            icon={<Smartphone className="w-5 h-5 opacity-70" />}
            color="#0c4a6e"
            tooltip="Ventas recibidas por Mercado Pago."
          />
          <CajaKPI
            label="Transferencia"
            value={`$${formatMoney(resumen?.transferencia || 0)}`}
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
            onClick={() => fetchCaja && fetchCaja()}
            className="flex gap-2 items-center"
          >
            <RefreshCcw className="w-4 h-4" /> Refrescar
          </Button>
        </motion.div>

        {/* Movimientos */}
        <MovimientosTable
          data={allmovimientos || []}
          onEdit={(m) => {
            if (!m) return;
            setEditing(m);
            setModalMov(true);
          }}
          onDelete={(id) => eliminarMovimiento?.(id)}
        />
        <VentasTable
          data={ventas}
          onEdit={(v) => {
            setEditingVenta(v);
            setModalVenta(true);
          }}
          onDelete={(id) => eliminarVenta(id)}
        />

        {/* Cierre del día */}
        {cierreHoy && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-md border border-white/40 bg-white/70 backdrop-blur mt-4">
              <CardHeader>
                <CardTitle>Cierre de hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="font-medium">
                    Ventas: {cierreHoy?.cantidadVentas || 0}
                  </div>
                  <div className="font-medium">
                    Total: ${formatMoney(cierreHoy?.total || 0)}
                  </div>
                </div>

                <h3 className="mt-3 font-semibold">Detalle de ventas</h3>
                <table className="w-full text-sm mt-2">
                  <thead>
                    <tr>
                      <th className="p-2 text-left">Hora</th>
                      <th className="p-2 text-left">Método</th>
                      <th className="p-2 text-left">Total</th>
                      <th className="p-2 text-left">Productos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(cierreHoy?.ventas || []).map((v) => (
                      <tr key={v.idVenta} className="border-t">
                        <td className="p-2">
                          {new Date(v.hora).toLocaleTimeString()}
                        </td>
                        <td className="p-2 capitalize">{v.metodo}</td>
                        <td className="p-2">${formatMoney(v.total)}</td>
                        <td className="p-2">
                          {(v.productos || []).map((p) => (
                            <div key={p.id}>
                              {p.cantidad}x {p.nombre} - $
                              {formatMoney(p.precio)}
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Modales */}
        <MovimientoFormModal
          open={modalMov}
          initialData={editing || null}
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
            if (abrirCaja) await abrirCaja(montos);
            setModalApertura(false);
          }}
        />

        <CierreModal
          open={modalCierre}
          onClose={() => setModalCierre(false)}
          resumen={resumen || {}}
          onConfirm={async (montos) => {
            if (cerrarCaja) await cerrarCaja(montos);
            setModalCierre(false);
          }}
        />

        <VentaFormModal
          open={modalVenta}
          initialData={editingVenta}
          onClose={() => {
            setModalVenta(false);
            setEditingVenta(null);
          }}
          onSave={(datos) => editarVenta(editingVenta._id, datos)}
        />
      </div>
    </TooltipProvider>
  );
}
