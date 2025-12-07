// src/pages/TestDashboard.jsx
import { useEffect, useState } from "react";
import useDashboardStore from "../store/useDashboardStore";
import useCajaStore from "../store/useCajaStore";

export default function TestDashboard() {
  const dashboard = useDashboardStore();
  const cajaStore = useCajaStore();
  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState([]);

  const appendLog = (msg) => setLog((prev) => [...prev, msg]);

  useEffect(() => {
    const testFlow = async () => {
      try {
        appendLog("🔹 Iniciando test de Dashboard...");

        // 🔸 1. Traer Dashboard completo
        await dashboard.fetchDashboard();
        appendLog("✅ Dashboard cargado");
        appendLog(`Ventas hoy: ${JSON.stringify(dashboard.ventasHoy)}`);
        appendLog(`Ganancia hoy: ${dashboard.ganHoy}`);
        appendLog(`Stock crítico: ${JSON.stringify(dashboard.stockCritico)}`);
        appendLog(`Caja: ${JSON.stringify(dashboard.caja)}`);
        appendLog(
          `Últimos movimientos: ${JSON.stringify(dashboard.movimientos)}`
        );

        // 🔸 2. Traer datos de caja desde store
        await cajaStore.fetchCaja();
        appendLog("✅ Resumen de caja cargado");
        appendLog(`Resumen caja: ${JSON.stringify(cajaStore.resumen)}`);
        appendLog(`Movimientos caja: ${JSON.stringify(cajaStore.movimientos)}`);
      } catch (err) {
        appendLog(`❌ Error en testFlow: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    testFlow();
  }, []);

  // 🔸 Funciones de prueba de apertura y cierre
  const handleAbrirCaja = async () => {
    try {
      await cajaStore.abrirCaja({ efectivo: 1000, mp: 500, transferencia: 0 });
      appendLog("✅ Caja abierta");
      appendLog(`Resumen caja: ${JSON.stringify(cajaStore.resumen)}`);
    } catch (err) {
      appendLog(`❌ Error apertura: ${err.message}`);
    }
  };

  const handleCerrarCaja = async () => {
    try {
      await cajaStore.cerrarCaja();
      appendLog("✅ Caja cerrada");
      appendLog(`Resumen caja: ${JSON.stringify(cajaStore.resumen)}`);
    } catch (err) {
      appendLog(`❌ Error cierre: ${err.message}`);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">🚀 Test Dashboard</h1>

      {loading && <p>Cargando datos...</p>}

      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleAbrirCaja}
        >
          Abrir Caja
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleCerrarCaja}
        >
          Cerrar Caja
        </button>
      </div>

      <div className="mt-6 p-4 bg-white rounded shadow overflow-auto max-h-[500px]">
        <h2 className="font-semibold mb-2">Logs de Test</h2>
        <pre className="text-sm">{log.join("\n")}</pre>
      </div>
    </div>
  );
}
