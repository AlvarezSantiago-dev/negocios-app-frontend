import { useEffect, useState } from "react";
import useProductsStore from "../store/productsStore";
import ProductosTable from "../components/ProductosTable";
import ProductoFormModal from "../components/ProductoFormModal";
import PrintBarcodeModal from "@/components/PrintBarcodeModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

import useBarcodeScanner from "@/hooks/useBarcodeScanner";

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

  // estados impresión
  const [printProduct, setPrintProduct] = useState(null);
  const [openPrint, setOpenPrint] = useState(false);

  const filtered = products.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔧 SCAN EN PANTALLA PRODUCTOS
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

  // 🔧 scanner SOLO activo cuando el modal está cerrado
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

      // 🔧 LIMPIEZA TOTAL POST GUARDADO
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
    setEditing(null); // 🔧 MUY IMPORTANTE
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Productos</h1>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="bg-[#63b0cd] hover:bg-[#559bb4] text-white"
            onClick={() => {
              setEditing(null);
              setOpenModal(true);
            }}
          >
            Nuevo Producto
          </Button>
        </motion.div>
      </div>

      {/* BUSCADOR */}
      <div className="max-w-xs">
        <div className="flex items-center bg-white rounded-xl shadow-md border border-gray-100 p-2 gap-2">
          <Search size={18} className="text-gray-400" />
          <Input
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none shadow-none focus:ring-0"
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
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

      {/* MODAL PRODUCTO */}
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

      {/* MODAL IMPRESIÓN */}
      <PrintBarcodeModal
        open={openPrint}
        onClose={() => {
          setOpenPrint(false);
          setPrintProduct(null);
        }}
        product={printProduct}
      />
    </div>
  );
}
