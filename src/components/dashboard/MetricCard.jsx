import React from "react";
import { motion } from "framer-motion";

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend,
  badge,
}) {
  const colorSchemes = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-600",
      icon: "bg-blue-100 text-blue-600",
    },
    green: {
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50",
      text: "text-green-600",
      icon: "bg-green-100 text-green-600",
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      text: "text-purple-600",
      icon: "bg-purple-100 text-purple-600",
    },
    orange: {
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      text: "text-orange-600",
      icon: "bg-orange-100 text-orange-600",
    },
    red: {
      gradient: "from-red-500 to-red-600",
      bg: "bg-red-50",
      text: "text-red-600",
      icon: "bg-red-100 text-red-600",
    },
    indigo: {
      gradient: "from-indigo-500 to-indigo-600",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      icon: "bg-indigo-100 text-indigo-600",
    },
  };

  const scheme = colorSchemes[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group"
    >
      {/* Barra superior con gradiente */}
      <div className={`h-1.5 bg-gradient-to-r ${scheme.gradient}`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${scheme.bg} ${scheme.text} font-semibold`}
                >
                  {badge}
                </span>
              )}
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>

          {/* Icono */}
          <div
            className={`p-3 rounded-xl ${scheme.icon} group-hover:scale-110 transition-transform`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>

        {/* Trend indicator */}
        {trend && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trend.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>{trend.positive ? "↑" : "↓"}</span>
              <span>{trend.value}</span>
            </div>
            <span className="text-xs text-gray-500">{trend.label}</span>
          </div>
        )}
      </div>

      {/* Efecto de brillo al hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
    </motion.div>
  );
}
