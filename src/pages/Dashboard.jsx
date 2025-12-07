// src/pages/Dashboard.jsx
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  BarChart2,
  Wallet,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import useCajaStore from "../store/useCajaStore";
import BienvenidaDashboard from "@/components/dashboard/BienvenidaDashboard";
import MovimientosTable from "../components/dashboard/MovimientosTable";
import AccesosRapidos from "../components/dashboard/AccesosRapidos";
import StockCriticoCard from "@/components/dashboard/StockCriticoCard";
import { formatMoney } from "../services/dashboardService";
import {
  fetchVentasHoy,
  fetchGanancias,
  fetchStockCritico,
} from "../services/dashboardService";
import { hoyArg } from "../utils/fecha.js";

export default function Dashboard() {
  const { resumen, movimientos, fetchCaja, loading, loadingCierre, cerrando } =
    useCajaStore();
  const [ventasHoy, setVentasHoy] = useState([]);
  const [ganHoy, setGanHoy] = useState(0);
  const [stockCritico, setStockCritico] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // 🔹 Cargar todos los datos al montar el dashboard
  useEffect(() => {
    const cargarDashboard = async () => {
      setLoadingDashboard(true);
      const fechaISO = hoyArg();

      try {
        const [ventas, ganancias, stock] = await Promise.all([
          fetchVentasHoy(fechaISO),
          fetchGanancias(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            new Date().getDate()
          ),
          fetchStockCritico(),
        ]);

        setVentasHoy(ventas);
        setGanHoy(ganancias.totalGanado ?? 0);
        setStockCritico(stock);

        if (fetchCaja) await fetchCaja(); // sincroniza caja y movimientos
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        setLoadingDashboard(false);
      }
    };

    cargarDashboard();
  }, [fetchCaja]);

  if (loadingDashboard) return <p className="p-6">Cargando...</p>;

  const totalHoy = ventasHoy.reduce((acc, v) => acc + (v.totalVenta ?? 0), 0);
  const cantHoy = ventasHoy.length;
  const fechaActual = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const hayStockBajo = stockCritico.some((p) => p.stock <= p.stockMinimo);

  // 🔹 Estado de caja dinámico
  const estadoCaja = useMemo(() => {
    if (resumen?.abierta)
      return { color: "green", texto: "Abierta ✅", boton: "Cerrar Caja" };

    if (resumen?.aperturaHoy && resumen?.cierreHoy)
      return { color: "red", texto: "Cerrada ✅ (cerrada hoy)", boton: null };

    if (!resumen?.abierta && resumen?.aperturaHoy && !resumen?.cierreHoy)
      return {
        color: "yellow",
        texto: "Cerrada ⚠ (pendiente cierre)",
        boton: "Cerrar Caja",
      };

    return { color: "blue", texto: "Cerrada ❌", boton: "Abrir Caja" };
  }, [resumen]);

  const { color, texto, boton } = estadoCaja;

  return (
    <div className="p-6 space-y-10 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      {/* Bienvenida */}
      <BienvenidaDashboard fechaActual={fechaActual} />

      {/* KPIs principales */}
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

      {/* Resumen de caja */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
      >
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Wallet /> Resumen de caja
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <CajaItem label="Efectivo" value={resumen?.efectivo} />
          <CajaItem label="MercadoPago" value={resumen?.mp} />
          <CajaItem label="Transferencia" value={resumen?.transferencia} />
          <CajaItem label="Total Caja" value={resumen?.total} />
        </div>

        {boton && (
          <div className="mt-4">
            <button
              onClick={() =>
                boton === "Abrir Caja" ? fetchCaja?.() : fetchCaja?.()
              }
              disabled={loading || loadingCierre || cerrando}
              className={`px-6 py-2 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 ${
                boton === "Abrir Caja"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loadingCierre || cerrando ? "Cerrando..." : boton}
            </button>
          </div>
        )}

        <p className="mt-2 font-medium text-gray-700">Estado: {texto}</p>
      </motion.div>

      {/* Movimientos y accesos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MovimientosTable data={movimientos} />
        </div>
        <div>
          <AccesosRapidos />
        </div>
      </div>

      {/* Stock crítico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StockCriticoCard productos={stockCritico} />
        </div>
      </div>
    </div>
  );
}

// ----------------- Componentes auxiliares -----------------
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
