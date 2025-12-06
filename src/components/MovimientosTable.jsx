import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";

export default function MovimientosTable({ data, onEdit, onDelete }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-sm">
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
          {data.map((m) => (
            <tr key={m._id} className="border-t hover:bg-muted/30">
              <td className="p-3 capitalize">{m.tipo}</td>
              <td className="p-3">${m.monto}</td>
              <td className="p-3">{m.motivo}</td>
              <td className="p-3 capitalize">{m.metodo}</td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={() => onEdit(m)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(m._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
