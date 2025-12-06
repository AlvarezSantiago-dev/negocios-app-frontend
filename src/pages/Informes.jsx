import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/informes.css";

export default function Informes() {
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [ganancias, setGanancias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("diarias");
  const [totalVentasHoy, setTotalVentasHoy] = useState(0);
  const [totalVentasMes, setTotalVentasMes] = useState(0);

  useEffect(() => {
    cargarInformes();
  }, []);

  const cargarInformes = async () => {
    setLoading(true);
    try {
      const hoy = new Date().toISOString().split("T")[0];
      const año = new Date().getFullYear();
      const mes = new Date().getMonth() + 1;

      const [diariasRes, mensualRes, ganancRes, ventasRes] = await Promise.all([
        api
          .get(`/ventas/informes/diarias?fecha=${hoy}`)
          .catch(() => ({ data: [] })),
        api
          .get(`/ventas/informes/mensuales?año=${año}&mes=${mes}`)
          .catch(() => ({ data: [] })),
        api.get("/ventas/informes/ganancias").catch(() => ({ data: [] })),
        api.get("/ventas").catch(() => ({ data: [] })),
      ]);

      setVentasDiarias(diariasRes.data || []);
      setVentasMensuales(mensualRes.data || []);
      setGanancias(ganancRes.data || []);

      // Calcular totales
      const totalHoy = (ventasRes.data || [])
        .filter(
          (v) =>
            new Date(v.createdAt || v.fecha).toDateString() ===
            new Date().toDateString()
        )
        .reduce((sum, v) => sum + (v.total || 0), 0);
      setTotalVentasHoy(totalHoy);

      const ahora = new Date();
      const totalMes = (ventasRes.data || [])
        .filter((v) => {
          const fecha = new Date(v.createdAt || v.fecha);
          return (
            fecha.getFullYear() === ahora.getFullYear() &&
            fecha.getMonth() === ahora.getMonth()
          );
        })
        .reduce((sum, v) => sum + (v.total || 0), 0);
      setTotalVentasMes(totalMes);
    } catch (err) {
      console.error("Error al cargar informes:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div>
        <p>Cargando informes...</p>
      </div>
    );

  return (
    <div className="informes-container">
      <h1 className="text-2xl font-bold mb-6">📊 Informes y Reportes</h1>

      {/* Resumen rápido */}
      <div className="info-cards">
        <div className="info-card">
          <h3>Ventas Hoy</h3>
          <p className="amount">${totalVentasHoy.toFixed(2)}</p>
        </div>
        <div className="info-card">
          <h3>Ventas del Mes</h3>
          <p className="amount">${totalVentasMes.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-bar">
        {["diarias", "mensuales", "ganancias"].map((t) => (
          <button
            key={t}
            className={`tab-link ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Ventas Diarias */}
      {tab === "diarias" && (
        <div className="tab-section">
          <h2>Ventas Diarias</h2>
          {ventasDiarias.length > 0 ? (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th>Método</th>
                </tr>
              </thead>
              <tbody>
                {ventasDiarias.map((v, i) => (
                  <tr key={i}>
                    <td>
                      {new Date(v.createdAt || v.fecha).toLocaleTimeString()}
                    </td>
                    <td>{v.items?.length || 1}</td>
                    <td>${v.total || 0}</td>
                    <td>{v.metodoPago || "efectivo"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Sin datos</p>
          )}
        </div>
      )}

      {/* Tab Ventas Mensuales */}
      {tab === "mensuales" && (
        <div className="tab-section">
          <h2>Ventas Mensuales</h2>
          {ventasMensuales.length > 0 ? (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Total Día</th>
                  <th>Transacciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasMensuales.map((v, i) => (
                  <tr key={i}>
                    <td>
                      {new Date(v.fecha || v.createdAt).toLocaleDateString()}
                    </td>
                    <td>${v.totalDia || v.total || 0}</td>
                    <td>{v.cantidad || 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Sin datos</p>
          )}
        </div>
      )}

      {/* Tab Ganancias */}
      {tab === "ganancias" && (
        <div className="tab-section">
          <h2>Análisis de Ganancias</h2>
          {ganancias.length > 0 ? (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad Vendida</th>
                  <th>Ganancia Unitaria</th>
                  <th>Ganancia Total</th>
                </tr>
              </thead>
              <tbody>
                {ganancias.map((g, i) => (
                  <tr key={i}>
                    <td>{g.nombre || g.productoId}</td>
                    <td>{g.cantidadVendida || 0}</td>
                    <td>${g.gananciaUnitaria || 0}</td>
                    <td className="total">${g.gananciaTotal || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Sin datos de ganancias</p>
          )}
        </div>
      )}

      {/* Botón actualizar */}
      <button className="btn-actualizar" onClick={cargarInformes}>
        🔄 Actualizar Informes
      </button>
    </div>
  );
}
