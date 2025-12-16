import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useCajaStore from "../store/useCajaStore";
import BienvenidaDashboard from "@/components/dashboard/BienvenidaDashboard";
import MovimientosTable from "../components/dashboard/MovimientosTable";
import AccesosRapidos from "@/components/dashboard/AccesosRapidos";
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
import {
  fetchVentasHoy,
  fetchGanancias,
  fetchStockCritico,
} from "../services/dashboardService";
import { hoyArg } from "../utils/fecha.js";

export default function Dashboard() {
  const { resumen, movimientos, fetchCaja } = useCajaStore();
  const [ganHoy, setGanHoy] = useState(0);
  const [stockCritico, setStockCritico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ventasHoy, setVentasHoy] = useState([]);
  const [totalHoy, setTotalHoy] = useState(0);
  const [cantHoy, setCantHoy] = useState(0);

  useEffect(() => {
    const cargarDashboard = async () => {
      setLoading(true);
      const fechaISO = hoyArg();

      const [ventasData, ganancias, stock] = await Promise.all([
        fetchVentasHoy(fechaISO),
        fetchGanancias(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate()
        ),
        fetchStockCritico(),
      ]);

      setVentasHoy(ventasData.ventas);
      setTotalHoy(ventasData.totalVendido);
      setCantHoy(ventasData.cantidadVentas);

      setGanHoy(ganancias.totalGanado ?? 0);
      setStockCritico(stock);

      await fetchCaja(); // sincroniza caja y movimientos
      setLoading(false);
    };
    cargarDashboard();
  }, []);

  if (loading) return <p className="p-6">Cargando...</p>;

  // Calcular egresos del día
  const totalEgresos = movimientos
    .filter((m) => m.tipo === "egreso")
    .reduce((acc, m) => acc + (m.monto ?? 0), 0);

  // Ganancia neta = ganancia bruta - egresos
  const gananciaNeta = ganHoy - totalEgresos;

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
          title="Ganancia neta"
          icon={<TrendingUp size={18} />}
          value={`$${formatMoney(gananciaNeta)}`}
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

      <motion.div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Wallet /> Resumen de caja
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <CajaItem label="Efectivo" value={resumen?.efectivo} />
          <CajaItem label="MercadoPago" value={resumen?.mp} />
          <CajaItem label="Transferencia" value={resumen?.transferencia} />
          <CajaItem label="Total Caja" value={resumen?.total} />
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
