import React from "react";
import { Button } from "@/components/ui/button";
import { logoutService } from "../services/sessionsService";
import useAuthStore from "../store/authStore";

export default function NavBar() {
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logoutService();
    logout();
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-end">
      <Button variant="destructive" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </header>
  );
}
