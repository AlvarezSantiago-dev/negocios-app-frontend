// src/context/DashboardContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [resumen, setResumen] = useState({
    ventasDelDia: 0,
    gananciasDelDia: 0,
    totalVentas: 0,
  });

  async function fetchData() {
    setLoading(true);
    try {
      const [prodRes, ventasRes, resumenRes] = await Promise.all([
        fetch(`${API}/products`).then((r) => r.json()),
        fetch(`${API}/ventas`).then((r) => r.json()),
        fetch(`${API}/resumen`).then((r) => r.json()),
      ]);

      setProductos(prodRes.response);
      setVentas(ventasRes.response);
      setResumen(resumenRes.response);
    } catch (error) {
      console.error("Error dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        loading,
        productos,
        ventas,
        resumen,
        refresh: fetchData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
