import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { useLocation } from "react-router-dom";

export default function AuthInitializer({ children }) {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const PUBLIC_ROUTES = ["/login", "/register"];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/sessions/online`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (data?.user) {
          login(data.user);
        } else {
          // ⛔ Si estoy en rutas públicas NO hacer logout
          if (!PUBLIC_ROUTES.includes(location.pathname)) {
            logout();
          }
        }
      } catch (error) {
        if (!PUBLIC_ROUTES.includes(location.pathname)) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (loading) return <div>Cargando...</div>;

  return children;
}
