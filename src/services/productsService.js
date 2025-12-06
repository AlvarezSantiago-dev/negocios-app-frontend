// services/productsService.js
import api from "./api";

export async function getProductos() {
  const res = await api.get("/products");
  return res.data.response; // <- ya es array
}

export async function createProducto(data) {
  const res = await api.post("/products", data);
  return res.data;
}

export async function updateProducto(_id, data) {
  const res = await api.put(`/products/${_id}`, data);
  return res.data;
}

export async function deleteProducto(_id) {
  const res = await api.delete(`/products/${_id}`);
  return res.data;
}
