// src/services/dashboardService.js
const API_CAJA = `${import.meta.env.VITE_API_URL}/caja`;
const API_VENTAS = `${import.meta.env.VITE_API_URL}/ventas`;

export function getFechaLocalYYYYMMDD() {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${año}-${mes}-${dia}`;
}

async function apiGet(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

/* VENTAS DEL DÍA */
export async function fetchVentasHoy(fechaISO) {
  try {
    const res = await fetch(`${API_VENTAS}/informes/diarias?fecha=${fechaISO}`);
    if (!res.ok) throw new Error("Error obteniendo ventas diarias");

    const data = await res.json();
    return (
      data.ventas ?? {
        ventas: [],
        totalVendido: 0,
        gananciaTotal: 0,
        cantidadVentas: 0,
      }
    );
  } catch (err) {
    console.error("Error fetchVentasHoy:", err);
    return {
      ventas: [],
      totalVendido: 0,
      gananciaTotal: 0,
      cantidadVentas: 0,
    };
  }
}

/* VENTAS MENSUALES */
export async function fetchVentasMensuales(year, month) {
  const data = await apiGet(
    `${API_VENTAS}/informes/mensuales?year=${year}&month=${month}`
  );
  return Array.isArray(data.ventas) ? data.ventas : [];
}

/* GANANCIAS */
export async function fetchGanancias(year, month, day) {
  const data = await apiGet(
    `${API_VENTAS}/informes/ganancias?year=${year}&month=${month}${
      day ? `&day=${day}` : ""
    }`
  );
  return (
    data.ganancias ?? { totalGanado: 0, totalVendido: 0, cantidadVentas: 0 }
  );
}

/* RANKING DE PRODUCTOS (opcional) */
export async function fetchRankingProductos() {
  try {
    const data = await apiGet(`${API_VENTAS}/informes/ranking`);
    return Array.isArray(data.ranking) ? data.ranking : [];
  } catch {
    return [];
  }
}

/* STOCK CRÍTICO */
export async function fetchStockCritico() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
    if (!res.ok) return [];
    const data = await res.json();
    const productos = data.response ?? [];

    const criticos = productos.filter(
      (p) => Number(p.stock) <= Number(p.stockMinimo)
    );
    criticos.sort((a, b) => a.stock - b.stock);
    return criticos;
  } catch (err) {
    console.warn("No se pudo obtener stock crítico:", err.message);
    return [];
  }
}

/* FORMATEO DE MONEDA */
export function formatMoney(n) {
  const valor = Number(n ?? 0);
  return valor.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/* ÚLTIMOS MOVIMIENTOS DE CAJA */
export async function fetchCajaMovimientos(limit = 5) {
  const data = await apiGet(`${API_CAJA}/movimientos`);
  const movimientos = data.response ?? [];

  // Tomamos los últimos 'limit' movimientos (ya vienen ordenados por fecha descendente)
  return movimientos.slice(0, limit);
}
