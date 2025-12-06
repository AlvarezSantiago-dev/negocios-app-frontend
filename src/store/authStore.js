import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuth: false,
  user: null,

  login: (user) => set({ isAuth: true, user }),
  logout: () => set({ isAuth: false, user: null }),
}));

export default useAuthStore;
