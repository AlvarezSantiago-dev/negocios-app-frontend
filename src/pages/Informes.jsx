import React, { useEffect, useState } from "react";
import {
  fetchVentasDiarias,
  fetchVentasMensuales,
  fetchGanancias,
  fetchUltimos7Dias,
} from "@/services/informesService";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  CalendarDays,
  TrendingUp,
  DollarSign,
  LineChart as LineChartIcon,
} from "lucide-react";

export default function Informes() {
  const hoy = new Date().toISOString().substring(0, 10);
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  const [tab, setTab] = useState("diarias");
  const [diarias, setDiarias] = useState([]);
  const [mensuales, setMensuales] = useState([]);
  const [ganancias, setGananciasState] = useState({});
  const [ultimos7, setUltimos7] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setLoading(true);

    const [d, m, g, u7] = await Promise.all([
      fetchVentasDiarias(hoy),
      fetchVentasMensuales(year, month),
      fetchGanancias(year, month),
      fetchUltimos7Dias(),
    ]);

    setDiarias(d);
    setMensuales(m);
    setGananciasState(g);
    setUltimos7(u7);

    setLoading(false);
  }

  if (loading)
    return (
      <p className="p-6 animate-pulse text-gray-600">Cargando informes...</p>
    );

  return (
    <div className="p-6 space-y-10 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Titulo */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold flex items-center gap-3"
      >
        <LineChartIcon /> Informes y Reportes
      </motion.h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPI
          icon={<CalendarDays />}
          label="Ventas del Día"
          value={`$${diarias.totalVendido ?? 0}`}
        />
        <KPI
          icon={<TrendingUp />}
          label="Ganancia del Día"
          value={`$${diarias.gananciaTotal ?? 0}`}
        />
        <KPI
          icon={<DollarSign />}
          label="Ganancia Mensual"
          value={`$${ganancias.totalGanado ?? 0}`}
        />
      </div>

      {/* Últimos 7 días */}
      <Card title="Últimos 7 días">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={ultimos7}>
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="totalVendido" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-gray-300 pb-2">
        {["diarias", "mensuales", "ganancias"].map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-md ${
              tab === t
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-gray-700 border"
            }`}
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TAB - DIARIAS */}
      {tab === "diarias" && (
        <Card title="Ventas Diarias">
          <Table
            headers={["Hora", "Cant.", "Total", "Método"]}
            rows={(diarias.ventas ?? []).map((v) => [
              new Date(v.fecha).toLocaleTimeString("es-AR"),
              v.items?.length ?? 1,
              `$${v.totalVenta ?? 0}`,
              v.metodoPago ?? "Efectivo",
            ])}
          />
        </Card>
      )}

      {/* TAB - MENSUALES */}
      {tab === "mensuales" && (
        <Card title="Ventas Mensuales">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={mensuales}>
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalDia" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* TAB - GANANCIAS */}
      {tab === "ganancias" && (
        <Card title="Ganancias por Producto">
          <Table
            headers={["Producto", "Cantidad", "Unit.", "Total"]}
            rows={(ganancias.detalles ?? []).map((g) => [
              g.nombre,
              g.cantidadVendida,
              `$${g.gananciaUnitaria}`,
              `$${g.gananciaTotal}`,
            ])}
          />
        </Card>
      )}

      {/* Botón actualizar */}
      <button
        onClick={cargar}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow"
      >
        🔄 Actualizar Informes
      </button>
    </div>
  );
}

function KPI({ icon, label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow p-5 border border-gray-100"
    >
      <div className="flex items-center gap-2 text-gray-500">
        {icon} {label}
      </div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </motion.div>
  );
}

function Card({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow border border-gray-100 space-y-4"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </motion.div>
  );
}

function Table({ headers, rows }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100 text-left text-gray-600">
          {headers.map((h, i) => (
            <th key={i} className="p-2 border-b">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {r.map((cell, j) => (
                <td key={j} className="p-2 border-b text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={headers.length}
              className="p-3 text-center text-gray-500"
            >
              No hay datos...
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
