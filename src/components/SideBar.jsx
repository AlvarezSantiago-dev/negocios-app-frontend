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
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";

export default function Sidebar({ mobileOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const businessType = useAuthStore((s) => s.business?.businessType);
  const isApparel = businessType === "apparel";

  const links = [
    {
      to: "/",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      color: "blue",
    },
    {
      to: "/ventas",
      label: "Ventas",
      icon: <ShoppingCart size={20} />,
      color: "green",
    },
    {
      to: "/productos",
      label: isApparel ? "Prendas" : "Productos",
      icon: <Package size={20} />,
      color: "purple",
    },
    {
      to: "/informes",
      label: "Informes",
      icon: <BarChart size={20} />,
      color: "orange",
    },
  ];

  const cajaLinks = [
    { to: "/caja", label: "Movimientos", icon: <Wallet size={20} /> },
    { to: "/cierres", label: "Historial", icon: <History size={20} /> },
  ];

  const getActiveClasses = (color, isActive) => {
    if (isActive) {
      const gradients = {
        blue: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50",
        green:
          "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50",
        purple:
          "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/50",
        orange:
          "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50",
        default:
          "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/50",
      };
      return gradients[color] || gradients.default;
    }
    return "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:shadow-md";
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white/95 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Panel
                </h1>
                <p className="text-xs text-gray-500">Gestión</p>
              </div>
            </motion.div>
          )}

          {/* Desktop collapse */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed((v) => !v)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Colapsar sidebar"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </motion.button>

          {/* Mobile close */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Links */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {links.map(({ to, label, icon, color }, index) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${getActiveClasses(
                  color,
                  isActive
                )}`
              }
            >
              {({ isActive }) => (
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 w-full"
                >
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {icon}
                  </motion.div>
                  {!collapsed && <span className="font-medium">{label}</span>}
                  {!collapsed && isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 rounded-full bg-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Caja Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs uppercase text-gray-500 font-semibold mb-2 px-3"
            >
              Caja
            </motion.p>
          )}

          <div className="space-y-1">
            {cajaLinks.map(({ to, label, icon }, index) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${getActiveClasses(
                    "default",
                    isActive
                  )}`
                }
              >
                {({ isActive }) => (
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: (links.length + index) * 0.05 }}
                    className="flex items-center gap-3 w-full"
                  >
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {icon}
                    </motion.div>
                    {!collapsed && <span className="font-medium">{label}</span>}
                    {!collapsed && isActive && (
                      <motion.div
                        layoutId="activeIndicatorCaja"
                        className="ml-auto w-2 h-2 rounded-full bg-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-gray-200"
        >
          <div className="text-xs text-gray-500 text-center">
            <p className="font-semibold">Sistema de Gestión</p>
            <p className="mt-1">© 2026</p>
          </div>
        </motion.div>
      )}
    </div>
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
