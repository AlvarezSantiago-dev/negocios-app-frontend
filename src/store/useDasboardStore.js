// src/store/useDashboardStore.js
import { useState } from "react";
import {
  fetchVentasHoy,
  fetchGanancias,
  fetchStockCritico,
  fetchCajaMovimientos,
} from "../services/dashboardService";
import { fetchCajaResumen } from "../services/cajaService";

export default function useDashboardStore() {
  const [ventasHoy, setVentasHoy] = useState([]);
  const [ganHoy, setGanHoy] = useState(0);
  const [stockCritico, setStockCritico] = useState([]);
  const [caja, setCaja] = useState({
    efectivo: 0,
    mp: 0,
    transferencia: 0,
    total: 0,
  });
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Función para traer todo el dashboard
  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const fechaISO = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const ventas = await fetchVentasHoy(fechaISO);
      const ganancias = await fetchGanancias(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
      );
      const critico = await fetchStockCritico();
      const resumenCaja = await fetchCajaResumen();
      const movs = await fetchCajaMovimientos(5);

      setVentasHoy(ventas);
      setGanHoy(ganancias.totalGanado ?? 0);
      setStockCritico(critico);
      setCaja(resumenCaja);
      setMovimientos(movs);
    } catch (err) {
      console.error("Error fetchDashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    ventasHoy,
    ganHoy,
    stockCritico,
    caja,
    movimientos,
    loading,
    fetchDashboard,
  };
}
