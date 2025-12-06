import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export function Movimientos() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/caja/movimientos`)
      .then((r) => r.json())
      .then((d) => setData(d.response ?? []));
  }, []);

  return (
    <Card className="p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Movimientos</h2>
      <div className="flex flex-col gap-2">
        {data.map((m) => (
          <div key={m._id} className="border p-2 rounded flex justify-between">
            <span>{new Date(m.fecha).toLocaleString()}</span>
            <span>{m.tipo.toUpperCase()}</span>
            <span>{m.metodo}</span>
            <span>${m.monto}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
