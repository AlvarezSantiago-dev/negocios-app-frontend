// charts/RankingProductosChart.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RankingProductosChart({ ranking }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Top 5 productos más vendidos</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2">
          {ranking.map((p, i) => (
            <li
              key={p.productoId}
              className="flex justify-between font-semibold"
            >
              <span>
                {i + 1}. {p.nombre}
              </span>
              <span>{p.cantidadVendida} u.</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
