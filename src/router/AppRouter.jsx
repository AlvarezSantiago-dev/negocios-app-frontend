import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Ventas from "../pages/Ventas";
import Productos from "../pages/Products";
import Informes from "../pages/Informes";
import DashboardLayout from "../layout/DashboardLayout";
import useAuthStore from "../store/authStore.js";
import CajaNuevo from "../pages/CajaNuevo.jsx";
import CajaPage from "../pages/CajaPage";
import CierresPage from "../pages/HistorialCierres.jsx";
import AuthInitializer from "../context/AuthInitializer.jsx";

export default function AppRouter() {
  const isAuth = useAuthStore((s) => s.isAuth);

  return (
    <BrowserRouter>
      <AuthInitializer>
        <Routes>
          {/* === PUBLIC ROUTES === */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* === PROTECTED ROUTES === */}
          <Route
            path="/"
            element={
              isAuth ? <DashboardLayout /> : <Navigate to="/login" replace />
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="productos" element={<Productos />} />
            <Route path="informes" element={<Informes />} />
            <Route path="caja" element={<CajaPage />} />
            <Route path="caja/nuevo" element={<CajaNuevo />} />
            <Route path="cierres" element={<CierresPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  );
}
