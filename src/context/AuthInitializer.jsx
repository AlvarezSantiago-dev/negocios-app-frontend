import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
export default function AuthInitializer({ children }) {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const setBusiness = useAuthStore((s) => s.setBusiness);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const PUBLIC_ROUTES = ["/login", "/register", "/"];

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

          // Si la instancia no está configurada, un ADMIN debe ir a /setup.
          // Un USER queda bloqueado (lo enviamos a /login).
          try {
            const resCfg = await fetch(
              `${import.meta.env.VITE_API_URL}/config`,
              { credentials: "include" }
            );
            const cfg = await resCfg.json();
            const configured = Boolean(cfg?.response?.configured);
            const businessType = cfg?.response?.businessType ?? null;

            setBusiness({ configured, businessType });

            if (!configured) {
              if (data.user?.role === 1) {
                if (location.pathname !== "/setup") {
                  navigate("/setup", { replace: true });
                }
              } else {
                if (location.pathname !== "/login") {
                  logout();
                  navigate("/login", { replace: true });
                }
              }
            }
          } catch (e) {
            // si falla el config, no bloqueamos el login
          }
        } else {
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
  }, [location.pathname, navigate]);

  if (loading) return <div>Cargando...</div>;

  return children;
}
