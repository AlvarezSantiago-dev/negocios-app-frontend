// src/components/Sidebar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart,
  Wallet,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Sidebar({ mobileOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/ventas", label: "Ventas", icon: <ShoppingCart size={20} /> },
    { to: "/productos", label: "Productos", icon: <Package size={20} /> },
    { to: "/informes", label: "Informes", icon: <BarChart size={20} /> },
  ];

  const sidebarContent = (
    <Card className="h-full p-3 flex flex-col rounded-none border-none bg-white">
      {/* Header */}
      <div className="relative mb-4 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold">Panel</h1>}

        {/* Desktop collapse */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((v) => !v)}
          className="hidden md:flex"
          aria-label="Colapsar sidebar"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>

        {/* Mobile close */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden"
          aria-label="Cerrar menú"
        >
          <X />
        </Button>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg transition-colors
              ${isActive ? "bg-blue-200 text-blue-900" : "hover:bg-blue-100"}`
            }
          >
            {icon}
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {/* Caja */}
        <div className="mt-6">
          {!collapsed && (
            <p className="text-xs uppercase text-gray-500 mb-2">Caja</p>
          )}

          <NavLink
            to="/caja"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg
              ${isActive ? "bg-blue-200 text-blue-900" : "hover:bg-blue-100"}`
            }
          >
            <Wallet size={20} />
            {!collapsed && "Movimientos"}
          </NavLink>

          <NavLink to="/cierres" onClick={onClose}>
            <Button className="w-full justify-start mt-1 gap-3">
              <BarChart size={20} />
              {!collapsed && "Ver cierres"}
            </Button>
          </NavLink>
        </div>
      </nav>
    </Card>
  );

  return (
    <>
      {/* Desktop */}
      <motion.aside
        className="hidden md:flex border-r bg-white"
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.25 }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 md:hidden"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25 }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
