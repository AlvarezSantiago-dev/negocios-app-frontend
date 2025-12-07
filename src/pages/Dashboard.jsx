import { useEffect } from "react";
import { motion } from "framer-motion";
import useDashboardStore from "../store/useDashboardStore";
import BienvenidaDashboard from "@/components/dashboard/BienvenidaDashboard";
import MovimientosTable from "../components/dashboard/MovimientosTable";
import AccesosRapidos from "../components/dashboard/AccesosRapidos";
import StockCriticoCard from "@/components/dashboard/StockCriticoCard";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  BarChart2,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { formatMoney } from "../services/dashboardService";

export default function Dashboard() {
  const {
    ventasHoy,
    ganHoy,
    stockCritico,
    caja,
    movimientos,
    loading,
    fetchDashboard,
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <p className="p-6">Cargando...</p>;

  const totalHoy = ventasHoy.reduce((acc, v) => acc + (v.totalVenta ?? 0), 0);
  const cantHoy = ventasHoy.length;
  const fechaActual = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const hayStockBajo = stockCritico.some((p) => p.stock <= p.stockMinimo);

  return (
    <div className="p-6 space-y-10 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <motion.div>
        <BienvenidaDashboard fechaActual={fechaActual} />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI
          title="Vendido hoy"
          icon={<DollarSign size={18} />}
          value={`$${formatMoney(totalHoy)}`}
        />
        <KPI
          title="Ganancia hoy"
          icon={<TrendingUp size={18} />}
          value={`$${formatMoney(ganHoy)}`}
        />
        <KPI
          title="Ventas hoy"
          icon={<ShoppingCart size={18} />}
          value={cantHoy}
        />
        <KPI
          title="Stock crítico"
          icon={<BarChart2 size={18} />}
          value={stockCritico.length}
        />
      </div>

      {hayStockBajo && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-xl flex items-center gap-3 shadow-md">
          <AlertTriangle /> Hay productos con stock bajo
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
      >
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Wallet /> Resumen de caja
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <CajaItem label="Efectivo" value={caja.efectivo} />
          <CajaItem label="MercadoPago" value={caja.mp} />
          <CajaItem label="Transferencia" value={caja.transferencia} />
          <CajaItem label="Total Caja" value={caja.total} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MovimientosTable data={movimientos} />
        </div>
        <div>
          <AccesosRapidos />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StockCriticoCard productos={stockCritico} />
        </div>
      </div>
    </div>
  );
}

function KPI({ title, icon, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
    >
      <span className="text-gray-500 flex items-center gap-2 text-sm">
        {icon} {title}
      </span>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </motion.div>
  );
}

function CajaItem({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold">${formatMoney(value)}</p>
    </div>
  );
}
