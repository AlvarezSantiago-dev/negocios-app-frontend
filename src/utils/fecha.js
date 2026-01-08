// src/utils/fecha.js

// Argentina está en UTC-3 (sin horario de verano desde 2009)
const ARGENTINA_OFFSET = -3 * 60; // -180 minutos

export const hoyArg = () => {
  // Obtener timestamp actual y ajustar a Argentina
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const argTime = new Date(utcTime + (ARGENTINA_OFFSET * 60000));
  
  const year = argTime.getUTCFullYear();
  const month = String(argTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(argTime.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`; // YYYY-MM-DD
};

export const ahoraArgISO = () => {
  // Obtener fecha y hora actual en Argentina en formato ISO para input datetime-local
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const argTime = new Date(utcTime + (ARGENTINA_OFFSET * 60000));
  
  const year = argTime.getUTCFullYear();
  const month = String(argTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(argTime.getUTCDate()).padStart(2, '0');
  const hour = String(argTime.getUTCHours()).padStart(2, '0');
  const minute = String(argTime.getUTCMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}`; // YYYY-MM-DDTHH:MM
};

export const fechaCompletaArg = () => {
  // Obtener fecha y hora actual en Argentina
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const argTime = new Date(utcTime + (ARGENTINA_OFFSET * 60000));
  
  const year = argTime.getUTCFullYear();
  const month = String(argTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(argTime.getUTCDate()).padStart(2, '0');
  const hour = String(argTime.getUTCHours()).padStart(2, '0');
  const minute = String(argTime.getUTCMinutes()).padStart(2, '0');
  const second = String(argTime.getUTCSeconds()).padStart(2, '0');
  
  // Crear string ISO con timezone Argentina explícito
  const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}.000-03:00`;
  
  // Retornar Date object
  return new Date(isoString);
};
