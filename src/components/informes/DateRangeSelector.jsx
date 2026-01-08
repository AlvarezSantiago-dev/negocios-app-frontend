import React from "react";
import { Calendar } from "lucide-react";
import { hoyArg } from "@/utils/fecha";

export default function DateRangeSelector({ selectedDate, onDateChange }) {
  const today = hoyArg(); // Usar fecha Argentina

  // Calcular ayer en timezone Argentina
  function getYesterday() {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Argentina/Buenos_Aires",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    const parts = formatter.formatToParts(ayer);
    const year = parts.find((p) => p.type === "year").value;
    const month = parts.find((p) => p.type === "month").value;
    const day = parts.find((p) => p.type === "day").value;

    return `${year}-${month}-${day}`;
  }

  // Calcular hace 7 días en timezone Argentina
  function getLastWeek() {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Argentina/Buenos_Aires",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const hace7 = new Date();
    hace7.setDate(hace7.getDate() - 7);

    const parts = formatter.formatToParts(hace7);
    const year = parts.find((p) => p.type === "year").value;
    const month = parts.find((p) => p.type === "month").value;
    const day = parts.find((p) => p.type === "day").value;

    return `${year}-${month}-${day}`;
  }

  // Primer día del mes en timezone Argentina
  const firstDayOfMonth = (() => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Argentina/Buenos_Aires",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const parts = formatter.formatToParts(new Date());
    const year = parts.find((p) => p.type === "year").value;
    const month = parts.find((p) => p.type === "month").value;

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
