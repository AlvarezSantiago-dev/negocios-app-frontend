import { motion } from "framer-motion";
import {
  Wallet,
  ShoppingCart,
  XCircle,
  Package,
  BarChart2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccesosRapidos() {
  const navigate = useNavigate();

  const accesos = [
    { label: "Caja", icon: Wallet, to: "/caja" },
    { label: "Generar Venta", icon: ShoppingCart, to: "/ventas" },
    { label: "Gestionar productos", icon: Package, to: "/products" },
    { label: "Movimientos", icon: BarChart2, to: "/caja" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-white/40"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Accesos rápidos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accesos.map((a, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(a.to)}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl 
              bg-[#63b0cd] text-white font-medium shadow-md hover:bg-[#559bb4]"
          >
            <a.icon size={22} />
            {a.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
