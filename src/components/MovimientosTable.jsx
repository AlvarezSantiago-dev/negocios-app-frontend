import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function MovimientosTable({
  data = [],
  onEdit,
  onDelete,
  cajaAbierta = false,
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[900px] w-full text-sm border rounded-lg overflow-hidden">
        <thead className="bg-muted/60 text-left">
          <tr>
            <th className="p-3">Tipo</th>
            <th className="p-3">Monto</th>
            <th className="p-3">Motivo</th>
            <th className="p-3">Método</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {data.map((m) => {
            const esManual = m.operacion === "movimiento";
            const puedeOperar = cajaAbierta && esManual;

            return (
              <tr key={m._id} className="border-t hover:bg-muted/30">
                <td className="p-3 capitalize">{m.tipo}</td>
                <td className="p-3 font-medium">${m.monto}</td>
                <td className="p-3">{m.motivo || "—"}</td>
                <td className="p-3 capitalize">{m.metodo}</td>

                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    {puedeOperar && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEdit?.(m)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDelete?.(m._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-muted-foreground">
                No hay movimientos para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
