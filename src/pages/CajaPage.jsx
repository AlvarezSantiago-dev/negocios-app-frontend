import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Wallet,
  Smartphone,
  CreditCard,
  RefreshCw,
  Plus,
  XCircle,
  CheckCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import useCajaStore from "../store/useCajaStore";
import { AperturaModal } from "@/components/AperturaModal";
import { CierreModal } from "@/components/CierreModal";
import MovimientoFormModal from "../components/MovimientoFormModal";
import MovimientosTable from "../components/MovimientosTable";
import VentaFormModal from "../components/VentaFormModal";
import VentasTable from "../components/VentasTable";
import { formatMoney } from "../services/dashboardService";

// Componente de Métrica Moderna
function MetricCardCaja({ label, value, icon: Icon, color, subtitle }) {
  const colors = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
    },
    green: {
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50",
      icon: "bg-green-100 text-green-600",
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      icon: "bg-purple-100 text-purple-600",
    },
    orange: {
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      icon: "bg-orange-100 text-orange-600",
    },
  };

  const scheme = colors[color] || colors.blue;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className={`h-1.5 bg-gradient-to-r ${scheme.gradient}`} />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${scheme.icon}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Componente de Botón de Acción
function ActionButton({
  onClick,
  disabled,
  variant = "primary",
  children,
  icon: Icon,
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
    danger:
      "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white",
    success:
      "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
}

export default function CajaPage() {
  const {
    ventasTodas = [],
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
  }, [fetchCaja, fetchCierreData, fetchVentas]);

  const saveMovimiento = (data) => {
    if (!data) return;
    if (editing && editarMovimiento) editarMovimiento(editing._id, data);
    else if (crearMovimiento) crearMovimiento(data);
    setEditing(null);
  };

  const handleApertura = async (montos) => {
    if (abrirCaja) await abrirCaja(montos);
    setModalApertura(false);
  };

  const handleCierre = async (montos) => {
    if (cerrarCaja) await cerrarCaja(montos);
    setModalCierre(false);
  };

  // Calcular totales de movimientos
  const totalIngresos = allmovimientos
    .filter((m) => m.tipo === "ingreso")
    .reduce((acc, m) => acc + (m.monto || 0), 0);

  const totalEgresos = allmovimientos
    .filter((m) => m.tipo === "egreso")
    .reduce((acc, m) => acc + (m.monto || 0), 0);

  if (loading && !resumen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Cargando caja...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              💰 Gestión de Caja
            </h1>
            <p className="text-gray-600">
              Administra los ingresos y egresos de tu negocio
            </p>
          </div>

          <ActionButton
            onClick={() => fetchCaja && fetchCaja()}
            icon={RefreshCw}
            variant="primary"
          >
            Actualizar
          </ActionButton>
        </motion.div>

        {/* ESTADO DE CAJA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl shadow-lg border-l-4 ${
            resumen?.abierta
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-500"
              : "bg-gradient-to-r from-red-50 to-orange-50 border-red-500"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {resumen?.abierta ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Estado de Caja
                </p>
                <p
                  className={`text-2xl font-bold ${
                    resumen?.abierta ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {resumen?.abierta ? "Caja Abierta" : "Caja Cerrada"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <ActionButton
                onClick={() => setModalApertura(true)}
                disabled={resumen?.aperturaHoy || loading}
                variant="success"
                icon={CheckCircle}
              >
                Abrir Caja
              </ActionButton>

              <ActionButton
                onClick={() => setModalCierre(true)}
                disabled={
                  !resumen?.abierta ||
                  resumen?.cierreHoy ||
                  loadingCierre ||
                  cerrando
                }
                variant="danger"
                icon={XCircle}
              >
                {loadingCierre || cerrando ? "Cerrando..." : "Cerrar Caja"}
              </ActionButton>

              <ActionButton
                onClick={() => {
                  if (!resumen?.abierta) return;
                  setEditing(null);
                  setModalMov(true);
                }}
                disabled={!resumen?.abierta}
                variant="primary"
                icon={Plus}
              >
                Nuevo Movimiento
              </ActionButton>
            </div>
          </div>
        </motion.div>

        {/* MÉTRICAS KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCardCaja
            label="Total en Caja"
            value={`$${formatMoney(resumen?.total || 0)}`}
            icon={Wallet}
            color="blue"
            subtitle="Suma de todos los métodos"
          />
          <MetricCardCaja
            label="Efectivo"
            value={`$${formatMoney(resumen?.efectivo || 0)}`}
            icon={DollarSign}
            color="green"
            subtitle="Dinero físico"
          />
          <MetricCardCaja
            label="MercadoPago"
            value={`$${formatMoney(resumen?.mp || 0)}${
              Number(resumen?.mpPendiente || 0) > 0
                ? ` ($${formatMoney(resumen?.mpPendiente || 0)} pendiente)`
                : ""
            }`}
            icon={Smartphone}
            color="purple"
            subtitle="Pagos digitales"
          />
          <MetricCardCaja
            label="Transferencias"
            value={`$${formatMoney(resumen?.transferencia || 0)}`}
            icon={CreditCard}
            color="orange"
            subtitle="Transferencias bancarias"
          />
        </div>

        {/* RESUMEN DE MOVIMIENTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Ingresos
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${formatMoney(totalIngresos)}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {allmovimientos.filter((m) => m.tipo === "ingreso").length}{" "}
              movimientos
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-100">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Egresos
                </p>
                <p className="text-2xl font-bold text-red-600">
                  ${formatMoney(totalEgresos)}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {allmovimientos.filter((m) => m.tipo === "egreso").length}{" "}
              movimientos
            </p>
          </motion.div>
        </div>

        {/* TABLA DE MOVIMIENTOS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">
              📊 Movimientos de Caja
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Registro de todos los ingresos y egresos
            </p>
          </div>
          <div className="p-6">
            <MovimientosTable
              data={allmovimientos}
              cajaAbierta={resumen?.abierta}
              onEdit={(mov) => {
                setEditing(mov);
                setModalMov(true);
              }}
              onDelete={eliminarMovimiento}
            />
          </div>
        </motion.div>

        {/* TABLA DE VENTAS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">
              🛒 Ventas del Día
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Registro de todas las ventas realizadas
            </p>
          </div>
          <div className="p-6">
            <VentasTable
              data={ventasTodas}
              cajaAbierta={resumen?.abierta}
              onEdit={(venta) => {
                setEditingVenta(venta);
                setModalVenta(true);
              }}
              onDelete={eliminarVenta}
            />
          </div>
        </motion.div>

        {/* MODALES */}
        {modalApertura && (
          <AperturaModal
            open={modalApertura}
            onClose={() => setModalApertura(false)}
            onConfirm={handleApertura}
          />
        )}

        {modalCierre && (
          <CierreModal
            open={modalCierre}
            onClose={() => setModalCierre(false)}
            onConfirm={handleCierre}
            resumen={resumen}
          />
        )}

        {modalMov && (
          <MovimientoFormModal
            open={modalMov}
            onClose={() => {
              setModalMov(false);
              setEditing(null);
            }}
            onSave={saveMovimiento}
            initialData={editing}
            cajaAbierta={resumen?.abierta}
          />
        )}

        {modalVenta && (
          <VentaFormModal
            open={modalVenta}
            onClose={() => {
              setModalVenta(false);
              setEditingVenta(null);
            }}
            onSave={(data) => {
              if (editingVenta) editarVenta(editingVenta._id, data);
              setEditingVenta(null);
            }}
            initialData={editingVenta}
          />
        )}
      </div>
    </div>
  );
}
