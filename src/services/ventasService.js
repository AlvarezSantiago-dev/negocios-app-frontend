import api from "./api";

// FECHA HOY → ISO: yyyy-mm-dd
export async function getVentasDiarias(fechaISO) {
  const res = await api.get(`/ventas/informes/diarias?fecha=${fechaISO}`);
  return res.data;
}

export async function getVentasMensuales(year, month) {
  const res = await api.get(
    `/ventas/informes/mensuales?year=${year}&month=${month}`
  );
  return res.data;
}

export async function getGanancias(year, month, day) {
  const q = `year=${year}&month=${month}${day ? `&day=${day}` : ""}`;
  const res = await api.get(`/ventas/informes/ganancias?${q}`);
  return res.data;
}

export async function getUltimos7Dias() {
  const res = await api.get(`/ventas/informes/ultimos-7-dias`);
  return res.data;
}
