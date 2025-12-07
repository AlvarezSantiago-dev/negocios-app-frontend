const API_CAJA = `${import.meta.env.VITE_API_URL}/caja`;
const API_VENTAS = `${import.meta.env.VITE_API_URL}/ventas`;

// Helper con credentials
async function apiGet(url) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export function getFechaLocalYYYYMMDD() {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${año}-${mes}-${dia}`;
}

/* VENTAS DEL DÍA */
export async function fetchVentasHoy(fechaISO) {
  try {
    const res = await fetch(
      `${API_VENTAS}/informes/diarias?fecha=${fechaISO}`,
      {
        credentials: "include",
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.ventas?.ventas ?? [];
  } catch (err) {
    console.error("Error fetchVentasHoy:", err);
    return [];
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

/* STOCK CRÍTICO */
export async function fetchStockCritico() {
  try {
    const res = await fetch(`${API_CAJA}/products`, { credentials: "include" });
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
  return movimientos.slice(0, limit);
}

export async function fetchCajaResumen() {
  const res = await fetch(`${API_CAJA}/resumen`, { credentials: "include" });
  if (!res.ok) throw new Error("Error al obtener resumen de caja");
  const data = await res.json();
  return (
    data.response ?? {
      efectivo: 0,
      mp: 0,
      transferencia: 0,
      total: 0,
    }
  );
}
export async function aperturaCaja(montos) {
  const res = await fetch(`${API_CAJA}/abrir`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(montos),
  });
  if (!res.ok) throw new Error("No se pudo abrir la caja");
  return res.json();
}

export async function cierreCaja(montos) {
  const res = await fetch(`${API_CAJA}/cerrar`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(montos),
  });
  if (!res.ok) throw new Error("No se pudo cerrar la caja");
  return res.json();
}

export async function crearMovimientoCaja(data) {
  const res = await fetch(`${API_CAJA}/movimiento`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("No se pudo crear el movimiento");
  return res.json();
}

export async function editarMovimientoCaja(id, data) {
  const res = await fetch(`${API_CAJA}/movimiento/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("No se pudo editar el movimiento");
  return res.json();
}

export async function eliminarMovimientoCaja(id) {
  const res = await fetch(`${API_CAJA}/movimiento/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo eliminar el movimiento");
  return res.json();
}

export async function fetchCierres() {
  const res = await fetch(`${API_CAJA}/cierres`, { credentials: "include" });
  if (!res.ok) throw new Error("No se pudieron obtener los cierres");
  const data = await res.json();
  return data.response ?? [];
}

export async function fetchCierreHoy() {
  const res = await fetch(`${API_CAJA}/cierre-hoy`, { credentials: "include" });
  if (!res.ok) throw new Error("No se pudo obtener cierre de hoy");
  const data = await res.json();
  return data.response ?? null;
}
