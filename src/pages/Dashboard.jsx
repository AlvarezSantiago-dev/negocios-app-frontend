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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* HEADER */}
      <BienvenidaDashboard fechaActual={fechaActual} />

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPI
          title="Vendido hoy"
          icon={<DollarSign />}
          value={`$${formatMoney(totalHoy)}`}
        />
        <KPI
          title="Ganancia neta"
          icon={<TrendingUp />}
          value={`$${formatMoney(gananciaNeta)}`}
        />
        <KPI
          title="Ventas realizadas"
          icon={<ShoppingCart />}
          value={cantHoy}
        />
        <KPI
          title="Stock crítico"
          icon={<BarChart2 />}
          value={stockCritico.length}
        />
      </section>

      {/* ALERTA */}
      {hayStockBajo && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-red-700 shadow-sm">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">
            Atención: hay productos con stock crítico.
          </span>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <MovimientosTable data={movimientos} />
          <StockCriticoCard productos={stockCritico} />
        </div>

        <div className="space-y-8">
          <ResumenCaja resumen={resumen} />
          <AccesosRapidos />
        </div>
      </section>
    </div>
  );
}

function KPI({ title, icon, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-slate-200"
    >
      <div className="flex items-center justify-between text-slate-500 text-sm">
        <span>{title}</span>
        <div className="text-slate-400">{icon}</div>
      </div>
      <div className="mt-3 text-3xl font-bold text-slate-800">{value}</div>
    </motion.div>
  );
}

function CajaItem({ label, value, highlight }) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        highlight
          ? "bg-blue-50 border-blue-200 text-blue-700"
          : "bg-slate-50 border-slate-200"
      }`}
    >
      <p className="text-xs uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold">${formatMoney(value)}</p>
    </div>
  );
}

function ResumenCaja({ resumen }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-md border border-slate-200"
    >
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Wallet className="w-5 h-5" /> Resumen de caja
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <CajaItem label="Efectivo" value={resumen?.efectivo} />
        <CajaItem label="MercadoPago" value={resumen?.mp} />
        <CajaItem label="Transferencia" value={resumen?.transferencia} />
        <CajaItem label="Total" value={resumen?.total} highlight />
      </div>
    </motion.div>
  );
}
