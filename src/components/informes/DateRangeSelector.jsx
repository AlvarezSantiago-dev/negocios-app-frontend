import React from "react";
import { Calendar } from "lucide-react";
import { hoyArg } from "@/utils/fecha";

// Argentina está en UTC-3
const ARGENTINA_OFFSET = -3 * 60; // -180 minutos

export default function DateRangeSelector({ selectedDate, onDateChange }) {
  const today = hoyArg(); // Usar fecha Argentina

  // Calcular ayer en timezone Argentina
  function getYesterday() {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const argTime = new Date(utcTime + (ARGENTINA_OFFSET * 60000));
    argTime.setUTCDate(argTime.getUTCDate() - 1);
    
    const year = argTime.getUTCFullYear();
    const month = String(argTime.getUTCMonth() + 1).padStart(2, "0");
    const day = String(argTime.getUTCDate()).padStart(2, "0");
    
    return `${year}-${month}-${day}`;
  }

  // Calcular hace 7 días en timezone Argentina
  function getLastWeek() {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const argTime = new Date(utcTime + (ARGENTINA_OFFSET * 60000));
    argTime.setUTCDate(argTime.getUTCDate() - 7);
    
    const year = argTime.getUTCFullYear();
    const month = String(argTime.getUTCMonth() + 1).padStart(2, "0");
    const day = String(argTime.getUTCDate()).padStart(2, "0");
    
    return `${year}-${month}-${day}`;
  }

  // Primer día del mes en timezone Argentina
  const firstDayOfMonth = (() => {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const argTime = new Date(utcTime + (ARGENTINA_OFFSET * 60000));
    
    const year = argTime.getUTCFullYear();
    const month = String(argTime.getUTCMonth() + 1).padStart(2, "0");
    
    return `${year}-${month}-01`;
  })();

    return `${year}-${month}-01`;
  })();

  const presets = [
    { label: "Hoy", value: today },
    { label: "Ayer", value: getYesterday() },
    { label: "Última semana", value: getLastWeek() },
    { label: "Este mes", value: firstDayOfMonth },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-700">Filtrar por fecha</h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onDateChange(preset.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedDate === preset.value
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 font-medium">
          Fecha personalizada:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          max={today}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
