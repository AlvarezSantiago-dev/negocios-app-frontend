import { create } from "zustand";
import {
  fetchVentasHoy,
  fetchGanancias,
  fetchStockCritico,
  fetchCajaMovimientos,
} from "../services/dashboardService";
import { fetchCajaResumen } from "../services/cajaService";
import { hoyArg } from "../utils/fecha";

const useDashboardStore = create((set, get) => ({
  ventasHoy: [],
  ganHoy: 0,
  stockCritico: [],
  caja: { efectivo: 0, mp: 0, transferencia: 0, total: 0 },
  movimientos: [],
  loading: false,

  // 🔹 Traer todo el dashboard
  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const fechaISO = hoyArg();
      const [year, month, day] = fechaISO.split("-").map(Number);
      const [ventas, ganancias, critico, resumenCaja, movs] = await Promise.all(
        [
          fetchVentasHoy(fechaISO),
          fetchGanancias(year, month, day),
          fetchStockCritico(),
          fetchCajaResumen(),
          fetchCajaMovimientos(5),
        ]
      );

      set({
        ventasHoy: ventas,
        ganHoy:
          ganancias.totalGanadoNeto ??
          Number(ganancias.totalGanado ?? 0) -
            Number(ganancias.totalComisionTarjeta ?? 0),
        stockCritico: critico,
        caja: resumenCaja,
        movimientos: movs,
      });
    } catch (err) {
      console.error("Error fetchDashboard:", err);
    } finally {
      set({ loading: false });
    }
  },

  // 🔹 Actualizar solo caja
  actualizarCaja: async () => {
    try {
      const resumenCaja = await fetchCajaResumen();
      set({ caja: resumenCaja });
    } catch (err) {
      console.error("Error actualizarCaja:", err);
    }
  },

  // 🔹 Actualizar movimientos
  actualizarMovimientos: async () => {
    try {
      const movs = await fetchCajaMovimientos(5);
      set({ movimientos: movs });
    } catch (err) {
      console.error("Error actualizarMovimientos:", err);
    }
  },

  // 🔹 Actualizar ventas y ganancias
  actualizarVentas: async () => {
    try {
      const fechaISO = hoyArg();
      const [year, month, day] = fechaISO.split("-").map(Number);
      const ventas = await fetchVentasHoy(fechaISO);
      const ganancias = await fetchGanancias(year, month, day);
      set({
        ventasHoy: ventas,
        ganHoy:
          ganancias.totalGanadoNeto ??
          Number(ganancias.totalGanado ?? 0) -
            Number(ganancias.totalComisionTarjeta ?? 0),
      });
    } catch (err) {
      console.error("Error actualizarVentas:", err);
    }
  },

  // 🔹 Actualizar stock crítico
  actualizarStockCritico: async () => {
    try {
      const critico = await fetchStockCritico();
      set({ stockCritico: critico });
    } catch (err) {
      console.error("Error actualizarStockCritico:", err);
    }
  },

  // 🔹 Función para sincronización completa
  syncDashboard: async () => {
    await get().fetchDashboard();
  },
}));

export default useDashboardStore;
