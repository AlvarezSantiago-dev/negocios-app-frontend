import React, { useEffect, useState } from "react";
import {
  fetchVentasDiarias,
  fetchVentasMensuales,
  fetchGanancias,
  fetchUltimos7Dias,
} from "@/services/informesService";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingCart,
  BarChart3,
  PieChart,
  RefreshCw,
  Loader2,
  Calendar,
  Award,
  AlertCircle,
} from "lucide-react";
import { hoyArg } from "@/utils/fecha";

// Componentes nuevos
import StatCard from "@/components/informes/StatCard";
import ColorfulBarChart from "@/components/informes/ColorfulBarChart";
import TrendChart from "@/components/informes/TrendChart";
import DataTable from "@/components/informes/DataTable";
import DateRangeSelector from "@/components/informes/DateRangeSelector";
import useAuthStore from "@/store/authStore";

export default function Informes() {
  const businessType = useAuthStore((s) => s.business?.businessType);
  const isApparel = businessType === "apparel";

  // Argentina está en UTC-3 (sin DST)
  const ARGENTINA_OFFSET_MIN = -3 * 60;

  const toFechaArgYYYYMMDD = (dateLike) => {
    const d = new Date(dateLike);
    if (Number.isNaN(d.getTime())) return null;
    const utcTime = d.getTime() + d.getTimezoneOffset() * 60000;
    const argTime = new Date(utcTime + ARGENTINA_OFFSET_MIN * 60000);

    const year = argTime.getUTCFullYear();
    const month = String(argTime.getUTCMonth() + 1).padStart(2, "0");
    const day = String(argTime.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const aggregateVentasPorDia = (ventas = []) => {
    const map = new Map();

    for (const v of Array.isArray(ventas) ? ventas : []) {
      const fecha = toFechaArgYYYYMMDD(v?.fecha);
      if (!fecha) continue;

      const totalVenta = Number(v?.totalVenta ?? v?.totalVendido ?? 0);
      const gananciaBruta = Number(v?.gananciaTotal ?? v?.ganancia ?? 0);
      const feeTarjeta = Number(v?.tarjetaFeeMonto ?? 0);
      const ganancia =
        gananciaBruta - (Number.isFinite(feeTarjeta) ? feeTarjeta : 0);

      const prev = map.get(fecha) ?? {
        fecha,
        totalVendido: 0,
        ganancia: 0,
        cantidadVentas: 0,
      };

      prev.totalVendido += Number.isFinite(totalVenta) ? totalVenta : 0;
      prev.ganancia += Number.isFinite(ganancia) ? ganancia : 0;
      prev.cantidadVentas += 1;

      map.set(fecha, prev);
    }

    return Array.from(map.values()).sort((a, b) =>
      a.fecha.localeCompare(b.fecha)
    );
  };

  const rangeDiasMes = ({ year, month, startDay, endDay, dailyMap }) => {
    const mm = String(month).padStart(2, "0");
    const out = [];

    for (let d = startDay; d <= endDay; d += 1) {
      const dd = String(d).padStart(2, "0");
      const fecha = `${year}-${mm}-${dd}`;
      out.push(
        dailyMap.get(fecha) ?? {
          fecha,
          totalVendido: 0,
          ganancia: 0,
          cantidadVentas: 0,
        }
      );
    }

    return out;
  };

  const lastNDays = (endYYYYMMDD, n, dailyMap) => {
    // Usamos el mediodía AR para evitar edge-cases de timezone.
    const end = new Date(`${endYYYYMMDD}T12:00:00-03:00`);
    const out = [];

    for (let i = n - 1; i >= 0; i -= 1) {
      const d = new Date(end);
      d.setUTCDate(d.getUTCDate() - i);
      const fecha = toFechaArgYYYYMMDD(d);
      if (!fecha) continue;
      out.push(
        dailyMap.get(fecha) ?? {
          fecha,
          totalVendido: 0,
          ganancia: 0,
          cantidadVentas: 0,
        }
      );
    }

    return out;
  };

  const hoy = hoyArg(); // Usar fecha Argentina
  const [selectedDate, setSelectedDate] = useState(hoy);
  const [tab, setTab] = useState("general");
  const [diarias, setDiarias] = useState([]);
  const [mensuales, setMensuales] = useState([]);
  const [ganancias, setGananciasState] = useState({});
  const [ultimos7, setUltimos7] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargar();
  }, [selectedDate]);

  async function cargar() {
    setLoading(true);

    // Extraer year, month, day de la fecha seleccionada
    const [year, month, day] = selectedDate.split("-").map(Number);

    try {
      const [d, m, g, u7] = await Promise.all([
        fetchVentasDiarias(selectedDate),
        fetchVentasMensuales(year, month),
        fetchGanancias(year, month, day), // ✅ Pasar el día también
        fetchUltimos7Dias(),
      ]);

      // Los endpoints /mensuales y /ultimos-7-dias devuelven ventas crudas.
      // Para los gráficos, agregamos por día (Argentina) y rellenamos faltantes.
      const mensualesAgg = aggregateVentasPorDia(m);
      const mensualesMap = new Map(mensualesAgg.map((x) => [x.fecha, x]));
      const startDay = Math.max(1, day - 14);
      const mensualesLast15 = rangeDiasMes({
        year,
        month,
        startDay,
        endDay: day,
        dailyMap: mensualesMap,
      });

      const u7Agg = aggregateVentasPorDia(u7);
      const u7Map = new Map(u7Agg.map((x) => [x.fecha, x]));
      const ultimos7Fill = lastNDays(hoy, 7, u7Map);

      if (import.meta.env.DEV) {
        console.log("📊 Datos recibidos (raw):", { d, m, g, u7 });
        console.log("📈 Datos gráficos (normalizados):", {
          ultimos7: ultimos7Fill,
          mensuales: mensualesLast15,
        });
      }

      setDiarias(d);
      setMensuales(mensualesLast15);
      setGananciasState(g);
      setUltimos7(ultimos7Fill);
    } catch (error) {
      console.error("❌ Error cargando informes:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Cargando informes...
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "📊 General", icon: BarChart3 },
    { id: "ventas", label: "🛒 Ventas", icon: ShoppingCart },
    {
      id: "productos",
      label: isApparel ? "👕 Variantes" : "📦 Productos",
      icon: Package,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📈 Informes y Análisis
            </h1>
            <p className="text-gray-600">
              Panel de métricas y estadísticas de tu negocio
            </p>
          </div>
          <button
            onClick={cargar}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </motion.div>

        {/* Selector de Fecha */}
        <DateRangeSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(() => {
            const feeDia = (diarias.ventas ?? []).reduce(
              (acc, v) => acc + Number(v?.tarjetaFeeMonto ?? 0),
              0
            );
            const gananciaNetaDia =
              Number(diarias.gananciaTotal ?? 0) - Number(feeDia ?? 0);
            const totalVendidoDia = Number(diarias.totalVendido ?? 0);
            const margenPct = totalVendidoDia
              ? ((gananciaNetaDia / totalVendidoDia) * 100).toFixed(1)
              : "0.0";

            // dejamos accesible para el JSX siguiente sin recalcular
            diarias._feeTarjeta = feeDia;
            diarias._gananciaNeta = gananciaNetaDia;
            diarias._margenPct = margenPct;
            return null;
          })()}
          <StatCard
            title="Ventas del Día"
            value={`$${(diarias.totalVendido ?? 0).toLocaleString()}`}
            subtitle={`${(diarias.ventas ?? []).length} transacciones`}
            icon={DollarSign}
            color="blue"
          />
          <StatCard
            title="Ganancia del Día"
            value={`$${Number(diarias._gananciaNeta ?? 0).toLocaleString()}`}
            subtitle={`Neta (margen ${diarias._margenPct ?? "0.0"}%)`}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Ganancia Mensual"
            value={`$${(
              ganancias.totalGanadoNeto ??
              Number(ganancias.totalGanado ?? 0) -
                Number(ganancias.totalComisionTarjeta ?? 0)
            ).toLocaleString()}`}
            subtitle={`${ganancias.totalProductos ?? 0} ${
              isApparel ? "variantes" : "productos"
            } vendidos`}
            icon={Package}
            color="purple"
          />
          <StatCard
            title="Productos Vendidos"
            value={(ganancias.detalles ?? []).length}
            subtitle={
              isApparel ? "Variantes diferentes" : "Productos diferentes"
            }
            icon={ShoppingCart}
            color="orange"
          />
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                tab === t.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow"
              }`}
            >
              <t.icon className="w-5 h-5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="space-y-6">
          {/* TAB: GENERAL */}
          {tab === "general" && (
            <>
              <TrendChart
                data={ultimos7}
                title="📅 Tendencia - Últimos 7 días"
                type="area"
              />

              <ColorfulBarChart
                data={mensuales}
                dataKey="totalVendido"
                title="📊 Ventas Mensuales (últimos 15 días)"
              />
            </>
          )}

          {/* TAB: VENTAS */}
          {tab === "ventas" && (
            <>
              {(diarias.ventas ?? []).length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center"
                >
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No hay ventas registradas
                  </h3>
                  <p className="text-gray-500">
                    No se encontraron ventas para el día {selectedDate}
                  </p>
                </motion.div>
              ) : (
                <DataTable
                  title={`🛒 Detalle de Ventas - ${selectedDate}`}
                  headers={[
                    "Hora",
                    "Cantidad Items",
                    "Total Venta",
                    "Método Pago",
                    "Ganancia",
                  ]}
                  data={diarias.ventas ?? []}
                  renderRow={(venta, idx) => (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {new Date(venta.fecha).toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {venta.items?.length ?? 0} items
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-green-600">
                        ${(venta.totalVenta ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            venta.metodoPago === "Efectivo"
                              ? "bg-green-100 text-green-800"
                              : venta.metodoPago === "Débito"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {venta.metodoPago ?? "Efectivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                        $
                        {(
                          Number(venta.gananciaTotal ?? 0) -
                          Number(venta.tarjetaFeeMonto ?? 0)
                        ).toFixed(0)}
                      </td>
                    </>
                  )}
                />
              )}
            </>
          )}

          {/* TAB: PRODUCTOS */}
          {tab === "productos" && (
            <>
              {(ganancias.detalles ?? []).length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center"
                >
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No hay datos de productos
                  </h3>
                  <p className="text-gray-500">
                    No se encontraron ventas de productos en el período
                    seleccionado
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Top 5 Productos más vendidos */}
                  <ColorfulBarChart
                    data={(ganancias.detalles ?? []).slice(0, 8).map((p) => ({
                      fecha: p.nombre,
                      totalDia: p.gananciaTotal,
                      label: p.nombre,
                    }))}
                    dataKey="totalDia"
                    title={
                      isApparel
                        ? "🏆 Top 8 Variantes por Ganancia"
                        : "🏆 Top 8 Productos por Ganancia"
                    }
                  />

                  {/* Tabla detallada de productos */}
                  <DataTable
                    title={
                      isApparel
                        ? "👕 Ganancias por Variante (Este Mes)"
                        : "📦 Ganancias por Producto (Este Mes)"
                    }
                    headers={[
                      isApparel ? "Variante" : "Producto",
                      "Cantidad Vendida",
                      "Ganancia Unitaria",
                      "Ganancia Total",
                      "% del Total",
                    ]}
                    data={ganancias.detalles ?? []}
                    renderRow={(producto, idx) => {
                      const porcentaje = (
                        (producto.gananciaTotal /
                          (ganancias.totalGanado || 1)) *
                        100
                      ).toFixed(1);
                      return (
                        <>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              {idx < 3 && (
                                <Award className="w-4 h-4 text-yellow-500" />
                              )}
                              {producto.nombre}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold">
                              {producto.cantidadVendida} unidades
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                            ${(producto.gananciaUnitaria ?? 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-green-600">
                            ${(producto.gananciaTotal ?? 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full"
                                  style={{ width: `${porcentaje}%` }}
                                />
                              </div>
                              <span className="text-gray-700 font-semibold text-xs">
                                {porcentaje}%
                              </span>
                            </div>
                          </td>
                        </>
                      );
                    }}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
