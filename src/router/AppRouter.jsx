import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Ventas from "../pages/Ventas";
import Productos from "../pages/Products";
import Informes from "../pages/Informes";
import DashboardLayout from "../layout/DashboardLayout";
import useAuthStore from "../store/authStore.js";
import CajaNuevo from "../pages/CajaNuevo.jsx";
import CajaPage from "../pages/CajaPage";
import CierresPage from "../pages/HistorialCierres.jsx";
export default function AppRouter() {
  const isAuth = useAuthStore((s) => s.isAuth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={isAuth ? <DashboardLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="productos" element={<Productos />} />
          <Route path="informes" element={<Informes />} />
          <Route path="caja" element={<CajaPage />} />
          <Route path="caja/nuevo" element={<CajaNuevo />} />
          <Route path="/cierres" element={<CierresPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
