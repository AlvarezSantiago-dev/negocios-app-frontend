// src/services/cajaService.js
const API_CAJA = `${import.meta.env.VITE_API_URL}/caja`;

// Helper con credentials
async function apiGet(url) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

// --- RESUMEN DE CAJA ---
export async function fetchCajaResumen() {
  const hoyISO = new Date().toISOString().split("T")[0];
  const res = await fetch(
    `${API_CAJA}/resumen?desde=${hoyISO}&hasta=${hoyISO}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Error al obtener resumen de caja");
  const data = await res.json();
  return data.response ?? { efectivo: 0, mp: 0, transferencia: 0, total: 0 };
}

// --- APERTURA / CIERRE DE CAJA ---
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

// --- MOVIMIENTOS DE CAJA ---
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

// --- LISTA DE MOVIMIENTOS ---
export async function fetchCajaMovimientos(limit = 5) {
  const data = await apiGet(`${API_CAJA}/movimientos`);
  const movimientos = data.response ?? [];
  return movimientos.slice(0, limit);
}

// --- CIERRES ---
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

// Alias para compatibilidad con import antiguos
export { fetchCierres as fetchUltimosCierres };
