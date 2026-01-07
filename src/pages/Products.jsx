import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Package,
  TrendingUp,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Barcode,
} from "lucide-react";
import useProductsStore from "../store/productsStore";
import ProductosTable from "../components/ProductosTable";
import ProductoFormModal from "../components/ProductoFormModal";
import PrintBarcodeModal from "@/components/PrintBarcodeModal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import useBarcodeScanner from "@/hooks/useBarcodeScanner";
import { formatMoney } from "@/services/dashboardService";

// Componente de Estadística
function StatCard({ label, value, icon: Icon, color, subtitle }) {
  const colors = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      icon: "bg-blue-100 text-blue-600",
    },
    green: {
      gradient: "from-green-500 to-green-600",
      icon: "bg-green-100 text-green-600",
    },
    orange: {
      gradient: "from-orange-500 to-orange-600",
      icon: "bg-orange-100 text-orange-600",
    },
    red: {
      gradient: "from-red-500 to-red-600",
      icon: "bg-red-100 text-red-600",
    },
  };

  const scheme = colors[color] || colors.blue;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className={`h-1.5 bg-gradient-to-r ${scheme.gradient}`} />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${scheme.icon}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Componente de Botón de Acción
function ActionButton({
  onClick,
  disabled,
  variant = "primary",
  children,
  icon: Icon,
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
    secondary:
      "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
}

export default function Productos() {
  const {
    products,
    fetchProducts,
    addProduct,
    removeProduct,
    updateProduct,
    loading,
  } = useProductsStore();

  const { toast } = useToast();

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [printProduct, setPrintProduct] = useState(null);
  const [openPrint, setOpenPrint] = useState(false);

  const filtered = products.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  // SCAN EN PANTALLA PRODUCTOS
  const onScan = (codigo) => {
    const existente = products.find((p) => p.codigoBarras === codigo);

    if (existente) {
      setEditing(existente);
    } else {
      setEditing({
        codigoBarras: codigo,
        tipo: "unitario",
        categoria: "general",
      });
    }

    setOpenModal(true);
  };

  // Scanner SOLO activo cuando el modal está cerrado
  useBarcodeScanner({
    onScan,
    enabled: !openModal,
    interCharTimeout: 60,
  });

  const handleSubmit = async (data) => {
    try {
      if (editing && editing._id) {
        await updateProduct(editing._id, data);
        toast({
          title: "Producto actualizado",
          description: `${data.nombre} fue modificado correctamente.`,
        });
      } else {
        await addProduct(data);
        toast({
          title: "Producto creado",
          description: `${data.nombre} fue agregado correctamente.`,
        });
      }

      setOpenModal(false);
      setEditing(null);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar.",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeProduct(id);
      toast({
        title: "Producto eliminado",
        description: "El producto fue eliminado.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar.",
      });
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditing(null);
  };

  // Calcular estadísticas
  const totalProductos = products.length;
  const stockCritico = products.filter((p) => p.stock <= p.stockMinimo).length;
  const valorInventario = products.reduce(
    (acc, p) => acc + p.precioCompra * p.stock,
    0
  );
  const gananciaPotencial = products.reduce(
    (acc, p) => acc + (p.precioVenta - p.precioCompra) * p.stock,
    0
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Cargando productos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📦 Gestión de Productos
            </h1>
            <p className="text-gray-600">
              Administra tu inventario y controla el stock
            </p>
          </div>

          <div className="flex gap-3">
            <ActionButton
              onClick={fetchProducts}
              icon={RefreshCw}
              variant="secondary"
            >
              Actualizar
            </ActionButton>
            <ActionButton
              onClick={() => {
                setEditing(null);
                setOpenModal(true);
              }}
              icon={Plus}
              variant="primary"
            >
              Nuevo Producto
            </ActionButton>
          </div>
        </motion.div>

        {/* SCANNER INFO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg border border-blue-100 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100">
              <Barcode className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                Escáner de Código de Barras Activo
              </p>
              <p className="text-sm text-gray-600">
                Escanea un producto para editarlo o crear uno nuevo
              </p>
            </div>
          </div>
        </motion.div>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Productos"
            value={totalProductos}
            icon={Package}
            color="blue"
            subtitle="En inventario"
          />
          <StatCard
            label="Stock Crítico"
            value={stockCritico}
            icon={AlertTriangle}
            color="red"
            subtitle="Requieren reposición"
          />
          <StatCard
            label="Valor Inventario"
            value={`$${formatMoney(valorInventario)}`}
            icon={TrendingUp}
            color="green"
            subtitle="Costo de compra"
          />
          <StatCard
            label="Ganancia Potencial"
            value={`$${formatMoney(gananciaPotencial)}`}
            icon={TrendingUp}
            color="orange"
            subtitle="Si se vende todo"
          />
        </div>

        {/* BUSCADOR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar producto por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 py-6 rounded-xl shadow-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          {search && (
            <p className="text-sm text-gray-600 mt-2">
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""}{" "}
              encontrado{filtered.length !== 1 ? "s" : ""}
            </p>
          )}
        </motion.div>

        {/* TABLA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">
              📋 Lista de Productos
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""}{" "}
              {search ? "filtrado" : "registrado"}
              {filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="p-6">
            <ProductosTable
              products={filtered}
              loading={loading}
              onEdit={(p) => {
                setEditing(p);
                setOpenModal(true);
              }}
              onDelete={handleDelete}
            />
          </div>
        </motion.div>

        {/* MODALES */}
        <ProductoFormModal
          open={openModal}
          onClose={closeModal}
          onSubmit={handleSubmit}
          initialData={editing}
          onPrint={(producto) => {
            setPrintProduct(producto);
            setOpenPrint(true);
          }}
        />

        <PrintBarcodeModal
          open={openPrint}
          onClose={() => {
            setOpenPrint(false);
            setPrintProduct(null);
          }}
          product={printProduct}
        />
      </div>
    </div>
  );
}
