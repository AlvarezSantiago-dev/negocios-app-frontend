import { motion } from "framer-motion";

export default function KPICard({ children }) {
  return (
    <motion.div
      className="rounded-2xl bg-white/80 backdrop-blur shadow-md p-5 border border-white/40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
