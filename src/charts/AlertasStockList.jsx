// charts/AlertasStockList.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AlertasStockList({ items }) {
  return (
    <Card className="shadow-md border-red-400">
      <CardHeader>
        <CardTitle className="text-red-500">
          ⚠ Productos con poco stock
        </CardTitle>
      </CardHeader>

      <CardContent>
        {items.length === 0 && <p className="text-gray-400">Todo OK</p>}

        <ul className="space-y-2">
          {items.map((p) => (
            <li
              key={p._id}
              className="flex justify-between text-red-500 font-semibold"
            >
              <span>{p.nombre}</span>
              <span>{p.stock} u.</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
