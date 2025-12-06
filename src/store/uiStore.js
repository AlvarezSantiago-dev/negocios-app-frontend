import { create } from "zustand";

const useUiStore = create((set) => ({
  loading: false,

  showLoader: () => set({ loading: true }),
  hideLoader: () => set({ loading: false }),
}));

export default useUiStore;
