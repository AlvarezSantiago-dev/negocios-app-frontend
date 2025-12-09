import { useState } from "react";
import useResumenStore from "@/store/useResumenStore";

export function FiltroRango() {
  const fetchResumen = useResumenStore((s) => s.fetchResumen);

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const aplicar = () => {
    if (!desde || !hasta) return;
    fetchResumen({ desde, hasta });
  };

  return (
    <div className="flex gap-2">
      <input
        type="date"
        className="border px-2 py-1 rounded"
        value={desde}
        onChange={(e) => setDesde(e.target.value)}
      />
      <input
        type="date"
        className="border px-2 py-1 rounded"
        value={hasta}
        onChange={(e) => setHasta(e.target.value)}
      />

      <button
        onClick={aplicar}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Aplicar rango
      </button>
    </div>
  );
}
