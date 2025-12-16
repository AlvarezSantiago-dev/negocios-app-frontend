import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "@/components/SideBar";
import NavBar from "@/components/NavBar";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <SideBar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-col flex-1">
        <NavBar onMenu={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
