import { create } from "zustand";
import api from "../services/api";
import { hoyArg } from "../utils/fecha";

const useCajaStore = create((set, get) => ({
  resumen: {},
  allmovimientos: [],
  movimientos: [],
  loading: false,
  loadingCierre: false,
  cerrando: false,

  // 🔹 Traer resumen del día actual y últimos 5 movimientos
  fetchCaja: async () => {
    set({ loading: true });
    try {
      const hoyISO = hoyArg(); // YYYY-MM-DD

      // Resumen del día actual
      const resResumen = await api.get(
        `/caja/resumen?desde=${hoyISO}&hasta=${hoyISO}`
      );

      // Últimos 5 movimientos (sin filtrar por fecha)
      const resMovimientos = await api.get("/caja/movimientos?limit=5");
      const allmovimientos = await api.get("/caja/movimientos?limit=100");
      set({
        resumen: resResumen.data.response || {},
        movimientos: resMovimientos.data.response || [],
        loading: false,
        allmovimientos: allmovimientos.data.response || [],
      });
    } catch (err) {
      console.error("Error fetchCaja:", err);
      set({ loading: false });
    }
  },

  // 🔹 Apertura de caja
  abrirCaja: async ({ efectivo = 0, mp = 0, transferencia = 0 }) => {
    set({ loading: true });
    try {
      await api.post("/caja/apertura", { efectivo, mp, transferencia });
      await get().fetchCaja(); // refrescar datos
    } catch (err) {
      console.error("Error abrirCaja:", err);
    } finally {
      set({ loading: false });
    }
  },

  // 🔹 Cierre de caja
  cerrarCaja: async ({ efectivo = 0, mp = 0, transferencia = 0 }) => {
    set({ loadingCierre: true, cerrando: true });
    try {
      await api.post("/caja/cierre", { efectivo, mp, transferencia });
      await get().fetchCaja(); // refrescar datos
    } catch (err) {
      console.error("Error cerrarCaja:", err);
    } finally {
      set({ loadingCierre: false, cerrando: false });
    }
  },

  // 🔹 Crear un movimiento
  crearMovimiento: async (data) => {
    try {
      await api.post("/caja/movimiento", data);
      await get().fetchCaja(); // refrescar datos
    } catch (err) {
      console.error("Error crearMovimiento:", err);
    }
  },

  // 🔹 Editar un movimiento
  editarMovimiento: async (id, data) => {
    try {
      await api.put(`/caja/movimiento/${id}`, data);
      await get().fetchCaja();
    } catch (err) {
      console.error("Error editarMovimiento:", err);
    }
  },

  // 🔹 Eliminar un movimiento
  eliminarMovimiento: async (id) => {
    try {
      await api.delete(`/caja/movimiento/${id}`);
      await get().fetchCaja();
    } catch (err) {
      console.error("Error eliminarMovimiento:", err);
    }
  },
}));

export default useCajaStore;
