// src/components/NavBar.jsx
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutService } from "@/services/sessionsService";
import useAuthStore from "@/store/authStore";

export default function NavBar({ onMenu }) {
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logoutService();
    logout();
  };

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      {/* Mobile menu */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenu}
        className="md:hidden"
        aria-label="Abrir menú"
      >
        <Menu />
      </Button>

      <div className="flex-1" />

      <Button variant="destructive" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </header>
  );
}
