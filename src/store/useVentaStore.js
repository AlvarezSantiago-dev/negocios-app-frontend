import { create } from "zustand";
import {
  getVentasDiarias,
  getVentasMensuales,
  getGanancias,
  getUltimos7Dias,
} from "../services/ventasService";

const useVentasStore = create((set) => ({
  loading: false,
  ventasHoy: 0,
  ventasMensuales: 0,
  ganancias: 0,
  ultimos7Dias: [],

  fetchVentasHoy: async (fechaISO) => {
    try {
      set({ loading: true });
      const data = await getVentasDiarias(fechaISO);
      set({ ventasHoy: data.ventas.totalVendido || 0, loading: false });
    } catch (e) {
      console.error("Error ventas diarias:", e);
      set({ loading: false });
    }
  },

  fetchVentasMensuales: async (year, month) => {
    try {
      set({ loading: true });
      const data = await getVentasMensuales(year, month);
      set({ ventasMensuales: data.ventas.totalVendido || 0, loading: false });
    } catch (e) {
      console.error("Error ventas mensuales:", e);
      set({ loading: false });
    }
  },

  fetchGanancias: async (year, month, day) => {
    try {
      set({ loading: true });
      const data = await getGanancias(year, month, day);
      set({ ganancias: data.ganancias.gananciaTotal || 0, loading: false });
    } catch (e) {
      console.error("Error ganancias:", e);
      set({ loading: false });
    }
  },

  fetchUltimos7Dias: async () => {
    try {
      set({ loading: true });
      const data = await getUltimos7Dias();
      set({ ultimos7Dias: data.ventas || [], loading: false });
    } catch (e) {
      console.error("Error ultimos 7 días:", e);
      set({ loading: false });
    }
  },
}));

export default useVentasStore;
