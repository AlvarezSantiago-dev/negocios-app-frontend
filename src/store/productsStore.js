import { create } from "zustand";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../services/productsService";

const useProductsStore = create((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    try {
      set({ loading: true });
      const data = await getProductos();

      set({
        products: data,
        loading: false,
      });
    } catch (err) {
      console.error("Error cargando productos:", err);
      set({ loading: false });
    }
  },

  addProduct: async (newProduct) => {
    try {
      const data = await createProducto(newProduct);
      if (!data?.response) return;

      const producto = data.response;

      if (!producto || !producto._id) return;

      set((state) => ({
        products: [...state.products.filter(Boolean), producto],
      }));
    } catch (err) {
      console.error("Error creando producto:", err);
    }
  },

  updateProduct: async (_id, data) => {
    const res = await updateProducto(_id, data);

    if (!res?.response) return;

    set((state) => ({
      products: state.products
        .filter(Boolean)
        .map((p) => (p._id === _id ? res.response : p)),
    }));
  },

  removeProduct: async (_id) => {
    await deleteProducto(_id);

    set((state) => ({
      products: state.products.filter((p) => p && p._id !== _id),
    }));
  },
}));

export default useProductsStore;
