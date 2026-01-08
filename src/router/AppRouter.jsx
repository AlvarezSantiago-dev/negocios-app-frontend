import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import CajaPage from "../pages/CajaPage";
import Dashboard from "../pages/Dashboard";
import CierresPage from "../pages/HistorialCierres";
import Informes from "../pages/Informes";
import Login from "../pages/Login";
import Productos from "../pages/Products";
import Register from "../pages/Register";
import SetupBusiness from "../pages/SetupBusiness";
import Ventas from "../pages/Ventas";
import useAuthStore from "../store/authStore";
import TestScanner from "../components/TestScanner";

export default function AppRouter() {
  const isAuth = useAuthStore((s) => s.isAuth);

  return (
    <Routes>
      {/* Public */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route
        path="/"
        element={isAuth ? <DashboardLayout /> : <Navigate to="/login" />}
      >
        <Route path="setup" element={<SetupBusiness />} />
        <Route index element={<Dashboard />} />
        <Route path="ventas" element={<Ventas />} />
        <Route path="productos" element={<Productos />} />
        <Route path="informes" element={<Informes />} />
        <Route path="caja" element={<CajaPage />} />
        <Route path="cierres" element={<CierresPage />} />
        <Route path="test" element={<TestScanner />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
