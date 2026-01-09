// src/utils/fecha.js

// Argentina está en UTC-3 (sin horario de verano desde 2009)
const ARGENTINA_OFFSET_MS = -3 * 60 * 60 * 1000; // -3 horas

const shiftToArgentina = (dateLike = new Date()) => {
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getTime() + ARGENTINA_OFFSET_MS);
};

export const toFechaArgYYYYMMDD = (dateLike = new Date()) => {
  const argTime = shiftToArgentina(dateLike);
  if (!argTime) return null;

  const year = argTime.getUTCFullYear();
  const month = String(argTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(argTime.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const hoyArg = () => {
  const argTime = shiftToArgentina(new Date());
  if (!argTime) return null;

  const year = argTime.getUTCFullYear();
  const month = String(argTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(argTime.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // YYYY-MM-DD
};

export const ahoraArgISO = () => {
  // Fecha y hora actual en Argentina (para input datetime-local)
  const argTime = shiftToArgentina(new Date());
  if (!argTime) return "";

  const year = argTime.getUTCFullYear();
  const month = String(argTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(argTime.getUTCDate()).padStart(2, "0");
  const hour = String(argTime.getUTCHours()).padStart(2, "0");
  const minute = String(argTime.getUTCMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`; // YYYY-MM-DDTHH:MM
};

export const fechaCompletaArg = () => {
  // Date correcto con offset explícito Argentina (sin depender del TZ local)
  const argTime = shiftToArgentina(new Date());
  if (!argTime) return new Date();

  const year = argTime.getUTCFullYear();
  const month = String(argTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(argTime.getUTCDate()).padStart(2, "0");
  const hour = String(argTime.getUTCHours()).padStart(2, "0");
  const minute = String(argTime.getUTCMinutes()).padStart(2, "0");
  const second = String(argTime.getUTCSeconds()).padStart(2, "0");

  // Crear string ISO con timezone Argentina explícito
  const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}.000-03:00`;

  // Retornar Date object
  return new Date(isoString);
};
