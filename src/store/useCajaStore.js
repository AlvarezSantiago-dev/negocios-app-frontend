import { create } from "zustand";
import api from "../services/api";

const hoy = () => new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

const useCajaStore = create((set, get) => ({
  resumen: {},
  movimientos: [],
  cierreHoy: null,
  loading: false,
  loadingCierre: false,
  cerrando: false,

  // Traer resumen y movimientos
  fetchCaja: async () => {
    set({ loading: true });
    try {
      const fecha = hoy();
      const resResumen = await api.get(
        `/caja/resumen?desde=${fecha}&hasta=${fecha}`
      );
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

  // Apertura de caja
  abrirCaja: async ({ efectivo = 0, mp = 0, transferencia = 0 }) => {
    set({ loading: true });
    try {
      await api.post("/caja/abrir", { efectivo, mp, transferencia });
      await get().fetchCaja(); // refresca resumen y movimientos
    } catch (err) {
      console.error("Error abrirCaja:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Cierre de caja
  cerrarCaja: async () => {
    set({ loadingCierre: true, cerrando: true });
    try {
      await api.post("/caja/cerrar");
      await get().fetchCaja();
      await get().fetchCierreData();
    } catch (err) {
      console.error("Error cerrarCaja:", err);
    } finally {
      set({ loadingCierre: false, cerrando: false });
    }
  },

  // Crear movimiento
  crearMovimiento: async (data) => {
    try {
      await api.post("/caja/movimiento", data);
      await get().fetchCaja(); // refresca resumen y movimientos
    } catch (err) {
      console.error("Error crearMovimiento:", err);
    }
  },

  // Editar movimiento
  editarMovimiento: async (_id, data) => {
    try {
      await api.put(`/caja/movimiento/${_id}`, data);
      await get().fetchCaja();
    } catch (err) {
      console.error("Error editarMovimiento:", err);
    }
  },

  // Eliminar movimiento
  eliminarMovimiento: async (_id) => {
    try {
      await api.delete(`/caja/movimiento/${_id}`);
      await get().fetchCaja();
    } catch (err) {
      console.error("Error eliminarMovimiento:", err);
    }
  },

  // Traer datos del cierre de hoy
  fetchCierreData: async () => {
    try {
      const res = await api.get("/caja/cierres/ultimos7");
      const hoyFecha = hoy();
      const cierre = res.data.response?.find(
        (c) => new Date(c.fecha).toISOString().split("T")[0] === hoyFecha
      );
      set({ cierreHoy: cierre || null });
    } catch (err) {
      console.error("Error fetchCierreData:", err);
    }
  },
}));

export default useCajaStore;
