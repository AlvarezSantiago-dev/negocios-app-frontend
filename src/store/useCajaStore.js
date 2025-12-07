import { create } from "zustand";
import api from "../services/api";
import { hoyArg } from "../utils/fecha";

const useCajaStore = create((set, get) => ({
  resumen: {},
  movimientos: [],
  loading: false,
  loadingCierre: false,
  cerrando: false,

  fetchCaja: async () => {
    set({ loading: true });
    try {
      const fecha = hoyArg(); // YYYY-MM-DD
      const resResumen = await api.get(`/caja/dia?fecha=${fecha}`);
      const resMovimientos = await api.get("/caja/movimientos");

      set({
        resumen: resResumen.data.response || {},
        movimientos: resMovimientos.data.response || [],
        loading: false,
      });
    } catch (err) {
      console.error("Error fetchCaja:", err);
      set({ loading: false });
    }
  },

  abrirCaja: async ({ efectivo = 0, mp = 0, transferencia = 0 }) => {
    set({ loading: true });
    try {
      await api.post("/caja/apertura", { efectivo, mp, transferencia });
      await get().fetchCaja();
    } catch (err) {
      console.error("Error abrirCaja:", err);
    } finally {
      set({ loading: false });
    }
  },

  cerrarCaja: async ({ efectivo = 0, mp = 0, transferencia = 0 }) => {
    set({ loadingCierre: true, cerrando: true });
    try {
      await api.post("/caja/cierre", { efectivo, mp, transferencia });
      await get().fetchCaja();
    } catch (err) {
      console.error("Error cerrarCaja:", err);
    } finally {
      set({ loadingCierre: false, cerrando: false });
    }
  },

  crearMovimiento: async (data) => {
    try {
      await api.post("/caja/movimiento", data);
      await get().fetchCaja();
    } catch (err) {
      console.error("Error crearMovimiento:", err);
    }
  },
}));

export default useCajaStore;
