import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuth: false,
  user: null,
  business: { configured: null, businessType: null },

  login: (user) => set({ isAuth: true, user }),
  logout: () => set({ isAuth: false, user: null }),

  setBusiness: (business) =>
    set({ business: { configured: null, businessType: null, ...business } }),
}));

export default useAuthStore;
