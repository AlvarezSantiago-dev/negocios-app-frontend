import { create } from "zustand";

const API = `${import.meta.env.VITE_API_URL}/caja`;

export default create((set) => ({
  resumen: null,
  loading: false,

  fetchResumen: async ({ desde, hasta }) => {
    try {
      set({ loading: true });

      const url = `${API}/balance?desde=${desde}&hasta=${hasta}`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();

      set({ resumen: data, loading: false });
    } catch (err) {
      console.error("Error resumen:", err);
      set({ loading: false });
    }
  },
}));
