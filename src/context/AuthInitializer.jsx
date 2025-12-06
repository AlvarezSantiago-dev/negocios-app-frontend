import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import React from "react";
import { replace } from "react-router-dom";
export default function AuthInitializer({ children }) {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/sessions/online`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data?.user) {
          login(data.user);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return children;
}
