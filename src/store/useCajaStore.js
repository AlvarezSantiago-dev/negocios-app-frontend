// src/store/useCajaStore.js
import { create } from "zustand";
import api from "../services/api";
import { hoyArg } from "../utils/fecha";

const useCajaStore = create((set, get) => ({
  resumen: {},
  allmovimientos: [],
  movimientos: [],
  ventas: [],
  loading: false,
  loadingCierre: false,
  cerrando: false,

  // ===========================================================
  // 1) Traer resumen del día actual + movimientos + ventas
  // ===========================================================
  fetchCaja: async () => {
    set({ loading: true });
    try {
      const hoyISO = hoyArg(); // YYYY-MM-DD

      const resResumen = await api.get(
        `/caja/resumen?desde=${hoyISO}&hasta=${hoyISO}`
      );

      // últimos 5
      const resMovimientos = await api.get("/caja/movimientos?limit=5");

      // todos para tablas completas
      const allmovimientos = await api.get("/caja/movimientos?limit=100");

      // ventas del día
      const ventasRes = await api.get(`/ventas?fecha=${hoyISO}`);

      set({
        resumen: resResumen.data.response || {},
        movimientos: resMovimientos.data.response || [],
        allmovimientos: allmovimientos.data.response || [],
        ventas: ventasRes.data.response || [],
        loading: false,
      });
    } catch (err) {
      console.error("Error fetchCaja:", err);
      set({ loading: false });
    }
  },

  // ===========================================================
  // 2) Apertura
  // ===========================================================
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

  // ===========================================================
  // 3) Cierre
  // ===========================================================
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

  // ===========================================================
  // 4) Movimientos manuales
  // ===========================================================
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

  // ===========================================================
  // 5) VENTAS
  // ===========================================================

  // traer ventas del día
  fetchVentas: async () => {
    try {
      const hoyISO = hoyArg();
      const res = await api.get(`/ventas?fecha=${hoyISO}`);
      set({ ventas: res.data.response || [] });
    } catch (err) {
      console.error("Error fetchVentas:", err);
    }
  },

  // editar venta
  editarVenta: async (id, data) => {
    try {
      await api.put(`/ventas/${id}`, data);
      await get().fetchCaja(); // refresca todo
    } catch (err) {
      console.error("Error editarVenta:", err);
    }
  },

  // eliminar venta
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
