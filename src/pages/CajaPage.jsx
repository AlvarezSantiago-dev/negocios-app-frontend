// Redesigned CajaPage Component
// (All logic preserved, only visual/layout changes)

import { AperturaModal } from "@/components/AperturaModal";
import { CierreModal } from "@/components/CierreModal";
import { useEffect, useState } from "react";
import MovimientoFormModal from "../components/MovimientoFormModal";
import MovimientosTable from "../components/MovimientosTable";
import VentaFormModal from "../components/VentaFormModal";
import VentasTable from "../components/VentasTable";
import useCajaStore from "../store/useCajaStore";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { motion } from "framer-motion";
import { DollarSign, Info, RefreshCcw, Smartphone, Wallet } from "lucide-react";
import { formatMoney } from "../services/dashboardService";

function KPIBox({ label, value, icon, color, tooltip }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="rounded-2xl shadow-lg border border-gray-200 bg-white/95 backdrop-blur-md hover:shadow-xl transition-all">
        <CardContent className="p-5">
          <div className="flex justify-between items-center text-gray-700">
            <div className="flex items-center gap-2 font-semibold text-sm">
              {icon}
              {label}
              {tooltip && (
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>{tooltip}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <span className="text-2xl font-extrabold" style={{ color }}>
              {value}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function CajaPage() {
  const {
    ventasTodas = [],
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
    if (fetchCierreData) fetchCierreData();
    if (fetchVentas) fetchVentas();
  }, [fetchCaja, fetchCierreData]);

  const saveMovimiento = (data) => {
    if (!data) return;
    if (editing && editarMovimiento) editarMovimiento(editing._id, data);
    else if (crearMovimiento) crearMovimiento(data);
    setEditing(null);
  };

  return (
    <TooltipProvider>
      <div className="p-8 space-y-10 bg-gray-50 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
            Caja
          </h2>
          <Button
            variant="outline"
            onClick={() => fetchCaja && fetchCaja()}
            className="flex gap-2 items-center"
          >
            <RefreshCcw className="w-4 h-4" /> Actualizar
          </Button>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPIBox
            label="Total Caja"
            value={`$${formatMoney(resumen?.total || 0)}`}
            icon={<Wallet className="w-5 h-5 opacity-70" />}
            color="#0f172a"
            tooltip="Suma de todos los métodos de ingreso."
          />
          <KPIBox
            label="Efectivo"
            value={`$${formatMoney(resumen?.efectivo || 0)}`}
            icon={<DollarSign className="w-5 h-5 opacity-70" />}
            color="#065f46"
            tooltip="Dinero físico en caja."
          />
          <KPIBox
            label="Mercado Pago"
            value={`$${formatMoney(resumen?.mp || 0)}`}
            icon={<Smartphone className="w-5 h-5 opacity-70" />}
            color="#0369a1"
            tooltip="Ingresos a través de Mercado Pago."
          />
          <KPIBox
            label="Transferencia"
            value={`$${formatMoney(resumen?.transferencia || 0)}`}
            icon={<Smartphone className="w-5 h-5 opacity-70" />}
            color="#854d0e"
            tooltip="Ingresos por transferencias bancarias."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
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
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <Card className="shadow-md border border-gray-200 bg-white rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Movimientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MovimientosTable
                data={allmovimientos || []}
                cajaAbierta={resumen?.abierta}
                onEdit={(m) => {
                  setEditing(m);
                  setModalMov(true);
                }}
                onDelete={(id) => eliminarMovimiento?.(id)}
              />
            </CardContent>
          </Card>

          <Card className="shadow-md border border-gray-200 bg-white rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <VentasTable
                data={ventasTodas || []}
                onEdit={(v) => {
                  setEditingVenta(v);
                  setModalVenta(true);
                }}
                onDelete={(id) => eliminarVenta(id)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Cierre */}
        {cierreHoy && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="shadow-lg border border-gray-200 bg-white/90 backdrop-blur-md rounded-2xl mt-8">
              <CardHeader>
                <CardTitle>Cierre de hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
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

        {/* Modals */}
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
          onSave={(datos) => {
            if (!editingVenta?._id) return;
            editarVenta(editingVenta._id, datos);
          }}
        />
      </div>
    </TooltipProvider>
  );
}
