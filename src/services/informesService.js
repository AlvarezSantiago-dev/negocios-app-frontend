const API_VENTAS = `${import.meta.env.VITE_API_URL}/ventas`;
const defaultHeaders = { credentials: "include" };

// Helper GET
async function apiGet(url) {
  const res = await fetch(url, defaultHeaders);
  if (!res.ok) throw new Error(`Error API ${res.status}`);
  return res.json();
}

// --- DIARIAS ---
export async function fetchVentasDiarias(fechaISO) {
  const data = await apiGet(`${API_VENTAS}/informes/diarias?fecha=${fechaISO}`);
  return data.ventas ?? { ventas: [], totalVendido: 0, gananciaTotal: 0 };
}

// --- MENSUALES ---
export async function fetchVentasMensuales(year, month) {
  const data = await apiGet(
    `${API_VENTAS}/informes/mensuales?year=${year}&month=${month}`
  );
  return data.ventas ?? [];
}

// --- GANANCIAS ---
export async function fetchGanancias(year, month, day = null) {
  const url = day
    ? `${API_VENTAS}/informes/ganancias?year=${year}&month=${month}&day=${day}`
    : `${API_VENTAS}/informes/ganancias?year=${year}&month=${month}`;

  const data = await apiGet(url);
  return data.ganancias ?? {};
}

// --- ÚLTIMOS 7 DÍAS ---
export async function fetchUltimos7Dias() {
  const data = await apiGet(`${API_VENTAS}/informes/ultimos-7-dias`);
  return data.ventas ?? [];
}
