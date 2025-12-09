import { FiltroDateRange } from "@/components/filtros/FiltroDateRange";
import FiltroMesAnio from "@/components/filtros/FiltroMesAnio";
import { FiltroRango } from "@/components/filtros/FiltroRango";
import useResumenStore from "@/store/useResumenStore";

export default function ResumenCaja() {
  const resumen = useResumenStore((s) => s.resumen);
  const loading = useResumenStore((s) => s.loading);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Resumen de Caja</h2>

      <FiltroDateRange />
      <FiltroMesAnio />
      <FiltroRango />

      {loading && <p>Cargando...</p>}

      {resumen && (
        <div className="p-4 rounded border mt-4">
          <p>Efectivo: ${resumen.efectivo}</p>
          <p>MercadoPago: ${resumen.mp}</p>
          <p>Transferencia: ${resumen.transferencia}</p>
          <p className="font-bold text-lg mt-2">TOTAL: ${resumen.total}</p>
        </div>
      )}
    </div>
  );
}
