export function formatMoney(value) {
  if (!value) return "";
  return new Intl.NumberFormat("es-AR").format(Number(value));
}

export function parseMoney(value) {
  if (!value) return 0;
  return Number(value.toString().replace(/\./g, ""));
}
