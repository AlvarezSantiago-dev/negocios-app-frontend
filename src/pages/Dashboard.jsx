import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useCajaStore from "../store/useCajaStore";
import BienvenidaDashboard from "@/components/dashboard/BienvenidaDashboard";
import MetricCard from "@/components/dashboard/MetricCard";
import CajaResumenCard from "@/components/dashboard/CajaResumenCard";
import MovimientosCard from "@/components/dashboard/MovimientosCard";
import StockAlertCard from "@/components/dashboard/StockAlertCard";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { formatMoney } from "../services/dashboardService";
import {
  fetchVentasHoy,
  fetchGanancias,
  fetchStockCritico,
} from "../services/dashboardService";
import { hoyArg } from "../utils/fecha.js";
import useAuthStore from "@/store/authStore";

export default function Dashboard() {
  const businessType = useAuthStore((s) => s.business?.businessType);
  const isApparel = businessType === "apparel";

  const { resumen, movimientos, fetchCaja } = useCajaStore();
  const [ganHoy, setGanHoy] = useState(0);
  const [stockCritico, setStockCritico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ventasHoy, setVentasHoy] = useState([]);
  const [totalHoy, setTotalHoy] = useState(0);
  const [cantHoy, setCantHoy] = useState(0);

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    setLoading(true);
    const fechaISO = hoyArg();

    try {
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

      await fetchCaja();
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Cargando dashboard...
          </p>
        </div>
      </div>
    );
  }

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

  const hayStockBajo = stockCritico.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER CON BIENVENIDA */}
        <BienvenidaDashboard fechaActual={fechaActual} />

        {/* BOTÓN ACTUALIZAR */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={cargarDashboard}
          disabled={loading}
          className="flex items-center gap-2 ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </motion.button>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Vendido Hoy"
            value={`$${formatMoney(totalHoy)}`}
            subtitle={`${cantHoy} ventas realizadas`}
            icon={DollarSign}
            color="blue"
          />
          <MetricCard
            title="Ganancia Neta"
            value={`$${formatMoney(gananciaNeta)}`}
            subtitle={`Egresos: $${formatMoney(totalEgresos)}`}
            icon={TrendingUp}
            color="green"
          />
          <MetricCard
            title="Ventas Realizadas"
            value={cantHoy}
            subtitle="Transacciones del día"
            icon={ShoppingCart}
            color="purple"
          />
          <MetricCard
            title="Stock Crítico"
            value={stockCritico.length}
            subtitle={
              isApparel
                ? "Prendas requieren atención"
                : "Productos requieren atención"
            }
            icon={AlertTriangle}
            color={stockCritico.length > 0 ? "red" : "green"}
            badge={stockCritico.length > 0 ? "⚠️ Atención" : "✓ OK"}
          />
        </div>

        {/* ALERTA DE STOCK */}
        {hayStockBajo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 shadow-md"
          >
            <div className="p-2 rounded-full bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="font-bold text-red-900">
                ¡Atención! Stock crítico detectado
              </p>
              <p className="text-sm text-red-700">
                Hay {stockCritico.length} {isApparel ? "prendas" : "productos"}{" "}
                que requieren reposición inmediata
              </p>
            </div>
          </motion.div>
        )}

        {/* CONTENIDO PRINCIPAL - GRID 2 COLUMNAS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* COLUMNA IZQUIERDA - 2/3 */}
          <div className="xl:col-span-2 space-y-8">
            <MovimientosCard movimientos={movimientos} />
            <StockAlertCard productos={stockCritico} />
          </div>

          {/* COLUMNA DERECHA - 1/3 */}
          <div className="space-y-8">
            <CajaResumenCard resumen={resumen} />
            <QuickActionsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
