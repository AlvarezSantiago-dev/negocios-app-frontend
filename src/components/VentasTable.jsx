import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function VentasTable({
  data = [],
  onDelete,
  cajaAbierta = false,
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[900px] w-full text-sm border rounded-lg overflow-hidden">
        <thead className="bg-muted/60 text-left">
          <tr>
            <th className="p-3">Fecha</th>
            <th className="p-3">Método</th>
            <th className="p-3">Total</th>
            <th className="p-3">Productos</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {data.map((v) => (
            <tr key={v._id} className="border-t hover:bg-muted/30">
              <td className="p-3">
                {new Date(v.fecha).toLocaleString("es-AR")}
              </td>

              <td className="p-3 capitalize">{v.metodoPago}</td>

              <td className="p-3 font-semibold">${v.totalVenta}</td>

              <td className="p-3">
                {(v.items || []).map((i) => {
                  const prod = i.productoId || {};
                  return (
                    <div key={i._id}>
                      {i.cantidad}x {prod.nombre ?? "—"} (${i.subtotal})
                    </div>
                  );
                })}
              </td>

              <td className="p-3">
                <div className="flex justify-end">
                  {cajaAbierta && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete?.(v._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-muted-foreground">
                No hay ventas para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
