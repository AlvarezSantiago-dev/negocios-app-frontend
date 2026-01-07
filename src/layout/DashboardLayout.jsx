import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import SideBar from "@/components/SideBar";
import NavBar from "@/components/NavBar";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden">
      <SideBar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-col flex-1">
        <NavBar onMenu={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-auto p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
