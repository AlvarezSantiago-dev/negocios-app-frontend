import { create } from "zustand";
import api from "../services/api";
import { fechaCompletaArg, hoyArg } from "../utils/fecha";

const useCajaStore = create((set, get) => ({
  resumen: {},
  allmovimientos: [],
  movimientos: [],
  ventas: [],
  loading: false,
  loadingCierre: false,
  cerrando: false,

  // ======================================================
  // 🔹 TRAER RESUMEN + MOVIMIENTOS + VENTAS DEL DÍA
  // ======================================================
  fetchCaja: async () => {
    set({ loading: true });
    try {
      const hoyISO = fechaCompletaArg(); // YYYY-MM-DD

      // Resumen del día
      const resResumen = await api.get(
        `/caja/resumen?desde=${hoyISO}&hasta=${hoyISO}`
      );

      // Últimos 5 movimientos
      const resMovimientos = await api.get("/caja/movimientos?limit=5");

      // Hasta 100 movimientos
      const resAllMovs = await api.get("/caja/movimientos?limit=100");

      // Ventas del día
      const resVentas = await api.get(
        `/ventas/informes/diarias?fecha=${hoyISO}`
      );

      set({
        resumen: resResumen.data.response || {},
        movimientos: resMovimientos.data.response || [],
        allmovimientos: resAllMovs.data.response || [],
        ventas: resVentas.data.response || [],
        loading: false,
      });
    } catch (err) {
      console.error("Error fetchCaja:", err);
      set({ loading: false });
    }
  },

  // ======================================================
  // 🔹 TRAER TODAS LAS VENTAS DEL DÍA (solo ventas)
  // ======================================================
  fetchVentas: async () => {
    try {
      const hoyISO = hoyArg();
      const res = await api.get(`/ventas?fecha=${hoyISO}`);
      set({ ventas: res.data.response || [] });
    } catch (err) {
      console.error("Error fetchVentas:", err);
    }
  },

  // ======================================================
  // 🔹 APERTURA DE CAJA
  // ======================================================
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

  // ======================================================
  // 🔹 CIERRE DE CAJA
  // ======================================================
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

  // ======================================================
  // 🔹 MOVIMIENTOS
  // ======================================================
  crearMovimiento: async (data) => {
    try {
      await api.post("/caja/movimiento", data);
      await get().fetchCaja();
    } catch (err) {
      console.error("Error crearMovimiento:", err);
    }
  },

  editarMovimiento: async (id, data) => {
    try {
      await api.put(`/caja/movimiento/${id}`, data);
      await get().fetchCaja();
    } catch (err) {
      console.error("Error editarMovimiento:", err);
    }
  },

  eliminarMovimiento: async (id) => {
    try {
      await api.delete(`/caja/movimiento/${id}`);
      await get().fetchCaja();
    } catch (err) {
      console.error("Error eliminarMovimiento:", err);
    }
  },

  // ======================================================
  // 🔹 VENTAS
  // ======================================================
  crearVenta: async (data) => {
    try {
      await api.post("/ventas", data);
      await get().fetchCaja();
    } catch (err) {
      console.error("Error crearVenta:", err);
    }
  },

  editarVenta: async (id, data) => {
    try {
      await api.put(`/ventas/${id}`, data);
      await get().fetchCaja();
    } catch (err) {
      console.error("Error editarVenta:", err);
    }
  },

  eliminarVenta: async (id) => {
    try {
      await api.delete(`/ventas/${id}`);
      await get().fetchCaja();
    } catch (err) {
      console.error("Error eliminarVenta:", err);
    }
  },
}));

export default useCajaStore;
