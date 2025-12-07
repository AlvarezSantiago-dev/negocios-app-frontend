import { useEffect, useState } from "react";
import useCajaStore from "../store/useCajaStore";

export default function TestDashboard() {
  const cajaStore = useCajaStore();
  const [log, setLog] = useState([]);

  const appendLog = (msg) => setLog((prev) => [...prev, msg]);

  useEffect(() => {
    const runTest = async () => {
      appendLog("🔹 Iniciando test...");

      await cajaStore.fetchCaja();
      appendLog("✅ Dashboard cargado");
      appendLog("Resumen inicial caja: " + JSON.stringify(cajaStore.resumen));

      // Abrir caja
      await cajaStore.abrirCaja({ efectivo: 1000, mp: 500, transferencia: 0 });
      await cajaStore.fetchCaja();
      appendLog("✅ Caja abierta: " + JSON.stringify(cajaStore.resumen));

      // Crear movimiento
      await cajaStore.crearMovimiento({
        tipo: "ingreso",
        motivo: "Venta prueba",
        monto: 1200,
        metodo: "efectivo",
      });
      await cajaStore.fetchCaja();
      appendLog("✅ Movimiento creado: " + JSON.stringify(cajaStore.resumen));

      // Cerrar caja
      await cajaStore.cerrarCaja({
        efectivo: cajaStore.resumen.efectivo,
        mp: cajaStore.resumen.mp,
        transferencia: cajaStore.resumen.transferencia,
      });
      await cajaStore.fetchCaja();
      appendLog("✅ Caja cerrada: " + JSON.stringify(cajaStore.resumen));

      appendLog("🔹 Test completo");
    };

    runTest();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Test Dashboard</h1>
      {log.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  );
}
