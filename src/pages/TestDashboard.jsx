import { useEffect } from "react";
import useCajaStore from "../store/useCajaStore";

export default function TestDashboard() {
  const cajaStore = useCajaStore();

  useEffect(() => {
    const runTest = async () => {
      const appendLog = (msg) => console.log(msg);

      appendLog("🔹 Iniciando test de Dashboard...");

      // 1️⃣ Resumen inicial
      await cajaStore.fetchCaja();
      appendLog("✅ Dashboard cargado");
      appendLog("Resumen inicial caja: " + JSON.stringify(cajaStore.resumen));
      appendLog(
        "Movimientos iniciales: " + JSON.stringify(cajaStore.movimientos)
      );

      // 2️⃣ Abrir caja
      appendLog("🔹 Abriendo caja...");
      await cajaStore.abrirCaja({ efectivo: 1000, mp: 500, transferencia: 0 });
      await cajaStore.fetchCaja(); // ⚡ refresca resumen y movimientos
      appendLog("✅ Caja abierta");
      appendLog("Resumen caja: " + JSON.stringify(cajaStore.resumen));
      appendLog("Movimientos caja: " + JSON.stringify(cajaStore.movimientos));

      // 3️⃣ Crear movimiento de prueba
      appendLog("🔹 Creando movimiento de prueba...");
      await cajaStore.crearMovimiento({
        tipo: "ingreso",
        motivo: "Venta prueba",
        monto: 1200,
        metodo: "efectivo",
      });
      await cajaStore.fetchCaja();
      appendLog("✅ Movimiento creado");
      appendLog("Resumen caja: " + JSON.stringify(cajaStore.resumen));
      appendLog("Movimientos caja: " + JSON.stringify(cajaStore.movimientos));

      // 4️⃣ Cerrar caja
      appendLog("🔹 Cerrando caja...");
      await cajaStore.cerrarCaja({
        efectivo: cajaStore.resumen.efectivo,
        mp: cajaStore.resumen.mp,
        transferencia: cajaStore.resumen.transferencia,
      });
      await cajaStore.fetchCaja();
      appendLog("✅ Caja cerrada");
      appendLog("Resumen final caja: " + JSON.stringify(cajaStore.resumen));
      appendLog(
        "Movimientos finales: " + JSON.stringify(cajaStore.movimientos)
      );

      appendLog("🔹 Test completo");
    };

    runTest();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Test Dashboard</h1>
      <p>Revisá la consola para los logs del flujo completo de caja.</p>
    </div>
  );
}
