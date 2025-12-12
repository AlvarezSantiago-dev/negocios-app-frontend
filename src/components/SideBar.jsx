// src/components/Sidebar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed((v) => !v);

  const links = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/ventas", label: "Ventas", icon: <ShoppingCart size={20} /> },
    { to: "/productos", label: "Productos", icon: <Package size={20} /> },
    { to: "/informes", label: "Informes", icon: <BarChart size={20} /> },
    { to: "/test", label: "Test Scanner", icon: <BarChart size={20} /> },
  ];

  return (
    <motion.aside
      className="min-h-screen border-r shadow-sm bg-white flex flex-col"
      initial={{ width: 240 }}
      animate={{ width: collapsed ? 70 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      role="navigation"
      aria-label="Barra lateral principal"
    >
      <Card className="flex-1 p-3 flex flex-col overflow-auto rounded-none border-none">
        {/* HEADER */}
        <div className="relative mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full shadow"
            onClick={toggle}
            aria-label={
              collapsed ? "Expandir menú lateral" : "Colapsar menú lateral"
            }
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>

          {!collapsed && <h1 className="text-2xl font-bold pl-1">Panel</h1>}
        </div>

        {/* LINKS */}
        <nav className="flex flex-col gap-1 flex-1">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition-colors
                 outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                 ${
                   isActive ? "bg-blue-200 text-blue-900" : "hover:bg-blue-100"
                 }`
              }
            >
              {icon}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}

          {/* CAJA */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2 pl-1 text-gray-500 uppercase text-xs font-semibold">
              <Wallet size={18} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    Caja
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-1">
              <NavLink
                to="/caja"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition-colors
                   outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                   ${
                     isActive
                       ? "bg-blue-200 text-blue-900"
                       : "hover:bg-blue-100"
                   }`
                }
              >
                <Wallet size={20} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      Movimientos
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>

              <NavLink to="/cierres">
                <Button
                  variant="default"
                  className={`w-full justify-start rounded-lg flex items-center gap-3 ${
                    collapsed ? "px-2" : ""
                  }`}
                >
                  <BarChart size={20} />
                  {!collapsed && "Ver cierres"}
                </Button>
              </NavLink>
            </div>
          </div>
        </nav>
      </Card>
    </motion.aside>
  );
}
