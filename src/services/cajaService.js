const API_CAJA = `${import.meta.env.VITE_API_URL}/caja`;

// src/services/cajaService.js

async function apiGet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("API ERROR: " + res.status);
  return res.json();
}

export async function fetchUltimosCierres() {
  const data = await apiGet(`${API_CAJA}/cierres/ultimos7`);
  return data.response ?? [];
}

// --- RESUMEN ---
export async function fetchCajaResumen() {
  const data = await apiGet(`${API_CAJA}/resumen`);
  const resumen = data.response ?? {};

  // 🔹 Determinamos si la caja está abierta según aperturas y cierres
  resumen.abierta = resumen.aperturaHoy && !resumen.cierreHoy;

  return resumen;
}

// --- MOVIMIENTOS ---
export async function fetchCajaMovimientos() {
  const data = await apiGet(`${API_CAJA}/movimientos`);
  return data.response ?? [];
}

export async function crearMovimientoCaja(body) {
  const res = await fetch(`${API_CAJA}/movimiento`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Error al crear movimiento");
  return (await res.json()).response;
}

export async function editarMovimientoCaja(id, body) {
  const res = await fetch(`${API_CAJA}/movimiento/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Error al editar movimiento");
  return (await res.json()).response;
}

export async function eliminarMovimientoCaja(id) {
  const res = await fetch(`${API_CAJA}/movimiento/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar movimiento");
  return (await res.json()).response;
}

// --- APERTURA ---
export async function aperturaCaja({ efectivo, mp, transferencia }) {
  const res = await fetch(`${API_CAJA}/apertura`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ efectivo, mp, transferencia }),
  });
  if (!res.ok) throw new Error("Error al abrir caja");
  return (await res.json()).response;
}

// --- CIERRE ---
export async function cierreCaja({ efectivo = 0, mp = 0, transferencia = 0 }) {
  const res = await fetch(`${API_CAJA}/cierre`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ efectivo, mp, transferencia }),
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`Error al cerrar caja: ${res.status} ${errorText}`);
  }
  return (await res.json()).response;
}

export async function fetchCierres() {
  const data = await apiGet(`${API_CAJA}/cierres`);
  return data.response ?? [];
}
export async function fetchCierreHoy() {
  const data = await apiGet(`${API_CAJA}/cierres/hoy`);
  return data.response ?? null;
}
