import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import useResumenStore from "@/store/useResumenStore";
import { useState } from "react";

const MESES = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const AÑOS = [
  { value: "2023", label: "2023" },
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
];

export default function FiltroMesAnio() {
  const fetchResumen = useResumenStore((s) => s.fetchResumen);

  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");

  const aplicarFiltro = () => {
    if (!mes || !anio) return;

    const desde = `${anio}-${mes}-01`;
    const hasta = `${anio}-${mes}-31`;

    fetchResumen({ desde, hasta });
  };

  return (
    <div className="flex gap-3">
      <Select onValueChange={(v) => setMes(v)}>
        <SelectTrigger className="w-40">Mes</SelectTrigger>
        <SelectContent>
          {MESES.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(v) => setAnio(v)}>
        <SelectTrigger className="w-28">Año</SelectTrigger>
        <SelectContent>
          {AÑOS.map((a) => (
            <SelectItem key={a.value} value={a.value}>
              {a.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        onClick={aplicarFiltro}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Filtrar
      </button>
    </div>
  );
}
