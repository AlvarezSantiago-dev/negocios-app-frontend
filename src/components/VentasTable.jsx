// src/components/VentasTable.jsx
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import React from "react";

export default function VentasTable({ data = [], onEdit, onDelete }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm mt-6">
      <h3 className="font-semibold p-3 bg-white border-b">Ventas</h3>

      <table className="w-full text-sm">
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
                {v.fecha ? new Date(v.fecha).toLocaleString("es-AR") : "-"}
              </td>

              <td className="p-3 capitalize">{v.metodoPago}</td>

              <td className="p-3">${v.totalVenta}</td>

              <td className="p-3">
                {(v.items || []).map((i) => {
                  const prod = i.productoId || {};
                  const nombre = prod.nombre ?? prod.productoNombre ?? "—";
                  return (
                    <div key={i._id || i.productoId}>
                      {i.cantidad}x {nombre} (${i.subtotal})
                    </div>
                  );
                })}
              </td>

              <td className="p-3">
                <div className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit && onEdit(v)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete && onDelete(v._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="p-6 text-center text-sm text-muted-foreground"
              >
                No hay ventas para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
